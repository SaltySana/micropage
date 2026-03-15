document.addEventListener('DOMContentLoaded', function() {

    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    const videoWrapper = document.querySelector('.video-wrapper');
    const video = document.querySelector('.video-element');

    if (video && videoWrapper) {
        videoWrapper.classList.add('loading');

        video.addEventListener('loadeddata', function() {
            videoWrapper.classList.remove('loading');
        });

        video.addEventListener('error', function() {
            videoWrapper.classList.remove('loading');
            console.error('Video failed to load. Please check the source.');
        });

        if (video.readyState >= 2) {
            videoWrapper.classList.remove('loading');
        }

        video.addEventListener('fullscreenchange', handleFullscreenChange);
        video.addEventListener('webkitfullscreenchange', handleFullscreenChange);
        video.addEventListener('mozfullscreenchange', handleFullscreenChange);
        video.addEventListener('MSFullscreenChange', handleFullscreenChange);

        function handleFullscreenChange() {
            video.style.objectFit = 'contain';
        }

        window.addEventListener('resize', function() {
            if (document.fullscreenElement) {
                video.style.objectFit = 'contain';
            }
        });
    }

    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.intersectionRatio > 0.15) {
                entry.target.classList.add('active');

                const cards = entry.target.querySelectorAll('.card');
                cards.forEach((card, index) => {
                    setTimeout(() => {
                        card.classList.add('active');
                    }, index * 80);
                });

                if (entry.target.classList.contains('grid-4') ||
                    entry.target.classList.contains('grid-3')) {
                    const childCards = entry.target.querySelectorAll('.card');
                    childCards.forEach((card, index) => {
                        setTimeout(() => {
                            card.classList.add('active');
                        }, index * 80);
                    });
                }
            } else {
                entry.target.classList.remove('active');

                const cards = entry.target.querySelectorAll('.card');
                cards.forEach(card => card.classList.remove('active'));
            }
        });
    }, {
        threshold: [0, 0.15, 0.25, 0.5, 1],
        rootMargin: '0px 0px -100px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
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

    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const headerHeight = header.offsetHeight;
            if (scrolled < headerHeight) {
                const scale = 1 - (scrolled / headerHeight) * 0.1;
                header.style.transform = `translateY(${scrolled * 0.4}px) scale(${scale})`;
            }
        }, { passive: true });
    }

    const statBanner = document.querySelector('.stat-banner');
    if (statBanner) {
        statBanner.addEventListener('mousemove', (e) => {
            const rect = statBanner.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            statBanner.style.setProperty('--mouse-x', `${x * 15}px`);
            statBanner.style.setProperty('--mouse-y', `${y * 15}px`);
        });
    }

    const setVH = () => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    window.addEventListener('resize', setVH);
    setVH();

    window.addEventListener('orientationchange', function() {
        setTimeout(function() {
            if (video) {
                video.style.display = 'none';
                video.offsetHeight;
                video.style.display = 'block';
            }
        }, 200);
    });

    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            if (window.innerWidth < 768) return;

            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translate(-4px, -4px)`;
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });

        card.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.98)';
        }, { passive: true });

        card.addEventListener('touchend', function() {
            this.style.transform = '';
        }, { passive: true });
    });

    const btnPrimary = document.querySelector('.btn-primary');
    if (btnPrimary) {
        btnPrimary.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            this.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
        });

        btnPrimary.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });

        btnPrimary.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const ripple = document.createElement('span');
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.5);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s cubic-bezier(0.16, 1, 0.3, 1);
                pointer-events: none;
            `;

            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });
    }

    const cardIcons = document.querySelectorAll('.card-icon');
    cardIcons.forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            this.style.animation = 'iconPulse 0.4s ease-out';
        });
        icon.addEventListener('animationend', function() {
            this.style.animation = '';
        });
    });

    const sectionLabels = document.querySelectorAll('.section-label');
    sectionLabels.forEach(label => {
        label.addEventListener('mouseenter', function() {
            this.style.boxShadow = '0 0 20px currentColor';
        });
        label.addEventListener('mouseleave', function() {
            this.style.boxShadow = '';
        });
    });

    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        @keyframes iconPulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.15); }
            100% { transform: scale(1); }
        }
        @keyframes shimmer {
            0% { transform: translateX(-100%) rotate(45deg); }
            100% { transform: translateX(200%) rotate(45deg); }
        }
    `;
    document.head.appendChild(style);

    const headerBadge = document.querySelector('.header-badge');
    if (headerBadge) {
        headerBadge.style.position = 'relative';
        headerBadge.style.overflow = 'hidden';

        const shimmer = document.createElement('span');
        shimmer.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(
                45deg,
                transparent 30%,
                rgba(255,255,255,0.2) 50%,
                transparent 70%
            );
            transform: translateX(-100%) rotate(45deg);
            animation: shimmer 3s ease-in-out infinite;
            pointer-events: none;
        `;
        headerBadge.appendChild(shimmer);
    }

    const images = document.querySelectorAll('.pdf-element');
    images.forEach(img => {
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.5s ease';

        const imgObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    img.style.opacity = '1';
                    imgObserver.unobserve(img);
                }
            });
        }, { threshold: 0.1 });

        imgObserver.observe(img);
    });

    const boostIcon = document.querySelector('.boost-icon');
    if (boostIcon) {
        boostIcon.style.animation = 'float 3s ease-in-out infinite';

        const floatStyle = document.createElement('style');
        floatStyle.textContent = `
            @keyframes float {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-8px); }
            }
        `;
        document.head.appendChild(floatStyle);
    }

    const lightbox = document.getElementById('imageLightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    const clickableImages = document.querySelectorAll('.clickable-image');

    let currentImageIndex = 0;
    const imagesArray = Array.from(clickableImages);

    function openLightbox(index) {
        currentImageIndex = index;
        const img = imagesArray[currentImageIndex];
        lightboxImage.src = img.src;
        lightboxImage.alt = img.alt;
        lightboxCaption.textContent = img.alt;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';

        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function showPrevImage() {
        currentImageIndex = (currentImageIndex - 1 + imagesArray.length) % imagesArray.length;
        const img = imagesArray[currentImageIndex];
        lightboxImage.src = img.src;
        lightboxImage.alt = img.alt;
        lightboxCaption.textContent = img.alt;
    }

    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % imagesArray.length;
        const img = imagesArray[currentImageIndex];
        lightboxImage.src = img.src;
        lightboxImage.alt = img.alt;
        lightboxCaption.textContent = img.alt;
    }

    clickableImages.forEach((img, index) => {
        img.addEventListener('click', () => openLightbox(index));
    });

    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }

    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', (e) => {
            e.stopPropagation();
            showPrevImage();
        });
    }

    if (lightboxNext) {
        lightboxNext.addEventListener('click', (e) => {
            e.stopPropagation();
            showNextImage();
        });
    }

    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
                closeLightbox();
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;

        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowLeft') {
            showPrevImage();
        } else if (e.key === 'ArrowRight') {
            showNextImage();
        }
    });

});
