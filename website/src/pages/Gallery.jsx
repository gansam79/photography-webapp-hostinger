import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Gallery = () => {
    const [galleryItems, setGalleryItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        document.body.className = "portfolio-page";

        fetch("/api/gallery")
            .then((res) => res.json())
            .then((data) => {
                // Filter only active items if needed, or show all
                // Assuming default status is active if not specified, based on user screenshot showing "Active"
                const activeItems = data.filter((item) => item.status === "Active");
                setGalleryItems(activeItems);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to fetch gallery:", err);
                setLoading(false);
            });

        return () => {
            document.body.className = "";
        };
    }, []);

    // Initialize GLightbox after items are rendered
    useEffect(() => {
        if (!loading && window.GLightbox) {
            const lightbox = window.GLightbox({
                selector: ".glightbox",
                touchNavigation: true,
                loop: true,
                zoomable: true,
            });
            return () => lightbox.destroy();
        }
    }, [loading, galleryItems]);

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
                        <h1>Our Gallery</h1>
                        <p>
                            Capturing life’s most precious moments through cinematic
                            storytelling
                        </p>
                        <nav className="breadcrumbs">
                            <ol>
                                <li><a href="/">Home</a></li>
                                <li className="current">Gallery</li>
                            </ol>
                        </nav>
                    </div>
                </div>

                {/* Gallery Section */}
                <section className="section py-5">
                    <div className="container">
                        <div className="section-title text-center portfolioHeader" data-aos="fade-up">
                            <h2>A Visual Journey</h2>
                            <p className="text-muted mt-2">
                                Explore our curated collection of moments, captured with passion and precision.
                            </p>
                        </div>

                        {loading ? (
                            <div className="text-center py-5">
                                <div className="spinner-border text-gold-500" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        ) : (
                            <div className="row g-4 justify-content-center">
                                {galleryItems.length > 0 ? (
                                    galleryItems.map((item) => (
                                        <div key={item._id} className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="100">
                                            <div className="gallery-item position-relative overflow-hidden rounded-3 shadow-sm h-100">
                                                <a
                                                    href={item.image}
                                                    className="glightbox"
                                                    data-gallery="gallery"
                                                    data-title={item.title}
                                                    data-description={item.category}
                                                >
                                                    <img
                                                        src={item.image}
                                                        alt={item.title}
                                                        className="img-fluid w-100 h-100 object-fit-cover"
                                                        style={{ minHeight: "250px", maxHeight: "300px", objectFit: "cover" }}
                                                    />
                                                    <div className="gallery-overlay position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-300">
                                                        <div className="text-center text-white p-3">
                                                            <h5 className="mb-1">{item.title}</h5>
                                                            <p className="small mb-0 text-white-50">{item.category}</p>
                                                        </div>
                                                    </div>
                                                </a>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-12 text-center">
                                        <p>No gallery items found.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </section>
            </main>

            <Footer />

            <style jsx>{`
        .gallery-item:hover .gallery-overlay {
          opacity: 1 !important;
        }
        .gallery-item img {
          transition: transform 0.5s ease;
        }
        .gallery-item:hover img {
          transform: scale(1.05);
        }
      `}</style>
        </>
    );
};

export default Gallery;
