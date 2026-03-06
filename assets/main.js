        // Theme management
        let currentTheme = localStorage.getItem('theme') || 'dark';
        
        function initializeTheme() {
            document.documentElement.setAttribute('data-theme', currentTheme);
            updateThemeIcon();
        }

        function toggleTheme() {
            currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', currentTheme);
            localStorage.setItem('theme', currentTheme);
            updateThemeIcon();
            
            // Show notification
            const themeName = currentTheme === 'dark' ? 'Oscuro' : 'Claro';
            showNotification(`Tema cambiado a: ${themeName}`);
        }

        function updateThemeIcon() {
            const icon = document.getElementById('theme-icon');
            if (currentTheme === 'dark') {
                icon.className = 'fas fa-moon';
            } else {
                icon.className = 'fas fa-sun';
            }
        }

        // Initialize theme on load
        document.addEventListener('DOMContentLoaded', function() {
            initializeTheme();
        });

        // Initialize AOS
        AOS.init({
            duration: 1000,
            easing: 'ease-in-out',
            once: true,
            mirror: false
        });

        // Mobile Sidebar Toggle
        function toggleSidebar() {
            const sidebar = document.getElementById('sidebar');
            sidebar.classList.toggle('active');
        }

        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', function(e) {
            const sidebar = document.getElementById('sidebar');
            const toggle = document.querySelector('.mobile-toggle');
            
            if (window.innerWidth <= 968 && !sidebar.contains(e.target) && !toggle.contains(e.target)) {
                sidebar.classList.remove('active');
            }
        });

        // Active Navigation Link
        function setActive(element) {
            // Remove active class from all links
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
            });
            
            // Add active class to clicked link
            element.classList.add('active');
            
            // Close sidebar on mobile after clicking
            if (window.innerWidth <= 968) {
                document.getElementById('sidebar').classList.remove('active');
            }
        }

        // Smooth Scrolling for Navigation Links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 100;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Scroll to Top Button
        const scrollTopBtn = document.querySelector('.scroll-top');

        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }

            // Update active navigation based on scroll position
            updateActiveNavigation();
        });

        function scrollToTop() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }

        // Update Active Navigation Based on Scroll
        function updateActiveNavigation() {
            const sections = document.querySelectorAll('.section');
            const navLinks = document.querySelectorAll('.nav-link');
            
            let current = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 150;
                if (window.pageYOffset >= sectionTop) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + current) {
                    link.classList.add('active');
                }
            });
        }

        // Discord Contact Function
        function openDiscord() {
            const discordUsername = '@srpatoac';
            
            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(discordUsername).then(() => {
                    showNotification('Discord copiado al portapapeles: ' + discordUsername);
                }).catch(() => {
                    showNotification('Discord: ' + discordUsername);
                });
            } else {
                const textArea = document.createElement('textarea');
                textArea.value = discordUsername;
                document.body.appendChild(textArea);
                textArea.select();
                try {
                    document.execCommand('copy');
                    showNotification('Discord copiado al portapapeles: ' + discordUsername);
                } catch (err) {
                    showNotification('Discord: ' + discordUsername);
                }
                document.body.removeChild(textArea);
            }
        }

        // Download CV Function
        function downloadCV() {
            // Hide elements that shouldn't appear in PDF
            const elementsToHide = [
                '.sidebar',
                '.mobile-toggle',
                '.scroll-top',
                '.bg-animation',
                '.bg-particles',
                '.theme-toggle'
            ];
            
            elementsToHide.forEach(selector => {
                const elements = document.querySelectorAll(selector);
                elements.forEach(el => el.style.display = 'none');
            });

            // Adjust main content for printing
            const mainContent = document.querySelector('.main-content');
            const originalMargin = mainContent.style.marginLeft;
            mainContent.style.marginLeft = '0';
            mainContent.style.padding = '20px';

            // Trigger print dialog
            window.print();

            // Restore original styles after printing
            setTimeout(() => {
                elementsToHide.forEach(selector => {
                    const elements = document.querySelectorAll(selector);
                    elements.forEach(el => el.style.display = '');
                });
                mainContent.style.marginLeft = originalMargin;
                mainContent.style.padding = '3rem';
            }, 1000);
        }

        // Load profile image from uploaded file
        async function loadProfileImage() {
            try {
                const profileImg = document.querySelector('.profile-img');
                const fileData = await window.fs.readFile('improved_cv.html', { encoding: 'utf8'});
                
                // Extract base64 image from the uploaded file if it exists
                const base64Match = fileData.match(/data:image\/[^;]+;base64,[^"']+/);
                if (base64Match) {
                    profileImg.style.backgroundImage = `url('${base64Match[0]}')`;
                    profileImg.innerHTML = ''; // Remove the icon
                }
            } catch (error) {
                // If file reading fails, keep the default avatar
                console.log('Using default avatar');
            }
        }

        // Notification System
        function showNotification(message) {
            // Remove existing notifications
            document.querySelectorAll('.notification').forEach(n => n.remove());
            
            // Create notification element
            const notification = document.createElement('div');
            notification.className = 'notification';
            notification.textContent = message;
            
            // Get theme-aware colors
            const isDark = currentTheme === 'dark';
            const bgColor = isDark ? 'linear-gradient(45deg, #06b6d4, #4f46e5)' : 'linear-gradient(45deg, #3b82f6, #6366f1)';
            const shadowColor = isDark ? 'rgba(6, 182, 212, 0.4)' : 'rgba(59, 130, 246, 0.4)';
            
            notification.style.cssText = `
                position: fixed;
                top: 6rem;
                right: 2rem;
                background: ${bgColor};
                color: white;
                padding: 1.2rem 2rem;
                border-radius: 20px;
                z-index: 9999;
                font-family: 'Poppins', sans-serif;
                font-weight: 500;
                font-size: 0.95rem;
                box-shadow: 0 15px 40px ${shadowColor};
                transform: translateX(400px);
                transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.2);
                max-width: 300px;
            `;

            document.body.appendChild(notification);

            // Animate in
            setTimeout(() => {
                notification.style.transform = 'translateX(0)';
            }, 100);

            // Remove after delay
            setTimeout(() => {
                notification.style.transform = 'translateX(400px)';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 400);
            }, 3500);
        }

        // Enhanced Loading Animation
        window.addEventListener('load', function() {
            // Load profile image
            loadProfileImage();
            
            document.body.style.opacity = '0';
            document.body.style.transition = 'opacity 1s ease';
            
            setTimeout(() => {
                document.body.style.opacity = '1';
                
                // Stagger animation for nav items
                const navItems = document.querySelectorAll('.nav-item');
                navItems.forEach((item, index) => {
                    item.style.opacity = '0';
                    item.style.transform = 'translateX(-50px)';
                    item.style.transition = 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                    
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateX(0)';
                    }, (index + 1) * 200);
                });

                // Enhanced typing effect for header title
                const headerTitle = document.querySelector('.header h1');
                if (headerTitle) {
                    const text = headerTitle.textContent;
                    headerTitle.textContent = '';
                    headerTitle.style.borderRight = '3px solid var(--accent-primary)';
                    
                    let i = 0;
                    const typeWriter = () => {
                        if (i < text.length) {
                            headerTitle.textContent += text.charAt(i);
                            i++;
                            setTimeout(typeWriter, 80);
                        } else {
                            setTimeout(() => {
                                headerTitle.style.borderRight = 'none';
                            }, 1500);
                        }
                    };
                    setTimeout(typeWriter, 1500);
                }

                // Profile image entrance animation
                const profileImg = document.querySelector('.profile-img');
                if (profileImg) {
                    profileImg.style.transform = 'scale(0) rotate(180deg)';
                    profileImg.style.transition = 'all 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
                    
                    setTimeout(() => {
                        profileImg.style.transform = 'scale(1) rotate(0deg)';
                    }, 800);
                }
            }, 200);
        });

        // Intersection Observer for enhanced animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '-50px 0px'
        };

        const animateOnScroll = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    
                    // Add specific animations based on element type
                    if (target.classList.contains('section-title')) {
                        target.style.animation = 'titleSlideIn 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                    }
                    
                    if (target.classList.contains('glass-card')) {
                        target.style.animation = 'cardSlideUp 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                    }
                    
                    if (target.classList.contains('achievement-card')) {
                        const delay = Array.from(target.parentNode.children).indexOf(target) * 150;
                        target.style.animation = `cardBounceIn 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) ${delay}ms both`;
                    }
                    
                    if (target.classList.contains('skill-card')) {
                        const delay = Array.from(target.parentNode.children).indexOf(target) * 200;
                        target.style.animation = `skillFlipIn 0.9s cubic-bezier(0.175, 0.885, 0.32, 1.275) ${delay}ms both`;
                    }

                    if (target.classList.contains('education-card')) {
                        const delay = Array.from(target.parentNode.children).indexOf(target) * 180;
                        target.style.animation = `educationSlideIn 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) ${delay}ms both`;
                    }
                    
                    if (target.classList.contains('server-item')) {
                        const delay = Array.from(target.parentNode.children).indexOf(target) * 80;
                        target.style.animation = `serverSlideIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) ${delay}ms both`;
                    }
                }
            });
        }, observerOptions);

        // Observe elements for animations
        document.addEventListener('DOMContentLoaded', function() {
            document.querySelectorAll('.section-title, .glass-card, .achievement-card, .skill-card, .education-card, .server-item').forEach(el => {
                animateOnScroll.observe(el);
            });
        });

        // Enhanced scroll-based navigation updates
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    const correspondingLink = document.querySelector(`.nav-link[href="#${id}"]`);
                    
                    if (correspondingLink) {
                        document.querySelectorAll('.nav-link').forEach(link => {
                            link.classList.remove('active');
                        });
                        correspondingLink.classList.add('active');
                    }
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '-20% 0px -60% 0px'
        });

        // Observe all sections
        document.addEventListener('DOMContentLoaded', function() {
            document.querySelectorAll('.section').forEach(section => {
                observer.observe(section);
            });
        });

        // Handle resize events
        window.addEventListener('resize', function() {
            const sidebar = document.getElementById('sidebar');
            if (window.innerWidth > 968) {
                sidebar.classList.remove('active');
            }
        });

        // Add scroll animation styles
        const scrollAnimationStyles = document.createElement('style');
        scrollAnimationStyles.textContent = `
            @keyframes titleSlideIn {
                0% { opacity: 0; transform: translateY(60px) scale(0.8); }
                100% { opacity: 1; transform: translateY(0) scale(1); }
            }
            
            @keyframes cardSlideUp {
                0% { opacity: 0; transform: translateY(50px) rotateX(25deg); }
                100% { opacity: 1; transform: translateY(0) rotateX(0deg); }
            }
            
            @keyframes cardBounceIn {
                0% { opacity: 0; transform: scale(0.3) rotateY(-180deg); }
                50% { opacity: 0.8; transform: scale(1.1) rotateY(-90deg); }
                100% { opacity: 1; transform: scale(1) rotateY(0deg); }
            }
            
            @keyframes skillFlipIn {
                0% { opacity: 0; transform: rotateY(-90deg) translateZ(-100px); }
                50% { opacity: 0.5; transform: rotateY(-45deg) translateZ(-50px); }
                100% { opacity: 1; transform: rotateY(0deg) translateZ(0px); }
            }

            @keyframes educationSlideIn {
                0% { opacity: 0; transform: translateY(80px) rotateX(20deg); }
                100% { opacity: 1; transform: translateY(0) rotateX(0deg); }
            }
            
            @keyframes serverSlideIn {
                0% { opacity: 0; transform: translateX(-120px) rotate(-15deg); }
                100% { opacity: 1; transform: translateX(0) rotate(0deg); }
            }
            
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(scrollAnimationStyles);

        // Keyboard navigation support
        document.addEventListener('keydown', function(e) {
            // Theme toggle with 'T' key
            if (e.key.toLowerCase() === 't' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                toggleTheme();
            }
            
            // Scroll to top with 'Home' key
            if (e.key === 'Home') {
                e.preventDefault();
                scrollToTop();
            }
        });

        // Touch gestures for mobile
        let touchStartY = 0;
        let touchEndY = 0;

        document.addEventListener('touchstart', function(e) {
            touchStartY = e.changedTouches[0].screenY;
        }, { passive: true });

        document.addEventListener('touchend', function(e) {
            touchEndY = e.changedTouches[0].screenY;
            handleSwipe();
        }, { passive: true });

        function handleSwipe() {
            const swipeDistance = touchStartY - touchEndY;
            const minSwipeDistance = 100;
            
            // Swipe up to show scroll-to-top button earlier on mobile
            if (swipeDistance > minSwipeDistance && window.pageYOffset > 200) {
                scrollTopBtn.classList.add('visible');
            }
        }

        // Performance optimization: Throttle scroll events
        let scrollTimeout;
        let isScrolling = false;

        function throttleScroll() {
            if (!isScrolling) {
                window.requestAnimationFrame(function() {
                    updateActiveNavigation();
                    
                    if (window.pageYOffset > 300) {
                        scrollTopBtn.classList.add('visible');
                    } else {
                        scrollTopBtn.classList.remove('visible');
                    }
                    
                    isScrolling = false;
                });
                isScrolling = true;
            }
        }

        window.addEventListener('scroll', throttleScroll, { passive: true });

        // Enhanced accessibility
        function announceThemeChange(theme) {
            const announcement = document.createElement('div');
            announcement.setAttribute('aria-live', 'polite');
            announcement.setAttribute('aria-atomic', 'true');
            announcement.style.position = 'absolute';
            announcement.style.left = '-10000px';
            announcement.style.width = '1px';
            announcement.style.height = '1px';
            announcement.style.overflow = 'hidden';
            
            const themeName = theme === 'dark' ? 'oscuro' : 'claro';
            announcement.textContent = `Tema cambiado a ${themeName}`;
            
            document.body.appendChild(announcement);
            
            setTimeout(() => {
                document.body.removeChild(announcement);
            }, 1000);
        }

        // Update toggle theme function to include accessibility
        const originalToggleTheme = toggleTheme;
        toggleTheme = function() {
            originalToggleTheme();
            announceThemeChange(currentTheme);
        };

        // Prevent theme toggle animation on page load
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(() => {
                document.body.classList.add('theme-transitions-enabled');
            }, 100);
        });

        // Add CSS for theme transitions
        const themeTransitionStyles = document.createElement('style');
        themeTransitionStyles.textContent = `
            .theme-transitions-enabled,
            .theme-transitions-enabled *,
            .theme-transitions-enabled *::before,
            .theme-transitions-enabled *::after {
                transition: background-color 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275),
                           border-color 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275),
                           color 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275),
                           box-shadow 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
            }
        `;
        document.head.appendChild(themeTransitionStyles);

        // Advanced theme detection based on system preference
        if (!localStorage.getItem('theme')) {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            currentTheme = prefersDark ? 'dark' : 'light';
            localStorage.setItem('theme', currentTheme);
        }

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme-manual-override')) {
                currentTheme = e.matches ? 'dark' : 'light';
                document.documentElement.setAttribute('data-theme', currentTheme);
                localStorage.setItem('theme', currentTheme);
                updateThemeIcon();
                showNotification('Tema sincronizado con el sistema');
            }
        });

        // Mark theme as manually set when user toggles
        const originalToggleThemeWithOverride = toggleTheme;
        toggleTheme = function() {
            localStorage.setItem('theme-manual-override', 'true');
            originalToggleThemeWithOverride();
        };

        // Enhanced error handling
        window.addEventListener('error', function(e) {
            console.error('Error en el CV:', e.error);
            // Don't show error notifications to users as it may be distracting
        });

        // Service worker registration for offline functionality (if needed)
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', function() {
                // Uncomment if you want to add offline functionality
                // navigator.serviceWorker.register('/sw.js');
            });
        }

        console.log('🚀 CV de Demien - SrPatoAC cargado exitosamente con toggle de tema y todas las mejoras!');
        console.log('💡 Presiona Ctrl/Cmd + T para cambiar el tema rápidamente');
    
