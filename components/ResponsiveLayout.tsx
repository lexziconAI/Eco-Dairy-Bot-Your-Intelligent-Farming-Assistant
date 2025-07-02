import React, { useState, useEffect } from 'react';
import { LensSelectorFixed } from './LensSelectorFixed';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
}

export const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({ children }) => {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1025);
    };
    
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  return (
    <div className="responsive-app-container">
      {/* Main Content Area */}
      <main className="main-content-area">
        {children}
      </main>

      {/* Theory Lens Sidebar */}
      <LensSelectorFixed />

      <style jsx>{`
        .responsive-app-container {
          min-height: 100vh;
          position: relative;
        }

        /* Mobile First - Main content takes full width */
        .main-content-area {
          width: 100%;
          padding-bottom: 100px; /* Space for floating toggle button */
          min-height: 100vh;
        }

        /* Tablet - Account for overlay sidebar */
        @media (min-width: 769px) and (max-width: 1024px) {
          .main-content-area {
            width: 100%;
            padding-bottom: 20px;
          }
        }

        /* Desktop - Grid layout with sidebar space */
        @media (min-width: 1025px) {
          .responsive-app-container {
            display: grid;
            grid-template-columns: 1fr 320px;
            gap: 20px;
            max-width: 1400px;
            margin: 0 auto;
            padding: 20px;
          }

          .main-content-area {
            padding-bottom: 0;
            overflow-x: hidden; /* Prevent horizontal scroll */
          }
        }

        /* Ultra-wide screens */
        @media (min-width: 1600px) {
          .responsive-app-container {
            max-width: 1600px;
            gap: 30px;
          }
        }

        /* Ensure no horizontal scroll on any device */
        .main-content-area > * {
          max-width: 100%;
          overflow-x: auto;
        }
      `}</style>
    </div>
  );
};