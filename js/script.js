        // Create floating particles
        function createParticles() {
            const container = document.getElementById('particles');
            const particleCount = 50;
            
            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement('div');
                particle.classList.add('particle');
                
                // Random size
                const size = Math.random() * 5 + 2;
                particle.style.width = `${size}px`;
                particle.style.height = `${size}px`;
                
                // Random position
                particle.style.left = `${Math.random() * 100}%`;
                particle.style.top = `${Math.random() * 100}%`;
                
                // Random animation
                const duration = Math.random() * 20 + 10;
                const delay = Math.random() * 5;
                particle.style.animationDuration = `${duration}s`;
                particle.style.animationDelay = `${delay}s`;
                
                // Random color
                const colors = ['#00e5ff', '#0077ff', '#7700ff'];
                const color = colors[Math.floor(Math.random() * colors.length)];
                particle.style.background = color;
                particle.style.boxShadow = `0 0 10px ${color}`;
                
                container.appendChild(particle);
            }
        }

        // 3D Cube Interaction System
        class CubeController {
            constructor() {
                this.cube = document.getElementById('cube');
                this.container = document.getElementById('cubeContainer');
                this.isDragging = false;
                this.previousMouseX = 0;
                this.previousMouseY = 0;
                this.rotationX = -15;
                this.rotationY = -15;
                this.rotationSpeed = 0.5;
                this.autoRotate = true;
                this.autoRotationSpeed = 0.5;
                this.animationId = null;
                
                this.init();
            }
            
            init() {
                this.setupEventListeners();
                this.startAutoRotation();
            }
            
            setupEventListeners() {
                // Mouse events
                this.container.addEventListener('mousedown', this.onMouseDown.bind(this));
                document.addEventListener('mousemove', this.onMouseMove.bind(this));
                document.addEventListener('mouseup', this.onMouseUp.bind(this));
                
                // Touch events for mobile
                this.container.addEventListener('touchstart', this.onTouchStart.bind(this), { passive: false });
                document.addEventListener('touchmove', this.onTouchMove.bind(this), { passive: false });
                document.addEventListener('touchend', this.onTouchEnd.bind(this));
                
                // Prevent context menu on cube
                this.container.addEventListener('contextmenu', (e) => e.preventDefault());
            }
            
            onMouseDown(e) {
                this.isDragging = true;
                this.previousMouseX = e.clientX;
                this.previousMouseY = e.clientY;
                this.container.classList.add('dragging');
                this.stopAutoRotation();
                e.preventDefault();
            }
            
            onMouseMove(e) {
                if (!this.isDragging) return;
                
                const deltaX = e.clientX - this.previousMouseX;
                const deltaY = e.clientY - this.previousMouseY;
                
                this.rotationY += deltaX * this.rotationSpeed;
                this.rotationX -= deltaY * this.rotationSpeed;
                
                this.updateCubeRotation();
                
                this.previousMouseX = e.clientX;
                this.previousMouseY = e.clientY;
            }
            
            onMouseUp() {
                this.isDragging = false;
                this.container.classList.remove('dragging');
                this.startAutoRotation();
            }
            
            onTouchStart(e) {
                if (e.touches.length === 1) {
                    this.isDragging = true;
                    this.previousMouseX = e.touches[0].clientX;
                    this.previousMouseY = e.touches[0].clientY;
                    this.container.classList.add('dragging');
                    this.stopAutoRotation();
                    e.preventDefault();
                }
            }
            
            onTouchMove(e) {
                if (!this.isDragging || e.touches.length !== 1) return;
                
                const deltaX = e.touches[0].clientX - this.previousMouseX;
                const deltaY = e.touches[0].clientY - this.previousMouseY;
                
                this.rotationY += deltaX * this.rotationSpeed;
                this.rotationX -= deltaY * this.rotationSpeed;
                
                this.updateCubeRotation();
                
                this.previousMouseX = e.touches[0].clientX;
                this.previousMouseY = e.touches[0].clientY;
                e.preventDefault();
            }
            
            onTouchEnd() {
                this.isDragging = false;
                this.container.classList.remove('dragging');
                this.startAutoRotation();
            }
            
            updateCubeRotation() {
                // Limit vertical rotation to prevent flipping
                this.rotationX = Math.max(-90, Math.min(90, this.rotationX));
                
                this.cube.style.transform = `rotateX(${this.rotationX}deg) rotateY(${this.rotationY}deg)`;
            }
            
            startAutoRotation() {
                if (!this.autoRotate || this.isDragging) return;
                
                const animate = () => {
                    if (!this.isDragging && this.autoRotate) {
                        this.rotationY += this.autoRotationSpeed;
                        this.updateCubeRotation();
                        this.animationId = requestAnimationFrame(animate);
                    }
                };
                
                this.animationId = requestAnimationFrame(animate);
            }
            
            stopAutoRotation() {
                if (this.animationId) {
                    cancelAnimationFrame(this.animationId);
                    this.animationId = null;
                }
            }
            
            reset() {
                this.rotationX = -15;
                this.rotationY = -15;
                this.updateCubeRotation();
            }
            
            toggleAutoRotate() {
                this.autoRotate = !this.autoRotate;
                if (this.autoRotate && !this.isDragging) {
                    this.startAutoRotation();
                } else {
                    this.stopAutoRotation();
                }
                return this.autoRotate;
            }
            
            rotateToFace(face) {
                const rotations = {
                    'front': { x: -15, y: 0 },
                    'back': { x: -15, y: 180 },
                    'right': { x: -15, y: 90 },
                    'left': { x: -15, y: -90 },
                    'top': { x: -90, y: 0 },
                    'bottom': { x: 90, y: 0 }
                };
                
                if (rotations[face]) {
                    this.rotationX = rotations[face].x;
                    this.rotationY = rotations[face].y;
                    this.updateCubeRotation();
                }
            }
        }

        // Initialize cube controller
        let cubeController;

        // Control functions for cube
        window.resetCube = function() {
            if (cubeController) cubeController.reset();
        };

        window.toggleAutoRotate = function() {
            if (cubeController) {
                const isAutoRotating = cubeController.toggleAutoRotate();
                const button = document.querySelector('.cube-btn:nth-child(2)');
                button.textContent = isAutoRotating ? 'Stop Rotation' : 'Auto Rotate';
            }
        };

        window.rotateToFace = function(face) {
            if (cubeController) cubeController.rotateToFace(face);
        };

        // Timeline animation
        function animateTimeline() {
            const timelineItems = document.querySelectorAll('.timeline-item');
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            }, { threshold: 0.3 });

            timelineItems.forEach(item => observer.observe(item));
        }

        // Form submission
        function setupForm() {
            const form = document.getElementById('contactForm');
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const btn = form.querySelector('.btn-primary');
                const originalText = btn.innerHTML;
                btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                btn.disabled = true;
                
                setTimeout(() => {
                    btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
                    btn.style.background = 'linear-gradient(90deg, #00ff9d, #00a86b)';
                    
                    setTimeout(() => {
                        btn.innerHTML = originalText;
                        btn.disabled = false;
                        btn.style.background = '';
                        form.reset();
                        alert('Thank you for your message! I will get back to you soon.');
                    }, 2000);
                }, 2000);
            });
        }

        // Initialize everything
        document.addEventListener('DOMContentLoaded', function() {
            createParticles();
            cubeController = new CubeController();
            animateTimeline();
            setupForm();

            // Smooth scrolling
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function(e) {
                    e.preventDefault();
                    const targetId = this.getAttribute('href');
                    if (targetId === '#') return;
                    
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        window.scrollTo({
                            top: targetElement.offsetTop - 80,
                            behavior: 'smooth'
                        });
                    }
                });
            });

            // Navbar scroll effect
            window.addEventListener('scroll', function() {
                const navbar = document.querySelector('.navbar');
                if (window.scrollY > 50) {
                    navbar.style.padding = '10px 0';
                    navbar.style.boxShadow = '0 5px 30px rgba(0, 119, 255, 0.2)';
                    navbar.style.background = 'rgba(10, 10, 22, 0.98)';
                } else {
                    navbar.style.padding = '15px 0';
                    navbar.style.boxShadow = 'none';
                    navbar.style.background = 'rgba(10, 10, 22, 0.95)';
                }
            });

            // Animate project cards on hover
            const projectCards = document.querySelectorAll('.project-card');
            projectCards.forEach(card => {
                card.addEventListener('mouseenter', function() {
                    this.style.zIndex = '10';
                });
                
                card.addEventListener('mouseleave', function() {
                    this.style.zIndex = '1';
                });
            });
        });
    