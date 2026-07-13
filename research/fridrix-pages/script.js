// Custom Cursor
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');

if (cursor && cursorFollower) {
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        
        setTimeout(() => {
            cursorFollower.style.left = e.clientX + 'px';
            cursorFollower.style.top = e.clientY + 'px';
        }, 100);
    });

    // Cursor hover effects
    const hoverElements = document.querySelectorAll('a, button, .project-card, .app-card-item, .option-card, .checkbox-label, .footer-contact-link');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursorFollower.style.transform = 'translate(-50%, -50%) scale(1.5)';
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorFollower.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    });
}

// Mode Switching Logic
const modeTabs = document.querySelectorAll('.mode-tab');
const modeSections = document.querySelectorAll('[data-mode-section]');

function switchMode(mode) {
    // Update tabs
    modeTabs.forEach(tab => {
        const isActive = tab.getAttribute('data-mode') === mode;
        tab.classList.toggle('active', isActive);
        tab.setAttribute('aria-selected', isActive);
    });

    // Update sections
    modeSections.forEach(section => {
        if (section.getAttribute('data-mode-section') === mode) {
            section.style.display = 'block';
            
            // Reset filters for this mode
            const sectionFilters = section.querySelectorAll('.filter-btn');
            if (sectionFilters.length > 0) {
                sectionFilters.forEach(btn => btn.classList.remove('active'));
                const allBtn = Array.from(sectionFilters).find(btn => btn.getAttribute('data-filter') === 'all');
                if (allBtn) allBtn.classList.add('active');
            }

            // Trigger animation for cards in the new section and ensure they are visible
            const cards = section.querySelectorAll('.project-card, .app-card-item');
            cards.forEach((card, index) => {
                const cardWrapper = card.closest('.project-card-link') || card;
                cardWrapper.style.display = 'block';
                card.classList.remove('hidden');
                card.style.animation = 'none';
                card.offsetHeight; // trigger reflow
                card.style.animation = `fadeInUp 0.6s ease forwards ${index * 0.1}s`;
            });
        } else {
            section.style.display = 'none';
        }
    });
}

modeTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const mode = tab.getAttribute('data-mode');
        switchMode(mode);
    });
});

// Initialize with desktop mode if we are on a page with mode tabs
if (modeTabs.length > 0) {
    switchMode('desktop');
}

// Filter Functionality
const filterButtons = document.querySelectorAll('.filter-btn');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Find the filter section to understand which mode we're filtering
        const filterSection = button.closest('[data-mode-section]');
        if (!filterSection) return;

        const mode = filterSection.getAttribute('data-mode-section');

        // Remove active class from buttons in THIS filter section
        const sectionButtons = filterSection.querySelectorAll('.filter-btn');
        sectionButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');
        
        const filter = button.getAttribute('data-filter');
        
        // Find project sections for the same mode (desktop/mobile)
        const projectSections = document.querySelectorAll(`.projects[data-mode-section="${mode}"]`);
        const projectCards = Array.from(projectSections).flatMap(sec =>
            Array.from(sec.querySelectorAll('.project-card, .app-card-item'))
        );
        if (projectCards.length === 0) return;
        
        projectCards.forEach(card => {
            // Find the wrapper that should be hidden/shown
            const cardWrapper = card.closest('.project-card-link') || card;
            
            if (filter === 'all') {
                cardWrapper.style.display = 'block';
                card.classList.remove('hidden');
                card.style.animation = 'none';
                card.offsetHeight; // trigger reflow
                card.style.animation = 'fadeInUp 0.6s ease forwards';
            } else {
                const category = card.getAttribute('data-category');
                if (category === filter) {
                    cardWrapper.style.display = 'block';
                    card.classList.remove('hidden');
                    card.style.animation = 'none';
                    card.offsetHeight; // trigger reflow
                    card.style.animation = 'fadeInUp 0.6s ease forwards';
                } else {
                    card.classList.add('hidden');
                    cardWrapper.style.display = 'none';
                }
            }
        });
    });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        
        // If we are on a different page and the link is just a hash, let it default (or handle cross-page)
        // But if we are on the page, scroll smoothly.
        const href = this.getAttribute('href');
        // Check if it's just a hash or a full path
        if (href.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements that should animate on scroll
document.querySelectorAll('.section-title, .about-text, .skills, .pricing-card').forEach(el => {
    observer.observe(el);
});

// Update active mobile nav item on scroll (Only for index page or specific sections)
const mobileNavItems = document.querySelectorAll('.mobile-nav-item');
const sections = document.querySelectorAll('section[id]');

function updateActiveNavItem() {
    // Only works if sections are on the same page
    if (sections.length === 0) return;
    
    let currentSectionId = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        if (window.scrollY >= sectionTop - 100) {
            currentSectionId = section.getAttribute('id');
        }
    });

    mobileNavItems.forEach(item => {
        const href = item.getAttribute('href');
        // Simple check if href matches #id
        if (href === `#${currentSectionId}`) {
             item.classList.add('active');
        } else if (href.includes('.html')) {
            // Keep default active state for page links
        } else {
            item.classList.remove('active');
        }
    });
}

if (sections.length > 0) {
    window.addEventListener('scroll', updateActiveNavItem);
    updateActiveNavItem();
}

// Add prices to project cards on the main page (from product.js)
function injectProjectPrices() {
    if (typeof products === 'undefined') return;

    const getIdFromHref = (href) => {
        try {
            // Handle relative paths
            const url = new URL(href, window.location.origin + window.location.pathname);
            return url.searchParams.get('id');
        } catch {
            return null;
        }
    };

    // Desktop project cards
    document.querySelectorAll('a.project-card-link[href*="product.html?id="]').forEach(link => {
        const id = getIdFromHref(link.getAttribute('href'));
        if (!id || !products[id] || products[id].hidePriceBadge) return;

        const info = link.querySelector('.project-card-info');
        const overlay = link.querySelector('.project-overlay');
        const target = info || overlay;
        if (!target) return;

        // Prevent duplicates
        if (target.querySelector('.project-price-badge')) return;

        const priceText = products[id].price ? products[id].price : 'Цена по запросу';
        const badge = document.createElement('div');
        badge.className = 'project-price-badge';
        badge.textContent = priceText;
        target.appendChild(badge);
    });

    // Mobile app cards
    document.querySelectorAll('.app-card-item .app-card-info a[href*="product.html?id="]').forEach(a => {
        const id = getIdFromHref(a.getAttribute('href'));
        if (!id || !products[id] || products[id].hidePriceBadge) return;

        const info = a.closest('.app-card-info');
        if (!info) return;

        if (info.querySelector('.app-price')) return;

        const priceText = products[id].price ? products[id].price : 'Цена по запросу';
        const el = document.createElement('div');
        el.className = 'app-price';
        el.textContent = priceText;

        // Place after title if possible
        const title = info.querySelector('.project-title');
        if (title && title.nextSibling) {
            title.insertAdjacentElement('afterend', el);
        } else if (title) {
            title.parentNode.insertBefore(el, title.nextSibling);
        } else {
            info.insertBefore(el, info.firstChild);
        }
    });
}

injectProjectPrices();


/* --- CALCULATOR LOGIC --- */
const calculatorForm = document.getElementById('price-calculator');
const totalPriceEl = document.getElementById('totalPrice');
const orderBtn = document.getElementById('order-btn');

if (calculatorForm && totalPriceEl) {
    const basePrices = {
        landing: 80000,
        corporate: 120000,
        ecommerce: 180000,
        app: 150000,
        motion: 50000,
        identity: 70000
    };

    const difficultyMultipliers = {
        basic: 0.8,
        standard: 1.0,
        premium: 1.4
    };

    const addonPrices = {
        seo: 15000,
        copywriting: 10000,
        admin: 25000,
        rush: 0 // handled separately (multiplier)
    };

    function calculatePrice() {
        const formData = new FormData(calculatorForm);
        const type = formData.get('projectType');
        const complexity = formData.get('complexity');
        const addons = formData.getAll('addon');

        let price = basePrices[type] || 0;
        price = price * (difficultyMultipliers[complexity] || 1);

        addons.forEach(addon => {
            if (addon !== 'rush') {
                price += (addonPrices[addon] || 0);
            }
        });

        // Add Rush order (30% on top)
        if (addons.includes('rush')) {
            price = price * 1.3;
        }

        // Format price
        totalPriceEl.textContent = Math.round(price).toLocaleString('ru-RU') + ' ₽';
        
        // Pass data to contact button (optional, or store for later)
        if (orderBtn) {
            const params = new URLSearchParams();
            params.append('type', type);
            params.append('complexity', complexity);
            params.append('price', Math.round(price));
            orderBtn.href = 'contact.html?' + params.toString() + '#contacts';
        }
    }

    calculatorForm.addEventListener('change', calculatePrice);
    // Initial calculation
    calculatePrice();
}

/* --- CONTACT FORM LOGIC --- */
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    // Check if we have URL params from calculator to pre-fill message
    const urlParams = new URLSearchParams(window.location.search);
    const preType = urlParams.get('type');
    const prePrice = urlParams.get('price');
    const messageBox = document.getElementById('message');

    if (preType && messageBox) {
        const typeNames = {
            landing: 'Лендинг',
            corporate: 'Корпоративный сайт',
            ecommerce: 'Интернет-магазин',
            app: 'Мобильное приложение',
            motion: 'Моушн-дизайн',
            identity: 'Айдентика'
        };
        const typeName = typeNames[preType] || preType;
        messageBox.value = `Здравствуйте! Меня интересует разработка проекта: ${typeName}.\nОриентировочный бюджет по калькулятору: ${parseInt(prePrice).toLocaleString('ru-RU')} ₽.\n\nДетали задачи: `;
    }

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const contact = document.getElementById('contact').value;
        const message = document.getElementById('message').value;
        
        const subject = `Новая заявка с сайта: ${name}`;
        const body = `Имя: ${name}\nКонтакты: ${contact}\n\nСообщение:\n${message}`;
        
        // Use mailto
        window.location.href = `mailto:hello@fridrix.design?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        
        // Optional: Show success feedback
        alert('Открываем почтовый клиент для отправки письма...');
    });
}
