import { supabase, formatMoney, formatDateTime, orderTotal } from './supabase.js'

const STATUS_ORDER = ['Aguardando pagamento no caixa', 'Recebido', 'Em preparo', 'Pronto', 'Entregue', 'Pago no caixa']
let allOrders = []

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
  return order.items_json || []
}

function render() {
  const statusFilter = document.getElementById('statusFilter').value
  const search = document.getElementById('searchCustomer').value.trim().toLowerCase()

  let items = allOrders.filter(order => (order.payment_status || 'Aguardando pagamento no caixa') !== 'Pago no caixa')
  if (statusFilter !== 'all') items = items.filter(order => (order.payment_status || 'Aguardando pagamento no caixa') === statusFilter)
  if (search) items = items.filter(order => (order.customer_name || '').toLowerCase().includes(search))

  const target = document.getElementById('ordersList')
  if (!items.length) {
    target.innerHTML = '<div class="empty">Nenhum pedido encontrado com esse filtro.</div>'
    return
  }

  target.innerHTML = items.map(order => {
    const currentStatus = order.payment_status || 'Aguardando pagamento no caixa'
    const canGoCash = currentStatus === 'Entregue'

    return `
      <article class="order-card">
        <div class="order-top">
          <div>
            <span class="eyebrow">Cliente</span>
            <h3>${order.customer_name || 'Sem nome'}</h3>
          </div>
          <span class="status-pill">${currentStatus}</span>
        </div>

        <div class="order-meta">
          <span><strong>Data:</strong> ${formatDateTime(order.created_at)}</span>
          <span><strong>Pagamento:</strong> ${order.payment_method || 'Pagamento no caixa'}</span>
        </div>

        <div class="order-items">
          ${getItems(order).map(item => `${item.name} (${item.quantity})`).join('<br>') || '-'}
        </div>

        <div class="order-total"><strong>Total:</strong> ${formatMoney(orderTotal(order))}</div>

        <div class="order-actions">
          <button class="action-btn btn-dark" data-action="advance" data-id="${order.id}">Avançar</button>
          <button class="action-btn btn-light" data-action="back" data-id="${order.id}">Voltar</button>
          <button class="action-btn btn-light" data-action="delivered" data-id="${order.id}">Marcar entregue</button>
          <button class="action-btn btn-accent" data-action="paid" data-id="${order.id}" ${canGoCash ? '' : 'disabled'}>${canGoCash ? 'Ir para o caixa' : 'Pagamento por último'}</button>
        </div>
      </article>
    `
  }).join('')
}

async function loadOrders() {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  allOrders = data || []
}

async function changeStatus(id, action) {
  const order = allOrders.find(item => item.id === id)
  if (!order) return

  const current = order.payment_status || 'Aguardando pagamento no caixa'
  let next = current

  if (action === 'advance') next = nextStatus(current)
  if (action === 'back') next = prevStatus(current)
  if (action === 'delivered') next = 'Entregue'
  if (action === 'paid' && current === 'Entregue') {
    localStorage.setItem('bendito-cash-order-id', id)
    window.location.href = 'caixa.html'
    return
  }

  const { error } = await supabase
    .from('orders')
    .update({ payment_status: next })
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
  if (btn && !btn.disabled) await changeStatus(btn.dataset.id, btn.dataset.action)

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

loadOrders().then(render).catch(error => {
  console.error(error)
  alert('Não foi possível carregar os pedidos. Confira login, policies e chave pública.')
})
