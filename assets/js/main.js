// TMM Website - Main JavaScript

// ============================================
// MOBILE MENU TOGGLE
// ============================================
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuClose = document.getElementById('mobile-menu-close');
    const mobileMenuLinks = document.querySelectorAll('#mobile-menu a');

    if (mobileMenuBtn && mobileMenu) {
        // Open menu
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.remove('hidden');
            mobileMenu.classList.add('visible');
            document.body.style.overflow = 'hidden';
        });

        // Close menu
        if (mobileMenuClose) {
            mobileMenuClose.addEventListener('click', () => {
                mobileMenu.classList.remove('visible');
                mobileMenu.classList.add('hidden');
                document.body.style.overflow = '';
            });
        }

        // Close menu when clicking links
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('visible');
                mobileMenu.classList.add('hidden');
                document.body.style.overflow = '';
            });
        });
    }
}

// ============================================
// NAVBAR SCROLL EFFECT
// ============================================
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar-tmm');

    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('navbar-scrolled');
            } else {
                navbar.classList.remove('navbar-scrolled');
            }
        });
    }
}

// ============================================
// HERO CAROUSEL
// ============================================
function initHeroCarousel() {
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.carousel-dot');
    let currentSlide = 0;
    const slideInterval = 10000; // 10 seconds

    if (slides.length === 0) return;

    function showSlide(index) {
        // Hide all slides
        slides.forEach(slide => {
            slide.classList.add('hidden');
        });

        // Remove active class from all dots
        dots.forEach(dot => {
            dot.classList.remove('active');
        });

        // Show current slide
        slides[index].classList.remove('hidden');

        // Activate current dot
        if (dots[index]) {
            dots[index].classList.add('active');
        }
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    function goToSlide(index) {
        currentSlide = index;
        showSlide(currentSlide);
    }

    // Initialize first slide
    showSlide(0);

    // Auto-advance slides
    setInterval(nextSlide, slideInterval);

    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToSlide(index);
        });
    });
}

// ============================================
// SMOOTH SCROLL
// ============================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // Skip if href is just "#"
            if (href === '#') return;

            const target = document.querySelector(href);

            if (target) {
                e.preventDefault();
                const navbarHeight = document.querySelector('.navbar-tmm')?.offsetHeight || 0;
                const targetPosition = target.offsetTop - navbarHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ============================================
// FORM VALIDATION
// ============================================
function initFormValidation() {
    const contactForm = document.getElementById('contact-form');

    if (!contactForm) return;

    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Clear previous errors
        clearErrors();

        let isValid = true;

        // Get form fields
        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const phone = document.getElementById('phone');
        const message = document.getElementById('message');

        // Validate name
        if (!name.value.trim()) {
            showError(name, 'Nama lengkap wajib diisi');
            isValid = false;
        }

        // Validate email
        if (!email.value.trim()) {
            showError(email, 'Email wajib diisi');
            isValid = false;
        } else if (!isValidEmail(email.value)) {
            showError(email, 'Format email tidak valid');
            isValid = false;
        }

        // Validate phone
        if (!phone.value.trim()) {
            showError(phone, 'Nomor telepon wajib diisi');
            isValid = false;
        } else if (!isValidPhone(phone.value)) {
            showError(phone, 'Format nomor telepon tidak valid');
            isValid = false;
        }

        // Validate message
        if (!message.value.trim()) {
            showError(message, 'Pesan wajib diisi');
            isValid = false;
        }

        if (isValid) {
            showSuccess();
            // Here you would normally send the form data to a server
            // For now, we'll just reset the form
            setTimeout(() => {
                contactForm.reset();
                hideSuccess();
            }, 3000);
        }
    });
}

function showError(input, message) {
    const formGroup = input.parentElement;
    const errorDiv = document.createElement('div');
    errorDiv.className = 'text-red-500 text-sm mt-1 error-message';
    errorDiv.textContent = message;
    formGroup.appendChild(errorDiv);
    input.classList.add('border-red-500');
}

function clearErrors() {
    document.querySelectorAll('.error-message').forEach(error => error.remove());
    document.querySelectorAll('.input-tmm, .textarea-tmm').forEach(input => {
        input.classList.remove('border-red-500');
    });
}

function showSuccess() {
    const successDiv = document.getElementById('form-success');
    if (successDiv) {
        successDiv.classList.remove('hidden');
    }
}

function hideSuccess() {
    const successDiv = document.getElementById('form-success');
    if (successDiv) {
        successDiv.classList.add('hidden');
    }
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function isValidPhone(phone) {
    // Indonesian phone number format (flexible)
    const re = /^(\+62|62|0)[0-9]{9,12}$/;
    return re.test(phone.replace(/[\s-]/g, ''));
}

// ============================================
// FADE IN ON SCROLL (Optional subtle animation)
// ============================================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('opacity-100', 'translate-y-0');
                entry.target.classList.remove('opacity-0', 'translate-y-4');
            }
        });
    }, observerOptions);

    // Observe elements with fade-in class
    document.querySelectorAll('.fade-in').forEach(el => {
        el.classList.add('opacity-0', 'translate-y-4', 'transition-all', 'duration-700');
        observer.observe(el);
    });
}

// ============================================
// CLIENT CAROUSEL
// ============================================
function initClientCarousel() {
    const track = document.getElementById('client-track');
    const prevBtn = document.getElementById('client-prev');
    const nextBtn = document.getElementById('client-next');
    const items = document.querySelectorAll('.client-carousel-item');

    if (!track || items.length === 0) return;

    let currentIndex = 0;
    const itemsToShow = getItemsToShow();
    const totalItems = items.length;

    function getItemsToShow() {
        if (window.innerWidth <= 480) return 1;
        if (window.innerWidth <= 768) return 2;
        return 4;
    }

    function updateCarousel() {
        const showCount = getItemsToShow();

        // Reveal nav buttons only if total items > visible items
        if (totalItems > showCount) {
            prevBtn?.classList.add('visible');
            nextBtn?.classList.add('visible');
            track.style.justifyContent = 'flex-start';
        } else {
            prevBtn?.classList.remove('visible');
            nextBtn?.classList.remove('visible');
            track.style.justifyContent = 'center';
            track.style.transform = 'translateX(0)';
            return;
        }

        const itemWidth = items[0].getBoundingClientRect().width;
        const gap = parseInt(window.getComputedStyle(track).gap) || 0;
        const offset = currentIndex * (itemWidth + gap);

        track.style.transform = `translateX(-${offset}px)`;
    }

    nextBtn?.addEventListener('click', () => {
        const showCount = getItemsToShow();
        if (currentIndex < totalItems - showCount) {
            currentIndex++;
        } else {
            currentIndex = 0; // Loop back
        }
        updateCarousel();
    });

    prevBtn?.addEventListener('click', () => {
        const showCount = getItemsToShow();
        if (currentIndex > 0) {
            currentIndex--;
        } else {
            currentIndex = Math.max(0, totalItems - showCount); // Loop to end
        }
        updateCarousel();
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        currentIndex = 0;
        updateCarousel();
    });

    // Initial check
    updateCarousel();
}

// ============================================
// INITIALIZE ALL
// ============================================
document.addEventListener('DOMContentLoaded', function () {
    initMobileMenu();
    initNavbarScroll();
    initHeroCarousel();
    initClientCarousel();
    initSmoothScroll();
    initFormValidation();
    initScrollAnimations();
});
