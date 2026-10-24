import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

export function Layout({ children }) {
  return (
    <div className="app-layout">
      <Navbar />
      <main className="main-content" id="main-content" tabIndex={-1}>
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
