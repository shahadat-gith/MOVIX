import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { HiOutlineSparkles } from "react-icons/hi";

const backgroundImages = [
  "https://image.tmdb.org/t/p/original/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg",
  "https://image.tmdb.org/t/p/original/vL5LR6WdxWPjLPFRLe133jXWsh5.jpg",
  "https://image.tmdb.org/t/p/original/nnXFiPLy3GxRVaQnP3MZQxHVIW3.jpg",
];

const Hero = () => {
  const navigate = useNavigate();
  const [currentBg, setCurrentBg] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % backgroundImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-[50vh] md:min-h-screen flex items-center justify-center overflow-hidden py-16 md:py-0">
      {/* Background Images */}
      {backgroundImages.map((img, index) => (
        <div
          key={img}
          className="absolute inset-0 transition-opacity duration-1000"
          style={{
            backgroundImage: `url(${img})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: index === currentBg ? 1 : 0,
          }}
        />
      ))}

      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-secondary/10" />


      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary-light text-sm mb-6 md:mb-8"
          >
            <HiOutlineSparkles className="w-4 h-4" /> AI Powered Movie Discovery
          </motion.div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight text-white">
            Discover Movies <br />
            <span className="bg-gradient-to-r from-primary-light via-secondary-light to-accent bg-clip-text text-transparent">
              Through AI
            </span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-3xl mx-auto mt-6 md:mt-8 text-base sm:text-xl text-text-muted leading-relaxed">
            Stop scrolling endlessly. <br />
            Describe a mood, story, genre, actor, or feeling and let AI find the
            perfect movie for you.
          </p>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 hidden sm:block"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-text-muted/30 rounded-full flex justify-center pt-2"
        >
          <div className="w-1 h-2 bg-text-muted/50 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
