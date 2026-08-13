import { motion, useReducedMotion } from 'motion/react';

type RevealHeadlineProps = {
  lines: string[];
  className?: string;
  accentLineIndex?: number;
  as?: 'h1' | 'h2';
};

export function RevealHeadline({
  lines,
  className = '',
  accentLineIndex,
  as = 'h2',
}: RevealHeadlineProps) {
  const reduce = useReducedMotion();
  const Tag = as;

  if (reduce) {
    return (
      <Tag className={className}>
        {lines.map((line, i) => (
          <span key={line} className={`block ${accentLineIndex === i ? 'text-[#8A4A24]' : ''}`}>
            {line}
          </span>
        ))}
      </Tag>
    );
  }

  return (
    <Tag className={className}>
      {lines.map((line, lineIndex) => (
        <span key={line} className="block overflow-hidden pb-[0.08em]">
          <motion.span
            className={`inline-block ${accentLineIndex === lineIndex ? 'text-[#8A4A24]' : ''}`}
            initial={{
              y: '110%',
              opacity: 0,
              filter: 'blur(8px)',
              clipPath: 'inset(0 100% 0 0)',
            }}
            whileInView={{
              y: '0%',
              opacity: 1,
              filter: 'blur(0px)',
              clipPath: 'inset(0 0% 0 0)',
            }}
            viewport={{ once: true, amount: 0.7 }}
            transition={{
              duration: 0.95,
              delay: 0.12 + lineIndex * 0.16,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {line.split(' ').map((word, wi) => (
              <motion.span
                key={`${word}-${wi}`}
                className="mr-[0.28em] inline-block last:mr-0"
                initial={{ y: 18, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{
                  delay: 0.18 + lineIndex * 0.16 + wi * 0.05,
                  duration: 0.55,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {word}
              </motion.span>
            ))}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
