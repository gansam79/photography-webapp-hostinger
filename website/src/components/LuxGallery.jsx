import React from "react";

const LuxGallery = ({ images, galleryId = "gallery" }) => {
  return (
    <div className="lux-gallery">
      {images.map((image, index) => (
        <a
          key={index}
          href={image}
          className="glightbox lux-card"
          data-gallery={galleryId}
          data-type="image"
          data-description=""
          aria-label={`Open ${galleryId} image ${index + 1}`}
        >
          <img
            src={image}
            alt={`${galleryId} ${index + 1}`}
            loading="lazy"
          />
          <span className="lux-shine" />
        </a>
      ))}
    </div>
  );
};

export default LuxGallery;
