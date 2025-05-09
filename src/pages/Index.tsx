
import React, { useRef, useEffect } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import HeroSection from '@/components/home/HeroSection';
import WhatIsMimoSection from '@/components/home/WhatIsMimoSection';
import ComparisonSection from '@/components/home/ComparisonSection';
import HowItWorksSection from '@/components/home/HowItWorksSection';

const Index = () => {
  // Refs for scroll animations
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const howItWorksRef = useRef<HTMLDivElement>(null);
  const comparisonRef = useRef<HTMLDivElement>(null);
  
  // Set up intersection observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
            entry.target.classList.remove('opacity-0');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    
    const refs = [
      heroRef.current,
      featuresRef.current,
      howItWorksRef.current,
      comparisonRef.current,
    ];
    
    refs.forEach((ref) => {
      if (ref) observer.observe(ref);
    });
    
    return () => {
      refs.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-grow">
        <HeroSection heroRef={heroRef} />
        <WhatIsMimoSection featuresRef={featuresRef} />
        <ComparisonSection comparisonRef={comparisonRef} />
        <HowItWorksSection howItWorksRef={howItWorksRef} />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
