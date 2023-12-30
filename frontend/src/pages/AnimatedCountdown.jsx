import React, { useState, useEffect } from "react";

const countdown = (insertedDate, dueDate) => {
    if (dueDate === "permanent") {
      return {
        expired: false,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        countdownValue: 0,     
       };
    }
  
    const dueDateTime = new Date(dueDate);
    const currentTime = new Date();
    const timeRemaining = dueDateTime - currentTime;
  
    if (timeRemaining > 0) {
      const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
      const countdownValue = Math.floor(timeRemaining / 1000);

      return {
        expired: false,
        days,
        hours,
        minutes,
        seconds,
        countdownValue,
      };
    } else {
      return {
        expired: true,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        countdownValue: 0,
      };
    }
  };
  
function AnimatedCountdown({ insertedDate, dueDate }) {
  const [countdownData, setCountdownData] = useState(countdown(insertedDate, dueDate));

  useEffect(() => {
    const timer = setInterval(() => {
      if (countdownData.expired) {
        clearInterval(timer);
      } else {
        setCountdownData(countdown(insertedDate, dueDate));
      }
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [insertedDate, dueDate, countdownData.expired]);

  
  return (

   <span className={countdownData.expired ? "expired-countdown" : "live-countdown" }style={{ fontSize: '5vw' }}>
      {countdownData.days} Day {countdownData.hours} Hour {countdownData.minutes} Min {countdownData.seconds} Sec Left
    </span>
   
 
  );
}

export default AnimatedCountdown;
