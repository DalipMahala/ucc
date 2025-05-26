"use client";
import { useEffect, useState } from "react";
import { getTimeLeft } from "@/utils/timerUtils";

const CountdownTimer = ({ targetTime }: { targetTime: string }) => {
  //   const [timeLeft, setTimeLeft] = useState(getTimeLeft(targetTime));
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number; isFinished: boolean } | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      const updatedTimeLeft = getTimeLeft(targetTime);
      setTimeLeft(updatedTimeLeft);

      if (updatedTimeLeft.isFinished) {
        const hasRefreshed = sessionStorage.getItem("hasRefreshed");

        if (!hasRefreshed) {
          sessionStorage.setItem("hasRefreshed", "true");
          clearInterval(timer);
          // window.location.reload();
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetTime]);

  // Reset "hasRefreshed" only when the countdown restarts
  useEffect(() => {
    const updatedTimeLeft = getTimeLeft(targetTime);

    if (!updatedTimeLeft.isFinished) {
      sessionStorage.removeItem("hasRefreshed"); // Remove only if new countdown starts
    }
  }, [targetTime]); // Runs only when the target time changes

  if (!timeLeft) return null;

  return (
    <div className="text-[16px] text-[#144280] font-semibold">
      {timeLeft.isFinished ? (
        "Time's up!"
      ) : (
        <div className="flex gap-1 items-start justify-center">
          <p className="flex flex-col">
            {timeLeft.hours}
            <span className="text-[11px] font-normal">Hrs</span>
          </p>
:
          <p className="flex flex-col">
            {timeLeft.minutes}
            <span className="text-[11px] font-normal">Min</span>
          </p>
:
          <p className="flex flex-col">
           {timeLeft.seconds}
            <span className="text-[11px] font-normal">Sec</span>
          </p>
          
        </div>
      )}
    </div>
  );
};

export default CountdownTimer;
