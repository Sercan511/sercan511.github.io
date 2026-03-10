/* ==============================
   PORTFOLIO - SCRIPT.JS
   Heavy Animation Edition
   ============================== */

document.addEventListener('DOMContentLoaded', () => {

    // ---- PAGE LOADER ----
    const loader = document.createElement('div');
    loader.className = 'page-loader';
    loader.innerHTML = '<div class="loader-spinner"></div>';
    document.body.prepend(loader);

    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('hidden');
            setTimeout(() => loader.remove(), 600);
        }, 800);
    });

    // ---- INJECT SVG GRADIENT FOR PROGRESS RINGS ----
    const svgDefs = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgDefs.setAttribute('width', '0');
    svgDefs.setAttribute('height', '0');
    svgDefs.style.position = 'absolute';
    svgDefs.innerHTML = `
        <defs>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#6c3ce0"/>
                <stop offset="100%" stop-color="#00d4aa"/>
            </linearGradient>
        </defs>
    `;
    document.body.prepend(svgDefs);

    // ---- NAVBAR SCROLL EFFECT ----
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    let scrollTicking = false;
    window.addEventListener('scroll', () => {
        if (!scrollTicking) {
            requestAnimationFrame(() => {
                // Navbar background change
                if (window.scrollY > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }

                // Active nav link on scroll
                let current = '';
                sections.forEach(section => {
                    const sectionTop = section.offsetTop - 120;
                    if (window.scrollY >= sectionTop) {
                        current = section.getAttribute('id');
                    }
                });

                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('data-section') === current) {
                        link.classList.add('active');
                    }
                });
                scrollTicking = false;
            });
            scrollTicking = true;
        }
    }, { passive: true });

    // ---- MOBILE NAV TOGGLE ----
    const navToggle = document.getElementById('navToggle');
    const navLinksContainer = document.getElementById('navLinks');

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinksContainer.classList.toggle('open');
        // Lock body scroll when mobile menu is open
        if (navLinksContainer.classList.contains('open')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });

    // Close mobile nav on link click
    navLinksContainer.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinksContainer.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    // ---- SCROLL REVEAL ANIMATIONS ----
    const observerOptions = {
        threshold: 0.05,
        rootMargin: '0px 0px 0px 0px'
    };

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add staggered delay
                const delay = index * 100;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
                scrollObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        scrollObserver.observe(el);
    });

    // ---- SKILL BARS ANIMATION ----
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const fills = entry.target.querySelectorAll('.skill-fill');
                fills.forEach((fill, i) => {
                    const width = fill.getAttribute('data-width');
                    setTimeout(() => {
                        fill.style.width = width + '%';
                    }, i * 250);
                });
                skillObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.05 });

    document.querySelectorAll('.skill-bars').forEach(el => {
        skillObserver.observe(el);
    });

    // ---- PROGRESS RINGS ANIMATION ----
    const ringObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const ring = entry.target;
                const progress = parseInt(ring.getAttribute('data-progress'));
                const circumference = 2 * Math.PI * 42; // radius 42
                const offset = circumference - (progress / 100) * circumference;

                const fillCircle = ring.querySelector('.progress-fill');
                setTimeout(() => {
                    fillCircle.style.strokeDashoffset = offset;
                }, 300);

                ringObserver.unobserve(ring);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.progress-ring').forEach(el => {
        ringObserver.observe(el);
    });

    // ---- DETECT MOBILE / TOUCH DEVICE ----
    const isMobile = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    // ---- CURSOR TRAIL EFFECT (Desktop only) ----
    if (!isMobile) {
        const trailCount = 8;
        const trails = [];
        const mousePos = { x: 0, y: 0 };

        for (let i = 0; i < trailCount; i++) {
            const trail = document.createElement('div');
            trail.className = 'cursor-trail';
            trail.style.width = (12 - i * 1.2) + 'px';
            trail.style.height = (12 - i * 1.2) + 'px';
            trail.style.opacity = (0.6 - i * 0.07);
            document.body.appendChild(trail);
            trails.push({ el: trail, x: 0, y: 0 });
        }

        document.addEventListener('mousemove', (e) => {
            mousePos.x = e.clientX;
            mousePos.y = e.clientY;
        });

        function animateTrails() {
            let x = mousePos.x;
            let y = mousePos.y;

            trails.forEach((trail, i) => {
                const speed = 0.3 - (i * 0.02);
                trail.x += (x - trail.x) * speed;
                trail.y += (y - trail.y) * speed;

                trail.el.style.left = trail.x + 'px';
                trail.el.style.top = trail.y + 'px';
                trail.el.style.transform = 'translate(-50%, -50%)';
            });

            requestAnimationFrame(animateTrails);
        }

        document.addEventListener('mouseenter', () => {
            trails.forEach(t => t.el.style.opacity = '0.5');
        });
        animateTrails();
    }

    // ---- CLICK / TAP PARTICLE BURST ----
    const particleEvent = isTouch ? 'touchstart' : 'click';
    document.addEventListener(particleEvent, (e) => {
        const x = e.touches ? e.touches[0].clientX : e.clientX;
        const y = e.touches ? e.touches[0].clientY : e.clientY;
        createParticleBurst(x, y);
    });

    function createParticleBurst(x, y) {
        const colors = ['#6c3ce0', '#00d4aa', '#ff6b9d', '#9d7af5', '#5dffd8'];
        // Fewer particles on mobile for performance
        const count = isMobile ? 6 : 12;
        const maxDist = isMobile ? 40 : 80;

        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            particle.style.background = colors[Math.floor(Math.random() * colors.length)];

            const angle = (360 / count) * i;
            const distance = 30 + Math.random() * maxDist;
            const driftX = Math.cos(angle * Math.PI / 180) * distance;
            const driftY = Math.sin(angle * Math.PI / 180) * distance;

            particle.style.setProperty('--drift-x', driftX + 'px');
            particle.style.setProperty('--drift-y', driftY + 'px');

            document.body.appendChild(particle);

            setTimeout(() => particle.remove(), 2000);
        }
    }

    // ---- 3D TILT EFFECT ON CARDS (Desktop only) ----
    if (!isMobile) {
        const tiltCards = document.querySelectorAll('.ziel-card, .fach-card, .feedback-card, .info-card');

        tiltCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = ((y - centerY) / centerY) * -8;
                const rotateY = ((x - centerX) / centerX) * 8;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
                card.style.transition = 'transform 0.5s ease';
            });

            card.addEventListener('mouseenter', () => {
                card.style.transition = 'none';
            });
        });

        // ---- MAGNETIC HOVER ON TAGS (Desktop only) ----
        const magneticElements = document.querySelectorAll('.tag, .floating-badge, .timeline-tags span');

        magneticElements.forEach(el => {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px) scale(1.05)`;
            });

            el.addEventListener('mouseleave', () => {
                el.style.transform = 'translate(0, 0) scale(1)';
                el.style.transition = 'transform 0.4s ease';
            });

            el.addEventListener('mouseenter', () => {
                el.style.transition = 'none';
            });
        });

        // ---- PARALLAX SHAPES ON MOUSE MOVE (Desktop only) ----
        const shapes = document.querySelectorAll('.shape');

        document.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 2;
            const y = (e.clientY / window.innerHeight - 0.5) * 2;

            shapes.forEach((shape, i) => {
                const speed = (i + 1) * 15;
                shape.style.transform += ` translate(${x * speed}px, ${y * speed}px)`;
            });
        });
    } else {
        // ---- MOBILE: GYROSCOPE PARALLAX (if supported) ----
        if (window.DeviceOrientationEvent) {
            const shapes = document.querySelectorAll('.shape');
            window.addEventListener('deviceorientation', (e) => {
                const x = (e.gamma || 0) / 45; // -1 to 1
                const y = (e.beta || 0) / 90;  // -1 to 1

                shapes.forEach((shape, i) => {
                    const speed = (i + 1) * 8;
                    shape.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
                });
            }, { passive: true });
        }
    }

    // ---- SMOOTH COUNTER ANIMATION FOR % TEXTS ----
    function animateCounter(element, target) {
        let current = 0;
        const increment = target / 60;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.round(current) + '%';
        }, 20);
    }

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const ring = entry.target.closest('.progress-ring');
                if (ring) {
                    const target = parseInt(ring.getAttribute('data-progress'));
                    animateCounter(entry.target, target);
                }
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.progress-text').forEach(el => {
        el.textContent = '0%';
        counterObserver.observe(el);
    });

    // ---- RANDOM FLOATING PARTICLES IN HERO BG ----
    function createBackgroundParticles() {
        const heroBg = document.querySelector('.hero-bg-shapes');
        if (!heroBg) return;

        // Fewer particles on mobile for performance
        const particleCount = isMobile ? 12 : 30;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 4 + 2}px;
                height: ${Math.random() * 4 + 2}px;
                background: ${Math.random() > 0.5 ? 'rgba(108, 60, 224, 0.4)' : 'rgba(0, 212, 170, 0.4)'};
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: floatSlow ${5 + Math.random() * 10}s ease-in-out infinite ${Math.random() * 5}s;
                pointer-events: none;
            `;
            heroBg.appendChild(particle);
        }
    }

    createBackgroundParticles();

    // ---- TEXT REVEAL ON HERO ----
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        heroTitle.style.opacity = '1';
    }

    // ---- SMOOTH SCROLL WITH EASING ----
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

    // ---- TYPING EFFECT ON MOTTO ----
    const mottoText = document.querySelector('.motto-text');
    if (mottoText) {
        const originalText = mottoText.textContent;
        mottoText.textContent = '';
        mottoText.style.borderRight = '2px solid var(--accent)';

        const mottoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    typeText(mottoText, originalText, 0);
                    mottoObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        mottoObserver.observe(mottoText);
    }

    function typeText(element, text, index) {
        if (index < text.length) {
            element.textContent += text.charAt(index);
            setTimeout(() => typeText(element, text, index + 1), 40);
        } else {
            // Blinking cursor
            setInterval(() => {
                element.style.borderRightColor = element.style.borderRightColor === 'transparent' ? 'var(--accent)' : 'transparent';
            }, 530);
        }
    }

    // ---- RIPPLE EFFECT ON CARDS ----
    document.querySelectorAll('.ziel-card, .fach-card, .timeline-content').forEach(card => {
        card.addEventListener('click', function (e) {
            const rect = this.getBoundingClientRect();
            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute;
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background: rgba(108, 60, 224, 0.3);
                left: ${e.clientX - rect.left}px;
                top: ${e.clientY - rect.top}px;
                transform: translate(-50%, -50%);
                animation: ripple 0.8s ease-out forwards;
                pointer-events: none;
            `;
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 800);
        });
    });
    // ---- SUBJECT TAB SWITCHING ----
    const fachBtns = document.querySelectorAll('.fach-btn');
    const fachPanels = document.querySelectorAll('.fach-panel');

    fachBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const fach = btn.getAttribute('data-fach');

            // Update active button + ARIA
            fachBtns.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-selected', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-selected', 'true');

            // Update active panel + ARIA
            fachPanels.forEach(p => {
                p.classList.remove('active');
                p.setAttribute('aria-hidden', 'true');
            });
            const panel = document.getElementById('panel-' + fach);
            if (panel) {
                panel.classList.add('active');
                panel.removeAttribute('aria-hidden');
            }
        });
    });

    // ---- DOCUMENT STACK INTERACTION ----
    const docStack = document.getElementById('docStack');
    const stackCounter = document.getElementById('stackCounter');
    const stackPrev = document.getElementById('stackPrev');
    const stackNext = document.getElementById('stackNext');

    if (docStack) {
        const cards = Array.from(docStack.querySelectorAll('.doc-card'));
        let currentIndex = 0;

        function updateStack() {
            const total = cards.length;
            cards.forEach((card, i) => {
                // Calculate position relative to current top card
                const offset = (i - currentIndex + total) % total;
                const rotation = offset * 4;
                const scale = 1 - offset * 0.05;
                const translateY = offset * 8;
                const zIndex = total - offset;
                const opacity = offset < 4 ? 1 : 0;

                card.style.zIndex = zIndex;
                card.style.transform = `rotateZ(${rotation}deg) scale(${scale}) translateY(${translateY}px)`;
                card.style.opacity = opacity;
                card.style.pointerEvents = offset === 0 ? 'auto' : 'none';
            });
            stackCounter.textContent = `${currentIndex + 1} / ${total}`;
        }

        function nextCard() {
            currentIndex = (currentIndex + 1) % cards.length;
            updateStack();
        }

        function prevCard() {
            currentIndex = (currentIndex - 1 + cards.length) % cards.length;
            updateStack();
        }

        // Navigation buttons
        stackNext.addEventListener('click', nextCard);
        stackPrev.addEventListener('click', prevCard);

        // Click on top card to cycle
        cards.forEach((card) => {
            card.addEventListener('click', (e) => {
                // Don't cycle if clicking the download link
                if (e.target.closest('.doc-hint')) return;
                nextCard();
            });
        });

        // Make sure hint links don't trigger card cycling
        docStack.querySelectorAll('.doc-hint').forEach(link => {
            link.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        });

        // Touch swipe support
        let touchStartX = 0;
        let touchStartY = 0;

        docStack.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        }, { passive: true });

        docStack.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            const diffX = touchEndX - touchStartX;
            const diffY = touchEndY - touchStartY;

            // Only trigger on horizontal swipe
            if (Math.abs(diffX) > 50 && Math.abs(diffX) > Math.abs(diffY)) {
                if (diffX < 0) {
                    nextCard();
                } else {
                    prevCard();
                }
            }
        }, { passive: true });

        // Initialize stack positions
        updateStack();
    }

    // ---- CERTIFICATE & CONFETTI SYSTEM ----
    const certOverlay = document.getElementById('certOverlay');
    const openCertBtn = document.getElementById('openCertBtn');
    const certClose = document.getElementById('certClose');
    const certClose2 = document.getElementById('certClose2');
    const certSubmit = document.getElementById('certSubmit');
    const certNameInput = document.getElementById('certNameInput');
    const certStepInput = document.getElementById('certStepInput');
    const certStepDisplay = document.getElementById('certStepDisplay');
    const certDisplayName = document.getElementById('certDisplayName');
    const certDate = document.getElementById('certDate');
    const certDownload = document.getElementById('certDownload');
    const confettiCanvas = document.getElementById('confettiCanvas');

    // Open modal
    if (openCertBtn) {
        openCertBtn.addEventListener('click', () => {
            certOverlay.classList.add('active');
            certStepInput.style.display = 'block';
            certStepDisplay.style.display = 'none';
            certNameInput.value = '';
            setTimeout(() => certNameInput.focus(), 300);
        });
    }

    // Close modal
    function closeCertModal() {
        certOverlay.classList.remove('active');
    }
    if (certClose) certClose.addEventListener('click', closeCertModal);
    if (certClose2) certClose2.addEventListener('click', closeCertModal);
    if (certOverlay) {
        certOverlay.addEventListener('click', (e) => {
            if (e.target === certOverlay) closeCertModal();
        });
    }

    // Submit name → show certificate
    function showCertificate() {
        const name = certNameInput.value.trim();
        if (!name) {
            certNameInput.style.borderColor = '#ff4444';
            certNameInput.placeholder = 'Bitte gib deinen Namen ein...';
            return;
        }

        // Set name and date
        certDisplayName.textContent = name;
        const now = new Date();
        const options = { day: '2-digit', month: 'long', year: 'numeric' };
        certDate.textContent = now.toLocaleDateString('de-CH', options);

        // Switch steps
        certStepInput.style.display = 'none';
        certStepDisplay.style.display = 'block';

        // Trigger confetti
        launchConfetti();
    }

    if (certSubmit) certSubmit.addEventListener('click', showCertificate);
    if (certNameInput) {
        certNameInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') showCertificate();
            certNameInput.style.borderColor = 'rgba(108, 60, 224, 0.2)';
        });
    }

    // Download as PDF
    if (certDownload) {
        certDownload.addEventListener('click', () => {
            const certPaper = document.getElementById('certPaper');
            if (typeof html2canvas !== 'undefined' && typeof jspdf !== 'undefined' && certPaper) {
                html2canvas(certPaper, {
                    backgroundColor: '#0a0a1a',
                    scale: 2,
                    useCORS: true
                }).then(canvas => {
                    try {
                        const { jsPDF } = jspdf;
                        const imgData = canvas.toDataURL('image/png');
                        const pdf = new jsPDF({
                            orientation: 'landscape',
                            unit: 'px',
                            format: [canvas.width, canvas.height]
                        });
                        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
                        pdf.save('Zertifikat_Sercan_Portfolio.pdf');
                    } catch {
                        // Fallback to PNG download
                        const link = document.createElement('a');
                        link.download = 'Zertifikat_Sercan_Portfolio.png';
                        link.href = canvas.toDataURL('image/png');
                        link.click();
                    }
                }).catch(() => {
                    window.print();
                });
            } else if (typeof html2canvas !== 'undefined' && certPaper) {
                html2canvas(certPaper, {
                    backgroundColor: '#0a0a1a',
                    scale: 2,
                    useCORS: true
                }).then(canvas => {
                    const link = document.createElement('a');
                    link.download = 'Zertifikat_Sercan_Portfolio.png';
                    link.href = canvas.toDataURL('image/png');
                    link.click();
                }).catch(() => {
                    window.print();
                });
            } else {
                window.print();
            }
        });
    }

    // ---- CONFETTI ANIMATION ----
    function launchConfetti() {
        if (!confettiCanvas) return;
        const ctx = confettiCanvas.getContext('2d');
        confettiCanvas.width = window.innerWidth;
        confettiCanvas.height = window.innerHeight;

        const particles = [];
        const colors = ['#6c3ce0', '#00d4aa', '#5d86ff', '#ffaa32', '#ff6b6b', '#ffd700', '#ff69b4'];

        for (let i = 0; i < 150; i++) {
            particles.push({
                x: Math.random() * confettiCanvas.width,
                y: Math.random() * confettiCanvas.height - confettiCanvas.height,
                w: Math.random() * 10 + 5,
                h: Math.random() * 6 + 3,
                color: colors[Math.floor(Math.random() * colors.length)],
                speed: Math.random() * 3 + 2,
                drift: Math.random() * 2 - 1,
                rotation: Math.random() * 360,
                rotSpeed: Math.random() * 6 - 3,
                opacity: 1
            });
        }

        let frame = 0;
        const maxFrames = 200;

        function animate() {
            ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
            frame++;

            particles.forEach(p => {
                p.y += p.speed;
                p.x += p.drift;
                p.rotation += p.rotSpeed;

                if (frame > maxFrames - 40) {
                    p.opacity = Math.max(0, p.opacity - 0.025);
                }

                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate((p.rotation * Math.PI) / 180);
                ctx.globalAlpha = p.opacity;
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
                ctx.restore();
            });

            if (frame < maxFrames) {
                requestAnimationFrame(animate);
            } else {
                ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
            }
        }
        animate();
    }

    console.log('🚀 Portfolio loaded with animations!');
});
