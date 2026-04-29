import { supabase, formatMoney, formatDateTime, monthKey, monthLabel } from './supabase.js'

const money = formatMoney

function isToday(value) {
  const date = new Date(value)
  const now = new Date()
  return date.toDateString() === now.toDateString()
}

function getItems(order) {
  return order.items_json || []
}

function getTopItems(orders) {
  const map = new Map()
  orders.forEach(order => {
    getItems(order).forEach(item => {
      map.set(item.name, (map.get(item.name) || 0) + Number(item.quantity || 0))
    })
  })
  return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5)
}

function getMonthlyMap(cashEntries) {
  const map = new Map()
  cashEntries.forEach(entry => {
    const key = monthKey(entry.created_at)
    if (!key) return
    map.set(key, (map.get(key) || 0) + Number(entry.order_total || 0))
  })
  return map
}

function buildMonthSelectors(monthMap) {
  const main = document.getElementById('mainMonthSelect')
  const compare = document.getElementById('compareMonthSelect')
  const keys = [...monthMap.keys()].sort().reverse()

  if (!keys.length) {
    main.innerHTML = '<option value="">Sem dados</option>'
    compare.innerHTML = '<option value="">Sem dados</option>'
    return
  }

  const currentMain = main.value
  const currentCompare = compare.value

  main.innerHTML = keys.map(key => `<option value="${key}">${monthLabel(key)}</option>`).join('')
  compare.innerHTML = '<option value="">Não comparar</option>' + keys.map(key => `<option value="${key}">${monthLabel(key)}</option>`).join('')

  main.value = keys.includes(currentMain) ? currentMain : keys[0]
  compare.value = keys.includes(currentCompare) ? currentCompare : (keys[1] || '')
}

function renderMonthlyFinance(monthMap) {
  buildMonthSelectors(monthMap)

  const mainKey = document.getElementById('mainMonthSelect').value
  const compareKey = document.getElementById('compareMonthSelect').value

  const mainRevenue = monthMap.get(mainKey) || 0
  const compareRevenue = monthMap.get(compareKey) || 0
  const difference = mainRevenue - compareRevenue

  document.getElementById('mainMonthRevenue').textContent = money(mainRevenue)
  document.getElementById('compareMonthRevenue').textContent = compareKey ? money(compareRevenue) : '—'

  const diffEl = document.getElementById('monthDifference')
  diffEl.textContent = compareKey ? money(difference) : '—'
  diffEl.classList.remove('positive', 'negative')
  if (compareKey) {
    if (difference > 0) diffEl.classList.add('positive')
    if (difference < 0) diffEl.classList.add('negative')
  }

  document.getElementById('monthlyBreakdown').innerHTML = [
    ['Mês principal', mainKey ? monthLabel(mainKey) : '-'],
    ['Total do mês principal', money(mainRevenue)],
    ['Mês comparado', compareKey ? monthLabel(compareKey) : 'Não selecionado'],
    ['Total do mês comparado', compareKey ? money(compareRevenue) : '—']
  ].map(([label, value]) => `
    <div class="summary-row">
      <span>${label}</span>
      <strong>${value}</strong>
    </div>
  `).join('')
}

function renderCashSummary(entries) {
  const totals = { PIX: 0, Cartão: 0, Dinheiro: 0, Troco: 0 }

  entries.forEach(entry => {
    const method = entry.payment_method || 'Dinheiro'
    const amount = Number(entry.amount_paid || 0)

    if (method === 'PIX') totals.PIX += amount
    else if (method === 'Cartão') totals.Cartão += amount
    else totals.Dinheiro += amount

    totals.Troco += Number(entry.change_given || 0)
  })

  document.getElementById('cashFlowSummary').innerHTML = Object.entries(totals).map(([label, value]) => `
    <div class="list-card">
      <strong>${label}</strong>
      <span>${money(value)}</span>
    </div>
  `).join('')
}

async function loadData() {
  const [ordersRes, reservationsRes, cashRes] = await Promise.all([
    supabase.from('orders').select('*').order('created_at', { ascending: false }),
    supabase.from('reservations').select('*').order('created_at', { ascending: false }),
    supabase.from('cash_entries').select('*').order('created_at', { ascending: false })
  ])

  if (ordersRes.error) throw ordersRes.error
  if (reservationsRes.error) throw reservationsRes.error
  if (cashRes.error) throw cashRes.error

  return {
    orders: ordersRes.data || [],
    reservations: reservationsRes.data || [],
    cashEntries: cashRes.data || []
  }
}

async function render() {
  const { orders, reservations, cashEntries } = await loadData()

  const pending = orders.filter(o => !['Entregue', 'Pago no caixa'].includes(o.payment_status || 'Aguardando pagamento no caixa'))
  const ordersToday = orders.filter(o => isToday(o.created_at))
  const reservationsToday = reservations.filter(r => isToday(r.created_at))
  const revenueToday = cashEntries.filter(c => isToday(c.created_at)).reduce((sum, entry) => sum + Number(entry.order_total || 0), 0)
  const monthMap = getMonthlyMap(cashEntries)

  document.getElementById('pendingOrders').textContent = String(pending.length)
  document.getElementById('ordersToday').textContent = String(ordersToday.length)
  document.getElementById('revenueToday').textContent = money(revenueToday)
  document.getElementById('reservationsToday').textContent = String(reservationsToday.length)

  renderCashSummary(cashEntries)
  renderMonthlyFinance(monthMap)

  document.getElementById('recentOrders').innerHTML = orders.length ? orders.slice(0, 6).map(order => `
    <div class="list-card">
      <strong>${order.customer_name || 'Sem nome'}</strong>
      <span>${formatDateTime(order.created_at)}</span>
      <span>${getItems(order).map(item => `${item.name} (${item.quantity})`).join(', ') || '-'}</span>
      <small><span class="status-pill">${order.payment_status || 'Aguardando pagamento no caixa'}</span></small>
    </div>
  `).join('') : '<div class="empty">Ainda não há pedidos.</div>'

  document.getElementById('recentReservations').innerHTML = reservations.length ? reservations.slice(0, 6).map(item => `
    <div class="list-card">
      <strong>${item.name || 'Sem nome'}</strong>
      <span>${formatDateTime(item.created_at)}</span>
      <span>${item.date || '-'} • ${item.time || '-'}</span>
      <small>${item.guests || '-'} • ${item.occasion || '-'}</small>
    </div>
  `).join('') : '<div class="empty">Ainda não há reservas.</div>'

  const topItems = getTopItems(orders)
  document.getElementById('topItemsSimple').innerHTML = topItems.length ? topItems.map(([name, qty]) => `
    <div class="list-card">
      <strong>${name}</strong>
      <span>${qty} vendidos</span>
    </div>
  `).join('') : '<div class="empty">Ainda não há itens vendidos.</div>'

  const months = [...monthMap.entries()].sort((a, b) => b[0].localeCompare(a[0]))
  document.getElementById('monthList').innerHTML = months.length ? months.map(([key, value]) => `
    <div class="list-card">
      <strong>${monthLabel(key)}</strong>
      <span>${money(value)}</span>
    </div>
  `).join('') : '<div class="empty">Ainda não há faturamento mensal.</div>'
}

document.getElementById('logoutButton')?.addEventListener('click', async () => {
  await supabase.auth.signOut()
  window.location.href = 'painel-login.html'
})

document.getElementById('mainMonthSelect')?.addEventListener('change', render)
document.getElementById('compareMonthSelect')?.addEventListener('change', render)

render().catch(error => {
  console.error(error)
  alert('Não foi possível carregar o dashboard. Confira sua chave, login e policies no Supabase.')
})
