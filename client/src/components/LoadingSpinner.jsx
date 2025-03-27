import React from "react";
import { motion } from "framer-motion";

const LoadingSpinner = ({ size = "md", color = "blue" }) => {
  // Size variants
  const sizeVariants = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  // Color variants
  const colorVariants = {
    blue: "border-blue-500",
    purple: "border-purple-500",
    green: "border-green-500",
    gray: "border-gray-500",
    white: "border-white",
  };

  // Animation variants for spinner rotation
  const spinTransition = {
    repeat: Infinity,
    ease: "linear",
    duration: 0.8,
  };

  // Animation variants for the pulsing effect
  const pulseVariants = {
    initial: { opacity: 0.6, scale: 0.8 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        repeat: Infinity,
        repeatType: "reverse",
      },
    },
  };

  return (
    <div className="flex items-center justify-center">
      <motion.div
        initial={pulseVariants.initial}
        animate={pulseVariants.animate}
        className="flex items-center justify-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={spinTransition}
          className={`${sizeVariants[size] || sizeVariants.md} 
                    border-4 
                    ${colorVariants[color] || colorVariants.blue} 
                    border-t-transparent 
                    rounded-full`}
        />
      </motion.div>
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default LoadingSpinner;
