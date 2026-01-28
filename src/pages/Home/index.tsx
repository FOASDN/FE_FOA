import React from "react";
import HomeHeader from "./components/HomeHeader";
import HeroCarousel from "./components/HeroCarousel";
import CategorySection from "./components/CategorySection";
import RecommendedSection from "./components/RecommendedSection";
import BestSellerSection from "./components/BestSellerSection";
import VoucherSection from "./components/VoucherSection";
import LoyaltySection from "./components/LoyaltySection";
import ReviewSection from "./components/ReviewSection";
import CulinaryStorySection from "./components/CulinaryStorySection";
import HistorySection from "./components/HistorySection";
import HomeFooter from "./components/HomeFooter";
import { useUserLocation } from "@/hooks/useUserLocation"; 
import LocationAlert from "@/components/LocationAlert";
const HomePage = () => {
      const { loading, error, isValid } = useUserLocation();
    return (
        <>
          <LocationAlert
           loading={loading}
            error={error}
            isValid={isValid}
  />
       <div className="min-h-screen">

            {/* --- HEADER --- */}
            <HomeHeader />

            {/* --- MAIN CONTENT --- */}
            <main className="flex-1 flex flex-col items-center pb-20">
                <div className="w-full max-w-7xl px-4 md:px-8 py-8 flex flex-col gap-12">

                    {/* 1. HERO BANNER CAROUSEL */}
                    <HeroCarousel />

                    {/* 2. CATEGORIES */}
                    <CategorySection />

                    {/* 3. RECOMMENDED - AI PICKS */}
                    <RecommendedSection />

                    {/* 4. BEST SELLERS */}
                    <BestSellerSection />

                    {/* 5. VOUCHER WALLET */}
                    <VoucherSection />

                    {/* 6. LOYALTY PROGRAM */}
                    <LoyaltySection />

                    {/* 7. REVIEWS */}
                    <ReviewSection />

                    {/* 8. CULINARY STORIES */}
                    <CulinaryStorySection />

                    {/* 9. HISTORY SECTION */}
                    <HistorySection />

                </div>
            </main>

            {/* --- FOOTER --- */}
            <HomeFooter />
        </div>
        </>
    );
};

export default HomePage;