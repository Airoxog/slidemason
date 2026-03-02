import { motion } from 'framer-motion';

const fade = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
};

const slides = [
  <div key="welcome" className="flex flex-1 flex-col items-center justify-center text-center" style={{ padding: 'clamp(2rem, 5cqi, 5rem)' }}>
    <motion.h1
      {...fade}
      className="font-extrabold"
      style={{
        fontSize: 'clamp(3rem, 8cqi, 6rem)',
        fontFamily: 'var(--sm-heading-font, inherit)',
        background: 'linear-gradient(135deg, var(--sm-primary), var(--sm-secondary))',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        lineHeight: 1.1,
      }}
    >
      Slidemason
    </motion.h1>
    <motion.p
      {...fade}
      transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      style={{ fontSize: 'clamp(1rem, 2.5cqi, 1.5rem)', fontFamily: 'var(--sm-body-font, inherit)', color: 'var(--sm-muted)', marginTop: 'clamp(0.5rem, 2cqb, 1.5rem)' }}
    >
      Select a deck from the gallery to get started
    </motion.p>
  </div>,
];

export default slides;
