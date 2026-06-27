// ============================================
// File: js/main.js
// ============================================

'use strict';

// ---------- 1. Dark/Light Mode Toggle ----------
const darkModeToggle = document.getElementById('darkModeToggle');
const darkModeIcon = document.getElementById('darkModeIcon');

// Check localStorage for saved preference
const savedTheme = localStorage.getItem('greenValleyTheme');
if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    darkModeIcon?.classList.replace('bi-moon-fill', 'bi-sun-fill');
}

if (darkModeToggle) {
    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        if (darkModeIcon) {
            darkModeIcon.className = isDark ? 'bi bi-sun-fill' : 'bi bi-moon-fill';
        }
        localStorage.setItem('greenValleyTheme', isDark ? 'dark' : 'light');
    });
}

// ---------- 2. Back to Top Button ----------
const backToTopBtn = document.getElementById('backToTop');
if (backToTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ---------- 3. Contact Form Validation ----------
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    const fullName = document.getElementById('fullName');
    const email = document.getElementById('email');
    const subject = document.getElementById('subject');
    const message = document.getElementById('message');
    const consent = document.getElementById('consent');
    const charCountSpan = document.getElementById('charCount');
    const formSuccess = document.getElementById('formSuccess');

    // Character counter for message
    if (message && charCountSpan) {
        message.addEventListener('input', () => {
            const len = message.value.length;
            charCountSpan.textContent = len;
            charCountSpan.style.color = len > 500 ? 'red' : 'inherit';
        });
    }

    // Real-time validation on blur
    [fullName, email, subject, message].forEach(field => {
        if (field) {
            field.addEventListener('blur', () => validateField(field));
            field.addEventListener('input', () => {
                if (field.classList.contains('is-invalid')) {
                    validateField(field);
                }
            });
        }
    });

    function validateField(field) {
        let isValid = true;
        const errorEl = document.getElementById(field.id + 'Error');

        if (field.id === 'fullName') {
            isValid = field.value.trim().length >= 2;
        } else if (field.id === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            isValid = emailRegex.test(field.value.trim());
        } else if (field.id === 'subject') {
            isValid = field.value !== '';
        } else if (field.id === 'message') {
            const len = field.value.trim().length;
            isValid = len >= 10 && len <= 500;
        }

        if (!isValid && field.value.trim() !== '') {
            field.classList.add('is-invalid');
        } else if (isValid && field.value.trim() !== '') {
            field.classList.remove('is-invalid');
            field.classList.add('is-valid');
        }
        return isValid;
    }

    // Submit handler
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let allValid = true;

        [fullName, email, subject, message].forEach(field => {
            if (!validateField(field)) {
                field.classList.add('is-invalid');
                allValid = false;
            }
        });

        if (consent && !consent.checked) {
            consent.classList.add('is-invalid');
            allValid = false;
        } else if (consent) {
            consent.classList.remove('is-invalid');
        }

        if (allValid) {
            // Simulate submission
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Sending...';

            setTimeout(() => {
                contactForm.reset();
                [fullName, email, subject, message].forEach(f => f?.classList.remove('is-valid'));
                if (charCountSpan) charCountSpan.textContent = '0';
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Message';
                if (formSuccess) {
                    formSuccess.classList.remove('d-none');
                    setTimeout(() => formSuccess.classList.add('d-none'), 5000);
                }
            }, 1500);
        }
    });
}

// ---------- 4. Events Filter ----------
const eventFilters = document.getElementById('eventFilters');
if (eventFilters) {
    const filterBtns = eventFilters.querySelectorAll('.filter-btn');
    const eventCards = document.querySelectorAll('.event-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.getAttribute('data-filter');

            eventCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = '';
                    card.style.opacity = '1';
                } else {
                    card.style.display = 'none';
                    card.style.opacity = '0';
                }
            });
        });
    });
}

// ---------- 5. Gallery Filter ----------
const galleryFilters = document.getElementById('galleryFilters');
if (galleryFilters) {
    const gFilterBtns = galleryFilters.querySelectorAll('.gallery-filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    gFilterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            gFilterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.getAttribute('data-filter');

            galleryItems.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
            });
        });
    });
}

// ---------- 6. FAQ Search ----------
const faqSearch = document.getElementById('faqSearch');
if (faqSearch) {
    faqSearch.addEventListener('input', () => {
        const query = faqSearch.value.toLowerCase().trim();
        const faqItems = document.querySelectorAll('.faq-item');
        const faqCategories = document.querySelectorAll('.faq-category');

        faqItems.forEach(item => {
            const text = item.textContent.toLowerCase();
            if (query === '' || text.includes(query)) {
                item.classList.remove('hidden');
            } else {
                item.classList.add('hidden');
            }
        });

        // Hide empty category headers
        faqCategories.forEach(cat => {
            let nextEl = cat.nextElementSibling;
            let allHidden = true;
            while (nextEl && nextEl.classList.contains('faq-item')) {
                if (!nextEl.classList.contains('hidden')) {
                    allHidden = false;
                    break;
                }
                nextEl = nextEl.nextElementSibling;
            }
            cat.style.display = allHidden && query !== '' ? 'none' : '';
        });
    });
}

// ---------- 7. Newsletter Form (Footer) ----------
const newsletterForm = document.getElementById('newsletterForm');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = newsletterForm.querySelector('input[type="email"]');
        if (input && input.value.trim() !== '') {
            const btn = newsletterForm.querySelector('button');
            const originalText = btn.textContent;
            btn.textContent = 'Subscribed!';
            btn.disabled = true;
            input.value = '';
            setTimeout(() => {
                btn.textContent = originalText;
                btn.disabled = false;
            }, 2000);
        }
    });
}

console.log('Green Valley Hub - All scripts loaded successfully.');