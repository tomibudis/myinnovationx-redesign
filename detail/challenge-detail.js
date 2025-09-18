// Challenge Detail Page JavaScript
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

    // Challenge application form handling
    const applyButton = document.querySelector('button[class*="bg-gradient-to-r from-blue-600 to-purple-600"]');
    if (applyButton) {
        applyButton.addEventListener('click', function() {
            // Here you would typically open a modal or redirect to application form
            alert('Application form would open here. This is a demo.');
        });
    }

    // Save challenge functionality
    const saveButton = document.querySelector('button[class*="border border-gray-300"]');
    if (saveButton) {
        saveButton.addEventListener('click', function() {
            // Toggle save state
            if (saveButton.textContent.includes('Save')) {
                saveButton.textContent = 'Saved ✓';
                saveButton.classList.remove('border-gray-300', 'text-gray-700', 'hover:bg-gray-50');
                saveButton.classList.add('bg-green-100', 'text-green-700', 'border-green-300');
            } else {
                saveButton.textContent = 'Save Challenge';
                saveButton.classList.add('border-gray-300', 'text-gray-700', 'hover:bg-gray-50');
                saveButton.classList.remove('bg-green-100', 'text-green-700', 'border-green-300');
            }
        });
    }

    // Related challenges click handling
    const relatedChallengeButtons = document.querySelectorAll('.bg-white.rounded-lg.shadow-sm button');
    relatedChallengeButtons.forEach(button => {
        button.addEventListener('click', function() {
            // In a real application, this would navigate to the specific challenge detail
            window.location.href = 'challenges.html';
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
