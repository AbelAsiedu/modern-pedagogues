import { Layout } from "@/components/layout/layout"
import { HeroSection } from "@/components/sections/hero-section"
import { FeaturesSection } from "@/components/sections/features-section"
import { CoursesSection } from "@/components/sections/courses-section"
import { TestimonialsSection } from "@/components/sections/testimonials-section"
import { CTASection } from "@/components/sections/cta-section"
import { StatsSection } from "@/components/sections/stats-section"

export default function HomePage() {
  return (
    <Layout>
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <CoursesSection />
      <TestimonialsSection />
      <CTASection />
    </Layout>
  )
}
