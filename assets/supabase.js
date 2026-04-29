import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

/*
  IMPORTANTE:
  1) Você já encontrou a Project URL:
     https://lhqwmywcxtpronmjufgc.supabase.co

  2) Falta colar a sua Publishable key abaixo.
     Ela começa com: sb_publishable_
     NÃO use a chave sb_secret_.
*/

const supabaseUrl = 'https://lhqwmywcxtpronmjufgc.supabase.co'
const supabaseAnonKey = 'sb_publishable_XISJ1YxBzo08QWb_J0defQ_qVHOD2zy'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export function isSupabaseConfigured() {
  return Boolean(supabaseAnonKey && !supabaseAnonKey.includes('COLE_AQUI'))
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

export function orderTotal(order) {
  const items = order.items_json || order.items || []
  const subtotal = items.reduce((sum, item) => {
    return sum + Number(item.price || 0) * Number(item.quantity || 0)
  }, 0)

  return subtotal * (order.coupon === 'BENDITO10' ? 0.9 : 1)
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
