import HeroSlider from "@/components/home/HeroSlider";
import TopCampaigns from "@/components/home/TopCampaigns";
import TestimonialSlider from "@/components/home/TestimonialSlider";
import ExtraSections from "@/components/home/ExtraSections";

export default function HomePage() {
  return (
    <div>
      <HeroSlider />
      <TopCampaigns />
      <ExtraSections />
      <TestimonialSlider />
    </div>
  );
}
