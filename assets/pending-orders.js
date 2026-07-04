import { supabase, formatMoney, formatDateTime, orderTotal, escapeHTML, safeAttr, normalizeOrderItems, subscribeToTable } from './supabase.js'

const STATUS_ORDER = ['Aguardando pagamento no caixa', 'Recebido', 'Em preparo', 'Pronto', 'Entregue', 'Pago no caixa']
let allOrders = []
let isLoading = false

function nextStatus(current) {
  const i = STATUS_ORDER.indexOf(current)
  if (i === -1) return STATUS_ORDER[0]
  if (current === 'Entregue') return 'Entregue'
  if (i >= STATUS_ORDER.length - 1) return current
  return STATUS_ORDER[i + 1]
}

function prevStatus(current) {
  const i = STATUS_ORDER.indexOf(current)
  if (i <= 0) return STATUS_ORDER[0]
  if (current === 'Pago no caixa') return 'Entregue'
  return STATUS_ORDER[i - 1]
}

function getItems(order) {
  return normalizeOrderItems(order)
}

function statusCounts() {
  return allOrders.reduce((acc, order) => {
    const status = order.payment_status || STATUS_ORDER[0]
    acc[status] = (acc[status] || 0) + 1
    acc.all = (acc.all || 0) + 1
    return acc
  }, { all: 0 })
}

function renderShortcuts() {
  const counts = statusCounts()
  document.querySelectorAll('[data-filter]').forEach(button => {
    const filter = button.dataset.filter
    const base = button.dataset.label || button.textContent.replace(/\s+\d+$/, '').trim()
    button.dataset.label = base
    button.textContent = `${base} ${counts[filter] || 0}`
  })
}

function render() {
  const statusFilter = document.getElementById('statusFilter').value
  const search = document.getElementById('searchCustomer').value.trim().toLowerCase()
  const target = document.getElementById('ordersList')

  renderShortcuts()

  if (isLoading) {
    target.innerHTML = '<div class="empty">Carregando pedidos...</div>'
    return
  }

  let items = allOrders.filter(order => (order.payment_status || STATUS_ORDER[0]) !== 'Pago no caixa')
  if (statusFilter !== 'all') items = items.filter(order => (order.payment_status || STATUS_ORDER[0]) === statusFilter)
  if (search) items = items.filter(order => (order.customer_name || '').toLowerCase().includes(search) || (order.customer_phone || '').includes(search))

  if (!items.length) {
    target.innerHTML = '<div class="empty">Nenhum pedido encontrado com esse filtro.</div>'
    return
  }

  target.innerHTML = items.map(order => {
    const currentStatus = order.payment_status || STATUS_ORDER[0]
    const canGoCash = currentStatus === 'Entregue'
    const orderItems = getItems(order)
    const customerPhone = order.customer_phone ? `<span><strong>Telefone:</strong> ${escapeHTML(order.customer_phone)}</span>` : ''
    const note = order.order_note ? `<div class="order-note"><strong>Obs.:</strong> ${escapeHTML(order.order_note)}</div>` : ''

    return `
      <article class="order-card">
        <div class="order-top">
          <div>
            <span class="eyebrow">Cliente</span>
            <h3>${escapeHTML(order.customer_name || 'Sem nome')}</h3>
          </div>
          <span class="status-pill">${escapeHTML(currentStatus)}</span>
        </div>

        <div class="order-meta">
          <span><strong>Data:</strong> ${escapeHTML(formatDateTime(order.created_at))}</span>
          ${customerPhone}
          <span><strong>Pagamento:</strong> ${escapeHTML(order.payment_method || 'Pagamento no caixa')}</span>
        </div>

        <div class="order-items">
          ${orderItems.map(item => `${escapeHTML(item.name)} (${escapeHTML(item.quantity)})`).join('<br>') || '-'}
        </div>
        ${note}

        <div class="order-total"><strong>Total:</strong> ${formatMoney(orderTotal(order))}</div>

        <div class="order-actions">
          <button class="action-btn btn-dark" data-action="advance" data-id="${safeAttr(order.id)}">Avançar</button>
          <button class="action-btn btn-light" data-action="back" data-id="${safeAttr(order.id)}">Voltar</button>
          <button class="action-btn btn-light" data-action="delivered" data-id="${safeAttr(order.id)}">Marcar entregue</button>
          <button class="action-btn btn-accent" data-action="paid" data-id="${safeAttr(order.id)}" ${canGoCash ? '' : 'disabled'}>${canGoCash ? 'Ir para o caixa' : 'Pagamento por último'}</button>
        </div>
      </article>
    `
  }).join('')
}

async function loadOrders() {
  isLoading = true
  render()

  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })

  isLoading = false
  if (error) throw error
  allOrders = data || []
}

async function changeStatus(id, action) {
  const order = allOrders.find(item => item.id === id)
  if (!order) return

  const current = order.payment_status || STATUS_ORDER[0]
  let next = current

  if (action === 'advance') next = nextStatus(current)
  if (action === 'back') next = prevStatus(current)
  if (action === 'delivered') next = 'Entregue'
  if (action === 'paid' && current === 'Entregue') {
    localStorage.setItem('bendito-cash-order-id', id)
    window.location.href = 'caixa.html'
    return
  }

  if (next === current) return

  const { error } = await supabase
    .from('orders')
    .update({ payment_status: next, status_updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) {
    console.error(error)
    alert('Não foi possível atualizar o status.')
    return
  }

  await loadOrders()
  render()
}

document.addEventListener('click', async event => {
  const btn = event.target.closest('[data-action]')
  if (btn && !btn.disabled) {
    btn.disabled = true
    await changeStatus(btn.dataset.id, btn.dataset.action)
    btn.disabled = false
  }

  const shortcut = event.target.closest('[data-filter]')
  if (shortcut) {
    document.querySelectorAll('.shortcut').forEach(el => el.classList.remove('active'))
    shortcut.classList.add('active')
    document.getElementById('statusFilter').value = shortcut.dataset.filter
    render()
  }

  if (event.target.matches('#logoutButton')) {
    await supabase.auth.signOut()
    window.location.href = 'painel-login.html'
  }
})

document.getElementById('statusFilter')?.addEventListener('change', render)
document.getElementById('searchCustomer')?.addEventListener('input', render)

loadOrders().then(() => {
  render()
  subscribeToTable('orders', async () => {
    await loadOrders()
    render()
  })
}).catch(error => {
  console.error(error)
  alert('Não foi possível carregar os pedidos. Confira login, policies e chave pública.')
})
