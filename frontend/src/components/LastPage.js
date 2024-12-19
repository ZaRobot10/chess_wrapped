import React, { useState, useEffect } from 'react';
import Confetti from 'confetti-react';
import './LastPage.css'; // Add styles if needed

const LastPage = () => {
  const [isConfetti, setIsConfetti] = useState(false);

  // Function to trigger confetti on click
  const triggerConfetti = () => {
    setIsConfetti(true);
    setTimeout(() => setIsConfetti(false), 5000); // Stop confetti after 5 seconds
  };

  // Trigger confetti automatically when component is mounted
  useEffect(() => {
    triggerConfetti();
  }, []);

  return (
    <div
    >
      {isConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={500}
        />
      )}
      
    


      <h1 style={{ fontSize: '3em' }}>Hope you had a Great Time this Year</h1>
      <h2 style={{ fontSize: '2em' }}>See you in 2025</h2>

      <img src='/crown.png' alt='crown' style={{width: '30%'}}></img>

      

      
    </div>
  );
};

export default LastPage;
