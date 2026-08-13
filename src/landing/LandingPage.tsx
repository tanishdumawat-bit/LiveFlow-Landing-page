import { SmoothScroll } from './components/SmoothScroll';
import { AmbientBackground } from './components/AmbientBackground';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AnywhereSection } from './components/AnywhereSection';
import { CircularCleanupSection } from './components/CircularCleanupSection';
import { SpeechWaveSection } from './components/SpeechWaveSection';
import { HowItWorks } from './components/HowItWorks';
import { MetricsSpeed } from './components/MetricsSpeed';
import { ContextFlowExperience } from './components/context-flow/ContextFlowExperience';
import { PersistentLiveFlow } from './components/PersistentLiveFlow';
import { NoteTakerSection } from './components/NoteTakerSection';
import { PrivacySection } from './components/PrivacySection';
import { FaqSection } from './components/FaqSection';
import { FinalCTA } from './components/FinalCTA';
import { Footer } from './components/Footer';
import { SectionReveal } from './animations/SectionReveal';
import { HashPageTransition } from './animations/HashPageTransition';
import { MarqueeRibbon } from './components/shared/MarqueeRibbon';
import { FlowSpine } from './components/shared/FlowSpine';

const RAW_BITS = [
  'um',
  'uh',
  'like',
  'actually wait',
  'the the',
  'gonna',
  'I think',
  'sorry end of day',
];
const CLEAN_BITS = [
  'clear',
  'punctuated',
  'corrected',
  'no fillers',
  'ready to send',
  'in the right app',
];

/**
 * Live Flow landing — WhisperFlow energy, Live Flow product.
 */
export function LandingPage() {
  return (
    <SmoothScroll>
      <div className="min-h-screen bg-background text-ink">
        <AmbientBackground />
        <HashPageTransition />
        <Navbar />
        <FlowSpine />
        <PersistentLiveFlow />
        <main className="pt-perspective-flow">
          <Hero />

          <MarqueeRibbon
            tone="gold"
            from="Orbit"
            to="Anywhere"
            items={['Gmail', 'Slack', 'Notion', 'Cursor', 'ChatGPT', 'Browser', 'Notes']}
          />

          <AnywhereSection />

          <MarqueeRibbon
            tone="coral"
            from="Anywhere"
            to="Writing"
            items={[...RAW_BITS, ...CLEAN_BITS]}
          />

          <CircularCleanupSection />

          <SectionReveal variant="moveFromBottomFade">
            <SpeechWaveSection />
          </SectionReveal>

          <MarqueeRibbon
            tone="violet"
            from="Wave"
            to="How"
            items={['um', 'uh', 'like', 'comma', 'period', 'ready to send']}
          />

          <SectionReveal variant="moveFromBottomFade">
            <HowItWorks />
          </SectionReveal>

          <MarqueeRibbon
            tone="teal"
            from="How"
            to="Voice"
            items={['35 wpm typing', '195 wpm speaking', '5× the keyboard', 'thought → text']}
          />

          <SectionReveal variant="moveFromBottom">
            <MetricsSpeed />
          </SectionReveal>

          <MarqueeRibbon
            tone="gold"
            reverse
            from="Voice"
            to="Context"
            items={['Same speech', 'Different destination', 'Email · ping · note · prompt']}
          />

          <ContextFlowExperience />

          <MarqueeRibbon
            tone="coral"
            reverse
            from="Context"
            to="Meetings"
            items={['Decisions', 'Owners', 'Action items', 'The waveform fades']}
          />

          <SectionReveal variant="moveFromBottom">
            <NoteTakerSection />
          </SectionReveal>

          <MarqueeRibbon
            tone="midnight"
            from="Meetings"
            to="Yours"
            items={['Your key', 'Your Mac', 'Your session', 'Never an archive']}
          />

          <SectionReveal variant="rotateRoomBottomIn">
            <PrivacySection />
          </SectionReveal>

          <MarqueeRibbon
            tone="violet"
            reverse
            from="Privacy"
            to="Questions"
            items={['Good questions', 'Straight answers', 'Option + Space']}
          />

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
