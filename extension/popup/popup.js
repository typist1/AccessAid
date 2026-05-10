// AccessAid extension popup
// Handles login/logout and shows connection status

const SUPABASE_URL = 'https://prixypextuugdasthneh.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_r6DWlTOEEVND8-WrvXnL_g_CibRlVDU'
const DASHBOARD_URL = 'http://localhost:5173'

const root = document.getElementById('root')

// ─── Storage helpers ──────────────────────────────────────────────────────────

function getStoredAuth() {
  return new Promise(resolve => {
    chrome.storage.local.get(['aa_access_token', 'aa_user_email', 'aa_user_name'], resolve)
  })
}

function setStoredAuth(token, email, name) {
  return new Promise(resolve => {
    chrome.storage.local.set({ aa_access_token: token, aa_user_email: email, aa_user_name: name }, resolve)
  })
}

function clearStoredAuth() {
  return new Promise(resolve => {
    chrome.storage.local.remove(['aa_access_token', 'aa_user_email', 'aa_user_name'], resolve)
  })
}

// ─── Supabase auth (REST, no SDK needed) ─────────────────────────────────────

async function signIn(email, password) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({ email, password }),
  })
  const data = await res.json()
  if (data.error || data.error_description) {
    throw new Error(data.error_description || data.error || 'Login failed')
  }
  return {
    token: data.access_token,
    email: data.user?.email || email,
    name: data.user?.user_metadata?.full_name || email.split('@')[0],
  }
}

// ─── Views ───────────────────────────────────────────────────────────────────

function renderLogin(errorMsg = '') {
  root.innerHTML = `
    <p class="login-intro">
      Log in to your AccessAid account to autofill government benefit applications.
    </p>
    ${errorMsg ? `<p class="error-msg">${errorMsg}</p>` : ''}
    <div>
      <label for="aa-email">Email</label>
      <input type="email" id="aa-email" placeholder="you@example.com" autocomplete="email">
    </div>
    <div>
      <label for="aa-password">Password</label>
      <input type="password" id="aa-password" placeholder="••••••••" autocomplete="current-password">
    </div>
    <button class="btn btn-primary" id="aa-login-btn">Log in</button>
    <button class="btn btn-ghost" id="aa-signup-btn">Create account at AccessAid</button>
  `

  const emailEl = document.getElementById('aa-email')
  const passEl = document.getElementById('aa-password')
  const loginBtn = document.getElementById('aa-login-btn')

  async function handleLogin() {
    const email = emailEl.value.trim()
    const password = passEl.value
    if (!email || !password) return

    loginBtn.disabled = true
    loginBtn.innerHTML = '<span class="spinner"></span>Logging in…'

    try {
      const { token, email: userEmail, name } = await signIn(email, password)
      await setStoredAuth(token, userEmail, name)
      renderLoggedIn(userEmail, name)
    } catch (e) {
      renderLogin(e.message)
    }
  }

  loginBtn.addEventListener('click', handleLogin)
  passEl.addEventListener('keydown', e => { if (e.key === 'Enter') handleLogin() })

  document.getElementById('aa-signup-btn').addEventListener('click', () => {
    chrome.tabs.create({ url: `${DASHBOARD_URL}/signup` })
  })
}

function renderLoggedIn(email, name) {
  const displayName = name || email.split('@')[0]

  root.innerHTML = `
    <div class="user-card">
      <div class="user-name">Hi, ${displayName} ✓</div>
      <div class="user-email">${email}</div>
    </div>
    <div class="tip">
      <strong>Ready to autofill</strong>
      Visit a benefits portal — ABE.illinois.gov or healthcare.gov — and the AccessAid banner will appear.
    </div>
    <button class="btn btn-primary" id="aa-dashboard-btn">Open Dashboard</button>
    <br>
    <button class="logout-btn" id="aa-logout-btn">Log out</button>
  `

  document.getElementById('aa-dashboard-btn').addEventListener('click', () => {
    chrome.tabs.create({ url: `${DASHBOARD_URL}/dashboard` })
  })

  document.getElementById('aa-logout-btn').addEventListener('click', async () => {
    await clearStoredAuth()
    renderLogin()
  })
}

// ─── Init ─────────────────────────────────────────────────────────────────────

async function init() {
  const stored = await getStoredAuth()
  if (stored.aa_access_token) {
    renderLoggedIn(stored.aa_user_email, stored.aa_user_name)
  } else {
    renderLogin()
  }
}

init()
