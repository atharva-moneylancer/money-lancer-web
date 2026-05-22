import Hero from "@/components/home/Hero";
import StatsStrip from "@/components/home/StatsStrip";
import Services from "@/components/home/Services";
import LiveFunds from "@/components/home/LiveFunds";
import SipCalculator from "@/components/home/SipCalculator";
import WhyChoose from "@/components/home/WhyChoose";
import Testimonials from "@/components/home/Testimonials";
import PartnerStrip from "@/components/home/PartnerStrip";
import VideoSection from "@/components/home/VideoSection";
import { NewsSection } from "@/components/home/NewsSection";
import FounderSpotlight from "@/components/home/FounderSpotlight";
import { AwardSlideshow } from "@/components/home/AwardSlideshow";
import BucketPreview from "@/components/home/BucketPreview";
import CTA from "@/components/home/CTA";
import { getMarketQuotes } from "@/lib/markets";
import { getYouTubeVideos } from "@/lib/youtube";
import { getTopFinanceNews } from "@/lib/news";

export const revalidate = 60;

export default async function Home() {
  const [quotes, videos, news] = await Promise.all([
    getMarketQuotes(),
    getYouTubeVideos(5),
    getTopFinanceNews(6),
  ]);
  return (
    <>
      <Hero quotes={quotes} />
      <StatsStrip />
      <Services />
      <PartnerStrip />
      <LiveFunds />
      <BucketPreview />
      <SipCalculator />
      <NewsSection articles={news} />
      <VideoSection videos={videos} />
      <WhyChoose />
      <FounderSpotlight />
      <Testimonials />
      <AwardSlideshow />
      <CTA />
    </>
  );
}
