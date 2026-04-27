// ============================================================
// app.js — Shared foundation for all pages
// Load BEFORE Alpine.js. Sets up:
//   window.sb          — Supabase client
//   window.requireAuth — redirect to login if not signed in
//   window.signOut     — sign out + redirect
//   window.toast       — show a toast notification
//   Utility functions: formatCurrency, formatDate, formatDateTime
//   Sidebar injection
// ============================================================

// ── Config ──────────────────────────────────────────────────
// Replace with your actual Supabase project URL and anon key.
// These values are safe to expose in the browser.
const SUPABASE_URL  = window.__SUPABASE_URL__  || 'https://YOUR_PROJECT.supabase.co';
const SUPABASE_ANON = window.__SUPABASE_ANON__ || 'YOUR_ANON_KEY';

// ── Supabase client ──────────────────────────────────────────
const { createClient } = window.supabase;
window.sb = createClient(SUPABASE_URL, SUPABASE_ANON);

// ── Auth helpers ─────────────────────────────────────────────
window.requireAuth = async function () {
  const { data: { user } } = await window.sb.auth.getUser();
  if (!user) {
    window.location.href = '/login.html';
    return null;
  }
  return user;
};

window.signOut = async function () {
  await window.sb.auth.signOut();
  window.location.href = '/login.html';
};

// currentUser returns cached session user synchronously (after requireAuth ran)
window.getUser = async function () {
  const { data: { user } } = await window.sb.auth.getUser();
  return user;
};

// ── Utilities ─────────────────────────────────────────────────
window.formatCurrency = function (amount) {
  return new Intl.NumberFormat('en-JM', { style: 'currency', currency: 'JMD' }).format(Number(amount) || 0);
};

window.formatDate = function (val) {
  if (!val) return '—';
  return new Date(val).toLocaleDateString('en-JM', { year: 'numeric', month: 'short', day: 'numeric' });
};

window.formatDateTime = function (val) {
  if (!val) return '—';
  return new Date(val).toLocaleString('en-JM', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
};

window.PRACTICE_AREA_LABELS = {
  litigation: 'Litigation',
  conveyancing: 'Conveyancing',
  corporate: 'Corporate',
  family: 'Family',
  criminal: 'Criminal',
  immigration: 'Immigration',
  employment: 'Employment',
  intellectual_property: 'IP',
  tax: 'Tax',
  other: 'Other',
};

window.MATTER_STATUS_COLORS = {
  intake: 'bg-yellow-100 text-yellow-800',
  open: 'bg-green-100 text-green-800',
  on_hold: 'bg-gray-100 text-gray-700',
  closed: 'bg-blue-100 text-blue-800',
  archived: 'bg-gray-100 text-gray-500',
};

window.JAMAICAN_PARISHES = [
  'Kingston', 'St. Andrew', 'St. Thomas', 'Portland',
  'St. Mary', 'St. Ann', 'Trelawny', 'St. James',
  'Hanover', 'Westmoreland', 'St. Elizabeth', 'Manchester',
  'Clarendon', 'St. Catherine',
];

// ── Toast ─────────────────────────────────────────────────────
(function initToasts() {
  const container = document.createElement('div');
  container.id = 'toast-container';
  container.className = 'fixed bottom-5 right-5 z-50 flex flex-col gap-2';
  document.body.appendChild(container);
})();

window.toast = function (message, type = 'success') {
  const el = document.createElement('div');
  const colors = {
    success: 'bg-green-600',
    error:   'bg-red-600',
    info:    'bg-blue-600',
  };
  el.className = `${colors[type] || colors.info} text-white text-sm px-4 py-3 rounded-lg shadow-lg max-w-xs transition-opacity`;
  el.textContent = message;
  document.getElementById('toast-container').appendChild(el);
  setTimeout(() => { el.style.opacity = '0'; setTimeout(() => el.remove(), 300); }, 3500);
};

// ── Sidebar ───────────────────────────────────────────────────
(function injectSidebar() {
  const container = document.getElementById('sidebar-container');
  if (!container) return;

  const nav = [
    { href: '/dashboard.html', icon: 'home',        label: 'Dashboard' },
    { href: '/clients.html',   icon: 'users',        label: 'Clients' },
    { href: '/matters.html',   icon: 'briefcase',    label: 'Matters' },
    { href: '/tasks.html',     icon: 'check-square', label: 'Tasks' },
    { href: '/calendar.html',  icon: 'calendar',     label: 'Calendar' },
    { href: '/time.html',      icon: 'clock',        label: 'Time' },
    { href: '/invoices.html',  icon: 'receipt',      label: 'Invoices' },
    { href: '/trust.html',     icon: 'shield',       label: 'Trust' },
    { href: '/documents.html', icon: 'file-text',    label: 'Documents' },
  ];

  const current = window.location.pathname.split('/').pop() || 'dashboard.html';

  const links = nav.map(({ href, icon, label }) => {
    const active = current === href.replace('/', '');
    return `
      <a href="${href}" class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${active ? 'bg-brand-700 text-white' : 'text-brand-100 hover:bg-brand-700 hover:text-white'}">
        <i data-lucide="${icon}" class="h-4 w-4 shrink-0"></i>
        ${label}
      </a>`;
  }).join('');

  container.innerHTML = `
    <div class="flex h-full flex-col bg-brand-800">
      <div class="flex h-16 shrink-0 items-center px-4 border-b border-brand-700">
        <a href="/dashboard.html" class="flex items-center gap-2">
          <i data-lucide="scale" class="h-6 w-6 text-white"></i>
          <span class="text-white font-bold text-base leading-tight">LexJamaica</span>
        </a>
      </div>
      <nav class="flex-1 px-3 py-4 space-y-1 overflow-y-auto">${links}</nav>
      <div class="p-3 border-t border-brand-700">
        <div class="flex items-center gap-2 px-2 py-1.5 mb-2">
          <i data-lucide="user-circle" class="h-5 w-5 text-brand-300 shrink-0"></i>
          <div class="overflow-hidden">
            <p class="text-xs font-medium text-white truncate" id="sidebar-user-name">—</p>
            <p class="text-xs text-brand-400 truncate" id="sidebar-tenant-name"></p>
          </div>
        </div>
        <button onclick="window.signOut()" class="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-brand-200 hover:bg-brand-700 hover:text-white transition-colors">
          <i data-lucide="log-out" class="h-4 w-4"></i>Sign out
        </button>
      </div>
    </div>`;

  // Populate user info once auth resolves
  window.sb.auth.getUser().then(({ data: { user } }) => {
    if (!user) return;
    const meta = user.user_metadata || {};
    const nameEl = document.getElementById('sidebar-user-name');
    const tenantEl = document.getElementById('sidebar-tenant-name');
    if (nameEl) nameEl.textContent = meta.full_name || user.email;
    if (tenantEl) tenantEl.textContent = meta.tenant_name || '';
  });

  // Render Lucide icons after injecting HTML
  if (window.lucide) window.lucide.createIcons();
  else document.addEventListener('DOMContentLoaded', () => window.lucide?.createIcons());
})();
