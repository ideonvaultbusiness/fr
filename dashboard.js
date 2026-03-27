// ===== SIDEBAR TOGGLE =====
const sidebar = document.querySelector('.sidebar');
const sidebarToggle = document.querySelector('.sidebar-toggle');
const sidebarClose = document.querySelector('.sidebar-close');

if (sidebarToggle) {
    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.add('open');
    });
}

if (sidebarClose) {
    sidebarClose.addEventListener('click', () => {
        sidebar.classList.remove('open');
    });
}

// Close sidebar when clicking outside on mobile
document.addEventListener('click', (e) => {
    if (window.innerWidth <= 1024 && sidebar && sidebar.classList.contains('open')) {
        if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
            sidebar.classList.remove('open');
        }
    }
});

// ===== SCROLL REVEAL =====
const dashElements = document.querySelectorAll('.stat-card, .dash-card, .idea-card, .investor-card, .my-idea-card, .welcome-banner');
const dashObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, i * 60);
            dashObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

dashElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    dashObserver.observe(el);
});

// ===== FILTER TABS =====
const filterTabs = document.querySelectorAll('.filter-tab');
filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        filterTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const filter = tab.dataset.filter;
        const cards = document.querySelectorAll('.idea-card, .investor-card');

        cards.forEach(card => {
            if (filter === 'all' || card.dataset.category === filter) {
                card.style.display = '';
                card.style.animation = 'fadeInDown 0.4s ease forwards';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// ===== INVEST MODAL =====
function openInvestModal(ideaName, range, funded) {
    const overlay = document.getElementById('investModal');
    if (overlay) {
        const projectName = overlay.querySelector('#modalProjectName');
        const rangeEl = overlay.querySelector('#modalRange');
        const fundedEl = overlay.querySelector('#modalFunded');
        if (projectName) projectName.textContent = ideaName || '';
        if (rangeEl) rangeEl.textContent = range || '';
        if (fundedEl) fundedEl.textContent = (funded || 0) + '%';
        overlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
}

function closeInvestModal() {
    const overlay = document.getElementById('investModal');
    if (overlay) {
        overlay.classList.remove('open');
        document.body.style.overflow = '';
    }
}

// Close modal on overlay click
const modalOverlay = document.getElementById('investModal');
if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeInvestModal();
        }
    });
}

// Close modal on Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeInvestModal();
        closeProposeModal();
    }
});

// ===== QUICK AMOUNTS =====
function setQuickAmount(min, max) {
    const minInput = document.getElementById('investMin');
    const maxInput = document.getElementById('investMax');
    if (minInput) minInput.value = min;
    if (maxInput) maxInput.value = max;
}

// ===== INVEST FORM SUBMIT =====
const investForm = document.getElementById('investForm');
if (investForm) {
    investForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = investForm.querySelector('button[type="submit"]');
        const projectName = document.getElementById('modalProjectName')?.textContent || 'ce projet';
        const minVal = document.getElementById('investMin')?.value || '';
        const maxVal = document.getElementById('investMax')?.value || '';
        btn.innerHTML = '<span class="spinner"></span> Envoi...';
        btn.disabled = true;

        setTimeout(() => {
            btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Proposition envoyée !';
            btn.style.background = 'var(--green)';

            // Add notification toast
            showToast('Proposition envoyée', 'Votre offre de ' + formatAmount(minVal) + ' – ' + formatAmount(maxVal) + ' pour ' + projectName + ' a été transmise.');

            setTimeout(() => {
                closeInvestModal();
                btn.innerHTML = '<span>Envoyer ma proposition</span><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>';
                btn.style.background = '';
                btn.disabled = false;
                investForm.reset();
            }, 1500);
        }, 1200);
    });
}

// ===== TOGGLE NEW IDEA FORM =====
function toggleNewIdeaForm() {
    const wrapper = document.getElementById('newIdeaForm');
    if (wrapper) {
        if (wrapper.style.display === 'none' || !wrapper.style.display) {
            wrapper.style.display = 'block';
            wrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            wrapper.style.display = 'none';
        }
    }
}

// ===== IDEA FORM SUBMIT =====
const ideaForm = document.getElementById('ideaForm');
if (ideaForm) {
    ideaForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = ideaForm.querySelector('button[type="submit"]');
        const name = document.getElementById('ideaName')?.value.trim();
        const category = document.getElementById('ideaCategory')?.value;
        const desc = document.getElementById('ideaDesc')?.value.trim();
        const minAmount = document.getElementById('ideaMinAmount')?.value;
        const maxAmount = document.getElementById('ideaMaxAmount')?.value;
        const stage = document.getElementById('ideaStage')?.value;

        if (!name || !category || !desc || !minAmount || !maxAmount) return;

        btn.innerHTML = '<span class="spinner"></span> Publication...';
        btn.disabled = true;

        setTimeout(() => {
            btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Idée publiée !';
            btn.style.background = 'var(--green)';

            // Create new idea card
            addIdeaCard({ name, category, desc, minAmount, maxAmount, stage });

            showToast('Idée publiée', name + ' est maintenant visible par les investisseurs.');

            setTimeout(() => {
                toggleNewIdeaForm();
                btn.innerHTML = '<span>Publier mon idée</span><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>';
                btn.style.background = '';
                btn.disabled = false;
                ideaForm.reset();
            }, 1500);
        }, 1200);
    });
}

// ===== ADD IDEA CARD DYNAMICALLY =====
function addIdeaCard(data) {
    const list = document.querySelector('.my-ideas-list');
    if (!list) return;

    // Remove empty state message if present
    const emptyState = list.querySelector('.empty-state');
    if (emptyState) emptyState.remove();

    const categoryIcons = {
        tech: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--cyan)" stroke-width="1.5"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>',
        green: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="1.5"><path d="M17 8C8 10 5.9 16.17 3.82 21.34M2 2s4.5 2 8 2c3.5 0 8-2 8-2s-.5 5-2.5 8.5C13.5 14 8 15 4 16"/></svg>',
        sante: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--cyan)" stroke-width="1.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>',
        food: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--orange)" stroke-width="1.5"><path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><path d="M6 1v3M10 1v3M14 1v3"/></svg>',
        finance: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--purple)" stroke-width="1.5"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>',
        education: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--orange)" stroke-width="1.5"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>',
        autre: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--purple)" stroke-width="1.5"><path d="M12 2a7 7 0 0 1 7 7c0 3-2 5.5-4 7l-1 4H10l-1-4c-2-1.5-4-4-4-7a7 7 0 0 1 7-7z"/><path d="M10 20h4"/></svg>'
    };

    const categoryNames = {
        tech: 'Tech', green: 'Green', sante: 'Santé', food: 'Food',
        finance: 'Finance', education: 'Éducation', autre: 'Autre'
    };

    const stageLabels = {
        idea: 'Concept', mvp: 'MVP', beta: 'Beta', launched: 'Lancé'
    };

    const card = document.createElement('div');
    card.className = 'my-idea-card';
    card.style.animation = 'fadeInDown 0.5s ease forwards';

    card.innerHTML = `
        <div class="my-idea-left">
            <div class="my-idea-emoji">${categoryIcons[data.category] || categoryIcons.autre}</div>
            <div class="my-idea-info">
                <h3>${escapeHtml(data.name)}</h3>
                <span class="idea-category-tag ${data.category}">${categoryNames[data.category] || 'Autre'}</span>
                <p>${escapeHtml(data.desc)}</p>
            </div>
        </div>
        <div class="my-idea-stats">
            <div class="my-idea-stat">
                <span class="my-idea-stat-value">0</span>
                <span class="my-idea-stat-label">Investisseurs</span>
            </div>
            <div class="my-idea-stat">
                <span class="my-idea-stat-value">0€</span>
                <span class="my-idea-stat-label">Offres</span>
            </div>
            <div class="my-idea-stat">
                <span class="my-idea-stat-value">0</span>
                <span class="my-idea-stat-label">Vues</span>
            </div>
        </div>
        <div class="my-idea-funding">
            <div class="funding-header">
                <span>${formatAmount(data.minAmount)} – ${formatAmount(data.maxAmount)} recherchés</span>
                <span class="funding-percent">0%</span>
            </div>
            <div class="funding-bar"><div class="funding-fill" style="width:0%"></div></div>
        </div>
        <div class="my-idea-actions">
            <button class="btn-sm-outline">Voir les offres</button>
            <button class="btn-sm-outline">Modifier</button>
            <span class="idea-status-badge draft">${stageLabels[data.stage] || 'Concept'}</span>
        </div>
    `;

    list.insertBefore(card, list.firstChild);

    // Also add to explore page data (stored in localStorage)
    saveIdeaToStorage(data);
}

function saveIdeaToStorage(data) {
    const ideas = JSON.parse(localStorage.getItem('ideon_ideas') || '[]');
    ideas.unshift({
        ...data,
        id: Date.now(),
        author: 'Jean Dupont',
        authorInitials: 'JD',
        date: new Date().toISOString(),
        investors: 0,
        funded: 0,
        views: 0
    });
    localStorage.setItem('ideon_ideas', JSON.stringify(ideas));
}

function formatAmount(val) {
    const n = parseInt(val);
    if (isNaN(n)) return '0€';
    if (n >= 1000000) return (n / 1000000).toFixed(n % 1000000 === 0 ? 0 : 1) + 'M€';
    if (n >= 1000) return (n / 1000).toFixed(n % 1000 === 0 ? 0 : 0) + 'K€';
    return n + '€';
}

// ===== TOAST NOTIFICATION =====
function showToast(title, message) {
    let container = document.getElementById('toastContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toastContainer';
        container.style.cssText = 'position:fixed;top:24px;right:24px;z-index:10000;display:flex;flex-direction:column;gap:12px;pointer-events:none;';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.style.cssText = 'pointer-events:auto;background:var(--card);border:1px solid var(--border);border-radius:12px;padding:16px 20px;min-width:300px;max-width:400px;box-shadow:0 8px 32px rgba(0,0,0,0.4);animation:slideInRight 0.4s ease;display:flex;gap:12px;align-items:flex-start;';
    toast.innerHTML = `
        <div style="width:36px;height:36px;border-radius:10px;background:rgba(16,185,129,0.15);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <div>
            <div style="font-weight:600;font-size:0.9rem;color:var(--text);margin-bottom:2px;">${escapeHtml(title)}</div>
            <div style="font-size:0.8rem;color:var(--text-muted);line-height:1.4;">${escapeHtml(message)}</div>
        </div>
    `;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease forwards';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// ===== BOOKMARK TOGGLE =====
document.querySelectorAll('.btn-bookmark').forEach(btn => {
    btn.addEventListener('click', () => {
        btn.classList.toggle('saved');
    });
});

// ===== CONVERSATION SWITCHING =====
const convItems = document.querySelectorAll('.conversation-item');
convItems.forEach(item => {
    item.addEventListener('click', () => {
        convItems.forEach(c => c.classList.remove('active'));
        item.classList.add('active');

        // Remove unread badge
        const badge = item.querySelector('.conv-unread');
        if (badge) badge.remove();
    });
});

// ===== CHAT SEND MESSAGE =====
const chatInput = document.querySelector('.chat-input');
const chatSend = document.querySelector('.chat-send');
const chatMessages = document.querySelector('.chat-messages');

function sendMessage() {
    if (!chatInput || !chatMessages) return;
    const text = chatInput.value.trim();
    if (!text) return;

    const msg = document.createElement('div');
    msg.className = 'chat-message sent';
    msg.style.animation = 'fadeInDown 0.3s ease';

    const now = new Date();
    const timeStr = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');

    msg.innerHTML = `<div class="chat-bubble">${escapeHtml(text)}<span class="chat-time">${timeStr}</span></div>`;
    chatMessages.appendChild(msg);
    chatInput.value = '';
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

if (chatSend) {
    chatSend.addEventListener('click', sendMessage);
}

if (chatInput) {
    chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
}

// ===== PROGRESS BAR ANIMATION =====
const progressBars = document.querySelectorAll('.idea-progress-fill, .funding-fill');
const progressObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = entry.target.dataset.width || entry.target.style.width;
            entry.target.style.width = '0%';
            requestAnimationFrame(() => {
                entry.target.style.transition = 'width 1s ease';
                entry.target.style.width = target;
            });
            progressObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

progressBars.forEach(bar => {
    bar.dataset.width = bar.style.width;
    progressObserver.observe(bar);
});

// ===== NOTIFICATION BADGE PULSE =====
const notifDot = document.querySelector('.notif-dot');
if (notifDot) {
    notifDot.style.animation = 'pulse 2s infinite';
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.3); opacity: 0.7; }
        }
    `;
    document.head.appendChild(style);
}

// ===== NOTIFICATIONS PAGE =====
const notifFilterTabs = document.querySelectorAll('.notif-filters .filter-tab');
const notifItems = document.querySelectorAll('.notif-item');

notifFilterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        notifFilterTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const filter = tab.dataset.filter;

        notifItems.forEach(item => {
            if (filter === 'all') {
                item.style.display = '';
            } else if (filter === 'unread') {
                item.style.display = item.classList.contains('unread') ? '' : 'none';
            } else if (filter === 'read') {
                item.style.display = item.classList.contains('read') ? '' : 'none';
            }
        });
    });
});

// Mark single notification as read
document.querySelectorAll('.notif-action').forEach(btn => {
    btn.addEventListener('click', () => {
        const item = btn.closest('.notif-item');
        item.classList.remove('unread');
        item.classList.add('read');
        updateNotifCount();
    });
});

// Mark all as read
const markAllBtn = document.getElementById('markAllRead');
if (markAllBtn) {
    markAllBtn.addEventListener('click', () => {
        notifItems.forEach(item => {
            item.classList.remove('unread');
            item.classList.add('read');
        });
        updateNotifCount();
    });
}

function updateNotifCount() {
    const unread = document.querySelectorAll('.notif-item.unread').length;
    const countEl = document.querySelector('.notif-count');
    if (countEl) countEl.textContent = unread;

    const sidebarBadge = document.querySelector('.sidebar-link.active .badge');
    if (sidebarBadge) sidebarBadge.textContent = unread;
    if (sidebarBadge && unread === 0) sidebarBadge.style.display = 'none';
}

// ===== PROPOSE IDEA TO INVESTOR =====
function openProposeModal(investorName) {
    let modal = document.getElementById('proposeModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.id = 'proposeModal';
        modal.innerHTML = `
            <div class="modal">
                <button class="modal-close" onclick="closeProposeModal()">✕</button>
                <div class="modal-header">
                    <div class="modal-icon"><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--purple-light)" stroke-width="1.5"><path d="M12 2a7 7 0 0 1 7 7c0 3-2 5.5-4 7l-1 4H10l-1-4c-2-1.5-4-4-4-7a7 7 0 0 1 7-7z"/><path d="M10 20h4"/></svg></div>
                    <h2>Proposer une idée</h2>
                    <p>À <strong id="proposeInvestorName"></strong></p>
                </div>
                <div class="modal-body">
                    <form class="invest-form" id="proposeForm">
                        <div class="form-group">
                            <label for="proposeIdea">Sélectionnez votre idée</label>
                            <div class="input-wrapper select-wrapper">
                                <select id="proposeIdea" required>
                                    <option value="" disabled selected>Choisir une idée</option>
                                </select>
                                <svg class="select-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="proposeMessage">Votre message de pitch</label>
                            <textarea id="proposeMessage" rows="4" placeholder="Expliquez pourquoi votre projet correspond à cet investisseur..." required></textarea>
                        </div>
                        <div class="form-group">
                            <label for="proposeFunding">Financement recherché</label>
                            <div class="range-inputs">
                                <div class="input-wrapper">
                                    <span class="input-prefix">€</span>
                                    <input type="number" id="proposeFundMin" placeholder="Minimum" min="1000" step="1000" required>
                                </div>
                                <span class="range-to">à</span>
                                <div class="input-wrapper">
                                    <span class="input-prefix">€</span>
                                    <input type="number" id="proposeFundMax" placeholder="Maximum" min="1000" step="1000" required>
                                </div>
                            </div>
                        </div>
                        <button type="submit" class="btn-auth-submit">
                            <span>Envoyer la proposition</span>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>
                        </button>
                    </form>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        // Close on overlay click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeProposeModal();
        });

        // Form submit
        modal.querySelector('#proposeForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = e.target.querySelector('button[type="submit"]');
            const investorNameEl = document.getElementById('proposeInvestorName');
            const ideaSelect = document.getElementById('proposeIdea');
            btn.innerHTML = '<span class="spinner"></span> Envoi...';
            btn.disabled = true;

            setTimeout(() => {
                btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Proposition envoyée !';
                btn.style.background = 'var(--green)';
                showToast('Proposition envoyée', 'Votre idée "' + (ideaSelect.options[ideaSelect.selectedIndex]?.text || '') + '" a été proposée à ' + (investorNameEl?.textContent || 'l\'investisseur') + '.');

                setTimeout(() => {
                    closeProposeModal();
                    btn.innerHTML = '<span>Envoyer la proposition</span><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>';
                    btn.style.background = '';
                    btn.disabled = false;
                    e.target.reset();
                }, 1500);
            }, 1200);
        });
    }

    // Populate investor name
    const nameEl = modal.querySelector('#proposeInvestorName');
    if (nameEl) nameEl.textContent = investorName;

    // Populate ideas select
    const select = modal.querySelector('#proposeIdea');
    select.innerHTML = '<option value="" disabled selected>Choisir une idée</option>';

    // Get ideas from my-ideas cards or localStorage
    const myIdeaCards = document.querySelectorAll('.my-idea-card h3');
    const storedIdeas = JSON.parse(localStorage.getItem('ideon_ideas') || '[]');
    const ideaNames = new Set();

    myIdeaCards.forEach(el => ideaNames.add(el.textContent));
    storedIdeas.forEach(idea => ideaNames.add(idea.name));

    // Default ideas if none exist
    if (ideaNames.size === 0) {
        ['EcoDeliver', 'SmartRecycle', 'MindFlow'].forEach(n => ideaNames.add(n));
    }

    ideaNames.forEach(name => {
        const opt = document.createElement('option');
        opt.value = name;
        opt.textContent = name;
        select.appendChild(opt);
    });

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeProposeModal() {
    const modal = document.getElementById('proposeModal');
    if (modal) {
        modal.classList.remove('open');
        document.body.style.overflow = '';
    }
}

// Attach propose handlers to investor cards
document.querySelectorAll('.btn-invest-sm').forEach(btn => {
    btn.addEventListener('click', () => {
        const card = btn.closest('.investor-card');
        const name = card?.querySelector('.investor-name')?.textContent || 'Investisseur';
        openProposeModal(name);
    });
});

// Attach contact handlers to investor cards
document.querySelectorAll('.btn-contact-sm').forEach(btn => {
    btn.addEventListener('click', () => {
        const card = btn.closest('.investor-card');
        const name = card?.querySelector('.investor-name')?.textContent || 'Investisseur';
        showToast('Redirection', 'Ouverture de la messagerie avec ' + name + '...');
        setTimeout(() => {
            window.location.href = 'messages.html';
        }, 800);
    });
});

// Attach contact handlers on explore idea cards
document.querySelectorAll('.idea-card-actions .btn-contact').forEach(btn => {
    btn.addEventListener('click', () => {
        const card = btn.closest('.idea-card');
        const name = card?.querySelector('.idea-author-name')?.textContent || 'l\'innovateur';
        showToast('Redirection', 'Ouverture de la messagerie avec ' + name + '...');
        setTimeout(() => {
            window.location.href = 'messages.html';
        }, 800);
    });
});

// ===== SEARCH IDEAS (EXPLORE) =====
const searchIdeasInput = document.getElementById('searchIdeas');
if (searchIdeasInput) {
    searchIdeasInput.addEventListener('input', () => {
        const query = searchIdeasInput.value.toLowerCase().trim();
        const cards = document.querySelectorAll('.idea-card');
        cards.forEach(card => {
            const title = card.querySelector('.idea-card-title')?.textContent.toLowerCase() || '';
            const desc = card.querySelector('.idea-card-desc')?.textContent.toLowerCase() || '';
            const author = card.querySelector('.idea-author-name')?.textContent.toLowerCase() || '';
            const category = card.querySelector('.idea-category')?.textContent.toLowerCase() || '';
            const match = !query || title.includes(query) || desc.includes(query) || author.includes(query) || category.includes(query);
            card.style.display = match ? '' : 'none';
        });
    });
}

// ===== LOAD USER IDEAS ON EXPLORE =====
function loadUserIdeasOnExplore() {
    const grid = document.querySelector('.ideas-grid');
    if (!grid) return;
    const storedIdeas = JSON.parse(localStorage.getItem('ideon_ideas') || '[]');

    const categoryClasses = {
        tech: 'tech', green: 'green', sante: 'sante', food: 'food',
        finance: 'finance', education: 'education', autre: 'tech'
    };
    const categoryIcons = {
        tech: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:inline;vertical-align:middle;margin-right:3px"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>',
        green: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:inline;vertical-align:middle;margin-right:3px"><path d="M17 8C8 10 5.9 16.17 3.82 21.34M2 2s4.5 2 8 2c3.5 0 8-2 8-2s-.5 5-2.5 8.5C13.5 14 8 15 4 16"/></svg>',
        sante: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:inline;vertical-align:middle;margin-right:3px"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>',
        food: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:inline;vertical-align:middle;margin-right:3px"><path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><path d="M6 1v3M10 1v3M14 1v3"/></svg>',
        finance: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:inline;vertical-align:middle;margin-right:3px"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>',
        education: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:inline;vertical-align:middle;margin-right:3px"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>',
        autre: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:inline;vertical-align:middle;margin-right:3px"><circle cx="12" cy="12" r="10"/></svg>'
    };
    const categoryNames = {
        tech: 'Tech', green: 'Green', sante: 'Santé', food: 'Food',
        finance: 'Finance', education: 'Éducation', autre: 'Autre'
    };

    storedIdeas.forEach(idea => {
        const catClass = categoryClasses[idea.category] || 'tech';
        const card = document.createElement('div');
        card.className = 'idea-card';
        card.dataset.category = idea.category;

        card.innerHTML = `
            <div class="idea-card-top">
                <span class="idea-category ${catClass}">${categoryIcons[idea.category] || ''} ${categoryNames[idea.category] || 'Autre'}</span>
                <span class="idea-new"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:inline;vertical-align:middle;margin-right:2px"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> Nouveau</span>
            </div>
            <h3 class="idea-card-title">${escapeHtml(idea.name)}</h3>
            <p class="idea-card-desc">${escapeHtml(idea.desc)}</p>
            <div class="idea-card-author">
                <div class="idea-author-avatar" style="background: linear-gradient(135deg, #7c3aed, #06b6d4)">JD</div>
                <div class="idea-author-info">
                    <span class="idea-author-name">Jean Dupont</span>
                    <span class="idea-author-location">Paris, France</span>
                </div>
            </div>
            <div class="idea-card-funding">
                <div class="funding-header">
                    <span class="funding-label">Recherche</span>
                    <span class="funding-amount">${formatAmount(idea.minAmount)} – ${formatAmount(idea.maxAmount)}</span>
                </div>
                <div class="funding-bar"><div class="funding-fill" style="width: 0%"></div></div>
                <div class="funding-footer">
                    <span>0% financé</span>
                    <span>0 investisseur</span>
                </div>
            </div>
            <div class="idea-card-actions">
                <button class="btn-invest" onclick="openInvestModal('${escapeHtml(idea.name)}', '${formatAmount(idea.minAmount)} – ${formatAmount(idea.maxAmount)}', 0)">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                    Investir
                </button>
                <button class="btn-contact">Contacter</button>
                <button class="btn-bookmark" title="Sauvegarder">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
                </button>
            </div>
        `;
        grid.insertBefore(card, grid.firstChild);
    });
}

loadUserIdeasOnExplore();
