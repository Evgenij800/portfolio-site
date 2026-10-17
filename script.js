document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', () => {
    // 1. Smooth scrolling for anchor links
    const anchors = document.querySelectorAll('a[href^="#"]');
    
    anchors.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // 2. Scroll Reveal with IntersectionObserver & initial viewport check
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
        document.querySelectorAll('.reveal').forEach(el => el.classList.add('active'));
    } else {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        document.querySelectorAll('.reveal').forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight) {
                el.classList.add('active');
            } else {
                revealObserver.observe(el);
            }
        });
    }

    // 3. Numbers Counter Animation
    const animateCounters = () => {
        const counters = document.querySelectorAll('.fact-num[data-target], .stat-value[data-target]');
        
        counters.forEach(counter => {
            if (counter.dataset.animated) return;
            counter.dataset.animated = 'true';

            const target = +counter.getAttribute('data-target');
            const prefix = counter.getAttribute('data-prefix') || '';
            const suffix = counter.getAttribute('data-suffix') || '';
            const duration = 1200; // ms
            const startTime = performance.now();

            const updateCount = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                // easeOutQuad
                const easeProgress = 1 - (1 - progress) * (1 - progress);
                const current = Math.floor(easeProgress * target);

                let formatted = current.toLocaleString('ru-RU');
                counter.textContent = prefix + formatted + suffix;

                if (progress < 1) {
                    requestAnimationFrame(updateCount);
                } else {
                    counter.textContent = prefix + target.toLocaleString('ru-RU') + suffix;
                }
            };

            requestAnimationFrame(updateCount);
        });
    };

    const statsSection = document.querySelector('.facts-bar') || document.querySelector('.hero');
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        statsObserver.observe(statsSection);
    }

    // 4. Case Cards Tilt Effect (Desktop only, max 2-3 degrees)
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (isFinePointer && !prefersReducedMotion) {
        const caseCards = document.querySelectorAll('.case-card');

        caseCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = ((y - centerY) / centerY) * -2.5;
                const rotateY = ((x - centerX) / centerX) * 2.5;

                card.style.transform = `translateY(-4px) perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) perspective(1000px) rotateX(0deg) rotateY(0deg)';
            });
        });
    }

    // 5. Analytics & Goals tracking (Yandex Metrika counter 113407118)
    document.querySelectorAll('a[href*="t.me/ENM_Evgenij"]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const href = btn.getAttribute('href');
            const target = btn.getAttribute('target') || '_self';

            if (typeof window.ym === 'function') {
                window.ym(113407118, 'reachGoal', 'cta_telegram');
            }
            console.log('metrika: cta_telegram sent');

            setTimeout(() => {
                if (target === '_blank') {
                    window.open(href, '_blank');
                } else {
                    window.location.href = href;
                }
            }, 400);
        });
    });

    let scroll75Reached = false;
    const handleScroll = () => {
        if (scroll75Reached) return;
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        if (docHeight > 0 && (scrollTop / docHeight) >= 0.75) {
            scroll75Reached = true;
            if (typeof window.ym === 'function') {
                window.ym(113407118, 'reachGoal', 'scroll_75');
            }
            console.log('metrika: scroll_75 sent');
            window.removeEventListener('scroll', handleScroll);
        }
    };
    window.addEventListener('scroll', handleScroll);

    console.log('⚡ Portfolio loaded successfully. Vibe coding mode: active.');
});
