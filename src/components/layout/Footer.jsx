import React from 'react';

export default function Footer() {
  const scrollToTop = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="site-footer">
      <a href="#top" className="footer-brand" onClick={scrollToTop}>
        Amrutha <span>✿</span>
      </a>
      <p>Built with care, curiosity &amp; a little bit of magic &bull; Divvela Jyoti Venkata Amrutha</p>
      <a href="#top" className="back-to-top" onClick={scrollToTop}>
        Back to top <span aria-hidden="true">↑</span>
      </a>
    </footer>
  );
}
