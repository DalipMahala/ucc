"use client";
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // Better for active tab detection

export default function TabMenu({ urlString, isPointTable, status }: { urlString: string; isPointTable: boolean; status:boolean }) {
  const tabsRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState('overview');

  // Track active tab based on route
  useEffect(() => {
    if (pathname?.endsWith('/squads')) setActiveTab('squads');
    else if (pathname?.includes('/schedule-results')) setActiveTab('schedule');
    else if (pathname?.includes('/points-table')) setActiveTab('points');
    else if (pathname?.includes('/news')) setActiveTab('news');
    else if (pathname?.includes('/stats')) setActiveTab('stats');
    else setActiveTab('overview');

    // Scroll to active tab
    setTimeout(() => {
      tabsRef.current?.querySelector('.active-tab')?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }, 100);
  }, [pathname]);

  return (
    <div id="tabs" className="mt-4 mb-4">
      <div 
        ref={tabsRef}
        className="flex text-1xl space-x-8 p-2 bg-[#ffffff] rounded-lg overflow-x-auto touch-auto scroll-smooth 
  [&::-webkit-scrollbar]:h-[4px] [&::-webkit-scrollbar-track]:bg-gray-100 
  md:[&::-webkit-scrollbar-thumb]:bg-[#DFE9F6] [&::-webkit-scrollbar-thumb]:bg-[#c2d7ef] 
  dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
      >
        <Link href={urlString}>
          <button className={`font-medium py-2 px-3 whitespace-nowrap rounded-md  ${activeTab === 'overview' ? 'bg-[#1A80F8] text-white active-tab' : ''}`}>
            Overview
          </button>
        </Link>
        
        <Link href={`${urlString}/schedule-results`}>
          <button className={`font-medium py-2 px-3 whitespace-nowrap rounded-md  ${activeTab === 'schedule' ? 'bg-[#1A80F8] text-white active-tab' : ''}`}>
            Schedule & Results
          </button>
        </Link>
        
        <Link href={`${urlString}/squads`}>
          <button className={`font-medium py-2 px-3 whitespace-nowrap rounded-md  ${activeTab === 'squads' ? 'bg-[#1A80F8] text-white active-tab' : ''}`}>
            Squads
          </button>
        </Link>
        
        {isPointTable && (
          <Link href={`${urlString}/points-table`}>
            <button className={`font-medium py-2 px-3 whitespace-nowrap rounded-md  ${activeTab === 'points' ? 'bg-[#1A80F8] text-white active-tab' : ''}`}>
              Points Table
            </button>
          </Link>
        )}
        
        <Link href={`${urlString}/news`}>
          <button className={`font-medium py-2 px-3 whitespace-nowrap rounded-md  ${activeTab === 'news' ? 'bg-[#1A80F8] text-white active-tab' : ''}`}>
            News
          </button>
        </Link>
        {status && (
        <Link href={`${urlString}/stats`}>
          <button className={`font-medium py-2 px-3 whitespace-nowrap rounded-md  ${activeTab === 'stats' ? 'bg-[#1A80F8] text-white active-tab' : ''}`}>
            Stats
          </button>
        </Link>
        )}
      </div>
    </div>
  );
}