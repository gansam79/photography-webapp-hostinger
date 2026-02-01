// React-compatible initialization script
// This replaces the functionality from main.js but works with React

// Initialize AOS (Animate On Scroll) when React components mount
const initializeVendorLibraries = () => {
  // AOS initialization
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }

  // GLightbox initialization
  if (typeof GLightbox !== 'undefined') {
    const lightbox = GLightbox({
      selector: '.glightbox'
    });
  }

  // Swiper initialization (if needed)
  if (typeof Swiper !== 'undefined') {
    // Initialize any Swiper instances
    const swipers = document.querySelectorAll('.swiper');
    swipers.forEach(swiperElement => {
      new Swiper(swiperElement, {
        loop: true,
        speed: 600,
        autoplay: {
          delay: 5000
        },
        slidesPerView: 'auto',
        pagination: {
          el: '.swiper-pagination',
          type: 'bullets',
          clickable: true
        }
      });
    });
  }
};

// Header scroll effect for React
const handleHeaderScroll = () => {
  const header = document.querySelector('#header');
  if (header) {
    if (window.scrollY > 100) {
      header.classList.add('header-scrolled');
    } else {
      header.classList.remove('header-scrolled');
    }
  }
};

// Mobile navigation toggle
const initializeMobileNav = () => {
  const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
  
  if (mobileNavToggle) {
    mobileNavToggle.addEventListener('click', () => {
      const navbar = document.querySelector('#navbar');
      if (navbar) {
        navbar.classList.toggle('navbar-mobile');
        mobileNavToggle.classList.toggle('bi-list');
        mobileNavToggle.classList.toggle('bi-x');
      }
    });
  }
  
  // Close mobile nav when clicking on nav links
  const navLinks = document.querySelectorAll('#navbar a');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      const navbar = document.querySelector('#navbar');
      const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
      if (navbar && navbar.classList.contains('navbar-mobile')) {
        navbar.classList.remove('navbar-mobile');
        if (mobileNavToggle) {
          mobileNavToggle.classList.add('bi-list');
          mobileNavToggle.classList.remove('bi-x');
        }
      }
    });
  });
};

// Export functions for React components to use
window.ReactHelpers = {
  initializeVendorLibraries,
  handleHeaderScroll,
  initializeMobileNav
};

// Auto-initialize when DOM is ready (for non-React elements)
document.addEventListener('DOMContentLoaded', () => {
  initializeVendorLibraries();
  initializeMobileNav();
  
  // Add scroll event listener for header
  window.addEventListener('scroll', handleHeaderScroll);
});