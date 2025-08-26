// script.js
// Create falling stars - FIXED VERSION
function createStars() {
    let starsContainer = document.querySelector('.stars-container');
    
    // Create container if it doesn't exist
    if (!starsContainer) {
        starsContainer = document.createElement('div');
        starsContainer.className = 'stars-container';
        document.body.appendChild(starsContainer);
    }
    
    // Clear existing stars
    starsContainer.innerHTML = '';
    
    // Create 150 stars (more for better effect)
    for (let i = 0; i < 150; i++) {
        createStar(starsContainer);
    }
}

function createStar(container) {
    const star = document.createElement('div');
    const size = Math.random() * 3;
    
    // Assign size class
    if (size < 1) {
        star.className = 'star small';
    } else if (size < 2) {
        star.className = 'star medium';
    } else {
        star.className = 'star large';
    }
    
    // Random position
    star.style.left = `${Math.random() * 100}vw`;
    star.style.top = `${Math.random() * -100}px`; // Start above viewport
    
    // Random animation duration (2-6 seconds)
    const duration = 2 + Math.random() * 4;
    star.style.animationDuration = `${duration}s`;
    
    // Random delay
    star.style.animationDelay = `${Math.random() * 2}s`;
    
    container.appendChild(star);
    
    // Remove star after animation completes and create a new one
    star.addEventListener('animationend', () => {
        if (star.parentNode === container) {
            star.remove();
            createStar(container);
        }
    });
}

// Animate certificates with 3D rotation
function animateCertificates() {
    const certCards = document.querySelectorAll('.cert-card');
    
    // Remove animation class first
    certCards.forEach(card => {
        card.classList.remove('animate');
    });
    
    // Force reflow to reset animation
    void document.body.offsetHeight;
    
    // Animate each certificate card with delay
    certCards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('animate');
        }, index * 200);
    });
    
    // Remove animation class after completion to allow re-animation
    setTimeout(() => {
        certCards.forEach(card => {
            card.classList.remove('animate');
        });
    }, 4000);
}

// Animate skills with 3D rotation
function animateSkills() {
    const skillItems = document.querySelectorAll('.skill-item');
    
    // Remove animation class first
    skillItems.forEach(skill => {
        skill.classList.remove('animate');
    });
    
    // Force reflow to reset animation
    void document.body.offsetHeight;
    
    // Animate each skill item with delay
    skillItems.forEach((skill, index) => {
        setTimeout(() => {
            skill.classList.add('animate');
        }, index * 100);
    });
    
    // Remove animation class after completion to allow re-animation
    setTimeout(() => {
        skillItems.forEach(skill => {
            skill.classList.remove('animate');
        });
    }, 3000);
}

// Smooth scroll to section
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const headerOffset = 100;
        const elementPosition = section.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
        
        // Animate sections based on which one we're scrolling to
        if (sectionId === 'certificates') {
            setTimeout(animateCertificates, 800);
        } else if (sectionId === 'skills') {
            setTimeout(animateSkills, 800);
        }
    }
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
        rect.bottom >= 0
    );
}

// Initialize everything when page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded - initializing animations');
    
    // Create stars first
    createStars();
    
    // Update copyright year
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Mobile menu functionality
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = hamburger.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Close mobile menu when a link is clicked
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                const targetId = link.getAttribute('href').substring(1);
                
                // Close mobile menu
                navMenu.classList.remove('active');
                const icon = hamburger.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                
                // Scroll to section with animation
                scrollToSection(targetId);
            });
        });
    }
    
    // Animate sections when they come into view on scroll
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const sectionsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                console.log('Section in view:', entry.target.id);
                if (entry.target.id === 'certificates') {
                    animateCertificates();
                } else if (entry.target.id === 'skills') {
                    animateSkills();
                }
            }
        });
    }, observerOptions);
    
    // Observe both skills and certificates sections
    const skillsSection = document.getElementById('skills');
    const certsSection = document.getElementById('certificates');
    
    if (skillsSection) {
        sectionsObserver.observe(skillsSection);
        console.log('Observing skills section');
    }
    if (certsSection) {
        sectionsObserver.observe(certsSection);
        console.log('Observing certificates section');
    }
    
    // Animate skills immediately on load if they're visible
    if (skillsSection && isInViewport(skillsSection)) {
        console.log('Skills visible on load - animating');
        setTimeout(animateSkills, 500);
    }
    
    // Animate certificates immediately on load if they're visible
    if (certsSection && isInViewport(certsSection)) {
        console.log('Certificates visible on load - animating');
        setTimeout(animateCertificates, 500);
    }
    
    // Manual animation triggers for testing
    window.animateAll = function() {
        animateSkills();
        animateCertificates();
    };
});

// Recreate stars on window resize and scroll
window.addEventListener('resize', () => {
    setTimeout(createStars, 100);
});

// Add scroll event to recreate stars if they disappear
let lastScrollY = window.scrollY;
window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    
    // Recreate stars if scrolled significantly
    if (Math.abs(currentScrollY - lastScrollY) > 500) {
        createStars();
        lastScrollY = currentScrollY;
    }
});

// Fix for stars not showing on some browsers
window.addEventListener('load', () => {
    setTimeout(createStars, 1000);
});

// Fallback: Recreate stars every 30 seconds to prevent them from disappearing
setInterval(createStars, 30000);

// Debug function to check if stars are working
window.checkStars = function() {
    const stars = document.querySelectorAll('.star');
    console.log(`Total stars: ${stars.length}`);
    stars.forEach((star, index) => {
        console.log(`Star ${index + 1}:`, star.style.animationDuration, star.style.animationDelay);
    });
};