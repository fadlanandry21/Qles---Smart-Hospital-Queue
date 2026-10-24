import React, { useState } from 'react';
import { Maximize2, Tag, MapPin, Eye } from 'lucide-react';
import { galleryCategories, galleryItems } from '../data/galleryData';
import Lightbox from '../components/common/Lightbox';
import Card, { CardBody } from '../components/common/Card';
import Badge from '../components/common/Badge';
import Reveal from '../components/common/Reveal';
import './GalleryPage.css';

export function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  const filteredPhotos = selectedCategory === 'Semua'
    ? galleryItems
    : galleryItems.filter(item => item.category === selectedCategory);

  const openLightboxAt = (index) => {
    setActivePhotoIndex(index);
    setLightboxOpen(true);
  };

  const handlePrev = () => {
    setActivePhotoIndex((prev) => (prev > 0 ? prev - 1 : filteredPhotos.length - 1));
  };

  const handleNext = () => {
    setActivePhotoIndex((prev) => (prev < filteredPhotos.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="page-container gallery-page">
      <div className="container">
        {/* Header */}
        <div className="page-header">
          <span className="page-badge">Fasilitas Rumah Sakit</span>
          <h1 className="page-title">Galeri Fasilitas & Teknologi Modern</h1>
          <p className="page-subtitle">
            Jelajahi kenyamanan fasilitas rawat jalan, ruang tunggu digital ramah anak, paviliun rawat inap, dan instrumen diagnostik presisi RS Qless.
          </p>
        </div>

        {/* Category Filters */}
        <div className="filter-tabs-wrapper">
          {galleryCategories.map((category) => (
            <button
              key={category}
              type="button"
              className={`filter-tab-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="gallery-masonry-grid">
          {filteredPhotos.map((item, index) => (
            <Reveal key={item.id} direction="up" delay={(index % 4) * 120}>
              <div
                className="gallery-photo-card"
                onClick={() => openLightboxAt(index)}
                role="button"
                tabIndex={0}
                aria-label={`Buka pratinjau foto ${item.title}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openLightboxAt(index);
                  }
                }}
              >
                <div className="gallery-photo-wrapper">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="gallery-photo-img"
                    loading="lazy"
                  />

                  {/* Hover Overlay */}
                  <div className="gallery-hover-overlay">
                    <div className="gallery-hover-icon">
                      <Maximize2 size={24} />
                    </div>
                    <span className="gallery-hover-hint">Klik untuk perbesar</span>
                  </div>

                  {/* Badge */}
                  <span className="gallery-photo-badge">
                    {item.category}
                  </span>
                </div>

                <div className="gallery-photo-meta">
                  <h3 className="gallery-photo-title">{item.title}</h3>
                  <div className="gallery-location-row">
                    <MapPin size={13} className="text-primary" />
                    <span>{item.location}</span>
                  </div>
                  <p className="gallery-photo-desc">{item.description}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Reusable Lightbox Component */}
        <Lightbox
          isOpen={lightboxOpen}
          items={filteredPhotos}
          currentIndex={activePhotoIndex}
          onClose={() => setLightboxOpen(false)}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      </div>
    </div>
  );
}

export default GalleryPage;
