import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useSettings } from '../hooks/useSettings';

const Quote = () => {
  const { settings } = useSettings();
  const [formData, setFormData] = useState({
    groomName: '',
    brideName: '',
    phoneNumber: '',
    eventStartDate: '',
    eventEndDate: '',
    events: [],
    budget: '',
    location: '',
    services: [],
    message: ''
  });

  useEffect(() => {
    document.body.className = 'quote-page';

    return () => {
      document.body.className = '';
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleCheckboxChange = (e, field) => {
    const { value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [field]: checked
        ? [...prev[field], value]
        : prev[field].filter(item => item !== value)
    }));
  };

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("Thank you for your enquiry! We will get back to you soon.");
        setFormData({
          groomName: '',
          brideName: '',
          phoneNumber: '',
          eventStartDate: '',
          eventEndDate: '',
          events: [],
          budget: '',
          location: '',
          services: [],
          message: ''
        });
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("Error submitting. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Header />

      {/* Page Title */}
      <div className="page-title dark-background" style={{ backgroundImage: "url('/assets/img/HomePage/3.webp')" }}>
        <div className="container position-relative">
          <h1>Book Us</h1>
          <p>Let's create unforgettable memories together</p>
          <nav className="breadcrumbs">
            <ol>
              <li><Link to="/">Home</Link></li>
              <li className="current">Book Us</li>
            </ol>
          </nav>
        </div>
      </div>

      <main className="main">

        {/* New Introductory Section */}
        <section className="pt-5 pb-0 px-4">
          <div
            className="container section-title portfolioHeader"
            data-aos="fade-up"
          >
            <h2>Let's Create Something <br /> Beautiful Together</h2>

            <div className="text-left mx-auto mt-5" >
              <p className="lead text-muted mb-3">Book your special wedding day with The Patil Photography.!</p>
              <p className="lead text-muted mb-3">We turn your most cherished moments into timeless memories. From heartfelt candid emotions to cinematic storytelling, every frame is captured with passion and creativity. Reserve your date today and let us make your big day truly unforgettable.</p>
              <p className="lead text-muted mb-3">Kindly complete the form below with as much detail as possible to help us provide an accurate quotation. We aim to respond within 48 hours.</p>
              <p className="lead text-muted mb-3">If you do not hear from us within this timeframe, or if your request is urgent, please feel free to contact us directly at the number provided below.</p>
              <p className="font-weight-bold text-primary">We're happy to assist you!</p>
            </div>
          </div>
        </section>

        {/* Quote Section */}
        <section id="quote" className="quote section">
          <div className="container" data-aos="fade-up" data-aos-delay="100">
            <div className="row justify-content-center">
              <div className="col-lg-11">
                <div className="quote-container">
                  <div className="row">

                    <div className="col-lg-5" data-aos="fade-right" data-aos-delay="200">
                      <div className="quote-content">
                        <h2>Capture Your Perfect Moments</h2>
                        <p>Experience photography excellence with our dedicated team. We bring artistry, passion, and uncompromising quality to every shoot, ensuring your memories are preserved beautifully forever.</p>

                        <div className="quote-benefits">
                          <div className="benefit-item">
                            <div className="benefit-icon">
                              <i className="bi bi-camera"></i>
                            </div>
                            <div className="benefit-content">
                              <h4>Professional Excellence</h4>
                              <p>Expert photography with artistic vision and technical precision</p>
                            </div>
                          </div>

                          <div className="benefit-item">
                            <div className="benefit-icon">
                              <i className="bi bi-heart"></i>
                            </div>
                            <div className="benefit-content">
                              <h4>Personalized Service</h4>
                              <p>Tailored photography sessions that reflect your unique story</p>
                            </div>
                          </div>

                          <div className="benefit-item">
                            <div className="benefit-icon">
                              <i className="bi bi-clock"></i>
                            </div>
                            <div className="benefit-content">
                              <h4>Timely Delivery</h4>
                              <p>Professional turnaround times with exceptional quality</p>
                            </div>
                          </div>
                        </div>

                        <div className="contact-info">
                          <div className="contact-detail">
                            <i className="bi bi-telephone-fill"></i>
                            <span>{settings?.primaryMobileNumber}</span>
                            {settings?.secondaryMobileNumber && <span>, {settings?.secondaryMobileNumber}</span>}
                          </div>
                          <div className="contact-detail">
                            <i className="bi bi-envelope-fill"></i>
                            <span>quotes@thepatilphotography.com</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-lg-7" data-aos="fade-left" data-aos-delay="300">
                      <div className="quote-form">
                        <div className="form-intro">
                          <h3>Wedding Enquiry Form</h3>
                          <p>Share your wedding details and receive a personalized quote tailored to your vision and budget.</p>
                        </div>

                        <div className="card">
                          <div className="card-body">
                            <form onSubmit={handleSubmit}>
                              <div className="row">
                                <div className="col-md-6 mb-3">
                                  <label htmlFor="groomName" className="form-label font-weight-bold">Groom Name</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="groomName"
                                    name="groomName"
                                    value={formData.groomName}
                                    onChange={handleInputChange}
                                    required
                                  />
                                </div>
                                <div className="col-md-6 mb-3">
                                  <label htmlFor="brideName" className="form-label font-weight-bold">Bride Name</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="brideName"
                                    name="brideName"
                                    value={formData.brideName}
                                    onChange={handleInputChange}
                                    required
                                  />
                                </div>
                              </div>
                              <div className="mb-3">
                                <label htmlFor="phoneNumber" className="form-label font-weight-bold">Phone Number</label>
                                <input
                                  type="tel"
                                  className="form-control"
                                  id="phoneNumber"
                                  name="phoneNumber"
                                  value={formData.phoneNumber}
                                  onChange={handleInputChange}
                                  required
                                />
                              </div>
                              <div className="row">
                                <div className="col-md-6 mb-3">
                                  <label htmlFor="eventStartDate" className="form-label font-weight-bold">Event Start Date</label>
                                  <input
                                    type="date"
                                    className="form-control"
                                    id="eventStartDate"
                                    name="eventStartDate"
                                    value={formData.eventStartDate}
                                    onChange={handleInputChange}
                                    min="2026-01-11"
                                    max="2028-01-11"
                                    required
                                  />
                                </div>
                                <div className="col-md-6 mb-3">
                                  <label htmlFor="eventEndDate" className="form-label font-weight-bold">Event End Date</label>
                                  <input
                                    type="date"
                                    className="form-control"
                                    id="eventEndDate"
                                    name="eventEndDate"
                                    value={formData.eventEndDate}
                                    onChange={handleInputChange}
                                    min="2026-01-11"
                                    max="2028-01-11"
                                    required
                                  />
                                </div>
                              </div>
                              <div className="mb-3">
                                <label className="form-label font-weight-bold">Select Your Events (Tick all that apply)</label>
                                <div className="row">
                                  {['Haldi', 'Mehendi', 'Sangeet', 'Wedding', 'Reception', 'Engagement', 'Prewedding', 'Other'].map(event => (
                                    <div key={event} className="col-md-3 mb-2">
                                      <div className="form-check">
                                        <input
                                          className="form-check-input"
                                          type="checkbox"
                                          id={event}
                                          value={event}
                                          checked={formData.events.includes(event)}
                                          onChange={(e) => handleCheckboxChange(e, 'events')}
                                        />
                                        <label className="form-check-label" htmlFor={event}>
                                          {event}
                                        </label>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <div className="mb-3">
                                <label htmlFor="budget" className="form-label font-weight-bold">Your Estimate Budget for Event</label>
                                <input
                                  type="number"
                                  className="form-control"
                                  id="budget"
                                  name="budget"
                                  placeholder="e.g. 200000"
                                  value={formData.budget}
                                  onChange={handleInputChange}
                                />
                              </div>
                              <div className="mb-3">
                                <label htmlFor="location" className="form-label font-weight-bold">Location of Event</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  id="location"
                                  name="location"
                                  value={formData.location}
                                  onChange={handleInputChange}
                                  required
                                />
                              </div>
                              <div className="mb-3">
                                <label className="form-label font-weight-bold">What service are you looking for?</label>
                                <div className="d-flex flex-wrap gap-3">
                                  {['Photography', 'Films', 'Both'].map(service => (
                                    <div key={service} className="form-check">
                                      <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id={service}
                                        value={service}
                                        checked={formData.services.includes(service)}
                                        onChange={(e) => handleCheckboxChange(e, 'services')}
                                      />
                                      <label className="form-check-label" htmlFor={service}>
                                        {service}
                                      </label>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <div className="mb-3">
                                <label htmlFor="message" className="form-label font-weight-bold">Tell us more about your wedding thoughts</label>
                                <textarea
                                  className="form-control"
                                  id="message"
                                  rows="4"
                                  name="message"
                                  placeholder="Share your vision, preferences, or any special requests..."
                                  value={formData.message}
                                  onChange={handleInputChange}
                                ></textarea>
                              </div>
                              <button
                                type="submit"
                                className="submit-btn d-flex mt-0 w-100 justify-content-center align-items-center"
                                disabled={submitting}
                                style={{ opacity: submitting ? 0.7 : 1, cursor: submitting ? 'not-allowed' : 'pointer' }}
                              >
                                {submitting ? (
                                  <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Sending Enquiry...
                                  </>
                                ) : (
                                  "Submit Enquiry"
                                )}
                              </button>
                            </form>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />

      {/* Scroll Top Button */}
      <a href="#" id="scroll-top" className="scroll-top d-flex align-items-center justify-content-center">
        <i className="bi bi-arrow-up-short"></i>
      </a>
    </>
  );
};

export default Quote;