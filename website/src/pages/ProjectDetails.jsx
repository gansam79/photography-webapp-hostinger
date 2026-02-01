import React, { useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const ProjectDetails = () => {
  useEffect(() => {
    document.body.className = 'project-details-page';
    
    return () => {
      document.body.className = '';
    };
  }, []);

  return (
    <>
      <Header />
      
      {/* Page Title */}
      <div className="page-title dark-background" style={{backgroundImage: "url('/assets/img/HomePage/Turning-Real-Emotions-into-Everlasting-Art-Photo.jpg')"}}>
        <div className="container position-relative">
          <h1>Project Details</h1>
          <p>In-depth look at our featured photography projects</p>
          <nav className="breadcrumbs">
            <ol>
              <li><a href="/">Home</a></li>
              <li><a href="/portfolio">Portfolio</a></li>
              <li className="current">Project Details</li>
            </ol>
          </nav>
        </div>
      </div>

      <main className="main">
        <section className="section mt-5 pt-5">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <h1>Project Details</h1>
                <p>Detailed project information will be displayed here.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default ProjectDetails;