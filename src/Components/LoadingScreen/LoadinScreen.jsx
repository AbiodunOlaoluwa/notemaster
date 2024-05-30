import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const LoadingScreen = () => {
  const [loadingComplete, setLoadingComplete] = useState(false);

  useEffect(() => {
    window.addEventListener('load', () => {
      setLoadingComplete(true);
    });
  }, []);

  return (
    <motion.div
      className="loadingScreen"
      initial={{ opacity: 1 }}
      animate={{ opacity: loadingComplete ? 0 : 1 }}
      transition={{ duration: 0.5 }}
      style={{ display: loadingComplete ? 'none' : 'block' }}
    >
      <div className="loader">
        Loading...
      </div>
    </motion.div>
  );
};

export default LoadingScreen;
