/*
========================================================================
   NIMI BIRTHDAY SURPRISE - CINEMATIC ENGINE (script.js)
========================================================================
   Highly optimized, production-quality interactive effects
   Built with pure Vanilla HTML5, CSS3, & Canvas APIs
========================================================================
*/

document.addEventListener('DOMContentLoaded', () => {

    /* =================================================================
       1. GLOBAL STATE & SELECTORS
       ================================================================= */
    const selectors = {
        loaderScreen: document.getElementById('loader-screen'),
        customCursor: document.getElementById('custom-cursor'),
        customCursorDot: document.getElementById('custom-cursor-dot'),
        particleCanvas: document.getElementById('particle-canvas'),
        romanticAudio: document.getElementById('romantic-audio'),
        musicContainer: document.getElementById('music-player-container'),
        musicToggleBtn: document.getElementById('music-toggle-btn'),
        musicVolumeSlider: document.getElementById('volume-slider'),
        heroTypingText: document.getElementById('hero-typing-text'),
        btnOpenSurprise: document.getElementById('btn-open-surprise'),
        btnHeroMusic: document.getElementById('btn-hero-music'),
        sectionMessage: document.getElementById('section-message'),
        emotionalLines: document.querySelectorAll('.emotional-line'),
        
        // Cake Ceremony Elements
        cakeInteractiveContainer: document.querySelector('.cake-interactive-container'),
        interactiveCakeSvg: document.getElementById('interactive-cake-svg'),
        cakeLeftHalf: document.getElementById('cake-left-half'),
        cakeRightHalf: document.getElementById('cake-right-half'),
        fullCakeGroup: document.getElementById('full-cake-group'),
        cuttingLine: document.getElementById('cutting-line-detection'),
        cuttingGuideLine: document.getElementById('cutting-guide-line'),
        cakeKnife: document.getElementById('glowing-cake-knife'),
        cakeWishContainer: document.getElementById('cake-wish-container'),
        btnRelightCandles: document.getElementById('btn-candles-relight'),
        cakeSparkleCanvas: document.getElementById('cake-sparkle-canvas'),
        candleLeft: document.getElementById('candle-left'),
        candleMiddle: document.getElementById('candle-middle'),
        candleRight: document.getElementById('candle-right'),

        // Gallery Lightbox Elements
        galleryItems: document.querySelectorAll('.gallery-item'),
        galleryLightbox: document.getElementById('gallery-lightbox'),
        lightboxImg: document.getElementById('lightbox-img'),
        lightboxCaption: document.getElementById('lightbox-caption'),
        lightboxClose: document.querySelector('.lightbox-close'),

        // Counter Elements
        counterSection: document.getElementById('section-counters'),
        counterDays: document.getElementById('counter-days'),
        counterHours: document.getElementById('counter-hours'),
        counterSmiles: document.getElementById('counter-smiles'),
        counterThoughts: document.getElementById('counter-thoughts'),

        // Envelope Elements
        interactiveEnvelope: document.getElementById('interactive-envelope'),
        envelopeLockBtn: document.getElementById('envelope-lock-btn'),
        btnOpenLetter: document.getElementById('btn-open-letter'),

        // Outro Elements
        btnForeverYours: document.getElementById('btn-forever-yours'),
        outroOverlay: document.getElementById('outro-fullscreen-overlay'),
        outroCanvas: document.getElementById('outro-canvas'),
        outroTypingPoem: document.getElementById('outro-typing-poem'),
        btnOutroRestart: document.getElementById('btn-outro-restart')
    };

    // Global Interactive Cursor Coordinates (Linear Interpolation)
    const cursor = { x: 0, y: 0, targetX: 0, targetY: 0, lerp: 0.1 };
    let isMusicPlaying = false;
    let hasLoaded = false;
    let cakeCutDone = false;
    let envelopeOpenDone = false;

    // Initially freeze page scroll during loader
    document.body.style.overflow = 'hidden';

    /* =================================================================
       2. PREMIUM LOADING SCREEN TRANSITION
       ================================================================= */
    window.addEventListener('load', () => {
        setTimeout(() => {
            selectors.loaderScreen.classList.add('fade-out');
            document.body.style.overflow = 'auto';
            hasLoaded = true;
            
            // Trigger Hero typing intro
            triggerHeroTyping();
            
            // Set up background elements
            initBackgroundParticles();
        }, 3200); // Allow full loading display of pulsing hearts
    });

    // Fallback if load takes too long
    setTimeout(() => {
        if (!hasLoaded) {
            selectors.loaderScreen.classList.add('fade-out');
            document.body.style.overflow = 'auto';
            triggerHeroTyping();
            initBackgroundParticles();
            hasLoaded = true;
        }
    }, 5000);


    /* =================================================================
       3. MAGICAL INTERACTIVE CURSOR TRAIL (CSS + Canvas Particle Spark)
       ================================================================= */
    document.addEventListener('mousemove', (e) => {
        cursor.targetX = e.clientX;
        cursor.targetY = e.clientY;
    });

    // Handle touch triggers for mobile positioning
    document.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
            cursor.targetX = e.touches[0].clientX;
            cursor.targetY = e.touches[0].clientY;
        }
    }, { passive: true });

    function updateCursorPosition() {
        cursor.x += (cursor.targetX - cursor.x) * cursor.lerp;
        cursor.y += (cursor.targetY - cursor.y) * cursor.lerp;

        selectors.customCursor.style.left = `${cursor.x}px`;
        selectors.customCursor.style.top = `${cursor.y}px`;

        // Inner dot follows mouse immediately
        selectors.customCursorDot.style.left = `${cursor.targetX}px`;
        selectors.customCursorDot.style.top = `${cursor.targetY}px`;

        requestAnimationFrame(updateCursorPosition);
    }
    updateCursorPosition();

    // Hook Hover Classes on interactive tags
    const interactables = 'a, button, .gallery-item, .candle-lighting-overlay, #cutting-line-detection, #envelope-lock-btn, .envelope-container';
    document.querySelectorAll(interactables).forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
    });


    /* =================================================================
       4. MUSIC PLAYER SYSTEM (Volume Fade, Waves & Chopin Streaming)
       ================================================================= */
    function playMusic() {
        if (isMusicPlaying) return;
        
        selectors.romanticAudio.play().then(() => {
            isMusicPlaying = true;
            selectors.musicContainer.classList.add('playing');
            toggleButtonIcons(true);
            
            // Smoothly fade audio volume in
            selectors.romanticAudio.volume = 0;
            let fadeVolume = 0;
            const interval = setInterval(() => {
                if (fadeVolume < selectors.musicVolumeSlider.value) {
                    fadeVolume += 0.05;
                    selectors.romanticAudio.volume = Math.min(fadeVolume, selectors.musicVolumeSlider.value);
                } else {
                    clearInterval(interval);
                }
            }, 100);
        }).catch(err => {
            console.log("Audio autoplay prevented by browser. Waiting for user gesture.", err);
        });
    }

    function pauseMusic() {
        if (!isMusicPlaying) return;
        
        // Smooth fade out before pause
        let currentVol = selectors.romanticAudio.volume;
        const interval = setInterval(() => {
            if (currentVol > 0.05) {
                currentVol -= 0.05;
                selectors.romanticAudio.volume = currentVol;
            } else {
                clearInterval(interval);
                selectors.romanticAudio.pause();
                isMusicPlaying = false;
                selectors.musicContainer.classList.remove('playing');
                toggleButtonIcons(false);
            }
        }, 50);
    }

    function toggleButtonIcons(isPlaying) {
        const iconPlays = document.querySelectorAll('.icon-play');
        const iconPauses = document.querySelectorAll('.icon-pause');
        
        if (isPlaying) {
            iconPlays.forEach(i => i.classList.add('hidden'));
            iconPauses.forEach(i => i.classList.remove('hidden'));
        } else {
            iconPlays.forEach(i => i.classList.remove('hidden'));
            iconPauses.forEach(i => i.classList.add('hidden'));
        }
    }

    // Music buttons triggers
    selectors.musicToggleBtn.addEventListener('click', () => {
        if (isMusicPlaying) {
            pauseMusic();
        } else {
            playMusic();
        }
    });

    selectors.btnHeroMusic.addEventListener('click', () => {
        playMusic();
        // Smooth scroll to surprise hero
        selectors.sectionMessage.scrollIntoView({ behavior: 'smooth' });
    });

    selectors.btnOpenSurprise.addEventListener('click', () => {
        playMusic(); // Auto start music on surprise click
        selectors.sectionMessage.scrollIntoView({ behavior: 'smooth' });
    });

    // Volume Slider listener
    selectors.musicVolumeSlider.addEventListener('input', (e) => {
        selectors.romanticAudio.volume = e.target.value;
    });


    /* =================================================================
       5. CINEMATIC TYPING ANIMATION (Hero & Timeline)
       ================================================================= */
    function triggerHeroTyping() {
        const text = "21 May — the day the world became more beautiful ✨";
        let index = 0;
        selectors.heroTypingText.textContent = "";

        function type() {
            if (index < text.length) {
                selectors.heroTypingText.textContent += text.charAt(index);
                index++;
                setTimeout(type, 75);
            }
        }
        setTimeout(type, 800);
    }


    /* =================================================================
       6. GLOBAL CANVAS BACKGROUND ENGINE (twinkling stars, hearts)
       ================================================================= */
    let backgroundParticles = [];
    
    function initBackgroundParticles() {
        const ctx = selectors.particleCanvas.getContext('2d');
        
        function resize() {
            selectors.particleCanvas.width = window.innerWidth;
            selectors.particleCanvas.height = window.innerHeight;
        }
        resize();
        window.addEventListener('resize', resize);

        // Particle Class definition
        class BackgroundParticle {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * selectors.particleCanvas.width;
                this.y = Math.random() * selectors.particleCanvas.height + selectors.particleCanvas.height;
                this.size = Math.random() * 4 + 1; // particle scale
                this.speedY = -(Math.random() * 0.8 + 0.2); // upward flow speed
                this.speedX = Math.random() * 0.4 - 0.2; // side wobble
                this.type = Math.random() > 0.82 ? 'heart' : 'circle';
                this.opacity = Math.random() * 0.5 + 0.15;
                this.maxOpacity = this.opacity;
                this.wobble = Math.random() * 2 * Math.PI;
                this.wobbleSpeed = Math.random() * 0.02 + 0.005;
                this.glowColor = Math.random() > 0.5 ? 'rgba(255, 46, 147,' : 'rgba(184, 46, 255,';
            }

            update() {
                this.y += this.speedY;
                this.wobble += this.wobbleSpeed;
                this.x += this.speedX + Math.sin(this.wobble) * 0.2;

                // Twinkle/fade effect
                this.opacity = this.maxOpacity * (0.8 + 0.2 * Math.sin(this.wobble * 2));

                // Loop back to bottom when off-screen top
                if (this.y < -20) {
                    this.reset();
                }
            }

            draw() {
                ctx.save();
                ctx.globalAlpha = this.opacity;
                ctx.shadowBlur = this.size * 2.5;
                ctx.shadowColor = this.glowColor + '0.6)';

                if (this.type === 'heart') {
                    // Draw mini glowing heart vector
                    ctx.fillStyle = this.glowColor + '1.0)';
                    ctx.beginPath();
                    const topCurveHeight = this.size * 0.3;
                    ctx.moveTo(this.x, this.y + topCurveHeight);
                    
                    // Left curve
                    ctx.bezierCurveTo(
                        this.x - this.size / 2, this.y - this.size / 2, 
                        this.x - this.size, this.y + this.size / 3, 
                        this.x, this.y + this.size
                    );
                    // Right curve
                    ctx.bezierCurveTo(
                        this.x + this.size, this.y + this.size / 3, 
                        this.x + this.size / 2, this.y - this.size / 2, 
                        this.x, this.y + topCurveHeight
                    );
                    ctx.closePath();
                    ctx.fill();
                } else {
                    // Star twinkling point
                    ctx.fillStyle = 'rgba(248, 249, 250, 1.0)';
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2);
                    ctx.fill();
                }
                ctx.restore();
            }
        }

        // Initialize particle array
        const particleCount = Math.min(60, Math.floor(window.innerWidth / 20));
        for (let i = 0; i < particleCount; i++) {
            backgroundParticles.push(new BackgroundParticle());
            // Pre-warm stars at various height points
            backgroundParticles[i].y = Math.random() * selectors.particleCanvas.height;
        }

        // Global Loop
        function animate() {
            ctx.clearRect(0, 0, selectors.particleCanvas.width, selectors.particleCanvas.height);
            
            for (let p of backgroundParticles) {
                p.update();
                p.draw();
            }
            
            requestAnimationFrame(animate);
        }
        animate();
    }


    /* =================================================================
       7. HIGH-PERFORMANCE INTERSECTION OBSERVER (Scroll Reveals)
       ================================================================= */
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                
                // If it is the Romantic Message section, reveal text line by line
                if (entry.target.classList.contains('message-card')) {
                    revealMessageLines();
                }
                
                // If it is the Live Counter section, run counting algorithms
                if (entry.target.id === 'section-counters' || entry.target.closest('#section-counters')) {
                    triggerCountersAnimation();
                }
                
                // Stop observing once revealed to save CPU power
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.reveal-element, .timeline-item').forEach(el => {
        revealObserver.observe(el);
    });

    // Custom observer for specific sections
    revealObserver.observe(selectors.counterSection);

    // Line-by-line reveal function for Section 2
    function revealMessageLines() {
        selectors.emotionalLines.forEach(line => {
            const delay = parseFloat(line.getAttribute('data-delay')) * 1000;
            setTimeout(() => {
                line.classList.add('line-shown');
            }, delay);
        });
    }

    // Scroll Progress bar tracker
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const progress = (scrollTop / scrollHeight) * 100;
        document.getElementById('scroll-progress-bar').style.width = `${progress}%`;
    });


    /* =================================================================
       8. LIVE LOVE COUNTER EASING ALGORITHMS
       ================================================================= */
    let countersStarted = false;
    
    function triggerCountersAnimation() {
        if (countersStarted) return;
        countersStarted = true;

        const counters = [
            { element: selectors.counterDays, target: 365, suffix: '' },
            { element: selectors.counterHours, target: 8760, suffix: '' },
            { element: selectors.counterSmiles, target: 15000, suffix: '+' },
            { element: selectors.counterThoughts, target: 999999, suffix: ' ❤️' }
        ];

        counters.forEach(c => {
            animateCount(c.element, c.target, 2500, c.suffix); // 2.5s duration
        });
    }

    function animateCount(element, target, duration, suffix) {
        let startTime = null;

        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const percentage = Math.min(progress / duration, 1);
            
            // Elegant Ease Out Easing function
            const easeOutQuad = percentage * (2 - percentage);
            const currentValue = Math.floor(easeOutQuad * target);
            
            // Format number with commas for readability (e.g. 999,999)
            element.textContent = currentValue.toLocaleString() + suffix;

            if (progress < duration) {
                window.requestAnimationFrame(step);
            } else {
                element.textContent = target.toLocaleString() + suffix;
            }
        }
        window.requestAnimationFrame(step);
    }


    /* =================================================================
       9. INTERACTIVE CAKE CEREMONY & SWIPE CUT ENGINE
       ================================================================= */
    let isCuttingActive = false;
    let cutPathPoints = [];
    const cakeSparkleCtx = selectors.cakeSparkleCanvas.getContext('2d');
    let cakeConfettiParticles = [];

    // Resize Cake canvas overlay
    function resizeCakeCanvas() {
        selectors.cakeSparkleCanvas.width = selectors.cakeSparkleCanvas.offsetWidth;
        selectors.cakeSparkleCanvas.height = selectors.cakeSparkleCanvas.offsetHeight;
    }
    resizeCakeCanvas();
    window.addEventListener('resize', resizeCakeCanvas);

    // Knife follow tracking when hovering anywhere on the cake SVG
    selectors.interactiveCakeSvg.addEventListener('mouseenter', () => {
        if (cakeCutDone) return;
        selectors.cakeKnife.classList.remove('hidden');
        selectors.customCursor.style.opacity = 0;
        selectors.customCursorDot.style.opacity = 0;
    });

    selectors.interactiveCakeSvg.addEventListener('mouseleave', () => {
        selectors.cakeKnife.classList.add('hidden');
        selectors.customCursor.style.opacity = 1;
        selectors.customCursorDot.style.opacity = 1;
    });

    document.addEventListener('mousemove', (e) => {
        if (cakeCutDone) return;
        // Position knife following coordinates
        selectors.cakeKnife.style.left = `${e.clientX}px`;
        selectors.cakeKnife.style.top = `${e.clientY}px`;
    });

    // Candle lighting taps
    document.querySelectorAll('.candle-wrapper').forEach(c => {
        c.addEventListener('click', () => {
            if (c.getAttribute('data-lit') === 'false') {
                c.setAttribute('data-lit', 'true');
                const flame = c.querySelector('.candle-flame');
                const flameInner = c.querySelector('.candle-flame-inner');
                flame.classList.remove('hidden');
                flameInner.classList.remove('hidden');
                // Sparkle burst on lighting
                triggerCandleSparkles(c);
            }
        });
    });

    function triggerCandleSparkles(candleEl) {
        const svgRect = selectors.interactiveCakeSvg.getBoundingClientRect();
        const candleRect = candleEl.getBoundingClientRect();
        const relativeX = candleRect.left - svgRect.left + (candleRect.width / 2);
        const relativeY = candleRect.top - svgRect.top;
        
        spawnExplosions(relativeX, relativeY, 15);
    }

    // Forgiving Drag / Swipe Cut Detection anywhere on the Cake
    selectors.interactiveCakeSvg.addEventListener('mousedown', startCutting);
    selectors.interactiveCakeSvg.addEventListener('touchstart', startCutting, { passive: true });

    document.addEventListener('mousemove', continueCutting);
    document.addEventListener('touchmove', continueCutting, { passive: true });

    document.addEventListener('mouseup', stopCutting);
    document.addEventListener('touchend', stopCutting);

    function startCutting(e) {
        if (cakeCutDone) return;
        isCuttingActive = true;
        cutPathPoints = [];
        addCutPoint(e);
    }

    function continueCutting(e) {
        if (!isCuttingActive || cakeCutDone) return;
        addCutPoint(e);
        
        // Draw sparklers along user swipe coordinates
        const currentPt = cutPathPoints[cutPathPoints.length - 1];
        if (currentPt) {
            spawnExplosions(currentPt.relativeX, currentPt.relativeY, 3);
        }

        // Check if cut coordinates exceed swipe threshold
        verifyCutProgress();
    }

    function stopCutting() {
        isCuttingActive = false;
    }

    function addCutPoint(e) {
        const svgRect = selectors.interactiveCakeSvg.getBoundingClientRect();
        let clientY, clientX;
        
        if (e.touches && e.touches.length > 0) {
            clientY = e.touches[0].clientY;
            clientX = e.touches[0].clientX;
        } else {
            clientY = e.clientY;
            clientX = e.clientX;
        }

        const relativeY = clientY - svgRect.top;
        const relativeX = clientX - svgRect.left;

        cutPathPoints.push({ x: clientX, y: clientY, relativeX, relativeY });
    }

    function verifyCutProgress() {
        if (cutPathPoints.length < 2) return;

        const startPt = cutPathPoints[0];
        const currentPt = cutPathPoints[cutPathPoints.length - 1];

        // Measure distance swiped/dragged in any direction
        const dx = currentPt.x - startPt.x;
        const dy = currentPt.y - startPt.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // If user drags anywhere on the cake by more than 40 pixels, trigger!
        if (distance > 40) {
            executeCakeCut();
        }
    }

    function executeCakeCut() {
        cakeCutDone = true;
        isCuttingActive = false;
        selectors.cakeKnife.classList.add('hidden');
        selectors.customCursor.style.opacity = 1;
        selectors.customCursorDot.style.opacity = 1;

        // Animate SVG Cake separation
        selectors.fullCakeGroup.classList.add('cake-sliced');
        selectors.cuttingGuideLine.classList.add('hidden');

        // Extinguish flames with puff smoke vectors
        extinguishFlames();

        // Canvas Confetti Hearts Blast
        spawnExplosions(selectors.cakeSparkleCanvas.width / 2, selectors.cakeSparkleCanvas.height * 0.6, 120);

        // Unveil magical Make a Wish screen
        selectors.cakeWishContainer.classList.remove('hidden');
    }

    function extinguishFlames() {
        const candles = [selectors.candleLeft, selectors.candleMiddle, selectors.candleRight];
        candles.forEach(c => {
            if (c.getAttribute('data-lit') === 'true') {
                c.setAttribute('data-lit', 'false');
                c.querySelector('.candle-flame').classList.add('hidden');
                c.querySelector('.candle-flame-inner').classList.add('hidden');
                
                // Spawn smoke puffs
                createSmokePuff(c);
            }
        });
    }

    function createSmokePuff(candleEl) {
        const svgRect = selectors.interactiveCakeSvg.getBoundingClientRect();
        const candleRect = candleEl.getBoundingClientRect();
        const relativeX = candleRect.left - svgRect.left + (candleRect.width / 2);
        const relativeY = candleRect.top - svgRect.top;

        for (let i = 0; i < 4; i++) {
            setTimeout(() => {
                const puff = document.createElement('div');
                puff.className = 'smoke-puff';
                puff.style.left = `${relativeX + Math.random() * 10 - 5}px`;
                puff.style.top = `${relativeY + Math.random() * 10 - 15}px`;
                selectors.cakeInteractiveContainer.appendChild(puff);
                
                // Remove from DOM
                setTimeout(() => puff.remove(), 1200);
            }, i * 200);
        }
    }

    // Cake Canvas Animation engine
    class SparkleConfetti {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * 8 + 3;
            this.color = `rgba(255, ${Math.floor(Math.random() * 100 + 46)}, 147, ${Math.random() * 0.7 + 0.3})`;
            this.speedX = Math.random() * 8 - 4;
            this.speedY = Math.random() * -10 - 2; // shoot upwards
            this.gravity = 0.22;
            this.decay = Math.random() * 0.015 + 0.008;
            this.opacity = 1.0;
            this.isHeart = Math.random() > 0.4;
            this.angle = Math.random() * Math.PI * 2;
            this.spinSpeed = Math.random() * 0.1 - 0.05;
        }

        update() {
            this.speedY += this.gravity;
            this.x += this.speedX;
            this.y += this.speedY;
            this.opacity -= this.decay;
            this.angle += this.spinSpeed;
        }

        draw() {
            cakeSparkleCtx.save();
            cakeSparkleCtx.globalAlpha = this.opacity;
            cakeSparkleCtx.translate(this.x, this.y);
            cakeSparkleCtx.rotate(this.angle);

            if (this.isHeart) {
                // Vector heart draw on slice canvas
                cakeSparkleCtx.fillStyle = this.color;
                cakeSparkleCtx.beginPath();
                const size = this.size;
                cakeSparkleCtx.moveTo(0, size * 0.3);
                
                // Left curve
                cakeSparkleCtx.bezierCurveTo(
                    -size / 2, -size / 2, 
                    -size, size / 3, 
                    0, size
                );
                // Right curve
                cakeSparkleCtx.bezierCurveTo(
                    size, size / 3, 
                    size / 2, -size / 2, 
                    0, size * 0.3
                );
                cakeSparkleCtx.closePath();
                cakeSparkleCtx.fill();
            } else {
                // Gold star spark
                cakeSparkleCtx.fillStyle = '#ffd700';
                cakeSparkleCtx.shadowBlur = 5;
                cakeSparkleCtx.shadowColor = '#ffd700';
                cakeSparkleCtx.beginPath();
                cakeSparkleCtx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
                cakeSparkleCtx.fill();
            }

            cakeSparkleCtx.restore();
        }
    }

    function spawnExplosions(x, y, count) {
        // Adjust coordinate mapping from parent container to canvas
        const scaleX = selectors.cakeSparkleCanvas.width / selectors.cakeInteractiveContainer.offsetWidth;
        const scaleY = selectors.cakeSparkleCanvas.height / selectors.cakeInteractiveContainer.offsetHeight;
        
        for (let i = 0; i < count; i++) {
            cakeConfettiParticles.push(new SparkleConfetti(x * scaleX, y * scaleY));
        }
    }

    // Interactive canvas render loop
    function updateCakeCanvas() {
        cakeSparkleCtx.clearRect(0, 0, selectors.cakeSparkleCanvas.width, selectors.cakeSparkleCanvas.height);
        
        for (let i = cakeConfettiParticles.length - 1; i >= 0; i--) {
            const p = cakeConfettiParticles[i];
            p.update();
            p.draw();
            
            // Remove faded particles
            if (p.opacity <= 0) {
                cakeConfettiParticles.splice(i, 1);
            }
        }
        
        requestAnimationFrame(updateCakeCanvas);
    }
    updateCakeCanvas();

    // Relight interactive hook
    selectors.btnRelightCandles.addEventListener('click', () => {
        cakeCutDone = false;
        selectors.fullCakeGroup.classList.remove('cake-sliced');
        selectors.cuttingGuideLine.classList.remove('hidden');
        selectors.cakeWishContainer.classList.add('hidden');
        
        const candles = [selectors.candleLeft, selectors.candleMiddle, selectors.candleRight];
        candles.forEach(c => {
            c.setAttribute('data-lit', 'true');
            c.querySelector('.candle-flame').classList.remove('hidden');
            c.querySelector('.candle-flame-inner').classList.remove('hidden');
            triggerCandleSparkles(c);
        });
    });


    /* =================================================================
       10. MASONRY PHOTO GALLERY LIGHTBOX SYSTEM
       ================================================================= */
    selectors.galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const fullImgSrc = item.getAttribute('data-src');
            const caption = item.querySelector('.overlay-text h3').textContent + " — " + item.querySelector('.overlay-text p').textContent;
            
            selectors.lightboxImg.src = fullImgSrc;
            selectors.lightboxCaption.textContent = caption;
            selectors.galleryLightbox.classList.add('active');
            
            // Freeze screen scroll on active modal
            document.body.style.overflow = 'hidden';
        });
    });

    function closeLightbox() {
        selectors.galleryLightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    selectors.lightboxClose.addEventListener('click', closeLightbox);
    selectors.galleryLightbox.addEventListener('click', (e) => {
        if (e.target === selectors.galleryLightbox) {
            closeLightbox();
        }
    });

    // Close on Escape keyboard
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeLightbox();
        }
    });


    /* =================================================================
       11. 3D ENVELOPE SURPRISE CONTROLLERS
       ================================================================= */
    function openSurpriseLetter() {
        if (envelopeOpenDone) return;
        envelopeOpenDone = true;
        
        selectors.interactiveEnvelope.classList.add('open');
    }

    selectors.envelopeLockBtn.addEventListener('click', openSurpriseLetter);
    selectors.btnOpenLetter.addEventListener('click', openSurpriseLetter);


    /* =================================================================
       12. FINAL EMOTIONAL OUTRO (Forever Yours)
       ================================================================= */
    let outroHearts = [];
    let isOutroLoopActive = false;

    selectors.btnForeverYours.addEventListener('click', () => {
        // Trigger Outro Overlay
        selectors.outroOverlay.classList.remove('hidden');
        selectors.outroOverlay.classList.add('active');
        
        // Pause romantic Chopin so we can restart or let it play
        // Freeze scroll during final screen
        document.body.style.overflow = 'hidden';

        // Initialize outro canvas loop
        initOutroCanvas();

        // Run final poem typewriter reveal
        triggerOutroPoemReveal();
    });

    function initOutroCanvas() {
        const ctx = selectors.outroCanvas.getContext('2d');
        isOutroLoopActive = true;
        
        function resize() {
            selectors.outroCanvas.width = window.innerWidth;
            selectors.outroCanvas.height = window.innerHeight;
        }
        resize();
        window.addEventListener('resize', resize);

        class OutroHeart {
            constructor() {
                this.x = selectors.outroCanvas.width / 2;
                this.y = selectors.outroCanvas.height / 2;
                this.size = Math.random() * 12 + 6;
                this.speedX = Math.random() * 14 - 7;
                this.speedY = Math.random() * -12 - 4; // rise up
                this.gravity = 0.15;
                this.opacity = 1.0;
                this.decay = Math.random() * 0.012 + 0.005;
                this.color = `rgba(255, ${Math.floor(Math.random() * 110 + 46)}, ${Math.floor(Math.random() * 100 + 130)}, ${Math.random() * 0.8 + 0.2})`;
                this.wobble = Math.random() * 10;
                this.wobbleSpeed = Math.random() * 0.05;
            }

            update() {
                this.speedY += this.gravity;
                this.x += this.speedX + Math.sin(this.wobble);
                this.y += this.speedY;
                this.opacity -= this.decay;
                this.wobble += this.wobbleSpeed;
            }

            draw() {
                ctx.save();
                ctx.globalAlpha = this.opacity;
                ctx.fillStyle = this.color;
                ctx.beginPath();
                const size = this.size;
                ctx.moveTo(this.x, this.y + size * 0.3);
                
                // Left side curve
                ctx.bezierCurveTo(
                    this.x - size / 2, this.y - size / 2, 
                    this.x - size, this.y + size / 3, 
                    this.x, this.y + size
                );
                // Right side curve
                ctx.bezierCurveTo(
                    this.x + size, this.y + size / 3, 
                    this.x + size / 2, this.y - size / 2, 
                    this.x, this.y + size * 0.3
                );
                ctx.closePath();
                ctx.fill();
                ctx.restore();
            }
        }

        // Outro loop drawing
        function renderLoop() {
            if (!isOutroLoopActive) return;
            
            // Draw dark trail
            ctx.fillStyle = 'rgba(3, 0, 6, 0.08)';
            ctx.fillRect(0, 0, selectors.outroCanvas.width, selectors.outroCanvas.height);
            
            // Burst random sparkles from center periodically
            if (Math.random() > 0.7) {
                for (let i = 0; i < 4; i++) {
                    outroHearts.push(new OutroHeart());
                }
            }

            for (let i = outroHearts.length - 1; i >= 0; i--) {
                const h = outroHearts[i];
                h.update();
                h.draw();
                if (h.opacity <= 0) {
                    outroHearts.splice(i, 1);
                }
            }

            requestAnimationFrame(renderLoop);
        }
        
        // Blast initial massive bunch
        for (let i = 0; i < 80; i++) {
            outroHearts.push(new OutroHeart());
        }
        renderLoop();
    }

    function triggerOutroPoemReveal() {
        const poemLines = [
            "In the quiet chapters of my life...",
            "your name became my favorite verse.",
            "Happy Birthday, Nimi.",
            "Forever Yours."
        ];

        selectors.outroTypingPoem.textContent = "";

        // Sequence reveals
        poemLines.forEach((lineText, index) => {
            setTimeout(() => {
                const line = document.createElement('p');
                line.className = 'poem-line';
                if (index === 3) {
                    line.className = 'poem-line poem-signature';
                }
                line.textContent = lineText;
                selectors.outroTypingPoem.appendChild(line);
                
                // Triggers CSS transition reveal
                setTimeout(() => line.classList.add('visible'), 50);

                // Show restart surprise button at the end
                if (index === poemLines.length - 1) {
                    setTimeout(() => {
                        selectors.btnOutroRestart.classList.remove('hidden');
                    }, 2500);
                }
            }, index * 2000); // 2s gap between sentences
        });
    }

    // Restart SURPRISE fully
    selectors.btnOutroRestart.addEventListener('click', () => {
        isOutroLoopActive = false;
        selectors.outroOverlay.classList.remove('active');
        selectors.outroOverlay.classList.add('hidden');
        document.body.style.overflow = 'auto';

        // Reset Envelope state
        selectors.interactiveEnvelope.classList.remove('open');
        envelopeOpenDone = false;
        selectors.envelopeLockBtn.style.opacity = 1;
        selectors.envelopeLockBtn.style.visibility = 'visible';

        // Reset Cake state
        selectors.btnRelightCandles.click();

        // Scroll back to top hero intro smoothly
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

});
