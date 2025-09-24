// DOM Elements
const navbar = document.getElementById('navbar');
const navMenu = document.getElementById('nav-menu');
const mobileMenu = document.getElementById('mobile-menu');
const hamburger = document.getElementById('hamburger');
const challengesGrid = document.getElementById('challenges-grid');
const testimonialsCarousel = document.getElementById('testimonials-carousel');

// Global Variables
let currentTestimonial = 0;
let testimonialInterval;
let currentFeatureStep = 0;
let featureProgress = 0;
let featureInterval;
let featureProgressInterval;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeScrollEffects();
    initializeCounters();
    initializeChallengeFilters();
    initializeChallengeSorting();
    initializeFormHandlers();
    initializeLazyLoading();
    initializeGridPattern();
    initializeFeatureSteps();
    initializeTestimonials();
    initializeOpportunitiesPage();
});

// Navigation Functions
function initializeNavigation() {
    // Mobile menu toggle
    if (hamburger) {
        hamburger.addEventListener('click', toggleMobileMenu);
    }
    
    // Close mobile menu when clicking on links
    const navLinks = document.querySelectorAll('.nav-link, .mobile-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (mobileMenu && !mobileMenu.contains(e.target) && !hamburger.contains(e.target)) {
            closeMobileMenu();
        }
    });

    // Handle dropdown menus
    initializeDropdownMenus();
}

function initializeDropdownMenus() {
    const dropdownTriggers = document.querySelectorAll('.group');
    
    dropdownTriggers.forEach(trigger => {
        const dropdown = trigger.querySelector('.absolute');
        if (dropdown) {
            // Add hover event listeners for desktop
            trigger.addEventListener('mouseenter', () => {
                dropdown.classList.add('opacity-100', 'visible');
                dropdown.classList.remove('opacity-0', 'invisible');
            });
            
            trigger.addEventListener('mouseleave', () => {
                dropdown.classList.remove('opacity-100', 'visible');
                dropdown.classList.add('opacity-0', 'invisible');
            });
        }
    });
}

// Opportunities Page Functions
function initializeOpportunitiesPage() {
    // Only initialize if we're on the opportunities page
    if (!document.querySelector('.opportunities-page')) return;
    
    initializeOpportunityFilters();
    initializeOpportunitySearch();
    initializeLoadMore();
}

function initializeOpportunityFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const categorySelect = document.querySelector('select[data-filter="category"]');
    const statusSelect = document.querySelector('select[data-filter="status"]');
    const prizeSelect = document.querySelector('select[data-filter="prize"]');
    const durationSelect = document.querySelector('select[data-filter="duration"]');
    
    // Filter button functionality
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class and reset styles from all buttons
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.classList.remove('bg-gradient-to-r', 'from-blue-600', 'to-purple-600', 'text-white');
                btn.classList.add('bg-white', 'text-gray-700', 'border', 'border-gray-300');
            });
            
            // Add active class and styles to clicked button
            this.classList.add('active');
            this.classList.remove('bg-white', 'text-gray-700', 'border', 'border-gray-300');
            this.classList.add('bg-gradient-to-r', 'from-blue-600', 'to-purple-600', 'text-white');
            
            // Apply filter based on button text
            const filterValue = this.textContent.trim();
            filterOpportunities(filterValue);
        });
    });
    
    // Select dropdown functionality
    [categorySelect, statusSelect, prizeSelect, durationSelect].forEach(select => {
        if (select) {
            select.addEventListener('change', function() {
                applyAllFilters();
            });
        }
    });
}

function initializeOpportunitySearch() {
    const searchInput = document.querySelector('input[placeholder*="Search opportunities"]');
    
    if (searchInput) {
        let searchTimeout;
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                const searchTerm = this.value.toLowerCase();
                searchOpportunities(searchTerm);
            }, 300);
        });
    }
}

function initializeLoadMore() {
    const loadMoreBtn = document.querySelector('button:contains("Load More Opportunities")');
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            // Simulate loading more opportunities
            this.innerHTML = `
                <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading...
            `;
            
            // Simulate API call
            setTimeout(() => {
                this.innerHTML = `
                    Load More Opportunities
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                `;
                // Here you would typically load more opportunities from an API
                console.log('Loading more opportunities...');
            }, 1500);
        });
    }
}

function filterOpportunities(filterValue) {
    const opportunityCards = document.querySelectorAll('.opportunity-card');
    
    opportunityCards.forEach(card => {
        const shouldShow = shouldShowOpportunity(card, filterValue);
        card.style.display = shouldShow ? 'block' : 'none';
        
        if (shouldShow) {
            card.style.animation = 'fadeInUp 0.3s ease-out';
        }
    });
}

function shouldShowOpportunity(card, filterValue) {
    const title = card.querySelector('h3').textContent.toLowerCase();
    const organization = card.querySelector('.text-gray-600').textContent.toLowerCase();
    const status = card.querySelector('.rounded-full').textContent.toLowerCase();
    const category = card.querySelector('.bg-gradient-to-r') ? 'featured' : 'regular';
    
    switch (filterValue) {
        case 'All':
            return true;
        case 'Open Now':
            return status.includes('open');
        case 'High Prize':
            const prizeText = card.textContent;
            return prizeText.includes('$100K') || prizeText.includes('$75K') || prizeText.includes('$80K');
        case 'Short Term':
            const durationText = card.textContent;
            return durationText.includes('1-3 months') || durationText.includes('3-6 months');
        case 'Government':
            return organization.includes('ministry') || organization.includes('government') || organization.includes('city hall');
        case 'Corporate':
            return organization.includes('bank') || organization.includes('berhad') || organization.includes('ventures');
        default:
            return true;
    }
}

function searchOpportunities(searchTerm) {
    const opportunityCards = document.querySelectorAll('.opportunity-card');
    
    opportunityCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('p').textContent.toLowerCase();
        const organization = card.querySelector('.text-gray-600').textContent.toLowerCase();
        
        const matches = title.includes(searchTerm) || 
                      description.includes(searchTerm) || 
                      organization.includes(searchTerm);
        
        card.style.display = matches ? 'block' : 'none';
        
        if (matches) {
            card.style.animation = 'fadeInUp 0.3s ease-out';
        }
    });
}

function applyAllFilters() {
    const categorySelect = document.querySelector('select[data-filter="category"]');
    const statusSelect = document.querySelector('select[data-filter="status"]');
    const prizeSelect = document.querySelector('select[data-filter="prize"]');
    const durationSelect = document.querySelector('select[data-filter="duration"]');
    
    const filters = {
        category: categorySelect ? categorySelect.value : '',
        status: statusSelect ? statusSelect.value : '',
        prize: prizeSelect ? prizeSelect.value : '',
        duration: durationSelect ? durationSelect.value : ''
    };
    
    const opportunityCards = document.querySelectorAll('.opportunity-card');
    
    opportunityCards.forEach(card => {
        const shouldShow = applyMultipleFilters(card, filters);
        card.style.display = shouldShow ? 'block' : 'none';
        
        if (shouldShow) {
            card.style.animation = 'fadeInUp 0.3s ease-out';
        }
    });
}

function applyMultipleFilters(card, filters) {
    // This would contain the logic to apply multiple filters simultaneously
    // For now, we'll just return true to show all cards
    return true;
}

function toggleMobileMenu() {
    if (mobileMenu) {
        mobileMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
        
        // Add mobile menu item animations
        const menuItems = mobileMenu.querySelectorAll('.space-y-4 > div, .space-y-4 > a');
        menuItems.forEach((item, index) => {
            item.classList.add('mobile-menu-item');
            if (mobileMenu.classList.contains('active')) {
                item.style.transitionDelay = `${0.1 + (index * 0.1)}s`;
            }
        });
    }
}

function closeMobileMenu() {
    if (mobileMenu) {
        mobileMenu.classList.remove('active');
        hamburger.classList.remove('active');
    }
}

// Scroll Effects
function initializeScrollEffects() {
    // Navbar scroll effect with smooth blur transition
    let ticking = false;
    
    function updateNavbar() {
        const scrolled = window.scrollY > 50;
        navbar.classList.toggle('scrolled', scrolled);
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick, { passive: true });
    
    // Smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Opportunities Page Functions
function initializeOpportunitiesPage() {
    // Only initialize if we're on the opportunities page
    if (!document.querySelector('.opportunities-page')) return;
    
    initializeOpportunityFilters();
    initializeOpportunitySearch();
    initializeLoadMore();
}

function initializeOpportunityFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const categorySelect = document.querySelector('select[data-filter="category"]');
    const statusSelect = document.querySelector('select[data-filter="status"]');
    const prizeSelect = document.querySelector('select[data-filter="prize"]');
    const durationSelect = document.querySelector('select[data-filter="duration"]');
    
    // Filter button functionality
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class and reset styles from all buttons
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.classList.remove('bg-gradient-to-r', 'from-blue-600', 'to-purple-600', 'text-white');
                btn.classList.add('bg-white', 'text-gray-700', 'border', 'border-gray-300');
            });
            
            // Add active class and styles to clicked button
            this.classList.add('active');
            this.classList.remove('bg-white', 'text-gray-700', 'border', 'border-gray-300');
            this.classList.add('bg-gradient-to-r', 'from-blue-600', 'to-purple-600', 'text-white');
            
            // Apply filter based on button text
            const filterValue = this.textContent.trim();
            filterOpportunities(filterValue);
        });
    });
    
    // Select dropdown functionality
    [categorySelect, statusSelect, prizeSelect, durationSelect].forEach(select => {
        if (select) {
            select.addEventListener('change', function() {
                applyAllFilters();
            });
        }
    });
}

function initializeOpportunitySearch() {
    const searchInput = document.querySelector('input[placeholder*="Search opportunities"]');
    
    if (searchInput) {
        let searchTimeout;
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                const searchTerm = this.value.toLowerCase();
                searchOpportunities(searchTerm);
            }, 300);
        });
    }
}

function initializeLoadMore() {
    const loadMoreBtn = document.querySelector('button:contains("Load More Opportunities")');
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            // Simulate loading more opportunities
            this.innerHTML = `
                <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading...
            `;
            
            // Simulate API call
            setTimeout(() => {
                this.innerHTML = `
                    Load More Opportunities
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                `;
                // Here you would typically load more opportunities from an API
                console.log('Loading more opportunities...');
            }, 1500);
        });
    }
}

function filterOpportunities(filterValue) {
    const opportunityCards = document.querySelectorAll('.opportunity-card');
    
    opportunityCards.forEach(card => {
        const shouldShow = shouldShowOpportunity(card, filterValue);
        card.style.display = shouldShow ? 'block' : 'none';
        
        if (shouldShow) {
            card.style.animation = 'fadeInUp 0.3s ease-out';
        }
    });
}

function shouldShowOpportunity(card, filterValue) {
    const title = card.querySelector('h3').textContent.toLowerCase();
    const organization = card.querySelector('.text-gray-600').textContent.toLowerCase();
    const status = card.querySelector('.rounded-full').textContent.toLowerCase();
    const category = card.querySelector('.bg-gradient-to-r') ? 'featured' : 'regular';
    
    switch (filterValue) {
        case 'All':
            return true;
        case 'Open Now':
            return status.includes('open');
        case 'High Prize':
            const prizeText = card.textContent;
            return prizeText.includes('$100K') || prizeText.includes('$75K') || prizeText.includes('$80K');
        case 'Short Term':
            const durationText = card.textContent;
            return durationText.includes('1-3 months') || durationText.includes('3-6 months');
        case 'Government':
            return organization.includes('ministry') || organization.includes('government') || organization.includes('city hall');
        case 'Corporate':
            return organization.includes('bank') || organization.includes('berhad') || organization.includes('ventures');
        default:
            return true;
    }
}

function searchOpportunities(searchTerm) {
    const opportunityCards = document.querySelectorAll('.opportunity-card');
    
    opportunityCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('p').textContent.toLowerCase();
        const organization = card.querySelector('.text-gray-600').textContent.toLowerCase();
        
        const matches = title.includes(searchTerm) || 
                      description.includes(searchTerm) || 
                      organization.includes(searchTerm);
        
        card.style.display = matches ? 'block' : 'none';
        
        if (matches) {
            card.style.animation = 'fadeInUp 0.3s ease-out';
        }
    });
}

function applyAllFilters() {
    const categorySelect = document.querySelector('select[data-filter="category"]');
    const statusSelect = document.querySelector('select[data-filter="status"]');
    const prizeSelect = document.querySelector('select[data-filter="prize"]');
    const durationSelect = document.querySelector('select[data-filter="duration"]');
    
    const filters = {
        category: categorySelect ? categorySelect.value : '',
        status: statusSelect ? statusSelect.value : '',
        prize: prizeSelect ? prizeSelect.value : '',
        duration: durationSelect ? durationSelect.value : ''
    };
    
    const opportunityCards = document.querySelectorAll('.opportunity-card');
    
    opportunityCards.forEach(card => {
        const shouldShow = applyMultipleFilters(card, filters);
        card.style.display = shouldShow ? 'block' : 'none';
        
        if (shouldShow) {
            card.style.animation = 'fadeInUp 0.3s ease-out';
        }
    });
}

function applyMultipleFilters(card, filters) {
    // This would contain the logic to apply multiple filters simultaneously
    // For now, we'll just return true to show all cards
    return true;
}

// Counter Animation
function initializeCounters() {
    const counters = document.querySelectorAll('.stat-number, .stat-counter');
    const fundingCounter = document.getElementById('funding-counter');
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.id === 'funding-counter') {
                    animateFundingCounter(entry.target);
                } else {
                    animateCounter(entry.target);
                }
                counterObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
    
    // Also observe the funding counter
    if (fundingCounter) {
        counterObserver.observe(fundingCounter);
    }
}

// Opportunities Page Functions
function initializeOpportunitiesPage() {
    // Only initialize if we're on the opportunities page
    if (!document.querySelector('.opportunities-page')) return;
    
    initializeOpportunityFilters();
    initializeOpportunitySearch();
    initializeLoadMore();
}

function initializeOpportunityFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const categorySelect = document.querySelector('select[data-filter="category"]');
    const statusSelect = document.querySelector('select[data-filter="status"]');
    const prizeSelect = document.querySelector('select[data-filter="prize"]');
    const durationSelect = document.querySelector('select[data-filter="duration"]');
    
    // Filter button functionality
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class and reset styles from all buttons
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.classList.remove('bg-gradient-to-r', 'from-blue-600', 'to-purple-600', 'text-white');
                btn.classList.add('bg-white', 'text-gray-700', 'border', 'border-gray-300');
            });
            
            // Add active class and styles to clicked button
            this.classList.add('active');
            this.classList.remove('bg-white', 'text-gray-700', 'border', 'border-gray-300');
            this.classList.add('bg-gradient-to-r', 'from-blue-600', 'to-purple-600', 'text-white');
            
            // Apply filter based on button text
            const filterValue = this.textContent.trim();
            filterOpportunities(filterValue);
        });
    });
    
    // Select dropdown functionality
    [categorySelect, statusSelect, prizeSelect, durationSelect].forEach(select => {
        if (select) {
            select.addEventListener('change', function() {
                applyAllFilters();
            });
        }
    });
}

function initializeOpportunitySearch() {
    const searchInput = document.querySelector('input[placeholder*="Search opportunities"]');
    
    if (searchInput) {
        let searchTimeout;
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                const searchTerm = this.value.toLowerCase();
                searchOpportunities(searchTerm);
            }, 300);
        });
    }
}

function initializeLoadMore() {
    const loadMoreBtn = document.querySelector('button:contains("Load More Opportunities")');
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            // Simulate loading more opportunities
            this.innerHTML = `
                <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading...
            `;
            
            // Simulate API call
            setTimeout(() => {
                this.innerHTML = `
                    Load More Opportunities
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                `;
                // Here you would typically load more opportunities from an API
                console.log('Loading more opportunities...');
            }, 1500);
        });
    }
}

function filterOpportunities(filterValue) {
    const opportunityCards = document.querySelectorAll('.opportunity-card');
    
    opportunityCards.forEach(card => {
        const shouldShow = shouldShowOpportunity(card, filterValue);
        card.style.display = shouldShow ? 'block' : 'none';
        
        if (shouldShow) {
            card.style.animation = 'fadeInUp 0.3s ease-out';
        }
    });
}

function shouldShowOpportunity(card, filterValue) {
    const title = card.querySelector('h3').textContent.toLowerCase();
    const organization = card.querySelector('.text-gray-600').textContent.toLowerCase();
    const status = card.querySelector('.rounded-full').textContent.toLowerCase();
    const category = card.querySelector('.bg-gradient-to-r') ? 'featured' : 'regular';
    
    switch (filterValue) {
        case 'All':
            return true;
        case 'Open Now':
            return status.includes('open');
        case 'High Prize':
            const prizeText = card.textContent;
            return prizeText.includes('$100K') || prizeText.includes('$75K') || prizeText.includes('$80K');
        case 'Short Term':
            const durationText = card.textContent;
            return durationText.includes('1-3 months') || durationText.includes('3-6 months');
        case 'Government':
            return organization.includes('ministry') || organization.includes('government') || organization.includes('city hall');
        case 'Corporate':
            return organization.includes('bank') || organization.includes('berhad') || organization.includes('ventures');
        default:
            return true;
    }
}

function searchOpportunities(searchTerm) {
    const opportunityCards = document.querySelectorAll('.opportunity-card');
    
    opportunityCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('p').textContent.toLowerCase();
        const organization = card.querySelector('.text-gray-600').textContent.toLowerCase();
        
        const matches = title.includes(searchTerm) || 
                      description.includes(searchTerm) || 
                      organization.includes(searchTerm);
        
        card.style.display = matches ? 'block' : 'none';
        
        if (matches) {
            card.style.animation = 'fadeInUp 0.3s ease-out';
        }
    });
}

function applyAllFilters() {
    const categorySelect = document.querySelector('select[data-filter="category"]');
    const statusSelect = document.querySelector('select[data-filter="status"]');
    const prizeSelect = document.querySelector('select[data-filter="prize"]');
    const durationSelect = document.querySelector('select[data-filter="duration"]');
    
    const filters = {
        category: categorySelect ? categorySelect.value : '',
        status: statusSelect ? statusSelect.value : '',
        prize: prizeSelect ? prizeSelect.value : '',
        duration: durationSelect ? durationSelect.value : ''
    };
    
    const opportunityCards = document.querySelectorAll('.opportunity-card');
    
    opportunityCards.forEach(card => {
        const shouldShow = applyMultipleFilters(card, filters);
        card.style.display = shouldShow ? 'block' : 'none';
        
        if (shouldShow) {
            card.style.animation = 'fadeInUp 0.3s ease-out';
        }
    });
}

function applyMultipleFilters(card, filters) {
    // This would contain the logic to apply multiple filters simultaneously
    // For now, we'll just return true to show all cards
    return true;
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16); // 60fps
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, 16);
}

// Custom funding counter animation
function animateFundingCounter(element) {
    const target = 2.4; // RM 2.4M
    const duration = 2500; // 2.5 seconds
    const increment = target / (duration / 16); // 60fps
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = `RM ${current.toFixed(1)}M`;
    }, 16);
}

// Challenge Filtering
function initializeChallengeFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const challengeCards = document.querySelectorAll('.challenge-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.classList.remove('bg-purple-600', 'text-white');
                btn.classList.add('bg-white', 'text-gray-700', 'border', 'border-gray-300');
            });
            
            // Add active class to clicked button
            this.classList.add('active');
            this.classList.remove('bg-white', 'text-gray-700', 'border', 'border-gray-300');
            this.classList.add('bg-purple-600', 'text-white');
            
            const filterText = this.textContent.trim().toLowerCase();
            
            // Filter challenge cards based on sector
            challengeCards.forEach(card => {
                const sectorElement = card.querySelector('.text-gray-600.text-sm:last-of-type');
                const sector = sectorElement ? sectorElement.textContent.toLowerCase().replace('sector: ', '') : '';
                
                if (filterText === 'all' || sector.includes(filterText)) {
                    card.style.display = 'block';
                    card.style.animation = 'slideInUp 0.5s ease-out';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// Opportunities Page Functions
function initializeOpportunitiesPage() {
    // Only initialize if we're on the opportunities page
    if (!document.querySelector('.opportunities-page')) return;
    
    initializeOpportunityFilters();
    initializeOpportunitySearch();
    initializeLoadMore();
}

function initializeOpportunityFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const categorySelect = document.querySelector('select[data-filter="category"]');
    const statusSelect = document.querySelector('select[data-filter="status"]');
    const prizeSelect = document.querySelector('select[data-filter="prize"]');
    const durationSelect = document.querySelector('select[data-filter="duration"]');
    
    // Filter button functionality
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class and reset styles from all buttons
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.classList.remove('bg-gradient-to-r', 'from-blue-600', 'to-purple-600', 'text-white');
                btn.classList.add('bg-white', 'text-gray-700', 'border', 'border-gray-300');
            });
            
            // Add active class and styles to clicked button
            this.classList.add('active');
            this.classList.remove('bg-white', 'text-gray-700', 'border', 'border-gray-300');
            this.classList.add('bg-gradient-to-r', 'from-blue-600', 'to-purple-600', 'text-white');
            
            // Apply filter based on button text
            const filterValue = this.textContent.trim();
            filterOpportunities(filterValue);
        });
    });
    
    // Select dropdown functionality
    [categorySelect, statusSelect, prizeSelect, durationSelect].forEach(select => {
        if (select) {
            select.addEventListener('change', function() {
                applyAllFilters();
            });
        }
    });
}

function initializeOpportunitySearch() {
    const searchInput = document.querySelector('input[placeholder*="Search opportunities"]');
    
    if (searchInput) {
        let searchTimeout;
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                const searchTerm = this.value.toLowerCase();
                searchOpportunities(searchTerm);
            }, 300);
        });
    }
}

function initializeLoadMore() {
    const loadMoreBtn = document.querySelector('button:contains("Load More Opportunities")');
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            // Simulate loading more opportunities
            this.innerHTML = `
                <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading...
            `;
            
            // Simulate API call
            setTimeout(() => {
                this.innerHTML = `
                    Load More Opportunities
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                `;
                // Here you would typically load more opportunities from an API
                console.log('Loading more opportunities...');
            }, 1500);
        });
    }
}

function filterOpportunities(filterValue) {
    const opportunityCards = document.querySelectorAll('.opportunity-card');
    
    opportunityCards.forEach(card => {
        const shouldShow = shouldShowOpportunity(card, filterValue);
        card.style.display = shouldShow ? 'block' : 'none';
        
        if (shouldShow) {
            card.style.animation = 'fadeInUp 0.3s ease-out';
        }
    });
}

function shouldShowOpportunity(card, filterValue) {
    const title = card.querySelector('h3').textContent.toLowerCase();
    const organization = card.querySelector('.text-gray-600').textContent.toLowerCase();
    const status = card.querySelector('.rounded-full').textContent.toLowerCase();
    const category = card.querySelector('.bg-gradient-to-r') ? 'featured' : 'regular';
    
    switch (filterValue) {
        case 'All':
            return true;
        case 'Open Now':
            return status.includes('open');
        case 'High Prize':
            const prizeText = card.textContent;
            return prizeText.includes('$100K') || prizeText.includes('$75K') || prizeText.includes('$80K');
        case 'Short Term':
            const durationText = card.textContent;
            return durationText.includes('1-3 months') || durationText.includes('3-6 months');
        case 'Government':
            return organization.includes('ministry') || organization.includes('government') || organization.includes('city hall');
        case 'Corporate':
            return organization.includes('bank') || organization.includes('berhad') || organization.includes('ventures');
        default:
            return true;
    }
}

function searchOpportunities(searchTerm) {
    const opportunityCards = document.querySelectorAll('.opportunity-card');
    
    opportunityCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('p').textContent.toLowerCase();
        const organization = card.querySelector('.text-gray-600').textContent.toLowerCase();
        
        const matches = title.includes(searchTerm) || 
                      description.includes(searchTerm) || 
                      organization.includes(searchTerm);
        
        card.style.display = matches ? 'block' : 'none';
        
        if (matches) {
            card.style.animation = 'fadeInUp 0.3s ease-out';
        }
    });
}

function applyAllFilters() {
    const categorySelect = document.querySelector('select[data-filter="category"]');
    const statusSelect = document.querySelector('select[data-filter="status"]');
    const prizeSelect = document.querySelector('select[data-filter="prize"]');
    const durationSelect = document.querySelector('select[data-filter="duration"]');
    
    const filters = {
        category: categorySelect ? categorySelect.value : '',
        status: statusSelect ? statusSelect.value : '',
        prize: prizeSelect ? prizeSelect.value : '',
        duration: durationSelect ? durationSelect.value : ''
    };
    
    const opportunityCards = document.querySelectorAll('.opportunity-card');
    
    opportunityCards.forEach(card => {
        const shouldShow = applyMultipleFilters(card, filters);
        card.style.display = shouldShow ? 'block' : 'none';
        
        if (shouldShow) {
            card.style.animation = 'fadeInUp 0.3s ease-out';
        }
    });
}

function applyMultipleFilters(card, filters) {
    // This would contain the logic to apply multiple filters simultaneously
    // For now, we'll just return true to show all cards
    return true;
}

// Challenge Sorting
function initializeChallengeSorting() {
    const sortContainer = document.querySelector('.flex.items-center.gap-2.text-sm.text-gray-600');
    const browseAllButton = document.querySelector('button.text-purple-600');
    
    if (sortContainer) {
        // Make sort container clickable
        sortContainer.style.cursor = 'pointer';
        sortContainer.addEventListener('click', function() {
            // Toggle sort options (this could be expanded to show a dropdown)
            console.log('Sort clicked - Soonest first');
        });
    }
    
    if (browseAllButton) {
        browseAllButton.addEventListener('click', function() {
            // Handle browse all functionality
            console.log('Browse all clicked');
            // This could navigate to a full challenges page or show more cards
            showNotification('Loading all challenges...', 'info');
        });
    }
}

// Testimonials Carousel
function initializeTestimonials() {
    const slides = document.querySelectorAll('.testimonial-slide');
    const prevBtn = document.getElementById('testimonial-prev');
    const nextBtn = document.getElementById('testimonial-next');
    const dots = document.querySelectorAll('.carousel-dot');
    const content = document.getElementById('testimonials-content');
    
    if (slides.length === 0) return;
    
    let currentSlide = 0;
    const totalSlides = slides.length;
    
    // Show first slide
    showTestimonialSlide(0);
    
    // Navigation button handlers
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentSlide = currentSlide === 0 ? totalSlides - 1 : currentSlide - 1;
            showTestimonialSlide(currentSlide);
            resetTestimonialAutoPlay();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentSlide = (currentSlide + 1) % totalSlides;
            showTestimonialSlide(currentSlide);
            resetTestimonialAutoPlay();
        });
    }
    
    // Dot navigation handlers
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            showTestimonialSlide(currentSlide);
            resetTestimonialAutoPlay();
        });
    });
    
    // Auto-rotate testimonials
    startTestimonialRotation();
    
    // Pause on hover
    const carousel = document.getElementById('testimonials-carousel');
    if (carousel) {
        carousel.addEventListener('mouseenter', stopTestimonialRotation);
        carousel.addEventListener('mouseleave', startTestimonialRotation);
    }
    
    // Touch/swipe support for mobile
    let startX = 0;
    let isDragging = false;
    
    if (content) {
        content.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
        });
        
        content.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
        });
        
        content.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            isDragging = false;
            
            const endX = e.changedTouches[0].clientX;
            const diff = startX - endX;
            
            if (Math.abs(diff) > 50) { // Minimum swipe distance
                if (diff > 0) {
                    // Swipe left - next slide
                    currentSlide = (currentSlide + 1) % totalSlides;
                } else {
                    // Swipe right - previous slide
                    currentSlide = currentSlide === 0 ? totalSlides - 1 : currentSlide - 1;
                }
                showTestimonialSlide(currentSlide);
                resetTestimonialAutoPlay();
            }
        });
    }
    
    function showTestimonialSlide(index) {
        // Update carousel position
        if (content) {
            content.style.transform = `translateX(-${index * 100}%)`;
        }
        
        // Update dots
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        
        // Update navigation buttons
        if (prevBtn) {
            prevBtn.disabled = false;
        }
        if (nextBtn) {
            nextBtn.disabled = false;
        }
    }
    
    // Auto-play functionality
    let testimonialInterval;
    
    function startTestimonialRotation() {
        stopTestimonialRotation();
        testimonialInterval = setInterval(() => {
            currentSlide = (currentSlide + 1) % totalSlides;
            showTestimonialSlide(currentSlide);
        }, 5000); // Change every 5 seconds
    }
    
    function stopTestimonialRotation() {
        if (testimonialInterval) {
            clearInterval(testimonialInterval);
            testimonialInterval = null;
        }
    }
    
    function resetTestimonialAutoPlay() {
        stopTestimonialRotation();
        startTestimonialRotation();
    }
    
    // Make functions available globally for the existing code
    window.showTestimonial = showTestimonialSlide;
    window.startTestimonialRotation = startTestimonialRotation;
    window.stopTestimonialRotation = stopTestimonialRotation;
    window.resetTestimonialAutoPlay = resetTestimonialAutoPlay;
}

// Legacy functions removed - functionality moved to initializeTestimonials()

// Form Handlers
function initializeFormHandlers() {
    const launchForm = document.querySelector('.launch-form form');
    
    if (launchForm) {
        launchForm.addEventListener('submit', handleLaunchFormSubmit);
    }
}

function handleLaunchFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Launching...';
    submitBtn.disabled = true;
    submitBtn.classList.add('loading');
    
    // Simulate API call
    setTimeout(() => {
        // Reset form
        e.target.reset();
        
        // Show success message
        showNotification('Challenge launched successfully! We\'ll be in touch soon.', 'success');
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
    }, 2000);
}

// Utility Functions
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        const offsetTop = element.offsetTop - 80;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
        max-width: 400px;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Lazy Loading for Images
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Scroll Animation for Elements
function initializeScrollAnimations() {
    const animatedElements = document.querySelectorAll('.feature-card, .partnership-card, .challenge-card, .marketplace-item');
    
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-on-scroll');
                animationObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(el => animationObserver.observe(el));
}

// Initialize scroll animations
document.addEventListener('DOMContentLoaded', initializeScrollAnimations);

// CSS animations are now handled in styles.css

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debouncing to scroll events
const debouncedScrollHandler = debounce(function() {
    // Any scroll-based functionality can be added here
}, 16); // ~60fps

window.addEventListener('scroll', debouncedScrollHandler);

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // You could send this to an error tracking service
});

// Service Worker registration for PWA capabilities (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed');
            });
    });
}

// Opportunities Page Functions
function initializeOpportunitiesPage() {
    // Only initialize if we're on the opportunities page
    if (!document.querySelector('.opportunities-page')) return;
    
    initializeOpportunityFilters();
    initializeOpportunitySearch();
    initializeLoadMore();
}

function initializeOpportunityFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const categorySelect = document.querySelector('select[data-filter="category"]');
    const statusSelect = document.querySelector('select[data-filter="status"]');
    const prizeSelect = document.querySelector('select[data-filter="prize"]');
    const durationSelect = document.querySelector('select[data-filter="duration"]');
    
    // Filter button functionality
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class and reset styles from all buttons
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.classList.remove('bg-gradient-to-r', 'from-blue-600', 'to-purple-600', 'text-white');
                btn.classList.add('bg-white', 'text-gray-700', 'border', 'border-gray-300');
            });
            
            // Add active class and styles to clicked button
            this.classList.add('active');
            this.classList.remove('bg-white', 'text-gray-700', 'border', 'border-gray-300');
            this.classList.add('bg-gradient-to-r', 'from-blue-600', 'to-purple-600', 'text-white');
            
            // Apply filter based on button text
            const filterValue = this.textContent.trim();
            filterOpportunities(filterValue);
        });
    });
    
    // Select dropdown functionality
    [categorySelect, statusSelect, prizeSelect, durationSelect].forEach(select => {
        if (select) {
            select.addEventListener('change', function() {
                applyAllFilters();
            });
        }
    });
}

function initializeOpportunitySearch() {
    const searchInput = document.querySelector('input[placeholder*="Search opportunities"]');
    
    if (searchInput) {
        let searchTimeout;
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                const searchTerm = this.value.toLowerCase();
                searchOpportunities(searchTerm);
            }, 300);
        });
    }
}

function initializeLoadMore() {
    const loadMoreBtn = document.querySelector('button:contains("Load More Opportunities")');
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            // Simulate loading more opportunities
            this.innerHTML = `
                <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading...
            `;
            
            // Simulate API call
            setTimeout(() => {
                this.innerHTML = `
                    Load More Opportunities
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                `;
                // Here you would typically load more opportunities from an API
                console.log('Loading more opportunities...');
            }, 1500);
        });
    }
}

function filterOpportunities(filterValue) {
    const opportunityCards = document.querySelectorAll('.opportunity-card');
    
    opportunityCards.forEach(card => {
        const shouldShow = shouldShowOpportunity(card, filterValue);
        card.style.display = shouldShow ? 'block' : 'none';
        
        if (shouldShow) {
            card.style.animation = 'fadeInUp 0.3s ease-out';
        }
    });
}

function shouldShowOpportunity(card, filterValue) {
    const title = card.querySelector('h3').textContent.toLowerCase();
    const organization = card.querySelector('.text-gray-600').textContent.toLowerCase();
    const status = card.querySelector('.rounded-full').textContent.toLowerCase();
    const category = card.querySelector('.bg-gradient-to-r') ? 'featured' : 'regular';
    
    switch (filterValue) {
        case 'All':
            return true;
        case 'Open Now':
            return status.includes('open');
        case 'High Prize':
            const prizeText = card.textContent;
            return prizeText.includes('$100K') || prizeText.includes('$75K') || prizeText.includes('$80K');
        case 'Short Term':
            const durationText = card.textContent;
            return durationText.includes('1-3 months') || durationText.includes('3-6 months');
        case 'Government':
            return organization.includes('ministry') || organization.includes('government') || organization.includes('city hall');
        case 'Corporate':
            return organization.includes('bank') || organization.includes('berhad') || organization.includes('ventures');
        default:
            return true;
    }
}

function searchOpportunities(searchTerm) {
    const opportunityCards = document.querySelectorAll('.opportunity-card');
    
    opportunityCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('p').textContent.toLowerCase();
        const organization = card.querySelector('.text-gray-600').textContent.toLowerCase();
        
        const matches = title.includes(searchTerm) || 
                      description.includes(searchTerm) || 
                      organization.includes(searchTerm);
        
        card.style.display = matches ? 'block' : 'none';
        
        if (matches) {
            card.style.animation = 'fadeInUp 0.3s ease-out';
        }
    });
}

function applyAllFilters() {
    const categorySelect = document.querySelector('select[data-filter="category"]');
    const statusSelect = document.querySelector('select[data-filter="status"]');
    const prizeSelect = document.querySelector('select[data-filter="prize"]');
    const durationSelect = document.querySelector('select[data-filter="duration"]');
    
    const filters = {
        category: categorySelect ? categorySelect.value : '',
        status: statusSelect ? statusSelect.value : '',
        prize: prizeSelect ? prizeSelect.value : '',
        duration: durationSelect ? durationSelect.value : ''
    };
    
    const opportunityCards = document.querySelectorAll('.opportunity-card');
    
    opportunityCards.forEach(card => {
        const shouldShow = applyMultipleFilters(card, filters);
        card.style.display = shouldShow ? 'block' : 'none';
        
        if (shouldShow) {
            card.style.animation = 'fadeInUp 0.3s ease-out';
        }
    });
}

function applyMultipleFilters(card, filters) {
    // This would contain the logic to apply multiple filters simultaneously
    // For now, we'll just return true to show all cards
    return true;
}

// Grid Pattern Functions
function initializeGridPattern() {
    console.log('success')
    const gridContainer = document.getElementById('grid-pattern-container');

    if (!gridContainer) return;
    
    // Get responsive grid settings
    const gridSettings = getResponsiveGridSettings();
    
    // Create grid pattern
    const gridPattern = createGridPattern(gridSettings);
    
    // Add to grid container
    gridContainer.appendChild(gridPattern);
    
    // Update grid pattern on window resize
    window.addEventListener('resize', debounce(() => {
        updateGridPattern(gridContainer);
    }, 250));
}

function getResponsiveGridSettings() {
    const isMobile = window.innerWidth <= 768;
    const isSmallMobile = window.innerWidth <= 480;
    
    if (isSmallMobile) {
        return {
            width: 20,
            height: 20,
            x: -1,
            y: -1,
            squares: [
                [2, 2], [3, 3], [4, 4], [5, 5],
                [6, 6], [7, 7], [8, 8], [9, 9]
            ],
            strokeDasharray: "0"
        };
    } else if (isMobile) {
        return {
            width: 30,
            height: 30,
            x: -1,
            y: -1,
            squares: [
                [3, 3], [4, 4], [5, 5], [6, 6],
                [7, 7], [8, 8], [9, 9], [10, 10]
            ],
            strokeDasharray: "0"
        };
    } else {
        return {
            width: 40,
            height: 40,
            x: -1,
            y: -1,
            squares: [
                [4, 4], [5, 1], [8, 2], [5, 3],
                [5, 5], [10, 10], [12, 15], [15, 10],
                [10, 15], [15, 10], [10, 15], [15, 10],
            ],
            strokeDasharray: "0"
        };
    }
}

function updateGridPattern(container) {
    // Clear existing grid pattern
    container.innerHTML = '';
    
    // Get new responsive settings
    const gridSettings = getResponsiveGridSettings();
    
    // Create new grid pattern
    const gridPattern = createGridPattern(gridSettings);
    
    // Add to container
    container.appendChild(gridPattern);
}

function createGridPattern(options = {}) {
    const {
        width = 40,
        height = 40,
        x = -1,
        y = -1,
        squares = [],
        strokeDasharray = "0"
    } = options;
    
    // Create container div
    const container = document.createElement('div');
    container.className = 'grid-pattern grid-pattern-masked';
    
    // Generate unique ID for the pattern
    const patternId = 'grid-pattern-' + Math.random().toString(36).substr(2, 9);
    
    // Create SVG
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('class', 'pointer-events-none absolute inset-0 h-full w-full fill-gray-400/30 stroke-gray-400/30');
    
    // Create defs section
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    
    // Create pattern
    const pattern = document.createElementNS('http://www.w3.org/2000/svg', 'pattern');
    pattern.setAttribute('id', patternId);
    pattern.setAttribute('width', width);
    pattern.setAttribute('height', height);
    pattern.setAttribute('patternUnits', 'userSpaceOnUse');
    pattern.setAttribute('x', x);
    pattern.setAttribute('y', y);
    
    // Create path for grid lines
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', `M.5 ${height}V.5H${width}`);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke-dasharray', strokeDasharray);
    
    // Assemble pattern
    pattern.appendChild(path);
    defs.appendChild(pattern);
    svg.appendChild(defs);
    
    // Create main rect with pattern fill
    const mainRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    mainRect.setAttribute('width', '100%');
    mainRect.setAttribute('height', '100%');
    mainRect.setAttribute('stroke-width', '0');
    mainRect.setAttribute('fill', `url(#${patternId})`);
    svg.appendChild(mainRect);
    
    // Add highlighted squares if provided
    if (squares && squares.length > 0) {
        const squaresSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        squaresSvg.setAttribute('x', x);
        squaresSvg.setAttribute('y', y);
        squaresSvg.setAttribute('class', 'overflow-visible');
        
        squares.forEach(([squareX, squareY], index) => {
            const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            rect.setAttribute('stroke-width', '0');
            rect.setAttribute('key', `${squareX}-${squareY}-${index}`);
            rect.setAttribute('width', width - 1);
            rect.setAttribute('height', height - 1);
            rect.setAttribute('x', squareX * width + 1);
            rect.setAttribute('y', squareY * height + 1);
            rect.setAttribute('class', 'grid-pattern-highlighted');
            squaresSvg.appendChild(rect);
        });
        
        svg.appendChild(squaresSvg);
    }
    
    container.appendChild(svg);
    return container;
}

// Function to create different grid pattern variants
function createGridPatternVariant(type, container) {
    const variants = {
        'linear-mask': {
            className: 'grid-pattern-linear-mask',
            squares: [[2, 2], [3, 3], [4, 4], [5, 5]]
        },
        'dotted': {
            className: 'grid-pattern',
            strokeDasharray: "2 6",
            squares: [[1, 1], [2, 2], [3, 3]]
        },
        'small-grid': {
            className: 'grid-pattern-masked',
            width: 15,
            height: 15,
            squares: [[5, 5], [6, 6], [7, 7], [8, 8]]
        }
    };
    
    const variant = variants[type];
    if (!variant) return;
    
    const gridPattern = createGridPattern(variant);
    gridPattern.className = `grid-pattern ${variant.className}`;
    
    if (container) {
        container.appendChild(gridPattern);
    }
    
    return gridPattern;
}

// Feature Steps Functionality
function initializeFeatureSteps() {
    const featureSteps = document.querySelectorAll('.feature-step');
    const featureImages = document.querySelectorAll('.feature-image');
    
    if (featureSteps.length === 0) return;
    
    // Initialize first step as active
    showFeatureStep(0);
    
    // Start auto-play
    startFeatureAutoPlay();
    
    // Add click handlers for manual navigation
    featureSteps.forEach((step, index) => {
        step.addEventListener('click', () => {
            showFeatureStep(index);
            resetFeatureAutoPlay();
        });
        
        // Add keyboard navigation
        step.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                showFeatureStep(index);
                resetFeatureAutoPlay();
            }
        });
        
        // Make steps focusable
        step.setAttribute('tabindex', '0');
        step.setAttribute('role', 'button');
        step.setAttribute('aria-label', `Go to step ${index + 1}`);
    });
    
    // Pause auto-play on hover
    const featureSection = document.getElementById('feature-steps');
    if (featureSection) {
        featureSection.addEventListener('mouseenter', pauseFeatureAutoPlay);
        featureSection.addEventListener('mouseleave', resumeFeatureAutoPlay);
    }
}

function showFeatureStep(stepIndex) {
    const featureSteps = document.querySelectorAll('.feature-step');
    const featureImages = document.querySelectorAll('.feature-image');
    const stepIndicators = document.querySelectorAll('.step-indicator');
    
    // Update current step
    currentFeatureStep = stepIndex;
    
    // Update step indicators
    featureSteps.forEach((step, index) => {
        const indicator = step.querySelector('.step-indicator');
        const stepNumber = step.querySelector('.step-number');
        const stepCheck = step.querySelector('.step-check');
        
        if (index < stepIndex) {
            // Completed steps
            step.classList.remove('active');
            step.classList.add('completed');
            indicator.classList.remove('active');
            indicator.classList.add('completed');
            stepNumber.classList.add('hidden');
            stepCheck.classList.remove('hidden');
        } else if (index === stepIndex) {
            // Current step
            step.classList.add('active');
            step.classList.remove('completed');
            indicator.classList.add('active');
            indicator.classList.remove('completed');
            stepNumber.classList.add('hidden');
            stepCheck.classList.remove('hidden');
        } else {
            // Future steps
            step.classList.remove('active', 'completed');
            indicator.classList.remove('active', 'completed');
            stepNumber.classList.remove('hidden');
            stepCheck.classList.add('hidden');
        }
    });
    
    // Update images with animation
    featureImages.forEach((image, index) => {
        if (index === stepIndex) {
            image.classList.add('active');
            image.classList.remove('exit');
            image.style.opacity = '1';
            image.style.transform = 'translateY(0) rotateX(0deg)';
        } else {
            if (image.classList.contains('active')) {
                image.classList.add('exit');
                image.classList.remove('active');
                setTimeout(() => {
                    image.style.opacity = '0';
                    image.style.transform = 'translateY(-100px) rotateX(20deg)';
                }, 250);
            } else {
                image.style.opacity = '0';
                image.style.transform = 'translateY(100px) rotateX(-20deg)';
            }
        }
    });
}

// Opportunities Page Functions
function initializeOpportunitiesPage() {
    // Only initialize if we're on the opportunities page
    if (!document.querySelector('.opportunities-page')) return;
    
    initializeOpportunityFilters();
    initializeOpportunitySearch();
    initializeLoadMore();
}

function initializeOpportunityFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const categorySelect = document.querySelector('select[data-filter="category"]');
    const statusSelect = document.querySelector('select[data-filter="status"]');
    const prizeSelect = document.querySelector('select[data-filter="prize"]');
    const durationSelect = document.querySelector('select[data-filter="duration"]');
    
    // Filter button functionality
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class and reset styles from all buttons
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.classList.remove('bg-gradient-to-r', 'from-blue-600', 'to-purple-600', 'text-white');
                btn.classList.add('bg-white', 'text-gray-700', 'border', 'border-gray-300');
            });
            
            // Add active class and styles to clicked button
            this.classList.add('active');
            this.classList.remove('bg-white', 'text-gray-700', 'border', 'border-gray-300');
            this.classList.add('bg-gradient-to-r', 'from-blue-600', 'to-purple-600', 'text-white');
            
            // Apply filter based on button text
            const filterValue = this.textContent.trim();
            filterOpportunities(filterValue);
        });
    });
    
    // Select dropdown functionality
    [categorySelect, statusSelect, prizeSelect, durationSelect].forEach(select => {
        if (select) {
            select.addEventListener('change', function() {
                applyAllFilters();
            });
        }
    });
}

function initializeOpportunitySearch() {
    const searchInput = document.querySelector('input[placeholder*="Search opportunities"]');
    
    if (searchInput) {
        let searchTimeout;
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                const searchTerm = this.value.toLowerCase();
                searchOpportunities(searchTerm);
            }, 300);
        });
    }
}

function initializeLoadMore() {
    const loadMoreBtn = document.querySelector('button:contains("Load More Opportunities")');
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            // Simulate loading more opportunities
            this.innerHTML = `
                <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading...
            `;
            
            // Simulate API call
            setTimeout(() => {
                this.innerHTML = `
                    Load More Opportunities
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                `;
                // Here you would typically load more opportunities from an API
                console.log('Loading more opportunities...');
            }, 1500);
        });
    }
}

function filterOpportunities(filterValue) {
    const opportunityCards = document.querySelectorAll('.opportunity-card');
    
    opportunityCards.forEach(card => {
        const shouldShow = shouldShowOpportunity(card, filterValue);
        card.style.display = shouldShow ? 'block' : 'none';
        
        if (shouldShow) {
            card.style.animation = 'fadeInUp 0.3s ease-out';
        }
    });
}

function shouldShowOpportunity(card, filterValue) {
    const title = card.querySelector('h3').textContent.toLowerCase();
    const organization = card.querySelector('.text-gray-600').textContent.toLowerCase();
    const status = card.querySelector('.rounded-full').textContent.toLowerCase();
    const category = card.querySelector('.bg-gradient-to-r') ? 'featured' : 'regular';
    
    switch (filterValue) {
        case 'All':
            return true;
        case 'Open Now':
            return status.includes('open');
        case 'High Prize':
            const prizeText = card.textContent;
            return prizeText.includes('$100K') || prizeText.includes('$75K') || prizeText.includes('$80K');
        case 'Short Term':
            const durationText = card.textContent;
            return durationText.includes('1-3 months') || durationText.includes('3-6 months');
        case 'Government':
            return organization.includes('ministry') || organization.includes('government') || organization.includes('city hall');
        case 'Corporate':
            return organization.includes('bank') || organization.includes('berhad') || organization.includes('ventures');
        default:
            return true;
    }
}

function searchOpportunities(searchTerm) {
    const opportunityCards = document.querySelectorAll('.opportunity-card');
    
    opportunityCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('p').textContent.toLowerCase();
        const organization = card.querySelector('.text-gray-600').textContent.toLowerCase();
        
        const matches = title.includes(searchTerm) || 
                      description.includes(searchTerm) || 
                      organization.includes(searchTerm);
        
        card.style.display = matches ? 'block' : 'none';
        
        if (matches) {
            card.style.animation = 'fadeInUp 0.3s ease-out';
        }
    });
}

function applyAllFilters() {
    const categorySelect = document.querySelector('select[data-filter="category"]');
    const statusSelect = document.querySelector('select[data-filter="status"]');
    const prizeSelect = document.querySelector('select[data-filter="prize"]');
    const durationSelect = document.querySelector('select[data-filter="duration"]');
    
    const filters = {
        category: categorySelect ? categorySelect.value : '',
        status: statusSelect ? statusSelect.value : '',
        prize: prizeSelect ? prizeSelect.value : '',
        duration: durationSelect ? durationSelect.value : ''
    };
    
    const opportunityCards = document.querySelectorAll('.opportunity-card');
    
    opportunityCards.forEach(card => {
        const shouldShow = applyMultipleFilters(card, filters);
        card.style.display = shouldShow ? 'block' : 'none';
        
        if (shouldShow) {
            card.style.animation = 'fadeInUp 0.3s ease-out';
        }
    });
}

function applyMultipleFilters(card, filters) {
    // This would contain the logic to apply multiple filters simultaneously
    // For now, we'll just return true to show all cards
    return true;
}

function startFeatureAutoPlay() {
    const autoPlayInterval = 4000; // 4 seconds per step
    const progressUpdateInterval = 100; // Update progress every 100ms
    
    // Clear any existing intervals
    stopFeatureAutoPlay();
    
    // Start progress tracking
    featureProgressInterval = setInterval(() => {
        featureProgress += (100 / (autoPlayInterval / progressUpdateInterval));
        
        if (featureProgress >= 100) {
            featureProgress = 0;
            nextFeatureStep();
        }
    }, progressUpdateInterval);
    
    // Start auto-play
    featureInterval = setInterval(() => {
        nextFeatureStep();
    }, autoPlayInterval);
}

function stopFeatureAutoPlay() {
    if (featureInterval) {
        clearInterval(featureInterval);
        featureInterval = null;
    }
    if (featureProgressInterval) {
        clearInterval(featureProgressInterval);
        featureProgressInterval = null;
    }
}

function pauseFeatureAutoPlay() {
    stopFeatureAutoPlay();
}

function resumeFeatureAutoPlay() {
    startFeatureAutoPlay();
}

function resetFeatureAutoPlay() {
    stopFeatureAutoPlay();
    featureProgress = 0;
    startFeatureAutoPlay();
}

function nextFeatureStep() {
    const featureSteps = document.querySelectorAll('.feature-step');
    const totalSteps = featureSteps.length;
    
    currentFeatureStep = (currentFeatureStep + 1) % totalSteps;
    showFeatureStep(currentFeatureStep);
}

function previousFeatureStep() {
    const featureSteps = document.querySelectorAll('.feature-step');
    const totalSteps = featureSteps.length;
    
    currentFeatureStep = currentFeatureStep === 0 ? totalSteps - 1 : currentFeatureStep - 1;
    showFeatureStep(currentFeatureStep);
}

// Add keyboard navigation for feature steps
document.addEventListener('keydown', (e) => {
    const featureSection = document.getElementById('feature-steps');
    if (!featureSection) return;
    
    const rect = featureSection.getBoundingClientRect();
    const isInView = rect.top < window.innerHeight && rect.bottom > 0;
    
    if (!isInView) return;
    
    if (e.key === 'ArrowLeft') {
        e.preventDefault();
        previousFeatureStep();
        resetFeatureAutoPlay();
    } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextFeatureStep();
        resetFeatureAutoPlay();
    }
});

// Intersection Observer for feature steps
function initializeFeatureStepsObserver() {
    const featureSection = document.getElementById('feature-steps');
    if (!featureSection) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Start auto-play when section comes into view
                if (!featureInterval) {
                    startFeatureAutoPlay();
                }
            } else {
                // Pause auto-play when section goes out of view
                pauseFeatureAutoPlay();
            }
        });
    }, {
        threshold: 0.3
    });
    
    observer.observe(featureSection);
}

// Initialize feature steps observer
document.addEventListener('DOMContentLoaded', initializeFeatureStepsObserver);


// Opportunities Page Functions
function initializeOpportunitiesPage() {
    // Only initialize if we're on the opportunities page
    if (!document.querySelector('.opportunities-page')) return;
    
    initializeOpportunityFilters();
    initializeOpportunitySearch();
    initializeLoadMore();
}

function initializeOpportunityFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const categorySelect = document.querySelector('select[data-filter="category"]');
    const statusSelect = document.querySelector('select[data-filter="status"]');
    const prizeSelect = document.querySelector('select[data-filter="prize"]');
    const durationSelect = document.querySelector('select[data-filter="duration"]');
    
    // Filter button functionality
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class and reset styles from all buttons
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.classList.remove('bg-gradient-to-r', 'from-blue-600', 'to-purple-600', 'text-white');
                btn.classList.add('bg-white', 'text-gray-700', 'border', 'border-gray-300');
            });
            
            // Add active class and styles to clicked button
            this.classList.add('active');
            this.classList.remove('bg-white', 'text-gray-700', 'border', 'border-gray-300');
            this.classList.add('bg-gradient-to-r', 'from-blue-600', 'to-purple-600', 'text-white');
            
            // Apply filter based on button text
            const filterValue = this.textContent.trim();
            filterOpportunities(filterValue);
        });
    });
    
    // Select dropdown functionality
    [categorySelect, statusSelect, prizeSelect, durationSelect].forEach(select => {
        if (select) {
            select.addEventListener('change', function() {
                applyAllFilters();
            });
        }
    });
}

function initializeOpportunitySearch() {
    const searchInput = document.querySelector('input[placeholder*="Search opportunities"]');
    
    if (searchInput) {
        let searchTimeout;
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                const searchTerm = this.value.toLowerCase();
                searchOpportunities(searchTerm);
            }, 300);
        });
    }
}

function initializeLoadMore() {
    const loadMoreBtn = document.querySelector('button:contains("Load More Opportunities")');
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            // Simulate loading more opportunities
            this.innerHTML = `
                <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading...
            `;
            
            // Simulate API call
            setTimeout(() => {
                this.innerHTML = `
                    Load More Opportunities
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                `;
                // Here you would typically load more opportunities from an API
                console.log('Loading more opportunities...');
            }, 1500);
        });
    }
}

function filterOpportunities(filterValue) {
    const opportunityCards = document.querySelectorAll('.opportunity-card');
    
    opportunityCards.forEach(card => {
        const shouldShow = shouldShowOpportunity(card, filterValue);
        card.style.display = shouldShow ? 'block' : 'none';
        
        if (shouldShow) {
            card.style.animation = 'fadeInUp 0.3s ease-out';
        }
    });
}

function shouldShowOpportunity(card, filterValue) {
    const title = card.querySelector('h3').textContent.toLowerCase();
    const organization = card.querySelector('.text-gray-600').textContent.toLowerCase();
    const status = card.querySelector('.rounded-full').textContent.toLowerCase();
    const category = card.querySelector('.bg-gradient-to-r') ? 'featured' : 'regular';
    
    switch (filterValue) {
        case 'All':
            return true;
        case 'Open Now':
            return status.includes('open');
        case 'High Prize':
            const prizeText = card.textContent;
            return prizeText.includes('$100K') || prizeText.includes('$75K') || prizeText.includes('$80K');
        case 'Short Term':
            const durationText = card.textContent;
            return durationText.includes('1-3 months') || durationText.includes('3-6 months');
        case 'Government':
            return organization.includes('ministry') || organization.includes('government') || organization.includes('city hall');
        case 'Corporate':
            return organization.includes('bank') || organization.includes('berhad') || organization.includes('ventures');
        default:
            return true;
    }
}

function searchOpportunities(searchTerm) {
    const opportunityCards = document.querySelectorAll('.opportunity-card');
    
    opportunityCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('p').textContent.toLowerCase();
        const organization = card.querySelector('.text-gray-600').textContent.toLowerCase();
        
        const matches = title.includes(searchTerm) || 
                      description.includes(searchTerm) || 
                      organization.includes(searchTerm);
        
        card.style.display = matches ? 'block' : 'none';
        
        if (matches) {
            card.style.animation = 'fadeInUp 0.3s ease-out';
        }
    });
}

function applyAllFilters() {
    const categorySelect = document.querySelector('select[data-filter="category"]');
    const statusSelect = document.querySelector('select[data-filter="status"]');
    const prizeSelect = document.querySelector('select[data-filter="prize"]');
    const durationSelect = document.querySelector('select[data-filter="duration"]');
    
    const filters = {
        category: categorySelect ? categorySelect.value : '',
        status: statusSelect ? statusSelect.value : '',
        prize: prizeSelect ? prizeSelect.value : '',
        duration: durationSelect ? durationSelect.value : ''
    };
    
    const opportunityCards = document.querySelectorAll('.opportunity-card');
    
    opportunityCards.forEach(card => {
        const shouldShow = applyMultipleFilters(card, filters);
        card.style.display = shouldShow ? 'block' : 'none';
        
        if (shouldShow) {
            card.style.animation = 'fadeInUp 0.3s ease-out';
        }
    });
}

function applyMultipleFilters(card, filters) {
    // This would contain the logic to apply multiple filters simultaneously
    // For now, we'll just return true to show all cards
    return true;
}


// Opportunities Page Functions
function initializeOpportunitiesPage() {
    // Only initialize if we're on the opportunities page
    if (!document.querySelector('.opportunities-page')) return;
    
    initializeOpportunityFilters();
    initializeOpportunitySearch();
    initializeLoadMore();
}

function initializeOpportunityFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const categorySelect = document.querySelector('select[data-filter="category"]');
    const statusSelect = document.querySelector('select[data-filter="status"]');
    const prizeSelect = document.querySelector('select[data-filter="prize"]');
    const durationSelect = document.querySelector('select[data-filter="duration"]');
    
    // Filter button functionality
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class and reset styles from all buttons
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.classList.remove('bg-gradient-to-r', 'from-blue-600', 'to-purple-600', 'text-white');
                btn.classList.add('bg-white', 'text-gray-700', 'border', 'border-gray-300');
            });
            
            // Add active class and styles to clicked button
            this.classList.add('active');
            this.classList.remove('bg-white', 'text-gray-700', 'border', 'border-gray-300');
            this.classList.add('bg-gradient-to-r', 'from-blue-600', 'to-purple-600', 'text-white');
            
            // Apply filter based on button text
            const filterValue = this.textContent.trim();
            filterOpportunities(filterValue);
        });
    });
    
    // Select dropdown functionality
    [categorySelect, statusSelect, prizeSelect, durationSelect].forEach(select => {
        if (select) {
            select.addEventListener('change', function() {
                applyAllFilters();
            });
        }
    });
}

function initializeOpportunitySearch() {
    const searchInput = document.querySelector('input[placeholder*="Search opportunities"]');
    
    if (searchInput) {
        let searchTimeout;
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                const searchTerm = this.value.toLowerCase();
                searchOpportunities(searchTerm);
            }, 300);
        });
    }
}

function initializeLoadMore() {
    const loadMoreBtn = document.querySelector('button:contains("Load More Opportunities")');
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            // Simulate loading more opportunities
            this.innerHTML = `
                <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading...
            `;
            
            // Simulate API call
            setTimeout(() => {
                this.innerHTML = `
                    Load More Opportunities
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                `;
                // Here you would typically load more opportunities from an API
                console.log('Loading more opportunities...');
            }, 1500);
        });
    }
}

function filterOpportunities(filterValue) {
    const opportunityCards = document.querySelectorAll('.opportunity-card');
    
    opportunityCards.forEach(card => {
        const shouldShow = shouldShowOpportunity(card, filterValue);
        card.style.display = shouldShow ? 'block' : 'none';
        
        if (shouldShow) {
            card.style.animation = 'fadeInUp 0.3s ease-out';
        }
    });
}

function shouldShowOpportunity(card, filterValue) {
    const title = card.querySelector('h3').textContent.toLowerCase();
    const organization = card.querySelector('.text-gray-600').textContent.toLowerCase();
    const status = card.querySelector('.rounded-full').textContent.toLowerCase();
    const category = card.querySelector('.bg-gradient-to-r') ? 'featured' : 'regular';
    
    switch (filterValue) {
        case 'All':
            return true;
        case 'Open Now':
            return status.includes('open');
        case 'High Prize':
            const prizeText = card.textContent;
            return prizeText.includes('$100K') || prizeText.includes('$75K') || prizeText.includes('$80K');
        case 'Short Term':
            const durationText = card.textContent;
            return durationText.includes('1-3 months') || durationText.includes('3-6 months');
        case 'Government':
            return organization.includes('ministry') || organization.includes('government') || organization.includes('city hall');
        case 'Corporate':
            return organization.includes('bank') || organization.includes('berhad') || organization.includes('ventures');
        default:
            return true;
    }
}

function searchOpportunities(searchTerm) {
    const opportunityCards = document.querySelectorAll('.opportunity-card');
    
    opportunityCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('p').textContent.toLowerCase();
        const organization = card.querySelector('.text-gray-600').textContent.toLowerCase();
        
        const matches = title.includes(searchTerm) || 
                      description.includes(searchTerm) || 
                      organization.includes(searchTerm);
        
        card.style.display = matches ? 'block' : 'none';
        
        if (matches) {
            card.style.animation = 'fadeInUp 0.3s ease-out';
        }
    });
}

function applyAllFilters() {
    const categorySelect = document.querySelector('select[data-filter="category"]');
    const statusSelect = document.querySelector('select[data-filter="status"]');
    const prizeSelect = document.querySelector('select[data-filter="prize"]');
    const durationSelect = document.querySelector('select[data-filter="duration"]');
    
    const filters = {
        category: categorySelect ? categorySelect.value : '',
        status: statusSelect ? statusSelect.value : '',
        prize: prizeSelect ? prizeSelect.value : '',
        duration: durationSelect ? durationSelect.value : ''
    };
    
    const opportunityCards = document.querySelectorAll('.opportunity-card');
    
    opportunityCards.forEach(card => {
        const shouldShow = applyMultipleFilters(card, filters);
        card.style.display = shouldShow ? 'block' : 'none';
        
        if (shouldShow) {
            card.style.animation = 'fadeInUp 0.3s ease-out';
        }
    });
}

function applyMultipleFilters(card, filters) {
    // This would contain the logic to apply multiple filters simultaneously
    // For now, we'll just return true to show all cards
    return true;
}

// Add marketplace search functionality (for future enhancement)
function initializeMarketplaceSearch() {
    const searchInput = document.querySelector('.marketplace-search-input');
    
    if (searchInput) {
        searchInput.addEventListener('input', debounce((e) => {
            const searchTerm = e.target.value.toLowerCase();
            searchMarketplaceItems(searchTerm);
        }, 300));
    }
}

function searchMarketplaceItems(searchTerm) {
    const marketplaceItems = document.querySelectorAll('.marketplace-item');
    
    marketplaceItems.forEach(item => {
        const title = item.querySelector('h3').textContent.toLowerCase();
        const description = item.querySelector('p').textContent.toLowerCase();
        const tags = Array.from(item.querySelectorAll('.inline-flex')).map(tag => tag.textContent.toLowerCase());
        
        const matches = title.includes(searchTerm) || 
                      description.includes(searchTerm) || 
                      tags.some(tag => tag.includes(searchTerm));
        
        if (matches) {
            item.style.display = 'block';
            item.style.animation = 'marketplaceItemFadeIn 0.3s ease-out';
        } else {
            item.style.display = 'none';
        }
    });
}

// Opportunities Page Functions
function initializeOpportunitiesPage() {
    // Only initialize if we're on the opportunities page
    if (!document.querySelector('.opportunities-page')) return;
    
    initializeOpportunityFilters();
    initializeOpportunitySearch();
    initializeLoadMore();
}

function initializeOpportunityFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const categorySelect = document.querySelector('select[data-filter="category"]');
    const statusSelect = document.querySelector('select[data-filter="status"]');
    const prizeSelect = document.querySelector('select[data-filter="prize"]');
    const durationSelect = document.querySelector('select[data-filter="duration"]');
    
    // Filter button functionality
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class and reset styles from all buttons
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.classList.remove('bg-gradient-to-r', 'from-blue-600', 'to-purple-600', 'text-white');
                btn.classList.add('bg-white', 'text-gray-700', 'border', 'border-gray-300');
            });
            
            // Add active class and styles to clicked button
            this.classList.add('active');
            this.classList.remove('bg-white', 'text-gray-700', 'border', 'border-gray-300');
            this.classList.add('bg-gradient-to-r', 'from-blue-600', 'to-purple-600', 'text-white');
            
            // Apply filter based on button text
            const filterValue = this.textContent.trim();
            filterOpportunities(filterValue);
        });
    });
    
    // Select dropdown functionality
    [categorySelect, statusSelect, prizeSelect, durationSelect].forEach(select => {
        if (select) {
            select.addEventListener('change', function() {
                applyAllFilters();
            });
        }
    });
}

function initializeOpportunitySearch() {
    const searchInput = document.querySelector('input[placeholder*="Search opportunities"]');
    
    if (searchInput) {
        let searchTimeout;
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                const searchTerm = this.value.toLowerCase();
                searchOpportunities(searchTerm);
            }, 300);
        });
    }
}

function initializeLoadMore() {
    const loadMoreBtn = document.querySelector('button:contains("Load More Opportunities")');
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            // Simulate loading more opportunities
            this.innerHTML = `
                <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading...
            `;
            
            // Simulate API call
            setTimeout(() => {
                this.innerHTML = `
                    Load More Opportunities
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                `;
                // Here you would typically load more opportunities from an API
                console.log('Loading more opportunities...');
            }, 1500);
        });
    }
}

function filterOpportunities(filterValue) {
    const opportunityCards = document.querySelectorAll('.opportunity-card');
    
    opportunityCards.forEach(card => {
        const shouldShow = shouldShowOpportunity(card, filterValue);
        card.style.display = shouldShow ? 'block' : 'none';
        
        if (shouldShow) {
            card.style.animation = 'fadeInUp 0.3s ease-out';
        }
    });
}

function shouldShowOpportunity(card, filterValue) {
    const title = card.querySelector('h3').textContent.toLowerCase();
    const organization = card.querySelector('.text-gray-600').textContent.toLowerCase();
    const status = card.querySelector('.rounded-full').textContent.toLowerCase();
    const category = card.querySelector('.bg-gradient-to-r') ? 'featured' : 'regular';
    
    switch (filterValue) {
        case 'All':
            return true;
        case 'Open Now':
            return status.includes('open');
        case 'High Prize':
            const prizeText = card.textContent;
            return prizeText.includes('$100K') || prizeText.includes('$75K') || prizeText.includes('$80K');
        case 'Short Term':
            const durationText = card.textContent;
            return durationText.includes('1-3 months') || durationText.includes('3-6 months');
        case 'Government':
            return organization.includes('ministry') || organization.includes('government') || organization.includes('city hall');
        case 'Corporate':
            return organization.includes('bank') || organization.includes('berhad') || organization.includes('ventures');
        default:
            return true;
    }
}

function searchOpportunities(searchTerm) {
    const opportunityCards = document.querySelectorAll('.opportunity-card');
    
    opportunityCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('p').textContent.toLowerCase();
        const organization = card.querySelector('.text-gray-600').textContent.toLowerCase();
        
        const matches = title.includes(searchTerm) || 
                      description.includes(searchTerm) || 
                      organization.includes(searchTerm);
        
        card.style.display = matches ? 'block' : 'none';
        
        if (matches) {
            card.style.animation = 'fadeInUp 0.3s ease-out';
        }
    });
}

function applyAllFilters() {
    const categorySelect = document.querySelector('select[data-filter="category"]');
    const statusSelect = document.querySelector('select[data-filter="status"]');
    const prizeSelect = document.querySelector('select[data-filter="prize"]');
    const durationSelect = document.querySelector('select[data-filter="duration"]');
    
    const filters = {
        category: categorySelect ? categorySelect.value : '',
        status: statusSelect ? statusSelect.value : '',
        prize: prizeSelect ? prizeSelect.value : '',
        duration: durationSelect ? durationSelect.value : ''
    };
    
    const opportunityCards = document.querySelectorAll('.opportunity-card');
    
    opportunityCards.forEach(card => {
        const shouldShow = applyMultipleFilters(card, filters);
        card.style.display = shouldShow ? 'block' : 'none';
        
        if (shouldShow) {
            card.style.animation = 'fadeInUp 0.3s ease-out';
        }
    });
}

function applyMultipleFilters(card, filters) {
    // This would contain the logic to apply multiple filters simultaneously
    // For now, we'll just return true to show all cards
    return true;
}


// Email Subscription Functions
function initializeEmailSubscription() {
    const emailForm = document.getElementById("email-subscription-form");
    const emailInput = document.getElementById("email-input");
    const successMessage = document.getElementById("subscription-success");
    
    if (emailForm) {
        emailForm.addEventListener("submit", function(e) {
            e.preventDefault();
            
            const email = emailInput.value.trim();
            
            if (email && isValidEmail(email)) {
                handleEmailSubscription(email, emailForm, successMessage);
            } else {
                showEmailError("Please enter a valid email address.");
            }
        });
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function handleEmailSubscription(email, form, successMessage) {
    const submitButton = form.querySelector("button[type=\"submit\"]");
    const originalButtonContent = submitButton.innerHTML;
    
    // Show loading state
    submitButton.innerHTML = `
        <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Subscribing...
    `;
    submitButton.disabled = true;
    
    // Simulate API call (replace with actual API call)
    setTimeout(() => {
        // Reset button
        submitButton.innerHTML = originalButtonContent;
        submitButton.disabled = false;
        
        // Show success message
        successMessage.classList.remove("hidden");
        form.reset();
        
        // Hide success message after 5 seconds
        setTimeout(() => {
            successMessage.classList.add("hidden");
        }, 5000);
        
        // Track subscription (optional analytics)
        console.log("Email subscription:", email);
        
    }, 1500);
}

function showEmailError(message) {
    // You can implement a toast notification or error display here
    alert(message);
}
