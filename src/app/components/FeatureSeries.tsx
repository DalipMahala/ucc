"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { urlStringEncode } from "../../utils/utility";
import FeatureNews from "@/app/components/FeatureNews";
import { format, isSameDay } from "date-fns";
import CountdownTimer from "./countdownTimer";

interface MatchData {
  status: number;
  status_str: string;
  competition: {
    title: string;
    season: string;
    cid: string;
  };
  teama: {
    name: string;
    short_name: string;
    thumb_url: string;
  };
  teamb: {
    name: string;
    short_name: string;
    thumb_url: string;
  };
  subtitle: string;
  venue: {
    name: string;
    location: string;
    country: string;
  };
  date_start_ist: string;
  match_id: number;
  format_str: string;
  short_title?: string;
}

interface SeriesItem {
  cid: string;
  title: string;
  season: string;
  total_teams: number;
  newUrl?: string;
}

interface FeatureSeriesProps {
  featuredSeries: SeriesItem[];
}

export default function FeatureSeries({ featuredSeries }: FeatureSeriesProps) {
  const [matches, setMatches] = useState<Record<string, MatchData | null>>({});
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch matches data
  useEffect(() => {
    if (!featuredSeries?.length) {
      setLoading(false);
      return;
    }

    const fetchMatches = async () => {
      setLoading(true);
      try {
        const matchPromises = featuredSeries.map(async (series) => {
          try {
            const response = await fetch('/api/series/SeriesPointsTableMatches', {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_TOKEN}`,
              },
              body: JSON.stringify({ cid: series.cid }),
            });

            if (!response.ok) {
              console.error(`Error: API returned ${response.status} for CID ${series.cid}`);
              return { [series.cid]: null };
            }

            const result = await response.json();
            const items = result?.data?.items || [];

            // Find first active (1) or completed (3) match
            const filteredItem = items.find((item: MatchData) =>
              item.status === 1 || item.status === 3
            );

            return { [series.cid]: filteredItem || null };
          } catch (error) {
            console.error(`Error fetching match for CID ${series.cid}:`, error);
            return { [series.cid]: null };
          }
        });

        const matchesData = await Promise.all(matchPromises);
        setMatches(Object.assign({}, ...matchesData));
      } catch (error) {
        console.error("Error in fetchMatches:", error);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchMatches, 300);
    return () => clearTimeout(debounceTimer);
  }, [featuredSeries]);

  // Memoize processed series data
  const processedSeries = useMemo(() => {
    return featuredSeries.map(series => ({
      ...series,
      match: matches[series.cid] || null
    }));
  }, [featuredSeries, matches]);

  // Render loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      {processedSeries.map((series, index) => (
        <SeriesSection key={`${series.cid}-${index}`} series={series} match={series.match} />
      ))}
    </>
  );
}

interface SeriesSectionProps {
  series: SeriesItem;
  match: MatchData | null;
}

const SeriesSection = ({ series, match }: SeriesSectionProps) => (
  <React.Fragment>
   
      <div className="flex items-center space-x-4 w-full py-4">
        <div className="flex-grow h-0.5 bg-gray-300"></div>
        <h1 className="md:text-[24px] text-[18px] text-black font-bold whitespace-nowrap uppercase">
          {series.title} {series.season}
        </h1>
        <div className="flex-grow h-0.5 bg-gray-300"></div>
      </div>
    

    <div className="lg:grid grid-cols-12 gap-4">
      <div className="col-span-2"></div>

      <div className="col-span-8">
        <SeriesNavigation series={series} totalTeams={series.total_teams} />
        {match && (
          <>
            <DesktopMatchView match={match} series={series} />
            <MobileMatchView match={match} series={series} />
          </>
        )}
        {series.newUrl && <FeatureNews newsUrl={series.newUrl} />}
      </div>

      <div className="col-span-2"></div>
    </div>
  </React.Fragment>
);

interface SeriesNavigationProps {
  series: SeriesItem;
  totalTeams: number;
}

const SeriesNavigation = ({ series, totalTeams }: SeriesNavigationProps) => (
  
    <div className="flex text-1xl md:space-x-8 space-x-4 p-2 bg-[#ffffff] rounded-lg overflow-auto relative overflow-x-auto [&::-webkit-scrollbar]:h-[5px] [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-[#DFE9F6] mb-4">
      <button className="font-medium py-2 md:px-5 px-2 bg-[#1A80F8] text-white rounded-md whitespace-nowrap">
       Fixtures
      </button>

      {totalTeams > 2 && (
        <Link href={`/series/${urlStringEncode(`${series.title}-${series.season}`)}/${series.cid}/points-table`}>
          <button className="font-medium py-2 px-3 whitespace-nowrap">
            Points Table
          </button>
        </Link>
      )}

      <Link href={`/series/${urlStringEncode(`${series.title}-${series.season}`)}/${series.cid}/stats`}>
        <button className="font-medium py-2 px-3 whitespace-nowrap">
          Stats
        </button>
      </Link>

      <Link href={`/series/${urlStringEncode(`${series.title}-${series.season}`)}/${series.cid}/squads`}>
        <button className="font-medium py-2 px-3 whitespace-nowrap">
          Squads
        </button>
      </Link>
    </div>
  
);

interface MatchViewProps {
  match: MatchData;
  series: SeriesItem;
}

const DesktopMatchView = ({ match, series }: MatchViewProps) => (
  <div className="lg:block hidden rounded-lg p-4 mb-4 bg-[#ffffff] hover:shadow-lg">
    <MatchHeader match={match} />
    <div className="border-t-[1px] border-[#E7F2F4]"></div>
    <MatchContent match={match} />
    <div className="border-t-[1px] border-[#E7F2F4]"></div>
    <MatchFooter match={match} series={series} />
  </div>
);

const MobileMatchView = ({ match, series }: MatchViewProps) => (
  <div className="lg:hidden rounded-lg p-4 mb-4 bg-[#ffffff] performance-section relative">
    <MatchHeader match={match} isMobile />
    <div className="border-t-[1px] border-[#E7F2F4]"></div>
    <MatchContent match={match} isMobile />
    <div className="border-t-[1px] border-[#E7F2F4]"></div>
    <MatchFooter match={match} series={series} isMobile />
  </div>
);

interface MatchHeaderProps {
  match: MatchData;
  isMobile?: boolean;
}

const MatchHeader = ({ match, isMobile = false }: MatchHeaderProps) => {
  const statusColor = match.status === 3 ? "text-[#A70B0B]" : "text-[#A45B09]";

  return (
    <div className={`flex items-center justify-between ${isMobile ? 'mb-2' : 'mb-4'}`}>
      <div className="flex items-center space-x-2">
        <div className={`flex items-center ${statusColor} uppercase rounded-full font-semibold`} style={{ gap: "3px" }}>
          <span className="rounded-full">●</span> {match.status_str}
        </div>
        <div>
          {isMobile ? (
            <h2 className="text-[15px] font-semibold pl-[10px] border-l-[1px] border-[#E4E9F0]">
              {match.competition.title}
            </h2>
          ) : (
            <Link href={`/series/${urlStringEncode(`${match.competition.title}-${match.competition.season}`)}/${match.competition.cid}`}>
              <h2 className="text-[15px] font-semibold pl-[10px] border-l-[1px] border-[#E4E9F0]">
                {match.competition.title}
              </h2>
            </Link>
          )}
        </div>
        
      </div>
      {!isMobile && <TeamStatusIndicator teamA={match.teama.short_name} />}
    </div>
  );
};

const TeamStatusIndicator = ({ teamA }: { teamA: string }) => (
  <div className="flex items-center space-x-2">
    <span className="text-[#1F2937] text-[13px] font-medium">{teamA}</span>
    <StatusBadge type="up" value="0" />
    <StatusBadge type="down" value="0" />
  </div>
);

interface StatusBadgeProps {
  type: 'up' | 'down';
  value: string;
}

const StatusBadge = ({ type, value }: StatusBadgeProps) => {
  const bgColor = type === 'up' ? 'bg-[#FAFFFC]' : 'bg-[#FFF7F7]';
  const borderColor = type === 'up' ? 'border-[#0B773C]' : 'border-[#A70B0B]';
  const textColor = type === 'up' ? 'text-[#0B773C]' : 'text-[#A70B0B]';
  const iconPath = type === 'up'
    ? "M8.25 6.75 12 3m0 0 3.75 3.75M12 3v18"
    : "M15.75 17.25 12 21m0 0-3.75-3.75M12 21V3";

  return (
    <span className={`flex items-center ${bgColor} border-[1px] ${borderColor} rounded-full ${textColor} pr-2`}>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-[14px] w-[17px]">
        <path strokeLinecap="round" strokeLinejoin="round" d={iconPath} />
      </svg>
      {value}
    </span>
  );
};

interface MatchContentProps {
  match: MatchData;
  isMobile?: boolean;
}

const MatchContent = ({ match, isMobile = false }: MatchContentProps) => {
  const matchUrl = `/moreinfo/${urlStringEncode(
    `${match.teama.short_name}-vs-${match.teamb.short_name}-${match.subtitle}-${match.competition.title}-${match.competition.season}`
  )}/${match.match_id}`;

  return (
    <Link href={matchUrl}>
      <div className={`${isMobile ? 'py-2 pb-3' : 'py-4 px-3'}`}>
        <p className="text-[#586577] text-[12px] mb-4 font-medium">
          {match.subtitle}, {match.venue.name} {match.venue.location}, {match.venue.country}
        </p>
        <div className="flex justify-between items-center text-[14px]">
          <div className={isMobile ? "" : "w-[50%]"}>
            <TeamDisplay team={match.teama} isMobile={isMobile} />
            <TeamDisplay team={match.teamb} isMobile={isMobile} />
          </div>
          {/* <div className="h-[100px] border-l-[1px] border-[#E7F2F4]"></div> */}
          <MatchTime date={match.date_start_ist} isMobile={isMobile} />
        </div>
      </div>
    </Link>
  );
};

interface TeamDisplayProps {
  team: {
    name: string;
    thumb_url: string;
  };
  isMobile: boolean;
}

const TeamDisplay = ({ team, isMobile }: TeamDisplayProps) => (
  <div className={`flex items-center space-x-2 font-medium ${isMobile ? '' : 'w-[162px] md:w-full'} mb-4`}>
    <Image
      src={team.thumb_url}
      className="h-[30px] rounded-full"
      width={30}
      height={30}
      alt={team.name}
      loading="lazy"
    />
    <span className={`text-[${isMobile ? '#5e5e5e' : '#1F2937'}] md:font-semibold font-medium text-[14px]`}>
      {team.name}
    </span>
  </div>
);

interface MatchTimeProps {
  date: string;
  isMobile: boolean;
}

const MatchTime = ({ date, isMobile }: MatchTimeProps) => {
  const isToday = isSameDay(new Date(), new Date(date));

  return (
    <div className={`font-medium text-center  ${isMobile ? '' : 'w-[50%] flex justify-end'}`}>
      
        {isToday ? (
          <>
            <span className="text-[13px] font-normal text-[#a45b09]">Start in</span>
            <CountdownTimer targetTime={date} />
          </>
        ) : (
          <p className={`text-[#2F335C] ${isMobile ? 'font-medium mt-1 text-[13px]' : 'text-[14px]'}`}>
            {format(new Date(date), "dd MMMM - EEEE")}, <br />
            {format(new Date(date), "hh:mm:aa")}
          </p>
        )}
     
    </div>
  );
};

interface MatchFooterProps {
  match: MatchData;
  series: SeriesItem;
  isMobile?: boolean;
}

const MatchFooter = ({ match, series, isMobile = false }: MatchFooterProps) => {
  const showH2H = ['T20I', 'T20', 'Test', 'Odi'].includes(match.format_str);
  const h2hUrl = `/h2h/${urlStringEncode(
    match.competition.title === 'Indian Premier League'
      ? match.short_title || match.competition.title
      : match.competition.title
  )}-head-to-head-in-${match.format_str}`.toLowerCase();

  return (
    <div className="flex items-center justify-between space-x-5 mt-3">
      <div className="flex items-center">
        {series.total_teams > 2 && (
          <>
            <Link href={`/series/${urlStringEncode(`${series.title}-${series.season}`)}/${series.cid}/points-table`}>
              <p className={`${isMobile ? 'text-[#757A82] md:text-[13px] text-[11px] ' : 'text-[#757A82]'} font-medium`}>
                Points Table
              </p>
            </Link>
            <div className="h-[20px] border-l-[1px] md:mx-5 mx-3 border-[#d0d3d7]"></div>
          </>
        )}
        <Link href={`/series/${urlStringEncode(`${series.title}-${series.season}`)}/${series.cid}/schedule-results/schedule`}>
          <p className={`${isMobile ? 'text-[#757A82] md:text-[13px] text-[11px] ' : 'text-[#757A82]'} font-medium`}>
            Schedule
          </p>
        </Link>
      </div>
      {showH2H && (
        <Link href={h2hUrl}>
          <div className="flex justify-end items-center space-x-2">
            <div className="relative w-[25px] h-[25px]">
              <Image
                src="/assets/img/home/handshake.png"
                alt="Head to Head"
                fill
                className="object-contain"
                loading="lazy"
              />
            </div>

            <span className={`text-[#757A82] ${isMobile ? 'md:text-[13px] text-[11px]' : 'text-[#757A82]'} font-medium`}>
              H2H
            </span>
          </div>
        </Link>
      )}
      {isMobile && <TeamStatusIndicatorMobile teamA={match.teama.short_name} />}
    </div>
  );
};

const TeamStatusIndicatorMobile = ({ teamA }: { teamA: string }) => (
  <div className="flex items-center space-x-2 md:text-[13px] text-[11px]">
    <span className="text-[#757A82] font-medium">{teamA}</span>
    <StatusBadgeMobile type="up" value="0" />
    <StatusBadgeMobile type="down" value="0" />
  </div>
);

interface StatusBadgeMobileProps {
  type: 'up' | 'down';
  value: string;
}

const StatusBadgeMobile = ({ type, value }: StatusBadgeMobileProps) => {
  const bgColor = type === 'up' ? 'bg-[#ffffff]' : 'bg-[#ffffff]';
  const borderColor = type === 'up' ? 'border-[#00a632]' : 'border-[#ea2323]';
  const Color = type === 'up' ? 'text-[#0B773C]' : 'text-[#ea2323]';
  const iconPath = type === 'up'
    ? "M8.25 6.75 12 3m0 0 3.75 3.75M12 3v18"
    : "M15.75 17.25 12 21m0 0-3.75-3.75M12 21V3";

  return (
    <span className={`flex items-center ${bgColor} border-[1px] ${borderColor} rounded-md ${Color} pr-2`}>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-[14px] w-[17px]">
        <path strokeLinecap="round" strokeLinejoin="round" d={iconPath} />
      </svg>
      {value}
    </span>
  );
};