"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import WeeklySlider from "@/app/components/WeeklySlider";
import NewsSection from "./NewsSection";
import PLSeries from "@/app/components/popularSeries";
import FantasyTips from "@/app/components/FantasyTips";

interface TeamData {
  title?: string;
  abbr?: string;
  logo_url?: string;
  [key: string]: any;
}

interface MatchData {
  teama?: string;
  teamb?: string;
  date_start_ist?: string;
  result?: string;
  subtitle?: string;
}

interface H2hProps {
  featuredMatch: any | null;
  teamDetails: any | null;
  teamADetails: TeamData | null;
  teamBDetails: TeamData | null;
  urlStrings: string | null;
  completedMatch: MatchData[] | [];
}

export default function H2h({
  featuredMatch,
  teamDetails,
  teamADetails,
  teamBDetails,
  urlStrings,
  completedMatch
}: H2hProps) {
  const [show, setShow] = useState(false);
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Safe calculations with fallbacks
  const totalMatches = teamDetails?.teamAB_total_match || 0;
  const teamaWon = totalMatches > 0 ? 
    Math.round((teamDetails?.teama_won_match || 0) * totalMatches / 100) : 0;
  const teambWon = totalMatches > 0 ? 
    Math.round((teamDetails?.teamb_won_match || 0) * totalMatches / 100) : 0;
 
  // Safe URL parsing
  const matchType = urlStrings?.split('-').pop() || 'test';
  const urlWithoutMatchType = urlStrings?.split('-').slice(0, -1).join('-') || '';

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const res = await fetch("https://uccricket.live/wp-json/wp/v2/posts?_embed&&categories=21");
        if (!res.ok) throw new Error('Failed to fetch news');
        const data = await res.json();
        setNews(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching news:", err);
        setError("Failed to load news");
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  const parseMatchData = (match: MatchData) => {
    try {
      const parseIfString = (data: any) => {
        if (typeof data === 'string') {
          try {
            return JSON.parse(data);
          } catch {
            return data; // Return raw string if parsing fails
          }
        }
        return data; // Return as-is if not a string
      };
  
      return {
        teamA: match?.teama ? parseIfString(match.teama) : null,
        teamB: match?.teamb ? parseIfString(match.teamb) : null,
        date: match?.date_start_ist,
        result: match?.result,
        subtitle: match?.subtitle
      };
    } catch (e) {
      console.error("Error parsing match data:", e);
      return null;
    }
  };

  const renderMatchCard = (match: MatchData, index: number) => {
    const parsedMatch = parseMatchData(match);
    if (!parsedMatch) return null;

    return (
      <div className="md:col-span-6 col-span-12 cust-tp-pera-card" key={index}>
        <div className="bg-[#f2f7ff] rounded-lg max-w-md w-full p-4 border-[1px]">
          <div className="flex justify-between items-center pb-1">
            <h2 className="text-1xl font-semibold">{parsedMatch.subtitle || 'Match'}</h2>
            {parsedMatch.date && (
              <p className="text-[#7B4C09] font-medium">
                {format(new Date(parsedMatch.date), "dd MMMM yyyy")}
              </p>
            )}
          </div>
          <div className="border-t-[1px] border-[#E4E9F0]" />
          <div className="flex items-center justify-between py-3">
            <div className="flex space-x-2">
              <div className="flex items-center space-x-1 flex-col">
                {parsedMatch.teamA?.logo_url && (
                  <Image
                    src={parsedMatch.teamA.logo_url}
                    className="h-[30px] rounded-full"
                    width={30}
                    height={30}
                    alt={parsedMatch.teamA.short_name || "Team A"}
                  />
                )}
                <span className="text-[#909090]">{parsedMatch.teamA?.short_name || 'Team A'}</span>
              </div>
              <div className="mt-1">
                <p className="text-1xl font-semibold">{parsedMatch.teamA?.scores || '0'}</p>
              </div>
            </div>
            <div className="text-gray-500 text-2xl font-semibold">↔</div>
            <div className="flex space-x-2 justify-end">
              <div className="mt-1 text-end">
                <p className="text-1xl font-semibold">{parsedMatch.teamB?.scores || '0'}</p>
              </div>
              <div className="flex items-center space-x-1 flex-col font-medium">
                {parsedMatch.teamB?.logo_url && (
                  <Image
                    src={parsedMatch.teamB.logo_url}
                    className="h-[30px] rounded-full"
                    width={30}
                    height={30}
                    alt={parsedMatch.teamB.short_name || "Team B"}
                  />
                )}
                <span className="text-[#909090]">{parsedMatch.teamB?.short_name || 'Team B'}</span>
              </div>
            </div>
          </div>
          <div className="border-t-[1px] border-[#E4E9F0]" />
          <div className="text-center mt-3">
            <p className="text-green-600 font-semibold">
              {parsedMatch.result || 'Match result not available'}
            </p>
          </div>
        </div>
      </div>
    );
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-center p-4">
          <h2 className="text-2xl font-bold mb-2">Error Loading Data</h2>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (loading || !teamADetails || !teamBDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading match data...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <section className="bg-[#0E2149] border-[1px] border-[#E4E9F01A] lg:px-0 px-3">
        <div className="border-t-[1px] border-[#E4E9F01A]">
          <div className="lg:w-[1000px] mx-auto md:py-8 tracking-[1px]">
            <div className="flex py-8 justify-between items-center">
              <div className="flex flex-col md:flex-row text-[#FF912C] font-bold uppercase md:items-center items-start">
                {teamADetails.logo_url && (
                  <Image
                    className="md:h-[42px] md:w-[42px] h-[30px] w-[30px]"
                    src={teamADetails.logo_url}
                    width={42}
                    height={42}
                    alt={teamADetails.abbr || "Team A"}
                  />
                )}
                <p className="text-[#BDCCECA8] md:mx-3 mx-0 md:text-[19px] text-[14px] font-semibold uppercase">
                  {teamADetails.abbr || 'Team A'}
                </p>
              </div>
              <div className="text-[#8192B4] font-normal text-center">
                <p className="text-[#FFBD71] md:text-[20px] text-[16px] font-semibold">
                  {teamADetails.abbr || 'Team A'} vs {teamBDetails.abbr || 'Team B'} Head to Head in {matchType.toUpperCase()}
                </p>
              </div>
              <div className="flex flex-col md:flex-row md:items-center items-end text-[#8192B4] font-normal justify-end">
                <p className="text-[#BDCCECA8] md:block hidden md:text-[19px] text-[14px] md:mx-3 mx-0 font-semibold uppercase">
                  {teamBDetails.abbr || 'Team B'}
                </p>
                {teamBDetails.logo_url && (
                  <Image
                    src={teamBDetails.logo_url}
                    className="md:h-[42px] md:w-[42px] h-[30px] w-[30px]"
                    width={42}
                    height={42}
                    alt={teamBDetails.abbr || "Team B"}
                  />
                )}
                <p className="text-[#BDCCECA8] md:hidden md:text-[19px] text-[14px] md:mx-3 mx-0 font-semibold uppercase">
                  {teamBDetails.abbr || 'Team B'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="lg:w-[1000px] mx-auto md:mb-0 mb-4 px-2 lg:px-0">
        <div id="tabs" className="my-4">
          <div className="flex text-1xl space-x-8 p-2 bg-[#ffffff] rounded-lg overflow-auto">
            <Link href={`${urlWithoutMatchType}-test`}>
              <button
                className={`font-medium py-2 px-5 whitespace-nowrap ${matchType === "test" ? "bg-[#1A80F8] text-white" : ""} rounded-md`}
              >
                Test
              </button>
            </Link>
            <Link href={`${urlWithoutMatchType}-odi`}>
              <button
                className={`font-medium py-2 px-5 whitespace-nowrap ${matchType === "odi" ? "bg-[#1A80F8] text-white" : ""} rounded-md`}
              >
                ODI
              </button>
            </Link>
            <Link href={`${urlWithoutMatchType}-t20`}>
              <button
                className={`font-medium py-2 px-5 whitespace-nowrap ${matchType === "t20" ? "bg-[#1A80F8] text-white" : ""} rounded-md`}
              >
                T20
              </button>
            </Link>
            <Link href={`${urlWithoutMatchType}-t20s`}>
              <button
                className={`font-medium py-2 px-5 whitespace-nowrap ${matchType === "t20wc" ? "bg-[#1A80F8] text-white" : ""} rounded-md`}
              >
                T20 WC
              </button>
            </Link>
          </div>
        </div>

        <div id="tab-content">
          <div className="tab-content">
            <div className="md:grid grid-cols-12 gap-4">
              <div className="lg:col-span-8 md:col-span-7">
                {teamDetails?.teamAB_total_match > 0 && (
                  <div className="rounded-lg bg-[#ffffff] p-4">
                    <h3 className="text-[15px] font-semibold pl-[7px] border-l-[3px] mb-3 border-[#229ED3]">
                      {teamADetails.title} vs {teamBDetails.title} Head to Head in {matchType.charAt(0).toUpperCase() + matchType.slice(1)} Records
                    </h3>
                    <div className="border-t-[1px] border-[#E4E9F0]" />
                    
                    <div className="mt-4">
                      <div className="mb-6">
                        <p className="text-gray-700">
                          {teamADetails.title} and {teamBDetails.title} have faced each other in {totalMatches} matches in {matchType.toUpperCase()}. 
                          Out of these {totalMatches} games, {teamADetails.title} have won {teamDetails.teama_won_match} whereas {teamBDetails.title} have won {teamDetails.teamb_won_match}.
                          {teamDetails.teama_nr_match > 0 ? ` ${teamDetails.teama_nr_match} matches ended without a result.` : ''}
                        </p>
                      </div>

                      <div className="flex flex-col gap-2 md:gap-0 sm:flex-row justify-between items-center mb-4">
                        <div className="w-full relative">
                          <div className="border border-gray-300 rounded-md p-2 text-gray-700 md:w-[70%] w-full cursor-pointer">
                            <span className="flex items-center">
                              {teamADetails.logo_url && (
                                <Image
                                  src={teamADetails.logo_url}
                                  width={30}
                                  height={30}
                                  alt="teams"
                                  className="h-[16px] mr-2"
                                />
                              )}
                              {teamADetails.title}
                            </span>
                          </div>
                        </div>
                        <div className="text-center font-bold md:text-1xl">VS</div>
                        <div className="w-full text-right">
                          <div className="relative flex justify-end">
                            <div className="border border-gray-300 rounded-md p-2 text-gray-700 md:w-[70%] w-full cursor-pointer">
                              <span className="flex items-center">
                                {teamBDetails.logo_url && (
                                  <Image
                                    src={teamBDetails.logo_url}
                                    width={30}
                                    height={30}
                                    alt="teams"
                                    className="h-[16px] mr-2"
                                  />
                                )}
                                {teamBDetails.title}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-center text-center">
                        <div className="border-[1px] border-[#E4E9F0] p-2 rounded-md font-semibold text-1xl">
                          <p>{totalMatches}</p>
                          <p>Matches</p>
                        </div>
                      </div>

                      {/* Stats sections */}
                      <div className="my-4">
                        <div className="flex justify-between items-center">
                          <div className="flex justify-between items-center w-full">
                            <div className="flex-1 mx-4 bg-gray-200 h-2">
                              <div
                                className="bg-[#13b76dbd] h-2"
                                style={{ width: `${teamaWon}%` }}
                              ></div>
                            </div>
                            <span>{teamDetails.teama_won_match}</span>
                          </div>
                          <div className="md:w-[50%] w-full text-center">
                            <span className="font-semibold">Won</span>
                          </div>
                          <div className="flex justify-between items-center w-full">
                            <span>{teamDetails.teamb_won_match}</span>
                            <div className="flex-1 mx-4 bg-gray-200 h-2">
                              <div
                                className="bg-[#13b76dbd] h-2"
                                style={{ width: `${teambWon}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="my-4">
                            <div className="flex justify-between items-center">
                                <div className="flex justify-between items-center w-full">
                                    <div className="flex-1 mx-4 bg-gray-200 h-2">
                                        <div
                                            className="bg-[#B7132B] h-2"
                                            style={{ width: teambWon+"%" }}
                                        ></div>
                                    </div>
                                    <span>{teamDetails?.teamb_won_match}</span>
                                </div>
                                <div className="md:w-[50%] w-full text-center">
                                    <span className="font-semibold">Lost</span>
                                </div>
                                <div className="flex justify-between items-center w-full">
                                    <span>{teamDetails?.teama_won_match}</span>
                                    <div className="flex-1 mx-4 bg-gray-200 h-2">
                                        <div
                                            className="bg-[#B7132B] h-2"
                                            style={{ width: teamaWon+"%" }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {(teamDetails?.nr_match >0 || teamDetails?.nr_match > 0) &&
                                      <div className="my-4">
                                          <div className="flex justify-between items-center">
                                              <div className="flex justify-between items-center w-full">
                                                  <div className="flex-1 mx-4 bg-gray-200 h-2">
                                                      <div
                                                          className="bg-[#13b76dbd] h-2"
                                                          style={{ width: "0%" }}
                                                      ></div>
                                                  </div>
                                                  <span>{teamDetails?.nr_match}</span>
                                              </div>
                                              <div className="md:w-[50%] w-full text-center">
                                                  <span className="font-semibold">No Result</span>
                                              </div>
                                              <div className="flex justify-between items-center w-full">
                                                  <span>{teamDetails?.nr_match}</span>
                                                  <div className="flex-1 mx-4 bg-gray-200 h-2">
                                                      <div
                                                          className="bg-[#13b76dbd] h-2"
                                                          style={{ width: "0%" }}
                                                      ></div>
                                                  </div>
                                              </div>
                                          </div>
                                      </div>
                                       }{(teamDetails?.tied_match >0 || teamDetails?.tied_match > 0) &&
                                      <div className="my-4">
                                          <div className="flex justify-between items-center">
                                              <div className="flex justify-between items-center w-full">
                                                  <div className="flex-1 mx-4 bg-gray-200 h-2">
                                                      <div
                                                          className="bg-[#13b76dbd] h-2"
                                                          style={{ width: "0%" }}
                                                      ></div>
                                                  </div>
                                                  <span>{teamDetails?.tied_match}</span>
                                              </div>
                                              <div className="md:w-[50%] w-full text-center">
                                                  <span className="font-semibold">Tied</span>
                                              </div>
                                              <div className="flex justify-between items-center w-full">
                                                  <span>{teamDetails?.tied_match}</span>
                                                  <div className="flex-1 mx-4 bg-gray-200 h-2">
                                                      <div
                                                          className="bg-[#13b76dbd] h-2"
                                                          style={{ width: "0%" }}
                                                      ></div>
                                                  </div>
                                              </div>
                                          </div>
                                      </div>
                                    }{(teamDetails?.teama_home_won_match >0 || teamDetails?.teamb_home_won_match > 0) &&
                                      <div className="my-4">
                                          <div className="flex justify-between items-center">
                                              <div className="flex justify-between items-center w-full">
                                                  <div className="flex-1 mx-4 bg-gray-200 h-2">
                                                      <div
                                                          className="bg-[#13b76dbd] h-2"
                                                          style={{ width: "0%" }}
                                                      ></div>
                                                  </div>
                                                  <span>{teamDetails?.teama_home_won_match}</span>
                                              </div>
                                              <div className="md:w-[50%] w-full text-center">
                                                  <span className="font-semibold">Home Won</span>
                                              </div>
                                              <div className="flex justify-between items-center w-full">
                                                  <span>{teamDetails?.teamb_home_won_match}</span>
                                                  <div className="flex-1 mx-4 bg-gray-200 h-2">
                                                      <div
                                                          className="bg-[#13b76dbd] h-2"
                                                          style={{ width: "0%" }}
                                                      ></div>
                                                  </div>
                                              </div>
                                          </div>
                                      </div>
                                    }{(teamDetails?.teama_away_won_match >0 || teamDetails?.teamb_away_won_match > 0) &&
                                      <div className="my-4">
                                          <div className="flex justify-between items-center">
                                              <div className="flex justify-between items-center w-full">
                                                  <div className="flex-1 mx-4 bg-gray-200 h-2">
                                                      <div
                                                          className="bg-[#13b76dbd] h-2"
                                                          style={{ width: "0%" }}
                                                      ></div>
                                                  </div>
                                                  <span>{teamDetails?.teama_away_won_match}</span>
                                              </div>
                                              <div className="md:w-[50%] w-full text-center">
                                                  <span className="font-semibold">Away Won</span>
                                              </div>
                                              <div className="flex justify-between items-center w-full">
                                                  <span>{teamDetails?.teamb_away_won_match}</span>
                                                  <div className="flex-1 mx-4 bg-gray-200 h-2">
                                                      <div
                                                          className="bg-[#13b76dbd] h-2"
                                                          style={{ width: "0%" }}
                                                      ></div>
                                                  </div>
                                              </div>
                                          </div>
                                      </div>
                                    }{(teamDetails?.teama_neutral_won_match >0 || teamDetails?.teamb_neutral_won_match > 0) &&
                                      <div className="my-4">
                                          <div className="flex justify-between items-center">
                                              <div className="flex justify-between items-center w-full">
                                                  <div className="flex-1 mx-4 bg-gray-200 h-2">
                                                      <div
                                                          className="bg-[#13b76dbd] h-2"
                                                          style={{ width: "0%" }}
                                                      ></div>
                                                  </div>
                                                  <span>{teamDetails?.teama_neutral_won_match}</span>
                                              </div>
                                              <div className="md:w-[50%] w-full text-center">
                                                  <span className="font-semibold">Neutral Won</span>
                                              </div>
                                              <div className="flex justify-between items-center w-full">
                                                  <span>{teamDetails?.teamb_neutral_won_match}</span>
                                                  <div className="flex-1 mx-4 bg-gray-200 h-2">
                                                      <div
                                                          className="bg-[#13b76dbd] h-2"
                                                          style={{ width: "0%" }}
                                                      ></div>
                                                  </div>
                                              </div>
                                          </div>
                                      </div>
                                        }
                    </div>
                  </div>
                )}

                {completedMatch.length > 0 && (
                  <div className="bg-[white] p-4 rounded-lg my-4">
                    <div className="md:flex justify-between items-center mb-3">
                      <h3 className="text-1xl font-semibold pl-[7px] border-l-[3px] border-[#229ED3]">
                        {teamADetails.title} vs {teamBDetails.title} Recent {matchType.charAt(0).toUpperCase() + matchType.slice(1)} Matches
                      </h3>
                    </div>
                    <div className="grid grid-cols-12 gap-4 cust-tp-pera-card-section">
                      {completedMatch.map((match, index) => renderMatchCard(match, index))}
                    </div>
                  </div>
                )}

                <div className="rounded-lg bg-[#ffffff] p-4 my-4">
                  <h3 className="text-1xl font-semibold mb-1">
                    {teamADetails.title} vs {teamBDetails.title} 2025
                  </h3>
                  <p className="text-gray-500 font-normal">
                    The biggest tournament in the cricketing circuit, the ICC
                    T20 WORLD Cup is underway in the USAs and the West Indies.
                    The tournament received excellent response from the fans
                    worldwide...
                  </p>
                  <Link href="#">
                    <p className="text-[#1A80F8] font-semibold flex items-center text-[13px] pt-2 underline">
                      Read more{" "}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="size-3 ml-2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5"
                        />
                      </svg>
                    </p>
                  </Link>
                </div>

                <div className="rounded-lg bg-[#ffffff] p-4 mb-4">
                  <h3 className="text-1xl font-semibold mb-2 pl-[7px] border-l-[3px] border-[#229ED3]">
                    News
                  </h3>
                  <div className="border-t-[1px] border-[#E4E9F0]" />
                  <NewsSection urlString="" />
                </div>
              </div>

              <div className="lg:col-span-4 md:col-span-5">
                <div className="bg-white rounded-lg p-4 mb-4">
                  <div className="flex gap-1 items-center justify-between">
                    <div className="flex gap-1 items-center">
                      <div className="col-span-4 relative">
                        <Image
                          src="/assets/img/home/trofi.png"
                          className="h-[75px]"
                          alt="Weekly challenge trophy"
                          width={75}
                          height={75}
                        />
                      </div>
                      <div className="col-span-8 relative">
                        <h3 className="font-semibold text-[19px] mb-1">
                          Weekly challenge
                        </h3>
                        <p className="font-semibold text-[13px] text-[#1a80f8]">
                          <span className="text-[#586577]">Time Left:</span> 2 Days 12h
                        </p>
                      </div>
                    </div>
                    <div className="">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="size-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m8.25 4.5 7.5 7.5-7.5 7.5"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <WeeklySlider featuredMatch={featuredMatch} />
                <PLSeries />
                <FantasyTips />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}