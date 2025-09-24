// Marketplace Solution Detail Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('active');
        });
    }

    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // Solution contact form handling
    const contactButton = document.querySelector('button[class*="bg-gradient-to-r from-blue-600 to-purple-600"]');
    if (contactButton) {
        contactButton.addEventListener('click', function() {
            // Here you would typically open a modal or redirect to contact form
            alert('Contact form would open here. This is a demo.');
        });
    }

    // Related solutions click handling
    const relatedSolutionButtons = document.querySelectorAll('.bg-white.rounded-lg.shadow-sm button');
    relatedSolutionButtons.forEach(button => {
        button.addEventListener('click', function() {
            // In a real application, this would navigate to the specific solution detail
            window.location.href = 'marketplace-solution.html';
        });
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add loading states for buttons
    const allButtons = document.querySelectorAll('button, a[class*="bg-gradient"]');
    allButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (this.classList.contains('bg-gradient-to-r')) {
                this.style.opacity = '0.7';
                this.style.pointerEvents = 'none';
                
                // Reset after 2 seconds
                setTimeout(() => {
                    this.style.opacity = '1';
                    this.style.pointerEvents = 'auto';
                }, 2000);
            }
        });
    });

    // Add animation classes on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.bg-white.rounded-lg').forEach(el => {
        observer.observe(el);
    });
});

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    .animate-fade-in {
        animation: fadeInUp 0.6s ease-out forwards;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .scrolled {
        background: rgba(255, 255, 255, 0.95) !important;
        backdrop-filter: blur(20px);
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
`;
document.head.appendChild(style);
