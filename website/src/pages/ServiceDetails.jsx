import React, { useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const ServiceDetails = () => {
  useEffect(() => {
    document.body.className = 'service-details-page';
    
    return () => {
      document.body.className = '';
    };
  }, []);

  return (
    <>
      <Header />
      
      {/* Page Title */}
      <div className="page-title dark-background" style={{backgroundImage: "url('/assets/img/HomePage/7.webp')"}}>
        <div className="container position-relative">
          <h1>Service Details</h1>
          <p>Detailed information about our photography services</p>
          <nav className="breadcrumbs">
            <ol>
              <li><a href="/">Home</a></li>
              <li><a href="/services">Services</a></li>
              <li className="current">Service Details</li>
            </ol>
          </nav>
        </div>
      </div>

      <main className="main">
        <section className="section mt-5 pt-5">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <h1>Service Details</h1>
                <p>Detailed service information will be displayed here.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default ServiceDetails;