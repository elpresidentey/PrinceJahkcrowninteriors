import {
  Hero,
  Stats,
  Features,
  ServicesPreview,
  FeaturedProjects,
  ProcessSteps,
  Testimonials,
  CTASection,
} from "@/components/sections";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
      <Features />
      <ServicesPreview />
      <FeaturedProjects />
      <ProcessSteps />
      <Testimonials />
      <CTASection />
    </>
  );
}
