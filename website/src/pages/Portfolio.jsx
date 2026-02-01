import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import LuxGallery from "../components/LuxGallery";
import Skeleton from "../components/Skeleton";

const Portfolio = () => {
  const [portfolioImages, setPortfolioImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const lightboxRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [galleryRes, typesRes] = await Promise.all([
          fetch("/api/gallery"),
          fetch("/api/event-types")
        ]);

        const galleryData = await galleryRes.json();
        const typesData = await typesRes.json();

        const activeItems = galleryData.filter((item) => item.status === "Active");
        setPortfolioImages(activeItems);

        // Filter types to only show those that have images
        const usedCategories = new Set(activeItems.map(item => item.category));
        setCategories(typesData.filter(t => t.isActive && usedCategories.has(t.name)));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredImages = activeCategory === "All"
    ? portfolioImages
    : portfolioImages.filter(img => img.category === activeCategory);

  useEffect(() => {
    if (!filteredImages.length || !window.GLightbox) return;

    // Destroy previous instance
    if (lightboxRef.current) {
      lightboxRef.current.destroy();
      lightboxRef.current = null;
    }

    // Create new instance
    lightboxRef.current = window.GLightbox({
      selector: ".glightbox",
      loop: true,
      touchNavigation: true,
      keyboardNavigation: true,
      zoomable: true,
    });

    return () => {
      if (lightboxRef.current) {
        lightboxRef.current.destroy();
        lightboxRef.current = null;
      }
    };
  }, [filteredImages]);
  return (
    <>
      <Header />

      {/* Page Title */}
      <div
        className="page-title portfolio-hero dark-background"
        style={{ backgroundImage: "url('/assets/img/HomePage/11.webp')" }}
      >
        <div className="portfolio-hero-overlay" />
        <div className="container position-relative portfolio-hero-content">
          <h1 className="portfolio-hero-title">Portfolio</h1>
          <p className="portfolio-hero-subtitle text-center">
            Explore our collection of timeless frames and cinematic stories.
          </p>

          <nav className="breadcrumbs portfolio-breadcrumbs">
            <ol>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li className="current">Portfolio</li>
            </ol>
          </nav>
        </div>
      </div>

      <main className="main portfolio-lux">
        {/* Intro Section */}
        <section className="portfolio-intro pb-0">
          <div className="container section-title portfolioHeader" data-aos="fade-up">
            <h2 className="portfolio-title">Experience Our Art</h2>
            <p className="portfolio-desc">
              With an unwavering passion for storytelling and a keen eye for detail,
              we’ve curated a portfolio that beautifully embodies our creative vision.
              Our work spans diverse cultures, stunning destinations, and unique traditions—
              each moment preserved with elegance and soul.
            </p>
          </div>
        </section>

        {/* Gallery Section */}
        <section className="portfolio-gallery pt-3" id="Portfolio-gallery">
          <div className="container" data-aos="fade-up" data-aos-delay="100">

            {/* Category Filter Tabs */}
            <div className="row mb-5">
              <div className="col-12 d-flex justify-content-center">
                <ul className="portfolio-filters list-unstyled d-flex flex-wrap justify-content-center gap-3 mb-0">
                  <li
                    className={`${activeCategory === "All" ? "filter-active" : ""}`}
                    onClick={() => setActiveCategory("All")}
                    style={{ cursor: 'pointer', padding: '8px 20px', borderRadius: '4px', fontWeight: '500', transition: 'all 0.3s ease', backgroundColor: activeCategory === 'All' ? '#daa520' : '#f4f4f4', color: activeCategory === 'All' ? '#fff' : '#333' }}
                  >
                    All
                  </li>
                  {categories.map((cat) => (
                    <li
                      key={cat._id}
                      className={`${activeCategory === cat.name ? "filter-active" : ""}`}
                      onClick={() => setActiveCategory(cat.name)}
                      style={{ cursor: 'pointer', padding: '8px 20px', borderRadius: '4px', fontWeight: '500', transition: 'all 0.3s ease', backgroundColor: activeCategory === cat.name ? '#daa520' : '#f4f4f4', color: activeCategory === cat.name ? '#fff' : '#333' }}
                    >
                      {cat.label || cat.name}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {loading ? (
              <div className="row g-4">
                {[1, 2, 3, 4, 5, 6].map((_, index) => (
                  <div key={index} className="col-12 col-md-4">
                    <Skeleton width="100%" height="300px" borderRadius="10px" />
                  </div>
                ))}
              </div>
            ) : filteredImages.length > 0 ? (
              <LuxGallery images={filteredImages.map(item => item.image)} galleryId="portfolio" />
            ) : (
              <div className="text-center py-5">
                <p>No images found {activeCategory !== "All" && `for ${activeCategory}`}.</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />

      {/* Scroll to Top */}
      <a
        href="#"
        id="scroll-top"
        className="scroll-top d-flex align-items-center justify-content-center"
      >
        <i className="bi bi-arrow-up-short"></i>
      </a>
    </>
  );
};

export default Portfolio;
