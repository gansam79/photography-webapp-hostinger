const { useState, useEffect } = React;
const { BrowserRouter, Routes, Route, Link, useNavigate } = window.ReactRouterDOM || ReactRouterDOM;

// Simple components
const Header = () => {
  return (
    <header id="header" className="header d-flex align-items-center fixed-top">
      <div className="container-fluid container-xl position-relative d-flex align-items-center">
        
        <Link to="/" className="logo d-flex align-items-center me-auto">
          <img src="assets/img/logo.png" alt="" />
          <h1 className="sitename">The Patil Photography & Film's</h1>
        </Link>

        <nav id="navmenu" className="navmenu">
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/services">Portfolio</Link></li>
            <li><Link to="/projects">Stories</Link></li>
            <li><Link to="/team">Films</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
          </ul>
          <i className="mobile-nav-toggle d-xl-none bi bi-list"></i>
        </nav>

      </div>
    </header>
  );
};

const Footer = () => {
  return (
    <footer id="footer" className="footer dark-background">
      <div className="container">
        <div className="row gy-5">
          
          <div className="col-lg-4">
            <div className="footer-brand">
              <Link to="/" className="logo d-flex align-items-center mb-3">
                <span className="sitename"> The Patil Photography & Film's</span>
              </Link>
              <p className="tagline">Preserving Pure Emotion in Every Frame.</p>

              <div className="social-links mt-4">
                <a href="#" aria-label="Facebook"><i className="bi bi-facebook"></i></a>
                <a href="#" aria-label="Instagram"><i className="bi bi-instagram"></i></a>
                <a href="#" aria-label="LinkedIn"><i className="bi bi-linkedin"></i></a>
                <a href="#" aria-label="Twitter"><i className="bi bi-twitter-x"></i></a>
                <a href="#" aria-label="Dribbble"><i className="bi bi-dribbble"></i></a>
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="footer-links-grid">
              <div className="row">
                <div className="col-6 col-md-4">
                  <h5>Company</h5>
                  <ul className="list-unstyled">
                    <li><Link to="/about">About Us</Link></li>
                    <li><Link to="/team">Our Team</Link></li>
                    <li><a href="#">Careers</a></li>
                    <li><a href="#">Newsroom</a></li>
                  </ul>
                </div>
                <div className="col-6 col-md-4">
                  <h5>Services</h5>
                  <ul className="list-unstyled">
                    <li><Link to="/services">Wedding Photography</Link></li>
                    <li><Link to="/services">Portrait Sessions</Link></li>
                    <li><Link to="/services">Event Coverage</Link></li>
                    <li><Link to="/services">Commercial Work</Link></li>
                  </ul>
                </div>
                <div className="col-6 col-md-4">
                  <h5>Support</h5>
                  <ul className="list-unstyled">
                    <li><a href="#">Help Center</a></li>
                    <li><Link to="/contact">Contact Us</Link></li>
                    <li><Link to="/privacy">Privacy Policy</Link></li>
                    <li><Link to="/terms">Terms of Service</Link></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-2">
            <div className="footer-cta">
              <h5>Let's Connect</h5>
              <Link to="/contact" className="btn btn-outline">Get in Touch</Link>
            </div>
          </div>

        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="footer-bottom-content">
                <p className="mb-0">© <span className="sitename">The Patil Photography & Film's</span>. All rights reserved.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Home page component with full content
const Home = () => {
  useEffect(() => {
    document.body.className = 'index-page';
    
    // Initialize AOS if available
    if (window.AOS) {
      AOS.init();
    }
    
    return () => {
      document.body.className = '';
    };
  }, []);

  return (
    <>
      <Header />
      
      <main className="main">
        {/* Hero Section */}
        <section id="hero" className="hero section dark-background">
          <div className="hero-video-container">
            <img src="assets/img/slider/hero6.jpg" className="img-fluid" alt="" />
            <div className="hero-overlay"></div>
          </div>

          <div className="container" data-aos="fade-up" data-aos-delay="100">
            <div className="row justify-content-center text-center">
              <div className="col-lg-8">
                <div className="hero-content">
                  <h1 data-aos="fade-up" data-aos-delay="200">Where Dreams Meet Reality</h1>
                  <p data-aos="fade-up" data-aos-delay="300">
                    Capturing your most precious moments with elegance and grace.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="about section">
          <div className="container" data-aos="fade-up" data-aos-delay="100">
            <div className="row align-items-center">
              
              <div className="col-lg-6 order-2 order-lg-1" data-aos="fade-right" data-aos-delay="200">
                <div className="content section-title">
                  <h2 className="section-heading mb-4 text-center section-title" data-aos="fade-up">
                    Preserving Pure Emotion in Every Frame
                  </h2>

                  <p className="description-text my-3 text-left">
                    Welcome to <span>The Patil Photography & Film's,</span> where every love story is transformed
                    into an elegant visual masterpiece. We believe that every couple shares a unique bond, and our 
                    passion lies in capturing the emotions, details, and unspoken moments that define your journey.
                  </p>

                  <p className="description-text mb-3 text-left">
                    With a refined blend of creativity and authenticity, we preserve heartfelt smiles, gentle glances, 
                    and the timeless charm that unfolds throughout your special day. From grand celebrations to intimate 
                    memories, our craft is dedicated to telling stories that reflect your love, connection, and personality.
                  </p>

                  <div className="cta-section text-lg-start" data-aos="fade-up" data-aos-delay="450">
                    <Link to="/services" className="cta-link">
                      Explore Our Services
                      <i className="bi bi-arrow-right ms-2"></i>
                    </Link>
                  </div>
                </div>
              </div>

              <div className="col-lg-6 order-1 order-lg-2" data-aos="fade-left" data-aos-delay="200">
                <div className="image-section mx-5 my-5">
                  <div className="main-image">
                    <img src="assets/img/HomePage/7.webp" alt="showcase" />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="testimonials section">
          <div className="container section-title" data-aos="fade-up">
            <h2>From the Hearts of Our Couples</h2>
          </div>

          <div className="container">
            <div className="testimonial-masonry">
              
              <div className="testimonial-item" data-aos="fade-up">
                <div className="testimonial-content">
                  <div className="quote-pattern">
                    <i className="bi bi-quote"></i>
                  </div>
                  <p>
                    "Every picture from our wedding felt like a movie scene. <strong>The Patil Photography</strong> team
                    captured not just our moments but our emotions. Their attention to detail, lighting, and storytelling is
                    pure luxury. We'll treasure these memories forever."
                  </p>
                  <div className="client-info">
                    <div className="client-image">
                      <img src="assets/img/HomePage/profile-icon.png" alt="Client" />
                    </div>
                    <div className="client-details">
                      <h3>Riya & Kunal</h3>
                      <span className="position">Mumbai</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="testimonial-item highlight" data-aos="fade-up" data-aos-delay="100">
                <div className="testimonial-content">
                  <div className="quote-pattern">
                    <i className="bi bi-quote"></i>
                  </div>
                  <p>
                    "<strong>The Patil Photography and Film's</strong> made our wedding look like a film — every frame
                    spoke of love, grace, and timelessness. Their professionalism, creativity, and luxury touch made our big
                    day unforgettable."
                  </p>
                  <div className="client-info">
                    <div className="client-image">
                      <img src="assets/img/HomePage/profile-icon.png" alt="Client" />
                    </div>
                    <div className="client-details">
                      <h3>Simran & Dev</h3>
                      <span className="position">Nashik</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="testimonial-item" data-aos="fade-up" data-aos-delay="200">
                <div className="testimonial-content">
                  <div className="quote-pattern">
                    <i className="bi bi-quote"></i>
                  </div>
                  <p>
                    "From the first meeting to our final album, everything was seamless and classy. The team made us feel
                    so comfortable, and the final photos were beyond beautiful — elegant, cinematic, and full of heart. It
                    truly felt like we were part of an exclusive experience."
                  </p>
                  <div className="client-info">
                    <div className="client-image">
                      <img src="assets/img/HomePage/profile-icon.png" alt="Client" />
                    </div>
                    <div className="client-details">
                      <h3>Aarav & Meera</h3>
                      <span className="position">Pune</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Quote Section */}
        <section className="container px-5 pt-4" data-aos="fade-up" data-aos-delay="200">
          <h2 className="text-center Quite py-2">
            "Love's journey is written in small moments — the smiles, the glances, the warmth —
            each deserving to be held forever."
          </h2>
        </section>

        {/* Projects Section */}
        <section id="projects" className="projects section pt-3">
          <div className="container section-title text-center" data-aos="fade-up">
            <h2>Our Latest Love Stories</h2>
            <div className="d-flex justify-content-center">
              <p className="w-50 d-block text-center">
                Every couple carries a beautiful story of their own, and it's our privilege to capture those 
                timeless moments meant to be cherished for generations.
              </p>
            </div>
          </div>

          <div className="container" data-aos="fade-up" data-aos-delay="100">
            <div className="row gy-4">
              
              <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="100">
                <div className="project-card">
                  <div className="project-image">
                    <img src="assets/img/HomePage/16.webp" alt="Project" className="img-fluid" />
                  </div>
                  <div className="project-info">
                    <h4 className="project-title">Aanya & Rohit</h4>
                    <p className="project-description">
                      Aanya and Rohit's journey began in Mumbai, where an unexpected meeting grew into a deep, 
                      effortless connection Their contrasting personalities.....
                    </p>
                    <div className="cta-section text-md-start" data-aos="fade-up" data-aos-delay="150">
                      <Link to="/projects" className="cta-link">
                        View Story
                        <i className="bi bi-arrow-right ms-2"></i>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="200">
                <div className="project-card">
                  <div className="project-image">
                    <img src="assets/img/HomePage/128.webp" alt="Project" className="img-fluid" />
                  </div>
                  <div className="project-info">
                    <h4 className="project-title">Riya & Kunal</h4>
                    <p className="project-description">
                      Riya and Kunal's love story began with a simple conversation that felt unexpectedly special. 
                      What started as friendship soon blossomed into a deep....
                    </p>
                    <div className="cta-section text-md-start" data-aos="fade-up" data-aos-delay="150">
                      <Link to="/projects" className="cta-link">
                        View Story
                        <i className="bi bi-arrow-right ms-2"></i>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="300">
                <div className="project-card">
                  <div className="project-image">
                    <img src="assets/img/HomePage/7.webp" alt="Project" className="img-fluid" />
                  </div>
                  <div className="project-info">
                    <h4 className="project-title">Aarav & Meera</h4>
                    <p className="project-description">
                      Aarav and Meera's story began with a connection that felt instantly comforting. Their shared values, 
                      effortless conversations, and genuine care brought....
                    </p>
                    <div className="cta-section text-md-start" data-aos="fade-up" data-aos-delay="150">
                      <Link to="/projects" className="cta-link">
                        View Story
                        <i className="bi bi-arrow-right ms-2"></i>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

            </div>
            
            <div className="d-flex justify-content-center">
              <Link to="/projects" className="submit-btn">
                <span>View All Stories</span>
                <i className="bi bi-arrow-right"></i>
              </Link>
            </div>
          </div>
        </section>

        {/* Instagram Section */}
        <section id="about" className="about section">
          <div className="container" data-aos="fade-up" data-aos-delay="100">
            <div className="container section-title" data-aos="fade-up">
              <h2>As Seen on Instagram</h2>
            </div>
          </div>
        </section>

      </main>

      <Footer />

      {/* Scroll Top Button */}
      <a href="#" id="scroll-top" className="scroll-top d-flex align-items-center justify-content-center">
        <i className="bi bi-arrow-up-short"></i>
      </a>

      {/* Preloader */}
      <div id="preloader"></div>
    </>
  );
};

// Simple placeholder components for other pages that need full conversion
const About = () => (
  <>
    <Header />
    <main className="main">
      <div className="page-title light-background">
        <div className="container">
          <h1>About Us</h1>
          <nav className="breadcrumbs">
            <ol>
              <li><Link to="/">Home</Link></li>
              <li className="current">About</li>
            </ol>
          </nav>
        </div>
      </div>
      <section className="section">
        <div className="container">
          <h2>About The Patil Photography & Film's</h2>
          <p>Full about page content will be loaded here from the individual component files.</p>
          <Link to="/quote" className="btn btn-primary">Get Quote</Link>
        </div>
      </section>
    </main>
    <Footer />
  </>
);

const Services = () => (
  <>
    <Header />
    <main className="main">
      <div className="page-title light-background">
        <div className="container">
          <h1>Our Services</h1>
          <nav className="breadcrumbs">
            <ol>
              <li><Link to="/">Home</Link></li>
              <li className="current">Services</li>
            </ol>
          </nav>
        </div>
      </div>
      <section className="section">
        <div className="container">
          <h2>Photography Services</h2>
          <p>Complete services listing will be loaded from individual component files.</p>
          <Link to="/quote" className="btn btn-primary">Request Quote</Link>
        </div>
      </section>
    </main>
    <Footer />
  </>
);

const Projects = () => (
  <>
    <Header />
    <main className="main">
      <div className="page-title light-background">
        <div className="container">
          <h1>Our Projects</h1>
          <nav className="breadcrumbs">
            <ol>
              <li><Link to="/">Home</Link></li>
              <li className="current">Projects</li>
            </ol>
          </nav>
        </div>
      </div>
      <section className="section">
        <div className="container">
          <h2>Photo Gallery</h2>
          <p>Full project gallery will be loaded from individual component files.</p>
          <Link to="/contact" className="btn btn-primary">Contact Us</Link>
        </div>
      </section>
    </main>
    <Footer />
  </>
);

const Team = () => (
  <>
    <Header />
    <main className="main">
      <div className="page-title light-background">
        <div className="container">
          <h1>Our Team</h1>
          <nav className="breadcrumbs">
            <ol>
              <li><Link to="/">Home</Link></li>
              <li className="current">Team</li>
            </ol>
          </nav>
        </div>
      </div>
      <section className="section">
        <div className="container">
          <h2>Meet Our Team</h2>
          <p>Team member details will be loaded from individual component files.</p>
          <Link to="/contact" className="btn btn-primary">Get in Touch</Link>
        </div>
      </section>
    </main>
    <Footer />
  </>
);

const Contact = () => (
  <>
    <Header />
    <main className="main">
      <div className="page-title light-background">
        <div className="container">
          <h1>Contact Us</h1>
          <nav className="breadcrumbs">
            <ol>
              <li><Link to="/">Home</Link></li>
              <li className="current">Contact</li>
            </ol>
          </nav>
        </div>
      </div>
      <section className="section">
        <div className="container">
          <h2>Get in Touch</h2>
          <p>Contact form will be loaded from individual component files.</p>
        </div>
      </section>
    </main>
    <Footer />
  </>
);

const Quote = () => (
  <>
    <Header />
    <main className="main">
      <div className="page-title light-background">
        <div className="container">
          <h1>Request Quote</h1>
          <nav className="breadcrumbs">
            <ol>
              <li><Link to="/">Home</Link></li>
              <li className="current">Quote</li>
            </ol>
          </nav>
        </div>
      </div>
      <section className="section">
        <div className="container">
          <h2>Get Your Custom Quote</h2>
          <p>Quote form will be loaded from individual component files.</p>
        </div>
      </section>
    </main>
    <Footer />
  </>
);

// Main App component
const App = () => {
  useEffect(() => {
    // Initialize vendor libraries after React app loads
    if (window.ReactHelpers) {
      window.ReactHelpers.initializeVendorLibraries();
      window.ReactHelpers.initializeMobileNav();
    }
    
    // Initialize AOS
    if (window.AOS) {
      AOS.init({
        duration: 600,
        easing: 'ease-in-out',
        once: true,
        mirror: false
      });
    }

    // Header scroll effect
    const handleScroll = () => {
      const header = document.querySelector('#header');
      if (header) {
        if (window.scrollY > 100) {
          header.classList.add('header-scrolled');
        } else {
          header.classList.remove('header-scrolled');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/services" element={<Services />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/team" element={<Team />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/quote" element={<Quote />} />
      <Route path="*" element={<Home />} />
    </Routes>
  );
};

// Render the app
ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);