// Micro-animations, Transitions and Interactions

// Smooth page navigation helper
window.smoothNavigate = function(url) {
    if (!url || url === '#' || url.startsWith('javascript:')) return;
    
    document.body.classList.add('page-exiting');
    
    setTimeout(() => {
        window.location.href = url;
    }, 280);
};

document.addEventListener('DOMContentLoaded', () => {
    // Add page enter animation class
    document.body.classList.add('page-entering');

    // Attach smooth transition to all relative navigation links and buttons
    const navLinks = document.querySelectorAll('a[href]:not([href^="#"]):not([href^="http"]):not([target="_blank"]), .auth-nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && !href.startsWith('#') && !href.startsWith('javascript:')) {
                e.preventDefault();
                window.smoothNavigate(href);
            }
        });
    });

    // Check login state on homepage
    const userSession = localStorage.getItem('dockseven_user');
    const authButtons = document.querySelector('.auth-buttons');
    if (userSession && authButtons) {
        try {
            const user = JSON.parse(userSession);
            const shortName = user.identifier.split('@')[0];
            authButtons.innerHTML = `
                <div class="user-logged-badge" style="display: flex; align-items: center; gap: 10px;">
                    <span style="display: inline-flex; align-items: center; gap: 6px; background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); color: #059669; padding: 6px 12px; border-radius: 9999px; font-size: 0.85rem; font-weight: 600;">
                        <span style="width: 7px; height: 7px; background: #10b981; border-radius: 50%; display: inline-block;"></span>
                        ⚓ ${shortName} (Cleared)
                    </span>
                    <button class="btn btn-outline" style="padding: 0.45rem 0.9rem; font-size: 0.85rem;" onclick="logoutUser()">Log Out</button>
                </div>
            `;
        } catch (e) {
            console.error(e);
        }
    }

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.style.padding = '0.8rem 5%';
                navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
            } else {
                navbar.style.padding = '1rem 5%';
                navbar.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
            }
        });
    }

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Apply animation starting state to info cards
    const infoCards = document.querySelectorAll('.info-card');
    infoCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(40px)';
        card.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
        observer.observe(card);
    });
    
    // Play button interaction
    const playButtons = document.querySelectorAll('.play-button');
    playButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            btn.style.transform = 'translate(-50%, -50%) scale(0.9)';
            
            setTimeout(() => {
                btn.style.transform = 'translate(-50%, -50%) scale(1)';
                alert('Den Den Mushi feed: Galley-La Shipyard live tour coming soon!');
            }, 150);
        });
    });
    // --- LENIS SMOOTH SCROLL ---
    if (typeof Lenis !== 'undefined') {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            touchMultiplier: 2,
        });
        
        // Connect Lenis to GSAP ScrollTrigger
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
            
            lenis.on('scroll', ScrollTrigger.update);
            gsap.ticker.add((time) => lenis.raf(time * 1000));
            gsap.ticker.lagSmoothing(0);
        }

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
    }

    // --- CANVAS SCROLL SEQUENCE LOGIC (GSAP powered) ---
    const scrollSequence = document.getElementById('scrollSequence');
    if (scrollSequence) {
        const oceanCanvas = document.getElementById('oceanCanvas');
        const oceanCtx = oceanCanvas.getContext('2d');

        const oceanFramesCount = 93;
        const oceanImages = [];
        let currentOceanFrame = { value: 0 };

        for (let i = 1; i <= oceanFramesCount; i++) {
            const img = new Image();
            img.src = `assets/OceanSequence/ezgif-frame-${i.toString().padStart(3, '0')}.jpg`;
            oceanImages.push(img);
        }

        function drawFrame(ctx, img, canvas) {
            if (!img || !img.complete) return;
            const hRatio = canvas.width / img.width;
            const vRatio = canvas.height / img.height;
            const ratio = Math.max(hRatio, vRatio);
            const cx = (canvas.width - img.width * ratio) / 2;
            const cy = (canvas.height - img.height * ratio) / 2;
            
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, img.width, img.height, cx, cy, img.width * ratio, img.height * ratio);
        }

        function resizeCanvas() {
            const dpr = window.devicePixelRatio || 1;
            oceanCanvas.width = window.innerWidth * dpr;
            oceanCanvas.height = window.innerHeight * dpr;
            oceanCanvas.style.width = `${window.innerWidth}px`;
            oceanCanvas.style.height = `${window.innerHeight}px`;
            oceanCtx.imageSmoothingEnabled = true;
            oceanCtx.imageSmoothingQuality = 'high';
            if (oceanImages[0]) drawFrame(oceanCtx, oceanImages[0], oceanCanvas);
        }
        
        window.addEventListener('resize', resizeCanvas);
        
        Promise.all([
            new Promise(res => { oceanImages[0].onload = res; if(oceanImages[0].complete) res(); })
        ]).then(resizeCanvas);

        // Use GSAP ScrollTrigger for smooth frame interpolation
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            gsap.to(currentOceanFrame, {
                value: oceanFramesCount - 1,
                snap: 'value',
                ease: 'none',
                scrollTrigger: {
                    trigger: document.body,
                    start: 'top top',
                    end: 'bottom bottom',
                    scrub: 0.5,  // 0.5s smooth catch-up
                },
                onUpdate: () => {
                    const idx = Math.round(currentOceanFrame.value);
                    if (oceanImages[idx]) drawFrame(oceanCtx, oceanImages[idx], oceanCanvas);
                }
            });

            // Hero overlay fade out on scroll
            const overlay = document.querySelector('.sequence-overlay');
            if (overlay) {
                gsap.to(overlay, {
                    opacity: 0,
                    y: -80,
                    scrollTrigger: {
                        trigger: '.hero-content-section',
                        start: 'top top',
                        end: 'bottom top',
                        scrub: true,
                    }
                });
            }

            // Info cards scroll-in animation
            gsap.utils.toArray('.info-card').forEach((card) => {
                gsap.fromTo(card, 
                    { opacity: 0, y: 60 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 1,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: card,
                            start: 'top 85%',
                            toggleActions: 'play none none none',
                        }
                    }
                );
            });
        } else {
            // Fallback: vanilla scroll listener
            window.addEventListener('scroll', () => {
                const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
                const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
                let scrollFraction = maxScroll > 0 ? scrollTop / maxScroll : 0;
                scrollFraction = Math.max(0, Math.min(1, scrollFraction));
                const idx = Math.min(oceanFramesCount - 1, Math.floor(scrollFraction * oceanFramesCount));
                requestAnimationFrame(() => {
                    if (oceanImages[idx]) drawFrame(oceanCtx, oceanImages[idx], oceanCanvas);
                });
            });
        }
    }

    // --- SHIPYARD CARD CANVAS SCROLL SEQUENCE (GSAP powered) ---
    const shipyardCanvas = document.getElementById('shipyardCanvas');
    if (shipyardCanvas) {
        const shipCtx = shipyardCanvas.getContext('2d');
        const shipFramesCount = 90;
        const shipImages = [];
        let currentShipFrame = { value: 0 };
        
        for (let i = 1; i <= shipFramesCount; i++) {
            const img = new Image();
            img.src = `assets/ShipSequence/ezgif-frame-${i.toString().padStart(3, '0')}.jpg`;
            shipImages.push(img);
        }

        shipyardCanvas.width = 1200;
        shipyardCanvas.height = 1200;
        shipCtx.imageSmoothingEnabled = true;
        shipCtx.imageSmoothingQuality = 'high';

        function drawShipFrame(img) {
            if (!img || !img.complete) return;
            const hRatio = shipyardCanvas.width / img.width;
            const vRatio = shipyardCanvas.height / img.height;
            const ratio = Math.max(hRatio, vRatio);
            const cx = (shipyardCanvas.width - img.width * ratio) / 2;
            const cy = (shipyardCanvas.height - img.height * ratio) / 2;
            shipCtx.clearRect(0, 0, shipyardCanvas.width, shipyardCanvas.height);
            shipCtx.drawImage(img, 0, 0, img.width, img.height, cx, cy, img.width * ratio, img.height * ratio);
        }

        Promise.all([
            new Promise(res => { shipImages[0].onload = res; if(shipImages[0].complete) res(); })
        ]).then(() => drawShipFrame(shipImages[0]));

        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            gsap.to(currentShipFrame, {
                value: shipFramesCount - 1,
                snap: 'value',
                ease: 'none',
                scrollTrigger: {
                    trigger: shipyardCanvas,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 0.3,
                },
                onUpdate: () => {
                    const idx = Math.round(currentShipFrame.value);
                    if (shipImages[idx]) drawShipFrame(shipImages[idx]);
                }
            });
        }
    }

    // Search Redirection Logic
    const searchInput = document.querySelector('.search-box input');
    const searchBtn = document.querySelector('.search-btn');

    if (searchInput && searchBtn) {
        const performSearch = () => {
            const query = encodeURIComponent(searchInput.value.trim());
            window.location.href = `search.html?q=${query}`;
        };

        searchBtn.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
});

function logoutUser() {
    localStorage.removeItem('dockseven_user');
    window.location.reload();
}
