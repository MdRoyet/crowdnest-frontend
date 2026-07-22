import HeroSlider from "@/components/home/HeroSlider";
import FeaturedCampaigns from "@/components/home/FeaturedCampaigns";
import ExtraSections from "@/components/home/ExtraSections";
import TestimonialSlider from "@/components/home/TestimonialSlider";

export default function HomePage() {
  return (
    <div>
      <HeroSlider />
      <FeaturedCampaigns />
      <ExtraSections />
      <TestimonialSlider />
    </div>
  );
}
