import React, { useState, useEffect } from 'react';
import { useLens } from '@/hooks/useLens';
import { LENSES } from '@/utils/lenses';

export const LensSelectorFixed: React.FC = () => {
  const { lens, setLens } = useLens();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 769);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const handleLensSelect = (lensKey: string) => {
    setLens(lensKey as any);
    if (isMobile) {
      setIsOpen(false); // Auto-close on mobile after selection
    }
  };

  // Touch gesture handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart) return;
    
    const touchEnd = e.touches[0].clientY;
    const distance = touchEnd - touchStart;
    
    // If user swipes down more than 50px, close the sidebar
    if (distance > 50) {
      setIsOpen(false);
      setTouchStart(null);
    }
  };

  const handleTouchEnd = () => {
    setTouchStart(null);
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className="theory-lens-toggle-mobile"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Theory Lens"
        style={{ display: isMobile ? 'flex' : 'none' }}
      >
        <span className="text-xl">{LENSES[lens].emoji}</span>
        <span className="theory-indicator"></span>
      </button>

      {/* Backdrop for mobile/tablet */}
      {isOpen && isMobile && (
        <div 
          className="theory-lens-backdrop"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Theory Lens Sidebar */}
      <aside 
        className={`theory-lens-sidebar ${isOpen ? 'active' : ''} ${isMobile ? 'mobile' : ''}`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Mobile handle for swipe gesture */}
        {isMobile && (
          <div className="mobile-handle">
            <div className="handle-bar"></div>
          </div>
        )}

        {/* Header */}
        <div className="theory-header">
          <h3 className="theory-title">Theory Lens</h3>
          {isMobile && (
            <button
              className="close-button"
              onClick={() => setIsOpen(false)}
              aria-label="Close Theory Lens"
            >
              ✕
            </button>
          )}
        </div>

        {/* Theory Options */}
        <div className="theory-options">
          {Object.entries(LENSES).map(([key, config]) => (
            <button
              key={key}
              onClick={() => handleLensSelect(key)}
              className={`theory-option ${lens === key ? 'active' : ''}`}
              style={{
                backgroundColor: lens === key 
                  ? config.primaryColor 
                  : 'transparent',
                borderColor: config.primaryColor,
              }}
              title={config.description}
            >
              <span className="theory-emoji">{config.emoji}</span>
              <div className="theory-content">
                <span className="theory-name">{config.title}</span>
                <span className="theory-desc">{config.description}</span>
              </div>
              {lens === key && (
                <span className="active-indicator">✓</span>
              )}
            </button>
          ))}
        </div>

        {/* Current Theory Description */}
        <div className="current-theory">
          <div className="current-theory-header">
            <span className="current-emoji">{LENSES[lens].emoji}</span>
            <span className="current-name">{LENSES[lens].title}</span>
          </div>
          <p className="current-description">{LENSES[lens].description}</p>
        </div>
      </aside>

      <style jsx>{`
        /* Mobile-First Styles */
        .theory-lens-toggle-mobile {
          position: fixed;
          bottom: 20px;
          right: 20px;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          border: none;
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 40;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 24px;
        }

        .theory-lens-toggle-mobile:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 16px rgba(99, 102, 241, 0.4);
        }

        .theory-indicator {
          position: absolute;
          top: -2px;
          right: -2px;
          width: 16px;
          height: 16px;
          background: #ef4444;
          border: 2px solid white;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.1); }
        }

        .theory-lens-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 45;
          backdrop-filter: blur(2px);
        }

        .theory-lens-sidebar {
          position: fixed;
          background: white;
          border-radius: 20px 20px 0 0;
          box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.15);
          z-index: 50;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
          transition: transform 0.3s ease;
          will-change: transform;
        }

        /* Mobile Layout */
        .theory-lens-sidebar.mobile {
          bottom: 0;
          left: 0;
          right: 0;
          max-height: 75vh;
          transform: translateY(100%);
          border-radius: 20px 20px 0 0;
        }

        .theory-lens-sidebar.mobile.active {
          transform: translateY(0);
        }

        .mobile-handle {
          width: 100%;
          padding: 12px;
          display: flex;
          justify-content: center;
          cursor: grab;
        }

        .handle-bar {
          width: 40px;
          height: 4px;
          background: #d1d5db;
          border-radius: 2px;
        }

        .theory-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          border-bottom: 1px solid #e5e7eb;
        }

        .theory-title {
          font-size: 18px;
          font-weight: 600;
          color: #374151;
          margin: 0;
        }

        .close-button {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #f3f4f6;
          border: none;
          color: #6b7280;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .close-button:hover {
          background: #e5e7eb;
          color: #374151;
        }

        .theory-options {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .theory-option {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          border: 2px solid;
          border-radius: 12px;
          background: white;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
          min-height: 48px; /* Touch target */
          position: relative;
        }

        .theory-option:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .theory-option.active {
          color: white;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .theory-emoji {
          font-size: 24px;
          flex-shrink: 0;
        }

        .theory-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .theory-name {
          font-weight: 600;
          font-size: 16px;
        }

        .theory-desc {
          font-size: 12px;
          opacity: 0.8;
          line-height: 1.3;
        }

        .active-indicator {
          font-size: 18px;
          font-weight: bold;
          margin-left: auto;
        }

        .current-theory {
          padding: 20px;
          background: #f9fafb;
          border-radius: 0 0 20px 20px;
        }

        .current-theory-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }

        .current-emoji {
          font-size: 20px;
        }

        .current-name {
          font-weight: 600;
          color: #374151;
        }

        .current-description {
          font-size: 14px;
          color: #6b7280;
          line-height: 1.4;
          margin: 0;
        }

        /* Tablet Layout */
        @media (min-width: 769px) and (max-width: 1024px) {
          .theory-lens-sidebar:not(.mobile) {
            right: 0;
            top: 0;
            bottom: 0;
            width: 300px;
            max-height: 100vh;
            border-radius: 0;
            transform: translateX(100%);
          }

          .theory-lens-sidebar:not(.mobile).active {
            transform: translateX(0);
          }

          .mobile-handle {
            display: none;
          }
        }

        /* Desktop Layout */
        @media (min-width: 1025px) {
          .theory-lens-toggle-mobile {
            display: none !important;
          }

          .theory-lens-sidebar {
            position: sticky;
            top: 20px;
            right: 0;
            width: 320px;
            max-height: calc(100vh - 40px);
            border-radius: 16px;
            transform: none !important;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          }

          .theory-lens-backdrop {
            display: none;
          }

          .mobile-handle {
            display: none;
          }

          .close-button {
            display: none;
          }
        }

        /* Reduce motion for accessibility */
        @media (prefers-reduced-motion: reduce) {
          .theory-lens-sidebar,
          .theory-lens-toggle-mobile,
          .theory-option {
            transition: none;
          }

          .theory-indicator {
            animation: none;
          }
        }
      `}</style>
    </>
  );
};