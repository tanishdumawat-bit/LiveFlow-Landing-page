import { SmoothScroll } from './components/SmoothScroll';
import { AmbientBackground } from './components/AmbientBackground';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { DifferenceDemo } from './components/DifferenceDemo';
import { MetricsSpeed } from './components/MetricsSpeed';
import { ContextFlowExperience } from './components/context-flow/ContextFlowExperience';
import { PersistentLiveFlow } from './components/PersistentLiveFlow';
import { NoteTakerSection } from './components/NoteTakerSection';
import { PrivacySection } from './components/PrivacySection';
import { FaqSection } from './components/FaqSection';
import { FinalCTA } from './components/FinalCTA';
import { Footer } from './components/Footer';
import { SectionBridge } from './animations/SectionBridge';
import { SectionReveal } from './animations/SectionReveal';
import { HashPageTransition } from './animations/HashPageTransition';

/**
 * Live Flow landing — narrative arc with flagship Context Flow experience.
 */
export function LandingPage() {
  return (
    <SmoothScroll>
      <div className="min-h-screen bg-background text-ink">
        <AmbientBackground />
        <HashPageTransition />
        <Navbar />
        <PersistentLiveFlow />
        <main className="pt-perspective-flow">
          <Hero />

          <SectionBridge from="Speak" to="Difference" />
          <SectionReveal variant="moveFromBottomFade">
            <DifferenceDemo />
          </SectionReveal>

          <SectionBridge from="Difference" to="Speed" />
          <SectionReveal variant="moveFromBottom">
            <MetricsSpeed />
          </SectionReveal>

          <SectionBridge from="Speed" to="Context" />
          <ContextFlowExperience />

          <SectionBridge from="Context" to="Meetings" />
          <SectionReveal variant="moveFromBottom">
            <NoteTakerSection />
          </SectionReveal>

          <SectionBridge from="Meetings" to="Privacy" />
          <SectionReveal variant="rotateRoomBottomIn">
            <PrivacySection />
          </SectionReveal>

          <SectionBridge from="Privacy" to="FAQs" />
          <SectionReveal variant="moveFromBottom">
            <FaqSection />
          </SectionReveal>

          <FinalCTA />
        </main>
        <Footer />
      </div>
    </SmoothScroll>
  );
}
