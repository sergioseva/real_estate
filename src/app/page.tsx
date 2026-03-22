import { HeroSection } from "@/components/home/hero-section";
import { FeaturedProperties } from "@/components/home/featured-properties";
import { getFeaturedProperties } from "@/actions/properties";

export default async function HomePage() {
  const featured = await getFeaturedProperties();

  return (
    <>
      <HeroSection />
      <FeaturedProperties properties={featured} />
    </>
  );
}
