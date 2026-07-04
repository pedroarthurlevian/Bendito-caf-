import { supabase, isSupabaseConfigured } from './supabase.js'

const form = document.getElementById('loginForm')
const feedback = document.getElementById('loginFeedback')

if (!isSupabaseConfigured()) {
  feedback.textContent = 'Configure a Publishable key em assets/supabase.js.'
}

form?.addEventListener('submit', async (event) => {
  event.preventDefault()

  const email = document.getElementById('email')?.value.trim()
  const password = document.getElementById('password')?.value

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    console.error(error)
    feedback.textContent = 'E-mail ou senha inválidos.'
    return
  }

  window.location.href = 'dashboard.html'
})
