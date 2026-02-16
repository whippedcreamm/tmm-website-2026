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

        try {
            // Clear previous errors
            clearErrors();

            let isValid = true;

            // Get form fields
            const name = document.getElementById('name');
            const email = document.getElementById('email');
            const phone = document.getElementById('phone');
            const message = document.getElementById('message');

            if (!name || !email || !phone || !message) {
                console.error('Beberapa kolom formulir tidak ditemukan di DOM');
                return;
            }

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
                // Change button state to loading
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                const originalBtnText = submitBtn.textContent;
                submitBtn.disabled = true;
                submitBtn.textContent = 'Mengirim...';

                // Prepare form data
                const formData = new FormData(contactForm);
                const object = Object.fromEntries(formData);
                const json = JSON.stringify(object);

                // Send to Web3Forms API
                fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: json
                })
                    .then(async (response) => {
                        let result = await response.json();
                        if (response.status == 200) {
                            showSuccess();
                            contactForm.reset();
                        } else {
                            console.log(response);
                            alert(result.message || "Terjadi kesalahan saat mengirim pesan. Silakan coba lagi.");
                        }
                    })
                    .catch(error => {
                        console.log(error);
                        alert("Terjadi kesalahan jaringan. Silakan periksa koneksi Anda.");
                    })
                    .finally(() => {
                        // Restore button state
                        submitBtn.disabled = false;
                        submitBtn.textContent = originalBtnText;
                    });
            }
        } catch (error) {
            console.error('Form execution error:', error);
        }
    });
}

function showError(input, message) {
    if (!input) return;
    const formGroup = input.parentElement;
    if (!formGroup) return;

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
    const successModal = document.getElementById('form-success-modal');
    if (successModal) {
        successModal.showModal();
    }
}

function hideSuccess() {
    const successModal = document.getElementById('form-success-modal');
    if (successModal) {
        successModal.close();
    }
}

function initModalClose() {
    // DaisyUI/Native dialog handles close via method="dialog" forms 
    // and ESC key automatically. 
    // We only need this if we want specific custom event logic.
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

    let autoPlayInterval;
    let isTransitioning = false;

    function moveRight() {
        if (isTransitioning) return;
        isTransitioning = true;

        const items = track.querySelectorAll('.client-carousel-item');
        const lastItem = items[items.length - 1];
        const itemWidth = lastItem.getBoundingClientRect().width;
        const gap = parseInt(window.getComputedStyle(track).gap) || 0;
        const fullShift = itemWidth + gap;

        // Move the last item to the beginning
        track.insertBefore(lastItem, items[0]);

        // Instantly move track to the left by one item width (no animation)
        track.style.transition = 'none';
        track.style.transform = `translateX(-${fullShift}px)`;

        // Force a reflow
        track.offsetHeight;

        // Animate back to 0
        track.style.transition = 'transform 0.6s ease-in-out';
        track.style.transform = 'translateX(0)';

        setTimeout(() => {
            isTransitioning = false;
        }, 600);
    }

    function moveLeft() {
        if (isTransitioning) return;
        isTransitioning = true;

        const items = track.querySelectorAll('.client-carousel-item');
        const firstItem = items[0];
        const itemWidth = firstItem.getBoundingClientRect().width;
        const gap = parseInt(window.getComputedStyle(track).gap) || 0;
        const fullShift = itemWidth + gap;

        // Animate move to the left
        track.style.transition = 'transform 0.6s ease-in-out';
        track.style.transform = `translateX(-${fullShift}px)`;

        setTimeout(() => {
            track.style.transition = 'none';
            track.appendChild(firstItem);
            track.style.transform = 'translateX(0)';
            isTransitioning = false;
        }, 600);
    }

    function startAutoPlay() {
        stopAutoPlay();
        autoPlayInterval = setInterval(moveRight, 2000); // Moves content to the RIGHT
    }

    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }

    nextBtn?.addEventListener('click', () => {
        moveRight();
        startAutoPlay();
    });

    prevBtn?.addEventListener('click', () => {
        moveLeft();
        startAutoPlay();
    });

    // Pause autoplay on hover
    track.addEventListener('mouseenter', stopAutoPlay);
    track.addEventListener('mouseleave', startAutoPlay);

    // Initial check and start auto-play
    track.style.transform = 'translateX(0)';
    startAutoPlay();
}

// ============================================
// TESTIMONIAL CAROUSEL
// ============================================
function initTestimonialCarousel() {
    const track = document.getElementById('testimonial-track');
    const prevBtn = document.getElementById('testimonial-prev');
    const nextBtn = document.getElementById('testimonial-next');
    const dotsContainer = document.getElementById('testimonial-dots');
    const items = document.querySelectorAll('.testimonial-carousel-item');

    if (!track || items.length === 0) return;

    let currentIndex = 0;
    const totalItems = items.length;
    let autoPlayInterval;

    // Create dots
    if (dotsContainer) {
        dotsContainer.innerHTML = '';
        for (let i = 0; i < totalItems; i++) {
            const dot = document.createElement('div');
            dot.className = `testimonial-dot ${i === 0 ? 'active' : ''}`;
            dot.addEventListener('click', () => {
                goToSlide(i);
                resetAutoPlay();
            });
            dotsContainer.appendChild(dot);
        }
    }

    function updateCarousel() {
        const itemWidth = items[0].getBoundingClientRect().width;
        const gap = parseInt(window.getComputedStyle(track).gap) || 0;
        const offset = currentIndex * (itemWidth + gap);

        track.style.transform = `translateX(-${offset}px)`;

        // Update dots
        const dots = document.querySelectorAll('.testimonial-dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    }

    function goToSlide(index) {
        currentIndex = index;
        updateCarousel();
    }

    function startAutoPlay() {
        autoPlayInterval = setInterval(() => {
            currentIndex = (currentIndex + 1) % totalItems;
            updateCarousel();
        }, 7000); // 7 seconds
    }

    function resetAutoPlay() {
        clearInterval(autoPlayInterval);
        startAutoPlay();
    }

    nextBtn?.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % totalItems;
        updateCarousel();
        resetAutoPlay();
    });

    prevBtn?.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + totalItems) % totalItems;
        updateCarousel();
        resetAutoPlay();
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        updateCarousel();
    });

    // Initial check and start auto-play
    updateCarousel();
    startAutoPlay();
}

// ============================================
// NUMBER COUNTER ANIMATION
// ============================================
function initNumberCounter() {
    const counters = document.querySelectorAll('.stat-number');
    const speed = 200; // The lower the slower

    const startCounter = (el) => {
        const target = parseInt(el.getAttribute('data-target'));
        const suffix = el.getAttribute('data-suffix') || '';
        let count = 0;
        const increment = target / speed;

        const updateCount = () => {
            if (count < target) {
                count += increment;
                el.innerText = Math.ceil(count) + suffix;
                setTimeout(updateCount, 1);
            } else {
                el.innerText = target + suffix;
            }
        };

        updateCount();
    };

    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    counters.forEach(counter => {
        observer.observe(counter);
    });
}

// ============================================
// FOOTER YEAR
// ============================================
function initFooterYear() {
    const yearEl = document.getElementById('current-year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
}

// ============================================
// DYNAMIC FOOTER SERVICES
// ============================================
function initDynamicFooterServices() {
    const footerList = document.getElementById('footer-services-list');
    if (!footerList) return;

    // 1. Try to get from localStorage (cache)
    const cachedServices = localStorage.getItem('tmm_services_cache');
    if (cachedServices) {
        renderFooterServices(JSON.parse(cachedServices));
    }

    // 2. Update cache
    // If we are on layanan.html, we can scrape directly from the DOM
    if (window.location.pathname.includes('layanan.html')) {
        const serviceHeaders = document.querySelectorAll('section[id] h2');
        const services = [];

        serviceHeaders.forEach(h2 => {
            const section = h2.closest('section');
            if (section && section.id && !['hero', 'process', 'cta', 'statistics', 'clients', 'testimonials'].includes(section.id)) {
                // Extract clean title (e.g. "Pembukuan (Bookkeeping)" -> "Pembukuan")
                const fullTitle = h2.textContent.trim();
                const cleanTitle = fullTitle.split('(')[0].trim();
                services.push({
                    id: section.id,
                    title: cleanTitle
                });
            }
        });

        if (services.length > 0) {
            localStorage.setItem('tmm_services_cache', JSON.stringify(services));
            renderFooterServices(services);
        }
    } else {
        // If not on layanan.html and cache is missing or we want to double check, 
        // fetch it in background (throttle this in production, but here it's fine)
        fetch('layanan.html')
            .then(response => response.text())
            .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const serviceHeaders = doc.querySelectorAll('section[id] h2');
                const services = [];

                serviceHeaders.forEach(h2 => {
                    const section = h2.closest('section');
                    if (section && section.id && !['hero', 'process', 'cta', 'statistics', 'clients', 'testimonials'].includes(section.id)) {
                        const fullTitle = h2.textContent.trim();
                        const cleanTitle = fullTitle.split('(')[0].trim();
                        services.push({
                            id: section.id,
                            title: cleanTitle
                        });
                    }
                });

                if (services.length > 0) {
                    localStorage.setItem('tmm_services_cache', JSON.stringify(services));
                    renderFooterServices(services);
                }
            })
            .catch(err => console.error('Error syncing footer services:', err));
    }

    function renderFooterServices(services) {
        if (!footerList) return;
        footerList.innerHTML = '';

        services.forEach(service => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = `layanan.html#${service.id}`;
            a.className = 'text-gray-300 hover:text-tmm-gold transition-colors';
            a.textContent = service.title;
            li.appendChild(a);
            footerList.appendChild(li);
        });
    }
}

// ============================================
// INITIALIZE ALL
// ============================================
document.addEventListener('DOMContentLoaded', function () {
    initMobileMenu();
    initNavbarScroll();
    initHeroCarousel();
    initClientCarousel();
    initTestimonialCarousel();
    initNumberCounter();
    initFooterYear();
    initSmoothScroll();
    initFormValidation();
    initScrollAnimations();
    initDynamicFooterServices();
    initModalClose();
});
