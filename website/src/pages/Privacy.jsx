import React, { useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Privacy = () => {
  useEffect(() => {
    document.body.className = 'privacy-page';
    
    return () => {
      document.body.className = '';
    };
  }, []);

  return (
    <>
      <Header />
      
      {/* Page Title */}
      <div className="page-title dark-background" style={{backgroundImage: "url('/assets/img/slider/hero6.jpg')"}}>
        <div className="container position-relative">
          <h1>Privacy Policy</h1>
          <p>How we protect and handle your personal information</p>
          <nav className="breadcrumbs">
            <ol>
              <li><a href="/">Home</a></li>
              <li className="current">Privacy Policy</li>
            </ol>
          </nav>
        </div>
      </div>

      <main className="main">
        <section className="section mt-5 pt-5">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <h1>Privacy Policy</h1>
                <p>Privacy policy content will be shown here.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Privacy;