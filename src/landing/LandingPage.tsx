import { SmoothScroll } from './components/SmoothScroll';
import { AmbientBackground } from './components/AmbientBackground';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { DifferenceDemo } from './components/DifferenceDemo';
import { MetricsSpeed } from './components/MetricsSpeed';
import { ContextDemo } from './components/ContextDemo';
import { PersonalizationSection } from './components/PersonalizationSection';
import { CorrectionDemo } from './components/CorrectionDemo';
import { DeveloperDemo } from './components/DeveloperDemo';
import { PersistentLiveFlow } from './components/PersistentLiveFlow';
import { HowItWorks } from './components/HowItWorks';
import { NoteTakerSection } from './components/NoteTakerSection';
import { AppEcosystem } from './components/AppEcosystem';
import { PrivacySection } from './components/PrivacySection';
import { MetricsSection } from './components/MetricsSection';
import { FaqSection } from './components/FaqSection';
import { EcosystemFinale } from './components/EcosystemFinale';
import { Footer } from './components/Footer';
import { SectionBridge } from './animations/SectionBridge';
import { SectionReveal } from './animations/SectionReveal';
import { HashPageTransition } from './animations/HashPageTransition';

/**
 * Live Flow landing — warm editorial product narrative.
 * Uses Codrops Page Transitions for hash navigation.
 * @see https://tympanus.net/Development/PageTransitions/
 */
export function LandingPage() {
  return (
    <SmoothScroll>
      <div className="min-h-screen bg-[#FAF3E9] text-[#2A2420]">
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
          <SectionReveal variant="moveFromRight">
            <ContextDemo />
          </SectionReveal>

          <SectionBridge from="Context" to="You" />
          <SectionReveal variant="scaleUp">
            <PersonalizationSection />
          </SectionReveal>

          <SectionBridge from="You" to="Corrections" />
          <SectionReveal variant="moveFromBottomFade">
            <CorrectionDemo />
          </SectionReveal>

          <SectionBridge from="Corrections" to="Builders" />
          <SectionReveal variant="moveFromRight">
            <DeveloperDemo />
          </SectionReveal>

          <SectionBridge from="Builders" to="Flow" />
          <SectionReveal variant="scaleUp">
            <HowItWorks />
          </SectionReveal>

          <SectionBridge from="Flow" to="Meetings" />
          <SectionReveal variant="moveFromBottom">
            <NoteTakerSection />
          </SectionReveal>

          <SectionBridge from="Meetings" to="Apps" />
          <SectionReveal variant="scaleUpCenter">
            <AppEcosystem />
          </SectionReveal>

          <SectionBridge from="Apps" to="Privacy" />
          <SectionReveal variant="rotateRoomBottomIn">
            <PrivacySection />
          </SectionReveal>

          <MetricsSection />

          <SectionBridge from="Privacy" to="FAQs" />
          <SectionReveal variant="moveFromBottom">
            <FaqSection />
          </SectionReveal>

          <SectionBridge from="FAQs" to="Download" />
          <SectionReveal variant="scaleUpCenter">
            <EcosystemFinale />
          </SectionReveal>
        </main>
        <Footer />
      </div>
    </SmoothScroll>
  );
}
