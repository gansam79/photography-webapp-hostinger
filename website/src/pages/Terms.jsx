import React, { useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Terms = () => {
  useEffect(() => {
    document.body.className = 'terms-page';
    
    return () => {
      document.body.className = '';
    };
  }, []);

  return (
    <>
      <Header />
      
      {/* Page Title */}
      <div className="page-title dark-background" style={{backgroundImage: "url('/assets/img/slider/4.jpg')"}}>
        <div className="container position-relative">
          <h1>Terms of Service</h1>
          <p>Terms and conditions for using our services</p>
          <nav className="breadcrumbs">
            <ol>
              <li><a href="/">Home</a></li>
              <li className="current">Terms of Service</li>
            </ol>
          </nav>
        </div>
      </div>

      <main className="main">
        <section className="section mt-5 pt-5">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <h1>Terms of Service</h1>
                <p>Terms of service content will be displayed here.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Terms;