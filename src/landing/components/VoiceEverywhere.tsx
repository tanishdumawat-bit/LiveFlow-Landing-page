import { motion } from 'motion/react';
import { AppOrbit } from '../animations/AppOrbit';
import { RevealHeadline } from '../animations/RevealHeadline';

export function VoiceEverywhere() {
  return (
    <section id="product" className="relative px-4 py-24 sm:px-6 lg:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <RevealHeadline
            as="h2"
            lines={['One voice.', 'Every app.']}
            className="text-4xl font-semibold tracking-tight text-white sm:text-5xl"
          />
          <motion.p
            initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="mt-4 text-base text-[#8a8a93] sm:text-lg"
          >
            Live Flow sits above your desktop and carries your words into the tools you already use.
          </motion.p>
        </div>

        <div className="mt-12">
          <AppOrbit />
        </div>
      </div>
    </section>
  );
}
