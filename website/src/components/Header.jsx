import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSettings } from '../hooks/useSettings';

const Header = () => {
  const { settings } = useSettings();
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // ... (rest of logic)

  const toggleMobileNav = () => {
    setIsMobileNavOpen(!isMobileNavOpen);
  };

  useEffect(() => {
    try {
      if (isMobileNavOpen) {
        document.body.classList.add('mobile-nav-active');
      } else {
        document.body.classList.remove('mobile-nav-active');
      }
    } catch (error) {
      console.error('Error in Header useEffect:', error);
    }
  }, [isMobileNavOpen]);

  // Close mobile nav on route change
  useEffect(() => {
    try {
      setIsMobileNavOpen(false);
    } catch (error) {
      console.error('Error closing mobile nav:', error);
    }
  }, [location]);

  return (
    <header id="header" className={`header d-flex align-items-center fixed-top ${!isHomePage ? 'not-home' : ''}`}>
      <div className="container-fluid container-xl position-relative d-flex align-items-center">

        <Link to="/" className="logo d-flex align-items-center me-auto">
          {settings?.primaryLogo ? (
            <img src={settings.primaryLogo} alt="Logo" style={{ maxHeight: '60px', width: 'auto', objectFit: 'contain' }} />
          ) : (
            <img src="/assets/img/logo.PNG" alt="Logo" />
          )}
          {(!settings?.primaryLogo && !settings) && (
            // Fallback or if desired to show name alongside logo
            null
          )}
          {/* Optional: Show business name if no logo, or responsive logic */}
          {/* <h1 className="sitename d-none d-sm-block">{settings?.businessName || "The Patil Photography"}</h1> */}
        </Link>

        <nav id="navmenu" className="navmenu">
          <ul>
            <li><Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link></li>
            <li><Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>About Us</Link></li>
            <li><Link to="/team" className={location.pathname === '/team' ? 'active' : ''}>Team</Link></li>
            <li><Link to="/portfolio" className={location.pathname === '/portfolio' ? 'active' : ''}>Portfolio</Link></li>
            <li><Link to="/stories" className={location.pathname === '/stories' ? 'active' : ''}>Stories</Link></li>
            <li><Link to="/films" className={location.pathname === '/films' ? 'active' : ''}>Films</Link></li>
            <li><Link to="/webtestimonials" className={location.pathname === '/webtestimonials' ? 'active' : ''}>Testimonials</Link></li>
            <li><Link to="/quote" className={location.pathname === '/quote' ? 'active' : ''}>Book Us</Link></li>
            <li><Link to="/contact" className={location.pathname === '/contact' ? 'active' : ''}>Contact Us</Link></li>
          </ul>
          <i
            className={`mobile-nav-toggle d-xl-none bi ${isMobileNavOpen ? 'bi-x' : 'bi-list'}`}
            onClick={toggleMobileNav}
          ></i>
        </nav>

      </div>
    </header>
  );
};

export default Header;