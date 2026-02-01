import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const NotFound = () => {
  useEffect(() => {
    document.body.className = '404-page';
    
    return () => {
      document.body.className = '';
    };
  }, []);

  return (
    <>
      <Header />
      
      {/* Page Title */}
      <div className="page-title dark-background" style={{backgroundImage: "url('/assets/img/slider/11.jpg')"}}>
        <div className="container position-relative">
          <h1>Page Not Found</h1>
          <p>The page you're looking for doesn't exist</p>
          <nav className="breadcrumbs">
            <ol>
              <li><a href="/">Home</a></li>
              <li className="current">404</li>
            </ol>
          </nav>
        </div>
      </div>

      <main className="main">
        <section className="section mt-5 pt-5">
          <div className="container">
            <div className="row justify-content-center text-center">
              <div className="col-lg-6">
                <h1 className="display-1">404</h1>
                <h2>Page Not Found</h2>
                <p>The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
                <Link to="/" className="btn btn-primary">Go Home</Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default NotFound;