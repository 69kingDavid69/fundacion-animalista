        // Toast Notification System
        function createToastContainer() {
            let container = document.querySelector('.toast-container');
            if (!container) {
                container = document.createElement('div');
                container.className = 'toast-container';
                document.body.appendChild(container);
            }
            return container;
        }

        function showToast(message, type = 'info', title = '', duration = 4000) {
            const container = createToastContainer();

            const icons = {
                error: '❌',
                warning: '⚠️',
                success: '✅',
                info: 'ℹ️'
            };

            const titles = {
                error: title || 'Error',
                warning: title || 'Atención',
                success: title || '¡Listo!',
                info: title || 'Información'
            };

            const toast = document.createElement('div');
            toast.className = `toast toast--${type}`;
            toast.innerHTML = `
                <span class="toast__icon">${icons[type] || icons.info}</span>
                <div class="toast__body">
                    <div class="toast__title">${titles[type]}</div>
                    <div class="toast__message">${message}</div>
                </div>
                <button class="toast__close" aria-label="Cerrar">&times;</button>
            `;

            container.appendChild(toast);

            const closeBtn = toast.querySelector('.toast__close');
            const remove = () => {
                toast.classList.add('hiding');
                setTimeout(() => {
                    if (toast.parentNode) toast.remove();
                }, 300);
            };

            closeBtn.addEventListener('click', remove);

            if (duration > 0) {
                setTimeout(remove, duration);
            }
        }

        // Menu Toggle
        const menuToggle = document.getElementById('menuToggle');
        const navLinks = document.getElementById('navLinks');

        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        // Close menu when clicking on a link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });

        // Smooth scrolling
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Form submission
        document.querySelector('.contact-form').addEventListener('submit', (e) => {
            e.preventDefault();
            showToast('Te contactaremos pronto.', 'success', '¡Mensaje enviado!');
            e.target.reset();
        });


        // Donation System
        let selectedDonationAmount = 0;

        // Donation card selection
        document.querySelectorAll('.donation-card').forEach(card => {
            card.addEventListener('click', function () {
                // Remove selected class from all cards
                document.querySelectorAll('.donation-card').forEach(c => c.classList.remove('selected'));

                // Add selected class to clicked card
                this.classList.add('selected');

                // Get amount
                const amount = this.dataset.amount;
                if (amount === 'custom') {
                    selectedDonationAmount = 'custom';
                } else {
                    selectedDonationAmount = parseInt(amount);
                }
            });
        });

        // Open payment modal
        const paymentModal = document.getElementById('paymentModal');
        const openPaymentBtn = document.getElementById('openPaymentModal');
        const closeModalBtn = document.getElementById('closeModal');

        openPaymentBtn.addEventListener('click', () => {
            if (selectedDonationAmount === 0) {
                showToast('Selecciona un monto de donación antes de continuar.', 'warning', 'Monto requerido');
                return;
            }

            if (selectedDonationAmount === 'custom') {
                const customAmount = prompt('Ingresa el monto que deseas donar (solo números):');
                if (customAmount && !isNaN(customAmount) && parseInt(customAmount) > 0) {
                    selectedDonationAmount = parseInt(customAmount);
                } else {
                    showToast('Ingresa solo números positivos (ej: 50000).', 'error', 'Monto inválido');
                    return;
                }
            }

            // Update modal with selected amount
            const formattedAmount = new Intl.NumberFormat('es-CO', {
                style: 'currency',
                currency: 'COP',
                minimumFractionDigits: 0
            }).format(selectedDonationAmount);

            document.getElementById('selectedAmountDisplay').textContent = formattedAmount;

            // Show modal
            paymentModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        // Close modal
        closeModalBtn.addEventListener('click', () => {
            closePaymentModal();
        });

        paymentModal.addEventListener('click', (e) => {
            if (e.target === paymentModal) {
                closePaymentModal();
            }
        });

        function closePaymentModal() {
            paymentModal.classList.remove('active');
            document.body.style.overflow = 'auto';
            // Reset payment options
            document.querySelectorAll('.payment-option').forEach(opt => opt.classList.remove('active'));
            document.querySelectorAll('.payment-info-section').forEach(section => section.classList.remove('active'));
        }

        // Payment method selection
        document.querySelectorAll('.payment-option').forEach(option => {
            option.addEventListener('click', function () {
                const method = this.dataset.method;

                // Remove active class from all options
                document.querySelectorAll('.payment-option').forEach(opt => opt.classList.remove('active'));

                // Add active class to selected option
                this.classList.add('active');

                // Hide all payment info sections
                document.querySelectorAll('.payment-info-section').forEach(section => {
                    section.classList.remove('active');
                });

                // Show corresponding payment info
                if (method === 'nequi') {
                    document.getElementById('nequiInfo').classList.add('active');
                } else if (method === 'bancolombia') {
                    document.getElementById('bancolombiaInfo').classList.add('active');
                } else if (method === 'qr') {
                    document.getElementById('qrInfo').classList.add('active');
                }
            });
        });

        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && paymentModal.classList.contains('active')) {
                closePaymentModal();
            }
        });

        // ─── Lightbox Gallery ───────────────────────────────────────────────
        const lightbox      = document.getElementById('lightbox');
        const lightboxImg   = document.getElementById('lightboxImg');
        const lightboxClose = document.getElementById('lightboxClose');
        const lightboxPrev  = document.getElementById('lightboxPrev');
        const lightboxNext  = document.getElementById('lightboxNext');
        const galleryItems  = document.querySelectorAll('.gallery-item');
        let currentIndex    = 0;

        function openLightbox(index) {
            currentIndex = index;
            const img = galleryItems[index].querySelector('img');
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeLightbox() {
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto';
        }

        function showPrev() {
            currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
            openLightbox(currentIndex);
        }

        function showNext() {
            currentIndex = (currentIndex + 1) % galleryItems.length;
            openLightbox(currentIndex);
        }

        galleryItems.forEach((item, i) => {
            item.addEventListener('click', () => openLightbox(i));
        });

        lightboxClose.addEventListener('click', closeLightbox);
        lightboxPrev.addEventListener('click', showPrev);
        lightboxNext.addEventListener('click', showNext);

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;
            if (e.key === 'Escape')      closeLightbox();
            if (e.key === 'ArrowLeft')   showPrev();
            if (e.key === 'ArrowRight')  showNext();
        });
        // ─── Animated Counters ───────────────────────────────────────────────
        function animateCounter(el) {
            const target = parseInt(el.dataset.target, 10);
            const duration = 2000;
            const step = Math.ceil(target / (duration / 16));
            let current = 0;

            const interval = setInterval(() => {
                current += step;
                if (current >= target) {
                    current = target;
                    clearInterval(interval);
                    el.textContent = target + '+';
                } else {
                    el.textContent = current + '+';
                }
            }, 16);
        }

        const statNumbers = document.querySelectorAll('.stat-number[data-target]');
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        statNumbers.forEach(el => counterObserver.observe(el));
