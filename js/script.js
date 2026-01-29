// Create floating particles
function createParticles() {
    const container = document.getElementById('particles');
    const particleCount = window.innerWidth < 768 ? 30 : 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Random size
        const size = Math.random() * 4 + 2;
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
        this.autoRotationSpeed = 0.3;
        this.animationId = null;
        this.isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.startAutoRotation();
        this.optimizeForMobile();
    }
    
    optimizeForMobile() {
        if (this.isMobile) {
            // Adjust sensitivity for touch devices
            this.rotationSpeed = 0.3;
            this.autoRotationSpeed = 0.2;
            
            // Add visual feedback for touch
            this.container.style.touchAction = 'none';
        }
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
        
        // Handle window resize
        window.addEventListener('resize', this.handleResize.bind(this));
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
    
    handleResize() {
        // Adjust sensitivity based on screen size
        if (window.innerWidth < 768) {
            this.rotationSpeed = 0.3;
            this.autoRotationSpeed = 0.2;
        } else {
            this.rotationSpeed = 0.5;
            this.autoRotationSpeed = 0.3;
        }
    }
}

// Timeline animation
function animateTimeline() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { 
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    timelineItems.forEach(item => observer.observe(item));
}

// Form submission
function setupForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const btn = form.querySelector('.btn-primary');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        btn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
            btn.style.background = 'linear-gradient(90deg, #00ff9d, #00a86b)';
            
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.disabled = false;
                btn.style.background = '';
                form.reset();
                
                // Reset form labels
                const labels = form.querySelectorAll('.form-label');
                labels.forEach(label => {
                    label.style.top = '15px';
                    label.style.left = '15px';
                    label.style.fontSize = '';
                    label.style.color = 'var(--text-gray)';
                    label.style.background = 'transparent';
                });
                
                // Show success message
                const successMsg = document.createElement('div');
                successMsg.className = 'alert alert-success mt-3';
                successMsg.innerHTML = '<i class="fas fa-check-circle me-2"></i>Thank you for your message! I will get back to you soon.';
                successMsg.style.background = 'rgba(0, 255, 157, 0.1)';
                successMsg.style.border = '1px solid rgba(0, 255, 157, 0.3)';
                successMsg.style.color = '#00ff9d';
                
                form.appendChild(successMsg);
                
                setTimeout(() => {
                    successMsg.remove();
                }, 5000);
            }, 2000);
        }, 1500);
    });
}

// Smooth scrolling
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Close mobile menu if open
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse.classList.contains('show')) {
                    navbarCollapse.classList.remove('show');
                }
                
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Navbar scroll effect
function setupNavbarScroll() {
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;
        
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
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize components
    createParticles();
    
    // Initialize cube controller with error handling
    try {
        window.cubeController = new CubeController();
    } catch (error) {
        console.warn('Cube controller initialization failed:', error);
    }
    
    animateTimeline();
    setupForm();
    setupSmoothScrolling();
    setupNavbarScroll();
    
    // Add mobile-specific optimizations
    if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
        // Add touch feedback to interactive elements
        const interactiveElements = document.querySelectorAll('.skill-card, .project-card, .education-card, .btn-primary');
        interactiveElements.forEach(el => {
            el.style.transition = 'all 0.2s ease';
        });
        
        // Prevent zoom on form inputs
        const formInputs = document.querySelectorAll('input, textarea, select');
        formInputs.forEach(input => {
            input.addEventListener('focus', () => {
                document.body.style.zoom = '1';
            });
        });
    }
    
    // Handle page load animation
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Set initial body opacity for fade-in effect
document.body.style.opacity = '0';
document.body.style.transition = 'opacity 0.5s ease';

// Error handling for missing elements
window.addEventListener('error', function(e) {
    console.warn('Error caught:', e.message);
});

// Performance optimization
let lastScrollTop = 0;
window.addEventListener('scroll', function() {
    const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Throttle scroll events for performance
    if (Math.abs(currentScrollTop - lastScrollTop) > 50) {
        lastScrollTop = currentScrollTop;
        
        // Pause cube animation when not in viewport for performance
        const cubeSection = document.querySelector('.hero-section');
        if (cubeSection) {
            const rect = cubeSection.getBoundingClientRect();
            const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (window.cubeController && !isInViewport) {
                window.cubeController.stopAutoRotation();
            } else if (window.cubeController && isInViewport && !window.cubeController.isDragging) {
                window.cubeController.startAutoRotation();
            }
        }
    }
}, { passive: true });

// Handle page visibility changes
document.addEventListener('visibilitychange', function() {
    if (window.cubeController) {
        if (document.hidden) {
            window.cubeController.stopAutoRotation();
        } else {
            window.cubeController.startAutoRotation();
        }
    }
});
