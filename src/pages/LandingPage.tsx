import React from 'react';
import { useNavigate } from 'react-router-dom';
import LandingHero from '@/components/landing/LandingHero';
import TrustSection from '@/components/landing/TrustSection';
import HowItWorks from '@/components/landing/HowItWorks';
import KeyFeatures from '@/components/landing/KeyFeatures';
import ForParentsSchools from '@/components/landing/ForParentsSchools';
import SampleActivities from '@/components/landing/SampleActivities';
import Testimonials from '@/components/landing/Testimonials';
import CallToAction from '@/components/landing/CallToAction';
import LandingFooter from '@/components/landing/LandingFooter';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleStartLearning = () => {
    navigate('/');
  };

  const handleForParents = () => {
    // Scroll to parents section or navigate
    const element = document.getElementById('for-parents');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <LandingHero 
        onStartLearning={handleStartLearning}
        onForParents={handleForParents}
      />
      <TrustSection />
      <HowItWorks />
      <KeyFeatures />
      <div id="for-parents">
        <ForParentsSchools onGetStarted={handleStartLearning} />
      </div>
      <SampleActivities />
      <Testimonials />
      <CallToAction onGetStarted={handleStartLearning} />
      <LandingFooter />
    </div>
  );
};

export default LandingPage;
