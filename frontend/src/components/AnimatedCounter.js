import React, { useState, useEffect } from 'react';

const AnimatedCounter = ({ targetValue,style, duration1}) => {
  const [currentValue, setCurrentValue] = useState(0);


  useEffect(() => {
    if (targetValue === undefined) return; // Wait until the targetValue is available



    var duration = 2000; // Duration of animation in ms (2 seconds)

    if (duration1) {
      duration = duration1;
    }
    const start = 0;
    const end = targetValue;
    const stepTime = Math.abs(Math.floor(duration / (end - start))); // Calculate step time

    const increment = () => {
      let counter = start;
      const timer = setInterval(() => {
        counter += 1;
        setCurrentValue(counter);
        if (counter === end) {
          clearInterval(timer);
        }
      }, stepTime);
    };

    increment();
  }, [targetValue]); // Trigger animation when targetValue changes

  return <span style={{ ...style }}>{currentValue}</span>;
};

export default AnimatedCounter;
