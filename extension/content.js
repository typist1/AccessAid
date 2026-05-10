// AccessAid content script — runs on ABE.illinois.gov and healthcare.gov
// Detects form fields, shows autofill banner, fills fields with user's profile data

const BACKEND_URL = 'http://localhost:3001'

let banner = null

// ─── Auth ────────────────────────────────────────────────────────────────────

async function getAccessToken() {
  return new Promise(resolve => {
    chrome.storage.local.get('aa_access_token', data => {
      resolve(data.aa_access_token || null)
    })
  })
}

// ─── Portal detection ────────────────────────────────────────────────────────

function getPortalId() {
  const host = window.location.hostname
  if (host.includes('abe.illinois.gov')) return 'abe_il'
  if (host.includes('healthcare.gov')) return 'healthcare_gov'
  return null
}

// ─── Field detection ────────────────────────────────────────────────────────

function detectFields() {
  const seen = new Set()
  const fields = []

  document.querySelectorAll('input, select, textarea').forEach(el => {
    const type = el.type?.toLowerCase()
    if (type === 'hidden' || type === 'submit' || type === 'button' || type === 'image') return
    if (el.disabled || el.readOnly) return

    let label = ''

    // Strategy 1: <label for="id">
    if (el.id) {
      const labelEl = document.querySelector(`label[for="${CSS.escape(el.id)}"]`)
      if (labelEl) label = labelEl.textContent.trim()
    }

    // Strategy 2: wrapping <label>
    if (!label) {
      const parentLabel = el.closest('label')
      if (parentLabel) {
        label = parentLabel.textContent.trim().replace(el.value, '').trim()
      }
    }

    // Strategy 3: aria-label / aria-labelledby
    if (!label) label = el.getAttribute('aria-label') || ''
    if (!label && el.getAttribute('aria-labelledby')) {
      const lb = document.getElementById(el.getAttribute('aria-labelledby'))
      if (lb) label = lb.textContent.trim()
    }

    // Strategy 4: placeholder
    if (!label) label = el.placeholder || ''

    // Strategy 5: immediately preceding sibling text
    if (!label) {
      let prev = el.previousElementSibling
      while (prev && !label) {
        const text = prev.textContent.trim()
        if (text) label = text
        prev = prev.previousElementSibling
      }
    }

    // Strategy 6: parent's preceding sibling (th/td pattern)
    if (!label) {
      const td = el.closest('td')
      if (td) {
        const prevTd = td.previousElementSibling
        if (prevTd) label = prevTd.textContent.trim()
      }
    }

    label = label.replace(/[*:†‡§]/g, '').trim()
    if (!label || label.length > 80) return

    const key = `${label}|${type}`
    if (seen.has(key)) return
    seen.add(key)

    fields.push({ label, element: el })
  })

  return fields
}

// ─── Banner UI ───────────────────────────────────────────────────────────────

function removeBanner() {
  if (banner) { banner.remove(); banner = null }
}

const BANNER_STYLE = `
  position: fixed; top: 16px; right: 16px; z-index: 2147483647;
  background: #ffffff; border-radius: 14px; padding: 16px 18px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.14); width: 296px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 13px; line-height: 1.5; color: #111827;
  border: 1px solid rgba(0,0,0,0.08);
`

function showAutofillBanner(fieldCount, onFill) {
  removeBanner()
  banner = document.createElement('div')
  banner.id = 'aa-banner'
  banner.setAttribute('style', BANNER_STYLE)
  banner.innerHTML = `
    <div style="display:flex;align-items:center;gap:7px;margin-bottom:10px;">
      <span style="font-size:15px;color:#2563eb;">✦</span>
      <span style="font-weight:700;font-size:13px;">AccessAid</span>
      <button id="aa-close" title="Dismiss" style="margin-left:auto;background:none;border:none;cursor:pointer;color:#9ca3af;font-size:17px;line-height:1;padding:0;">×</button>
    </div>
    <p style="margin:0 0 12px;color:#374151;">
      Autofill <strong>${fieldCount} field${fieldCount !== 1 ? 's' : ''}</strong> from your profile?
    </p>
    <div style="display:flex;gap:8px;">
      <button id="aa-fill" style="
        flex:1;background:#2563eb;color:#fff;border:none;border-radius:8px;
        padding:8px 0;font-size:13px;font-weight:600;cursor:pointer;
        transition:background 0.15s;
      ">Autofill</button>
      <button id="aa-dismiss" style="
        flex:1;background:#f3f4f6;color:#374151;border:none;border-radius:8px;
        padding:8px 0;font-size:13px;font-weight:500;cursor:pointer;
      ">Not now</button>
    </div>
  `
  document.body.appendChild(banner)
  document.getElementById('aa-fill').addEventListener('click', onFill)
  document.getElementById('aa-dismiss').addEventListener('click', removeBanner)
  document.getElementById('aa-close').addEventListener('click', removeBanner)
}

function showLoginBanner() {
  removeBanner()
  banner = document.createElement('div')
  banner.id = 'aa-banner'
  banner.setAttribute('style', BANNER_STYLE)
  banner.innerHTML = `
    <div style="display:flex;align-items:center;gap:7px;margin-bottom:8px;">
      <span style="font-size:15px;color:#2563eb;">✦</span>
      <span style="font-weight:700;font-size:13px;">AccessAid</span>
      <button id="aa-close" style="margin-left:auto;background:none;border:none;cursor:pointer;color:#9ca3af;font-size:17px;line-height:1;padding:0;">×</button>
    </div>
    <p style="margin:0 0 12px;color:#374151;font-size:12px;">
      Log in to AccessAid to autofill this form with your profile.
    </p>
    <button id="aa-open" style="
      width:100%;background:#2563eb;color:#fff;border:none;border-radius:8px;
      padding:8px 0;font-size:13px;font-weight:600;cursor:pointer;
    ">Open AccessAid</button>
  `
  document.body.appendChild(banner)
  document.getElementById('aa-close').addEventListener('click', removeBanner)
  document.getElementById('aa-open').addEventListener('click', () => {
    chrome.runtime.sendMessage({ type: 'OPEN_DASHBOARD' })
  })
}

function showStatusBanner(html, type = 'info') {
  removeBanner()
  const borderColor = type === 'success' ? '#86efac' : type === 'error' ? '#fca5a5' : '#e5e7eb'
  banner = document.createElement('div')
  banner.id = 'aa-banner'
  banner.setAttribute('style', BANNER_STYLE + `border-color:${borderColor};`)
  banner.innerHTML = `
    <div style="display:flex;align-items:flex-start;gap:7px;">
      <span style="font-size:15px;color:#2563eb;flex-shrink:0;">✦</span>
      <div style="flex:1;">${html}</div>
      <button id="aa-close" style="background:none;border:none;cursor:pointer;color:#9ca3af;font-size:17px;line-height:1;padding:0;flex-shrink:0;">×</button>
    </div>
  `
  document.body.appendChild(banner)
  document.getElementById('aa-close').addEventListener('click', removeBanner)
  if (type === 'success') setTimeout(removeBanner, 4000)
}

// ─── Field filling ───────────────────────────────────────────────────────────

function fillField(el, value) {
  // Use native setter to trigger React synthetic events
  const proto = el.tagName === 'SELECT' ? HTMLSelectElement.prototype : HTMLInputElement.prototype
  const setter = Object.getOwnPropertyDescriptor(proto, 'value')?.set
  if (setter) setter.call(el, value)
  else el.value = value

  el.dispatchEvent(new Event('input', { bubbles: true }))
  el.dispatchEvent(new Event('change', { bubbles: true }))

  // Blue = autofilled by us
  el.style.setProperty('background-color', '#dbeafe', 'important')
  el.style.setProperty('border-color', '#3b82f6', 'important')
  el.title = 'Auto-filled by AccessAid'
}

function markUnfilled(el) {
  el.style.setProperty('background-color', '#fef9c3', 'important')
  el.style.setProperty('border-color', '#eab308', 'important')
  el.title = "AccessAid doesn't have this info — please fill in"
}

// ─── Autofill ────────────────────────────────────────────────────────────────

async function runAutofill(fields, token) {
  const fillBtn = document.getElementById('aa-fill')
  if (fillBtn) { fillBtn.textContent = 'Filling…'; fillBtn.disabled = true }

  const portalId = getPortalId()

  try {
    const resp = await fetch(`${BACKEND_URL}/api/extension/autofill`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        portal_id: portalId,
        page_url: window.location.href,
        field_labels: fields.map(f => f.label),
      }),
    })

    if (!resp.ok) {
      const err = await resp.json().catch(() => ({}))
      throw new Error(err.error || `HTTP ${resp.status}`)
    }

    const { values = [], unfilled = [] } = await resp.json()

    let filled = 0
    for (const match of values) {
      const field = fields.find(f => f.label === match.label)
      if (field?.element) { fillField(field.element, match.value); filled++ }
    }

    for (const label of unfilled) {
      const field = fields.find(f => f.label === label)
      if (field?.element) markUnfilled(field.element)
    }

    const unfilledCount = unfilled.length
    showStatusBanner(
      `<strong style="font-size:13px;">Filled ${filled} field${filled !== 1 ? 's' : ''}</strong>` +
      (unfilledCount ? `<br><span style="font-size:12px;color:#6b7280;">${unfilledCount} field${unfilledCount !== 1 ? 's' : ''} highlighted yellow need your input.</span>` : ''),
      'success',
    )

    // Detect form submission to report back to dashboard
    document.querySelectorAll('form').forEach(form => {
      form.addEventListener('submit', () => reportSubmit(token, portalId), { once: true })
    })
  } catch (e) {
    showStatusBanner(`<strong>Autofill failed</strong><br><span style="font-size:12px;color:#6b7280;">${e.message}</span>`, 'error')
  }
}

async function reportSubmit(token, portalId) {
  try {
    await fetch(`${BACKEND_URL}/api/extension/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ portal_id: portalId, page_url: window.location.href }),
    })
  } catch { /* best-effort */ }
}

// ─── Init ────────────────────────────────────────────────────────────────────

async function init() {
  const token = await getAccessToken()

  if (!token) {
    showLoginBanner()
    return
  }

  const fields = detectFields()
  if (!fields.length) return

  showAutofillBanner(fields.length, () => runAutofill(fields, token))
}

// Run on page load
init()

// Re-run on SPA navigation (healthcare.gov is a multi-step SPA)
let lastUrl = location.href
const navObserver = new MutationObserver(() => {
  if (location.href !== lastUrl) {
    lastUrl = location.href
    setTimeout(() => { removeBanner(); init() }, 700)
  }
})
navObserver.observe(document.documentElement, { childList: true, subtree: true })
