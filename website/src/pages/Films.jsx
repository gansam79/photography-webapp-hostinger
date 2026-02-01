import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

// Extract YouTube ID
const getYouTubeId = (url) => {
  if (!url) return "";
  const regExp =
    /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/ ]{11})/;
  const match = url.match(regExp);
  return match ? match[1] : "";
};

const Films = () => {
  const [films, setFilms] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.body.className = "portfolio-page";

    const fetchData = async () => {
      try {
        const [filmsRes, typesRes] = await Promise.all([
          fetch("/api/films"),
          fetch("/api/event-types")
        ]);

        const filmsData = await filmsRes.json();
        const typesData = await typesRes.json();

        const activeFilms = filmsData.filter(f => f.status === "Active");
        setFilms(activeFilms);

        // Filter types to only show those that have films
        const usedCategories = new Set(activeFilms.map(f => f.category));
        setCategories(typesData.filter(t => t.isActive && usedCategories.has(t.name)));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    return () => {
      document.body.className = "";
    };
  }, []);

  const filteredFilms = activeCategory === "All"
    ? films
    : films.filter(film => film.category === activeCategory);

  // Initialize GLightbox
  useEffect(() => {
    if (!loading && window.GLightbox) {
      const lightbox = window.GLightbox({
        selector: ".glightbox",
        touchNavigation: true,
        loop: true,
      });
    }
  }, [loading, filteredFilms]);

  return (
    <>
      <Header />

      <main className="main">
        {/* Page Title */}
        <div
          className="page-title dark-background"
          style={{ backgroundImage: "url('/assets/img/HomePage/84.webp')" }}
        >
          <div className="container position-relative text-center">
            <h1>Our Films</h1>
            <p>
              Capturing life’s most precious moments through cinematic
              storytelling
            </p>
            <nav className="breadcrumbs">
              <ol>
                <li><a href="/">Home</a></li>
                <li className="current">Films</li>
              </ol>
            </nav>
          </div>

        </div>

        {/* Films Section */}
        <section className="section py-5">
          <div className="container">
            <div className="section-title text-center portfolioHeader" data-aos="fade-up">
              <h2>A Cinematic Journey of Love</h2>
              <p className="text-muted mt-2">
                Cinematic love stories crafted to capture the emotion, joy, and beauty of your wedding day—preserving every precious moment for a lifetime.
              </p>
            </div>

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
              <div className="text-center py-5">
                <div className="spinner-border text-gold-500" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <div className="films-grid">
                {filteredFilms.length > 0 ? filteredFilms.map((film) => {
                  const videoId = getYouTubeId(film.youtubeUrl);
                  if (!videoId) return null;
                  const thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

                  return (
                    <a
                      key={film._id}
                      href={film.youtubeUrl}
                      className="glightbox film-card shadow-sm"
                      data-gallery="films"
                      data-title={film.title}
                      data-description={film.category}
                    >
                      <div className="film-thumb">
                        <img src={thumbnail} alt={film.title} />

                        <div className="film-overlay">
                          <div className="play-btn">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="26"
                              height="26"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <polygon points="6 3 20 12 6 21 6 3" />
                            </svg>
                          </div>
                          <div className="film-info">
                            <h5 className="film-title">{film.title}</h5>
                            <p className="film-category">{film.category}</p>
                          </div>
                        </div>
                      </div>
                    </a>
                  );
                }) : (
                  <div className="col-12 text-center">
                    <p>No films found {activeCategory !== "All" && `for ${activeCategory}`}.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Films;
