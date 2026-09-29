"use client";

import { Benefits } from "@/components/HOME/Benefits";
import { BestSellers } from "@/components/HOME/BestSellers";
import { BrandStory } from "@/components/HOME/BrandStory";
import Hero from "@/components/HOME/Hero";
import { Newsletter } from "@/components/HOME/Newsletter";
import { Testimonials } from "@/components/HOME/Testimonials";

// Uncomment these when you want to use them:

// import { FeaturedCollection } from "@/components/HOME/FeaturedCollection";
// import { CampaignBanner } from "@/components/HOME/CampaignBanner";
import { CategoryGrid } from "@/components/HOME/CategoryGrid";
import CampaignBanner from "@/components/HOME/CampaignBanner";
import { FeaturedCollection } from "@/components/HOME/FeaturedCollection";

import { useEffect, useState } from "react";
import ScrollProgress from "@/components/ScrollProgress";
import LuxuryHeader from "@/components/LuxuryHeader";
import HeroSection from "@/components/HeroSection";
import PhilosophySection from "@/components/PhilosophySection";
import MakingSection from "@/components/MakingSection";
import VideoSection from "@/components/VideoSection";
import EditorialSection from "@/components/EditorialSection";
import LuxuryFooter from "@/components/LuxuryFooter";
import MenuOverlay from "@/components/MenuOverlay";
import InquiryOverlay from "@/components/InquiryOverlay";

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [inquiryOpen, setInquiryOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen || inquiryOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen, inquiryOpen]);

  return (
    <main className="bg-black text-white">
      {/* <Hero />
       <CategoryGrid /> 
       <FeaturedCollection /> 
       <BestSellers />
       <BrandStory />
       <CampaignBanner  />
      <Testimonials />
      <Benefits />
      <Newsletter /> */}

      <ScrollProgress />
      <LuxuryHeader
        onInquire={() => setInquiryOpen(true)}
        onMenu={() => setMenuOpen(true)}
      />
      <HeroSection />
      <PhilosophySection />
      <MakingSection />
      <VideoSection />
      <EditorialSection />
      <LuxuryFooter />
      <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} />
      <InquiryOverlay
        open={inquiryOpen}
        onClose={() => setInquiryOpen(false)}
      />
    </main>
  );
}
