import React, { useState } from 'react';
import CinematicIntro from '../components/intro/CinematicIntro';
import AmbientGlow from '../components/effects/AmbientGlow';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Hero from '../components/hero/Hero';
import About from '../components/sections/About';
import Education from '../components/sections/Education';
import WorkProjects from '../components/sections/WorkProjects';
import SkillsCollaboration from '../components/sections/SkillsCollaboration';
import ButterflyFAQ from '../components/sections/ButterflyFAQ';
import ContactSection from '../components/contact/ContactSection';
import OutroFinale from '../components/sections/OutroFinale';
import DeveloperProfileModal from '../components/modals/DeveloperProfileModal';
import ResumeModal from '../components/modals/ResumeModal';
import PasskeyModal from '../components/modals/PasskeyModal';

export default function PublicPortfolio({ currentTheme, onThemeChange }) {
  const [resumeModalOpen, setResumeModalOpen] = useState(false);
  const [devProfileModalOpen, setDevProfileModalOpen] = useState(false);
  const [adminPasskeyModalOpen, setAdminPasskeyModalOpen] = useState(false);

  return (
    <div className="portfolio-app">
      {/* Cinematic Opening Sequence */}
      <CinematicIntro />

      {/* Ambient Mouse Glow Spotlight & Floral Click Bursts */}
      <AmbientGlow />

      {/* Floating Navigation Bar with 10 Themes & Mobile Drawer */}
      <Navbar currentTheme={currentTheme} onThemeChange={onThemeChange} />

      {/* Main Sections */}
      <main id="main-content">
        <Hero
          onOpenResume={() => setResumeModalOpen(true)}
          onOpenProfile={() => setDevProfileModalOpen(true)}
          onOpenAdminPasskey={() => setAdminPasskeyModalOpen(true)}
        />
        <About />
        <Education />
        <WorkProjects />
        <SkillsCollaboration />
        <ButterflyFAQ />
        <ContactSection />
        <OutroFinale />
      </main>

      {/* Site Footer */}
      <Footer />

      {/* Interactive Modals */}
      <DeveloperProfileModal
        isOpen={devProfileModalOpen}
        onClose={() => setDevProfileModalOpen(false)}
        onOpenResume={() => setResumeModalOpen(true)}
      />

      <ResumeModal
        isOpen={resumeModalOpen}
        onClose={() => setResumeModalOpen(false)}
      />

      <PasskeyModal
        isOpen={adminPasskeyModalOpen}
        onClose={() => setAdminPasskeyModalOpen(false)}
      />
    </div>
  );
}
