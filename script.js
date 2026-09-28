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

    // --- CANVAS SCROLL SEQUENCE LOGIC ---
    const scrollSequence = document.getElementById('scrollSequence');
    if (scrollSequence) {
        const oceanCanvas = document.getElementById('oceanCanvas');
        const oceanCtx = oceanCanvas.getContext('2d');
        
        const title = document.querySelector('.sequence-title');
        const subtitle = document.querySelector('.sequence-subtitle');

        const oceanFramesCount = 93;
        const oceanImages = [];

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
            const centerShift_x = (canvas.width - img.width * ratio) / 2;
            const centerShift_y = (canvas.height - img.height * ratio) / 2;
            
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, img.width, img.height,
                          centerShift_x, centerShift_y, img.width * ratio, img.height * ratio);
        }

        function resizeCanvas() {
            const dpr = window.devicePixelRatio || 1;
            
            oceanCanvas.width = window.innerWidth * dpr;
            oceanCanvas.height = window.innerHeight * dpr;
            oceanCanvas.style.width = `${window.innerWidth}px`;
            oceanCanvas.style.height = `${window.innerHeight}px`;
            
            if (oceanImages[0]) drawFrame(oceanCtx, oceanImages[0], oceanCanvas);
        }
        
        window.addEventListener('resize', resizeCanvas);

        Promise.all([
            new Promise(res => { oceanImages[0].onload = res; if(oceanImages[0].complete) res(); })
        ]).then(resizeCanvas);

        const overlay = document.querySelector('.sequence-overlay');
        
        window.addEventListener('scroll', () => {
            const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            
            let scrollFraction = 0;
            if (maxScroll > 0) {
                scrollFraction = scrollTop / maxScroll;
            }
            
            scrollFraction = Math.max(0, Math.min(1, scrollFraction));

            const oceanFrameIndex = Math.min(oceanFramesCount - 1, Math.floor(scrollFraction * oceanFramesCount));

            requestAnimationFrame(() => {
                if (oceanImages[oceanFrameIndex]) drawFrame(oceanCtx, oceanImages[oceanFrameIndex], oceanCanvas);
            });
        });
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
