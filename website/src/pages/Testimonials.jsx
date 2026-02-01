import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    coupleName: "",
    location: "",
    shortDescription: "",
    rating: 5,
    thumbnail: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    try {
      document.body.className = "testimonials-page";
    } catch (error) {
      console.error("Error in Testimonials useEffect:", error);
    }

    // Fetch Testimonials
    fetch("/api/testimonials?type=active")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setTestimonials(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching testimonials:", err);
        setLoading(false);
      });

    return () => (document.body.className = "");
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "rating" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return; // Prevent multiple submissions

    setSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await fetch("/api/testimonials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          status: "Pending",
        }),
      });

      if (response.ok) {
        setSuccessMessage(
          "Thank you for your testimonial! It will be reviewed and published soon."
        );
        setFormData({
          coupleName: "",
          location: "",
          shortDescription: "",
          rating: 5,
          thumbnail: "",
        });
        setTimeout(() => {
          setShowForm(false);
          setSuccessMessage("");
        }, 3000);
      } else {
        setErrorMessage("Failed to submit testimonial. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting testimonial:", error);
      setErrorMessage("An error occurred. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Header />

      <main className="main">
        {/* Page Header */}
        {/* Page Title */}
        <div className="page-title dark-background" style={{ backgroundImage: "url('/assets/img/HomePage/16.webp')" }}>
          <div className="container position-relative">
            <h1>Testimonials & Reviews</h1>
            <p>Words from the heart of our beloved couples</p>
            <nav className="breadcrumbs">
              <ol>
                <li><a href="/">Home</a></li>
                <li className="current">Testimonials</li>
              </ol>
            </nav>
          </div>
        </div>

        {/* Testimonials Section */}
        <section className="testimonials-full section">
          <div className="container">
            {/* Header with Button */}
            <div className="section-header mb-5" data-aos="fade-up">
              <h2 className="section-title">From the Hearts of Our Couples</h2>
              <p className="section-description">
                Every love story is unique, and we're honored to be a part of
                it. Read what our couples have to say about their experience
                with us.
              </p>
              <button
                className="btn-submit-testimonial mt-4"
                onClick={() => setShowForm(!showForm)}
                data-aos="fade-up"
                data-aos-delay="100"
              >
                <i className="bi bi-pencil-square me-2"></i>
                Share Your Testimonial
              </button>
            </div>

            {/* Testimonial Form */}
            {showForm && (
              <div
                className="testimonial-form-container mb-5"
                data-aos="fade-up"
              >
                <h3 className="form-title">Share Your Experience</h3>
                <form onSubmit={handleSubmit} className="testimonial-form">
                  <div className="form-row">
                    <div className="form-group col-md-6">
                      <label htmlFor="coupleName">Couple Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        id="coupleName"
                        name="coupleName"
                        value={formData.coupleName}
                        onChange={handleInputChange}
                        placeholder="Your couple name"
                        required
                      />
                    </div>
                    <div className="form-group col-md-6">
                      <label htmlFor="location">Location *</label>
                      <input
                        type="text"
                        className="form-control"
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        placeholder="Your location"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="shortDescription">Your Testimonial *</label>
                    <textarea
                      className="form-control"
                      id="shortDescription"
                      name="shortDescription"
                      value={formData.shortDescription}
                      onChange={handleInputChange}
                      placeholder="Share your experience with us..."
                      rows="5"
                      required
                    ></textarea>
                  </div>

                  <div className="form-row">
                    <div className="form-group col-md-6">
                      <label htmlFor="rating">Rating *</label>
                      <select
                        className="form-control"
                        id="rating"
                        name="rating"
                        value={formData.rating}
                        onChange={handleInputChange}
                      >
                        <option value="5">5 Stars - Excellent</option>
                        <option value="4">4 Stars - Very Good</option>
                        <option value="3">3 Stars - Good</option>
                        <option value="2">2 Stars - Fair</option>
                        <option value="1">1 Star - Poor</option>
                      </select>
                    </div>
                    <div className="form-group col-md-6">
                      <label htmlFor="thumbnail">Photo URL (Optional)</label>
                      <input
                        type="url"
                        className="form-control"
                        id="thumbnail"
                        name="thumbnail"
                        value={formData.thumbnail}
                        onChange={handleInputChange}
                        placeholder="https://example.com/photo.jpg"
                      />
                    </div>
                  </div>

                  {successMessage && (
                    <div
                      className="alert alert-success alert-dismissible fade show"
                      role="alert"
                    >
                      {successMessage}
                    </div>
                  )}

                  {errorMessage && (
                    <div
                      className="alert alert-danger alert-dismissible fade show"
                      role="alert"
                    >
                      {errorMessage}
                    </div>
                  )}

                  <div className="form-actions">
                    <button
                      type="submit"
                      className="btn-form-submit"
                      disabled={submitting}
                      style={{ opacity: submitting ? 0.7 : 1, cursor: submitting ? 'not-allowed' : 'pointer' }}
                    >
                      {submitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Submitting...
                        </>
                      ) : (
                        "Submit Testimonial"
                      )}
                    </button>
                    <button
                      type="button"
                      className="btn-form-cancel"
                      onClick={() => setShowForm(false)}
                      disabled={submitting}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Testimonials Grid */}
            {!showForm && (
              loading ? (
                <div className="text-center py-5">
                  <p>Loading testimonials...</p>
                </div>
              ) : testimonials.length > 0 ? (
                <div className="testimonials-grid">
                  <div className="row g-4">
                    {testimonials.map((testimonial, index) => (
                      <div
                        key={testimonial._id}
                        className="col-lg-4 col-md-6"
                        data-aos="fade-up"
                        data-aos-delay={index * 100}
                      >
                        <div className="testimonial-card">
                          <div className="quote-icon">
                            <i className="bi bi-quote"></i>
                          </div>
                          <p className="testimonial-text">
                            "{testimonial.shortDescription}"
                          </p>

                          {/* Star Rating */}
                          <div className="testimonial-rating">
                            {[...Array(testimonial.rating || 5)].map((_, i) => (
                              <i key={i} className="bi bi-star-fill"></i>
                            ))}
                          </div>

                          <div className="testimonial-author">
                            {testimonial.thumbnail && (
                              <img
                                src={testimonial.thumbnail}
                                alt={testimonial.coupleName}
                                className="author-image"
                              />
                            )}
                            <div className="author-info">
                              <h4 className="author-name">
                                {testimonial.coupleName}
                              </h4>
                              <p className="author-location">
                                {testimonial.location}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-5">
                  <p>No testimonials yet. Be the first to share your experience!</p>
                </div>
              )
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="testimonials-cta section">
          <div className="container text-center" data-aos="fade-up">
            <h2>Ready to Create Your Love Story?</h2>
            <p>Let us capture your special moments with the elegance they deserve.</p>
            <a href="/quote" className="btn-primary-cta">
              Get Your Quote
              <i className="bi bi-arrow-right ms-2"></i>
            </a>
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

    </>
  );
};

export default Testimonials;
