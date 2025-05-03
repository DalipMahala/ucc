// app/components/TabbedSection.tsx
"use client";

import React, { useState, useEffect } from 'react';

interface TabbedSectionProps {
  forYouMatches: React.ReactNode;
  liveMatches: React.ReactNode;
  upcomingMatches: React.ReactNode;
  completedMatches: React.ReactNode;
}

interface TabbedSectionProps {
  forYouMatches: React.ReactNode;
  liveMatches: React.ReactNode;
  upcomingMatches: React.ReactNode;
  completedMatches: React.ReactNode;
}

export default function TabbedSection({
  forYouMatches,
  liveMatches,
  upcomingMatches,
  completedMatches
}: TabbedSectionProps) {
  const [activeTab, setActiveTab] = useState("for-you");
  const [loadedTabs, setLoadedTabs] = useState<Record<string, boolean>>({
    "for-you": true,
    "live": false,
    "completed": false,
    "upcoming": false
  });

  useEffect(() => {
    // Mark the active tab as loaded when it becomes active
    if (!loadedTabs[activeTab]) {
      setLoadedTabs(prev => ({ ...prev, [activeTab]: true }));
    }
  }, [activeTab, loadedTabs]);


  return (
    <div className="tab-section">
      {/* Tab Buttons (same as before) */}
      <div className="tabs ml-[-8px] w-[104.2%] md:ml-[0] md:w-auto mb-3 md:my-4">
        <div className="flex justify-between md:justify-start text-[13px] md:space-x-8 space-x-4 md:p-2 pt-[2px] pb-2 px-2 md:bg-[#ffffff] md:text-[#000000] text-[#ffffff] bg-[#081736] md:rounded-lg overflow-auto relative overflow-x-auto">
          
          
          <button
            onClick={() => setActiveTab("live")}
            className={`font-semibold py-2 md:px-5 px-4 whitespace-nowrap uppercase ${
              activeTab === "live"
                ? "md:bg-[#1A80F8] bg-[#081736] md:bottom-0 border-b-[2px] border-[#ffffff] text-white"
                : ""
            } md:rounded-md`}
          >
            Live
          </button>

          <button
            onClick={() => setActiveTab("for-you")}
            className={`font-semibold py-2 md:px-5 px-4 whitespace-nowrap uppercase ${
              activeTab === "for-you"
                ? "md:bg-[#1A80F8] bg-[#081736] md:bottom-0 border-b-[2px] border-[#ffffff] text-white"
                : ""
            } md:rounded-md`}
          >
            For You
          </button>

          <button
            onClick={() => setActiveTab("completed")}
            className={`font-semibold py-2 md:px-5 px-4 whitespace-nowrap uppercase ${
              activeTab === "completed"
                ? "md:bg-[#1A80F8] bg-[#081736] md:bottom-0 border-b-[2px] border-[#ffffff] text-white"
                : ""
            } md:rounded-md`}
          >
            Finished
          </button>

          <button
            onClick={() => setActiveTab("upcoming")}
            className={`font-semibold py-2 md:px-5 px-4 whitespace-nowrap uppercase ${
              activeTab === "upcoming"
                ? "md:bg-[#1A80F8] bg-[#081736] md:bottom-0 border-b-[2px] border-[#ffffff] text-white"
                : ""
            } md:rounded-md`}
          >
            Scheduled
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="tab-content-container">
      {loadedTabs["for-you"] && activeTab === "for-you" && forYouMatches}
        {loadedTabs["live"] && activeTab === "live" && liveMatches}
        {loadedTabs["completed"] && activeTab === "completed" && completedMatches}
        {loadedTabs["upcoming"] && activeTab === "upcoming" && upcomingMatches}
      </div>
    </div>
  );
}