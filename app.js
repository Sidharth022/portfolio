/**
 * SIDHARTH GAUR — CREATIVE DEVELOPER PORTFOLIO
 * Core JavaScript: Three.js 3D Hero, Card Tilt, Interactive Showcase, Modal & AJAX Contact
 */

document.addEventListener('DOMContentLoaded', () => {

    // ─── CHECK REDUCED MOTION ──────────────────────────────────────────
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Initialize Lucide icons
    if (window.lucide) {
        lucide.createIcons();
    }

    // ─── 0. THEME SWITCHER CONTROLLER (LIGHT & DARK MODE) ────────────
    initThemeSwitcher();

    function initThemeSwitcher() {
        const themeBtn = document.getElementById('themeToggleBtn');
        const mobileThemeBtn = document.getElementById('mobileThemeToggleBtn');

        function toggleTheme() {
            const current = document.documentElement.getAttribute('data-theme') || 'dark';
            const next = current === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', next);
            localStorage.setItem('sg_portfolio_theme', next);

            if (window.updateThreeJsTheme) {
                window.updateThreeJsTheme(next);
            }
        }

        if (themeBtn) themeBtn.addEventListener('click', toggleTheme);
        if (mobileThemeBtn) mobileThemeBtn.addEventListener('click', toggleTheme);
    }

    // ─── 1. THREE.JS 3D ANIMATED HERO SCENE ───────────────────────────
    initThreeJsHero();

    function initThreeJsHero() {
        const canvas = document.getElementById('threejs-hero-canvas');
        if (!canvas || !window.THREE || prefersReducedMotion) return;

        const scene = new THREE.Scene();

        const camera = new THREE.PerspectiveCamera(
            60,
            canvas.clientWidth / canvas.clientHeight,
            0.1,
            1000
        );
        camera.position.z = 24;

        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            alpha: true,
            antialias: true,
            powerPreference: 'high-performance'
        });
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // 3D Geometry: Futuristic Wireframe Icosahedron & Particle Starfield
        const mainGroup = new THREE.Group();
        scene.add(mainGroup);

        // Inner glowing core
        const coreGeo = new THREE.IcosahedronGeometry(7.5, 2);
        const coreMat = new THREE.MeshBasicMaterial({
            color: 0x6366f1,
            wireframe: true,
            transparent: true,
            opacity: 0.28
        });
        const coreMesh = new THREE.Mesh(coreGeo, coreMat);
        mainGroup.add(coreMesh);

        // Surrounding orbital Torus Knot
        const knotGeo = new THREE.TorusKnotGeometry(9, 1.2, 100, 16);
        const knotMat = new THREE.MeshBasicMaterial({
            color: 0x06b6d4,
            wireframe: true,
            transparent: true,
            opacity: 0.16
        });
        const knotMesh = new THREE.Mesh(knotGeo, knotMat);
        mainGroup.add(knotMesh);

        // Particle Galaxy / Cloud
        const particleCount = 450;
        const particleGeo = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const scales = new Float32Array(particleCount);

        for (let i = 0; i < particleCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 45;
            positions[i + 1] = (Math.random() - 0.5) * 45;
            positions[i + 2] = (Math.random() - 0.5) * 35;
        }

        particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const particleMat = new THREE.PointsMaterial({
            color: 0xa5b4fc,
            size: 0.24,
            transparent: true,
            opacity: 0.65,
            blending: THREE.AdditiveBlending
        });

        const particleSystem = new THREE.Points(particleGeo, particleMat);
        scene.add(particleSystem);

        // Mouse Parallax
        let targetX = 0;
        let targetY = 0;
        let mouseX = 0;
        let mouseY = 0;

        window.addEventListener('mousemove', (e) => {
            const windowHalfX = window.innerWidth / 2;
            const windowHalfY = window.innerHeight / 2;
            targetX = (e.clientX - windowHalfX) * 0.001;
            targetY = (e.clientY - windowHalfY) * 0.001;
        }, { passive: true });

        // Resize handler
        window.addEventListener('resize', () => {
            if (!canvas) return;
            const width = canvas.clientWidth;
            const height = canvas.clientHeight;
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        });

        // Global theme updater for Three.js
        window.updateThreeJsTheme = function(theme) {
            if (theme === 'light') {
                coreMat.color.setHex(0x4f46e5);
                coreMat.opacity = 0.22;
                knotMat.color.setHex(0x0284c7);
                knotMat.opacity = 0.14;
                particleMat.color.setHex(0x6366f1);
                particleMat.opacity = 0.42;
            } else {
                coreMat.color.setHex(0x6366f1);
                coreMat.opacity = 0.28;
                knotMat.color.setHex(0x06b6d4);
                knotMat.opacity = 0.16;
                particleMat.color.setHex(0xa5b4fc);
                particleMat.opacity = 0.65;
            }
        };

        // Apply active theme to Three.js scene
        const currentActiveTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        window.updateThreeJsTheme(currentActiveTheme);

        // Animation Loop
        let clock = new THREE.Clock();

        function animate() {
            requestAnimationFrame(animate);

            const elapsedTime = clock.getElapsedTime();

            // Smooth mouse lerp
            mouseX += (targetX - mouseX) * 0.05;
            mouseY += (targetY - mouseY) * 0.05;

            // Geometry rotations
            coreMesh.rotation.x = elapsedTime * 0.12 + mouseY * 1.5;
            coreMesh.rotation.y = elapsedTime * 0.18 + mouseX * 1.5;

            knotMesh.rotation.x = -elapsedTime * 0.08 + mouseY * 2;
            knotMesh.rotation.z = elapsedTime * 0.1 + mouseX * 2;

            particleSystem.rotation.y = elapsedTime * 0.03 + mouseX * 0.5;
            particleSystem.rotation.x = elapsedTime * 0.02 + mouseY * 0.5;

            renderer.render(scene, camera);
        }

        animate();
    }

    // ─── 2. CUSTOM FLUID CURSOR ───────────────────────────────────────
    if (!prefersReducedMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        const dot = document.querySelector('.custom-cursor-dot');
        const ring = document.querySelector('.custom-cursor-ring');

        if (dot && ring) {
            let mouseX = window.innerWidth / 2;
            let mouseY = window.innerHeight / 2;
            let ringX = mouseX;
            let ringY = mouseY;

            window.addEventListener('mousemove', (e) => {
                mouseX = e.clientX;
                mouseY = e.clientY;
                dot.style.left = `${mouseX}px`;
                dot.style.top = `${mouseY}px`;
            }, { passive: true });

            function updateRing() {
                ringX += (mouseX - ringX) * 0.18;
                ringY += (mouseY - ringY) * 0.18;
                ring.style.left = `${ringX}px`;
                ring.style.top = `${ringY}px`;
                requestAnimationFrame(updateRing);
            }
            updateRing();

            // Magnetic / interactive hover targets
            const hoverTargets = document.querySelectorAll('a, button, .portfolio-project-card, .skill-bubble, .about-card-stat, input, textarea');
            hoverTargets.forEach((target) => {
                target.addEventListener('mouseenter', () => {
                    dot.classList.add('hovered');
                    ring.classList.add('hovered');
                });
                target.addEventListener('mouseleave', () => {
                    dot.classList.remove('hovered');
                    ring.classList.remove('hovered');
                });
            });
        }
    }

    // ─── 3. 3D CARD TILT INTERACTION ──────────────────────────────────
    init3DCardTilt();

    function init3DCardTilt() {
        if (prefersReducedMotion || !window.matchMedia('(hover: hover)').matches) return;

        const tiltElements = document.querySelectorAll('[data-tilt="true"]');

        tiltElements.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = ((y - centerY) / centerY) * -10;
                const rotateY = ((x - centerX) / centerX) * 10;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
            });
        });
    }

    // ─── 4. SCROLL PROGRESS & NAVBAR BEHAVIOR ─────────────────────────
    const scrollBar = document.querySelector('.scroll-indicator');
    const navbar = document.querySelector('.navbar');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;

        if (scrollBar) {
            scrollBar.style.width = `${progress}%`;
        }

        if (navbar) {
            if (scrollTop > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }

        // Active link tracking
        let currentSectionId = '';
        sections.forEach(sec => {
            const top = sec.offsetTop - 160;
            const height = sec.offsetHeight;
            if (scrollTop >= top && scrollTop < top + height) {
                currentSectionId = sec.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    }, { passive: true });

    // ─── 5. MOBILE MENU TOGGLE ─────────────────────────────────────────
    const hamburger = document.querySelector('.nav-hamburger');
    const mobileDrawer = document.querySelector('.mobile-nav-drawer');

    if (hamburger && mobileDrawer) {
        hamburger.addEventListener('click', () => {
            const isOpen = hamburger.classList.toggle('active');
            mobileDrawer.classList.toggle('open');
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });

        mobileDrawer.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                mobileDrawer.classList.remove('open');
                document.body.style.overflow = '';
            });
        });
    }

    // ─── 6. PROJECT DATA REPOSITORY (ACCURATE & RESEARCHED) ───────────
    const projectsDatabase = {
        fliply: {
            id: 'fliply',
            title: 'Fliply — Australian Property Flipping Platform',
            category: 'SaaS Platform / Custom CMS',
            client: 'International Client — Australia',
            liveUrl: 'https://fliply.com.au/',
            image: 'images/fliply.png',
            tags: ['Laravel', 'Custom CMS', 'SaaS', 'Australia', 'Featured'],
            tech: ['Laravel', 'PHP 8.2', 'MySQL', 'JavaScript (ES6)', 'Bootstrap 5', 'Custom CMS Engine', 'RESTful APIs', 'Stripe Billing'],
            stats: [
                { label: 'Client Origin', value: 'Australia' },
                { label: 'Platform Type', value: 'Property Flipping SaaS' },
                { label: 'Core Architecture', value: 'Laravel Custom CMS' },
                { label: 'Compliance Scope', value: 'All 8 Australian States' }
            ],
            description: 'Fliply is an all-in-one property flipping platform engineered specifically for Australian real estate investors and renovators. It guides users through the entire lifecycle of a deal — from quick initial feasibility computations and stamp duty modeling to renovation milestone tracking and financial settlement. By consolidating disparate spreadsheets and contracts into one cloud workspace, Fliply brings transparency and efficiency to high-stakes property transactions.',
            features: [
                'Automated Feasibility Engine: Rapid evaluation of acquisition margins, holding costs, and exit profits.',
                'State-Specific Stamp Duty & Cost Calculator: Accurate legal cost projections for NSW, VIC, QLD, WA, SA, TAS, ACT, and NT.',
                'Renovation Project Manager: Task boards, contractor quotes, and real-time budget burn-down tracking.',
                'Encrypted Document Vault: Secure storage for sales contracts, inspection reports, and building permits.',
                'Tiered Subscription Architecture: Deal Finder and All Access memberships with a 14-day automated trial.',
                'Australian Data Sovereignty: Cloud deployment optimized for low-latency Australian regional access.'
            ],
            contribution: 'Architected the core Laravel application with a purpose-built CMS backend. Implemented the mathematical feasibility calculation formulas, multi-tenant state logic, document management storage pipeline, and integrated recurring subscription billing via Stripe.'
        },
        oresome: {
            id: 'oresome',
            title: 'Oresome Products — Mining Safety & Drill Solutions',
            category: 'International Corporate / Product Catalog',
            client: 'International Client — Australia (Perth, WA)',
            liveUrl: 'https://www.oresomeproducts.com/',
            image: 'images/oresome.webp',
            tags: ['WordPress', 'WooCommerce', 'Australia', 'Mining'],
            tech: ['WordPress Core', 'PHP 8.x', 'Custom Theme', 'WooCommerce', 'SCSS', 'JavaScript', 'SAP Ariba Listing'],
            stats: [
                { label: 'Location', value: 'Perth, Western Australia' },
                { label: 'Industry', value: 'Mining & Civil Engineering' },
                { label: 'Specialty', value: 'Eco-Friendly Blast Consumables' },
                { label: 'Vendor Status', value: 'SAP Ariba Certified' }
            ],
            description: 'Oresome Products is an established Australian manufacturer supplying field-proven drill and blast consumables to tier-1 mining operators across the Pilbara, Goldfields, and Bowen Basin. Their engineering focus centers on replacing single-use petrochemical plastics with biodegradable bagasse alternatives without compromising explosive-yield containment or on-site safety.',
            features: [
                'Engineered Product Catalog: High-detail specs for patented items like LineSaver™, Varistem®, and RockStar™ primers.',
                'Compliance Documentation: Integrated technical data sheets meeting Australian Standard AS 2187.2:2008.',
                'SAP Ariba Integration: Direct enterprise procurement validation for multi-national mining houses.',
                'High-Visibility PPE & Equipment: Interactive showcase for blast sirens, solar beacons, and retrieval gear.',
                'Mobile-First Responsive Layout: Seamlessly browsable on tablets and rugged field hardware in remote mining camps.'
            ],
            contribution: 'Engineered a bespoke WordPress theme with custom post architectures for technical consumables, integrated WooCommerce for streamlined enterprise quotation workflows, and optimized asset delivery for remote field connectivity.'
        },
        w3cms: {
            id: 'w3cms',
            title: 'W3CMS — Enterprise Laravel Content Management System',
            category: 'SaaS / CMS Product',
            client: 'CodeCanyon Commercial Product',
            liveUrl: 'https://preview.codecanyon.net/item/w3cmslaravel-content-management-system/full_screen_preview/43147281',
            image: 'images/w3cms.jpg',
            tags: ['Laravel', 'Custom CMS', 'SaaS', 'Commercial'],
            tech: ['Laravel', 'PHP 8.x', 'MySQL', 'Blade Templating', 'Bootstrap 5', 'REST APIs', 'Role-Based Access Control'],
            stats: [
                { label: 'Marketplace', value: 'CodeCanyon Commercial' },
                { label: 'Tech Foundation', value: 'Laravel Clean Architecture' },
                { label: 'Licensing', value: 'Commercial CMS Product' },
                { label: 'Internationalization', value: 'Full RTL & Multi-Language' }
            ],
            description: 'W3CMS is a comprehensive enterprise-grade CMS product developed on Laravel. Built for agencies, software houses, and enterprises needing complete autonomy over their content workflow, W3CMS provides a dynamic modular block builder, theme switcher, granular permission governance, and comprehensive SEO control centers.',
            features: [
                'Dynamic Visual Page Builder: Compose complex landing pages using pre-engineered responsive UI blocks.',
                'Role-Based Access Control (RBAC): Fine-grained permission assignments for superadmins, editors, and contributors.',
                'Theme Lifecycle Manager: Install, preview, and switch frontend themes directly from the dashboard.',
                'Advanced Media Asset Repository: Batch upload, tag, and organize imagery, video, and documents.',
                'Built-in SEO Suite: Human-readable slug generation, canonical rules, OpenGraph meta, and automated XML sitemaps.',
                'Global Localization & RTL Support: Native bidirectional rendering for Arabic, Hebrew, and Asian scripts.'
            ],
            contribution: 'Developed core backend modules within Laravel including the page builder engine, theme switching subsystem, role-based permission policies, and optimized database indexing for enterprise page lookups.'
        },
        breakthrough: {
            id: 'breakthrough',
            title: 'Breakthrough India — Human Rights & Donation Platform',
            category: 'Custom WordPress & Payment Architecture',
            client: 'Nonprofit Organization — India',
            liveUrl: 'https://inbreakthrough.org/',
            image: 'images/breakthrough.jpg',
            tags: ['WordPress', 'Custom Plugin', 'Donations', 'Nonprofit'],
            tech: ['WordPress Core', 'PHP 8', 'Custom Donation Plugin', 'Payment Gateways', 'ACF Pro', 'REST API', '80G Tax Logic'],
            stats: [
                { label: 'Organization', value: 'Breakthrough Trust' },
                { label: 'Core Mission', value: 'Gender Equality & Human Rights' },
                { label: 'Key Innovation', value: 'Custom Multi-Tier Donation Engine' },
                { label: 'Tax Integration', value: 'Section 80G Compliant' }
            ],
            description: 'Breakthrough is a globally recognized human rights nonprofit that transforms cultural norms enabling gender violence and discrimination. The platform acts as the nerve center for nationwide outreach campaigns (like the renowned "Bell Bajao!" movement) and processes tax-exempt contributions from domestic and international donors.',
            features: [
                'Custom Donation Processing Engine: Multi-currency one-off and recurring donation flows.',
                'Instant 80G Tax Exemption Receipts: Automated generation and email delivery of compliant donation certificates.',
                'Campaign Storytelling Hubs: Media-rich interactive landing pages for adolescent rights and community mobilization.',
                'High-Concurrency Architecture: Engineered to sustain heavy viral traffic spikes during media broadcasts.',
                'Integrated Analytics: Real-time fundraising tracking dashboard for campaign coordinators.'
            ],
            contribution: 'Engineered the custom WordPress donation plugin from the ground up, implementing multiple secure payment gateways, automated tax exemption receipt generation, and high-performance caching for peak campaign broadcasts.'
        },
        pixoz: {
            id: 'pixoz',
            title: 'Pixoz — Modern Fashion eCommerce Ecosystem',
            category: 'Commercial WordPress / WooCommerce Theme',
            client: 'ThemeForest Commercial Product',
            liveUrl: 'https://pixoz.dexignzone.com/',
            image: 'images/pixoz.png',
            tags: ['WordPress', 'WooCommerce', 'Ecommerce', 'ThemeForest'],
            tech: ['WordPress', 'WooCommerce', 'Elementor', 'AJAX Live Search', 'Custom Theme Engine', 'SCSS', 'WPML'],
            stats: [
                { label: 'Marketplace', value: 'ThemeForest Premium' },
                { label: 'Target Sector', value: 'Luxury & Lifestyle Retail' },
                { label: 'Builder Support', value: 'Elementor Custom Addons' },
                { label: 'Search Speed', value: 'Real-Time AJAX Results' }
            ],
            description: 'Pixoz is a flagship luxury fashion and lifestyle eCommerce theme sold globally on ThemeForest. Crafted with a hyper-refined editorial aesthetic, it incorporates high-converting retail features such as real-time AJAX search, instant quick-view modals, swatch variants, and frictionless slide-out cart drawers.',
            features: [
                'Instant AJAX Predictive Search: Instantaneous product discovery with thumbnail previews as the user types.',
                'Product Quick-View Modal: Shoppers inspect garments, sizes, and colors without departing the catalog stream.',
                'Elementor Drag-and-Drop Widgets: Custom visual elements built specifically for fashion retail layouts.',
                'Multi-Currency & WPML Localization: Ready for international cross-border apparel merchandising.',
                'One-Click Demo Importer: Fully replicates complex showroom stores in seconds.'
            ],
            contribution: 'Architected the theme structure, coded custom WooCommerce hooks/filters for lightning-fast product rendering, built custom Elementor widgets, and implemented the client-side AJAX search and cart interactions.'
        },
        groutbuddy: {
            id: 'groutbuddy',
            title: 'Grout Buddy — Melbourne Trade & Restoration Specialist',
            category: 'International Client / Service Platform',
            client: 'International Client — Australia (Melbourne, VIC)',
            liveUrl: 'https://groutbuddy.com.au/',
            image: 'images/groutbuddy.webp',
            tags: ['WordPress', 'Service Business', 'Australia', 'Local SEO'],
            tech: ['WordPress', 'Custom Theme', 'PHP 8', 'JavaScript', 'Quote System', 'Local Schema SEO'],
            stats: [
                { label: 'Coverage Area', value: 'Melbourne Metro, VIC' },
                { label: 'Core Service', value: 'Tile & Leaking Shower Restoration' },
                { label: 'Lead Strategy', value: 'Interactive Obligation-Free Quote' },
                { label: 'Search Optimization', value: 'Suburban Victoria Geo-Targeted' }
            ],
            description: 'Grout Buddy is a premier Victorian trade specialist delivering precision tile regrouting, leaking shower structural repairs without demolition, and commercial floor rejuvenation. The platform is engineered to convert suburban homeowners and property managers into qualified quote requests.',
            features: [
                'Interactive Quote Funnel: Step-by-step diagnostic questionnaire allowing users to upload damage photos.',
                'Before & After Interactive Comparison: Visual proof of restoration results saving thousands over full retiling.',
                'Suburban Schema SEO: Geo-targeted landing pages boosting organic rank across Melbourne suburbs.',
                'Mobile-First Conversion Architecture: One-tap call and WhatsApp integrations for instant trade response.',
                'Rapid Page Load Performance: Core Web Vitals optimized for top performance on 4G mobile networks.'
            ],
            contribution: 'Engineered the custom WordPress business theme, developed the multi-step lead capture and quote calculation workflow, and implemented comprehensive local schema data that dramatically increased organic quote volume.'
        },
        jobzilla: {
            id: 'jobzilla',
            title: 'JobZilla — Advanced Recruitment & Job Portal Platform',
            category: 'Commercial WordPress / Recruitment Engine',
            client: 'ThemeForest Commercial Product',
            liveUrl: 'https://themeforest.net/item/jobzilla-job-board-wordpress-theme/42687241',
            image: 'images/jobzilla.jpg',
            tags: ['WordPress', 'Job Board', 'ThemeForest', 'Custom Plugin'],
            tech: ['WordPress', 'PHP 8', 'Elementor', 'WP Job Manager', 'Google Maps API', 'Stripe / PayPal', 'AJAX'],
            stats: [
                { label: 'Marketplace', value: 'ThemeForest Elite Product' },
                { label: 'Dual Dashboards', value: 'Candidates & Employers' },
                { label: 'Geolocation', value: 'Google Maps Places Autocomplete' },
                { label: 'Monetization', value: 'Paid Job Listing Packages' }
            ],
            description: 'JobZilla is an industry-leading WordPress job board platform engineered for employment agencies, recruiters, and career communities. Featuring separate portal dashboards for employers and job seekers, real-time AJAX location search with Google Maps, and monetization via paid listing packages.',
            features: [
                'Candidate Portal: Profile builder, multi-resume management, application history tracking, and job bookmarks.',
                'Employer Dashboard: Post openings, screen candidate applications, and schedule interview stages.',
                'Real-Time AJAX Job Filtering: Instant filtering across salary brackets, remote/onsite status, and industry sectors.',
                'Google Maps Places Integration: Auto-suggest location detection and interactive map-pin clustering.',
                'Monetization & Listing Packages: Integrated Stripe and PayPal checkouts for sponsored and featured job placements.'
            ],
            contribution: 'Developed the front-end candidate/employer dashboards, custom Elementor widgets, Google Maps integration logic, and AJAX filtering architecture for the commercial ThemeForest release.'
        }
    };

    const projectKeys = Object.keys(projectsDatabase);

    // ─── 7. INTERACTIVE CATEGORY FILTERING ────────────────────────────
    const filterButtons = document.querySelectorAll('.filter-tab-btn');
    const projectCards = document.querySelectorAll('.portfolio-project-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.dataset.filter;

            projectCards.forEach(card => {
                const cardTags = card.dataset.tags || '';
                if (filterValue === 'all' || cardTags.includes(filterValue)) {
                    card.style.display = 'flex';
                    if (!prefersReducedMotion) {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(16px)';
                        setTimeout(() => {
                            card.style.transition = 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 50);
                    }
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // ─── 8. PROJECT MODAL CONTROLLER (ACCESSIBLE & KEYBOARD) ──────────
    const modalBackdrop = document.querySelector('.project-modal-backdrop');
    const modalContainer = document.querySelector('.project-modal-container');
    const modalCloseBtn = document.querySelector('#modal-close-trigger');
    const modalPrevBtn = document.querySelector('#modal-prev-trigger');
    const modalNextBtn = document.querySelector('#modal-next-trigger');

    let currentProjectIndex = 0;

    function openModalForProject(projectId) {
        const project = projectsDatabase[projectId];
        if (!project) return;

        currentProjectIndex = projectKeys.indexOf(projectId);
        renderModalContent(project);

        modalBackdrop.classList.add('active');
        document.body.style.overflow = 'hidden';
        modalContainer.scrollTop = 0;

        if (modalCloseBtn) modalCloseBtn.focus();
    }

    function closeModal() {
        modalBackdrop.classList.remove('active');
        document.body.style.overflow = '';
    }

    function renderModalContent(p) {
        // Mockup visual banner
        const bannerContainer = document.querySelector('#modal-banner-display');
        if (bannerContainer) {
            bannerContainer.innerHTML = `
                <div class="browser-chrome-mockup" style="position:absolute; top:16px; left:20px; right:20px; z-index:4;">
                    <div class="browser-dot red"></div>
                    <div class="browser-dot yellow"></div>
                    <div class="browser-dot green"></div>
                    <div class="browser-url-pill">${p.liveUrl}</div>
                </div>
                <img class="modal-banner-img" src="${p.image}" alt="${p.title}" onerror="this.parentElement.style.background='linear-gradient(135deg, #12121c, #1f1f2e)'">
                <div class="project-media-gradient-overlay"></div>
            `;
        }

        // Title & Badges
        const tagsContainer = document.querySelector('#modal-tags-display');
        if (tagsContainer) {
            tagsContainer.innerHTML = p.tags.map(t => `<span class="badge-tag highlight-primary">${t}</span>`).join('');
        }

        const titleEl = document.querySelector('#modal-title-display');
        if (titleEl) titleEl.textContent = p.title;

        // Client info stat bar
        const statsContainer = document.querySelector('#modal-stats-display');
        if (statsContainer) {
            statsContainer.innerHTML = p.stats.map(s => `
                <div class="modal-client-stat">
                    <span class="modal-client-stat-label">${s.label}</span>
                    <span class="modal-client-stat-value">${s.value}</span>
                </div>
            `).join('');
        }

        // Rich description
        const descEl = document.querySelector('#modal-desc-display');
        if (descEl) descEl.textContent = p.description;

        // Key Features List
        const featuresContainer = document.querySelector('#modal-features-display');
        if (featuresContainer) {
            featuresContainer.innerHTML = p.features.map(f => `
                <div class="modal-feature-item">
                    <i data-lucide="check-circle-2"></i>
                    <span>${f}</span>
                </div>
            `).join('');
        }

        // Tech stack tags
        const techContainer = document.querySelector('#modal-tech-display');
        if (techContainer) {
            techContainer.innerHTML = p.tech.map(t => `<span class="modal-tech-badge">${t}</span>`).join('');
        }

        // Sidharth's Contribution
        const contributionEl = document.querySelector('#modal-contribution-display');
        if (contributionEl) contributionEl.textContent = p.contribution;

        // Live URL Button
        const liveBtn = document.querySelector('#modal-live-btn');
        if (liveBtn) {
            liveBtn.setAttribute('href', p.liveUrl);
        }

        // Refresh icons inside modal
        if (window.lucide) {
            lucide.createIcons();
        }
    }

    // Modal navigation
    function navigateModal(direction) {
        currentProjectIndex += direction;
        if (currentProjectIndex < 0) currentProjectIndex = projectKeys.length - 1;
        if (currentProjectIndex >= projectKeys.length) currentProjectIndex = 0;

        const nextProjectId = projectKeys[currentProjectIndex];
        renderModalContent(projectsDatabase[nextProjectId]);
        modalContainer.scrollTop = 0;
    }

    // Attach click events on project cards
    document.querySelectorAll('.portfolio-project-card').forEach(card => {
        card.addEventListener('click', () => {
            const projectId = card.dataset.project;
            openModalForProject(projectId);
        });

        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const projectId = card.dataset.project;
                openModalForProject(projectId);
            }
        });
    });

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    if (modalPrevBtn) modalPrevBtn.addEventListener('click', () => navigateModal(-1));
    if (modalNextBtn) modalNextBtn.addEventListener('click', () => navigateModal(1));

    // Backdrop click close
    if (modalBackdrop) {
        modalBackdrop.addEventListener('click', (e) => {
            if (e.target === modalBackdrop) closeModal();
        });
    }

    // Keyboard controls
    document.addEventListener('keydown', (e) => {
        if (!modalBackdrop || !modalBackdrop.classList.contains('active')) return;

        if (e.key === 'Escape') {
            closeModal();
        } else if (e.key === 'ArrowLeft') {
            navigateModal(-1);
        } else if (e.key === 'ArrowRight') {
            navigateModal(1);
        }
    });

    // ─── 9. FULLY OPERATIONAL CONTACT FORM (FORMSUBMIT AJAX) ───────────
    const contactForm = document.getElementById('portfolioContactForm');
    const submitBtn = document.getElementById('contactSubmitBtn');
    const feedbackBox = document.getElementById('contactFeedbackBox');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Clear previous errors
            clearFormErrors();

            const nameInput = document.getElementById('contactName');
            const emailInput = document.getElementById('contactEmail');
            const messageInput = document.getElementById('contactMessage');
            const honeypot = document.getElementById('contactHoney');

            let isValid = true;

            // Honeypot spam trap
            if (honeypot && honeypot.value.trim() !== '') {
                return; // Silent abort for bots
            }

            // Name check
            if (!nameInput.value.trim()) {
                markFieldError(nameInput, 'Please enter your full name.');
                isValid = false;
            }

            // Email check
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailInput.value.trim() || !emailPattern.test(emailInput.value.trim())) {
                markFieldError(emailInput, 'Please enter a valid business email address.');
                isValid = false;
            }

            // Message check
            if (!messageInput.value.trim() || messageInput.value.trim().length < 10) {
                markFieldError(messageInput, 'Please enter a brief message (at least 10 characters).');
                isValid = false;
            }

            if (!isValid) return;

            // Set loading state
            setButtonState(true);

            try {
                const formData = new FormData(contactForm);

                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    showFeedback('success', '✓ Thank you! Your message has been sent directly to Sidharth. I will respond within 24 hours.');
                    contactForm.reset();
                } else {
                    throw new Error('Server returned error response');
                }
            } catch (err) {
                showFeedback('error', '⚠️ Network issue submitting via form. Please email Sidharth directly at: sidharthgaur.dev@gmail.com');
            } finally {
                setButtonState(false);
            }
        });

        // Real-time error dismissal on input
        contactForm.querySelectorAll('input, textarea').forEach(field => {
            field.addEventListener('input', () => {
                field.classList.remove('field-error');
                const errLabel = field.parentElement.querySelector('.validation-error-hint');
                if (errLabel) errLabel.classList.remove('active');
            });
        });
    }

    function markFieldError(inputElement, msg) {
        inputElement.classList.add('field-error');
        const hint = inputElement.parentElement.querySelector('.validation-error-hint');
        if (hint) {
            hint.textContent = msg;
            hint.classList.add('active');
        }
    }

    function clearFormErrors() {
        document.querySelectorAll('.field-error').forEach(el => el.classList.remove('field-error'));
        document.querySelectorAll('.validation-error-hint').forEach(el => el.classList.remove('active'));
        if (feedbackBox) {
            feedbackBox.className = 'contact-status-feedback';
            feedbackBox.style.display = 'none';
        }
    }

    function setButtonState(isLoading) {
        if (!submitBtn) return;
        submitBtn.disabled = isLoading;
        if (isLoading) {
            submitBtn.classList.add('is-submitting');
            submitBtn.innerHTML = `
                <span style="display:inline-flex; align-items:center; gap:8px;">
                    <svg style="animation:spin 1s linear infinite; width:18px; height:18px;" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <circle cx="12" cy="12" r="10" stroke-width="4" stroke="rgba(255,255,255,0.3)"></circle>
                        <path d="M12 2a10 10 0 0 1 10 10" stroke-width="4" stroke="#ffffff"></path>
                    </svg>
                    Sending Message...
                </span>
            `;
        } else {
            submitBtn.classList.remove('is-submitting');
            submitBtn.innerHTML = `
                <span>Send Message</span>
                <i data-lucide="arrow-right" style="width:16px;height:16px;"></i>
            `;
            if (window.lucide) lucide.createIcons();
        }
    }

    function showFeedback(type, text) {
        if (!feedbackBox) return;
        feedbackBox.className = `contact-status-feedback ${type}`;
        feedbackBox.textContent = text;
        feedbackBox.style.display = 'block';
    }

    // ─── 10. GSAP SCROLL ENHANCEMENTS ──────────────────────────────────
    if (window.gsap && window.ScrollTrigger && !prefersReducedMotion) {
        gsap.registerPlugin(ScrollTrigger);

        // Smooth header text entrance
        gsap.from('.hero-headline', {
            opacity: 0,
            y: 40,
            duration: 1.1,
            ease: 'power3.out',
            delay: 0.2
        });

        gsap.from('.hero-role-title', {
            opacity: 0,
            y: 25,
            duration: 0.9,
            ease: 'power3.out',
            delay: 0.4
        });

        gsap.from('.hero-bio', {
            opacity: 0,
            y: 25,
            duration: 0.9,
            ease: 'power3.out',
            delay: 0.55
        });

        gsap.from('.hero-actions-group', {
            opacity: 0,
            y: 25,
            duration: 0.8,
            ease: 'power3.out',
            delay: 0.7
        });

        gsap.from('.hero-portrait-card-wrapper', {
            opacity: 0,
            scale: 0.92,
            duration: 1.2,
            ease: 'power3.out',
            delay: 0.4
        });

        // Stagger project cards on scroll
        ScrollTrigger.batch('.portfolio-project-card', {
            onEnter: (elements) => {
                gsap.fromTo(elements,
                    { opacity: 0, y: 35 },
                    { opacity: 1, y: 0, duration: 0.7, stagger: 0.15, ease: 'power3.out' }
                );
            },
            start: 'top 88%'
        });
    }

});
