"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import WeeklySlider from "@/app/components/WeeklySlider";
// import NewsSection from "./NewsSection";
import NewsSection from "@/app/series/seriesComponents/NewsSection";
import PLSeries from "@/app/components/popularSeries";
import FantasyTips from "@/app/components/FantasyTips";
import ReadMoreCard from "@/app/components/ReadMoreCard";

import { BsFillLightningChargeFill } from "react-icons/bs";

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
  teamDetails: any | null;
  teamADetails: TeamData | null;
  teamBDetails: TeamData | null;
  urlStrings: string | null;
  completedMatch: MatchData[] | [];
  allTeams: any;
}

export default function H2h({
  teamDetails,
  teamADetails,
  teamBDetails,
  urlStrings,
  completedMatch,
  allTeams
}: H2hProps) {
  const [show, setShow] = useState(false);
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  console.log(teamDetails);
  // Safe calculations with fallbacks
  const totalMatches = teamDetails?.teamAB_total_match || 0;
  const teamaWon = totalMatches > 0 ?
    Math.round((teamDetails?.teama_won_match || 0) * 100 / totalMatches) : 0;
  const teambWon = totalMatches > 0 ?
    Math.round((teamDetails?.teamb_won_match || 0) * 100 / totalMatches) : 0;

  // Safe URL parsing
  const matchType = urlStrings?.split('-').pop() || 'test';
  const urlWithoutMatchType = urlStrings?.split('-').slice(0, -1).join('-') || '';

  let content = '';
  if (matchType === 'test') {
    content = `${teamADetails?.title} and ${teamBDetails?.title} have developed a competitive rivalry across all formats of international cricket. In Test cricket, both teams have faced off ${totalMatches} times. Out of these, ${teamADetails?.title} have won ${teamDetails?.teama_won_match}, ${teamBDetails?.title} have won ${teamDetails?.teamb_won_match}, and ${teamDetails?.nr_match} matches ended in a draw.`
  } else if (matchType === 'odi') {
    content = `${teamADetails?.title} and ${teamBDetails?.title} have developed a competitive rivalry across all formats of international cricket. In ODIs, ${teamADetails?.title} and ${teamBDetails?.title} have met in ${totalMatches} matches, where ${teamADetails?.title} have won ${teamDetails?.teama_won_match} and ${teamBDetails?.title} have managed ${teamDetails?.teamb_won_match} wins, while ${teamDetails?.nr_match} match ended with no result.`
  } else if (matchType === 't20') {
    content = `${teamADetails?.title} and ${teamBDetails?.title} have developed a competitive rivalry across all formats of international cricket. When it comes to T20 internationals, out of ${totalMatches} clashes, ${teamADetails?.title} lead with ${teamDetails?.teama_won_match} wins, and ${teamBDetails?.title} have won ${teamDetails?.teamb_won_match} matches so far.`
  } else {
    content = `${teamADetails?.title} and ${teamBDetails?.title} have developed a competitive rivalry across all formats of international cricket. When it comes to T20 internationals, out of ${totalMatches} clashes, ${teamADetails?.title} lead with ${teamDetails?.teama_won_match} wins, and ${teamBDetails?.title} have won ${teamDetails?.teamb_won_match} matches so far.`
  }

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
        <div className="rounded-lg max-w-md w-full p-4 border-[1px] bg-[#f2f7ff]">
          <div className="flex flex-col pb-1">
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
                    className="h-[30px] w-[30px] rounded-full"
                    width={30}
                    height={30}
                    alt={parsedMatch.teamA.short_name || "Team A"}
                  />
                )}
                <span className="text-[#757A82]">{parsedMatch.teamA?.short_name || 'Team A'}</span>
              </div>
              <div className="mt-1">
                <p className="text-1xl font-semibold">{parsedMatch.teamA?.scores || '0'}</p>
              </div>
            </div>
             <div className="text-gray-500 text-2xl font-semibold">
                <BsFillLightningChargeFill />
              </div>
            <div className="flex space-x-2 justify-end">
              <div className="mt-1 text-end">
                <p className="text-1xl font-semibold">{parsedMatch.teamB?.scores || '0'}</p>
              </div>
              <div className="flex items-center space-x-1 flex-col font-medium">
                {parsedMatch.teamB?.logo_url && (
                  <Image
                    src={parsedMatch.teamB.logo_url}
                    className="h-[30px] w-[30px] rounded-full"
                    width={30}
                    height={30}
                    alt={parsedMatch.teamB.short_name || "Team B"}
                  />
                )}
                <span className="text-[#757A82]">{parsedMatch.teamB?.short_name || 'Team B'}</span>
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
      <section className="bg-[#0E2149] border-[1px] border-[#E4E9F01A] lg:px-0 px-3 mb-4">
        <div className="border-t-[1px] border-[#E4E9F01A]">
          <div className="lg:w-[1000px] mx-auto md:py-8 tracking-[1px]">
            <div className="flex py-8 justify-between items-center">
              <div className="w-[25%] flex  gap-3 text-[#FF912C] font-bold uppercase items-center">
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


              <div className="text-[#8192B4] font-normal text-center md:w-[50%] w-[45%]">
                <h2 className="text-[#ffffff] text-[24px] font-semibold flex justify-center">
                  <BsFillLightningChargeFill />
                </h2>
              </div>


              <div className="w-[25%] flex items-center gap-3 text-[#8192B4] font-normal justify-end">
                <p className="text-[#BDCCECA8] md:mx-3 mx-0 md:text-[19px] text-[14px] font-semibold uppercase">
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
                {/* <p className="text-[#BDCCECA8] md:hidden md:text-[19px] text-[14px] md:mx-3 mx-0 font-semibold uppercase">
                  {teamBDetails.abbr || 'Team B'}
                </p> */}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="lg:w-[1000px] mx-auto md:mb-0 mb-4 px-2 lg:px-0">
        {teamADetails?.type !== 'club' &&
          <div id="tabs" className="mb-4">
            <div className="flex text-1xl md:space-x-8 space-x-5 p-2 bg-[#ffffff] rounded-lg overflow-auto">
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
              {/* <Link href={`${urlWithoutMatchType}-t20s`}>
                <button
                  className={`font-semibold uppercase py-2 px-5 whitespace-nowrap ${matchType === "t20wc" ? "bg-[#1A80F8] text-white" : ""} rounded-md`}
                >
                  T20 WC
                </button>
              </Link> */}
            </div>
          </div>
        }
        <div id="tab-content">
          <div className="tab-content">
            <div className="md:grid grid-cols-12 gap-4">
              <div className="lg:col-span-8 md:col-span-7">
                {teamDetails?.teamAB_total_match > 0 && (
                  <div className="rounded-lg bg-[#ffffff] p-4 mb-4">
                    <h1 className="text-[20px] font-semibold pl-[7px] border-l-[3px] mb-3 border-[#229ED3]">
                      {teamADetails.abbr} vs {teamBDetails.abbr} Head to Head in {matchType.charAt(0).toUpperCase() + matchType.slice(1)} Records
                    </h1>
                    <div className="border-t-[1px] border-[#E4E9F0]" />

                    <div className="mt-4">
                     
                        <p className="text-gray-700 font-normal text-[14px] mb-6">{content}</p>
                        

                      <div className="flex gap-2 md:gap-0 flex-row justify-between items-center mb-4">

                        <div className="md:w-full w-[40%] relative">
                          <div className="border border-gray-300 rounded-md p-2 text-gray-700 md:w-[70%] w-full cursor-pointer">
                            <span className="flex items-center">
                              {teamADetails.logo_url && (
                                <Image
                                  src={teamADetails.logo_url}
                                  width={30}
                                  height={30}
                                  alt="teams"
                                  className="h-[30px] w-[30px] mr-2"
                                />
                              )}
                              {teamADetails?.abbr}
                            </span>
                          </div>
                        </div>

                        <div className="text-center font-bold md:text-1xl">VS</div>

                        <div className="md:w-full w-[40%] text-right">
                          <div className="relative flex justify-end">
                            <div className="border border-gray-300 rounded-md p-2 text-gray-700 md:w-[70%] w-full cursor-pointer">
                              <span className="flex items-center">
                                {teamBDetails.logo_url && (
                                  <Image
                                    src={teamBDetails.logo_url}
                                    width={30}
                                    height={30}
                                    alt="teams"
                                    className="h-[30px] w-[30px] mr-2"
                                  />
                                )}
                                {teamBDetails?.abbr}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

  <div className="border-[1px] rounded-lg py-4">

                      <div className="flex justify-center text-center">
                        <div className="p-2 rounded-md font-semibold text-1xl">
                          <span className="md:text-[18px] text-[15px] font-semibold">{totalMatches} <span className="text-[14px] font-medium">Matches</span></span>
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
                            <span className="md:text-[18px] text-[15px] font-semibold">{teamDetails.teama_won_match}</span>
                          </div>
                          <div className="w-full text-center">
                            <span className="font-medium">Won</span>
                          </div>
                          <div className="flex justify-between items-center w-full">
                            <span className="md:text-[18px] text-[15px] font-semibold">{teamDetails.teamb_won_match}</span>
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
                                style={{ width: teambWon + "%" }}
                              ></div>
                            </div>
                            <span className="md:text-[18px] text-[15px] font-semibold">{teamDetails?.teamb_won_match}</span>
                          </div>
                          <div className="w-full text-center">
                            <span className="font-medium">Lost</span>
                          </div>
                          <div className="flex justify-between items-center w-full">
                            <span className="md:text-[18px] text-[15px] font-semibold">{teamDetails?.teama_won_match}</span>
                            <div className="flex-1 mx-4 bg-gray-200 h-2">
                              <div
                                className="bg-[#B7132B] h-2"
                                style={{ width: teamaWon + "%" }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {(teamDetails?.nr_match > 0 || teamDetails?.nr_match > 0) &&
                        <div className="my-4">
                          <div className="flex justify-between items-center">
                            <div className="flex justify-between items-center w-full">
                              <div className="flex-1 mx-4 bg-gray-200 h-2">
                                <div
                                  className="bg-[#13b76dbd] h-2"
                                  style={{ width: "0%" }}
                                ></div>
                              </div>
                              <span className="md:text-[18px] text-[15px] font-semibold">{teamDetails?.nr_match}</span>
                            </div>
                            <div className="w-full text-center">
                              <span className="font-medium">No Result</span>
                            </div>
                            <div className="flex justify-between items-center w-full">
                              <span className="md:text-[18px] text-[15px] font-semibold">{teamDetails?.nr_match}</span>
                              <div className="flex-1 mx-4 bg-gray-200 h-2">
                                <div
                                  className="bg-[#13b76dbd] h-2"
                                  style={{ width: "0%" }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      }{(teamDetails?.tied_match > 0 || teamDetails?.tied_match > 0) &&
                        <div className="my-4">
                          <div className="flex justify-between items-center">
                            <div className="flex justify-between items-center w-full">
                              <div className="flex-1 mx-4 bg-gray-200 h-2">
                                <div
                                  className="bg-[#13b76dbd] h-2"
                                  style={{ width: "0%" }}
                                ></div>
                              </div>
                              <span className="md:text-[18px] text-[15px] font-semibold">{teamDetails?.tied_match}</span>
                            </div>
                            <div className="w-full text-center">
                              <span className="font-medium">Tied</span>
                            </div>
                            <div className="flex justify-between items-center w-full">
                              <span className="md:text-[18px] text-[15px] font-semibold">{teamDetails?.tied_match}</span>
                              <div className="flex-1 mx-4 bg-gray-200 h-2">
                                <div
                                  className="bg-[#13b76dbd] h-2"
                                  style={{ width: "0%" }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      }{(teamDetails?.teama_home_won_match > 0 || teamDetails?.teamb_home_won_match > 0) &&
                        <div className="my-4">
                          <div className="flex justify-between items-center">
                            <div className="flex justify-between items-center w-full">
                              <div className="flex-1 mx-4 bg-gray-200 h-2">
                                <div
                                  className="bg-[#13b76dbd] h-2"
                                  style={{ width: "0%" }}
                                ></div>
                              </div>
                              <span className="md:text-[18px] text-[15px] font-semibold">{teamDetails?.teama_home_won_match}</span>
                            </div>
                            <div className="w-full text-center">
                              <span className="font-medium">Home Won</span>
                            </div>
                            <div className="flex justify-between items-center w-full">
                              <span className="md:text-[18px] text-[15px] font-semibold">{teamDetails?.teamb_home_won_match}</span>
                              <div className="flex-1 mx-4 bg-gray-200 h-2">
                                <div
                                  className="bg-[#13b76dbd] h-2"
                                  style={{ width: "0%" }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      }{(teamDetails?.teama_away_won_match > 0 || teamDetails?.teamb_away_won_match > 0) &&
                        <div className="my-4">
                          <div className="flex justify-between items-center">
                            <div className="flex justify-between items-center w-full">
                              <div className="flex-1 mx-4 bg-gray-200 h-2">
                                <div
                                  className="bg-[#13b76dbd] h-2"
                                  style={{ width: "0%" }}
                                ></div>
                              </div>
                              <span className="md:text-[18px] text-[15px] font-semibold">{teamDetails?.teama_away_won_match}</span>
                            </div>
                            <div className="w-full text-center">
                              <span className="font-medium">Away Won</span>
                            </div>
                            <div className="flex justify-between items-center w-full">
                              <span className="md:text-[18px] text-[15px] font-semibold">{teamDetails?.teamb_away_won_match}</span>
                              <div className="flex-1 mx-4 bg-gray-200 h-2">
                                <div
                                  className="bg-[#13b76dbd] h-2"
                                  style={{ width: "0%" }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      }{(teamDetails?.teama_neutral_won_match > 0 || teamDetails?.teamb_neutral_won_match > 0) &&
                        <div className="my-4">
                          <div className="flex justify-between items-center">
                            <div className="flex justify-between items-center w-full">
                              <div className="flex-1 mx-4 bg-gray-200 h-2">
                                <div
                                  className="bg-[#13b76dbd] h-2"
                                  style={{ width: "0%" }}
                                ></div>
                              </div>
                              <span className="md:text-[18px] text-[15px] font-semibold">{teamDetails?.teama_neutral_won_match}</span>
                            </div>
                            <div className="w-full text-center">
                              <span className="font-medium">Neutral Won</span>
                            </div>
                            <div className="flex justify-between items-center w-full">
                              <span className="md:text-[18px] text-[15px] font-semibold">{teamDetails?.teamb_neutral_won_match}</span>
                              <div className="flex-1 mx-4 bg-gray-200 h-2">
                                <div
                                  className="bg-[#13b76dbd] h-2"
                                  style={{ width: "0%" }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      }{(teamDetails?.teama_highest_score > 0 || teamDetails?.teamb_highest_score > 0) &&
                        <div className="my-4">
                          <div className="flex justify-between items-center">
                            <div className="flex justify-between items-center w-full">
                              <div className="flex-1 mx-4 bg-gray-200 h-2">
                                <div
                                  className="bg-[#13b76dbd] h-2"
                                  style={{ width: "0%" }}
                                ></div>
                              </div>
                              <span className="md:text-[18px] text-[15px] font-semibold">{teamDetails?.teama_highest_score}</span>
                            </div>
                            <div className="w-full text-center">
                              <span className="font-medium">Highest Score</span>
                            </div>
                            <div className="flex justify-between items-center w-full">
                              <span className="md:text-[18px] text-[15px] font-semibold">{teamDetails?.teamb_highest_score}</span>
                              <div className="flex-1 mx-4 bg-gray-200 h-2">
                                <div
                                  className="bg-[#13b76dbd] h-2"
                                  style={{ width: "0%" }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      }{(teamDetails?.teama_lowest_score > 0 || teamDetails?.teamb_lowest_score > 0) &&
                        <div className="my-4">
                          <div className="flex justify-between items-center">
                            <div className="flex justify-between items-center w-full">
                              <div className="flex-1 mx-4 bg-gray-200 h-2">
                                <div
                                  className="bg-[#13b76dbd] h-2"
                                  style={{ width: "0%" }}
                                ></div>
                              </div>
                              <span className="md:text-[18px] text-[15px] font-semibold">{teamDetails?.teama_lowest_score}</span>
                            </div>
                            <div className="w-full text-center">
                              <span className="font-medium">Lowest Score</span>
                            </div>
                            <div className="flex justify-between items-center w-full">
                              <span className="md:text-[18px] text-[15px] font-semibold">{teamDetails?.teamb_lowest_score}</span>
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

              

                <div className="rounded-lg bg-[#ffffff] p-4 mb-4">
                  <h2 className="text-1xl font-semibold mb-2 pl-[7px] border-l-[3px] border-[#229ED3]">
                    News
                  </h2>
                  <div className="border-t-[1px] border-[#E4E9F0]" />
                  <NewsSection urlString="" />
                </div>
              </div>

              <div className="lg:col-span-4 md:col-span-5 md:-mt-4">

                <WeeklySlider />
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