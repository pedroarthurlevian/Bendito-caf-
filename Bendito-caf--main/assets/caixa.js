import { supabase, formatMoney, formatDateTime, orderTotal, escapeHTML, safeAttr, subscribeToTable } from './supabase.js'

const money = formatMoney
let allOrders = []
let cashEntries = []
let submitting = false

function getOpenOrders() {
  return allOrders.filter(order => (order.payment_status || 'Aguardando pagamento no caixa') === 'Entregue')
}

function setFeedback(message, isError = false) {
  const feedback = document.getElementById('cashFeedback')
  feedback.textContent = message
  feedback.classList.toggle('is-error', isError)
}

function renderOrderOptions() {
  const select = document.getElementById('orderSelect')
  const openOrders = getOpenOrders()

  if (!openOrders.length) {
    select.innerHTML = '<option value="">Nenhum pedido entregue aguardando caixa</option>'
    fillOrderData('')
    return
  }

  select.innerHTML = openOrders.map(order => `
    <option value="${safeAttr(order.id)}">${escapeHTML(order.customer_name || 'Sem nome')} • ${money(orderTotal(order))}</option>
  `).join('')

  const preselected = localStorage.getItem('bendito-cash-order-id')
  if (preselected && openOrders.some(order => order.id === preselected)) {
    select.value = preselected
    localStorage.removeItem('bendito-cash-order-id')
  }

  fillOrderData(select.value)
}

function fillOrderData(orderId) {
  const order = allOrders.find(item => item.id === orderId)
  const customerName = document.getElementById('customerName')
  const orderTotalInput = document.getElementById('orderTotal')
  const amountPaid = document.getElementById('amountPaid')

  if (!order) {
    customerName.value = ''
    orderTotalInput.value = ''
    amountPaid.value = ''
    calculateChange()
    return
  }

  const total = orderTotal(order)
  customerName.value = order.customer_name || ''
  orderTotalInput.value = money(total)
  amountPaid.value = total.toFixed(2)
  calculateChange()
}

function calculateChange() {
  const paymentMethod = document.getElementById('paymentMethod').value
  const orderId = document.getElementById('orderSelect').value
  const order = allOrders.find(item => item.id === orderId)
  const changeEl = document.getElementById('changeValue')

  if (!order) {
    changeEl.value = money(0)
    return
  }

  const total = orderTotal(order)
  const paid = Number(document.getElementById('amountPaid').value || 0)

  if (paymentMethod !== 'Dinheiro') {
    changeEl.value = money(0)
    return
  }

  changeEl.value = money(Math.max(0, paid - total))
}

function renderCashSummary() {
  const totals = { PIX: 0, Cartão: 0, Dinheiro: 0, Troco: 0 }

  cashEntries.forEach(entry => {
    const method = entry.payment_method || 'Dinheiro'
    const amount = Number(entry.amount_paid || 0)

    if (method === 'PIX') totals.PIX += amount
    else if (method === 'Cartão') totals.Cartão += amount
    else totals.Dinheiro += amount

    totals.Troco += Number(entry.change_given || 0)
  })

  document.getElementById('pixTotal').textContent = money(totals.PIX)
  document.getElementById('cardTotal').textContent = money(totals.Cartão)
  document.getElementById('cashTotal').textContent = money(totals.Dinheiro)
  document.getElementById('changeTotal').textContent = money(totals.Troco)

  document.getElementById('cashEntriesList').innerHTML = cashEntries.length ? cashEntries.slice(0, 10).map(entry => `
    <div class="list-card">
      <strong>${escapeHTML(entry.customer_name || 'Sem nome')} • ${escapeHTML(entry.payment_method || '-')}</strong>
      <span>${escapeHTML(formatDateTime(entry.created_at))}</span>
      <span>Total do pedido: ${money(Number(entry.order_total || 0))}</span>
      <span>Valor recebido: ${money(Number(entry.amount_paid || 0))}</span>
      <small>Troco: ${money(Number(entry.change_given || 0))}${entry.note ? ' • ' + escapeHTML(entry.note) : ''}</small>
    </div>
  `).join('') : '<div class="list-card"><strong>Nenhum lançamento</strong><span>Ainda não há pagamentos registrados no caixa.</span></div>'
}

async function loadData() {
  const [ordersRes, cashRes] = await Promise.all([
    supabase.from('orders').select('*').order('created_at', { ascending: false }),
    supabase.from('cash_entries').select('*').order('created_at', { ascending: false })
  ])

  if (ordersRes.error) throw ordersRes.error
  if (cashRes.error) throw cashRes.error

  allOrders = ordersRes.data || []
  cashEntries = cashRes.data || []

  renderOrderOptions()
  renderCashSummary()
}

document.getElementById('orderSelect')?.addEventListener('change', e => fillOrderData(e.target.value))
document.getElementById('paymentMethod')?.addEventListener('change', calculateChange)
document.getElementById('amountPaid')?.addEventListener('input', calculateChange)

document.getElementById('cashForm')?.addEventListener('submit', async event => {
  event.preventDefault()
  if (submitting) return

  const orderId = document.getElementById('orderSelect').value
  const order = allOrders.find(item => item.id === orderId)
  const submitButton = event.target.querySelector('button[type="submit"]')

  if (!order) {
    setFeedback('Selecione um pedido entregue para registrar o pagamento.', true)
    return
  }

  const paymentMethod = document.getElementById('paymentMethod').value
  const amountPaid = Number(document.getElementById('amountPaid').value || 0)
  const total = orderTotal(order)

  if (amountPaid <= 0) {
    setFeedback('Informe o valor recebido no caixa.', true)
    return
  }

  if (amountPaid < total) {
    setFeedback('O valor recebido não pode ser menor que o total do pedido.', true)
    return
  }

  const changeGiven = paymentMethod === 'Dinheiro' ? Math.max(0, amountPaid - total) : 0

  submitting = true
  submitButton.disabled = true
  submitButton.textContent = 'Registrando...'

  const { data: existingEntries, error: existingError } = await supabase
    .from('cash_entries')
    .select('id')
    .eq('order_id', orderId)
    .limit(1)

  if (existingError) {
    console.error(existingError)
    setFeedback('Não foi possível conferir se esse pedido já foi pago.', true)
    submitting = false
    submitButton.disabled = false
    submitButton.textContent = 'Confirmar no caixa'
    return
  }

  if (existingEntries?.length) {
    setFeedback('Esse pedido já tem pagamento registrado no caixa.', true)
    submitting = false
    submitButton.disabled = false
    submitButton.textContent = 'Confirmar no caixa'
    await loadData()
    return
  }

  const { error: cashError } = await supabase.from('cash_entries').insert([{
    order_id: orderId,
    customer_name: order.customer_name || '',
    payment_method: paymentMethod,
    order_total: total,
    amount_paid: amountPaid,
    change_given: changeGiven,
    note: document.getElementById('cashNote').value.trim().slice(0, 280)
  }])

  if (cashError) {
    console.error(cashError)
    setFeedback('Não foi possível registrar o pagamento.', true)
    submitting = false
    submitButton.disabled = false
    submitButton.textContent = 'Confirmar no caixa'
    return
  }

  const { error: orderError } = await supabase.from('orders').update({
    payment_method: paymentMethod,
    payment_status: 'Pago no caixa',
    amount_paid: amountPaid,
    change_given: changeGiven,
    status_updated_at: new Date().toISOString()
  }).eq('id', orderId)

  submitting = false
  submitButton.disabled = false
  submitButton.textContent = 'Confirmar no caixa'

  if (orderError) {
    console.error(orderError)
    setFeedback('Pagamento registrado, mas não foi possível atualizar o pedido.', true)
    return
  }

  setFeedback('Pagamento registrado com sucesso no Supabase.')
  event.target.reset()
  await loadData()
})

document.getElementById('logoutButton')?.addEventListener('click', async () => {
  await supabase.auth.signOut()
  window.location.href = 'painel-login.html'
})

loadData().then(() => {
  ;['orders', 'cash_entries'].forEach(table => {
    subscribeToTable(table, () => loadData().catch(console.error))
  })
}).catch(error => {
  console.error(error)
  alert('Não foi possível carregar o caixa. Confira login, policies e chave pública.')
})
