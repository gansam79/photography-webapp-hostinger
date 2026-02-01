

(function() {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }
  if (mobileNavToggleBtn) {
    mobileNavToggleBtn.addEventListener('click', mobileNavToogle);
  }

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Initiate Pure Counter
   */
  new PureCounter();

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }



  
  document.querySelectorAll('.open-story').forEach(btn => {
  btn.addEventListener('click', function () {

    const storyKey = this.getAttribute("data-story");
    const story = storyData[storyKey];

    document.getElementById("modalContent").innerHTML = `
      <h2 class="text-center fw-bolder">${story.title}</h2>
      <h5 class="text-center text-muted accent-color">${story.subtitle}</h5>
      <div class="section-title pb-0"><h2></h2></div>
      <p class="mt-3 mb-5 text-center">${story.description}</p>

      <div class="row g-3">
        ${story.images.map(img => `
          <div class="col-md-6">
            <img src="${img}" class="img-fluid rounded shadow-sm" />
          </div>
        `).join("")}
      </div>
    `;

    // Show Bootstrap modal
    let myModal = new bootstrap.Modal(document.getElementById('storyModal'));
    myModal.show();
  });
});

const storyData = {
  "komal-kunal": {
    title: "Komal & Kunal",
    subtitle: "The Golden Leaf Resort, Dhule",
    description: `
      KKomal and Kunal’s journey is a beautiful blend of warmth, destiny, and heartfelt moments. What began as a simple connection slowly grew into a bond filled with trust, understanding, and companionship. Their love strengthened through shared dreams, thoughtful conversations, and unwavering support. Together, they continue to create memories that reflect a deep, genuine, and lifelong commitment.
    `,
    images: [
      "assets/img/HomePage/11.webp",
      "assets/img/HomePage/18.webp",
      "assets/img/HomePage/11.webp",
      "assets/img/HomePage/18.webp",
      "assets/img/HomePage/11.webp",
      "assets/img/HomePage/18.webp",
      "assets/img/HomePage/11.webp",
      "assets/img/HomePage/18.webp",
      "assets/img/HomePage/11.webp",
      "assets/img/HomePage/18.webp",
      "assets/img/HomePage/11.webp",
      "assets/img/HomePage/18.webp",
      "assets/img/HomePage/11.webp",
      "assets/img/HomePage/18.webp",
    ]
  }
};



  window.addEventListener("load", initSwiper);

})();