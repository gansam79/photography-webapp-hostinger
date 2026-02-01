import React, { useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import LuxGallery from './LuxGallery';
import './StoryModal.css';

const StoryModal = ({ show, onHide, story }) => {
  useEffect(() => {
    if (show && window.GLightbox) {
      // Cleanup previous GLightbox instances
      const existing = document.querySelector('.glightbox');
      if (existing && existing.glightbox) {
        try {
          existing.glightbox.destroy();
        } catch (e) {
          // Ignore cleanup errors
        }
      }
      
      // Initialize GLightbox for modal images
      setTimeout(() => {
        try {
          window.GLightbox({
            selector: '.glightbox',
            loop: true,
            touchNavigation: true,
            keyboardNavigation: true,
            zoomable: true,
          });
        } catch (e) {
          console.warn('GLightbox initialization error:', e);
        }
      }, 0);
    }
  }, [show, story]);

  if (!story) return null;

  return (
    <Modal show={show} onHide={onHide} size="xl" centered scrollable={false}>
      <Modal.Header closeButton>
      </Modal.Header>
      <Modal.Body className="px-4 pb-4 pt-0" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
        <h2 className="text-center fw-bolder">{story.title}</h2>
        <h5 className="text-center text-muted accent-color">{story.subtitle}</h5>
        <div className="section-title pb-0"><h2></h2></div>
        <p className="mt-3 mb-5 text-center">{story.description}</p>
        {story.images && story.images.length > 0 && (
          <div style={{ padding: '10px 0' }}>
            <LuxGallery images={story.images} galleryId={`story-${story._id}`} />
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default StoryModal;