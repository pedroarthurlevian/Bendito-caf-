import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

/*
  IMPORTANTE:
  1) Você já encontrou a Project URL:
     https://lhqwmywcxtpronmjufgc.supabase.co

  2) Cole abaixo a Publishable key do seu projeto.
     Ela começa com: sb_publishable_
     NÃO use a chave sb_secret_ no front-end.
*/

const supabaseUrl = 'https://lhqwmywcxtpronmjufgc.supabase.co'
const supabaseAnonKey = 'sb_publishable_XISJ1YxBzo08QWb_J0defQ_qVHOD2zy'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export function isSupabaseConfigured() {
  return Boolean(supabaseAnonKey && !supabaseAnonKey.includes('COLE_AQUI'))
}

export function escapeHTML(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export function safeAttr(value) {
  return escapeHTML(value).replace(/`/g, '&#096;')
}

export function formatMoney(value) {
  return Number(value || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })
}

export function formatDateTime(value) {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '-'
  return date.toLocaleDateString('pt-BR') + ' • ' + date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function normalizeOrderItems(order) {
  const rawItems = order?.items_json || order?.items || []
  if (!Array.isArray(rawItems)) return []

  return rawItems.map(item => ({
    id: String(item?.id || item?.product_id || ''),
    name: String(item?.name || 'Item sem nome'),
    price: Number(item?.price || item?.unit_price || 0),
    quantity: Math.max(0, Number(item?.quantity || 0)),
    total: Number(item?.total || item?.line_total || (Number(item?.price || item?.unit_price || 0) * Number(item?.quantity || 0)))
  })).filter(item => item.quantity > 0)
}

export function orderTotal(order) {
  const storedTotal = Number(order?.order_total)
  if (Number.isFinite(storedTotal) && storedTotal > 0) return storedTotal

  const subtotal = normalizeOrderItems(order).reduce((sum, item) => {
    return sum + Number(item.price || 0) * Number(item.quantity || 0)
  }, 0)

  return Number((subtotal * (order?.coupon === 'BENDITO10' ? 0.9 : 1)).toFixed(2))
}

export function monthKey(value) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

export function monthLabel(key) {
  if (!key) return '-'
  const [year, month] = key.split('-').map(Number)
  const date = new Date(year, month - 1, 1)
  return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
}

export function subscribeToTable(table, callback) {
  return supabase
    .channel(`bendito-${table}-changes`)
    .on('postgres_changes', { event: '*', schema: 'public', table }, callback)
    .subscribe()
}
