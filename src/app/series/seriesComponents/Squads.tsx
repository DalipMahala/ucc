"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { urlStringEncode} from "@/utils/utility";
import PlayerImage from "@/app/components/PlayerImage";
import TabMenu from "./menu";

interface Squad {
  urlString: string;
  teamPlayers: any;
  seriesInfo: any;
  isPointTable:boolean;
}
export default function Squad({ urlString, teamPlayers, seriesInfo,isPointTable }: Squad) {
  const [activeTab, setActiveTab] = useState("tab0");
  const seriesName = seriesInfo?.abbr;
  const seriesFormat = seriesInfo?.game_format;
  const uniqueFormats: any[] = [...new Set(seriesInfo?.rounds.map((round:any) => round.match_format))];
  return (
    <section className="lg:w-[1000px] mx-auto md:mb-0 mb-4 px-2 lg:px-0">
      <TabMenu urlString={urlString} isPointTable={isPointTable}/>
      <div id="squads" className="tab-content">
        <div className="py-2 mb-2">
          <h3 className="text-1xl font-semibold pl-[3px] border-l-[3px] border-[#1a80f8]">
            {seriesName} Squads
          </h3>
        </div>
        <div className="md:grid grid-cols-12 gap-4">
          <div className="lg:col-span-4 md:col-span-5">
            <div className="rounded-lg p-2 mb-4 bg-[#ffffff]">
              <div id="team-buttons" className="">
                {teamPlayers?.map((teamslist: any, index: number) => (
                  <button
                    key={index}
                    className={`team-btn px-2 mb-1 py-3 w-full font-medium flex items-center ${
                      activeTab === "tab"+index
                        ? "text-[#394351] bg-[#eaeaea] rounded-md"
                        : "text-[#394351] bg-[#ffffff] rounded-md"
                    }`}
                    onClick={() => setActiveTab("tab" + index)}
                  >
                    <Image  loading="lazy" 
                      src={teamslist?.team?.logo_url}
                      className="mr-3"
                      width={20}
                      height={20}
                      alt={teamslist?.team?.alt_name}
                    />
                    {teamslist?.team?.alt_name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 md:col-span-7">
          {teamPlayers?.map((teamslist: any, index: number) => (
            
            activeTab === "tab"+index && (
              <div id="south-team" className="team-content " key={index}>
                <div className="max-w-7xl mx-auto bg-white rounded-lg p-6">
                  <div className="flex items-center space-x-4 mb-3">
                    <Image  loading="lazy" 
                      src={teamslist?.team.logo_url}
                      width={45}
                      height={45}
                      alt={teamslist?.team.abbr}
                      className="h-[45px] rounded-full"
                    />

                    <h1 className="text-[16px] font-semibold text-gray-800">
                      {teamslist?.team.abbr}{" "}
                      <span className="text-gray-500">
                        ({uniqueFormats.flatMap((format) => teamslist?.players[format] ?? [])?.length} players)
                      </span>
                    </h1>
                  </div>

                  <div className='border-[#E4E9F0] border-b-[1px] w-full'></div>
                  
                  <div className="space-y-6 mt-3">
                    <div>
                      <h2 className="text-1xl font-semibold pl-[5px] border-l-[3px] border-[#1a80f8] mb-4">
                        Batsman
                      </h2>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {uniqueFormats.flatMap((format) => teamslist?.players[format] ?? [])?.map((squads: any, index: number) => (
                            (squads.playing_role === 'bat' || squads.playing_role === 'wk') &&
                          <Link className="rounded-md border-[1px] border-[##E2E2E2]"
                            href={
                              "/player/" +
                              urlStringEncode(squads?.title) +
                              "/" +
                              squads?.pid
                            }
                            key={index}
                          >
                            <div className="text-center p-4 ">
                              <div className="relative">
                                 <PlayerImage key={squads?.pid} player_id={ squads?.pid} height={47} width={47} className="w-[47px] h-[47px] mx-auto rounded-full mb-2" />
                                
                                <Image  loading="lazy" 
                                  src="/assets/img/player/bat.png"
                                  className="h-[27px] absolute md:right-2 right-[25px] bottom-0 bg-white rounded-full p-[4px]"
                                  width={27}
                                  height={27}
                                  alt={squads.short_name}
                                />
                              </div>
                              <h3 className="text-sm font-semibold text-blue-500 ">
                                {squads.name}{" "}
                                {squads.playing_role !== "" &&
                                squads.playing_role !== undefined ? (
                                  <span className="text-blue-500">
                                    {squads.short_name}
                                  </span>
                                ) : (
                                  ""
                                )}
                              </h3>
                              <p className="text-xs text-gray-600">Batsman</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                    {/* Bowler Section */}
                    <div>
                      <h2 className="text-1xl font-semibold pl-[5px] border-l-[3px] border-[#1a80f8] mb-4">
                        Bowler
                      </h2>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {uniqueFormats.flatMap((format) => teamslist?.players[format] ?? [])?.map((bowler: any, index: number) => (
                            bowler.playing_role === 'bowl' &&
                          <Link className="rounded-md border-[1px] border-[##E2E2E2]"
                            href={
                              "/player/" +
                              urlStringEncode(bowler?.title) +
                              "/" +
                              bowler?.pid
                            }
                            key={index}
                          >
                            <div className="text-center p-4 ">
                              <div className="relative">
                              <PlayerImage key={bowler?.pid} player_id={ bowler?.pid} height={47} width={47} className="w-[47px] h-[47px] mx-auto rounded-full mb-2" />
                                <Image  loading="lazy" 
                                  src="/assets/img/player/ball.png"
                                  className="h-[24px] absolute md:right-2 right-[25px] bottom-0 bg-white rounded-full p-[4px]"
                                  width={24}
                                  height={24}
                                  alt={bowler.short_name}
                                />
                              </div>
                              <h3 className="text-sm font-semibold text-gray-800">
                                {bowler.short_name}
                              </h3>
                              <p className="text-xs text-gray-600">Bowler</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                    {/* All-Rounder Section */}
                    <div>
                      <h2 className="text-1xl font-semibold pl-[5px] border-l-[3px] border-[#1a80f8] mb-4">
                        All-Rounder
                      </h2>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {uniqueFormats.flatMap((format) => teamslist?.players[format] ?? [])?.map((allrounder: any, index: number) => (
                        allrounder.playing_role === 'all' &&
                          <Link className="rounded-md border-[1px] border-[##E2E2E2]"
                            href={
                              "/player/" +
                              urlStringEncode(allrounder?.title) +
                              "/" +
                              allrounder?.pid
                            }
                            key={index}
                          >
                            <div className="text-center p-4">
                              <div className="relative">
                              <PlayerImage key={allrounder?.pid}  player_id={ allrounder?.pid} height={47} width={47} className="w-[47px] h-[47px] mx-auto rounded-full mb-2" />
                                <Image  loading="lazy" 
                                  src="/assets/img/player/bat-ball.png"
                                  className="h-[27px] absolute md:right-2 right-[25px] bottom-0 bg-white rounded-full p-[4px]"
                                  width={27}
                                  height={27}
                                  alt={allrounder.short_name}
                                />
                              </div>
                              <h3 className="text-sm font-semibold text-gray-800">
                                {allrounder.short_name}
                              </h3>
                              <p className="text-xs text-gray-600">
                                All-Rounder
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
        ))}
          </div>
        </div>
      </div>
    </section>
  );
}
