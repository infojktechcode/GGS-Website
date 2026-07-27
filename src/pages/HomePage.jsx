import SEO from '../components/common/SEO'
import HeroSection from '../components/home/HeroSection'
import WelcomeSection from '../components/home/WelcomeSection'
import WhyChooseUs from '../components/home/WhyChooseUs'
import StatsSection from '../components/home/StatsSection'
import AcademicLevels from '../components/home/AcademicLevels'
import StudentLifePreview from '../components/home/StudentLifePreview'
import TestimonialsPreview from '../components/home/TestimonialsPreview'
import NewsPreview from '../components/home/NewsPreview'
import EventsPreview from '../components/home/EventsPreview'
import CTASection from '../components/home/CTASection'

export default function HomePage() {
  return (
    <>
      <SEO />
      <HeroSection />
      <WelcomeSection />
      <WhyChooseUs />
      <StatsSection />
      <AcademicLevels />
      <StudentLifePreview />
      <TestimonialsPreview />
      <NewsPreview />
      <EventsPreview />
      <CTASection />
    </>
  )
}
