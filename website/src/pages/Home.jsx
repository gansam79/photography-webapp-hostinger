import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import StoryModal from "../components/StoryModal";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Skeleton from "../components/Skeleton";
import TributeModal from "../components/TributeModal";

// Simple CountUp Component
const Counter = ({ end, duration = 2000, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (countRef.current) observer.observe(countRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    let start = 0;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.ceil(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isVisible, end, duration]);

  return <span ref={countRef}>{count}{suffix}</span>;
};

const Home = () => {
  console.log("Home component rendering");
  const [slides, setSlides] = useState([]);
  const [loadingSlider, setLoadingSlider] = useState(true);
  const [loadingStories, setLoadingStories] = useState(true);
  const [loadingTestimonials, setLoadingTestimonials] = useState(true);
  const [loadingInstagram, setLoadingInstagram] = useState(true);
  const [loveStories, setLoveStories] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedStory, setSelectedStory] = useState(null);
  const [instagramPosts, setInstagramPosts] = useState([]);
  const [showTribute, setShowTribute] = useState(false);
  // Pop up
  useEffect(() => {
    // Show tribute popup automatically on home page load (ALWAYS for now)
    const timer = setTimeout(() => {
      setShowTribute(true);
      // sessionStorage.setItem("hasSeenTributeWeb", "true"); // Disabled for testing
    }, 1500);
    return () => clearTimeout(timer);
  }, []);
  // Pop up end 
  useEffect(() => {
    // Fetch Slider
    fetch("/api/slider")
      .then((res) => res.json())
      .then((data) => {
        const activeSlides = data.filter((s) => s.status === "Active");
        if (activeSlides.length > 0) {
          setSlides(
            activeSlides.map((s) => ({
              image: s.image,
              title: s.title,
              subtitle: s.subtitle || "Capturing moments...",
            })),
          );
        }
      })
      .catch((err) => console.error("Error fetching slider:", err))
      .finally(() => setLoadingSlider(false));

    // Fetch Love Stories
    fetch("/api/love-stories")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setLoveStories(data.filter((s) => s.status === "Active"));
        }
      })
      .catch((err) => console.error("Error fetching love stories:", err))
      .finally(() => setLoadingStories(false));

    // Fetch Testimonials
    fetch("/api/testimonials?type=active")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setTestimonials(data); // Controller already filters active
        }
      })
      .catch((err) => console.error("Error fetching testimonials:", err))
      .finally(() => setLoadingTestimonials(false));
  }, []);
  useEffect(() => {
    let preloaderTimeout;
    let aosTimeout;
    try {
      // Set body class
      document.body.className = "index-page";

      // Hide preloader after component mounts
      const preloader = document.getElementById("preloader");
      if (preloader) {
        preloaderTimeout = setTimeout(() => {
          if (preloader && preloader.parentNode) {
            preloader.style.display = "none";
          }
        }, 500);
      }

      // Initialize AOS if available
      if (typeof window !== "undefined" && window.AOS) {
        window.AOS.init({
          duration: 600,
          easing: "ease-in-out",
          once: true,
          mirror: false,
        });

        // Refresh AOS after a short delay to ensure all elements are rendered
        aosTimeout = setTimeout(() => {
          if (window.AOS) {
            window.AOS.refresh();
          }
        }, 100);
      }

      // Fetch Instagram posts
      const fetchInstagramPosts = async () => {
        const accessToken =
          import.meta.env.VITE_INSTAGRAM_ACCESS_TOKEN ||
          import.meta.env.REACT_APP_INSTAGRAM_ACCESS_TOKEN ||
          "YOUR_INSTAGRAM_ACCESS_TOKEN";
        const accountId =
          import.meta.env.VITE_INSTAGRAM_ACCOUNT_ID ||
          import.meta.env.REACT_APP_INSTAGRAM_ACCOUNT_ID ||
          "YOUR_INSTAGRAM_ACCOUNT_ID";
        if (
          accessToken === "YOUR_INSTAGRAM_ACCESS_TOKEN" ||
          accountId === "YOUR_INSTAGRAM_ACCOUNT_ID"
        ) {
          console.log(
            "Please set your Instagram access token and account ID in environment variables",
          );
          setLoadingInstagram(false);
          return;
        }
        try {
          const response = await fetch(
            `https://graph.facebook.com/v18.0/${accountId}/media?fields=id,media_type,media_url,permalink,caption&access_token=${accessToken}`,
          );
          const data = await response.json();
          if (data.data) {
            setInstagramPosts(
              data.data
                .filter((post) => post.media_type === "IMAGE")
                .slice(0, 6),
            );
          }
        } catch (error) {
          console.error("Error fetching Instagram posts:", error);
        } finally {
          setLoadingInstagram(false);
        }
      };
      fetchInstagramPosts();

      // Initialize other vendor libraries
      if (typeof window !== "undefined") {
        // Initialize GLightbox
        if (window.GLightbox) {
          const lightbox = window.GLightbox({
            selector: ".glightbox",
          });
        }
      }
    } catch (error) {
      console.error("Error in Home useEffect:", error);
    }

    return () => {
      if (preloaderTimeout) clearTimeout(preloaderTimeout);
      if (aosTimeout) clearTimeout(aosTimeout);
      document.body.className = "";
    };
  }, []);

  return (
    <>
      <Header />
      {/* Pop up */}
      <TributeModal isOpen={showTribute} onClose={() => setShowTribute(false)} />
      {/* Pop up end */}
      <main className="main">
        {/* Hero Section */}
        <section id="hero" className="hero dark-background">
          {loadingSlider || slides.length === 0 ? (
            <div className="hero-video-container" style={{ position: "relative", height: "100vh" }}>
              <img
                src="/assets/img/slider/hero6.jpg"
                className="img-fluid"
                alt="Beauty of Photography"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  position: "absolute",
                  top: 0,
                  left: 0,
                }}
              />
              <div className="hero-overlay"></div>
              <div
                className="container hfull d-flex align-items-center justify-content-center"
                style={{ position: "relative", zIndex: 2, height: "100%" }}
                data-aos="fade-up"
                data-aos-delay="100"
              >
                <div className="row justify-content-center text-center">
                  <div className="col-lg-8">
                    <div className="hero-content">
                      <h1 data-aos="fade-up" data-aos-delay="200" className="gold-text-gradient">
                        Capture the Moment
                      </h1>
                      <p data-aos="fade-up" data-aos-delay="300">
                        Preserving memories that last a lifetime
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <Swiper
              key={slides.length}
              modules={[Autoplay, Navigation]}
              autoplay={{ delay: 5000, disableOnInteraction: true }}
              loop={slides.length > 1}
              navigation={slides.length > 1}
              allowTouchMove={slides.length > 1}
              className="hero-slider"
            >
              {slides.map((slide, index) => (
                <SwiperSlide key={index}>
                  <div className="hero-video-container">
                    <img src={slide.image} className="img-fluid ken-burns" alt="" />
                    <div className="hero-overlay"></div>
                  </div>

                  <div
                    className="container hfull"
                    data-aos="fade-up"
                    data-aos-delay="100"
                  >
                    <div className="row justify-content-center text-center">
                      <div className="col-lg-8">
                        <div className="hero-content">
                          <h1 className="gold-text-gradient animate-reveal" style={{ animationDelay: '0.2s' }}>
                            {slide.title}
                          </h1>
                          <p className="animate-reveal" style={{ animationDelay: '0.4s' }}>
                            {slide.subtitle}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </section>

        {/* About Section */}
        <section id="about" className="about section">
          <div className="container" data-aos="fade-up" data-aos-delay="100">
            <div className="row align-items-center">
              <div
                className="col-lg-6 order-2 order-lg-1"
                data-aos="fade-right"
                data-aos-delay="200"
              >
                <div className="content section-title">
                  <h2
                    className="section-heading mb-4 text-center section-title"
                    data-aos="fade-up"
                  >
                    Preserving Pure Emotion in Every Frame
                  </h2>

                  <p className="description-text my-3 text-left">
                    Welcome to <span>The Patil Photography & Film's</span>. We believe that every love story is a masterpiece waiting to be unveiled. Our passion lies in capturing the fleeting, unscripted moments—the quiet glances, the joyful tears, and the timeless elegance of your celebration.
                  </p>

                  <p className="description-text mb-4 text-left">
                    With a cinematic approach and an eye for fine art, we transform your special day into a visual legacy, preserving the purity of your emotions for generations to come.
                  </p>

                  <div
                    className="cta-section text-lg-start"
                    data-aos="fade-up"
                    data-aos-delay="450"
                  >
                    <Link to="/portfolio" className="cta-link">
                      Explore Our Services
                      <i className="bi bi-arrow-right ms-2"></i>
                    </Link>
                  </div>
                </div>
              </div>

              <div
                className="col-lg-6 order-1 order-lg-2"
                data-aos="fade-left"
                data-aos-delay="200"
              >
                <div className="image-section mx-5 my-5">
                  <div className="main-image">
                    <img src="/assets/img/HomePage/7.webp" alt="showcase" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* Statistics Section */}
        <section className="about statistics-section">
          <div className="container" data-aos="fade-up" data-aos-delay="100">
            <div className="row text-center">
              <div
                className="container pb-0 section-title text-center"
                data-aos="fade-up"
              >
                <h2 className="mb-5 gradient-animated">Capturing Love Stories with Excellence</h2>
                <div className="d-flex justify-content-center">
                  <p className="w-75 d-block text-center para">
                    At The Patil Photography & Films, we don't just capture
                    moments — we create experiences. Each photograph is a
                    testament to our commitment to luxury, artistry, and
                    unparalleled craftsmanship.
                  </p>
                </div>
              </div>
            </div>


            <div className="row g-4">
              {/* Stat 1 */}
              <div
                className="col-md-6 col-lg-3"
                data-aos="fade-up"
                data-aos-delay="100"
              >
                <div className="stat-card card-glow">
                  <h3 className="stat-number"><Counter end={500} suffix="+" /></h3>
                  <p className="stat-label">Elite Clients</p>
                  <p className="stat-description">Worldwide</p>
                </div>
              </div>

              {/* Stat 2 */}
              <div
                className="col-md-6 col-lg-3"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                <div className="stat-card card-glow">
                  <h3 className="stat-number"><Counter end={10} suffix="+" /></h3>
                  <p className="stat-label">Years Excellence</p>
                  <p className="stat-description">Industry Leader</p>
                </div>
              </div>

              {/* Stat 3 */}
              <div
                className="col-md-6 col-lg-3"
                data-aos="fade-up"
                data-aos-delay="300"
              >
                <div className="stat-card card-glow">
                  <h3 className="stat-number"><Counter end={15} suffix="+" /></h3>
                  <p className="stat-label">Expert Team</p>
                  <p className="stat-description">Certified Professionals</p>
                </div>
              </div>

              {/* Stat 4 */}
              <div
                className="col-md-6 col-lg-3"
                data-aos="fade-up"
                data-aos-delay="400"
              >
                <div className="stat-card card-glow">
                  <h3 className="stat-number">24/7</h3>
                  <p className="stat-label">Concierge Service</p>
                  <p className="stat-description">Always Available</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Quote Section */}
        <section
          className="container px-5 pt-4"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          <h2 className="text-center Quite py-2">
            "Love's journey is written in small moments — the smiles, the
            glances, the warmth — each deserving to be held forever."
          </h2>
        </section>
        {/* Services Section */}
        <section id="services" className="services">
          <div
            className="container section-title text-center"
            data-aos="fade-up"
          >
            <h2 className="gold-text-gradient">Our Signature Services</h2>
            <div className="d-flex justify-content-center">
              <p className="w-50 d-block text-center">
                We offer a complete range of photography and videography
                services tailored to make your special moments unforgettable
              </p>
            </div>
          </div>

          <div className="container" data-aos="fade-up" data-aos-delay="100">
            <div className="row g-4">
              {/* Service 1 */}
              <div
                className="col-lg-4 col-md-6"
                data-aos="fade-up"
                data-aos-delay="100"
              >
                <div className="service-card">
                  <div className="service-icon">
                    <i className="bi bi-heart"></i>
                  </div>
                  <h3 className="service-title">Wedding Photography</h3>
                  <p className="service-description">
                    Capture the essence of your wedding day with our
                    comprehensive wedding photography packages, covering
                    pre-wedding shoots, ceremonies, receptions, and intimate
                    moments.
                  </p>
                </div>
              </div>

              {/* Service 2 */}
              <div
                className="col-lg-4 col-md-6"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                <div className="service-card">
                  <div className="service-icon">
                    <i className="bi bi-film"></i>
                  </div>
                  <h3 className="service-title">Cinematic Films</h3>
                  <p className="service-description">
                    Professional videography that tells your love story through
                    cinema-quality films, featuring creative editing, drone
                    footage, and emotional narratives.
                  </p>
                </div>
              </div>

              {/* Service 3 */}
              <div
                className="col-lg-4 col-md-6"
                data-aos="fade-up"
                data-aos-delay="300"
              >
                <div className="service-card">
                  <div className="service-icon">
                    <i className="bi bi-image"></i>
                  </div>
                  <h3 className="service-title">Portrait Sessions</h3>
                  <p className="service-description">
                    Elegant and timeless portrait photography for couples,
                    families, and individuals, with professional styling and
                    beautiful natural or studio settings.
                  </p>
                </div>
              </div>

              {/* Service 4 */}
              <div
                className="col-lg-4 col-md-6"
                data-aos="fade-up"
                data-aos-delay="400"
              >
                <div className="service-card">
                  <div className="service-icon">
                    <i className="bi bi-calendar-heart"></i>
                  </div>
                  <h3 className="service-title">Engagement Shoots</h3>
                  <p className="service-description">
                    Beautiful pre-wedding engagement sessions in stunning
                    locations, capturing the joy and chemistry between you and
                    your partner.
                  </p>
                </div>
              </div>

              {/* Service 5 */}
              <div
                className="col-lg-4 col-md-6"
                data-aos="fade-up"
                data-aos-delay="500"
              >
                <div className="service-card">
                  <div className="service-icon">
                    <i className="bi bi-album"></i>
                  </div>
                  <h3 className="service-title">Album & Prints</h3>
                  <p className="service-description">
                    Premium photo albums, prints, and canvas artwork that
                    transform your favorite moments into stunning décor pieces
                    for your home.
                  </p>
                </div>
              </div>

              {/* Service 6 */}
              <div
                className="col-lg-4 col-md-6"
                data-aos="fade-up"
                data-aos-delay="600"
              >
                <div className="service-card">
                  <div className="service-icon">
                    <i className="bi bi-play-circle"></i>
                  </div>
                  <h3 className="service-title">Drone & Aerial</h3>
                  <p className="service-description">
                    Stunning aerial photography and videography using drone
                    technology to capture breathtaking perspectives of your
                    wedding venue and celebrations.
                  </p>
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

          <div className="container" data-aos="fade-up" data-aos-delay="100">
            {loadingTestimonials ? (
              <div className="row">
                {[1, 2, 3].map((_, index) => (
                  <div key={index} className="col-lg-4">
                    <div className="testimonial-item" style={{ height: "100%", padding: "30px" }}>
                      <div className="d-flex align-items-center mb-3">
                        <Skeleton borderRadius="50%" width="50px" height="50px" />
                        <div className="ms-3">
                          <Skeleton width="120px" height="20px" style={{ marginBottom: "5px" }} />
                          <Skeleton width="80px" height="15px" />
                        </div>
                      </div>
                      <Skeleton width="100%" height="15px" style={{ marginBottom: "10px" }} />
                      <Skeleton width="100%" height="15px" style={{ marginBottom: "10px" }} />
                      <Skeleton width="80%" height="15px" />
                    </div>
                  </div>
                ))}
              </div>
            ) : testimonials.length > 0 ? (
              <Swiper
                modules={[Autoplay, Navigation]}
                slidesPerView={1}
                spaceBetween={30}
                autoplay={{ delay: 5000, disableOnInteraction: true }}
                navigation={testimonials.length > 1}
                loop={testimonials.length > 1}
                breakpoints={{
                  640: {
                    slidesPerView: 1,
                  },
                  768: {
                    slidesPerView: 2,
                  },
                  1024: {
                    slidesPerView: 3,
                  },
                }}
                className="testimonial-slider"
              >
                {testimonials.map((t, index) => (
                  <SwiperSlide key={t._id}>
                    <div
                      className={`testimonial-item ${index % 2 === 0 ? "" : "highlight"}`}
                      data-aos="fade-up"
                      data-aos-delay={index * 100}
                      style={{ height: "100%" }}
                    >
                      <div className="testimonial-content">
                        <div className="quote-pattern">
                          <i className="bi bi-quote"></i>
                        </div>
                        <p className="shortDescriptionLenth">
                          "{t.shortDescription}"
                        </p>

                        {/* Star Rating */}
                        <div
                          className="stars"
                          style={{ color: "#ffc107", marginBottom: "10px" }}
                        >
                          {[...Array(t.rating || 5)].map((_, i) => (
                            <i key={i} className="bi bi-star-fill"></i>
                          ))}
                        </div>

                        <div className="client-info">
                          <div className="client-image">
                            <img
                              src={
                                t.thumbnail ||
                                "https://placehold.co/250x250?text=Couple"
                              }
                              alt={t.coupleName}
                              style={{
                                width: "50px",
                                height: "50px",
                                objectFit: "cover",
                                borderRadius: "50%",
                              }}
                            />
                          </div>
                          <div className="client-details">
                            <h3 className="coupleNameLenth">{t.coupleName}</h3>
                            <span className="position">{t.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <div className="text-center p-5">
                <p>Currently updating our wall of love. Check back soon!</p>
              </div>
            )}
          </div>

          <div className="d-flex justify-content-center mt-5">
            <Link to="/testimonials" className="submit-btn mt-3" style={{ textDecoration: "none" }}>
              <span>View All Testimonials</span>
              <i className="bi bi-arrow-right ms-2"></i>
            </Link>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="projects section pt-3">
          <div
            className="container section-title text-center"
            data-aos="fade-up"
          >
            <h2>Our Latest Love Stories</h2>
            <div className="d-flex justify-content-center">
              <p className="w-50 d-block text-center">
                Every couple carries a beautiful story of their own, and it's
                our privilege to capture those timeless moments meant to be
                cherished for generations.
              </p>
            </div>
          </div>

          <div className="container" data-aos="fade-up" data-aos-delay="100">
            {/* Love Stories Slider */}
            {loadingStories ? (
              <div className="row">
                {[1, 2, 3].map((_, index) => (
                  <div key={index} className="col-md-4">
                    <div className="project-card" style={{ height: "100%" }}>
                      <Skeleton width="100%" height="300px" style={{ marginBottom: "15px" }} />
                      <div className="d-flex flex-column gap-2">
                        <Skeleton width="80%" height="25px" />
                        <Skeleton width="100%" height="15px" />
                        <Skeleton width="90%" height="15px" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : loveStories.length === 0 ? (
              <div className="col-12 text-center p-5">
                <p>No love stories to share yet.</p>
              </div>
            ) : (
              <Swiper
                modules={[Autoplay]}
                spaceBetween={30}
                slidesPerView={1}
                navigation={false}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                breakpoints={{
                  640: { slidesPerView: 1 },
                  768: { slidesPerView: 2 },
                  1024: { slidesPerView: 3 },
                }}
                className="projects-slider"
                style={{ paddingBottom: "40px" }}
              >
                {loveStories.map((story) => (
                  <SwiperSlide key={story._id}>
                    <div className="project-card" style={{ height: "100%" }}>
                      <div className="project-image">
                        <img
                          src={story.thumbnail}
                          alt={story.title}
                          className="img-fluid"
                          style={{
                            width: "100%",
                            height: "300px",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                      <div className="project-info">
                        <h4 className="project-title">{story.title}</h4>
                        <p className="project-description">
                          {story.description.length > 100
                            ? story.description.substring(0, 100) + "..."
                            : story.description}
                        </p>
                        <div className="cta-section text-md-start">
                          <a
                            href="#"
                            className="cta-link"
                            onClick={(e) => {
                              e.preventDefault();
                              setSelectedStory(story);
                              setShowModal(true);
                            }}
                          >
                            View Story
                            <i className="bi bi-arrow-right ms-2"></i>
                          </a>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            )}

            <div className="d-flex justify-content-center mt-0">
              <Link
                to="/stories"
                className="submit-btn  mt-3"
                style={{ textDecoration: "none" }}
              >
                <span>View All Stories</span>
                <i className="bi bi-arrow-right ms-2"></i>
              </Link>
            </div>
          </div>
        </section>

        {/* Process/Experience Section */}
        <section id="experience" className="section light-background">
          <div className="container" data-aos="fade-up">
            <div className="section-title text-center">
              <h2 className="gold-text-gradient">The Experience</h2>
              <p>From our first conversation to the final delivery, we ensure a seamless and enjoyable journey.</p>
            </div>
            <div className="row g-4">
              {[
                { icon: "bi-chat-heart", title: "1. Connect", desc: "We start with a consultation to understand your vision, style, and unique story." },
                { icon: "bi-camera", title: "2. Create", desc: "On the big day, we blend into the background to capture candid, authentic moments artfully." },
                { icon: "bi-magic", title: "3. Curate", desc: "We hand-edit every image, enhancing colors and emotions to create a cinematic look." },
                { icon: "bi-box2-heart", title: "4. Cherish", desc: "Receive your memories in a beautiful online gallery and premium handcrafted albums." }
              ].map((step, idx) => (
                <div key={idx} className="col-md-6 col-lg-3" data-aos="fade-up" data-aos-delay={idx * 100}>
                  <div className="process-step card-glow">
                    <div className="icon-box">
                      <i className={`bi ${step.icon}`}></i>
                    </div>
                    <h3>{step.title}</h3>
                    <p>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Connect / Meet the Artist Section */}
        <section className="connect-section">
          <div className="container">
            <div className="row justify-content-center align-items-center">
              <div className="col-lg-6" data-aos="fade-right">
                <div className="connect-card card-glow">
                  <div className="text-center">
                    <img src="/assets/img/slider/hero6.jpg" className="connect-avatar float-anim" alt="Photographer" />
                    <h2 style={{ fontSize: '2rem', marginBottom: '10px' }}>Let's Create Magic</h2>
                    <p className="text-muted">Lead Photographer & Visual Storyteller</p>
                    <p className="mt-3">
                      "My goal is not just to take photos, but to create a visual legacy of your love. Let's chat about your big day and see if we are the perfect match."
                    </p>
                    <a href="https://wa.me/910000000000" target="_blank" rel="noreferrer" className="connect-btn">
                      <i className="bi bi-whatsapp"></i> Chat with Me Directly
                    </a>
                  </div>
                </div>
              </div>
              <div className="col-lg-5 offset-lg-1" data-aos="fade-left">
                <h2 className="gold-text-gradient mb-4">Why Connect With Us?</h2>
                <ul className="list-unstyled" style={{ fontSize: '1.1rem', lineHeight: '2' }}>
                  <li><i className="bi bi-check-circle-fill text-warning me-2"></i> personalized Consultation</li>
                  <li><i className="bi bi-check-circle-fill text-warning me-2"></i> Custom-Tailored Packages</li>
                  <li><i className="bi bi-check-circle-fill text-warning me-2"></i> Clear & Transparent Pricing</li>
                  <li><i className="bi bi-check-circle-fill text-warning me-2"></i> A Friend, Not Just a Vendor</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="section">
          <div className="container" data-aos="fade-up">
            <div className="section-title text-center">
              <h2 className="gold-text-gradient">Common Questions</h2>
            </div>
            <div className="row justify-content-center">
              <div className="col-lg-8">
                {[
                  { q: "Do you travel for weddings?", a: "Absolutely! We love destination weddings and are available to travel worldwide to capture your special day." },
                  { q: "How many photos will we receive?", a: "For a full-day wedding, you can expect 500+ hand-edited, high-resolution images." },
                  { q: "Do you provide video services as well?", a: "Yes, we specialize in cinematic wedding films that beautifully complement our photography." },
                  { q: "How long until we see our photos?", a: "We provide a sneak peek within 1 week, and the full gallery is typically ready within 4-6 weeks." }
                ].map((item, idx) => (
                  <div key={idx} className="faq-item" data-aos="fade-up" data-aos-delay={idx * 100}>
                    <h3>{item.q} <i className="bi bi-plus-circle-dotted" style={{ fontSize: '1rem' }}></i></h3>
                    <p>{item.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Banner */}
        <section className="cta-banner">
          <div className="container" data-aos="zoom-in">
            <h2>Ready to Create Magic?</h2>
            <p className="mb-4" style={{ fontSize: '1.2rem', opacity: 0.9 }}>Let's turn your fleeting moments into timeless memories.</p>
            <Link to="/quote" className="cta-button-light">
              Book Your Date
            </Link>
          </div>
        </section>

        {/* Instagram  */}
        <section id="instagram" className="about section">
          <div className="container" data-aos="fade-up" data-aos-delay="100">
            <div className="container section-title" data-aos="fade-up">
              <h2>As Seen on Instagram</h2>
              <p>
                <a
                  href="https://www.instagram.com/thepatilphotography"
                  target="_blank"
                  rel="noreferrer"
                  className="text-secondary"
                >
                  @thepatilphotography
                </a>
              </p>
            </div>
            <div className="container">
              <div className="row g-2 justify-content-center">
                {/* Static Grid to simulate Instagram Feed using existing portfolio images */}
                {/* This avoids 404s from invalid widget IDs and requires no API tokens */}
                {loadingInstagram ? (
                  [1, 2, 3, 4, 5, 6].map((_, index) => (
                    <div key={index} className="col-4 col-md-2">
                      <Skeleton width="100%" style={{ paddingBottom: "100%" }} />
                    </div>
                  ))
                ) : (
                  [
                    "/assets/img/HomePage/7.webp",
                    "/assets/img/HomePage/11.webp",
                    "/assets/img/HomePage/16.webp",
                    "/assets/img/HomePage/18.webp",
                    "/assets/img/HomePage/128.webp",
                    "/assets/img/HomePage/7.webp",
                  ].map((imgSrc, index) => (
                    <div key={index} className="col-4 col-md-2">
                      <a
                        href="https://www.instagram.com/thepatilphotography"
                        target="_blank"
                        rel="noreferrer"
                        className="d-block overflow-hidden position-relative group"
                        style={{ paddingBottom: "100%", position: "relative" }}
                      >
                        <img
                          src={imgSrc}
                          alt="Instagram view"
                          className="img-fluid position-absolute top-0 start-0 w-100 h-100 object-fit-cover"
                          style={{ transition: "transform 0.3s ease" }}
                          onMouseOver={(e) =>
                            (e.currentTarget.style.transform = "scale(1.05)")
                          }
                          onMouseOut={(e) =>
                            (e.currentTarget.style.transform = "scale(1)")
                          }
                        />
                      </a>
                    </div>
                  ))
                )}
              </div>

              <div className="text-center mt-4">
                <a
                  href="https://www.instagram.com/thepatilphotography?igsh=MWQwMGFkcDVwbmpxYQ=="
                  target="_blank"
                  className="cta-link"
                  rel="noreferrer"
                >
                  Follow us on Instagram{" "}
                  <i className="bi bi-instagram ms-2"></i>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <StoryModal
        show={showModal}
        onHide={() => setShowModal(false)}
        story={
          selectedStory
            ? {
              ...selectedStory,
              subtitle: selectedStory.location,
              images: selectedStory.gallery || [],
            }
            : null
        }
      />

      <Footer />

      {/* Scroll Top Button */}
      <a
        href="#"
        id="scroll-top"
        className="scroll-top d-flex align-items-center justify-content-center"
      >
        <i className="bi bi-arrow-up-short"></i>
      </a>

      {/* Preloader */}
      <div id="preloader"></div>
    </>
  );
};

export default Home;
