"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import WeeklySlider from "@/app/components/WeeklySlider";
import NewsSection from "./NewsSection";
import PLSeries from "@/app/components/popularSeries";
import FantasyTips from "@/app/components/FantasyTips";
import ReadMoreCard from "@/app/components/ReadMoreCard";
import TeamSelect from "@/app/components/TeamSelect";
import { urlStringEncode } from "../../utils/utility";

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
  competition?: any;
  match_number?: string;
  match_id?: number;
  
}

interface H2hProps {
  teamDetails: any | null;
  teamADetails: TeamData | null;
  teamBDetails: TeamData | null;
  urlStrings: string | null;
  completedMatch: MatchData[] | [];
  allTeams: any | [];
}

export default function H2hipl({
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

  const teamalist =  allTeams?.data?.filter((item: { tid: number }) => Number(item.tid) === teamADetails?.tid);
  const teamblist =  allTeams?.data?.filter((item: { tid: number }) => Number(item.tid) === teamBDetails?.tid);

const [selectedTeamA, setSelectedTeamA] = useState<any>(teamalist[0]);
const [selectedTeamB, setSelectedTeamB] = useState<any>(teamblist[0]);

const teamAOptions = allTeams?.data?.filter((team: { tid: any; }) => team.tid !== selectedTeamB?.tid);
const teamBOptions = allTeams?.data?.filter((team: { tid: any; }) => team.tid !== selectedTeamA?.tid);

const router = useRouter();

const handleTeamSelect = (team: any, type: 'A' | 'B') => {
  if (type === 'A') {
    setSelectedTeamA(team);
  } else {
    setSelectedTeamB(team);
  }
  const clean = (str?: string) => str ? str.replace(/\s/g, '').replace(/\u00A0/g, '').trim() : '';
  const teamAId:string = type === 'A' ? team?.abbr : selectedTeamA?.abbr;
  const teamBId:string = type === 'B' ? team?.abbr : selectedTeamB?.abbr;

  const teamA = clean(teamAId);
  const teamB = clean(teamBId);
  if (teamA && teamB) {
    const url = urlStringEncode(`${teamA}-vs-${teamB}-head-to-head-in-t20`);
    router.push(url);
  }
};

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
  if(matchType === 'test'){
     content = `${teamADetails?.title} and ${teamBDetails?.title} have developed a competitive rivalry across all formats of international cricket. In Test cricket, both teams have faced off ${totalMatches} times. Out of these, ${teamADetails?.title} have won ${teamDetails.teama_won_match}, ${teamBDetails?.title} have won ${teamDetails?.teamb_won_match}, and ${teamDetails?.nr_match} matches ended in a draw.`
  }else if(matchType === 'odi'){
     content = `${teamADetails?.title} and ${teamBDetails?.title} have developed a competitive rivalry across all formats of international cricket. In ODIs, ${teamADetails?.title} and ${teamBDetails?.title} have met in ${totalMatches} matches, where ${teamADetails?.title} have won ${teamDetails?.teama_won_match} and ${teamBDetails?.title} have managed ${teamDetails?.teamb_won_match} wins, while ${teamDetails?.nr_match} match ended with no result.`
  }else if(matchType === 't20'){
     content = `${teamADetails?.title} and ${teamBDetails?.title} have developed a competitive rivalry across all formats of international cricket. When it comes to T20 internationals, out of ${totalMatches} clashes, ${teamADetails?.title} lead with ${teamDetails?.teama_won_match} wins, and ${teamBDetails?.title} have won ${teamDetails?.teamb_won_match} matches so far.`
  }else{
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
        subtitle: match?.subtitle,
        match_number: match?.match_number,
        competition: match?.competition,
        match_id: match?.match_id,
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
        <Link href={"/scorecard/" + urlStringEncode(parsedMatch?.teamA?.short_name + "-vs-" + parsedMatch?.teamB?.short_name + "-" + parsedMatch?.subtitle + "-" + parsedMatch?.competition?.title + "-" + parsedMatch?.competition?.season) + "/" + parsedMatch.match_id}>
        <div className="rounded-lg max-w-md w-full p-4 border-[1px]" style={{
          background: 'linear-gradient(to bottom, #ecf2fd, #ffffff)',

            }}>
          <div className="flex justify-between items-center pb-1">
            <h2 className="text-[13px]  font-semibold">{parsedMatch.subtitle || 'Match'}</h2>
            {parsedMatch.date && (
              <p className="text-[#A45B09] font-medium">
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
                <span className="text-[#586577] font-medium text-[14px]">{parsedMatch.teamA?.short_name || 'Team A'}</span>
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
                    className="h-[30px] w-[30px] rounded-full"
                    width={30}
                    height={30}
                    alt={parsedMatch.teamB.short_name || "Team B"}
                  />
                )}
                <span className="text-[#586577] font-medium text-[14px]">{parsedMatch.teamB?.short_name || 'Team B'}</span>
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
        </Link>
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
                <p className="text-[#FFBD71] md:text-[20px] text-[16px] font-semibold">
                  {teamADetails.abbr || 'Team A'} vs {teamBDetails.abbr || 'Team B'} Head to Head in {matchType.toUpperCase()}
                </p>
              </div>


              <div className="w-[25%] flex items-center gap-3 text-[#8192B4] font-normal justify-end">
                <p className="text-[#BDCCECA8] md:text-[19px] text-[14px] md:mx-3 mx-0 font-semibold uppercase">
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
            <div className="flex text-[13px] md:space-x-8 space-x-5 p-2 bg-[#ffffff] rounded-lg overflow-auto">
              <Link href={`${urlWithoutMatchType}-test`}>
                <button
                  className={`font-semibold uppercase py-2 px-5 whitespace-nowrap ${matchType === "test" ? "bg-[#1A80F8] text-white" : ""} rounded-md`}
                >
                  Test
                </button>
              </Link>
              <Link href={`${urlWithoutMatchType}-odi`}>
                <button
                  className={`font-semibold uppercase py-2 px-5 whitespace-nowrap ${matchType === "odi" ? "bg-[#1A80F8] text-white" : ""} rounded-md`}
                >
                  ODI
                </button>
              </Link>
              <Link href={`${urlWithoutMatchType}-t20`}>
                <button
                  className={`font-semibold uppercase py-2 px-5 whitespace-nowrap ${matchType === "t20" ? "bg-[#1A80F8] text-white" : ""} rounded-md`}
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
                  <div className="rounded-lg bg-[#ffffff] p-4">
                    <h3 className="text-[15px] font-semibold pl-[7px] border-l-[3px] mb-3 border-[#229ED3]">
                      {teamADetails.title} vs {teamBDetails.title} Head to Head in {matchType.charAt(0).toUpperCase() + matchType.slice(1)} Records
                    </h3>
                    <div className="border-t-[1px] border-[#E4E9F0]" />

                    <div className="mt-4">
                      <div className="mb-6">
                      
                        <ReadMoreCard
                          title=""
                          content={content}
                          wordLimit={30}
                        />

                      </div>

                      <div className="flex gap-2 md:gap-0 flex-row justify-between items-center mb-4">

                        <div className="md:w-full w-[40%] relative">
                          <div className="border border-gray-300 rounded-md p-2 text-gray-700 md:w-[70%] w-full cursor-pointer">
                            <TeamSelect
                                selectedTeam={selectedTeamA}
                                onChange={(team) => handleTeamSelect(team, 'A')}
                                teams={teamAOptions || []}
                                label="Team A"
                              />
                          </div>
                        </div>

                        <div className="text-center font-bold md:text-1xl">VS</div>

                        <div className="md:w-full w-[40%] text-right">
                          <div className="relative flex justify-end">
                            <div className="border border-gray-300 rounded-md p-2 text-gray-700 md:w-[70%] w-full cursor-pointer">
                            <TeamSelect
                                selectedTeam={selectedTeamB}
                                onChange={(team) => handleTeamSelect(team, 'B')}
                                teams={teamBOptions || []}
                                label="Team B"
                              />
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
                                style={{ width: teambWon + "%" }}
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
                              <span>{teamDetails?.teama_highest_score}</span>
                            </div>
                            <div className="md:w-[50%] w-full text-center">
                              <span className="font-semibold">Highest Score</span>
                            </div>
                            <div className="flex justify-between items-center w-full">
                              <span>{teamDetails?.teamb_highest_score}</span>
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
                              <span>{teamDetails?.teama_lowest_score}</span>
                            </div>
                            <div className="md:w-[50%] w-full text-center">
                              <span className="font-semibold">Lowest Score</span>
                            </div>
                            <div className="flex justify-between items-center w-full">
                              <span>{teamDetails?.teamb_lowest_score}</span>
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

                <div className="rounded-lg bg-[#ffffff] p-4 mb-4">
                  <h3 className="text-1xl font-semibold mb-1">
                    {teamADetails.title} vs {teamBDetails.title} 2025
                  </h3>

                  <ReadMoreCard
                    title=""
                    content="The biggest tournament in the cricketing circuit, the ICC
                    T20 WORLD Cup is underway in the USAs and the West Indies.
                    The tournament received excellent response from the fans
                    worldwide The biggest tournament in the cricketing circuit, the ICC
                    T20 WORLD Cup is underway in the USAs and the West Indies.
                    The tournament received excellent response from the fans
                    worldwide"
                    wordLimit={30}
                  />
                </div>

                <div className="rounded-lg bg-[#ffffff] p-4 mb-4">
                  <h3 className="text-1xl font-semibold mb-2 pl-[7px] border-l-[3px] border-[#229ED3]">
                    News
                  </h3>
                  <div className="border-t-[1px] border-[#E4E9F0]" />
                  <NewsSection urlString="" />
                </div>
              </div>

              <div className="lg:col-span-4 md:col-span-5 -mt-4">

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