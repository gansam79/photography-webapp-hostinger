import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import StoryModal from "../components/StoryModal";

const Stories = () => {
  const [stories, setStories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedStory, setSelectedStory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      document.body.className = "Stories-page";
    } catch (error) {
      console.error('Error in Stories useEffect:', error);
    }

    // Fetch Love Stories
    fetch('/api/love-stories')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          // Show only Active stories on public page
          setStories(data.filter(s => s.status === 'Active'));
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching love stories:", err);
        setLoading(false);
      });

    return () => (document.body.className = "");
  }, []);

  const openStory = (story) => {
    setSelectedStory({
      ...story,
      subtitle: story.location,
      // Ensure gallery is formatted correctly if needed, matching Home.jsx logic
      images: story.gallery || []
    });
    setShowModal(true);
  };

  return (
    <>
      <Header />

      {/* Page Title */}
      <div className="page-title dark-background" style={{ backgroundImage: "url('/assets/img/HomePage/128.webp')" }}>
        <div className="container position-relative">
          <h1>Stories</h1>
          <p>Real love stories captured through our lens</p>
          <nav className="breadcrumbs">
            <ol>
              <li><Link to="/">Home</Link></li>
              <li className="current">Stories</li>
            </ol>
          </nav>
        </div>
      </div>

      <main className="main">
        {/* Intro */}
        <section className="portfolio-intro pb-0">
          <div
            className="container section-title text-center portfolioHeader"
            data-aos="fade-up"
          >
            <h2 className="mb-3">Moments That Become Forever</h2>
            <p>Beyond rituals and celebrations, we capture genuine emotions and meaningful moments—crafted into timeless love stories.
            </p>
          </div>
        </section>

        {/* Stories Grid */}
        <section className="projects section pt-3">
          <div className="container">
            {loading ? (
              <div className="text-center py-5"><p>Loading stories...</p></div>
            ) : (
              <div className="row gy-4">
                {stories.length === 0 ? (
                  <div className="col-12 text-center p-5">
                    <p>No stories found.</p>
                  </div>
                ) : (
                  stories.map((story, index) => (
                    <div
                      className="col-lg-4 col-md-6"
                      key={story._id}
                      data-aos="fade-up"
                      data-aos-delay={index * 100}
                    >
                      <div className="project-card">
                        <div className="project-image">
                          <img
                            src={story.thumbnail}
                            alt={story.title}
                            className="img-fluid"
                            style={{ width: '100%', height: '300px', objectFit: 'cover' }}
                          />
                        </div>

                        <div className="project-info">
                          <h4 className="project-title">{story.title}</h4>
                          <p className="project-description">
                            {story.description && story.description.length > 100
                              ? story.description.substring(0, 100) + "..."
                              : story.description}
                          </p>

                          <a
                            href="#"
                            className="cta-link"
                            onClick={(e) => {
                              e.preventDefault();
                              openStory(story);
                            }}
                          >
                            View Story <i className="bi bi-arrow-right ms-2"></i>
                          </a>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </section>

        {/* Modal */}
        <StoryModal
          show={showModal}
          onHide={() => setShowModal(false)}
          story={selectedStory}
        />
      </main>

      <Footer />
    </>
  );
};

export default Stories;
