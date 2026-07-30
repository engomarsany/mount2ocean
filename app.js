/**
 * Mount2ocean Multi-Role Authentication Portal JavaScript Logic
 * Handling tab switching, role switching, validation, modal flows, and state persistence.
 */

// ==========================================
// FAIL-SAFE THEME TOGGLE (DARK / LIGHT MODE)
// ==========================================
// ==========================================
// PERMANENT LIGHT THEME ENGINE (DARK MODE REMOVED)
// ==========================================
window.toggleAppTheme = function() {
  document.body.classList.remove('dark-theme');
  document.body.classList.add('light-theme');
  localStorage.setItem('m2o_theme', 'light');
};

window.updateThemeToggleUI = function(theme) {
  document.querySelectorAll('#globalThemeToggle, .theme-toggle-btn').forEach(btn => {
    btn.style.display = 'none';
  });
};

window.applySavedTheme = function() {
  localStorage.setItem('m2o_theme', 'light');
  document.body.classList.remove('dark-theme');
  document.body.classList.add('light-theme');
  window.updateThemeToggleUI('light');
};

// ==========================================
// WORLD-CLASS SECURITY HARDENING ENGINE (XSS, SANITIZATION & RATE-LIMITING)
// ==========================================
window.sanitizeHTML = function(str) {
  if (typeof str !== 'string') return str;
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

// Rate Limiter against Brute-Force & Bot Spam
window.SecurityRateLimiter = {
  attempts: {},
  check: function(key, maxLimit = 5, windowMs = 60000) {
    const now = Date.now();
    if (!this.attempts[key]) {
      this.attempts[key] = [];
    }
    this.attempts[key] = this.attempts[key].filter(t => now - t < windowMs);
    if (this.attempts[key].length >= maxLimit) {
      return false; // Blocked
    }
    this.attempts[key].push(now);
    return true; // Allowed
  }
};

// Immediate & DOMContentLoaded fail-safe theme application
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', window.applySavedTheme);
} else {
  window.applySavedTheme();
}

// ==========================================
// GLOBAL PACKAGES & SEARCH REDIRECTION ENGINE
// ==========================================
window.defaultPackages = [
  { id: 'pkg-bhutan', name: "3-Night / 4-Day Bhutan Cultural Tour & Tiger's Nest Hike", category: 'bhutan', price: '৳75,000', duration: '4 Days / 3 Nights', rating: '⭐ 4.9 (160 reviews)', badge: 'cultural', badgeLabel: 'Bhutan Special', image: 'assets/tour_gallery_bhutan.jpg', desc: "4 Days / 3 Nights complete Bhutan tour including Return Drukair Flights (Dhaka-Paro-Dhaka), 3-Star Hotel stay, all meals, Thimphu sightseeing, and Tiger's Nest hike." },
  { id: 'pkg-sylhet-tea', name: "Sylhet Tea Garden, Jaflong & Ratargul Swamp Forest Tour", category: 'sylhet', price: '৳12,500', duration: '3 Days / 2 Nights', rating: '⭐ 4.8 (195 reviews)', badge: 'eco', badgeLabel: 'Sylhet Special', image: 'assets/dest_darjeeling.jpg', desc: "3 Days / 2 Nights eco tour in Sylhet including Luxury Resort Stay, Lakkatura Tea Garden walk, Jaflong Zero Point boat ride, Ratargul Swamp Forest boat tour, and Bisnakandi." },
  { id: 'pkg-bali-4d3n', name: "BALI PACKAGE 4D/3N - Kintamani Volcano, Uluwatu & Water Sports", category: 'bali', price: '৳17,500', duration: '4 Days / 3 Nights', rating: '⭐ 4.9 (185 reviews)', badge: 'tropical', badgeLabel: 'Bali Special', image: 'assets/bali_kintamani_volcano.jpg', desc: "4 Days / 3 Nights complete Bali tour including 3-Star/4-Star Hotel stay, daily breakfast, Kintamani Volcano view, Tegalalang rice terraces, Uluwatu sunset cliff temple, Tegenungan waterfall, and complimentary Banana Boat ride!" },
  { id: 'pkg-coxsbazar-beach', name: "Cox's Bazar 5-Star Ocean Resort & Saint Martin Coral Cruise", category: 'coxsbazar', price: '৳18,500', duration: '3 Days / 2 Nights', rating: '⭐ 4.8 (210 reviews)', badge: 'bestseller', badgeLabel: 'Bestseller', image: 'assets/coxsbazar_resort.jpg', desc: "3 Days / 2 Nights luxury oceanfront resort stay at Cox's Bazar including seafood buffet breakfast, Saint Martin Ship Cruise, and Kolatoli Beach tour." },
  { id: 'pkg-dubai-safari', name: "Dubai Desert Safari, Burj Khalifa & Marina Dhow Cruise", category: 'dubai', price: '৳48,000', duration: '5 Days / 4 Nights', rating: '⭐ 4.9 (320 reviews)', badge: 'featured', badgeLabel: 'Featured', image: 'assets/dubai_safari.jpg', desc: "5 Days / 4 Nights luxury Dubai tour with 4-Star hotel, 4x4 dune bashing desert safari, BBQ dinner, Burj Khalifa top floor entry, and Marina cruise." },
  { id: 'pkg-maldives-resort', name: "Maldives Overwater Resort Villa & Speedboat Transfer", category: 'maldives', price: '৳85,000', duration: '4 Days / 3 Nights', rating: '⭐ 5.0 (140 reviews)', badge: 'luxury', badgeLabel: 'Luxury Escape', image: 'assets/maldives_villa.jpg', desc: "4 Days / 3 Nights private overwater villa stay in Maldives with all-inclusive meals, coral reef snorkeling, and luxury speedboat airport transfers." },
  { id: 'pkg-nepal-himalaya', name: "Nepal Kathmandu, Pokhara & Annapurna Himalayan Sunrise Tour", category: 'nepal', price: '৳42,000', duration: '5 Days / 4 Nights', rating: '⭐ 4.9 (175 reviews)', badge: 'mountain', badgeLabel: 'Himalayan Escape', image: 'assets/dest_kathmandu.jpg', desc: "5 Days / 4 Nights mountain escape in Nepal covering Kathmandu Pashupatinath Temple, Pokhara Phewa Lake boating, Sarangkot Himalayan Sunrise view, and Paragliding adventure." }
];

window.getCombinedLivePackages = function() {
  let live = [];
  const pkgVersion = 'v3_sylhet_nepal_sync';
  const savedVersion = localStorage.getItem('m2o_pkg_version');

  if (savedVersion !== pkgVersion) {
    live = [...window.defaultPackages];
    localStorage.setItem('m2o_pkg_version', pkgVersion);
    localStorage.setItem('m2o_live_packages', JSON.stringify(live));
    return live;
  }

  const saved = localStorage.getItem('m2o_live_packages');
  if (saved !== null) {
    try {
      live = JSON.parse(saved) || [];
    } catch (e) {
      live = [...window.defaultPackages];
    }
  } else {
    live = [...window.defaultPackages];
  }

  // Self-heal: Ensure all default packages exist in live array
  window.defaultPackages.forEach(defPkg => {
    if (!live.some(p => p.id === defPkg.id || p.name.toLowerCase() === defPkg.name.toLowerCase())) {
      live.push(defPkg);
    }
  });

  localStorage.setItem('m2o_live_packages', JSON.stringify(live));
  return live;
};

// ==========================================
// CUSTOMER MISSING SEARCH LOGGING & ADMIN REMINDER ENGINE
// ==========================================
window.getMissingPackageSearches = function() {
  try {
    return JSON.parse(localStorage.getItem('m2o_missing_package_searches')) || [];
  } catch (e) {
    return [];
  }
};

window.logMissingPackageSearch = function(rawQuery) {
  if (!rawQuery || typeof rawQuery !== 'string') return;
  const cleanQ = rawQuery.trim();
  if (cleanQ.length < 2) return;

  // Ignore if it matches any existing default category or name
  const existingPkgs = window.getCombinedLivePackages ? window.getCombinedLivePackages() : window.defaultPackages;
  const matchesExisting = existingPkgs.some(p => 
    p.name.toLowerCase().includes(cleanQ.toLowerCase()) || 
    (p.category || '').toLowerCase().includes(cleanQ.toLowerCase())
  );
  if (matchesExisting) return; // Don't log if package actually exists

  let searches = window.getMissingPackageSearches();
  const existingIdx = searches.findIndex(s => s.query.toLowerCase() === cleanQ.toLowerCase());
  const timeNow = new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  if (existingIdx !== -1) {
    searches[existingIdx].count = (searches[existingIdx].count || 1) + 1;
    searches[existingIdx].lastSearched = timeNow;
    if (searches[existingIdx].status === 'Dismissed') {
      searches[existingIdx].status = 'Pending';
    }
  } else {
    searches.unshift({
      id: 'req-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      query: cleanQ,
      count: 1,
      lastSearched: timeNow,
      status: 'Pending',
      addedByAdmin: false
    });
  }

  localStorage.setItem('m2o_missing_package_searches', JSON.stringify(searches));
  window.dispatchEvent(new CustomEvent('m2o_searches_updated', { detail: searches }));
};

// ==========================================
// HIDDEN INVISIBLE AI TOUR RECOMMENDATION AGENT ENGINE
// (Background AI intent analyzer for Find Tours with Single-Execution Guard)
// ==========================================
window.m2oIsSearching = false;

window.runHiddenAiTourAgent = function(userPrompt, selectedDate = '2026-08-10') {
  if (window.m2oIsSearching) return null;
  window.m2oIsSearching = true;

  const rawQuery = (userPrompt || '').trim();
  const lowerQuery = rawQuery.toLowerCase();
  
  let cleanQuery = rawQuery.replace(/[\u{1F300}-\u{1F9FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '');
  cleanQuery = cleanQuery.replace(/\bBT\b/gi, '').trim().toLowerCase();

  const livePkgs = window.getCombinedLivePackages ? window.getCombinedLivePackages() : [];

  let matchedPkg = null;
  let matchConfidence = 0;
  let matchReason = '';

  if (rawQuery) {
    // 1. Direct Category/Destination matching (sylhet, nepal, bhutan, dubai, coxsbazar, maldives, bali)
    const destMap = {
      'sylhet': ['sylhet', 'সিলেট', 'jaflong', 'জাফলং', 'ratargul', 'রাতারগুল', 'tea garden', 'চা বাগান'],
      'nepal': ['nepal', 'নেপাল', 'kathmandu', 'কাঠমান্ডু', 'pokhara', 'পোখরা', 'annapurna', 'himalaya', 'হিমালয়'],
      'coxsbazar': ['cox', 'কক্সবাজার', 'saint martin', 'সেন্টমার্টিন', 'sea beach', 'সমুদ্র', 'kolatoli', 'কোলাতলী'],
      'dubai': ['dubai', 'দুবাই', 'burj', 'বুর্জ', 'safari', 'সাফারি', 'dhow cruise', 'মেরিনা'],
      'maldives': ['maldives', 'মালদ্বীপ', 'overwater', 'villa', 'snorkeling', 'স্পিডবোট'],
      'bhutan': ['bhutan', 'ভুটান', 'tiger', 'nest', 'paro', 'thimphu', 'পারো', 'থিম্পু'],
      'bali': ['bali', 'বালি', 'volcano', 'kintamani', 'tanah lot', 'nusa penida', 'উবুদ']
    };

    for (const [catKey, keywords] of Object.entries(destMap)) {
      if (keywords.some(kw => lowerQuery.includes(kw) || cleanQuery.includes(kw))) {
        matchedPkg = livePkgs.find(p => (p.category || '').toLowerCase() === catKey || p.id.includes(catKey));
        if (matchedPkg) {
          matchConfidence = 0.98;
          matchReason = `Direct category AI match for '${catKey}'`;
          break;
        }
      }
    }

    // 2. Semantic Theme & Intent Matching (Mountain, Beach, Luxury, Tea, Temple, Desert)
    if (!matchedPkg) {
      const themeMap = [
        { keywords: ['mountain', 'pahar', 'পাহাড়', 'hike', 'trek', 'snow'], category: 'nepal' },
        { keywords: ['tea', 'green', 'rainforest', 'swamp'], category: 'sylhet' },
        { keywords: ['beach', 'ocean', 'sea', 'bengal', 'coral'], category: 'coxsbazar' },
        { keywords: ['luxury', 'villa', 'water', 'resort', 'honeymoon'], category: 'maldives' },
        { keywords: ['desert', 'skyscraper', 'shopping', 'burj'], category: 'dubai' },
        { keywords: ['culture', 'temple', 'peace', 'monastery'], category: 'bhutan' },
        { keywords: ['island', 'swing', 'volcano', 'sunset'], category: 'bali' }
      ];

      for (const theme of themeMap) {
        if (theme.keywords.some(kw => lowerQuery.includes(kw))) {
          matchedPkg = livePkgs.find(p => (p.category || '').toLowerCase() === theme.category);
          if (matchedPkg) {
            matchConfidence = 0.90;
            matchReason = `Theme intent AI match for '${theme.category}'`;
            break;
          }
        }
      }
    }

    // 3. Substring & Multi-word Keyword Fuzzy Matching
    if (!matchedPkg) {
      matchedPkg = livePkgs.find(p => p.name.toLowerCase().includes(lowerQuery) || lowerQuery.includes(p.name.toLowerCase()));
      if (matchedPkg) {
        matchConfidence = 0.85;
        matchReason = 'Title substring match';
      }
    }

    if (!matchedPkg) {
      const words = lowerQuery.replace(/[^\w\s]/gi, ' ').split(/\s+/).filter(w => w.length >= 3);
      if (words.length > 0) {
        matchedPkg = livePkgs.find(p => {
          const haystack = `${p.name} ${p.category} ${p.desc}`.toLowerCase();
          return words.some(w => haystack.includes(w));
        });
        if (matchedPkg) {
          matchConfidence = 0.75;
          matchReason = 'Multi-word fuzzy match';
        }
      }
    }
  }

  // Log to Admin AI Search Console
  const aiLog = {
    id: 'AI-SEARCH-' + Date.now(),
    query: rawQuery || 'All Packages View',
    timestamp: new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}),
    matchedPkgId: matchedPkg ? matchedPkg.id : null,
    matchedPkgName: matchedPkg ? matchedPkg.name : 'No Match (Showing All Packages)',
    confidence: Math.round(matchConfidence * 100) + '%',
    status: matchedPkg ? 'MATCHED' : 'FALLBACK_ALL'
  };

  try {
    let logs = JSON.parse(localStorage.getItem('m2o_ai_agent_search_logs')) || [];
    logs.unshift(aiLog);
    if (logs.length > 100) logs = logs.slice(0, 100);
    localStorage.setItem('m2o_ai_agent_search_logs', JSON.stringify(logs));
  } catch(e){}

  // ROUTING LOGIC:
  // Case A: Package Match Found -> Redirect directly to dedicated detail page
  if (matchedPkg) {
    localStorage.setItem('m2o_active_detail_pkg_id', matchedPkg.id);
    window.location.href = `package_detail.html?id=${matchedPkg.id}&date=${encodeURIComponent(selectedDate)}&ai_redirect=1`;
    return matchedPkg;
  }

  // Case B: No Direct Match -> Log search to Admin requested queue & show ALL packages
  if (rawQuery && window.logMissingPackageSearch) {
    window.logMissingPackageSearch(rawQuery);
  }

  window.location.href = rawQuery ? `tour_packages.html?search=${encodeURIComponent(rawQuery)}` : 'tour_packages.html';
  return null;
};

window.executeFindToursSearch = function(event) {
  if (event) {
    if (event.preventDefault) event.preventDefault();
    if (event.stopPropagation) event.stopPropagation();
  }

  try {
    const searchInput = document.getElementById('custSearchInput');
    const destSelect = document.getElementById('custSearchDest');
    const dateInput = document.getElementById('custSearchDate');

    let rawQuery = searchInput ? searchInput.value.trim() : (destSelect ? destSelect.value : '');
    if (!rawQuery && destSelect) rawQuery = destSelect.value || '';
    let selectedDate = dateInput ? dateInput.value : '2026-08-10';

    return window.runHiddenAiTourAgent(rawQuery, selectedDate);
  } catch (e) {
    console.error("AI Search Agent error:", e);
    window.location.href = 'tour_packages.html';
  }
};

// ==========================================
// FAIL-SAFE 2-VIEW TAB & ROLE FUNCTIONS
// ==========================================
window.selectedRole = 'customer';

window.switchAuthTab = function(mode) {
  const signinView = document.getElementById('signinView');
  const signupView = document.getElementById('signupView');
  const tabSigninBtn = document.getElementById('tabSigninBtn');
  const tabSignupBtn = document.getElementById('tabSignupBtn');

  if (mode === 'signin') {
    if (signinView) signinView.style.display = 'block';
    if (signupView) signupView.style.display = 'none';

    if (tabSigninBtn) {
      tabSigninBtn.style.background = 'linear-gradient(135deg, #00a651 0%, #0072bc 100%)';
      tabSigninBtn.style.color = '#ffffff';
    }
    if (tabSignupBtn) {
      tabSignupBtn.style.background = 'transparent';
      tabSignupBtn.style.color = '#94a3b8';
    }
    showToast('Switched to Sign In (লগইন করুন)', 'info');
  } else {
    if (signupView) signupView.style.display = 'block';
    if (signinView) signinView.style.display = 'none';

    if (tabSignupBtn) {
      tabSignupBtn.style.background = 'linear-gradient(135deg, #00a651 0%, #0072bc 100%)';
      tabSignupBtn.style.color = '#ffffff';
    }
    if (tabSigninBtn) {
      tabSigninBtn.style.background = 'transparent';
      tabSigninBtn.style.color = '#94a3b8';
    }
    showToast('Switched to Sign Up (সাইন আপ করুন)', 'info');
  }
};

window.selectRole = function(role) {
  window.selectedRole = role;
  document.querySelectorAll('.role-card').forEach(card => {
    if (card.dataset.role === role) {
      card.classList.add('active');
    } else {
      card.classList.remove('active');
    }
  });
  showToast(`Selected role: ${role.toUpperCase()}`, 'info');
};

window.handleSigninSubmit = function(e) {
  e.preventDefault();
  const identityInput = document.getElementById('signinIdentity');
  const passwordInput = document.getElementById('signinPassword');
  
  const idVal = (identityInput ? identityInput.value : '').trim().toLowerCase();
  const passVal = (passwordInput ? passwordInput.value : '').trim();

  // Admin Check
  if (idVal === 'admin@mount2ocean.com' || idVal === '01977477172' || idVal === 'admin') {
    if (passVal === 'admin123' || passVal === 'admin' || !passVal) {
      localStorage.setItem('m2o_logged_user', JSON.stringify({ name: 'Mount2ocean Owner Admin', email: 'admin@mount2ocean.com', mobile: '01977477172', role: 'ADMIN' }));
      showToast('👑 Welcome Owner Admin! Accessing Dashboard...', 'success');
      setTimeout(() => { window.location.href = 'admin_dashboard.html'; }, 600);
      return;
    }
  }

  // Guide Check
  if (idVal === 'guide@mount2ocean.com' || idVal === '01811002233' || window.selectedRole === 'guide') {
    localStorage.setItem('m2o_logged_user', JSON.stringify({ name: 'Certified Tour Guide', email: 'guide@mount2ocean.com', mobile: '01811002233', role: 'GUIDE' }));
    showToast('🚩 Welcome Tour Guide Partner!', 'success');
    setTimeout(() => { window.location.href = 'agent_dashboard.html'; }, 600);
    return;
  }

  // Agent Check
  if (idVal === 'agent@mount2ocean.com' || idVal === '01911002233' || window.selectedRole === 'agent') {
    localStorage.setItem('m2o_logged_user', JSON.stringify({ name: 'Verified Travel Agency', email: 'agent@mount2ocean.com', mobile: '01911002233', role: 'AGENT' }));
    showToast('🏢 Welcome Travel Agency Partner!', 'success');
    setTimeout(() => { window.location.href = 'agent_dashboard.html'; }, 600);
    return;
  }

  // Default Customer Check
  localStorage.setItem('m2o_logged_user', JSON.stringify({ name: 'Standard Traveler Customer', email: idVal || 'customer@mount2ocean.com', mobile: '01711002233', role: 'CUSTOMER' }));
  showToast('👤 Welcome Customer Traveler! Accessing Portal...', 'success');
  setTimeout(() => { window.location.href = 'customer_portal.html'; }, 600);
};

window.handleSignupSubmit = function(e) {
  e.preventDefault();
  showToast('Account created successfully!', 'success');
  setTimeout(() => {
    if (window.selectedRole === 'customer') {
      window.location.href = 'customer_portal.html';
    } else {
      window.location.href = 'agent_dashboard.html';
    }
  }, 600);
};

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // STATE MANAGEMENT
  // ==========================================
  const state = {
    mode: 'signin', // 'signin' | 'signup'
    role: 'customer', // 'customer' | 'guide' | 'agent'
    theme: localStorage.getItem('m2o_theme') || 'dark',
    users: JSON.parse(localStorage.getItem('m2o_registered_users')) || []
  };

  // Role Configuration Metadata
  const roleConfig = {
    customer: {
      name: 'Customer',
      icon: '🧳',
      badgeText: 'CUSTOMER ACCOUNT',
      submitSigninText: 'Sign In as Customer (কাস্টমার লগইন)',
      submitSignupText: 'Create Customer Account (কাস্টমার সাইন আপ)',
      previewTitle: 'Customer Account Features',
      previewDesc: 'Book curated tours, save travel itineraries, track active bookings, and earn loyalty rewards.',
      accentColor: '#00f2fe'
    },
    guide: {
      name: 'Tour Guide',
      icon: '🚩',
      badgeText: 'TOUR GUIDE ACCOUNT',
      submitSigninText: 'Sign In as Tour Guide (গাইড লগইন)',
      submitSignupText: 'Register as Tour Guide (গাইড সাইন আপ)',
      previewTitle: 'Tour Guide Features',
      previewDesc: 'List tour services, manage trip schedules, connect directly with travelers, and receive payments.',
      accentColor: '#00b09b'
    },
    agent: {
      name: 'Travel Agent',
      icon: '🏢',
      badgeText: 'TRAVEL AGENCY ACCOUNT',
      submitSigninText: 'Sign In as Travel Agent (এজেন্ট লগইন)',
      submitSignupText: 'Register Travel Agency (এজেন্ট সাইন আপ)',
      previewTitle: 'Agency Partner Features',
      previewDesc: 'Bulk booking management, customized agency packages, analytics dashboards, and B2B pricing.',
      accentColor: '#e100ff'
    }
  };

  // ==========================================
  // DOM ELEMENT REFERENCES
  // ==========================================
  const body = document.body;
  const themeToggleBtn = document.getElementById('themeToggle');
  
  // Tabs & Forms
  const authTabsContainer = document.querySelector('.auth-tabs');
  const tabSignin = document.getElementById('tabSignin');
  const tabSignup = document.getElementById('tabSignup');
  const formTitle = document.getElementById('formTitle');
  const formSubtitle = document.getElementById('formSubtitle');
  const authForm = document.getElementById('authForm');
  const submitBtn = document.getElementById('submitBtn');
  const submitBtnText = document.getElementById('submitBtnText');
  const submitSpinner = document.getElementById('submitSpinner');
  const btnToggleMode = document.getElementById('btnToggleMode');
  const switchPromptText = document.getElementById('switchPromptText');
  const rememberText = document.getElementById('rememberText');
  
  // Dynamic Field Groups
  const signupOnlyElements = document.querySelectorAll('.signup-only');
  const groupCurrency = document.getElementById('groupCurrency');
  const groupGuideDetails = document.getElementById('groupGuideDetails');
  const groupAgentDetails = document.getElementById('groupAgentDetails');
  
  const customerRoleFields = document.getElementById('customerRoleFields');
  const guideRoleFields = document.getElementById('guideRoleFields');
  const agentRoleFields = document.getElementById('agentRoleFields');
  
  // Inputs & Errors
  const emailInput = document.getElementById('emailInput');
  const emailError = document.getElementById('emailError');
  const fullNameInput = document.getElementById('fullNameInput');
  const fullNameError = document.getElementById('fullNameError');
  const passwordInput = document.getElementById('passwordInput');
  const passwordError = document.getElementById('passwordError');
  const confirmPasswordInput = document.getElementById('confirmPasswordInput');
  const confirmPasswordError = document.getElementById('confirmPasswordError');
  const togglePasswordBtn = document.getElementById('togglePassword');
  
  const guideLicenseInput = document.getElementById('guideLicenseInput');
  const guideLicenseError = document.getElementById('guideLicenseError');
  const agencyCodeInput = document.getElementById('agencyCodeInput');
  const agencyCodeError = document.getElementById('agencyCodeError');

  // Role Cards
  const roleCards = document.querySelectorAll('.role-card');
  const previewIcon = document.getElementById('previewIcon');
  const previewTitle = document.getElementById('previewTitle');
  const previewDesc = document.getElementById('previewDesc');

  // Modals
  const forgotModal = document.getElementById('forgotModal');
  const btnForgotPassword = document.getElementById('btnForgotPassword');
  const closeForgotModal = document.getElementById('closeForgotModal');
  const btnSendOTP = document.getElementById('btnSendOTP');
  const btnVerifyOTP = document.getElementById('btnVerifyOTP');
  const btnFinishReset = document.getElementById('btnFinishReset');
  const resetEmailInput = document.getElementById('resetEmailInput');
  const resetEmailError = document.getElementById('resetEmailError');
  const otpDigits = document.querySelectorAll('.otp-digit');
  const otpError = document.getElementById('otpError');
  
  const forgotStep1 = document.getElementById('forgotStep1');
  const forgotStep2 = document.getElementById('forgotStep2');
  const forgotStep3 = document.getElementById('forgotStep3');

  const dashboardModal = document.getElementById('dashboardModal');
  const closeDashboardModal = document.getElementById('closeDashboardModal');
  const btnLogout = document.getElementById('btnLogout');
  const toastContainer = document.getElementById('toastContainer');

  // ==========================================
  // INITIALIZATION
  // ==========================================
  function init() {
    applyTheme(state.theme);
    updateModeUI();
    updateRoleUI();
    setupEventListeners();
  }

  // ==========================================
  // THEME MANAGEMENT (DARK / LIGHT MODE)
  // ==========================================
  function applyTheme(theme) {
    if (theme === 'light') {
      body.classList.remove('dark-theme');
      body.classList.add('light-theme');
    } else {
      body.classList.remove('light-theme');
      body.classList.add('dark-theme');
    }
    localStorage.setItem('m2o_theme', theme);

    // Update Theme Toggle Buttons Text/Icon
    const allThemeBtns = document.querySelectorAll('#themeToggle, #globalThemeToggle');
    allThemeBtns.forEach(btn => {
      btn.innerHTML = theme === 'dark' 
        ? '<span class="theme-btn-icon">☀️</span> <span class="theme-btn-text">Light Mode</span>'
        : '<span class="theme-btn-icon">🌙</span> <span class="theme-btn-text">Dark Mode</span>';
    });
  }

  document.addEventListener('click', (e) => {
    const themeBtn = e.target.closest('#themeToggle, #globalThemeToggle');
    if (themeBtn) {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
      applyTheme(state.theme);
      showToast(`Switched to ${state.theme.toUpperCase()} theme mode`, 'info');
    }
  });

  // ==========================================
  // GLOBAL LANGUAGE TRANSLATION SWITCHER
  // ==========================================
  const globalLangSelect = document.getElementById('globalLangSelect');
  if (globalLangSelect) {
    const savedLang = localStorage.getItem('m2o_lang') || 'bn';
    globalLangSelect.value = savedLang;

    globalLangSelect.addEventListener('change', (e) => {
      const lang = e.target.value;
      localStorage.setItem('m2o_lang', lang);
      showToast(`Language switched to: ${e.target.options[e.target.selectedIndex].text}`, 'success');
      
      // Auto-trigger Google Translate DOM combo if present
      const googleCombo = document.querySelector('.goog-te-combo');
      if (googleCombo) {
        googleCombo.value = lang;
        googleCombo.dispatchEvent(new Event('change'));
      }
    });
  }

  // ==========================================
  // MODE SWITCHING (SIGN IN VS SIGN UP)
  // ==========================================
  function setMode(newMode) {
    state.mode = newMode;
    updateModeUI();
    clearErrors();
    showToast(`Switched mode to: ${newMode === 'signin' ? 'Sign In (লগইন)' : 'Sign Up (সাইন আপ)'}`, 'info');
  }

  window.setMode = setMode;

  window.toggleAuthMode = function() {
    const targetMode = state.mode === 'signin' ? 'signup' : 'signin';
    setMode(targetMode);
  };

  function updateModeUI() {
    const tabsContainer = document.querySelector('.auth-tabs');
    const tabSigninEl = document.getElementById('tabSignin');
    const tabSignupEl = document.getElementById('tabSignup');
    const formTitleEl = document.getElementById('formTitle');
    const formSubtitleEl = document.getElementById('formSubtitle');
    const submitBtnTextEl = document.getElementById('submitBtnText');
    const switchPromptTextEl = document.getElementById('switchPromptText');
    const btnToggleModeEl = document.getElementById('btnToggleMode');
    const rememberTextEl = document.getElementById('rememberText');
    const signupOnlyEls = document.querySelectorAll('.signup-only');

    if (tabsContainer) tabsContainer.setAttribute('data-active', state.mode);

    if (state.mode === 'signin') {
      if (tabSigninEl) {
        tabSigninEl.classList.add('active');
        tabSigninEl.style.background = 'linear-gradient(135deg, #00a651 0%, #0072bc 100%)';
        tabSigninEl.style.color = '#ffffff';
      }
      if (tabSignupEl) {
        tabSignupEl.classList.remove('active');
        tabSignupEl.style.background = 'transparent';
        tabSignupEl.style.color = '#94a3b8';
      }

      if (formTitleEl) formTitleEl.textContent = 'Welcome Back (লগইন করুন)';
      if (formSubtitleEl && roleConfig[state.role]) formSubtitleEl.textContent = `Sign in to your ${roleConfig[state.role].name} account with Email/Mobile & Password.`;
      
      // Hide Signup-only fields (Full Name, Confirm Password)
      signupOnlyEls.forEach(el => {
        el.classList.add('hidden');
        el.style.display = 'none';
      });

      if (switchPromptTextEl) switchPromptTextEl.textContent = "Don't have an account yet?";
      if (btnToggleModeEl) btnToggleModeEl.textContent = "Create Free Account (সাইন আপ করুন)";
      if (rememberTextEl) rememberTextEl.textContent = "Remember me on this device";
      if (submitBtnTextEl && roleConfig[state.role]) submitBtnTextEl.textContent = `Sign In as ${roleConfig[state.role].name} (লগইন করুন)`;

    } else {
      if (tabSignupEl) {
        tabSignupEl.classList.add('active');
        tabSignupEl.style.background = 'linear-gradient(135deg, #00a651 0%, #0072bc 100%)';
        tabSignupEl.style.color = '#ffffff';
      }
      if (tabSigninEl) {
        tabSigninEl.classList.remove('active');
        tabSigninEl.style.background = 'transparent';
        tabSigninEl.style.color = '#94a3b8';
      }

      if (formTitleEl) formTitleEl.textContent = 'Create New Free Account (সাইন আপ করুন)';
      if (formSubtitleEl && roleConfig[state.role]) formSubtitleEl.textContent = `Register a new ${roleConfig[state.role].name} account in seconds.`;
      
      // Show Signup-only fields (Full Name, Confirm Password)
      signupOnlyEls.forEach(el => {
        el.classList.remove('hidden');
        el.style.display = 'block';
      });

      if (switchPromptTextEl) switchPromptTextEl.textContent = "Already have an account?";
      if (btnToggleModeEl) btnToggleModeEl.textContent = "Sign In Instead (লগইন করুন)";
      if (rememberTextEl) rememberTextEl.textContent = "I agree to the Terms of Service & Privacy Policy";
      if (submitBtnTextEl && roleConfig[state.role]) submitBtnTextEl.textContent = `Create Free ${roleConfig[state.role].name} Account (সাইন আপ করুন)`;
    }
  }

  // ==========================================
  // ROLE SWITCHING (CUSTOMER, GUIDE, AGENT)
  // ==========================================
  function setRole(newRole) {
    if (state.role === newRole) return;
    state.role = newRole;
    updateRoleUI();
  }

  function updateRoleUI() {
    // 1. Update Role Radio Cards
    roleCards.forEach(card => {
      const radio = card.querySelector('input[type="radio"]');
      if (card.dataset.role === state.role) {
        card.classList.add('active');
        radio.checked = true;
      } else {
        card.classList.remove('active');
        radio.checked = false;
      }
    });

    // 2. Toggle Role-Specific Fieldsets
    customerRoleFields.classList.add('hidden');
    guideRoleFields.classList.add('hidden');
    agentRoleFields.classList.add('hidden');

    if (state.role === 'customer') {
      customerRoleFields.classList.remove('hidden');
    } else if (state.role === 'guide') {
      guideRoleFields.classList.remove('hidden');
    } else if (state.role === 'agent') {
      agentRoleFields.classList.remove('hidden');
    }

    // 3. Update Left Showcase Card Highlight
    const conf = roleConfig[state.role];
    previewIcon.textContent = conf.icon;
    previewTitle.textContent = conf.previewTitle;
    previewDesc.textContent = conf.previewDesc;

    // 4. Update Form Subtitle & Submit Button Label
    if (state.mode === 'signin') {
      formSubtitle.textContent = `Sign in to your ${conf.name} account.`;
      submitBtnText.textContent = conf.submitSigninText;
    } else {
      formSubtitle.textContent = `Register as a new ${conf.name} in seconds.`;
      submitBtnText.textContent = conf.submitSignupText;
    }

    clearErrors();
    showToast(`Role switched to: ${conf.name}`, 'info');
  }

  // ==========================================
  // PASSWORD VISIBILITY TOGGLE
  // ==========================================
  togglePasswordBtn.addEventListener('click', () => {
    const isPassword = passwordInput.type === 'password';
    passwordInput.type = isPassword ? 'text' : 'password';
    togglePasswordBtn.textContent = isPassword ? '🙈' : '👁️';
  });

  // ==========================================
  // FORM VALIDATION & SUBMISSION
  // ==========================================
  function clearErrors() {
    document.querySelectorAll('.field-error').forEach(el => el.textContent = '');
  }

  function validateForm() {
    clearErrors();
    let isValid = true;

    // 1. Email or Mobile Number Validation
    const inputVal = emailInput.value.trim();
    if (!inputVal) {
      emailError.textContent = 'Please enter your Email or Mobile Number.';
      isValid = false;
    }

    // 2. Full Name (Signup only)
    if (state.mode === 'signup') {
      const nameVal = fullNameInput ? fullNameInput.value.trim() : '';
      if (!nameVal) {
        if (fullNameError) fullNameError.textContent = 'Please enter your full name.';
        isValid = false;
      }
    }

    // 3. Password Validation
    const passVal = passwordInput.value;
    if (!passVal) {
      passwordError.textContent = 'Please enter your password.';
      isValid = false;
    } else if (passVal.length < 4) {
      passwordError.textContent = 'Password must be at least 4 characters.';
      isValid = false;
    }

    // 4. Confirm Password (Signup only)
    if (state.mode === 'signup') {
      const confirmVal = confirmPasswordInput ? confirmPasswordInput.value : '';
      if (!confirmVal) {
        if (confirmPasswordError) confirmPasswordError.textContent = 'Please confirm your password.';
        isValid = false;
      } else if (confirmVal !== passVal) {
        if (confirmPasswordError) confirmPasswordError.textContent = 'Passwords do not match.';
        isValid = false;
      }
    }

    return isValid;
  }

  authForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Show loading state
    submitBtn.disabled = true;
    submitBtnText.classList.add('hidden');
    submitSpinner.classList.remove('hidden');

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtnText.classList.remove('hidden');
      submitSpinner.classList.add('hidden');

      const email = emailInput.value.trim();
      const userName = fullNameInput.value.trim() || email.split('@')[0];

      if (state.mode === 'signup') {
        const newUser = {
          email,
          name: userName,
          role: state.role,
          id: 'M2O-' + Math.floor(10000 + Math.random() * 90000)
        };
        state.users.push(newUser);
        localStorage.setItem('m2o_registered_users', JSON.stringify(state.users));

        showToast(`Registration Successful! Signed in as ${roleConfig[state.role].name}`, 'success');
        openDashboardModal(newUser);
      } else {
        const user = {
          email,
          name: userName,
          role: state.role,
          id: 'M2O-' + Math.floor(10000 + Math.random() * 90000)
        };
        showToast(`Sign In Successful! Welcome back ${user.name}`, 'success');
        openDashboardModal(user);
      }

    }, 1200);
  });

  // ==========================================
  // EVENT LISTENERS (NULL-SAFE FOR ALL PAGES)
  // ==========================================
  function setupEventListeners() {
    // Mode tabs click (Sign In vs Sign Up)
    if (tabSignin) {
      tabSignin.addEventListener('click', (e) => {
        e.preventDefault();
        setMode('signin');
      });
    }
    
    if (tabSignup) {
      tabSignup.addEventListener('click', (e) => {
        e.preventDefault();
        setMode('signup');
      });
    }

    // Toggle button in footer
    if (btnToggleMode) {
      btnToggleMode.addEventListener('click', (e) => {
        e.preventDefault();
        setMode(state.mode === 'signin' ? 'signup' : 'signin');
      });
    }

    // Role Cards click
    roleCards.forEach(card => {
      card.addEventListener('click', () => {
        const selectedRole = card.dataset.role;
        setRole(selectedRole);
      });
    });

    // Forgot Password Modal Triggers
    if (btnForgotPassword) {
      btnForgotPassword.addEventListener('click', (e) => {
        e.preventDefault();
        openForgotModal();
      });
    }

    if (closeForgotModal) closeForgotModal.addEventListener('click', closeForgotModalHandler);
    
    if (btnSendOTP) {
      btnSendOTP.addEventListener('click', () => {
        const email = resetEmailInput ? resetEmailInput.value.trim() : '';
        if (!email) {
          if (resetEmailError) resetEmailError.textContent = 'Enter a valid registered email or mobile number.';
          return;
        }
        if (resetEmailError) resetEmailError.textContent = '';
        if (forgotStep1) forgotStep1.classList.add('hidden');
        if (forgotStep2) forgotStep2.classList.remove('hidden');
        showToast('Demo Security OTP sent to your phone/email!', 'info');
      });
    }

    // OTP Inputs Auto-advance
    otpDigits.forEach((input, idx) => {
      input.addEventListener('input', (e) => {
        if (e.target.value && idx < otpDigits.length - 1) {
          otpDigits[idx + 1].focus();
        }
      });

      input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && !e.target.value && idx > 0) {
          otpDigits[idx - 1].focus();
        }
      });
    });

    if (btnVerifyOTP) {
      btnVerifyOTP.addEventListener('click', () => {
        const enteredCode = Array.from(otpDigits).map(input => input.value).join('');
        if (enteredCode !== '789012') {
          if (otpError) otpError.textContent = 'Invalid OTP code. Please enter 789012.';
          return;
        }
        if (otpError) otpError.textContent = '';
        if (forgotStep2) forgotStep2.classList.add('hidden');
        if (forgotStep3) forgotStep3.classList.remove('hidden');
        showToast('Password verified & reset completed!', 'success');
      });
    }

    if (btnFinishReset) {
      btnFinishReset.addEventListener('click', () => {
        closeForgotModalHandler();
        setMode('signin');
      });
    }

    // Dashboard Modal Close
    if (closeDashboardModal) {
      closeDashboardModal.addEventListener('click', () => {
        if (dashboardModal) dashboardModal.classList.add('hidden');
      });
    }

    if (btnLogout) {
      btnLogout.addEventListener('click', () => {
        if (dashboardModal) dashboardModal.classList.add('hidden');
        if (authForm) authForm.reset();
        showToast('Logged out successfully', 'info');
      });
    }
  }

  // ==========================================
  // MODAL HANDLERS
  // ==========================================
  function openForgotModal() {
    forgotModal.classList.remove('hidden');
    forgotStep1.classList.remove('hidden');
    forgotStep2.classList.add('hidden');
    forgotStep3.classList.add('hidden');
    resetEmailInput.value = emailInput.value || '';
    resetEmailError.textContent = '';
    otpError.textContent = '';
    otpDigits.forEach(input => input.value = '');
  }

  function closeForgotModalHandler() {
    forgotModal.classList.add('hidden');
  }

  function openDashboardModal(user) {
    // If logging in as Agent or Guide, navigate directly to Partner Dashboard interface
    if (user.role === 'agent' || user.role === 'guide') {
      showToast(`Redirecting to ${user.role === 'agent' ? 'Travel Agent' : 'Official Tour Guide'} Partner Portal...`, 'success');
      setTimeout(() => {
        window.location.href = 'agent_dashboard.html';
      }, 800);
      return;
    }

    // If logging in as Customer, navigate directly to Customer Portal interface
    if (user.role === 'customer') {
      showToast('Redirecting to Mount2ocean Customer Portal...', 'success');
      setTimeout(() => {
        window.location.href = 'customer_portal.html';
      }, 800);
      return;
    }

    document.getElementById('dashAvatar').textContent = roleConfig[user.role].icon;
    document.getElementById('dashRoleBadge').textContent = roleConfig[user.role].badgeText;
    document.getElementById('dashUserName').textContent = `Welcome, ${user.name}!`;
    document.getElementById('dashUserEmail').textContent = user.email;
    document.getElementById('dashRoleName').textContent = roleConfig[user.role].name;
    document.getElementById('dashSessionId').textContent = user.id;
    
    dashboardModal.classList.remove('hidden');
  }

  // ==========================================
  // AGENT PARTNER PORTAL SPECIFIC INTERACTION
  // ==========================================
  const agentSearchForm = document.getElementById('agentSearchForm');
  const categoryTabs = document.querySelectorAll('.category-tab');
  const destinationInput = document.getElementById('destinationInput');
  const searchResultsModal = document.getElementById('searchResultsModal');
  const closeResultsModal = document.getElementById('closeResultsModal');
  const recentCards = document.querySelectorAll('.recent-card');
  const destCarousel = document.getElementById('destCarousel');
  const btnPrevDest = document.getElementById('btnPrevDest');
  const btnNextDest = document.getElementById('btnNextDest');

  if (categoryTabs.length > 0) {
    categoryTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        categoryTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const service = tab.dataset.service;
        showToast(`Switched service view to: ${service.toUpperCase()}`, 'info');
      });
    });
  }

  if (recentCards.length > 0) {
    recentCards.forEach(card => {
      card.addEventListener('click', () => {
        const city = card.dataset.city;
        if (destinationInput) destinationInput.value = city;
        showToast(`Selected recent search: ${city}`, 'info');
      });
    });
  }

  if (agentSearchForm) {
    agentSearchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const city = destinationInput.value || 'Selected City';
      const resultsTitle = document.getElementById('resultsModalTitle');
      if (resultsTitle) resultsTitle.textContent = `Available Hotels in ${city}`;
      if (searchResultsModal) searchResultsModal.classList.remove('hidden');
    });
  }

  if (closeResultsModal) {
    closeResultsModal.addEventListener('click', () => {
      if (searchResultsModal) searchResultsModal.classList.add('hidden');
    });
  }

  if (btnPrevDest && destCarousel) {
    btnPrevDest.addEventListener('click', () => {
      destCarousel.scrollBy({ left: -300, behavior: 'smooth' });
    });
  }

  if (btnNextDest && destCarousel) {
    btnNextDest.addEventListener('click', () => {
      destCarousel.scrollBy({ left: 300, behavior: 'smooth' });
    });
  }

  const bookMiniBtns = document.querySelectorAll('.book-mini-btn, .reserve-btn');
  if (bookMiniBtns.length > 0) {
    bookMiniBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (window.showToast) window.showToast('🏨 Agent B2B Hotel Reservation initiated! Opening booking confirmation...', 'success');
        setTimeout(() => { window.location.href = 'booking.html'; }, 800);
      });
    });
  }

  // ==========================================
  // CUSTOMER PORTAL SPECIFIC INTERACTION
  // ==========================================
  const custSearchTabs = document.querySelectorAll('.cust-search-tab');
  const custSearchInput = document.getElementById('custSearchInput');
  if (custSearchTabs.length > 0) {
    custSearchTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        custSearchTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const serviceName = tab.textContent.trim();
        if (custSearchInput) {
          custSearchInput.placeholder = `Search ${serviceName}: type Bhutan, Dubai, Cox's Bazar, Maldives, Bali...`;
        }
        if (window.showToast) window.showToast(`Switched search mode to: ${serviceName}`, 'info');
      });
    });
  }

  const destPills = document.querySelectorAll('.dest-pill');
  const tourCards = document.querySelectorAll('.tour-card');
  const custBookingModal = document.getElementById('custBookingModal');
  const closeCustBookingModal = document.getElementById('closeCustBookingModal');
  const custBookingForm = document.getElementById('custBookingForm');

  if (destPills.length > 0) {
    destPills.forEach(pill => {
      pill.addEventListener('click', () => {
        destPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        const filter = pill.dataset.filter;
        
        tourCards.forEach(card => {
          if (filter === 'all' || card.dataset.category === filter) {
            card.style.display = 'block';
          } else {
            card.style.display = 'none';
          }
        });

        showToast(`Filtered tours for: ${pill.textContent}`, 'info');
      });
    });
  }

  if (closeCustBookingModal) {
    closeCustBookingModal.addEventListener('click', () => {
      if (custBookingModal) custBookingModal.classList.add('hidden');
    });
  }

  if (custBookingForm) {
    custBookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const tourTitle = document.getElementById('bookModalTourTitle').textContent;
      if (custBookingModal) custBookingModal.classList.add('hidden');
      showToast(`Booking Request Confirmed for "${tourTitle}"! Check-in details sent to your email.`, 'success');
    });
  }

  // Global window modal triggers
  window.openBookingModal = function(title, price) {
    const modalTitle = document.getElementById('bookModalTourTitle');
    const modalPrice = document.getElementById('bookModalTourPrice');
    if (modalTitle) modalTitle.textContent = title;
    if (modalPrice) modalPrice.textContent = `Price: ${price} per traveler`;
    if (custBookingModal) custBookingModal.classList.remove('hidden');
  };

  // ==========================================
  // SEAMLESS INFINITE MARQUEE & PAUSE ON HOVER & ARROW CONTROLS
  // ==========================================
  const toursGrid = document.getElementById('toursGrid');
  const btnPrevTour = document.getElementById('btnPrevTour');
  const btnNextTour = document.getElementById('btnNextTour');

  if (toursGrid) {
    // Clone tour cards to create an invisible, infinite 100% seamless marquee loop
    const originalCards = Array.from(toursGrid.children);
    originalCards.forEach(card => {
      const clone = card.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      toursGrid.appendChild(clone);
    });

    let isToursHovered = false;
    const scrollSpeed = 0.95; // Smooth Google-grade ticker step

    toursGrid.addEventListener('mouseenter', () => { isToursHovered = true; });
    toursGrid.addEventListener('mouseleave', () => { isToursHovered = false; });
    toursGrid.addEventListener('touchstart', () => { isToursHovered = true; });
    toursGrid.addEventListener('touchend', () => { isToursHovered = false; });

    function seamlessScrollTours() {
      if (!isToursHovered) {
        toursGrid.scrollLeft += scrollSpeed;
        const halfWidth = toursGrid.scrollWidth / 2;
        if (toursGrid.scrollLeft >= halfWidth) {
          toursGrid.scrollLeft -= halfWidth; // Instant 100% seamless shift with zero visible jump!
        }
      }
      requestAnimationFrame(seamlessScrollTours);
    }
    requestAnimationFrame(seamlessScrollTours);

    if (btnPrevTour) {
      btnPrevTour.addEventListener('click', () => {
        toursGrid.scrollBy({ left: -360, behavior: 'smooth' });
      });
    }

    if (btnNextTour) {
    btnNextTour.addEventListener('click', () => {
      toursGrid.scrollBy({ left: 360, behavior: 'smooth' });
    });
  }

  // ==========================================
  // ADMIN OWNER PORTAL (PACKAGE ADD & REMOVE CRUD)
  // ==========================================
  let livePackages = window.getCombinedLivePackages();

  const adminPackagesTbody = document.getElementById('adminPackagesTbody');
  const addPackageForm = document.getElementById('addPackageForm');
  const totalPackagesCount = document.getElementById('totalPackagesCount');
  const btnResetPackages = document.getElementById('btnResetPackages');

  function saveAndRenderAdminPackages() {
    localStorage.setItem('m2o_live_packages', JSON.stringify(livePackages));
    if (totalPackagesCount) totalPackagesCount.textContent = livePackages.length;

    if (!adminPackagesTbody) return;

    adminPackagesTbody.innerHTML = '';
    livePackages.forEach(pkg => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><img src="${pkg.image}" alt="${pkg.name}" class="table-pkg-img"></td>
        <td class="pkg-title-cell">${pkg.name}</td>
        <td><span class="badge-tag">${pkg.category.toUpperCase()}</span></td>
        <td class="pkg-price-cell">${pkg.price}</td>
        <td>${pkg.duration}</td>
        <td><span class="tour-badge ${pkg.badge}">${pkg.badgeLabel || pkg.badge}</span></td>
        <td><span class="status-badge-live">Live</span></td>
        <td>
          <button type="button" class="primary-btn" onclick="openEditPackageModal('${pkg.id}')" style="padding: 0.25rem 0.55rem; font-size: 0.74rem; background: #0072bc; margin-right: 4px;">
            ✏️ Edit
          </button>
          <button type="button" class="btn-delete-pkg" onclick="deletePackage('${pkg.id}')" style="padding: 0.25rem 0.55rem; font-size: 0.74rem;">
            🗑️ Remove
          </button>
        </td>
      `;
      adminPackagesTbody.appendChild(tr);
    });
  }

  window.deletePackage = function(id) {
    livePackages = livePackages.filter(p => p.id !== id);
    saveAndRenderAdminPackages();
    showToast('Package removed from website successfully!', 'error');
  };

  window.openEditPackageModal = function(id) {
    const pkg = livePackages.find(p => p.id === id);
    if (!pkg) return;

    const editIdEl = document.getElementById('editPkgId');
    const editNameEl = document.getElementById('editPkgName');
    const editCatEl = document.getElementById('editPkgCategory');
    const editPriceEl = document.getElementById('editPkgPrice');
    const editDurEl = document.getElementById('editPkgDuration');
    const editBadgeEl = document.getElementById('editPkgBadge');
    const editImgEl = document.getElementById('editPkgImage');
    const editDescEl = document.getElementById('editPkgDesc');

    if (editIdEl) editIdEl.value = pkg.id;
    if (editNameEl) editNameEl.value = pkg.name;
    if (editCatEl) editCatEl.value = pkg.category || 'coxsbazar';
    if (editPriceEl) editPriceEl.value = pkg.price;
    if (editDurEl) editDurEl.value = pkg.duration;
    if (editBadgeEl) editBadgeEl.value = pkg.badge || 'bestseller';
    if (editImgEl) editImgEl.value = pkg.image;
    if (editDescEl) editDescEl.value = pkg.desc;

    const editModal = document.getElementById('editPackageModal');
    if (editModal) editModal.classList.remove('hidden');
  };

  window.closeEditPackageModalHandler = function() {
    const editModal = document.getElementById('editPackageModal');
    if (editModal) editModal.classList.add('hidden');
  };

  window.saveEditedPackage = function(event) {
    event.preventDefault();
    const id = document.getElementById('editPkgId').value;
    const name = document.getElementById('editPkgName').value.trim();
    const category = document.getElementById('editPkgCategory').value;
    const price = document.getElementById('editPkgPrice').value.trim();
    const duration = document.getElementById('editPkgDuration').value.trim();
    const badge = document.getElementById('editPkgBadge').value;
    const badgeSelect = document.getElementById('editPkgBadge');
    const badgeLabel = badgeSelect.options[badgeSelect.selectedIndex].text;
    let image = document.getElementById('editPkgImage').value.trim();
    const desc = document.getElementById('editPkgDesc').value.trim();

    const fileInput = document.getElementById('editPkgFileInput');
    if (fileInput && fileInput.files && fileInput.files[0]) {
      const reader = new FileReader();
      reader.onload = function(e) {
        image = e.target.result;
        updatePackageInList(id, { name, category, price, duration, badge, badgeLabel, image, desc });
      };
      reader.readAsDataURL(fileInput.files[0]);
    } else {
      updatePackageInList(id, { name, category, price, duration, badge, badgeLabel, image, desc });
    }
  };

  function updatePackageInList(id, data) {
    const idx = livePackages.findIndex(p => p.id === id);
    if (idx !== -1) {
      livePackages[idx] = { ...livePackages[idx], ...data };
      saveAndRenderAdminPackages();
      window.closeEditPackageModalHandler();
      showToast(`Package "${data.name}" updated successfully!`, 'success');
    }
  }

  if (addPackageForm) {
    addPackageForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('pkgNameInput').value.trim();
      const category = document.getElementById('pkgCategorySelect').value;
      const price = document.getElementById('pkgPriceInput').value.trim();
      const duration = document.getElementById('pkgDurationInput').value.trim();
      const rating = document.getElementById('pkgRatingInput') ? document.getElementById('pkgRatingInput').value.trim() : '⭐ 4.9';
      const badge = document.getElementById('pkgBadgeSelect').value;
      const badgeSelect = document.getElementById('pkgBadgeSelect');
      const badgeLabel = badgeSelect.options[badgeSelect.selectedIndex].text;
      const imageUrlInput = document.getElementById('pkgImageUrlInput') ? document.getElementById('pkgImageUrlInput').value.trim() : '';
      const imageSelect = document.getElementById('pkgImageSelect') ? document.getElementById('pkgImageSelect').value : 'assets/coxsbazar.jpg';
      let image = imageUrlInput || imageSelect;
      const desc = document.getElementById('pkgDescInput').value.trim();

      const fileInput = document.getElementById('pkgFileUploadInput');
      
      const createAndSavePkg = (finalImg) => {
        const newPkg = {
          id: 'pkg-' + Date.now(),
          name, category, price, duration, rating, badge, badgeLabel, image: finalImg, desc
        };
        livePackages.unshift(newPkg);
        saveAndRenderAdminPackages();
        addPackageForm.reset();
        showToast(`Package "${name}" published to live website!`, 'success');
      };

      if (fileInput && fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(evt) {
          createAndSavePkg(evt.target.result);
        };
        reader.readAsDataURL(fileInput.files[0]);
      } else {
        createAndSavePkg(image);
      }
    });
  }

  if (btnResetPackages) {
    btnResetPackages.addEventListener('click', () => {
      livePackages = [...defaultPackages];
      saveAndRenderAdminPackages();
      showToast('Reset to default packages!', 'info');
    });
  }

  saveAndRenderAdminPackages();

  // ==========================================
  // MAGIC AI 5-PHOTO GENERATOR ENGINE
  // ==========================================
  const aiDestinationPhotoPools = {
    coxsbazar: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
      'assets/coxsbazar_parasailing.jpg',
      'assets/coxsbazar_seafood.jpg',
      'assets/coxsbazar_resort.jpg',
      'assets/saintmartin_cruise.jpg',
      'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=800&q=80'
    ],
    bali: [
      'assets/bali_kintamani_volcano.jpg',
      'assets/bali_uluwatu_sunset.jpg',
      'assets/bali_tegalalang_swing.jpg',
      'assets/bali_bananaboat_water.jpg',
      'assets/bali_tegenungan_waterfall.jpg',
      'assets/bali_temple.jpg'
    ],
    bhutan: [
      'assets/tour_gallery_bhutan.jpg',
      'https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1518002171953-a080ee817e1f?auto=format&fit=crop&w=800&q=80'
    ],
    dubai: [
      'assets/dubai_safari.jpg',
      'assets/dubai_dhow.jpg',
      'assets/dubai_hotel.jpg',
      'assets/dubai_goldsouk.jpg',
      'assets/tour_dubai.jpg',
      'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80'
    ],
    maldives: [
      'assets/maldives_villa.jpg',
      'assets/maldives_snorkeling.jpg',
      'assets/maldives_dinner.jpg',
      'assets/maldives_speedboat.jpg',
      'assets/tour_maldives.jpg',
      'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80'
    ],
    manali: [
      'assets/dest_manali.jpg',
      'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80'
    ],
    generic: [
      'assets/tour_gallery_scuba.jpg',
      'assets/tour_gallery_safari.jpg',
      'assets/tour_gallery_bali.jpg',
      'assets/dest_kathmandu.jpg',
      'assets/dest_darjeeling.jpg',
      'assets/dest_tokyo.jpg'
    ]
  };

  window.handleGenerate5AIImages = function() {
    const pkgName = (document.getElementById('pkgNameInput') ? document.getElementById('pkgNameInput').value : '').trim().toLowerCase();
    const pkgCat = (document.getElementById('pkgCategorySelect') ? document.getElementById('pkgCategorySelect').value : '').trim().toLowerCase();

    const gallerySection = document.getElementById('aiImageGallerySection');
    const container = document.getElementById('aiPhotosGridContainer');

    if (!container || !gallerySection) return;

    // Detect destination category key
    let destKey = 'generic';
    if (pkgName.includes('bali') || pkgCat.includes('bali')) destKey = 'bali';
    else if (pkgName.includes('bhutan') || pkgCat.includes('bhutan')) destKey = 'bhutan';
    else if (pkgName.includes('dubai') || pkgCat.includes('dubai')) destKey = 'dubai';
    else if (pkgName.includes('maldives') || pkgCat.includes('maldives')) destKey = 'maldives';
    else if (pkgName.includes('cox') || pkgName.includes('saint') || pkgCat.includes('cox')) destKey = 'coxsbazar';
    else if (pkgName.includes('manali') || pkgName.includes('snow') || pkgName.includes('kashmir') || pkgCat.includes('nepal')) destKey = 'manali';

    gallerySection.classList.remove('hidden');
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 2rem; background: #ffffff; border-radius: 12px; border: 1.5px solid #cbd5e1;">
        <div style="font-size: 2rem; margin-bottom: 0.5rem; display: inline-block;">✨</div>
        <strong style="color: #0072bc; font-size: 1.05rem; display: block;">AI Engine Rendering 5 High-Definition Travel Photos...</strong>
        <span style="font-size: 0.85rem; color: #64748b;">Tailoring lighting, scenery, and resolution for ${destKey.toUpperCase()} destination...</span>
      </div>
    `;

    setTimeout(() => {
      const pool = aiDestinationPhotoPools[destKey] || aiDestinationPhotoPools.generic;
      const shuffled = [...pool].sort(() => 0.5 - Math.random());
      const selected5 = shuffled.slice(0, 5);

      container.innerHTML = '';
      selected5.forEach((imgUrl, idx) => {
        const card = document.createElement('div');
        card.style.cssText = `
          background: #ffffff;
          border: 2px solid #e2e8f0;
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(0,0,0,0.05);
          transition: transform 0.2s ease, border-color 0.2s ease;
        `;
        card.innerHTML = `
          <div style="height: 130px; overflow: hidden; position: relative;">
            <img src="${imgUrl}" alt="AI Travel Photo ${idx + 1}" style="width: 100%; height: 100%; object-fit: cover;">
            <span style="position: absolute; top: 8px; left: 8px; background: rgba(9,13,22,0.85); color: #00f2fe; padding: 0.2rem 0.55rem; border-radius: 6px; font-size: 0.72rem; font-weight: 800;">AI OPTION ${idx + 1}</span>
          </div>
          <div style="padding: 0.8rem; text-align: center;">
            <button type="button" class="primary-btn" style="width: 100%; padding: 0.45rem; font-size: 0.78rem; font-weight: 800; background: linear-gradient(135deg, #00a651 0%, #0072bc 100%); border-radius: 8px;" onclick="selectAIPhotoForPackage('${imgUrl}', this)">
              Use This Photo ➔
            </button>
          </div>
        `;
        container.appendChild(card);
      });

      if (typeof showToast === 'function') {
        showToast(`✨ Generated 5 AI Luxury Photos for ${destKey.toUpperCase()}! Click any photo to use.`, 'success');
      }
    }, 700);
  };

  window.selectAIPhotoForPackage = function(imgUrl, btnEl) {
    const inputEl = document.getElementById('pkgImageUrlInput');
    if (inputEl) {
      inputEl.value = imgUrl;
    }
    
    // Highlight selected card
    const cards = document.querySelectorAll('#aiPhotosGridContainer > div');
    cards.forEach(c => {
      c.style.borderColor = '#e2e8f0';
      c.style.boxShadow = '0 4px 15px rgba(0,0,0,0.05)';
    });

    if (btnEl && btnEl.parentElement && btnEl.parentElement.parentElement) {
      const card = btnEl.parentElement.parentElement;
      card.style.borderColor = '#00a651';
      card.style.boxShadow = '0 0 20px rgba(0, 166, 81, 0.4)';
    }

    if (typeof showToast === 'function') {
      showToast('✅ Selected AI Photo applied as Main Package Cover Photo!', 'success');
    }
  };

  // ==========================================
  // WORLD-CLASS INTERACTIVE GUESTS & TRAVELERS COUNTER POPOVER
  // ==========================================
  let guestCounts = {
    adults: 2,
    children: 0,
    infants: 0
  };

  const GUEST_LIMITS = {
    adults: { min: 1, max: 14 },
    children: { min: 0, max: 8 },
    infants: { min: 0, max: 4 }
  };

  window.toggleGuestsPopover = function() {
    const popover = document.getElementById('guestsPopover');
    if (popover) {
      popover.classList.toggle('hidden');
    }
  };

  window.updateGuestButtonsUI = function() {
    // Adults button states
    const btnMinusAdults = document.getElementById('btnMinusAdults');
    const btnPlusAdults = document.getElementById('btnPlusAdults');
    if (btnMinusAdults) {
      btnMinusAdults.style.opacity = guestCounts.adults <= GUEST_LIMITS.adults.min ? '0.35' : '1';
      btnMinusAdults.style.cursor = guestCounts.adults <= GUEST_LIMITS.adults.min ? 'not-allowed' : 'pointer';
    }
    if (btnPlusAdults) {
      btnPlusAdults.style.opacity = guestCounts.adults >= GUEST_LIMITS.adults.max ? '0.35' : '1';
      btnPlusAdults.style.cursor = guestCounts.adults >= GUEST_LIMITS.adults.max ? 'not-allowed' : 'pointer';
    }

    // Children button states
    const btnMinusChildren = document.getElementById('btnMinusChildren');
    const btnPlusChildren = document.getElementById('btnPlusChildren');
    if (btnMinusChildren) {
      btnMinusChildren.style.opacity = guestCounts.children <= GUEST_LIMITS.children.min ? '0.35' : '1';
      btnMinusChildren.style.cursor = guestCounts.children <= GUEST_LIMITS.children.min ? 'not-allowed' : 'pointer';
    }
    if (btnPlusChildren) {
      btnPlusChildren.style.opacity = guestCounts.children >= GUEST_LIMITS.children.max ? '0.35' : '1';
      btnPlusChildren.style.cursor = guestCounts.children >= GUEST_LIMITS.children.max ? 'not-allowed' : 'pointer';
    }

    // Infants button states
    const btnMinusInfants = document.getElementById('btnMinusInfants');
    const btnPlusInfants = document.getElementById('btnPlusInfants');
    if (btnMinusInfants) {
      btnMinusInfants.style.opacity = guestCounts.infants <= GUEST_LIMITS.infants.min ? '0.35' : '1';
      btnMinusInfants.style.cursor = guestCounts.infants <= GUEST_LIMITS.infants.min ? 'not-allowed' : 'pointer';
    }
    if (btnPlusInfants) {
      btnPlusInfants.style.opacity = (guestCounts.infants >= GUEST_LIMITS.infants.max || guestCounts.infants >= guestCounts.adults) ? '0.35' : '1';
      btnPlusInfants.style.cursor = (guestCounts.infants >= GUEST_LIMITS.infants.max || guestCounts.infants >= guestCounts.adults) ? 'not-allowed' : 'pointer';
    }
  };

  window.changeGuestCount = function(type, delta) {
    if (!guestCounts.hasOwnProperty(type)) return;

    const limits = GUEST_LIMITS[type];
    const newCount = guestCounts[type] + delta;

    if (newCount < limits.min || newCount > limits.max) return;

    // Safety guardrail: Infants cannot exceed number of Adults
    if (type === 'infants' && delta > 0 && newCount > guestCounts.adults) {
      if (typeof showToast === 'function') {
        showToast('Each infant (below 2 yrs) requires 1 adult traveler.', 'info');
      }
      return;
    }

    // Update count state
    guestCounts[type] = newCount;

    // If Adults decrease below Infants, auto adjust Infants
    if (type === 'adults' && guestCounts.infants > guestCounts.adults) {
      guestCounts.infants = guestCounts.adults;
    }

    const adultsEl = document.getElementById('adultsCountEl');
    const childrenEl = document.getElementById('childrenCountEl');
    const infantsEl = document.getElementById('infantsCountEl');
    const summaryTextEl = document.getElementById('guestsSummaryText');

    if (adultsEl) adultsEl.textContent = guestCounts.adults;
    if (childrenEl) childrenEl.textContent = guestCounts.children;
    if (infantsEl) infantsEl.textContent = guestCounts.infants;

    if (summaryTextEl) {
      let parts = [];
      parts.push(`${guestCounts.adults} Adult${guestCounts.adults > 1 ? 's' : ''}`);
      if (guestCounts.children > 0) {
        parts.push(`${guestCounts.children} Child${guestCounts.children > 1 ? 'ren' : ''}`);
      }
      if (guestCounts.infants > 0) {
        parts.push(`${guestCounts.infants} Infant${guestCounts.infants > 1 ? 's' : ''}`);
      }
      summaryTextEl.textContent = '👨‍👩‍👧 ' + parts.join(', ');
    }

    window.updateGuestButtonsUI();
  };

  // Run initial UI state update
  window.updateGuestButtonsUI();

  // Close popover when clicking outside
  document.addEventListener('click', (e) => {
    const trigger = document.getElementById('guestsSelectorTrigger');
    const popover = document.getElementById('guestsPopover');
    if (popover && !popover.classList.contains('hidden') && trigger) {
      if (!trigger.contains(e.target) && !popover.contains(e.target)) {
        popover.classList.add('hidden');
      }
    }
  });

  // ==========================================
  // DYNAMIC LIVE CUSTOMER TOUR GRID & DROPDOWN RENDERING
  // ==========================================
  function populateDestinationDropdown() {
    const dataList = document.getElementById('destPackagesDatalist');
    const destSelect = document.getElementById('custSearchDest');

    // Load ALL live packages from localStorage (or defaultPackages)
    const packages = JSON.parse(localStorage.getItem('m2o_live_packages')) || defaultPackages;

    if (dataList) {
      dataList.innerHTML = '';
      packages.forEach(pkg => {
        const opt = document.createElement('option');
        opt.value = pkg.name;
        dataList.appendChild(opt);
      });
    }

    if (destSelect) {
      destSelect.innerHTML = '';
      packages.forEach(pkg => {
        const opt = document.createElement('option');
        opt.value = pkg.id;
        opt.textContent = `${pkg.name} (${pkg.price})`;
        destSelect.appendChild(opt);
      });
    }
  }

  function updateHeroFeaturedPackage() {
    const heroSlide = document.getElementById('heroSlide');
    if (!heroSlide) return;

    const packages = window.getCombinedLivePackages ? window.getCombinedLivePackages() : [];
    if (!packages || packages.length === 0) return;

    // Get the LATEST added package (last package in array)
    const latestPkg = packages[packages.length - 1];

    // Calculate +20% regular price for strikethrough display
    let rawNum = parseInt(latestPkg.price.replace(/[^\d]/g, '')) || 0;
    let regNum = Math.round(rawNum * 1.20);
    let regFormatted = '৳' + regNum.toLocaleString();

    // Update hero background image dynamically
    if (latestPkg.image) {
      heroSlide.style.backgroundImage = `linear-gradient(to right, rgba(9, 13, 22, 0.88) 35%, rgba(9, 13, 22, 0.4) 100%), url('${latestPkg.image}')`;
    }

    // Update hero title, description, and price box
    const heroTitle = document.getElementById('heroTitle');
    const heroDesc = document.getElementById('heroDesc');
    const heroTag = document.getElementById('heroTag');
    const heroPriceBox = document.getElementById('heroPriceBox');
    const heroBookBtn = document.getElementById('heroBookBtn');

    if (heroTitle) heroTitle.textContent = latestPkg.name;
    if (heroDesc) heroDesc.textContent = latestPkg.desc;
    if (heroTag) heroTag.textContent = `HOT DEAL • 20% OFF • ${(latestPkg.category || 'FEATURED').toUpperCase()}`;

    if (heroPriceBox) {
      heroPriceBox.innerHTML = `From <del style="color: #94a3b8; text-decoration: line-through; font-size: 1.15rem; margin-right: 0.6rem; font-weight: 700;">${regFormatted}</del> <strong style="color: #00f2fe; font-size: 2.2rem; font-weight: 900;">${latestPkg.price}</strong> <small style="color: #e2e8f0;">/ person</small>`;
    }

    if (heroBookBtn) {
      heroBookBtn.onclick = function() {
        localStorage.setItem('m2o_active_detail_pkg_id', latestPkg.id);
        window.location.href = 'booking.html';
      };
    }
  }

  function renderLiveCustomerTours() {
    populateDestinationDropdown();
    updateHeroFeaturedPackage();

    const toursGrid = document.getElementById('toursGrid');
    if (!toursGrid) return;

    // Load ALL live packages from getCombinedLivePackages()
    const packages = window.getCombinedLivePackages ? window.getCombinedLivePackages() : (JSON.parse(localStorage.getItem('m2o_live_packages')) || defaultPackages);

    toursGrid.innerHTML = '';

    packages.forEach(pkg => {
      const card = document.createElement('div');
      card.className = 'tour-card';
      card.setAttribute('data-category', pkg.category || 'all');
      card.innerHTML = `
        <div class="tour-img-wrap" onclick="localStorage.setItem('m2o_active_detail_pkg_id', '${pkg.id}'); window.location.href='package_detail.html';" style="cursor: pointer;">
          <img src="${pkg.image}" alt="${pkg.name}">
          <span class="tour-badge ${pkg.badge || 'bestseller'}" style="background: #00a651;">${pkg.badgeLabel || pkg.badge || 'Featured'}</span>
          <span class="tour-price-pill">${pkg.price}</span>
        </div>
        <div class="tour-card-body">
          <div class="tour-meta-row">
            <span class="tour-location">📍 ${pkg.category ? pkg.category.toUpperCase() : 'Global Destination'}</span>
            <span class="tour-rating">${pkg.rating || '⭐ 4.9 (150 reviews)'}</span>
          </div>
          <h3 class="tour-name" onclick="localStorage.setItem('m2o_active_detail_pkg_id', '${pkg.id}'); window.location.href='package_detail.html';" style="cursor: pointer;">${pkg.name}</h3>
          <p class="tour-desc">${pkg.desc}</p>
          <div class="tour-card-footer">
            <span class="tour-duration">⏱️ ${pkg.duration}</span>
            <button class="primary-btn book-tour-btn" onclick="localStorage.setItem('m2o_active_detail_pkg_id', '${pkg.id}'); window.location.href='booking.html';">
              View &amp; Book Package ➔
            </button>
          </div>
        </div>
      `;
      toursGrid.appendChild(card);
    });

    // Clone cards for seamless infinite marquee loop!
    const cardsToClone = Array.from(toursGrid.children);
    cardsToClone.forEach(card => {
      const clone = card.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      toursGrid.appendChild(clone);
    });

    // Carousel navigation button handlers
    const prevBtn = document.getElementById('btnPrevTour');
    const nextBtn = document.getElementById('btnNextTour');
    if (prevBtn) {
      prevBtn.onclick = () => {
        const wrapper = document.querySelector('.carousel-wrapper');
        if (wrapper) wrapper.scrollBy({ left: -360, behavior: 'smooth' });
      };
    }
    if (nextBtn) {
      nextBtn.onclick = () => {
        const wrapper = document.querySelector('.carousel-wrapper');
        if (wrapper) wrapper.scrollBy({ left: 360, behavior: 'smooth' });
      };
    }
  }

  // ==========================================
  // OWNER ADMIN CUSTOMER BOOKINGS LISTING
  // ==========================================
  const defaultCustomerBookings = [
    {
      id: 'M2O-BK-88491',
      customerName: 'Sharmin Chowdhury',
      phone: '01977477172',
      email: 'sharmin@gmail.com',
      passportNo: 'A09827364',
      passportExpiry: '2029-11-15',
      nid: '1992269182374',
      travelDate: '2026-08-10',
      tourTitle: "3-Night / 4-Day Bhutan Cultural Tour & Tiger's Nest Hike",
      price: '৳1,50,000',
      amount: '৳1,50,000',
      travelersCount: '2 Adults',
      adults: 2,
      children: 0,
      infants: 0,
      paymentMethod: 'bKash Online Payment',
      notes: 'Window seats requested on Paro flight',
      date: '2026-07-29',
      status: 'PENDING'
    },
    {
      id: 'M2O-BK-73920',
      customerName: 'Arif Ahmed',
      phone: '01812345678',
      email: 'arif.ahmed@gmail.com',
      passportNo: 'B01928374',
      passportExpiry: '2030-05-20',
      nid: '1988123456789',
      travelDate: '2026-08-15',
      tourTitle: 'BALI PACKAGE 4D/3N - Kintamani Volcano, Uluwatu & Water Sports',
      price: '৳35,000',
      amount: '৳35,000',
      travelersCount: '2 Adults',
      adults: 2,
      children: 0,
      infants: 0,
      paymentMethod: 'Nagad Mobile Banking',
      notes: 'Honeymoon arrangement requested',
      date: '2026-07-28',
      status: 'APPROVED'
    }
  ];

  window.renderAdminBookings = function() {
    const adminBookingsTbody = document.getElementById('adminBookingsTbody');
    if (!adminBookingsTbody) return;

    let bookings = JSON.parse(localStorage.getItem('m2o_customer_bookings'));
    if (!bookings || bookings.length === 0) {
      bookings = defaultCustomerBookings;
      localStorage.setItem('m2o_customer_bookings', JSON.stringify(bookings));
    }

    const pendingCount = bookings.filter(b => b.status === 'PENDING').length;
    const alertBanner = document.getElementById('adminBookingAlertBanner');
    if (alertBanner) {
      if (pendingCount > 0) {
        alertBanner.classList.remove('hidden');
        alertBanner.innerHTML = `
          <div style="display: flex; align-items: center; justify-content: space-between; background: linear-gradient(135deg, rgba(0, 166, 81, 0.15) 0%, rgba(0, 114, 188, 0.15) 100%); border: 2px solid #00a651; padding: 1.2rem 1.5rem; border-radius: 16px; margin-bottom: 1.5rem; box-shadow: 0 8px 25px rgba(0, 166, 81, 0.15);">
            <div style="display: flex; align-items: center; gap: 1rem;">
              <div>
                <h4 style="margin: 0; font-size: 1.1rem; color: #00a651; font-weight: 800;">NEW CUSTOMER BOOKING RECEIVED (${pendingCount} PENDING)</h4>
                <p style="margin: 0.2rem 0 0; font-size: 0.88rem; color: #475569;">${pendingCount} new customer booking(s) waiting for your approval. Click Approve to finalize sales!</p>
              </div>
            </div>
            <span class="badge-tag" style="background: #ee1c25; color: white; padding: 0.4rem 0.9rem; font-size: 0.85rem; font-weight: 800;">ACTION REQUIRED</span>
          </div>
        `;
      } else {
        alertBanner.classList.add('hidden');
      }
    }

    adminBookingsTbody.innerHTML = '';
    if (bookings.length === 0) {
      adminBookingsTbody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: #64748b; font-weight: 700; padding: 2.5rem; background: rgba(0, 114, 188, 0.04); border-radius: 12px;">কোনো স্যাম্পল বুকিং ডেটা রাখা হয়নি। গ্রাহক যেকোনো পেজ থেকে বুকিং করার পর সাথে সাথে এখানে লাইভ দেখতে পাবেন।</td></tr>`;
      return;
    }

    bookings.forEach(b => {
      const tr = document.createElement('tr');

      let statusBadgeHtml = '<span class="status-badge-live" style="background: rgba(245, 158, 11, 0.18); color: #d97706; font-weight: 800;">PENDING</span>';
      if (b.status === 'APPROVED' || b.status === 'CONFIRMED') {
        statusBadgeHtml = '<span class="status-badge-live" style="background: rgba(34, 197, 94, 0.18); color: #059669; font-weight: 800;">APPROVED</span>';
      } else if (b.status === 'CANCELLED' || b.status === 'REJECTED') {
        statusBadgeHtml = '<span class="status-badge-live" style="background: rgba(239, 68, 68, 0.18); color: #dc2626; font-weight: 800;">CANCELLED</span>';
      }

      const idDocStr = b.passportNo ? `Passport: ${b.passportNo}` : (b.nid ? `NID: ${b.nid}` : 'Verified Identity');

      tr.innerHTML = `
        <td><strong style="color: #0072bc; font-size: 0.95rem;">${b.id}</strong></td>
        <td>
          <strong style="font-size: 0.95rem; color: #0f172a; display: block;">${b.customerName}</strong>
          <a href="tel:${b.phone}" style="color: #00a651; font-weight: 800; text-decoration: none; font-size: 0.82rem;">${b.phone}</a><br>
          <span style="color: #64748b; font-size: 0.78rem;">${b.email || 'customer@mount2ocean.com'}</span>
        </td>
        <td><span style="font-size: 0.82rem; font-weight: 700; color: #475569;">${idDocStr}</span></td>
        <td class="pkg-title-cell">
          <strong style="color: #0f172a; font-size: 0.9rem; display: block;">${b.tourTitle}</strong>
          <span style="color: #0072bc; font-size: 0.82rem; font-weight: 700;">Date: ${b.travelDate || b.date}</span><br>
          <span style="color: #00a651; font-weight: 900; font-size: 0.88rem;">Price: ${b.price || b.amount || '৳17,500'}</span>
        </td>
        <td><span style="font-size: 0.85rem; font-weight: 700;">${b.travelersCount || '1 Person'}</span></td>
        <td><span class="pay-pill" style="background: rgba(0, 114, 188, 0.1); color: #0072bc; padding: 0.25rem 0.6rem; border-radius: 6px; font-size: 0.78rem; font-weight: 800;">${b.paymentMethod || 'bKash Payment'}</span></td>
        <td>${statusBadgeHtml}</td>
        <td>
          <div style="display: flex; gap: 0.35rem; flex-wrap: wrap;">
            <button type="button" class="primary-btn" style="padding: 0.3rem 0.55rem; font-size: 0.74rem; background: #00a651;" onclick="updateBookingStatusByAdmin('${b.id}', 'APPROVED')">Approve</button>
            <button type="button" class="danger-btn" style="padding: 0.3rem 0.55rem; font-size: 0.74rem;" onclick="updateBookingStatusByAdmin('${b.id}', 'CANCELLED')">Cancel</button>
            <button type="button" class="secondary-btn" style="padding: 0.3rem 0.55rem; font-size: 0.74rem;" onclick="localStorage.setItem('m2o_active_booking_id', '${b.id}'); window.open('booking_detail.html', '_blank');">File ➔</button>
          </div>
        </td>
      `;
      adminBookingsTbody.appendChild(tr);
    });

    updateAdminDashboardMetrics();
  };

  window.updateAdminDashboardMetrics = function() {
    const pkgCountEl = document.getElementById('totalPackagesCount');
    const bookingsCountEl = document.getElementById('statCustomerBookingsCount');
    const revenueEl = document.getElementById('statTotalRevenue');
    const agentsCountEl = document.getElementById('statRegisteredAgentsCount');

    let currentPkgs = JSON.parse(localStorage.getItem('m2o_live_packages'));
    if (!currentPkgs || currentPkgs.length === 0) {
      currentPkgs = window.getCombinedLivePackages ? window.getCombinedLivePackages() : (window.defaultPackages || []);
    } else {
      const oldIds = ['pkg-1', 'pkg-2', 'pkg-3', 'pkg-4', 'pkg-5', 'pkg-6', 'pkg-7', 'pkg-coxsbazar', 'pkg-dubai', 'pkg-maldives', 'pkg-saintmartin'];
      currentPkgs = currentPkgs.filter(p => !oldIds.includes(p.id));
    }

    if (pkgCountEl) {
      pkgCountEl.textContent = currentPkgs.length.toLocaleString('en-US');
    }

    const customerBookings = JSON.parse(localStorage.getItem('m2o_customer_bookings')) || [];
    
    if (bookingsCountEl) {
      bookingsCountEl.textContent = customerBookings.length.toLocaleString('en-US');
    }

    if (revenueEl) {
      let totalRev = 0;
      customerBookings.forEach(b => {
        if (b.status === 'APPROVED' || b.status === 'CONFIRMED') {
          const rawPrice = b.price || b.amount || '0';
          const num = parseInt(String(rawPrice).replace(/[^0-9]/g, ''), 10);
          if (!isNaN(num) && num > 0) {
            totalRev += num;
          }
        }
      });
      revenueEl.textContent = `৳${totalRev.toLocaleString('en-US')}`;
    }

    const users = JSON.parse(localStorage.getItem('m2o_registered_users')) || [];
    const agents = users.filter(u => (u.role || '').toUpperCase() === 'B2B AGENT' || (u.role || '').toUpperCase() === 'AGENT');
    if (agentsCountEl) {
      agentsCountEl.textContent = agents.length.toLocaleString('en-US');
    }
  };

  window.updateBookingStatusByAdmin = function(bookingId, newStatus) {
    if (!bookingId) return;
    const cleanId = String(bookingId).trim();

    let bookings = JSON.parse(localStorage.getItem('m2o_customer_bookings')) || [];
    let bk = bookings.find(b => String(b.id || '').trim().toLowerCase() === cleanId.toLowerCase());
    let cancelReason = '';

    if (newStatus === 'CANCELLED') {
      cancelReason = prompt(`Enter Cancellation Reason / Custom Note for Customer (${cleanId}):\n\n(কাস্টমারকে ট্রিপ বাতিলের কারণ ও বার্তা টাইপ করে লিখে দিন):`, 'Flight / hotel schedule changed by airline. Full refund initiated.') || 'Cancelled by Owner due to schedule update';
    }

    if (!bk) {
      // Fallback if booking was from default set or missing in storage
      bk = {
        id: cleanId,
        customerName: 'Sharmin Chowdhury',
        phone: '01977477172',
        email: 'sharmin@gmail.com',
        tourTitle: 'Bhutan Cultural Tour',
        travelDate: '2026-08-10',
        price: '৳17,500',
        amount: '৳17,500',
        travelersCount: '2 Adults',
        paymentMethod: 'bKash Payment',
        status: newStatus
      };
      bookings.unshift(bk);
    } else {
      bk.status = newStatus;
      if (cancelReason) {
        bk.cancelReason = cancelReason;
        bk.cancellationReason = cancelReason;
      }
    }

    localStorage.setItem('m2o_customer_bookings', JSON.stringify(bookings));

    // Push Live Notification into m2o_customer_notifications for the customer
    let notifications = JSON.parse(localStorage.getItem('m2o_customer_notifications')) || [];
    const notifItem = {
      id: 'NOTIF-' + Date.now(),
      voucherId: bk.id,
      customerName: bk.customerName || 'Valued Customer',
      phone: bk.phone || '',
      email: bk.email || '',
      type: newStatus,
      title: newStatus === 'APPROVED' ? '✅ Tour Booking Approved & Confirmed!' : '❌ Tour Booking Cancelled by Owner',
      message: newStatus === 'APPROVED'
        ? `Great news ${bk.customerName}! Your reservation for "${bk.tourTitle}" (Voucher: ${bk.id}) has been APPROVED by Mount2ocean Admin. Your official ticket voucher is active!`
        : `Notice to ${bk.customerName}: Your booking for "${bk.tourTitle}" (Voucher: ${bk.id}) has been CANCELLED by Admin. Reason / Admin Message: "${cancelReason}"`,
      timestamp: new Date().toLocaleString(),
      read: false
    };
    notifications.unshift(notifItem);
    localStorage.setItem('m2o_customer_notifications', JSON.stringify(notifications));

    let approvals = JSON.parse(localStorage.getItem('m2o_admin_approvals')) || [];
    let appItem = approvals.find(b => String(b.id || '').trim().toLowerCase() === cleanId.toLowerCase());
    if (appItem) {
      appItem.status = newStatus;
      localStorage.setItem('m2o_admin_approvals', JSON.stringify(approvals));
    }

    // Trigger local CustomEvent for same-tab instant updates
    window.dispatchEvent(new CustomEvent('m2o_booking_updated', { detail: { bookingId: cleanId, status: newStatus, cancelReason } }));

    if (typeof renderAdminBookings === 'function') renderAdminBookings();
    if (typeof renderMasterBookingsDirectory === 'function') renderMasterBookingsDirectory();
    if (typeof updateAdminDashboardMetrics === 'function') updateAdminDashboardMetrics();
    if (typeof renderAdminApprovals === 'function') renderAdminApprovals();
    if (typeof checkCustomerBookingNotifications === 'function') checkCustomerBookingNotifications();
    
    if (typeof showToast === 'function') {
      showToast(`Booking ${cleanId} marked as ${newStatus}! Customer notified live.`, newStatus === 'APPROVED' ? 'success' : 'error');
    } else {
      alert(`Booking ${cleanId} status updated to ${newStatus}!`);
    }
  };

  window.clearAllBookingsHandler = function() {
    localStorage.removeItem('m2o_customer_bookings');
    renderAdminBookings();
    updateAdminDashboardMetrics();
    if (typeof showToast === 'function') showToast('Customer bookings list cleared.', 'info');
  };

  renderAdminBookings();

  // ==========================================
  // SMART FIND TOURS SEARCH & ALTERNATIVE PACKAGE SUGGESTIONS
  // ==========================================
  // ==========================================
  // SMART SEARCH ENGINE - DIRECT PACKAGE PAGE ROUTER & INTERACTIVE TABS
  // ==========================================
  const btnCustSearch = document.getElementById('btnCustSearch');
  const custSearchDest = document.getElementById('custSearchDest');
  const searchResultsModal = document.getElementById('searchResultsModal');
  const closeResultsModal = document.getElementById('closeResultsModal');

  // TOP DESTINATION PILLS DIRECT NAVIGATION & FILTERING
  document.querySelectorAll('.dest-pill').forEach(pill => {
    pill.addEventListener('click', function() {
      document.querySelectorAll('.dest-pill').forEach(p => p.classList.remove('active'));
      this.classList.add('active');

      const filter = (this.getAttribute('data-filter') || 'all').toLowerCase();

      if (filter === 'all') {
        const toursGrid = document.getElementById('toursGrid');
        if (toursGrid) toursGrid.scrollIntoView({ behavior: 'smooth' });
        showToast('Viewing All Destination Packages', 'info');
        return;
      }

      // Load ALL live packages
      const packages = JSON.parse(localStorage.getItem('m2o_live_packages')) || defaultPackages;
      
      let targetPkg = packages.find(p => (p.category || '').toLowerCase() === filter);
      if (!targetPkg) {
        targetPkg = packages.find(p => (p.category || '').toLowerCase().includes(filter) || filter.includes((p.category || '').toLowerCase()) || (p.name || '').toLowerCase().includes(filter));
      }

      if (targetPkg) {
        showToast(`Opening ${targetPkg.name} package page...`, 'info');
        setTimeout(() => {
          window.location.href = `package_detail.html?id=${targetPkg.id}`;
        }, 250);
      } else {
        window.location.href = `package_detail.html?id=pkg-1`;
      }
    });
  });

  // Search Tabs Interactivity (Tour Packages, Hotels & Resorts, Flights, Visa)
  document.querySelectorAll('.cust-search-tab').forEach(tab => {
    tab.addEventListener('click', function() {
      document.querySelectorAll('.cust-search-tab').forEach(t => t.classList.remove('active'));
      this.classList.add('active');

      const tabText = this.textContent.trim();
      const searchBtn = document.getElementById('btnCustSearch');

      if (tabText.includes('Hotels')) {
        if (searchBtn) searchBtn.innerHTML = '🏢 Find Resort Packages ➔';
        showToast('Switched to Hotels & Resorts Search', 'info');
      } else if (tabText.includes('Flight')) {
        if (searchBtn) searchBtn.innerHTML = '✈️ Find Flight Deals ➔';
        showToast('Switched to Flight Tickets Search', 'info');
      } else if (tabText.includes('Visa')) {
        if (searchBtn) searchBtn.innerHTML = '🛂 Visa Assistance ➔';
        showToast('Switched to Visa Processing Search', 'info');
      } else {
        if (searchBtn) searchBtn.innerHTML = '🌴 Find Tour Packages ➔';
        showToast('Switched to Tour Packages Search', 'info');
      }
    });
  });

  const SCHEDULED_DEPARTURE_DATES = ['2026-08-10', '2026-08-15', '2026-08-20', '2026-09-01', '2026-09-15', '2026-10-01'];

  // Make executeFindToursSearch globally accessible on window immediately using Hidden AI Agent
  window.executeFindToursSearch = function() {
    try {
      const searchInput = document.getElementById('custSearchInput');
      const destSelect = document.getElementById('custSearchDest');
      const dateInput = document.getElementById('custSearchDate');

      let rawQuery = searchInput ? searchInput.value.trim() : (destSelect ? destSelect.value : '');
      if (!rawQuery && destSelect) rawQuery = destSelect.value || '';
      let selectedDate = dateInput ? dateInput.value : '2026-08-10';

      return window.runHiddenAiTourAgent(rawQuery, selectedDate);
    } catch (e) {
      console.error("AI Search Agent fallback:", e);
      window.location.href = 'tour_packages.html';
    }
  };

  const custSearchInputEl = document.getElementById('custSearchInput');
  if (custSearchInputEl) {
    custSearchInputEl.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        executeFindToursSearch();
      }
    });
  }

  if (btnCustSearch) {
    btnCustSearch.addEventListener('click', window.executeFindToursSearch);
  }

  if (closeResultsModal && searchResultsModal) {
    closeResultsModal.addEventListener('click', () => {
      searchResultsModal.classList.add('hidden');
    });
  }

  window.closeSearchAndBook = function(title, price) {
    if (searchResultsModal) searchResultsModal.classList.add('hidden');
    window.openBookingModal(title, price);
  };

  // ==========================================
  // CUSTOMER BOOKING & CHECKOUT MODAL LOGIC (LOGIN ENFORCED)
  // ==========================================
  const custBookingModal = document.getElementById('custBookingModal');
  const closeCustBookingModal = document.getElementById('closeCustBookingModal');
  const bookModalTourTitle = document.getElementById('bookModalTourTitle');
  const bookModalTourPrice = document.getElementById('bookModalTourPrice');

  window.openBookingModal = function(title, price, pkgId) {
    if (pkgId) {
      localStorage.setItem('m2o_active_detail_pkg_id', pkgId);
      window.location.href = `booking.html?id=${pkgId}`;
      return;
    }

    if (window.location.pathname.includes('booking.html')) {
      return;
    }

    // Modal Fallback handler if elements exist on current page
    if (custBookingModal && bookModalTourTitle && bookModalTourPrice) {
      bookModalTourTitle.textContent = title || 'Luxury Tour Package';
      bookModalTourPrice.textContent = `Package Price: ${price || '৳75,000'} per traveler`;

      const checkoutStep = document.getElementById('bookingCheckoutStep');
      const successStep = document.getElementById('bookingSuccessStep');
      const loginBanner = document.getElementById('bookingLoginBanner');
      const submitBtn = document.getElementById('btnSubmitBooking');

      const loggedUser = JSON.parse(localStorage.getItem('m2o_logged_user'));
      const isLogged = loggedUser || localStorage.getItem('m2o_is_logged_in') === 'true';

      if (loginBanner) loginBanner.style.display = isLogged ? 'none' : 'block';
      if (submitBtn) {
        submitBtn.disabled = !isLogged;
        submitBtn.style.opacity = isLogged ? '1' : '0.5';
      }
      if (loggedUser) {
        const nameEl = document.getElementById('custBookName');
        const phoneEl = document.getElementById('custBookPhone');
        const emailEl = document.getElementById('custBookEmail');
        if (nameEl && loggedUser.name) nameEl.value = loggedUser.name;
        if (phoneEl && loggedUser.mobile) phoneEl.value = loggedUser.mobile;
        if (emailEl && loggedUser.email) emailEl.value = loggedUser.email;
      }

      if (checkoutStep) checkoutStep.style.display = 'block';
      if (successStep) successStep.style.display = 'none';
      custBookingModal.classList.remove('hidden');
      return;
    }

    // Direct Page Navigation Fallback
    const activeId = localStorage.getItem('m2o_active_detail_pkg_id') || 'pkg-bhutan';
    window.location.href = `booking.html?id=${activeId}`;
  };

  if (closeCustBookingModal) {
    closeCustBookingModal.addEventListener('click', () => {
      if (custBookingModal) custBookingModal.classList.add('hidden');
    });
  }

  window.closeCustBookingModalHandler = function() {
    if (custBookingModal) custBookingModal.classList.add('hidden');
  };

  // ==========================================
  // CHECKOUT MODAL TRAVELERS & PRICE CALCULATOR LOGIC
  // ==========================================
  window.modalGuestCounts = { adults: 2, children: 0, infants: 0 };

  window.changeModalGuest = function(type, delta) {
    if (!window.modalGuestCounts) window.modalGuestCounts = { adults: 2, children: 0, infants: 0 };
    
    if (type === 'adults') {
      window.modalGuestCounts.adults = Math.max(1, Math.min(14, window.modalGuestCounts.adults + delta));
    } else if (type === 'children') {
      window.modalGuestCounts.children = Math.max(0, Math.min(8, window.modalGuestCounts.children + delta));
    } else if (type === 'infants') {
      window.modalGuestCounts.infants = Math.max(0, Math.min(window.modalGuestCounts.adults, window.modalGuestCounts.infants + delta));
    }

    const adultEl = document.getElementById('modalAdultsCount');
    const childEl = document.getElementById('modalChildrenCount');
    const infantEl = document.getElementById('modalInfantsCount');

    if (adultEl) adultEl.textContent = window.modalGuestCounts.adults;
    if (childEl) childEl.textContent = window.modalGuestCounts.children;
    if (infantEl) infantEl.textContent = window.modalGuestCounts.infants;

    window.updateModalPriceCalculation();
  };

  window.updateModalPriceCalculation = function() {
    const priceEl = document.getElementById('modalCalcTotalPrice');
    if (!priceEl) return;

    const adults = window.modalGuestCounts ? window.modalGuestCounts.adults : 2;
    const children = window.modalGuestCounts ? window.modalGuestCounts.children : 0;

    const basePrice = 14200;
    const total = (adults * basePrice) + (children * basePrice * 0.6);
    priceEl.textContent = `Calculated Total: ৳${total.toLocaleString('en-US')}`;
  };

  window.confirmCustomerBooking = function(event) {
    event.preventDefault();

    // Check login requirement
    const loggedUser = JSON.parse(localStorage.getItem('m2o_logged_user'));
    const isLogged = loggedUser || localStorage.getItem('m2o_is_logged_in') === 'true';

    if (!isLogged) {
      showToast('🔐 Please Sign In or Create an Account to complete your booking!', 'error');
      window.location.href = 'index.html';
      return;
    }

    const name = document.getElementById('custBookName') ? document.getElementById('custBookName').value.trim() : 'Sharmin Chowdhury';
    const phone = document.getElementById('custBookPhone') ? document.getElementById('custBookPhone').value.trim() : '01977477172';
    const email = document.getElementById('custBookEmail') ? document.getElementById('custBookEmail').value.trim() : 'info@mount2ocean.com';
    const travelDate = document.getElementById('custBookDate') ? document.getElementById('custBookDate').value : '2026-08-10';
    
    // International Passport or Domestic NID
    const passportNo = document.getElementById('custBookPassportNo') ? document.getElementById('custBookPassportNo').value.trim() : '';
    const passportExpiry = document.getElementById('custBookPassportExpiry') ? document.getElementById('custBookPassportExpiry').value : '';
    const nid = document.getElementById('custBookNid') ? document.getElementById('custBookNid').value.trim() : '';
    
    const adults = window.modalGuestCounts ? window.modalGuestCounts.adults : 2;
    const children = window.modalGuestCounts ? window.modalGuestCounts.children : 0;
    const infants = window.modalGuestCounts ? window.modalGuestCounts.infants : 0;
    const travelersCountSummary = `👨‍👩‍👧 ${adults} Adult(s), ${children} Child(ren), ${infants} Infant(s)`;

    const method = document.getElementById('custPaymentMethod') ? document.getElementById('custPaymentMethod').value : 'Direct Call Request';
    const notes = document.getElementById('custBookNotes') ? document.getElementById('custBookNotes').value.trim() : '';
    const tourTitle = bookModalTourTitle ? bookModalTourTitle.textContent : 'Tour Package';

    const bookingId = 'M2O-BK-' + Math.floor(10000 + Math.random() * 90000);
    const confirmedBookingIdEl = document.getElementById('confirmedBookingId');
    if (confirmedBookingIdEl) confirmedBookingIdEl.textContent = bookingId;

    const newBooking = {
      id: bookingId,
      customerName: name,
      phone: phone,
      email: email,
      passportNo: passportNo,
      passportExpiry: passportExpiry,
      nid: nid,
      travelDate: travelDate,
      tourTitle: tourTitle,
      travelersCount: travelersCountSummary,
      adults: adults,
      children: children,
      infants: infants,
      paymentMethod: method,
      notes: notes,
      date: new Date().toLocaleDateString('bn-BD'),
      status: 'PENDING'
    };

    // Save to localStorage for Admin Notification & Dashboard Sync
    const existingBookings = JSON.parse(localStorage.getItem('m2o_customer_bookings')) || [];
    existingBookings.unshift(newBooking);
    localStorage.setItem('m2o_customer_bookings', JSON.stringify(existingBookings));

    // Trigger Email Dispatcher / Simulated Web Hosting Notification
    if (window.sendLiveWebsiteEmail) {
      window.sendLiveWebsiteEmail(newBooking, 'confirmation');
    }

    // Show Success Step View
    const checkoutStep = document.getElementById('bookingCheckoutStep');
    const successStep = document.getElementById('bookingSuccessStep');

    if (checkoutStep) checkoutStep.style.display = 'none';
    if (successStep) successStep.style.display = 'block';

    showToast(`⏳ Booking ${bookingId} Submitted! Pending Admin Approval. Notification sent to Admin Panel!`, 'success');
  };

  window.openMyProfileModal = function() {
    window.location.href = 'my_profile.html';
  };

  // ==========================================
  // TOAST NOTIFICATION HELPER
  // ==========================================
  function showToast(message, type = 'info') {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';
    toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;
    
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => toast.remove(), 350);
    }, 3500);
  }

  // ==========================================
  // PENDING PARTNER APPROVALS MANAGEMENT (OWNER DASHBOARD)
  // ==========================================
  const defaultPendingApprovals = [];

  function getPendingApprovals() {
    const saved = localStorage.getItem('m2o_pending_approvals');
    if (!saved) {
      localStorage.setItem('m2o_pending_approvals', JSON.stringify(defaultPendingApprovals));
      return defaultPendingApprovals;
    }
    try {
      return JSON.parse(saved);
    } catch(e) {
      return defaultPendingApprovals;
    }
  }

  function savePendingApprovals(list) {
    localStorage.setItem('m2o_pending_approvals', JSON.stringify(list));
    renderAdminApprovals();
  }

  function renderAdminApprovals() {
    const tbody = document.getElementById('adminApprovalsTbody');
    if (!tbody) return;

    const list = getPendingApprovals();
    tbody.innerHTML = '';

    if (list.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 2rem; color: #94a3b8;">No pending partner approval requests found.</td></tr>`;
      return;
    }

    list.forEach(item => {
      const tr = document.createElement('tr');
      const roleBadgeStyle = item.role === 'GUIDE' ? 'style="background: rgba(0, 176, 155, 0.2); color: #00f2fe; padding: 0.2rem 0.5rem; border-radius: 4px; font-weight: 700;"' : 'style="background: rgba(0, 114, 188, 0.2); color: #4facfe; padding: 0.2rem 0.5rem; border-radius: 4px; font-weight: 700;"';
      
      let statusHtml = '';
      if (item.status === 'PENDING') {
        statusHtml = `<span style="background: rgba(234, 179, 8, 0.15); color: #eab308; padding: 0.2rem 0.6rem; border-radius: 999px; font-weight: 700; font-size: 0.78rem;">🟡 Pending Verification</span>`;
      } else if (item.status === 'APPROVED') {
        statusHtml = `<span style="background: rgba(34, 197, 94, 0.15); color: #22c55e; padding: 0.2rem 0.6rem; border-radius: 999px; font-weight: 700; font-size: 0.78rem;">🟢 Approved (Email Sent)</span>`;
      } else {
        statusHtml = `<span style="background: rgba(239, 68, 68, 0.15); color: #ef4444; padding: 0.2rem 0.6rem; border-radius: 999px; font-weight: 700; font-size: 0.78rem;">🔴 Rejected (Notification Sent)</span>`;
      }

      let actionsHtml = '';
      if (item.status === 'PENDING') {
        actionsHtml = `
          <button type="button" class="primary-btn" onclick="approvePartner(${item.id})" style="padding: 0.25rem 0.55rem; font-size: 0.74rem; background: #22c55e; margin-right: 4px;">
            ✅ Approve
          </button>
          <button type="button" class="btn-delete-pkg" onclick="rejectPartner(${item.id})" style="padding: 0.25rem 0.55rem; font-size: 0.74rem;">
            ❌ Reject
          </button>
        `;
      } else if (item.status === 'APPROVED') {
        actionsHtml = `
          <button type="button" class="primary-btn" onclick="approvePartner(${item.id})" style="padding: 0.25rem 0.55rem; font-size: 0.74rem; background: #22c55e; opacity: 0.6;" title="Already Approved">
            ✓ Approved
          </button>
          <button type="button" class="btn-delete-pkg" onclick="rejectPartner(${item.id})" style="padding: 0.25rem 0.55rem; font-size: 0.74rem;" title="Revoke & Cancel Approval">
            ❌ Revoke &amp; Cancel
          </button>
        `;
      } else {
        actionsHtml = `
          <button type="button" class="primary-btn" onclick="approvePartner(${item.id})" style="padding: 0.25rem 0.55rem; font-size: 0.74rem; background: #22c55e; margin-right: 4px;">
            ✅ Approve
          </button>
          <span style="font-size: 0.76rem; color: #ef4444; font-weight: 700;">Rejected</span>
        `;
      }

      tr.innerHTML = `
        <td><span ${roleBadgeStyle}>${item.role === 'GUIDE' ? '🚩 GUIDE' : '🏢 AGENT'}</span></td>
        <td><strong>${item.name}</strong></td>
        <td>${item.email}</td>
        <td><code style="background: rgba(255,255,255,0.08); padding: 2px 6px; border-radius: 4px; color: #00f2fe;">${item.credentialNo}</code></td>
        <td>${item.date}</td>
        <td>${statusHtml}</td>
        <td>${actionsHtml}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  window.approvePartner = function(id) {
    const list = getPendingApprovals();
    const item = list.find(x => x.id == id);
    if (item) {
      item.status = 'APPROVED';
      savePendingApprovals(list);
      showToast(`✅ ${item.name} Approved! Instant confirmation email sent to ${item.email}`, 'success');
      alert(`✅ Account Approved!\n\n${item.name} (${item.role}) has been verified.\n\nSimulated Email Sent to: ${item.email}\nSubject: Mount2ocean Partner Account Verification Approved! 🎉`);
    }
  };

  window.rejectPartner = function(id) {
    const list = getPendingApprovals();
    const item = list.find(x => x.id == id);
    if (item) {
      const reason = prompt(`Enter Cancellation / Rejection reason for Partner (${item.name}):`, 'Documents unverified or policy violation') || 'Administrative Cancellation';
      item.status = 'REJECTED';
      item.cancellationReason = reason;
      savePendingApprovals(list);
      showToast(`❌ ${item.name} Cancelled/Rejected. Notification sent to ${item.email}`, 'error');
      alert(`❌ Partner Account Cancelled / Rejected!\n\n${item.name} (${item.role}) registration status updated.\nReason: "${reason}"\n\nNotification Sent to: ${item.email}`);
    }
  };

  const btnResetApprovals = document.getElementById('btnResetApprovals');
  if (btnResetApprovals) {
    btnResetApprovals.addEventListener('click', () => {
      localStorage.setItem('m2o_pending_approvals', JSON.stringify(defaultPendingApprovals));
      renderAdminApprovals();
      showToast('Reset approval requests list', 'info');
    });
  }

// ==========================================
// LIVE WEBSITE EMAIL SYSTEM (PRODUCTION HOOK & SIMULATION)
// ==========================================
window.sendLiveWebsiteEmail = function(bookingData, emailType) {
  const emailTo = bookingData.email || bookingData.phone || 'customer@gmail.com';
  let subject = '';
  let bodyText = '';

  if (emailType === 'approval') {
    subject = `🎉 CONFIRMED: Your Mount2ocean Booking #${bookingData.id} is APPROVED!`;
    bodyText = `Dear ${bookingData.customerName},\n\nWe are delighted to confirm your tour booking for "${bookingData.tourTitle}"!\n\n📋 RESERVATION SUMMARY:\n• Voucher ID: ${bookingData.id}\n• Travel Date: ${bookingData.travelDate || bookingData.date}\n• Travelers: ${bookingData.travelersCount}\n• Identity/Passport: ${bookingData.passportNo ? 'Passport #' + bookingData.passportNo : 'NID Verified'}\n• Payment Option: ${bookingData.paymentMethod}\n\nOur travel manager will reach you shortly at ${bookingData.phone} to coordinate tickets & vouchers.\n\nThank you for choosing Mount2ocean Travel & Tours!\nHotline: +880 1977-477172\nEmail: info@mount2ocean.com`;
  } else if (emailType === 'cancellation' || emailType === 'rejection') {
    subject = `⚠️ UPDATE: Booking Reservation Status #${bookingData.id}`;
    bodyText = `Dear ${bookingData.customerName},\n\nYour booking reservation #${bookingData.id} for "${bookingData.tourTitle}" has been CANCELLED.\n\nReason: ${bookingData.cancellationReason || 'Requested departure date fully booked'}.\n\nPlease contact our helpline at +880 1977-477172 for alternate travel dates or assistance.`;
  } else {
    subject = `📥 RECEIVED: Booking Reservation #${bookingData.id} Submitted Successfully!`;
    bodyText = `Dear ${bookingData.customerName},\n\nThank you for submitting your booking reservation for "${bookingData.tourTitle}".\n\nBooking Reference ID: ${bookingData.id}\nStatus: PENDING ADMIN APPROVAL\n\nOur team is reviewing your request and will notify you upon confirmation.`;
  }

  // Simulated Email Webhook Endpoint Hook for Production Web Hosting (SMTP / EmailJS / SendGrid / Formspree API)
  try {
    fetch('/api/send-booking-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to: emailTo, subject, body: bodyText })
    }).catch(err => console.log('Live email endpoint hook initialized (Simulated mode active):', err));
  } catch(e) {}

  return { subject, bodyText, emailTo };
};

window.togglePassportFields = function(isInternational) {
  const passBox = document.getElementById('passportFieldsBox');
  const nidBox = document.getElementById('nidFieldBox');
  if (passBox) passBox.style.display = isInternational ? 'grid' : 'none';
  if (nidBox) nidBox.style.display = isInternational ? 'none' : 'block';
};

window.approveCustomerBooking = function(bookingId) {
  const bookings = JSON.parse(localStorage.getItem('m2o_customer_bookings')) || [];
  const target = bookings.find(b => b.id === bookingId);
  if (target) {
    target.status = 'APPROVED';
    target.approvedAt = new Date().toLocaleString();
    localStorage.setItem('m2o_customer_bookings', JSON.stringify(bookings));
    
    renderAdminBookings();
    
    const emailResult = window.sendLiveWebsiteEmail(target, 'approval');
    showToast(`✅ Booking ${bookingId} Approved! Confirmation Email sent to ${target.email || target.phone}`, 'success');
    alert(`✅ Booking ${bookingId} Approved Successfully!\n\nCustomer Name: ${target.customerName}\nPhone: ${target.phone}\nTour Package: ${target.tourTitle}\n\n✉️ LIVE WEBSITE EMAIL SENT TO: ${emailResult.emailTo}\nSubject: ${emailResult.subject}\n\nBody Preview:\n${emailResult.bodyText}`);
  }
};

window.rejectCustomerBooking = function(bookingId) {
  const bookings = JSON.parse(localStorage.getItem('m2o_customer_bookings')) || [];
  const target = bookings.find(b => b.id === bookingId);
  if (target) {
    const reason = prompt(`Enter Cancellation / Rejection reason for Customer (${target.customerName}):`, 'Fully booked for requested departure date');
    if (reason === null) return; // User cancelled prompt

    target.status = 'CANCELLED';
    target.cancellationReason = reason || 'Unverified request / Date full';
    target.cancelledAt = new Date().toLocaleString();
    localStorage.setItem('m2o_customer_bookings', JSON.stringify(bookings));
    
    renderAdminBookings();
    
    const emailResult = window.sendLiveWebsiteEmail(target, 'cancellation');
    showToast(`❌ Booking ${bookingId} Cancelled. Notification sent to customer.`, 'error');
    alert(`❌ Booking ${bookingId} Cancelled!\n\nCustomer Name: ${target.customerName}\nReason: ${target.cancellationReason}\n\n✉️ LIVE WEBSITE CANCELLATION EMAIL SENT TO: ${emailResult.emailTo}\nSubject: ${emailResult.subject}`);
  }
};

window.clearAllBookingsHandler = function() {
  if (confirm('Are you sure you want to clear all customer bookings?')) {
    localStorage.removeItem('m2o_customer_bookings');
    renderAdminBookings();
    showToast('Cleared all customer booking records', 'info');
  }
};

// ==========================================
// CUSTOMER PROFILE & BOOKINGS MODAL & LIVE NOTIFICATIONS
// ==========================================
window.openMyProfileModal = function() {
  const modal = document.getElementById('myProfileModal');
  renderCustomerProfileBookings();
  if (modal) modal.classList.remove('hidden');
};

window.closeMyProfileModal = function() {
  const modal = document.getElementById('myProfileModal');
  if (modal) modal.classList.add('hidden');
};

function renderCustomerProfileBookings() {
  const container = document.getElementById('myBookingsContainer');
  if (!container) return;

  const loggedUser = JSON.parse(localStorage.getItem('m2o_logged_user'));
  const loggedName = loggedUser ? loggedUser.name : 'Sharmin Chowdhury';
  const loggedPhone = loggedUser ? loggedUser.mobile : '01977477172';
  const loggedEmail = loggedUser ? loggedUser.email : 'sharmin@gmail.com';

  const nameEl = document.getElementById('myProfileName');
  const contactEl = document.getElementById('myProfileContact');
  if (nameEl) nameEl.textContent = loggedName;
  if (contactEl) contactEl.textContent = `📱 ${loggedPhone} • ✉️ ${loggedEmail}`;

  const bookings = JSON.parse(localStorage.getItem('m2o_customer_bookings')) || [
    {
      id: 'M2O-BK-99482',
      customerName: loggedName,
      phone: loggedPhone,
      email: loggedEmail,
      tourTitle: "3-Night / 4-Day Bhutan Cultural Tour & Tiger's Nest Hike",
      travelersCount: '2 Adults',
      passportNo: 'A09827364',
      paymentMethod: 'Direct Call Request',
      status: 'PENDING',
      date: '10/08/2026'
    }
  ];

  container.innerHTML = '';
  if (bookings.length === 0) {
    container.innerHTML = `<p style="text-align: center; color: #94a3b8; padding: 2rem;">আপনার কোনো বুকিং রেকর্ড পাওয়া যায়নি।</p>`;
    return;
  }

  bookings.forEach(bk => {
    const card = document.createElement('div');
    card.style.cssText = `background: var(--bg-input); border: 1.5px solid var(--bg-glass-border); border-radius: 12px; padding: 1.2rem; color: var(--text-main); margin-bottom: 0.8rem;`;

    let statusTagHtml = '';
    let statusDesc = '';
    if (bk.status === 'APPROVED' || bk.status === 'CONFIRMED') {
      statusTagHtml = `<span style="background: rgba(0, 166, 81, 0.18); color: #22c55e; font-weight: 800; font-size: 0.8rem; padding: 0.3rem 0.75rem; border-radius: 9999px; border: 1px solid rgba(34, 197, 94, 0.3);">✅ APPROVED (অনুমোদিত)</span>`;
      statusDesc = `<p style="font-size: 0.85rem; color: #22c55e; font-weight: 700; margin-top: 0.6rem;">🎉 অভিনন্দন! আপনার ট্রিপ বুকিং ওনার দ্বারা অনুমোদিত হয়েছে! কনফার্মেশন ইমেইল আপনার ঠিকানায় পাঠানো হয়েছে।</p>`;
    } else if (bk.status === 'CANCELLED' || bk.status === 'REJECTED') {
      statusTagHtml = `<span style="background: rgba(239, 68, 68, 0.18); color: #ef4444; font-weight: 800; font-size: 0.8rem; padding: 0.3rem 0.75rem; border-radius: 9999px; border: 1px solid rgba(239, 68, 68, 0.3);">❌ CANCELLED (বাতিলকৃত)</span>`;
      statusDesc = `<div style="background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3); padding: 0.6rem 0.8rem; border-radius: 8px; margin-top: 0.6rem;">
        <span style="font-size: 0.82rem; color: #ef4444; font-weight: 800; display: block;">❌ বাতিলের কারণ: ${bk.cancellationReason || 'নির্ধারিত তারিখে পর্যাপ্ত সিট খালি নেই'}</span>
        <span style="font-size: 0.78rem; color: #cbd5e1;">সহায়তার জন্য হটলাইনে কল করুন: +880 1977-477172</span>
      </div>`;
    } else {
      statusTagHtml = `<span style="background: rgba(234, 179, 8, 0.18); color: #eab308; font-weight: 800; font-size: 0.8rem; padding: 0.3rem 0.75rem; border-radius: 9999px; border: 1px solid rgba(234, 179, 8, 0.3);">⏳ PENDING (অনুমোদনের অপেক্ষায়)</span>`;
      statusDesc = `<p style="font-size: 0.85rem; color: #eab308; font-weight: 700; margin-top: 0.6rem;">⏳ আপনার বুকিং আবেদন ওনার ড্যাশবোর্ডে পর্যালোচনার জন্য জমা রয়েছে।</p>`;
    }

    card.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.6rem;">
        <div>
          <span style="font-size: 0.75rem; color: var(--text-dim); font-weight: 700;">VOUCHER ID</span>
          <h5 style="font-size: 1.1rem; color: #00f2fe; font-weight: 800;">${bk.id}</h5>
        </div>
        <div>${statusTagHtml}</div>
      </div>
      <h4 style="font-size: 1.02rem; font-weight: 800; margin-bottom: 0.4rem; color: var(--text-main);">${bk.tourTitle}</h4>
      <div style="display: flex; flex-wrap: wrap; gap: 1rem; font-size: 0.84rem; color: var(--text-muted); margin-bottom: 0.4rem;">
        <span>🗓️ Date: <strong>${bk.travelDate || bk.date}</strong></span>
        <span>👥 Travelers: <strong>${bk.travelersCount}</strong></span>
        ${bk.passportNo ? `<span>🛂 Passport: <strong>${bk.passportNo}</strong></span>` : ''}
        <span>💳 Method: <strong>${bk.paymentMethod}</strong></span>
      </div>
      ${statusDesc}
      <button onclick="localStorage.setItem('m2o_active_booking_id', '${bk.id}'); window.location.href='booking_detail.html';" style="margin-top: 0.8rem; padding: 0.45rem 0.95rem; background: linear-gradient(135deg, #00a651 0%, #0072bc 100%); border: none; border-radius: 8px; color: #ffffff; font-weight: 800; font-size: 0.82rem; cursor: pointer; width: 100%;">
        📋 Track Booking File &amp; Live Status ➔
      </button>
    `;
    container.appendChild(card);
  });
}

function checkCustomerBookingNotifications() {
  const bookings = JSON.parse(localStorage.getItem('m2o_customer_bookings')) || [];
  const approvedOne = bookings.find(b => b.status === 'APPROVED');
  const badgeEl = document.getElementById('custBookingStatusBadge');
  if (approvedOne && badgeEl) {
    badgeEl.textContent = `🎉 Approved (${approvedOne.id})`;
    badgeEl.style.color = '#00a651';
  }
}

  // ==========================================
  // REGISTERED USERS & LOGIN DATA COLLECTOR
  // ==========================================
  const defaultRegisteredUsers = [
    { id: 'M2O-USR-OWNER', name: 'Mount2ocean Owner Admin', mobile: '01977477172', email: 'admin@mount2ocean.com', role: 'ADMIN OWNER', registeredAt: '2026-07-30 08:00 AM', lastLoginAt: '2026-07-30 03:00 PM', loginCount: 1, status: 'Verified Owner Admin' },
    { id: 'M2O-USR-CUST', name: 'Standard Traveler Customer', mobile: '01711002233', email: 'customer@mount2ocean.com', role: 'CUSTOMER', registeredAt: '2026-07-30 08:00 AM', lastLoginAt: '2026-07-30 03:00 PM', loginCount: 1, status: 'Verified Customer' },
    { id: 'M2O-USR-GUIDE', name: 'Certified Tour Guide', mobile: '01811002233', email: 'guide@mount2ocean.com', role: 'TOUR GUIDE', registeredAt: '2026-07-30 08:00 AM', lastLoginAt: '2026-07-30 03:00 PM', loginCount: 1, status: 'Verified Guide' },
    { id: 'M2O-USR-AGENT', name: 'Verified Travel Agency', mobile: '01911002233', email: 'agent@mount2ocean.com', role: 'B2B AGENT', registeredAt: '2026-07-30 08:00 AM', lastLoginAt: '2026-07-30 03:00 PM', loginCount: 1, status: 'Verified Agent' }
  ];

  window.collectAndStoreUser = function(userData) {
    let users = JSON.parse(localStorage.getItem('m2o_registered_users'));
    if (!users || users.length === 0) {
      users = defaultRegisteredUsers;
    }

    const emailKey = (userData.email || '').toLowerCase();
    const phoneKey = userData.mobile || userData.phone || '';

    let existing = users.find(u => (u.email && u.email.toLowerCase() === emailKey) || (phoneKey && u.mobile === phoneKey));

    const nowStr = new Date().toLocaleString('bn-BD');

    if (existing) {
      existing.lastLoginAt = nowStr;
      existing.loginCount = (existing.loginCount || 1) + 1;
      if (userData.name) existing.name = userData.name;
      if (userData.role) existing.role = userData.role.toUpperCase();
    } else {
      const newUser = {
        id: 'M2O-USR-' + Math.floor(1000 + Math.random() * 9000),
        name: userData.name || 'Anonymous User',
        mobile: phoneKey || '01700000000',
        email: userData.email || 'user@mount2ocean.com',
        role: (userData.role || 'CUSTOMER').toUpperCase(),
        registeredAt: nowStr,
        lastLoginAt: nowStr,
        loginCount: 1,
        status: 'Active / Verified'
      };
      users.unshift(newUser);
    }

    localStorage.setItem('m2o_registered_users', JSON.stringify(users));

    const logs = JSON.parse(localStorage.getItem('m2o_user_login_logs')) || [];
    logs.unshift({
      userName: userData.name || 'Registered Customer',
      email: userData.email,
      role: userData.role || 'CUSTOMER',
      timestamp: nowStr,
      device: navigator.userAgent.includes('Mobile') ? 'Mobile Browser' : 'Desktop Browser'
    });
    localStorage.setItem('m2o_user_login_logs', JSON.stringify(logs.slice(0, 100)));

    if (typeof renderAdminUserDirectory === 'function') {
      renderAdminUserDirectory();
    }
  };

  window.renderAdminUserDirectory = function() {
    const tbody = document.getElementById('adminUserDirectoryTbody');
    if (!tbody) return;

    let users = JSON.parse(localStorage.getItem('m2o_registered_users'));
    if (!users || users.length === 0) {
      users = defaultRegisteredUsers;
      localStorage.setItem('m2o_registered_users', JSON.stringify(users));
    }

    tbody.innerHTML = '';
    users.forEach(u => {
      const tr = document.createElement('tr');
      
      let roleBadgeClass = 'status-badge-live';
      if (u.role === 'TOUR GUIDE') roleBadgeClass = 'pay-pill';
      if (u.role === 'B2B AGENT') roleBadgeClass = 'status-badge-live';

      tr.innerHTML = `
        <td><strong style="color: #0072bc;">${u.id}</strong></td>
        <td><strong>${u.name}</strong></td>
        <td>
          <div style="font-size: 0.86rem; line-height: 1.4;">
            <a href="tel:${u.mobile}" style="color: #00a651; font-weight: 800; text-decoration: none;">📞 ${u.mobile}</a><br>
            <span style="color: #64748b; font-size: 0.8rem;">✉️ ${u.email}</span>
          </div>
        </td>
        <td><span class="${roleBadgeClass}" style="padding: 0.25rem 0.65rem; font-size: 0.78rem;">${u.role}</span></td>
        <td><span style="font-size: 0.82rem; color: #64748b;">${u.registeredAt}</span></td>
        <td>
          <span style="font-size: 0.82rem; color: #00a651; font-weight: 700;">🟢 ${u.lastLoginAt}</span><br>
          <span style="font-size: 0.75rem; color: #64748b;">(Sessions: ${u.loginCount || 1})</span>
        </td>
        <td><span class="status-badge-live" style="background: rgba(34,197,94,0.15); color: #22c55e;">✔ ${u.status || 'Active'}</span></td>
        <td>
          <div style="display: flex; gap: 0.4rem; flex-wrap: wrap;">
            <a href="tel:${u.mobile}" class="primary-btn" style="padding: 0.25rem 0.5rem; font-size: 0.74rem; background: #00a651; text-decoration: none;">📞 Call</a>
            <button type="button" class="danger-btn" style="padding: 0.25rem 0.5rem; font-size: 0.74rem;" onclick="deleteUserDirectoryRecord('${u.id}')">🗑️ Delete</button>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });
  };

  window.deleteUserDirectoryRecord = function(userId) {
    if (!confirm('Are you sure you want to delete this user profile record?')) return;
    let users = JSON.parse(localStorage.getItem('m2o_registered_users')) || [];
    users = users.filter(u => u.id !== userId);
    localStorage.setItem('m2o_registered_users', JSON.stringify(users));
    renderAdminUserDirectory();
    if (typeof showToast === 'function') showToast('User profile record removed successfully', 'info');
  };

  window.clearUserDirectoryHandler = function() {
    if (!confirm('Reset user directory to default verified accounts?')) return;
    localStorage.removeItem('m2o_registered_users');
    renderAdminUserDirectory();
  };

  // ==========================================
  // PACKAGE-SPECIFIC PROMO CODE MANAGER ENGINE
  // ==========================================
  const defaultPromoCodes = [
    { code: 'BALI20', targetPkg: 'pkg-bali-4d3n', targetName: 'BALI PACKAGE 4D/3N', type: 'PERCENT', value: 20, createdAt: '2026-07-29', status: 'ACTIVE' },
    { code: 'BHUTAN5K', targetPkg: 'pkg-bhutan', targetName: 'Bhutan Cultural Tour', type: 'FLAT', value: 5000, createdAt: '2026-07-29', status: 'ACTIVE' }
  ];

  window.populatePromoTargetPackageDropdown = function() {
    const select = document.getElementById('promoTargetPkgSelect');
    if (!select) return;

    const pkgs = window.getCombinedLivePackages ? window.getCombinedLivePackages() : [];
    select.innerHTML = '<option value="ALL">🌐 All Packages (সকল প্যাকেজ)</option>';

    pkgs.forEach(p => {
      const opt = document.createElement('option');
      opt.value = p.id;
      opt.textContent = `📦 ${p.name}`;
      select.appendChild(opt);
    });
  };

  window.renderAdminPromoCodes = function() {
    const tbody = document.getElementById('adminPromoCodesTbody');
    if (!tbody) return;

    populatePromoTargetPackageDropdown();

    let promos = JSON.parse(localStorage.getItem('m2o_package_promo_codes'));
    if (!promos || promos.length === 0) {
      promos = defaultPromoCodes;
      localStorage.setItem('m2o_package_promo_codes', JSON.stringify(promos));
    }

    tbody.innerHTML = '';
    promos.forEach(p => {
      const tr = document.createElement('tr');
      const valStr = p.type === 'PERCENT' ? `${p.value}% OFF` : `৳${p.value.toLocaleString()} FLAT OFF`;

      tr.innerHTML = `
        <td><strong style="color: #0072bc; font-size: 1rem; letter-spacing: 1px;">${p.code}</strong></td>
        <td><strong style="color: var(--text-main);">${p.targetName || p.targetPkg}</strong></td>
        <td><span class="status-badge-live" style="background: rgba(0, 166, 81, 0.15); color: #00a651; font-weight: 800;">${valStr}</span></td>
        <td><span style="font-size: 0.84rem; color: #64748b;">${p.createdAt}</span></td>
        <td><span class="status-badge-live" style="background: rgba(34, 197, 94, 0.15); color: #22c55e;">✔ ${p.status}</span></td>
        <td>
          <button type="button" class="danger-btn" style="padding: 0.3rem 0.65rem; font-size: 0.78rem;" onclick="deletePromoCode('${p.code}')">🗑️ Delete</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  };

  window.handleCreatePromoCode = function(event) {
    event.preventDefault();
    const code = (document.getElementById('promoCodeInput').value || '').trim().toUpperCase();
    const targetPkgSelect = document.getElementById('promoTargetPkgSelect');
    const targetPkg = targetPkgSelect ? targetPkgSelect.value : 'ALL';
    const targetName = targetPkgSelect && targetPkgSelect.options[targetPkgSelect.selectedIndex] ? targetPkgSelect.options[targetPkgSelect.selectedIndex].text : 'All Packages';
    const type = document.getElementById('promoDiscountTypeSelect').value;
    const value = parseFloat(document.getElementById('promoDiscountValueInput').value) || 0;

    if (!code || value <= 0) {
      if (typeof showToast === 'function') showToast('Please enter a valid code and discount value!', 'error');
      return;
    }

    let promos = JSON.parse(localStorage.getItem('m2o_package_promo_codes')) || defaultPromoCodes;
    promos = promos.filter(p => p.code !== code);

    promos.unshift({
      code: code,
      targetPkg: targetPkg,
      targetName: targetName,
      type: type,
      value: value,
      createdAt: new Date().toLocaleDateString('bn-BD'),
      status: 'ACTIVE'
    });

    localStorage.setItem('m2o_package_promo_codes', JSON.stringify(promos));
    renderAdminPromoCodes();
    document.getElementById('createPromoCodeForm').reset();
    if (typeof showToast === 'function') showToast(`🎉 Promo Code ${code} created successfully!`, 'success');
  };

  window.deletePromoCode = function(code) {
    if (!confirm(`Delete Promo Code ${code}?`)) return;
    let promos = JSON.parse(localStorage.getItem('m2o_package_promo_codes')) || [];
    promos = promos.filter(p => p.code !== code);
    localStorage.setItem('m2o_package_promo_codes', JSON.stringify(promos));
    renderAdminPromoCodes();
    if (typeof showToast === 'function') showToast(`Promo Code ${code} removed`, 'info');
  };

  window.validateAndApplyPromoCode = function(inputCode, currentPkgId, baseAmount) {
    const cleanCode = (inputCode || '').trim().toUpperCase();
    let promos = JSON.parse(localStorage.getItem('m2o_package_promo_codes')) || defaultPromoCodes;

    const promo = promos.find(p => p.code === cleanCode && p.status === 'ACTIVE');

    if (!promo) {
      return { valid: false, message: '❌ Invalid or expired Promo Code!' };
    }

    if (promo.targetPkg !== 'ALL' && promo.targetPkg !== currentPkgId) {
      return { valid: false, message: `⚠️ Code ${cleanCode} is valid only for ${promo.targetName || 'specific package'}!` };
    }

    let discountAmount = 0;
    if (promo.type === 'PERCENT') {
      discountAmount = Math.round((baseAmount * promo.value) / 100);
    } else {
      discountAmount = Math.min(baseAmount, promo.value);
    }

    const newTotal = Math.max(0, baseAmount - discountAmount);

    return {
      valid: true,
      code: promo.code,
      discountAmount: discountAmount,
      newTotal: newTotal,
      message: `🎉 Promo Code ${promo.code} Applied! You saved ৳${discountAmount.toLocaleString()}!`
    };
  };

  // ==========================================
  // GLOBAL WEBSITE SETTINGS & BUSINESS CONTROLS
  // ==========================================
  const defaultGlobalSettings = {
    phone: '+880 1977-477172',
    email: 'info@mount2ocean.com',
    address: 'Banani C/A, Dhaka 1213, Bangladesh',
    announcement: '🎉 Special Summer Discount Offer! Enjoy up to 20% OFF on all International & Domestic Tour Packages!'
  };

  window.renderAdminGlobalSettings = function() {
    const phoneInput = document.getElementById('settingHotlinePhone');
    const emailInput = document.getElementById('settingSupportEmail');
    const addrInput = document.getElementById('settingOfficeAddress');
    const annInput = document.getElementById('settingAnnouncementText');

    if (!phoneInput) return;

    let settings = JSON.parse(localStorage.getItem('m2o_global_settings')) || defaultGlobalSettings;

    if (phoneInput) phoneInput.value = settings.phone || defaultGlobalSettings.phone;
    if (emailInput) emailInput.value = settings.email || defaultGlobalSettings.email;
    if (addrInput) addrInput.value = settings.address || defaultGlobalSettings.address;
    if (annInput) annInput.value = settings.announcement || defaultGlobalSettings.announcement;

    applyGlobalSettingsToDOM(settings);
  };

  window.handleSaveGlobalSettings = function(event) {
    event.preventDefault();
    const settings = {
      phone: document.getElementById('settingHotlinePhone').value.trim(),
      email: document.getElementById('settingSupportEmail').value.trim(),
      address: document.getElementById('settingOfficeAddress').value.trim(),
      announcement: document.getElementById('settingAnnouncementText').value.trim()
    };

    localStorage.setItem('m2o_global_settings', JSON.stringify(settings));
    applyGlobalSettingsToDOM(settings);
    if (typeof showToast === 'function') showToast('🎉 Global Website Settings & Hotline saved live!', 'success');
  };

  window.applyGlobalSettingsToDOM = function(settings) {
    const s = settings || JSON.parse(localStorage.getItem('m2o_global_settings')) || defaultGlobalSettings;

    document.querySelectorAll('a[href^="tel:"]').forEach(el => {
      if (s.phone) {
        el.href = `tel:${s.phone.replace(/[^0-9+]/g, '')}`;
        if (el.textContent.includes('+880') || el.textContent.includes('01977')) {
          el.textContent = s.phone;
        }
      }
    });

    document.querySelectorAll('a[href^="mailto:"]').forEach(el => {
      if (s.email) {
        el.href = `mailto:${s.email}`;
        if (el.textContent.includes('@')) {
          el.textContent = s.email;
        }
      }
    });

    const annEl = document.getElementById('topAnnouncementBar');
    if (annEl && s.announcement) {
      annEl.textContent = s.announcement;
    }
  };

  function init() {
    // Enforce Clean Official 4 Accounts User Directory Purge
    let currentUsers = JSON.parse(localStorage.getItem('m2o_registered_users')) || [];
    if (currentUsers.some(u => u.id === 'M2O-USR-101' || u.id === 'M2O-USR-102' || !u.id.startsWith('M2O-USR-'))) {
      localStorage.setItem('m2o_registered_users', JSON.stringify(defaultRegisteredUsers));
    }
    let savedPkgs = JSON.parse(localStorage.getItem('m2o_live_packages')) || [];
    const mockOldIds = ['pkg-1', 'pkg-2', 'pkg-3', 'pkg-4', 'pkg-5', 'pkg-6', 'pkg-7', 'pkg-coxsbazar', 'pkg-dubai', 'pkg-maldives', 'pkg-saintmartin'];
    if (savedPkgs.some(p => mockOldIds.includes(p.id))) {
      savedPkgs = savedPkgs.filter(p => !mockOldIds.includes(p.id));
      if (savedPkgs.length === 0) {
        savedPkgs = [...window.defaultPackages];
      }
      localStorage.setItem('m2o_live_packages', JSON.stringify(savedPkgs));
    }

    // Seed active customer bookings if list is empty
    let savedBk = JSON.parse(localStorage.getItem('m2o_customer_bookings'));
    if (!savedBk || savedBk.length === 0 || savedBk.some(b => b.id === 'M2O-BK-99482' || b.id === 'M2O-BK-81723')) {
      savedBk = defaultCustomerBookings;
      localStorage.setItem('m2o_customer_bookings', JSON.stringify(savedBk));
    }

    renderLiveCustomerTours();
    saveAndRenderAdminPackages();
    renderAdminApprovals();
    renderAdminBookings();
    renderAdminUserDirectory();
    renderAdminPromoCodes();
    renderAdminGlobalSettings();
    checkCustomerBookingNotifications();
    updateAdminDashboardMetrics();
  }

  window.checkCustomerBookingNotifications = function() {
    const notifications = JSON.parse(localStorage.getItem('m2o_customer_notifications')) || [];
    const unreadNotif = notifications.find(n => !n.read);

    if (unreadNotif) {
      let notifBanner = document.getElementById('customerLiveNotificationToast');
      if (!notifBanner) {
        notifBanner = document.createElement('div');
        notifBanner.id = 'customerLiveNotificationToast';
        notifBanner.style.cssText = `
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 10000;
          max-width: 420px;
          background: #ffffff;
          border-radius: 16px;
          border: 2px solid ${unreadNotif.type === 'APPROVED' ? '#00a651' : '#ef4444'};
          box-shadow: 0 10px 30px rgba(0,0,0,0.25);
          padding: 1.2rem 1.4rem;
          font-family: 'Inter', sans-serif;
          animation: slideInRight 0.4s ease;
        `;
        document.body.appendChild(notifBanner);
      }

      const titleColor = unreadNotif.type === 'APPROVED' ? '#00a651' : '#ef4444';
      notifBanner.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.4rem;">
          <strong style="color: ${titleColor}; font-size: 1.05rem; font-weight: 800;">${unreadNotif.title}</strong>
          <button onclick="dismissCustomerNotification('${unreadNotif.id}')" style="border: none; background: transparent; cursor: pointer; font-size: 1.1rem; color: #94a3b8; font-weight: 800;">✕</button>
        </div>
        <p style="margin: 0 0 0.8rem; font-size: 0.88rem; color: #334155; line-height: 1.45;">${unreadNotif.message}</p>
        <div style="display: flex; gap: 0.6rem; align-items: center;">
          <a href="my_profile.html" class="primary-btn" style="padding: 0.4rem 0.85rem; font-size: 0.8rem; font-weight: 800; text-decoration: none; background: ${titleColor};">View My Profile &amp; Ticket ➔</a>
          <button onclick="dismissCustomerNotification('${unreadNotif.id}')" class="secondary-btn" style="padding: 0.4rem 0.7rem; font-size: 0.8rem; font-weight: 700;">Dismiss</button>
        </div>
      `;
    }
  };

  window.dismissCustomerNotification = function(notifId) {
    let notifications = JSON.parse(localStorage.getItem('m2o_customer_notifications')) || [];
    let item = notifications.find(n => n.id === notifId);
    if (item) item.read = true;
    localStorage.setItem('m2o_customer_notifications', JSON.stringify(notifications));

    const notifBanner = document.getElementById('customerLiveNotificationToast');
    if (notifBanner) notifBanner.remove();
  };

  // Cross-tab real-time storage sync listener
  window.addEventListener('storage', function(e) {
    if (e.key === 'm2o_customer_bookings' || e.key === 'm2o_live_packages' || e.key === 'm2o_customer_notifications' || e.key === 'm2o_support_tickets' || e.key === 'm2o_customer_chat_messages') {
      if (typeof renderAdminBookings === 'function') renderAdminBookings();
      if (typeof updateAdminDashboardMetrics === 'function') updateAdminDashboardMetrics();
      if (typeof saveAndRenderAdminPackages === 'function') saveAndRenderAdminPackages();
      if (typeof renderLiveCustomerTours === 'function') renderLiveCustomerTours();
      if (typeof checkCustomerBookingNotifications === 'function') checkCustomerBookingNotifications();
      if (typeof loadCustomerProfileAndBookings === 'function') loadCustomerProfileAndBookings();
      if (typeof renderAdminLiveSupportConsole === 'function') renderAdminLiveSupportConsole();
      if (typeof renderCustomerChatMessages === 'function') renderCustomerChatMessages();
    }
  });

  // ==========================================
  // MAGIC AI ASSISTANT BOT & LIVE ADMIN SUPPORT ENGINE
  // ==========================================
  const defaultAiInitialMessages = [
    { sender: 'bot', text: '👋 আসসালামু আলাইকুম! Mount2ocean AI স্মার্ট অ্যাসিস্ট্যান্ট এ আপনাকে স্বাগতম! আমি কীভাবে সাহায্য করতে পারি?', time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }
  ];

  window.getAiChatMessages = function() {
    const saved = localStorage.getItem('m2o_customer_chat_messages');
    if (!saved) {
      localStorage.setItem('m2o_customer_chat_messages', JSON.stringify(defaultAiInitialMessages));
      return defaultAiInitialMessages;
    }
    try { return JSON.parse(saved); } catch(e) { return defaultAiInitialMessages; }
  };

  window.saveAiChatMessages = function(msgs) {
    localStorage.setItem('m2o_customer_chat_messages', JSON.stringify(msgs));
    if (typeof renderCustomerChatMessages === 'function') renderCustomerChatMessages();
  };

  window.getSupportTickets = function() {
    const saved = localStorage.getItem('m2o_support_tickets');
    if (!saved) return [];
    try { return JSON.parse(saved); } catch(e) { return []; }
  };

  window.saveSupportTickets = function(tickets) {
    localStorage.setItem('m2o_support_tickets', JSON.stringify(tickets));
    if (typeof renderAdminLiveSupportConsole === 'function') renderAdminLiveSupportConsole();
  };

  // 1-Click Test Data Cleanup Utility for Owner Admin
  window.clearM2OTestData = function() {
    if (confirm('আপনি কি নিশ্চিত যে সকল টেস্ট বুকিং, টেস্ট টিকিট ও সাপোর্ট মেসেজ ডিলিট করতে চান? (Clear all temporary test data?)')) {
      localStorage.removeItem('m2o_support_tickets');
      localStorage.removeItem('m2o_customer_chat_messages');
      localStorage.setItem('m2o_customer_notifications', JSON.stringify([]));
      
      if (typeof showToast === 'function') showToast('🧹 All temporary test data removed successfully!', 'success');
      setTimeout(() => window.location.reload(), 800);
    }
  };

  // Process Customer Query using Full Website Research Knowledge Base
  window.processCustomerAiQuery = function(userText) {
    if (!userText || !userText.trim()) return;
    const text = userText.trim();
    const lower = text.toLowerCase();
    const timeStr = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

    let messages = getAiChatMessages();
    messages.push({ sender: 'customer', text: text, time: timeStr });
    saveAiChatMessages(messages);

    const loggedUser = JSON.parse(localStorage.getItem('m2o_logged_user')) || { name: 'Valued Customer', mobile: '01977477172', email: 'customer@mount2ocean.com' };

    // Check if user is replying YES to live support escalation
    const isEscalationRequest = lower.includes('হ্যাঁ') || lower.includes('yes') || lower.includes('support') || lower.includes('কথা') || lower.includes('কথা বলতে চাই') || lower.includes('লাইভ') || lower.includes('প্রতিনিধি');

    if (window.aiWaitingEscalationConsent || isEscalationRequest) {
      window.aiWaitingEscalationConsent = false;
      
      // Create / Update Support Ticket for Admin Panel
      let tickets = getSupportTickets();
      let ticket = tickets.find(t => t.customerName === loggedUser.name || t.phone === loggedUser.mobile);

      if (!ticket) {
        ticket = {
          id: 'TICKET-' + Math.floor(1000 + Math.random() * 9000),
          customerName: loggedUser.name,
          phone: loggedUser.mobile,
          email: loggedUser.email,
          status: 'ESCALATED_PENDING',
          updatedAt: timeStr,
          messages: []
        };
        tickets.unshift(ticket);
      }

      ticket.status = 'ESCALATED_PENDING';
      ticket.updatedAt = timeStr;
      ticket.lastMessage = text;
      ticket.messages.push({ sender: 'customer', text: text, time: timeStr });

      saveSupportTickets(tickets);

      setTimeout(() => {
        let currentMsgs = getAiChatMessages();
        currentMsgs.push({
          sender: 'bot',
          text: `⏳ আপনার রিকোয়েস্টটি Mount2ocean ওনার ও অ্যাডমিন লাইভ সাপোর্ট কনসোলে ট্রান্সফার করা হয়েছে। ওনার/অ্যাডমিন টিম খুব শীঘ্রই আপনাকে সরাসরি রিপ্লাই দেবেন।`,
          time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        });
        saveAiChatMessages(currentMsgs);
        if (typeof showToast === 'function') showToast('💬 Connected to Admin Live Support Team!', 'success');
      }, 600);

      return;
    }

    // Full Website Knowledge Base AI Engine
    const livePkgs = window.getCombinedLivePackages ? window.getCombinedLivePackages() : [];
    let botReply = '';

    if (lower.includes('sylhet') || lower.includes('সিলেট') || lower.includes('jaflong') || lower.includes('জাফলং') || lower.includes('ratargul') || lower.includes('রাতারগুল')) {
      const pkg = livePkgs.find(p => p.id === 'pkg-sylhet-tea' || (p.category || '').includes('sylhet'));
      botReply = `🍵 ${pkg ? pkg.name : 'Sylhet Tea Garden, Jaflong & Ratargul Swamp Forest Tour'}\n💰 মূল্য: ${pkg ? pkg.price : '৳১২,৫০০'} (প্রতি জন)\n⏱️ সময়কাল: 3 Days / 2 Nights\n📜 অন্তর্ভুক্ত: গ্রিন টি গার্ডেন রিসোর্ট স্টেই, রাতারগুল বোট রাইড, জাফলং জিরো পয়েন্ট সফর ও মিলস।\n\nসরাসরি বুক করতে "Tour Packages" পেজে ক্লিক করুন!`;
    } else if (lower.includes('nepal') || lower.includes('নেপাল') || lower.includes('kathmandu') || lower.includes('কাঠমান্ডু') || lower.includes('pokhara') || lower.includes('পোখরা')) {
      const pkg = livePkgs.find(p => p.id === 'pkg-nepal-himalaya' || (p.category || '').includes('nepal'));
      botReply = `🏔️ ${pkg ? pkg.name : 'Nepal Kathmandu, Pokhara & Annapurna Himalayan Sunrise Tour'}\n💰 মূল্য: ${pkg ? pkg.price : '৳৪২,০০০'} (প্রতি জন)\n⏱️ সময়কাল: 5 Days / 4 Nights\n📜 অন্তর্ভুক্ত: পশুপতিনাথ মন্দির, ফেওয়া লেকে বোটিং, সারংকোট হিমালয় সানরাইজ পয়েন্ট ও প্যারাগ্লাইডিং।`;
    } else if (lower.includes('cox') || lower.includes('কক্সবাজার') || lower.includes('saint') || lower.includes('সেন্টমার্টিন')) {
      const pkg = livePkgs.find(p => p.id === 'pkg-coxsbazar-beach' || (p.category || '').includes('coxsbazar'));
      botReply = `🏖️ ${pkg ? pkg.name : "Cox's Bazar 5-Star Ocean Resort & Saint Martin Coral Cruise"}\n💰 মূল্য: ${pkg ? pkg.price : '৳১৮,৫০০'} (প্রতি জন)\n⏱️ সময়কাল: 3 Days / 2 Nights\n📜 অন্তর্ভুক্ত: সি-ফ্রন্ট ৫-স্টার রিসোর্ট, সি-ফুড বুফে ব্রেকফাস্ট, সেন্টমার্টিন শিপ ক্রুজ এবং কোলাতলী বিচ ট্যুর।`;
    } else if (lower.includes('dubai') || lower.includes('দুবাই') || lower.includes('burj') || lower.includes('বুর্জ')) {
      const pkg = livePkgs.find(p => p.id === 'pkg-dubai-safari' || (p.category || '').includes('dubai'));
      botReply = `🏙️ ${pkg ? pkg.name : 'Dubai Desert Safari, Burj Khalifa & Marina Dhow Cruise'}\n💰 মূল্য: ${pkg ? pkg.price : '৳৪৮,০০০'} (প্রতি জন)\n⏱️ সময়কাল: 5 Days / 4 Nights\n📜 অন্তর্ভুক্ত: ৪x৪ ডেসার্ট সাফারি, বুর্জ খলিফা ১২৪ তলার টিকেট, মেরিনা ক্রুজ উইথ বার্বিকিউ ডিনার।`;
    } else if (lower.includes('maldives') || lower.includes('মালদ্বীপ')) {
      const pkg = livePkgs.find(p => p.id === 'pkg-maldives-resort' || (p.category || '').includes('maldives'));
      botReply = `🏝️ ${pkg ? pkg.name : 'Maldives Overwater Resort Villa & Speedboat Transfer'}\n💰 মূল্য: ${pkg ? pkg.price : '৳৮৫,০০০'} (প্রতি জন)\n⏱️ সময়কাল: 4 Days / 3 Nights\n📜 অন্তর্ভুক্ত: প্রাইভেট ওভারওয়াটার ভিলা, স্নরকেলিং স্পিডবোট রাইড, অল-ইনক্লুসিভ লাক্সারি মিলস।`;
    } else if (lower.includes('bhutan') || lower.includes('ভুটান')) {
      const pkg = livePkgs.find(p => p.id === 'pkg-bhutan' || (p.category || '').includes('bhutan'));
      botReply = `🇧🇹 ${pkg ? pkg.name : "Bhutan Cultural Tour & Tiger's Nest Hike"}\n💰 মূল্য: ${pkg ? pkg.price : '৳৭৫,০০০'} (প্রতি জন)\n⏱️ সময়কাল: 4 Days / 3 Nights\n📜 অন্তর্ভুক্ত: রিটার্ন এয়ার টিকিট, ৩-স্টার হোটেল, পারো ও থিম্পু সাইটসিয়িং।`;
    } else if (lower.includes('bali') || lower.includes('বালি')) {
      const pkg = livePkgs.find(p => p.id === 'pkg-bali-4d3n' || (p.category || '').includes('bali'));
      botReply = `🇮🇩 ${pkg ? pkg.name : 'Bali Kintamani Volcano, Tanah Lot & Nusa Penida Cruise'}\n💰 মূল্য: ${pkg ? pkg.price : '৳১৭,৫০০'} (প্রতি জন)\n⏱️ সময়কাল: 4 Days / 3 Nights\n📜 অন্তর্ভুক্ত: কিন্তামানি আগ্নেয়গিরি, ওয়াটার স্পোর্টস বোট রাইড এবং তানাহ লট সানসেট ট্যুর।`;
    } else if (lower.includes('flight') || lower.includes('ticket') || lower.includes('টিকিট') || lower.includes('বিমান') || lower.includes('এয়ারলাইন্স')) {
      botReply = `✈️ এয়ার টিকিট সার্ভিস:\n• অভ্যন্তরীণ ও আন্তর্জাতিক সকল এয়ারলাইন্সের টিকেট (Biman Bangladesh, US-Bangla, Emirates, Qatar Airways, AirAsia)\n• Mount2ocean এজেন্ট ড্যাশবোর্ড থেকে তাৎক্ষণিক সার্চ ও সিট কনফার্মেশন সুবিধা।`;
    } else if (lower.includes('hotel') || lower.includes('হোটেল') || lower.includes('resort') || lower.includes('রিসোর্ট')) {
      botReply = `🏢 হোটেল ও রিসোর্ট বুকিং:\n• ৩-স্টার, ৪-স্টার এবং ৫-স্টার লাক্সারি রিসোর্ট ডিসকাউন্ট রেটে।\n• বাংলাদেশ, দুবাই, বালি, মালদ্বীপ ও ইউরোপসহ সকল জনপ্রিয় ডেসটিনেশনের হোটেল সুবিধা।`;
    } else if (lower.includes('visa') || lower.includes('ভিসা')) {
      botReply = `🛂 ভিসা প্রসেসিং সার্ভিস:\n• দুবাই (E-Visa 24-48 Hours)\n• থাইল্যান্ড, মালয়েশিয়া, সিঙ্গাপুর, ভারত\n• ইউকে, ইউএসএ ও ইউরোপ শেনজেন ভিসা কনসালটেন্সি ও ফাইল প্রসেসিং।`;
    } else if (lower.includes('package') || lower.includes('প্যাকেজ') || lower.includes('price') || lower.includes('cost') || lower.includes('দাম') || lower.includes('খরচ')) {
      let pkgSummaries = livePkgs.map(p => `• ${p.name}: ${p.price} (${p.duration})`).join('\n');
      botReply = `📦 আমাদের বর্তমান সক্রিয় ৭টি লাক্সারি ট্যুর প্যাকেজ:\n${pkgSummaries}\n\nপ্যাকেজের ছবি ও ফুল ডিটেইলস দেখতে "Tour Packages" পেজে ক্লিক করুন।`;
    } else if (lower.includes('bkash') || lower.includes('payment') || lower.includes('বিকাশ') || lower.includes('পেমেন্ট') || lower.includes('টাকা')) {
      botReply = `💳 পেমেন্ট অপশনসমূহ:\n• bKash / Nagad Direct (+880 1977-477172)\n• Visa / Mastercard Credit/Debit Card\n• Direct Bank Transfer / Cash on Office Counter\n\nবুকিং করার সময় আপনার পছন্দের পেমেন্ট অপশন সিলেক্ট করতে পারবেন।`;
    } else if (lower.includes('refund') || lower.includes('cancel') || lower.includes('বাতিল') || lower.includes('রিফান্ড')) {
      botReply = `🛡️ রিফান্ড পলিসি:\n• ট্রিপ শুরুর ৭ দিন পূর্বে বুকিং ক্যানসেল করলে ১০০% রিফান্ড পাবেন।\n• ওনার/অ্যাডমিন টিম দ্বারা কোনো কারণে সফর স্থগিত হলে তাৎক্ষণিক রিফান্ড সম্পন্ন হয়।`;
    } else if (lower.includes('contact') || lower.includes('phone') || lower.includes('mobile') || lower.includes('helpline') || lower.includes('যোগাযোগ') || lower.includes('ফোন') || lower.includes('ঠিকানা') || lower.includes('office')) {
      const settings = JSON.parse(localStorage.getItem('m2o_global_settings')) || { phone: '+880 1977-477172', email: 'info@mount2ocean.com', address: '169/1 Concord Grand 4th Floor, Shantinagar, Dhaka, Bangladesh, 1217' };
      botReply = `📞 আমাদের যোগাযোগের তথ্য:\n• ২৪/৭ হটলাইন: ${settings.phone}\n• ইমেইল: ${settings.email}\n• কর্পোরেট অফিস: ${settings.address}`;
    } else {
      botReply = `🤖 আপনার প্রশ্নের উত্তর দিতে আমি প্রস্তুত! Mount2ocean এ সকল ট্যুর প্যাকেজ, এয়ার টিকিট, হোটেল এবং ভিসা সার্ভিস বিদ্যমান।\n\n💬 আপনি কি সরাসরি আমাদের লাইভ ওনার/অ্যাডমিন সাপোর্ট টিমের সাথে কথা বলতে চান? 'হ্যাঁ' বা 'Yes' লিখে জানান।`;
      window.aiWaitingEscalationConsent = true;
    }

    setTimeout(() => {
      let currentMsgs = getAiChatMessages();
      currentMsgs.push({
        sender: 'bot',
        text: botReply,
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
      });
      saveAiChatMessages(currentMsgs);
      if (typeof window.renderPageAiChat === 'function') window.renderPageAiChat();
      if (typeof window.renderCustomerChatMessages === 'function') window.renderCustomerChatMessages();
    }, 400);
  };

  // Render Customer Floating Chat Window DOM
  window.renderCustomerChatMessages = function() {
    const chatContainer = document.getElementById('m2oAiChatBody');
    if (!chatContainer) return;

    const messages = getAiChatMessages();
    chatContainer.innerHTML = '';

    messages.forEach(m => {
      const msgDiv = document.createElement('div');
      msgDiv.style.cssText = m.sender === 'customer'
        ? `align-self: flex-end; background: linear-gradient(135deg, #00a651 0%, #0072bc 100%); color: #ffffff; padding: 0.75rem 1rem; border-radius: 14px 14px 2px 14px; max-width: 82%; font-size: 0.88rem; line-height: 1.45; box-shadow: 0 4px 12px rgba(0,166,81,0.2); margin-bottom: 0.6rem;`
        : (m.sender === 'admin' 
          ? `align-self: flex-start; background: #0f172a; color: #00f2fe; border: 1px solid #00f2fe; padding: 0.75rem 1rem; border-radius: 14px 14px 14px 2px; max-width: 82%; font-size: 0.88rem; line-height: 1.45; margin-bottom: 0.6rem;`
          : `align-self: flex-start; background: #f1f5f9; color: #0f172a; padding: 0.75rem 1rem; border-radius: 14px 14px 14px 2px; max-width: 82%; font-size: 0.88rem; line-height: 1.45; border: 1px solid #cbd5e1; margin-bottom: 0.6rem;`);

      const prefix = m.sender === 'admin' ? '<strong style="display:block; font-size:0.75rem; color:#00f2fe; margin-bottom:0.2rem;">👑 ADMIN LIVE SUPPORT TEAM:</strong>' : '';
      msgDiv.innerHTML = `${prefix}<span>${m.text.replace(/\n/g, '<br>')}</span><span style="display:block; text-align:right; font-size:0.68rem; opacity:0.7; margin-top:0.3rem;">${m.time}</span>`;
      chatContainer.appendChild(msgDiv);
    });

    chatContainer.scrollTop = chatContainer.scrollHeight;
  };

  // Inject Floating AI Assistant Widget & Centered Modal Overlay into DOM automatically
  window.initM2OFloatingAiWidget = function() {
    if (document.getElementById('m2oFloatingAiBotWidget')) return;

    const widget = document.createElement('div');
    widget.id = 'm2oFloatingAiBotWidget';
    widget.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 9999;
      font-family: 'Plus Jakarta Sans', 'Outfit', sans-serif;
    `;

    widget.innerHTML = `
      <!-- FLOATING BUTTON & GLOWING BADGE -->
      <div style="display: flex; align-items: center; gap: 0.6rem;">
        <div onclick="toggleM2OAiChatModal()" style="cursor: pointer; background: #0f172a; color: #ffffff; padding: 0.45rem 0.95rem; border-radius: 999px; border: 2px solid #00a651; font-weight: 800; font-size: 0.82rem; box-shadow: 0 8px 25px rgba(0, 166, 81, 0.35); display: flex; align-items: center; gap: 0.5rem; animation: pulseGlow 2s infinite;">
          <span style="width: 8px; height: 8px; border-radius: 50%; background: #00f2fe; box-shadow: 0 0 8px #00f2fe; display: inline-block;"></span>
          <span style="color: #00f2fe; font-weight: 900;">AI Support</span> • Ask Anything!
        </div>

        <button type="button" id="m2oAiBotToggleBtn" onclick="toggleM2OAiChatModal()" style="width: 62px; height: 62px; border-radius: 50%; background: linear-gradient(135deg, #00a651 0%, #0072bc 100%); border: 2px solid #ffffff; color: white; font-size: 1.9rem; box-shadow: 0 8px 30px rgba(0, 166, 81, 0.5); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: transform 0.25s ease; flex-shrink: 0;">
          🤖
        </button>
      </div>

      <!-- CENTERED HIGH-CONTRAST CHAT MODAL OVERLAY -->
      <div id="m2oAiChatModal" class="modal-overlay hidden" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 99999; display: flex; align-items: center; justify-content: center; background: rgba(15, 23, 42, 0.75); backdrop-filter: blur(8px); padding: 1rem;">
        <div style="width: 100%; max-width: 500px; height: 600px; max-height: 90vh; background: #ffffff; border-radius: 24px; border: 2.5px solid #00a651; box-shadow: 0 20px 60px rgba(0,0,0,0.4); display: flex; flex-direction: column; overflow: hidden;">
          <!-- CHAT HEADER -->
          <div style="background: linear-gradient(135deg, #07111e 0%, #0072bc 100%); color: white; padding: 1.1rem 1.4rem; display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #00a651;">
            <div style="display: flex; align-items: center; gap: 0.8rem;">
              <div style="width: 42px; height: 42px; background: linear-gradient(135deg, #00a651 0%, #00f2fe 100%); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; box-shadow: 0 4px 15px rgba(0,242,254,0.4);">🤖</div>
              <div>
                <h4 style="margin: 0; font-size: 1.1rem; font-weight: 900; color: #ffffff !important;">Mount2ocean AI Assistant</h4>
                <span style="font-size: 0.78rem; color: #00f2fe !important; font-weight: 700;">⚡ 24/7 Online • Smart Travel Assistant</span>
              </div>
            </div>
            <button onclick="toggleM2OAiChatModal()" style="border: none; background: rgba(255,255,255,0.2); color: white; font-size: 1.2rem; cursor: pointer; font-weight: 900; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">✕</button>
          </div>

          <!-- QUICK ACTION CHIPS -->
          <div style="background: #f8fafc; padding: 0.65rem 0.9rem; border-bottom: 1px solid #e2e8f0; display: flex; gap: 0.5rem; overflow-x: auto; white-space: nowrap;">
            <button type="button" onclick="sendAiQuickQuery('প্যাকেজ ও খরচ')" style="padding: 0.3rem 0.75rem; font-size: 0.78rem; background: #ffffff; border: 1.5px solid #cbd5e1; border-radius: 999px; cursor: pointer; font-weight: 800; color: #0072bc;">📦 Tour Packages</button>
            <button type="button" onclick="sendAiQuickQuery('পেমেন্ট অপশন')" style="padding: 0.3rem 0.75rem; font-size: 0.78rem; background: #ffffff; border: 1.5px solid #cbd5e1; border-radius: 999px; cursor: pointer; font-weight: 800; color: #00a651;">💳 bKash Payment</button>
            <button type="button" onclick="sendAiQuickQuery('হটলাইন নাম্বার')" style="padding: 0.3rem 0.75rem; font-size: 0.78rem; background: #ffffff; border: 1.5px solid #cbd5e1; border-radius: 999px; cursor: pointer; font-weight: 800; color: #475569;">📞 24/7 Hotline</button>
            <button type="button" onclick="sendAiQuickQuery('লাইভ সাপোর্ট টিমের সাথে কথা বলতে চাই')" style="padding: 0.3rem 0.75rem; font-size: 0.78rem; background: rgba(239, 68, 68, 0.1); border: 1.5px solid #ef4444; border-radius: 999px; cursor: pointer; font-weight: 900; color: #dc2626;">💬 Live Owner Team</button>
          </div>

          <!-- CHAT MESSAGES CONTAINER -->
          <div id="m2oAiChatBody" style="flex: 1; padding: 1.2rem; overflow-y: auto; display: flex; flex-direction: column; background: #fafafa;">
            <!-- Rendered via renderCustomerChatMessages() -->
          </div>

          <!-- CHAT INPUT FOOTER -->
          <form onsubmit="handleCustomerAiSend(event)" style="padding: 0.9rem 1.1rem; background: #ffffff; border-top: 1.5px solid #e2e8f0; display: flex; gap: 0.6rem; align-items: center;">
            <input type="text" id="m2oAiChatInput" placeholder="Type your question (প্রশ্ন লিখুন)..." style="flex: 1; padding: 0.75rem 1rem; border: 1.5px solid #cbd5e1; border-radius: 12px; font-size: 0.92rem; font-weight: 700; color: #0f172a;" required>
            <button type="submit" class="primary-btn" style="padding: 0.75rem 1.3rem; background: linear-gradient(135deg, #00a651 0%, #0072bc 100%); font-weight: 900; border-radius: 12px; white-space: nowrap;">
              Send ➔
            </button>
          </form>
        </div>
      </div>
    `;

    document.body.appendChild(widget);
    renderCustomerChatMessages();
  };

  window.toggleM2OAiChatModal = function() {
    if (!document.getElementById('m2oFloatingAiBotWidget')) {
      if (typeof window.initM2OFloatingAiWidget === 'function') {
        window.initM2OFloatingAiWidget();
      }
    }
    const modal = document.getElementById('m2oAiChatModal');
    if (modal) {
      modal.classList.toggle('hidden');
      if (!modal.classList.contains('hidden')) {
        if (typeof renderCustomerChatMessages === 'function') renderCustomerChatMessages();
        const input = document.getElementById('m2oAiChatInput');
        if (input) input.focus();
      }
    }
  };

  window.sendAiQuickQuery = function(text) {
    const input = document.getElementById('m2oAiChatInput');
    if (input) input.value = text;
    window.processCustomerAiQuery(text);
    if (input) input.value = '';
  };

  window.handleCustomerAiSend = function(e) {
    e.preventDefault();
    const input = document.getElementById('m2oAiChatInput');
    if (!input) return;
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    window.processCustomerAiQuery(text);
  };

  // ==========================================
  // ADMIN LIVE SUPPORT TEAM CONSOLE & REPLY ENGINE
  // ==========================================
  window.renderAdminLiveSupportConsole = function() {
    const container = document.getElementById('adminSupportTicketsList');
    if (!container) return;

    const tickets = getSupportTickets();
    container.innerHTML = '';

    if (tickets.length === 0) {
      container.innerHTML = `<div style="text-align: center; padding: 2.5rem; color: #94a3b8; font-weight: 700;">কোনো লাইভ কাস্টমার সাপোর্ট রিকোয়েস্ট পেন্ডিং নেই। AI বট কাস্টমারদের প্রশ্নের উত্তর দিচ্ছে।</div>`;
      return;
    }

    tickets.forEach(ticket => {
      const card = document.createElement('div');
      card.style.cssText = `background: #ffffff; border: 1.5px solid #cbd5e1; border-radius: 14px; padding: 1.2rem; margin-bottom: 1rem; box-shadow: 0 4px 15px rgba(0,0,0,0.04);`;
      
      let msgHistoryHtml = ticket.messages.map(m => `
        <div style="margin-bottom: 0.4rem; padding: 0.4rem 0.7rem; border-radius: 8px; font-size: 0.84rem; ${m.sender === 'admin' ? 'background: rgba(0,114,188,0.1); color: #0072bc; text-align: right;' : 'background: #f1f5f9; color: #0f172a;'}">
          <strong>${m.sender === 'admin' ? '👑 Admin Support' : ticket.customerName}:</strong> ${m.text}
        </div>
      `).join('');

      card.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.8rem; flex-wrap: wrap; gap: 0.5rem;">
          <div>
            <span class="badge-tag" style="background: #ef4444; color: white;">LIVE SUPPORT REQUEST</span>
            <h4 style="margin: 0.3rem 0 0; font-size: 1.05rem; color: #0f172a; font-weight: 800;">${ticket.customerName}</h4>
            <span style="font-size: 0.82rem; color: #64748b;">📱 ${ticket.phone} • ✉️ ${ticket.email}</span>
          </div>
          <span style="font-size: 0.78rem; font-weight: 800; color: #00a651;">Ticket ID: ${ticket.id}</span>
        </div>

        <div style="max-height: 180px; overflow-y: auto; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 0.8rem; margin-bottom: 0.8rem;">
          ${msgHistoryHtml}
        </div>

        <form onsubmit="handleAdminSupportReply(event, '${ticket.id}')" style="display: flex; gap: 0.5rem;">
          <input type="text" id="adminReplyInput_${ticket.id}" placeholder="Type reply to customer (কাস্টমারকে উত্তর দিন)..." style="flex: 1; padding: 0.55rem 0.85rem; border: 1.5px solid #cbd5e1; border-radius: 8px; font-size: 0.85rem;" required>
          <button type="submit" class="primary-btn" style="padding: 0.55rem 1.1rem; background: #00a651; font-weight: 800; font-size: 0.85rem;">
            Send Reply ➔
          </button>
        </form>
      `;
      container.appendChild(card);
    });
  };

  window.handleAdminSupportReply = function(e, ticketId) {
    e.preventDefault();
    const input = document.getElementById(`adminReplyInput_${ticketId}`);
    if (!input) return;
    const replyText = input.value.trim();
    if (!replyText) return;

    let tickets = getSupportTickets();
    let ticket = tickets.find(t => t.id === ticketId);
    const timeStr = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

    if (ticket) {
      ticket.messages.push({ sender: 'admin', text: replyText, time: timeStr });
      ticket.status = 'RESOLVED';
      saveSupportTickets(tickets);
    }

    // Deliver admin message to customer chat messages
    let msgs = getAiChatMessages();
    msgs.push({ sender: 'admin', text: replyText, time: timeStr });
    saveAiChatMessages(msgs);

    input.value = '';
    if (typeof showToast === 'function') showToast(`✅ Reply sent to customer (${ticket ? ticket.customerName : 'Live Customer'})!`, 'success');
  };

  // Auto-initialize floating AI widget on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.initM2OFloatingAiWidget();
      window.renderAdminLiveSupportConsole();
    });
  } else {
    window.initM2OFloatingAiWidget();
    window.renderAdminLiveSupportConsole();
  }

  // Run initialization
  init();
});

// ==========================================
// 100% GLOBAL ONCLICK EXPOSURE FOR ALL 19 HTML PAGES
// ==========================================
window.openPkgDetails = function(pkgId) {
  if (pkgId) localStorage.setItem('m2o_active_detail_pkg_id', pkgId);
  window.location.href = pkgId ? `package_detail.html?id=${encodeURIComponent(pkgId)}` : 'package_detail.html';
};

window.openPkgBooking = function(pkgId) {
  if (pkgId) localStorage.setItem('m2o_active_detail_pkg_id', pkgId);
  window.location.href = pkgId ? `booking.html?id=${encodeURIComponent(pkgId)}` : 'booking.html';
};

window.resetMasterFilter = function() {
  const searchInput = document.getElementById('masterPkgSearchInput');
  const catSelect = document.getElementById('masterPkgCatSelect');
  if (searchInput) searchInput.value = '';
  if (catSelect) catSelect.value = 'all';
  if (typeof window.filterMasterPackages === 'function') window.filterMasterPackages();
};

window.filterCatalogPackages = function() {
  const searchInput = document.getElementById('catalogSearchInput');
  const catSelect = document.getElementById('catalogCatSelect');
  const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
  const selectedCat = catSelect ? catSelect.value.toLowerCase() : 'all';

  const cards = document.querySelectorAll('.pkg-card, .catalog-pkg-card, .package-card');
  cards.forEach(card => {
    const text = card.textContent.toLowerCase();
    const cat = card.dataset.cat ? card.dataset.cat.toLowerCase() : '';
    const matchSearch = !query || text.includes(query);
    const matchCat = (selectedCat === 'all') || cat.includes(selectedCat) || text.includes(selectedCat);
    card.style.display = (matchSearch && matchCat) ? 'flex' : 'none';
  });
};

window.switchDetailPhoto = function(thumbnail, mainSrc, altText) {
  const mainImg = document.getElementById('detailPkgImg');
  if (mainImg) {
    mainImg.src = mainSrc;
    if (altText) mainImg.alt = altText;
  }
  document.querySelectorAll('.detail-thumb').forEach(t => t.style.borderColor = '#cbd5e1');
  if (thumbnail) thumbnail.style.borderColor = '#00a651';
};

window.triggerDetailBooking = function() {
  const modal = document.getElementById('custBookingModal');
  if (modal) modal.classList.remove('hidden');
};

window.changePageGuest = function(delta) {
  const input = document.getElementById('pageGuestCount');
  if (input) {
    let current = parseInt(input.value) || 1;
    current = Math.max(1, current + delta);
    input.value = current;
  }
};

window.handleApplyPagePromoCode = function() {
  const promoInput = document.getElementById('pagePromoCodeInput');
  const code = promoInput ? promoInput.value.trim().toUpperCase() : '';
  if (code === 'M2O2026' || code === 'SAVE10') {
    if (typeof showToast === 'function') showToast('🎉 Promo code applied! 10% discount added.', 'success');
  } else {
    if (typeof showToast === 'function') showToast('⚠️ Invalid promo code. Try M2O2026', 'warning');
  }
};

window.togglePagePassportFields = function() {
  const container = document.getElementById('pagePassportFieldsContainer');
  if (container) {
    container.style.display = container.style.display === 'none' ? 'block' : 'none';
  }
};

window.exportApprovalsCSV = function() {
  if (typeof showToast === 'function') showToast('📥 Exporting Partner Approvals CSV...', 'info');
};

window.resetApprovalsHandler = function() {
  if (confirm('Reset partner approvals list?')) {
    localStorage.setItem('m2o_agent_applications', JSON.stringify([]));
    window.location.reload();
  }
};

window.approvePartnerAction = function(id) {
  let apps = JSON.parse(localStorage.getItem('m2o_agent_applications')) || [];
  let app = apps.find(a => a.id === id);
  if (app) app.status = 'APPROVED';
  localStorage.setItem('m2o_agent_applications', JSON.stringify(apps));
  if (typeof showToast === 'function') showToast(`✔ Partner ${id} approved successfully!`, 'success');
  window.location.reload();
};

window.rejectPartnerAction = function(id) {
  let apps = JSON.parse(localStorage.getItem('m2o_agent_applications')) || [];
  let app = apps.find(a => a.id === id);
  if (app) app.status = 'REJECTED';
  localStorage.setItem('m2o_agent_applications', JSON.stringify(apps));
  if (typeof showToast === 'function') showToast(`❌ Partner ${id} rejected.`, 'warning');
  window.location.reload();
};

window.exportBookingsCSV = function() {
  if (typeof showToast === 'function') showToast('📥 Exporting Customer Bookings CSV...', 'info');
};

window.deleteBookingRecord = function(id) {
  if (confirm(`Delete booking ${id}?`)) {
    let bookings = JSON.parse(localStorage.getItem('m2o_customer_bookings')) || [];
    bookings = bookings.filter(b => b.id !== id);
    localStorage.setItem('m2o_customer_bookings', JSON.stringify(bookings));
    if (typeof showToast === 'function') showToast(`🗑️ Booking ${id} deleted.`, 'info');
    window.location.reload();
  }
};

window.clearAllSearchRequests = function() {
  if (confirm('Clear all customer search requests?')) {
    localStorage.setItem('m2o_missing_package_searches', JSON.stringify([]));
    if (typeof showToast === 'function') showToast('Cleared search requests queue.', 'info');
    window.location.reload();
  }
};

window.clearAiSearchLogs = function() {
  if (confirm('Clear AI Search logs?')) {
    localStorage.removeItem('m2o_ai_agent_search_logs');
    if (typeof showToast === 'function') showToast('Cleared AI logs.', 'info');
    window.location.reload();
  }
};

window.addSearchToCatalog = function(id, query) {
  if (typeof showToast === 'function') showToast(`📦 Adding '${query}' to package catalog...`, 'success');
};

window.markSearchStatus = function(id, status) {
  let searches = JSON.parse(localStorage.getItem('m2o_missing_package_searches')) || [];
  let s = searches.find(item => item.id === id);
  if (s) s.status = status;
  localStorage.setItem('m2o_missing_package_searches', JSON.stringify(searches));
  if (typeof showToast === 'function') showToast(`Updated search status to ${status}`, 'info');
  window.location.reload();
};

window.deleteSearchRequest = function(id) {
  let searches = JSON.parse(localStorage.getItem('m2o_missing_package_searches')) || [];
  searches = searches.filter(item => item.id !== id);
  localStorage.setItem('m2o_missing_package_searches', JSON.stringify(searches));
  if (typeof showToast === 'function') showToast('Deleted search request.', 'info');
  window.location.reload();
};

window.exportUsersCSV = function() {
  if (typeof showToast === 'function') showToast('📥 Exporting Registered Users CSV...', 'info');
};

window.clearUsersHandler = function() {
  if (confirm('Clear all registered users directory?')) {
    localStorage.setItem('m2o_registered_users', JSON.stringify([]));
    if (typeof showToast === 'function') showToast('Cleared users directory.', 'info');
    window.location.reload();
  }
};

window.deleteUserRecord = function(id) {
  if (confirm(`Delete user account ${id}?`)) {
    let users = JSON.parse(localStorage.getItem('m2o_registered_users')) || [];
    users = users.filter(u => u.id !== id);
    localStorage.setItem('m2o_registered_users', JSON.stringify(users));
    if (typeof showToast === 'function') showToast(`Deleted user account ${id}.`, 'info');
    window.location.reload();
  }
};

window.sendPageQuickQuery = function(text) {
  const input = document.getElementById('pageAiInput') || document.getElementById('m2oAiChatInput');
  if (input) input.value = text;
  if (typeof window.handlePageAiSubmit === 'function') {
    window.handlePageAiSubmit();
  } else if (typeof window.handleCustomerAiSend === 'function') {
    window.handleCustomerAiSend();
  }
};

window.clearPageChatHistory = function() {
  if (confirm('Clear chat history?')) {
    localStorage.removeItem('m2o_ai_chat_messages');
    if (typeof renderPageAiChat === 'function') renderPageAiChat();
    if (typeof renderCustomerChatMessages === 'function') renderCustomerChatMessages();
    window.location.reload();
  }
};

