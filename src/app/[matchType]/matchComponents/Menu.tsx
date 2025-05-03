"use client";
import { useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { urlStringEncode } from "@/utils/utility";

export default function MatchTabs({
  matchUrl,
  match_id,
  matchDetails,
  isPointTable
}: {
  matchUrl: string | null;
  match_id: number;
  matchDetails: any;
  isPointTable: boolean;
}) {
  const tabsRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Determine active tab
  const activeTab = pathname?.split('/')[1] || 'moreinfo';

  // Scroll to active tab on load
  useEffect(() => {
    setTimeout(() => {
      const activeTabElement = tabsRef.current?.querySelector('.active-tab');
      activeTabElement?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }, 100);
  }, [activeTab]);

  return (
    <div id="tabs" className="my-4">
      <div 
        ref={tabsRef}
        className="flex text-[13px] space-x-8 p-2 bg-[#ffffff] rounded-lg overflow-x-auto scrollbar-hide"
      >
        <Link href={`/moreinfo/${matchUrl}/${match_id}`}>
          <button className={`uppercase font-semibold py-2 px-3 whitespace-nowrap rounded-md ${
            activeTab === 'moreinfo' ? 'bg-[#1A80F8] text-white active-tab' : ''
          }`}>
            More Info
          </button>
        </Link>

        <Link href={`/live-score/${matchUrl}/${match_id}`}>
          <button className={`uppercase font-semibold py-2 px-3 whitespace-nowrap rounded-md ${
            activeTab === 'live-score' ? 'bg-[#1A80F8] text-white active-tab' : ''
          }`}>
            Live
          </button>
        </Link>

        <Link href={`/scorecard/${matchUrl}/${match_id}`}>
          <button className={`uppercase font-semibold py-2 px-3 whitespace-nowrap rounded-md ${
            activeTab === 'scorecard' ? 'bg-[#1A80F8] text-white active-tab' : ''
          }`}>
            Scorecard
          </button>
        </Link>

        <Link href={`/squad/${matchUrl}/${match_id}`}>
          <button className={`uppercase font-semibold py-2 px-3 whitespace-nowrap rounded-md ${
            activeTab === 'squad' ? 'bg-[#1A80F8] text-white active-tab' : ''
          }`}>
            Squad
          </button>
        </Link>

        {isPointTable && (
          <Link
            href={`/series/${urlStringEncode(
              `${matchDetails?.competition?.title}-${matchDetails?.competition?.season}`
            )}/${matchDetails?.competition?.cid}/points-table`}
          >
            <button className={`uppercase font-semibold py-2 px-3 whitespace-nowrap rounded-md ${
              activeTab === 'points-table' ? 'bg-[#1A80F8] text-white active-tab' : ''
            }`}>
              Points Table
            </button>
          </Link>
        )}

        <Link
          href={`/series/${urlStringEncode(
            `${matchDetails?.competition?.title}-${matchDetails?.competition?.season}`
          )}/${matchDetails?.competition?.cid}/stats/batting-most-run`}
        >
          <button className={`uppercase font-semibold py-2 px-3 whitespace-nowrap rounded-md ${
            activeTab === 'stats' ? 'bg-[#1A80F8] text-white active-tab' : ''
          }`}>
            Stats
          </button>
        </Link>
      </div>
    </div>
  );
}