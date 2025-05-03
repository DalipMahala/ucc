"use client";
import React, { useEffect } from "react";

export default function TabButtons() {
  useEffect(() => {
    const elements = document.querySelectorAll("#all-tab, #live-tab, #completed-tab, #upcoming-tab");

    // Ensure elements exist before adding event listeners
    if (elements.length === 0) {
      console.error("Tabs not found in the DOM!");
      return;
    }

    function handleClick(event: Event) {
      const target = event.target as HTMLElement;
      console.log("Clicked ID:", target.id);
      
      // Remove active styles from all tabs
      document.querySelectorAll("#all-tab, #live-tab, #completed-tab, #upcoming-tab").forEach((el) => {
        el.classList.remove("md:bg-[#1A80F8]", "bg-[#081736]", "md:bottom-0", "border-b-[2px]", "border-[#ffffff]", "text-white");
      });

      // Add active style to clicked tab
      target.classList.add("md:bg-[#1A80F8]", "bg-[#081736]", "md:bottom-0", "border-b-[2px]", "border-[#ffffff]", "text-white");

      // Hide all sections initially
      document.querySelectorAll(".liveMatch, .completedMatch, .upcomingMatch, .foryouMatch").forEach((el) => {
        el.classList.add("hidden");
      });

      // Show only the relevant section
      const sectionMap: Record<string, string> = {
        "live-tab": ".liveMatch",
        "completed-tab": ".completedMatch",
        "upcoming-tab": ".upcomingMatch",
        // "all-tab": ".liveMatch, .completedMatch, .upcomingMatch",
        "all-tab" : ".foryouMatch",
      };

      if (sectionMap[target.id]) {
        document.querySelectorAll(sectionMap[target.id]).forEach((el) => el.classList.remove("hidden"));
      }
    }

    // Add event listeners
    elements.forEach((element) => element.addEventListener("click", handleClick));

    // Cleanup function to remove event listeners when component unmounts
    return () => {
      elements.forEach((element) => element.removeEventListener("click", handleClick));
    };
  }, []); // Run only once when component mounts

  return null; // No UI needed
}
