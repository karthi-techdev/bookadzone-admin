import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import type { FC } from "react";

export interface LoaderProps {
  animate?: boolean;
  onComplete?: () => void;
  duration?: number;
}

const Loader: FC<LoaderProps> = ({ animate = true, onComplete, duration = 1500 }) => {
  const controls = useAnimation();

  const animation = animate
    ? {
        y: 0,
        opacity: 1,
        transition: { type: "spring", stiffness: 100, damping: 50 },
      }
    : { y: 0, opacity: 1 };

  useEffect(() => {
    let timer: NodeJS.Timeout | number | undefined;
    let completeTimer: NodeJS.Timeout | number | undefined;
    if (animate) {
      timer = setTimeout(() => {
        controls.start({
          opacity: 0,
          transition: { duration: 0.6, ease: "easeOut" },
        });
        completeTimer = setTimeout(() => {
          onComplete && onComplete();
        }, 600);
      }, duration);
    }
    return () => {
      if (timer) clearTimeout(timer);
      if (completeTimer) clearTimeout(completeTimer);
    };
  }, [animate, controls, onComplete, duration]);

  const AnimatedChar: FC<{ char: string; delay: number }> = ({ char, delay }) => (
    <motion.span
      initial={{ y: "100%", opacity: 0 }}
      animate={animation}
      transition={{ delay }}
    >
      {char}
    </motion.span>
  );

  const AnimatedText: FC<{ text: string; className?: string; startDelay?: number }> = ({ text, className = "", startDelay = 0 }) => (
    <div className={`flex ${className}`}>
      {text.split("").map((char, i) => (
        <AnimatedChar key={i} char={char} delay={startDelay + i * 0.05} />
      ))}
    </div>
  );

  return (
    <motion.div
      className="loader flex items-center justify-center absolute top-0 bottom-0 left-0 right-0 w-full backdrop-blur-md flex-col"
      initial={{ opacity: 1 }}
      animate={controls}
    >
      <div className="text-[var(--white-color)] text-5xl flex animated-logo">
        <AnimatedText text="book" />
        <AnimatedText
          text="adzone."
          className="text-[var(--puprle-color)]"
          startDelay={0.2}
        />
      </div>
      <div className="flex items-center justify-center text-[var(--white-color)] gap-3 text-[.70rem] mt-4">
        {["Advertise", "Simplify", "Grow"].map((word, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={
              animate
                ? { opacity: 1, y: 0, transition: { delay: 0.6 + i * 0.1 } }
                : { opacity: 1, y: 0 }
            }
          >
            {word}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
};

export default Loader;
