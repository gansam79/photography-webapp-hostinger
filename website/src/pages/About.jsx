import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AOS from "aos";
import "aos/dist/aos.css";
import "../App.css";

const About = () => {
  useEffect(() => {
    document.body.className = "index-page";

    // Initialize AOS
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: true,
      mirror: false,
    });

    // Remove preloader after a short delay
    const preloader = document.querySelector("#preloader");
    if (preloader) {
      setTimeout(() => {
        preloader.remove();
      }, 500);
    }

    return () => {
      document.body.className = "";
    };
  }, []);

  return (
    <>
      <Header />

      {/* Page Title */}
      <div className="page-title dark-background" style={{backgroundImage: "url('/assets/img/HomePage/16.webp')"}}>
        <div className="container position-relative">
          <h1>About Us</h1>
          <p>Discover our story and passion for capturing life's beautiful moments</p>
          <nav className="breadcrumbs">
            <ol>
              <li><a href="/">Home</a></li>
              <li className="current">About Us</li>
            </ol>
          </nav>
        </div>
      </div>

      <main className="main ">
        {/* Meet Our Founder Section */}
        <section id="founder" className="founder section">
          <div className="container" data-aos="fade-up" data-aos-delay="100">
            <div className="row align-items-center">
              <div
                className="col-lg-6 order-2 order-lg-1"
                data-aos="fade-right"
                data-aos-delay="200"
              >
                <div className="founder-content">
                  <div
                    className="container mb-4 innerpage-title text-start p-0"
                    data-aos="fade-up"
                  >
                    <p className="Subhead">The Artist Behind The Lens</p>
                    <h2>Meet Our Founder</h2>
                  </div>

                  <p className="lead-text mb-4">
                    At the heart of our venture is a visionary with a keen eye
                    for detail and an unwavering passion for storytelling
                    through the lens. With every click, the aim is not just to
                    capture an image, but to freeze a moment in time — a moment
                    filled with emotion, love, joy, or quiet beauty.
                  </p>

                  <p className="description-text mb-4">
                    Founded with a simple yet powerful vision: to create
                    timeless, artistic memories that last a lifetime. We are
                    passionate about turning life's most meaningful moments into
                    beautifully captured stories, stories that evoke emotion,
                    preserve beauty, and exceed expectations.
                  </p>

                  <p className="description-text">
                    From our beginning, we've worked so hard and passionately,
                    pouring our heart and soul into every photoshoot. As
                    artists, we've always admired the pursuit of excellence, and
                    the desire to create award-worthy work has been a strong
                    driving force for us.
                  </p>
                </div>
              </div>

              <div
                className="col-lg-6 order-1 order-lg-2"
                data-aos="fade-left"
                data-aos-delay="200"
              >
                <div className="founder-image m-auto">
                  <img
                    src="/assets/img/person/founder.jpg"
                    alt="Founder - The Patil Photography"
                    className="rounded founder-photo img-fluid"
                  />
                  <div className="founder-section">
                  <div className="founder-title">Aakask Darme-Patil</div>
                  <div className="founder-subtitle ">Founder & <br /> & Lead Photographer</div>
                  <div className="Lead-subtitle ">The Patil Photography</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

          <section className="why-choose-us py-5">
      <div className="container">
        <div className="text-center mb-5">
          <div className="section-title pb-3 mb-3">
            <h2>Why Choose Us</h2>
          </div>

          <p className="section-subtitle">
            At The Patil Photography & Film’s, we do more than document events —
            we craft timeless stories filled with emotion, elegance, and authenticity.
          </p>
        </div>

        <div className="accordion accordion-flush" id="whyChooseUsAccordion">

          {/* 1 */}
          <div className="accordion-item">
            <h2 className="accordion-header" id="headingOne">
              <button
                className="accordion-button d-flex align-items-center gap-3"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseOne"
              >
                <div className="service-icon">
                  <i className="bi bi-camera"></i>
                </div>
                <span>Timeless Storytelling, Not Just Photography</span>
              </button>
            </h2>
            <div
              id="collapseOne"
              className="accordion-collapse collapse show"
              data-bs-parent="#whyChooseUsAccordion"
            >
              <div className="accordion-body">
                We believe your wedding is not a photoshoot — it is a once-in-a-lifetime story.
                Our approach blends cinematic vision with genuine emotions.
              </div>
            </div>
          </div>

          {/* 2 */}
          <div className="accordion-item">
            <h2 className="accordion-header" id="headingTwo">
              <button
                className="accordion-button collapsed d-flex align-items-center gap-3"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseTwo"
              >
                <div className="service-icon">
                  <i className="bi bi-gem"></i>
                </div>
                <span>Luxury Aesthetic with a Personal Touch</span>
              </button>
            </h2>
            <div
              id="collapseTwo"
              className="accordion-collapse collapse"
              data-bs-parent="#whyChooseUsAccordion"
            >
              <div className="accordion-body">
                From soft lighting to refined compositions, our style is elegant,
                graceful, and cinematic.
              </div>
            </div>
          </div>

          {/* 3 */}
          <div className="accordion-item">
            <h2 className="accordion-header" id="headingThree">
              <button
                className="accordion-button collapsed d-flex align-items-center gap-3"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseThree"
              >
                <div className="service-icon">
                  <i className="bi bi-heart"></i>
                </div>
                <span>Emotion-Driven & Candid Expertise</span>
              </button>
            </h2>
            <div
              id="collapseThree"
              className="accordion-collapse collapse"
              data-bs-parent="#whyChooseUsAccordion"
            >
              <div className="accordion-body">
                The most beautiful moments are often unspoken — a glance, a tear, a smile.
                We capture emotions naturally.
              </div>
            </div>
          </div>

          {/* 4 */}
          <div className="accordion-item">
            <h2 className="accordion-header" id="headingFour">
              <button
                className="accordion-button collapsed d-flex align-items-center gap-3"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseFour"
              >
                <div className="service-icon">
                  <i className="bi bi-stars"></i>
                </div>
                <span>Seamless & Stress-Free Experience</span>
              </button>
            </h2>
            <div
              id="collapseFour"
              className="accordion-collapse collapse"
              data-bs-parent="#whyChooseUsAccordion"
            >
              <div className="accordion-body">
                From consultation to delivery, we ensure a smooth, professional journey.
              </div>
            </div>
          </div>

          {/* 5 */}
          <div className="accordion-item">
            <h2 className="accordion-header" id="headingFive">
              <button
                className="accordion-button collapsed d-flex align-items-center gap-3"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseFive"
              >
                <div className="service-icon">
                  <i className="bi bi-people"></i>
                </div>
                <span>Tailored Stories for Every Couple</span>
              </button>
            </h2>
            <div
              id="collapseFive"
              className="accordion-collapse collapse"
              data-bs-parent="#whyChooseUsAccordion"
            >
              <div className="accordion-body">
                No two love stories are the same. Every wedding is customized to your vision.
              </div>
            </div>
          </div>

          {/* 6 */}
          <div className="accordion-item">
            <h2 className="accordion-header" id="headingSix">
              <button
                className="accordion-button collapsed d-flex align-items-center gap-3"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseSix"
              >
                <div className="service-icon">
                  <i className="bi bi-infinity"></i>
                </div>
                <span>Memories Crafted to Last Forever</span>
              </button>
            </h2>
            <div
              id="collapseSix"
              className="accordion-collapse collapse"
              data-bs-parent="#whyChooseUsAccordion"
            >
              <div className="accordion-body">
                Your wedding visuals are heirlooms — timeless, emotional, and lasting forever.
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
      </main>

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

export default About;
