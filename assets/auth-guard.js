import { supabase, isSupabaseConfigured } from './supabase.js'

if (!isSupabaseConfigured()) {
  alert('Configure a Publishable key em assets/supabase.js antes de acessar o painel.')
  window.location.href = 'index.html'
}

const { data } = await supabase.auth.getSession()

if (!data.session) {
  window.location.href = 'painel-login.html'
}
