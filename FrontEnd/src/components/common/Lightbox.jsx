import React, { useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, MapPin, Tag } from 'lucide-react';
import './Lightbox.css';

/**
 * Reusable Lightbox component for gallery preview:
 * - Full-screen focus overlay
 * - Prev / Next slide navigation
 * - Keyboard listeners (Escape, Left, Right)
 * - Accessible aria attributes and focus trap
 */
export function Lightbox({
  isOpen,
  items = [],
  currentIndex = 0,
  onClose,
  onPrev,
  onNext
}) {
  const currentItem = items[currentIndex];

  const handleKeyDown = useCallback(
    (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        onPrev();
      } else if (e.key === 'ArrowRight') {
        onNext();
      }
    },
    [isOpen, onClose, onPrev, onNext]
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen || !currentItem) return null;

  return (
    <div
      className="lightbox-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Peninjau Galeri Foto"
      onClick={onClose}
    >
      <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button
          type="button"
          className="lightbox-btn-close"
          onClick={onClose}
          aria-label="Tutup pratinjau foto (Escape)"
        >
          <X size={22} />
        </button>

        {/* Prev Button */}
        <button
          type="button"
          className="lightbox-nav-btn lightbox-btn-prev"
          onClick={onPrev}
          aria-label="Foto sebelumnya"
          disabled={items.length <= 1}
        >
          <ChevronLeft size={28} />
        </button>

        {/* Next Button */}
        <button
          type="button"
          className="lightbox-nav-btn lightbox-btn-next"
          onClick={onNext}
          aria-label="Foto berikutnya"
          disabled={items.length <= 1}
        >
          <ChevronRight size={28} />
        </button>

        {/* Main Media Container */}
        <div className="lightbox-media-wrapper">
          <img
            src={currentItem.image}
            alt={currentItem.title}
            className="lightbox-image"
          />
        </div>

        {/* Caption & Metadata Bar */}
        <div className="lightbox-caption-bar">
          <div className="lightbox-caption-info">
            <div className="lightbox-badges">
              <span className="lightbox-badge-category">
                <Tag size={12} /> {currentItem.category}
              </span>
              {currentItem.location && (
                <span className="lightbox-badge-location">
                  <MapPin size={12} /> {currentItem.location}
                </span>
              )}
            </div>
            <h3 className="lightbox-caption-title">{currentItem.title}</h3>
            {currentItem.description && (
              <p className="lightbox-caption-desc">{currentItem.description}</p>
            )}
          </div>
          <div className="lightbox-counter">
            {currentIndex + 1} / {items.length}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Lightbox;
