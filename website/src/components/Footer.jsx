import React from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../hooks/useSettings';

const Footer = () => {
  const { settings } = useSettings();

  const getIconClass = (platform) => {
    switch (platform) {
      case 'WhatsApp': return 'bi bi-whatsapp';
      case 'Instagram': return 'bi bi-instagram';
      case 'Facebook': return 'bi bi-facebook';
      case 'YouTube': return 'bi bi-youtube';
      case 'Twitter': return 'bi bi-twitter-x';
      case 'LinkedIn': return 'bi bi-linkedin';
      default: return 'bi bi-link-45deg';
    }
  };

  const businessName = settings?.businessName || "The Patil Photography & Film's";

  return (
    <footer id="footer" className="footer dark-background">
      <div className="container">
        <div className="row gy-5">

          <div className="col-lg-12">
            <div className="footer-brand">
              <Link to="/" className="logo d-flex align-items-center mb-3">
                <span className="sitename"> {businessName}</span>
              </Link>
              <p className="tagline">Preserving Pure Emotion in Every Frame.</p>

              <div className="contact-info mt-3 text-sm text-gray-400">
                {settings?.primaryMobileNumber && (
                  <div className="mb-1"><i className="bi bi-telephone me-2"></i> {settings.primaryMobileNumber}</div>
                )}
                {settings?.contactEmail && (
                  <div><i className="bi bi-envelope me-2"></i> {settings.contactEmail}</div>
                )}
              </div>

              <div className="social-links mt-4">
                {settings?.socialLinks?.filter(l => l.active).map((link, index) => (
                  <a key={index} href={link.url} target="_blank" rel="noopener noreferrer" aria-label={link.platform}>
                    <i className={getIconClass(link.platform)}></i>
                  </a>
                ))}

                {(!settings?.socialLinks || settings.socialLinks.length === 0) && (
                  // Fallback links if none loaded
                  <>
                    <a href="#" aria-label="Facebook"><i className="bi bi-facebook"></i></a>
                    <a href="#" aria-label="Instagram"><i className="bi bi-instagram"></i></a>
                  </>
                )}
              </div>
            </div>
          </div>


        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="footer-bottom-content">
                <p className="mb-0">© <span className="sitename">{businessName}</span>. All rights reserved.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;