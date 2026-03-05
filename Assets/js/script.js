gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

        const isMobile = window.innerWidth < 768;

        ScrollTrigger.config({
            ignoreMobileResize: true,
            autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load,resize'
        });

        (function initCursor() {
            const cursorEl = document.getElementById('custom-cursor');
            const hdgEl = document.getElementById('hdg');

            let cx = window.innerWidth / 2, cy = window.innerHeight / 2;
            let tx = cx, ty = cy;
            let vx = 0, vy = 0;
            let currentAngle = 0, lastX = cx, lastY = cy;

            const MAX_TRAIL = 18;
            const trailContainer = document.getElementById('cursor-trail-container');
            const trails = [];

            for (let i = 0; i < MAX_TRAIL; i++) {
                const d = document.createElement('div');
                d.className = 'cursor-trail';
                const size = Math.max(2, 7 - i * 0.35);
                d.style.width = size + 'px';
                d.style.height = size + 'px';
                d.style.opacity = ((MAX_TRAIL - i) / MAX_TRAIL * 0.45).toFixed(2);
                trailContainer.appendChild(d);
                trails.push({ el: d, x: cx, y: cy });
            }

            document.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; });

            function lerp(a, b, t) { return a + (b - a) * t; }

            function lerpAngle(a, b, t) {
                let diff = b - a;
                while (diff > Math.PI) diff -= Math.PI * 2;
                while (diff < -Math.PI) diff += Math.PI * 2;
                return a + diff * t;
            }

            function animateCursor() {
                cx = lerp(cx, tx, 0.1);
                cy = lerp(cy, ty, 0.1);
                vx = cx - lastX; vy = cy - lastY;
                lastX = cx; lastY = cy;

                const speed = Math.sqrt(vx * vx + vy * vy);
                if (speed > 0.15) currentAngle = lerpAngle(currentAngle, Math.atan2(vx, -vy), Math.min(0.15 + speed * 0.04, 0.25));

                cursorEl.style.left = (cx - 20) + 'px';
                cursorEl.style.top = (cy - 20) + 'px';
                cursorEl.style.transform = `rotate(${currentAngle}rad)`;

                let deg = Math.round(currentAngle * 180 / Math.PI) % 360;
                if (deg < 0) deg += 360;
                hdgEl.textContent = String(deg).padStart(3, '0');

                for (let i = trails.length - 1; i > 0; i--) {
                    trails[i].x = lerp(trails[i].x, trails[i - 1].x, 0.4);
                    trails[i].y = lerp(trails[i].y, trails[i - 1].y, 0.4);
                }
                trails[0].x = cx; trails[0].y = cy;

                trails.forEach((t, i) => {
                    const offset = (i + 1) * 2.5;
                    t.el.style.left = (t.x + Math.sin(currentAngle) * -offset * 0.3) + 'px';
                    t.el.style.top = (t.y + Math.cos(currentAngle) * offset * 0.3) + 'px';
                    t.el.style.opacity = ((MAX_TRAIL - i) / MAX_TRAIL * 0.45 * Math.min(speed / 3, 1)).toFixed(2);
                });

                requestAnimationFrame(animateCursor);
            }
            animateCursor();
        })();

        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const id = this.getAttribute('href');
                if (id === '#' || id === '') return;
                const target = document.querySelector(id);
                if (target) {
                    e.preventDefault();
                    gsap.to([document.documentElement, document.body], {
                        duration: 1.5,
                        scrollTo: { y: target, offsetY: 70, autoKill: false },
                        ease: 'power4.inOut'
                    });
                }
            });
        });

        gsap.set('#navbar', { opacity: 0, y: -20 });
        gsap.set('#label', { opacity: 0, y: 15 });
        gsap.set('#desc', { opacity: 0, y: 20 });
        gsap.set('#cta', { opacity: 0 });
        gsap.set('#deco', { opacity: 0 });
        gsap.set('#photo', { opacity: 0, scale: 0.97, y: 20 });
        gsap.set('.hero-name .line', { yPercent: 110 });

        const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        heroTl
            .to('#navbar', { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, 0.3)
            .to('#label', { opacity: 1, y: 0, duration: 0.6 }, 0.9)
            .to('.hero-name .line', { yPercent: 0, duration: 0.9, stagger: 0.15, ease: 'power4.out' }, 1.1)
            .to('#desc', { opacity: 1, y: 0, duration: 0.7 }, 1.7)
            .to('#cta', { opacity: 1, duration: 0.6 }, 2.1)
            .to('#deco', { opacity: 1, duration: 0.6 }, 2.2)
            .to('#photo', { opacity: 1, scale: 1, y: 0, duration: 1.2, ease: 'power2.inOut' }, 2.4);

        heroTl.eventCallback('onComplete', () => {
            document.querySelectorAll('.hero-left > *').forEach(el => {
                gsap.fromTo(el,
                    { scale: 1, opacity: 1, y: 0, filter: 'blur(0px)' },
                    {
                        scale: 0.7, opacity: 0, y: 50, filter: 'blur(5px)', ease: 'power2.in',
                        scrollTrigger: { trigger: el, start: 'top 30%', end: 'top -15%', scrub: 0.6 }
                    }
                );
            });
            gsap.fromTo('#photo',
                { scale: 1, opacity: 1, y: 0, filter: 'blur(0px)' },
                {
                    scale: 0.55, opacity: 0, y: 60, filter: 'blur(8px)', ease: 'power2.in',
                    scrollTrigger: { trigger: '#photo', start: 'top 30%', end: 'top -20%', scrub: 0.6 }
                }
            );
        });

        gsap.set('.skills-header', { opacity: 0, y: 40 });
        gsap.set('[data-skill-card]', { opacity: 0, y: 40 });
        gsap.set('[data-work-header]', { opacity: 0, y: 60 });
        gsap.set('[data-work-slider] .work-image-container', { opacity: 0, x: isMobile ? 0 : -80, y: isMobile ? 40 : 0, filter: 'blur(8px)' });
        gsap.set('[data-work-slider] .work-content', { opacity: 0, x: isMobile ? 0 : 80, y: isMobile ? 40 : 0, filter: 'blur(8px)' });
        gsap.set('[data-journey-header]', { opacity: 0, y: 60 });
        gsap.set('[data-contact-header]', { opacity: 0, y: 60 });
        gsap.set('[data-contact-info]', { opacity: 0, x: isMobile ? 0 : -50, y: isMobile ? 30 : 0, filter: 'blur(8px)' });
        gsap.set('[data-contact-form]', { opacity: 0, x: isMobile ? 0 : 50, y: isMobile ? 30 : 0, filter: 'blur(8px)' });
        gsap.set('.tl-row', { opacity: 0, y: isMobile ? 30 : 0 });
        gsap.set('.tl-left', { x: isMobile ? 0 : -30 });
        gsap.set('.tl-right', { x: isMobile ? 0 : 30 });

        function revealEl(el, props, delay) {
            gsap.to(el, { ...props, delay: delay || 0, clearProps: 'filter' });
        }

        if (isMobile) {
            const io = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) return;
                    const el = entry.target;
                    io.unobserve(el);

                    if (el.classList.contains('skills-header') || el.matches('[data-work-header]') || el.matches('[data-journey-header]') || el.matches('[data-contact-header]')) {
                        revealEl(el, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' });
                    } else if (el.matches('[data-skill-card]')) {
                        const cards = gsap.utils.toArray('[data-skill-card]');
                        const idx = cards.indexOf(el);
                        revealEl(el, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, idx * 0.1);
                    } else if (el.classList.contains('work-image-container')) {
                        revealEl(el, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8, ease: 'power3.out' });
                    } else if (el.classList.contains('work-content')) {
                        revealEl(el, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8, ease: 'power3.out' }, 0.15);
                    } else if (el.matches('[data-contact-info]')) {
                        revealEl(el, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.7, ease: 'power3.out' });
                    } else if (el.matches('[data-contact-form]')) {
                        revealEl(el, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.7, ease: 'power3.out' }, 0.1);
                    } else if (el.classList.contains('tl-row')) {
                        revealEl(el, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' });
                        el.classList.add('tl-active');
                    }
                });
            }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

            [
                '.skills-header',
                '[data-skill-card]',
                '[data-work-header]',
                '.work-image-container',
                '.work-content',
                '[data-journey-header]',
                '.tl-row',
                '[data-contact-header]',
                '[data-contact-info]',
                '[data-contact-form]',
            ].forEach(sel => {
                document.querySelectorAll(sel).forEach(el => io.observe(el));
            });

        } else {
            gsap.to('.skills-header', {
                opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
                scrollTrigger: { trigger: '.skills-section', start: 'top 85%', once: true }
            });

            gsap.utils.toArray('[data-skill-card]').forEach((card, i) => {
                gsap.to(card, {
                    opacity: 1, y: 0, duration: 0.7, ease: 'power3.out',
                    delay: i * 0.12,
                    scrollTrigger: { trigger: '.skills-grid', start: 'top 85%', once: true }
                });
            });

            gsap.fromTo('.skills-header',
                { scale: 1, opacity: 1, y: 0, filter: 'blur(0px)' },
                {
                    scale: 0.7, opacity: 0, y: 50, filter: 'blur(5px)', ease: 'power2.in',
                    scrollTrigger: { trigger: '.skills-header', start: 'top 30%', end: 'top -15%', scrub: 0.6 }
                }
            );

            gsap.utils.toArray('[data-skill-card]').forEach(card => {
                gsap.fromTo(card,
                    { scale: 1, opacity: 1, y: 0, filter: 'blur(0px)' },
                    {
                        scale: 0.65, opacity: 0, y: 60, filter: 'blur(6px)', ease: 'power2.in',
                        scrollTrigger: { trigger: card, start: 'top 30%', end: 'top -20%', scrub: 0.6 }
                    }
                );
            });

            gsap.to('[data-work-header]', {
                opacity: 1, y: 0, duration: 1, ease: 'power3.out',
                scrollTrigger: { trigger: '[data-work-header]', start: 'top 85%', once: true }
            });

            gsap.to('[data-work-slider] .work-image-container', {
                opacity: 1, x: 0, filter: 'blur(0px)', duration: 1.1, ease: 'power3.out',
                scrollTrigger: { trigger: '[data-work-slider]', start: 'top 85%', once: true }
            });

            gsap.to('[data-work-slider] .work-content', {
                opacity: 1, x: 0, filter: 'blur(0px)', duration: 1.1, ease: 'power3.out',
                scrollTrigger: { trigger: '[data-work-slider]', start: 'top 85%', once: true }
            });

            gsap.fromTo('[data-work-slider]',
                { scale: 1, opacity: 1, y: 0, filter: 'blur(0px)' },
                {
                    scale: 0.85, opacity: 0, y: 60, filter: 'blur(6px)', ease: 'power2.in',
                    scrollTrigger: { trigger: '.work-section', start: 'bottom 40%', end: 'bottom 0%', scrub: 0.8 }
                }
            );
        }

        const projects = [
            {
                name: "LSP KJN Company Profiles",
                role: "Web Developer · PT. Sevanam Teknologi Solusindo",
                desc: "Web static company profile for LSP KJN, built with native HTML, CSS, and JavaScript. Focused on delivering a responsive and modern user interface to showcase the institution's services.",
                tags: ["HTML-CSS", "JS"],
                color: "#7b1adc",
                img: "Assets/img/lsp_kjn.png",
                link: "https://lspkjn.id/"
            },
            {
                name: "Zescra Movie",
                role: "Web Developer · Final Project SMK",
                desc: "ZMV (Zescra Movie) is a cloud-based movie streaming website. It focuses on efficiency by storing all video assets in the cloud and offers a hassle-free user experience with a one-click Google Sign-In feature.",
                tags: ["HTML-CSS", "JavaScript", "PHP - CI 4", "VidGuard", "MySQL"],
                color: "#7b1adc",
                img: "Assets/img/zmv.png",
                link: "#"
            },
            {
                name: "TJ SARAN",
                role: "Web Developer · Product Showcase SMK",
                desc: "A web-based school reporting platform for students to submit feedback and grievances directly to the administration.",
                tags: ["HTML-CSS", "JavaScript", "MySQL"],
                color: "#7b1adc",
                img: "Assets/img/tj_saran.jpeg",
                link: "#"
            },
            {
                name: "Surya Motor",
                role: "Web Developer · Internship Project",
                desc: "An all-in-one workshop management web app with automated data integration and payroll calculation.",
                tags: ["HTML-CSS", "JavaScript", "PHP", "MySQL"],
                color: "#7b1adc",
                img: "Assets/img/sm_admin.jpeg",
                link: "#"
            },
        ];

        let workCurrent = 0;
        const workTotal = projects.length;
        const workContainer = document.getElementById('workImageContainer');
        const workProgress = document.getElementById('workProgress');
        const workCounterNum = document.getElementById('workCounterNum');

        document.getElementById('workCounterTotal').textContent = String(workTotal).padStart(2, '0');

        projects.forEach(p => {
            const card = document.createElement('div');
            card.className = 'work-card';
            const img = document.createElement('img');
            img.src = p.img; img.alt = p.name; img.loading = 'lazy';
            const overlay = document.createElement('div');
            overlay.className = 'work-card-overlay';
            card.appendChild(img); card.appendChild(overlay);
            workContainer.appendChild(card);
        });

        projects.forEach(() => {
            const dot = document.createElement('div');
            dot.className = 'work-progress-dot';
            workProgress.appendChild(dot);
        });

        function workGetPos(ci, ai) { return (ci - ai + workTotal) % workTotal; }

        function workUpdateCards() {
            workContainer.querySelectorAll('.work-card').forEach((card, i) => {
                const pos = workGetPos(i, workCurrent);
                card.setAttribute('data-pos', pos < 4 ? pos : 3);
            });
        }

        function workRevealContent(dir) {
            const p = projects[workCurrent];
            const outDir = dir > 0 ? -20 : 20;
            const els = ['#workProjTitle', '#workProjSubtitle', '#workLine', '#workProjDesc', '#workTags', '#workProjCta'];

            gsap.to(els, {
                opacity: 0, y: outDir, duration: 0.25, ease: 'power2.in',
                onComplete: () => {
                    document.getElementById('workProjTitle').textContent = p.name;
                    document.getElementById('workProjSubtitle').textContent = p.role;
                    document.getElementById('workProjDesc').textContent = p.desc;
                    document.getElementById('workProjCta').href = p.link;
                    document.getElementById('workLine').style.background = p.color;

                    workCounterNum.textContent = String(workCurrent + 1).padStart(2, '0');
                    gsap.fromTo(workCounterNum, { y: -10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: 'power3.out' });

                    const tagsEl = document.getElementById('workTags');
                    tagsEl.innerHTML = '';
                    p.tags.forEach(t => {
                        const span = document.createElement('span');
                        span.className = 'work-tag'; span.textContent = t;
                        tagsEl.appendChild(span);
                    });

                    workProgress.querySelectorAll('.work-progress-dot').forEach((d, i) => {
                        d.classList.toggle('active', i === workCurrent);
                        d.style.background = i === workCurrent ? p.color : '';
                    });

                    gsap.fromTo(els,
                        { opacity: 0, y: dir > 0 ? 20 : -20 },
                        { opacity: 1, y: 0, duration: 0.55, stagger: 0.06, ease: 'power3.out' }
                    );
                }
            });
        }

        function workNavigate(dir) {
            workCurrent = (workCurrent + dir + workTotal) % workTotal;
            workUpdateCards();
            workRevealContent(dir);
        }

        document.getElementById('workBtnDown').addEventListener('click', () => workNavigate(1));
        document.getElementById('workBtnUp').addEventListener('click', () => workNavigate(-1));

        workContainer.addEventListener('click', e => {
            const card = e.target.closest('.work-card');
            if (!card) return;
            const cards = [...workContainer.querySelectorAll('.work-card')];
            if (workGetPos(cards.indexOf(card), workCurrent) > 0) workNavigate(1);
        });

        document.addEventListener('keydown', e => {
            const rect = document.getElementById('work').getBoundingClientRect();
            if (rect.top >= window.innerHeight || rect.bottom <= 0) return;
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') workNavigate(1);
            if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') workNavigate(-1);
        });

        workUpdateCards();
        workRevealContent(1);

        gsap.to('[data-journey-header]', {
            opacity: 1, y: 0, duration: 1, ease: 'power3.out',
            scrollTrigger: { trigger: '[data-journey-header]', start: 'top 85%', once: true }
        });

        gsap.fromTo('[data-journey-header]',
            { scale: 1, opacity: 1, y: 0, filter: 'blur(0px)' },
            {
                scale: 0.7, opacity: 0, y: 50, filter: 'blur(5px)', ease: 'power2.in',
                scrollTrigger: { trigger: '[data-journey-header]', start: 'top 30%', end: 'top -15%', scrub: 0.6 }
            }
        );

        if (!isMobile) {
            gsap.utils.toArray('.tl-row').forEach(row => {
                gsap.to(row, {
                    opacity: 1,
                    x: 0,
                    duration: 0.75,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: row,
                        start: 'top 88%',
                        once: true,
                        onEnter: () => row.classList.add('tl-active')
                    }
                });
            });
        }

        (function setupCenterLine() {
            const wrap = document.getElementById('tl-center-wrap');
            const fill = document.getElementById('tl-center-fill');
            const tip = document.getElementById('tl-center-tip');
            if (!wrap || !fill || !tip) return;

            ScrollTrigger.create({
                trigger: wrap,
                start: 'top 72%',
                once: true,
                onEnter: () => gsap.to(tip, { opacity: 1, duration: 0.5, ease: 'power2.out' }),
            });

            ScrollTrigger.create({
                trigger: wrap,
                start: 'top 48%',
                end: 'bottom 32%',
                onUpdate: self => {
                    const pct = self.progress * 100;
                    fill.style.height = pct + '%';
                    tip.style.top = pct + '%';
                }
            });
        })();

        function tlSpot(card, e) {
            card.style.setProperty('--mx', e.offsetX + 'px');
            card.style.setProperty('--my', e.offsetY + 'px');
        }
        window.tlSpot = tlSpot;

        if (!isMobile) {
            gsap.to('[data-contact-header]', {
                opacity: 1, y: 0, duration: 1, ease: 'power3.out',
                scrollTrigger: { trigger: '[data-contact-header]', start: 'top 85%', once: true }
            });

            gsap.to('[data-contact-info]', {
                opacity: 1, x: 0, filter: 'blur(0px)', duration: 1, ease: 'power3.out',
                scrollTrigger: { trigger: '[data-contact-info]', start: 'top 85%', once: true }
            });

            gsap.to('[data-contact-form]', {
                opacity: 1, x: 0, filter: 'blur(0px)', duration: 1, ease: 'power3.out',
                scrollTrigger: { trigger: '[data-contact-form]', start: 'top 85%', once: true }
            });
        }

        (function initParticles() {
            const container = document.getElementById('particle-container');
            if (!container) return;
            const fragment = document.createDocumentFragment();
            for (let i = 0; i < 100; i++) {
                const span = document.createElement('span');
                span.classList.add('particle');
                span.style.setProperty('--dim', `${3 + Math.random() * 6}rem`);
                span.style.setProperty('--uplift', `${10 + Math.random() * 15}rem`);
                span.style.setProperty('--pos-x', `${Math.random() * 100}%`);
                span.style.setProperty('--dur', `${3 + Math.random() * 3}s`);
                span.style.setProperty('--delay', `${-1 * Math.random() * 10}s`);
                fragment.appendChild(span);
            }
            container.appendChild(fragment);
        })();

        function setOrbit() {
            const frame = document.querySelector('.photo-frame');
            const orbit = document.querySelector('.photo-orbit');
            if (!frame || !orbit) return;

            const rect = frame.getBoundingClientRect();
            const orbitRect = orbit.getBoundingClientRect();
            const pad = 20;
            const W = rect.width + pad * 2;
            const H = rect.height + pad * 2;
            const ox = rect.left - orbitRect.left - pad;
            const oy = rect.top - orbitRect.top - pad;

            const ns = 'http://www.w3.org/2000/svg';
            const svg = document.createElementNS(ns, 'svg');
            svg.setAttribute('class', 'orbital-svg');
            svg.style.cssText = `position:absolute;left:${ox}px;top:${oy}px;width:${W}px;height:${H}px;overflow:visible;pointer-events:none;`;
            svg.setAttribute('viewBox', `0 0 ${W} ${H}`);

            const defs = document.createElementNS(ns, 'defs');
            const path = document.createElementNS(ns, 'path');
            path.setAttribute('id', 'orbit-path');
            path.setAttribute('d', `M 0,0 L ${W},0 L ${W},${H} L 0,${H} Z`);
            defs.appendChild(path);
            svg.appendChild(defs);

            const labels = [
                '• ZESCRA HENDRIC',
                '• WEB PROGRAMMER',
                '• MC SERVER DEV',
                '• STIKOM BALI',
            ];

            const repeatCount = window.innerWidth <= 780 ? 7 : (window.innerWidth <= 900 ? 5 : 12);
            const repeated = Array.from({ length: repeatCount }, (_, i) => labels[i % labels.length]).join(' ');

            function makeTextPath(id) {
                const t = document.createElementNS(ns, 'text');
                const tp = document.createElementNS(ns, 'textPath');
                tp.setAttribute('id', id);
                tp.setAttribute('href', '#orbit-path');
                tp.setAttribute('startOffset', '0px');
                tp.textContent = repeated;
                t.appendChild(tp);
                svg.appendChild(t);
                return tp;
            }

            const tp1 = makeTextPath('tp1');
            const tp2 = makeTextPath('tp2');
            orbit.appendChild(svg);

            const perimeter = path.getTotalLength();
            let pxOffset = 0, paused = false;

            orbit.addEventListener('mouseenter', () => paused = true);
            orbit.addEventListener('mouseleave', () => paused = false);

            function tick() {
                if (!paused) pxOffset = (pxOffset + 0.9) % perimeter;
                tp1.setAttribute('startOffset', pxOffset + 'px');
                tp2.setAttribute('startOffset', (pxOffset - perimeter) + 'px');
                requestAnimationFrame(tick);
            }
            tick();
        }

        const EMAILJS_PUBLIC_KEY  = 'NiED7ON2lv5Ar0J9M';
        const EMAILJS_SERVICE_ID  = 'service_1qj0ehw';
        const EMAILJS_TEMPLATE_ID = 'template_wyd291g';

        emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

        const form       = document.getElementById('contactForm');
        const submitBtn  = document.getElementById('cfSubmit');
        const toast      = document.getElementById('cfToast');

        const fields = {
            from_name  : { el: document.getElementById('cf-name'),    err: document.getElementById('err-name'),    label: 'Name'    },
            from_email : { el: document.getElementById('cf-email'),   err: document.getElementById('err-email'),   label: 'Email'   },
            subject    : { el: document.getElementById('cf-subject'),  err: document.getElementById('err-subject'),  label: 'Subject' },
            message    : { el: document.getElementById('cf-message'), err: document.getElementById('err-message'), label: 'Message' },
        };

        function validateEmail(v) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        }

        function validate() {
            let ok = true;
            Object.entries(fields).forEach(([key, f]) => {
                const val = f.el.value.trim();
                f.el.classList.remove('cf-error');
                f.err.textContent = '';

                if (!val) {
                    f.err.textContent = `${f.label} is required.`;
                    f.el.classList.add('cf-error');
                    ok = false;
                } else if (key === 'from_email' && !validateEmail(val)) {
                    f.err.textContent = 'Please enter a valid email.';
                    f.el.classList.add('cf-error');
                    ok = false;
                }
            });
            return ok;
        }

        Object.values(fields).forEach(({ el, err }) => {
            el.addEventListener('input', () => {
                el.classList.remove('cf-error');
                err.textContent = '';
            });
        });

        function showToast(msg, type) {
            toast.textContent = msg;
            toast.className   = `cf-toast ${type} show`;
            clearTimeout(toast._timer);
            toast._timer = setTimeout(() => {
                toast.classList.remove('show');
            }, 5000);
        }

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!validate()) return;

            submitBtn.disabled = true;
            submitBtn.classList.add('loading');
            toast.classList.remove('show');

            try {
                await emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, form);
                showToast('Message sent! I`ll get back to you soon.', 'success');
                form.reset();
            } catch (err) {
                console.error('EmailJS error:', err);
                showToast('Failed to send. Please try again or email me directly.', 'error');
            } finally {
                submitBtn.disabled = false;
                submitBtn.classList.remove('loading');
            }
        });

        document.fonts.ready.then(() => {
            setTimeout(() => {
                setOrbit();
                ScrollTrigger.refresh();
            }, 150);
        });