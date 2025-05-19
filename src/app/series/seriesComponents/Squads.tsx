"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { urlStringEncode } from "@/utils/utility";
import PlayerImage from "@/app/components/PlayerImage";
import TabMenu from "./menu";
import { IoIosArrowForward } from "react-icons/io";
import { HiOutlineXMark } from "react-icons/hi2";

interface Squad {
  urlString: string;
  seriesInfo: any;
  isPointTable: boolean;
  status: boolean;
}
interface Player {
  pid: number;
}

interface Team {
  players?: Player[];
}
export default function Squad({ urlString, seriesInfo, isPointTable, status }: Squad) {
  const [activeTab, setActiveTab] = useState("tab0");
  const seriesName = seriesInfo?.abbr;
  const seriesFormat = seriesInfo?.game_format;
  const uniqueFormats: any[] = [...new Set(seriesInfo?.rounds.map((round: any) => round.match_format))];
  const cid = seriesInfo.cid;
  const [squads, setSquads] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [activeSquad, setActiveSquad] = useState("Batsman");

  const handleClick = (squadtab: React.SetStateAction<string>) => {
    setActiveSquad(squadtab);
   
  };
  


  useEffect(() => {
    async function fetchSquads() {
      try {
        const response = await fetch("/api/series/SeriesSquads", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_TOKEN}`,
          },
          body: JSON.stringify({ cid: seriesInfo.cid }),
        });
        if (!response.ok) {
          console.error(
            `Error: API returned ${response.status} for CID ${cid}`
          );
          return null; // Skip failed requests
        }

        const result = await response.json();
        let items = result?.data?.squads || [];
        setSquads(items);
      } catch (error) {
        console.error("Error fetching matches:", error);
      }
    }
    fetchSquads()
  }, [cid]);

  const [playerUrls, setPlayerUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    const getAllPlayerIds = (squads: Team[]) => {
      const allIds = [
        ...squads.flatMap(team =>
          team?.players?.map((player: { pid: any; }) => player.pid)
        )];
      return [...new Set(allIds)]; // Deduplicate
    };
    const fetchPlayerUrls = async () => {
      const ids = getAllPlayerIds(squads);
      if (ids.length === 0) return;
      const res = await fetch('/api/player-urls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_TOKEN}`, },
        body: JSON.stringify({ ids }),
      });
      const data = await res.json();
      setPlayerUrls(data);
    };

    fetchPlayerUrls();
  }, [squads]);

  return (
    <section className="lg:w-[1000px] mx-auto md:mb-0 mb-4 px-2 lg:px-0">
      <TabMenu urlString={urlString} isPointTable={isPointTable} status={status} />
      <div id="squads" className="tab-content">
        <div className="py-2 mb-2">
          <h2 className="text-1xl font-semibold pl-[3px] border-l-[3px] border-[#1a80f8]">
            {seriesName} All Team Squads
          </h2>
        </div>
        <div className="md:grid grid-cols-12 gap-4">
          <div className="lg:col-span-4 md:col-span-5">
            {/* desktop view start */}
            <div className="md:block hidden rounded-lg p-2 mb-4 bg-[#ffffff]">
              <div id="team-buttons" className="">
                {squads?.map((teamslist: any, index: number) => (
                  <button
                    key={index}
                    className={`team-btn px-2 mb-1 py-3 w-full font-medium hover:text-[#1a80f8] hover:bg-[#ecf2fd] flex items-center border-b-[1px] ${activeTab === "tab" + index
                      ? "text-[#1a80f8] bg-[#ecf2fd] rounded-md"
                      : "text-[#394351] bg-[#ffffff] "
                      }`}
                    onClick={() => setActiveTab("tab" + index)}
                  >
                    <Image loading="lazy"
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
            {/* desktop view end */}

            {/* mobile view start */}
            <div className="md:hidden rounded-lg p-2 mb-4 bg-[#ffffff]">
              <div id="team-buttons" className="">
                {squads?.map((teamslist: any, index: number) => (
                  <div key={index} className={`team-btn px-2 mb-1 py-3 w-full font-medium hover:text-[#1a80f8] hover:bg-[#ecf2fd] flex justify-between items-center border-b-[1px] ${activeTab === "tab" + index
                    ? "text-[#394351] bg-[#ffffff]"
                    : "text-[#394351] bg-[#ffffff] "
                    }`}>
                    <button
                      
                      className="flex items-center"
                      onClick={() => {
                        setActiveTab("tab" + index);
                        setIsModalOpen(true);
                        setActiveSquad("Batsman");
                      }}
                    >
                      <Image loading="lazy"
                        src={teamslist?.team?.logo_url}
                        className="mr-3"
                        width={30}
                        height={30}
                        alt={teamslist?.team?.alt_name}
                      />
                      {teamslist?.team?.alt_name}
                    </button>
                    <IoIosArrowForward />
                  </div>
                ))}
              </div>
            </div>
            {/* mobile view end */}

          </div>


          {/* mobile modal start */}

          {isModalOpen && (
            <div
              className="fixed inset-0 z-[99999999] flex items-end justify-center bg-black bg-opacity-50"
              onClick={() => setIsModalOpen(false)} // click outside to close
            >
              <div
                className="bg-white w-full animate-slideUp h-[100%] fixed top-0 bottom-0 overflow-auto"
                onClick={(e) => e.stopPropagation()} // prevent modal close on inner click
              >


                {squads?.map((teamslist: any, index: number) => (

                  activeTab === "tab" + index && (
                    <div id="south-team" className="team-content " key={index}>
                      <div className="mx-auto bg-white p-4">
                        <div className="flex justify-between items-center mb-3">
                          <div className="flex items-center space-x-4 ">
                            <Image loading="lazy"
                              src={teamslist?.team.logo_url}
                              width={45}
                              height={45}
                              alt={teamslist?.team.abbr}
                              className="h-[45px] rounded-full"
                            />

                            <h2 className="text-[16px] font-semibold text-gray-800">
                              {teamslist?.team.abbr}{" "}
                              <span className="text-gray-500">
                                ({teamslist?.players?.length} players)
                              </span>
                            </h2>
                          </div>
                          <button
                            className=""
                            onClick={() => setIsModalOpen(false)}
                          >
                            <HiOutlineXMark className="text-[25px] font-bold" />
                          </button>
                        </div>

                        <div className='border-[#E4E9F0] border-b-[1px] w-full'></div>


                        <div>
                          {/* Buttons */}
                          <div className="flex space-x-4 mt-3">
                            {["Batsman", "Bowler", "All-Rounder"].map((squadtab) => (
                              <button
                                key={squadtab}
                                onClick={() => handleClick(squadtab)}
                                className={`font-medium py-1 md:px-7 px-6 whitespace-nowrap border-[1px] border-[#E5E8EA] rounded-full ${activeSquad === squadtab ? 'bg-[#081736] text-white' : 'bg-white text-black'
                                  }`}
                              >
                                {squadtab}
                              </button>
                            ))}
                          </div>

                          <div className="mt-4">
                            {activeSquad === "Batsman" &&

                              <div>
                                <h3 className="text-1xl font-semibold pl-[5px] border-l-[3px] border-[#1a80f8] mb-4">
                                  Batsman
                                </h3>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                  {teamslist?.players?.map((squads: any, index: number) => (
                                    (squads.playing_role === 'bat' || squads.playing_role === 'wk') &&
                                    <Link className="rounded-md border-[1px] border-[##E2E2E2]"
                                      href={
                                        "/player/" +
                                        playerUrls[squads?.pid]
                                      }
                                      key={index}
                                    >
                                      <div className="text-center p-4 ">
                                        <div className="relative">
                                          <PlayerImage key={squads?.pid} player_id={squads?.pid} height={47} width={47} className="w-[47px] h-[47px] mx-auto rounded-full mb-2" />

                                          <Image loading="lazy"
                                            src="/assets/img/player/bat.png"
                                            className="h-[23px] absolute md:right-[17px] right-[35px] bottom-0 bg-white rounded-full p-[4px]"
                                            width={20}
                                            height={20}
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

                            }
                            {activeSquad === "Bowler" &&

                              <div>
                                <h3 className="text-1xl font-semibold pl-[5px] border-l-[3px] border-[#1a80f8] mb-4">
                                  Bowler
                                </h3>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                  {teamslist?.players?.map((bowler: any, index: number) => (
                                    bowler.playing_role === 'bowl' &&
                                    <Link className="rounded-md border-[1px] border-[##E2E2E2]"
                                      href={
                                        "/player/" +
                                        playerUrls[bowler?.pid]
                                      }
                                      key={index}
                                    >
                                      <div className="text-center p-4 ">
                                        <div className="relative">
                                          <PlayerImage key={bowler?.pid} player_id={bowler?.pid} height={47} width={47} className="w-[47px] h-[47px] mx-auto rounded-full mb-2" />
                                          <Image loading="lazy"
                                            src="/assets/img/player/ball.png"
                                            className="h-[19px] w-[19px] absolute md:right-[19px] right-[35px] bottom-0 bg-white rounded-full p-[4px]"
                                            width={19}
                                            height={19}
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

                            }
                            {activeSquad === "All-Rounder" &&

                              <div>
                                <h3 className="text-1xl font-semibold pl-[5px] border-l-[3px] border-[#1a80f8] mb-4">
                                  All-Rounder
                                </h3>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                  {teamslist?.players?.map((allrounder: any, index: number) => (
                                    allrounder.playing_role === 'all' &&
                                    <Link className="rounded-md border-[1px] border-[##E2E2E2]"
                                      href={
                                        "/player/" +
                                        playerUrls[allrounder?.pid]
                                      }
                                      key={index}
                                    >
                                      <div className="text-center p-4">
                                        <div className="relative">
                                          <PlayerImage key={allrounder?.pid} player_id={allrounder?.pid} height={47} width={47} className="w-[47px] h-[47px] mx-auto rounded-full mb-2" />
                                          <Image loading="lazy"
                                            src="/assets/img/player/bat-ball.png"
                                            className="h-[23px] md:w-[23px] w-[23px] absolute md:right-[15px] right-[32px] bottom-0 bg-white rounded-full p-[4px]"
                                            width={23}
                                            height={23}
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

                            }
                          </div>
                        </div>

                      </div>
                    </div>
                  )
                ))}

              </div>
            </div>
          )}

          {/* mobile modal end */}



          <div className="lg:col-span-8 md:col-span-7 hidden md:block">
            {squads?.map((teamslist: any, index: number) => (

              activeTab === "tab" + index && (
                <div id="south-team" className="team-content " key={index}>
                  <div className="max-w-7xl mx-auto bg-white rounded-lg p-6">
                    <div className="flex items-center space-x-4 mb-3">
                      <Image loading="lazy"
                        src={teamslist?.team.logo_url}
                        width={45}
                        height={45}
                        alt={teamslist?.team.abbr}
                        className="h-[45px] rounded-full"
                      />

                      <h2 className="text-[16px] font-semibold text-gray-800">
                        {teamslist?.team.abbr}{" "}
                        <span className="text-gray-500">
                          ({teamslist?.players?.length} players)
                        </span>
                      </h2>
                    </div>

                    <div className='border-[#E4E9F0] border-b-[1px] w-full'></div>

                    <div className="space-y-6 mt-3">
                      <div>
                        <h3 className="text-1xl font-semibold pl-[5px] border-l-[3px] border-[#1a80f8] mb-4">
                          Batsman
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                          {teamslist?.players?.map((squads: any, index: number) => (
                            (squads.playing_role === 'bat' || squads.playing_role === 'wk') &&
                            <Link className="rounded-md border-[1px] border-[##E2E2E2]"
                              href={
                                "/player/" +
                                playerUrls[squads?.pid]
                              }
                              key={index}
                            >
                              <div className="text-center p-4 ">
                                <div className="relative">
                                  <PlayerImage key={squads?.pid} player_id={squads?.pid} height={47} width={47} className="w-[47px] h-[47px] mx-auto rounded-full mb-2" />

                                  <Image loading="lazy"
                                    src="/assets/img/player/bat.png"
                                    className="h-[23px] absolute md:right-[17px] right-[35px] bottom-0 bg-white rounded-full p-[4px]"
                                    width={20}
                                    height={20}
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
                        <h3 className="text-1xl font-semibold pl-[5px] border-l-[3px] border-[#1a80f8] mb-4">
                          Bowler
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                          {teamslist?.players?.map((bowler: any, index: number) => (
                            bowler.playing_role === 'bowl' &&
                            <Link className="rounded-md border-[1px] border-[##E2E2E2]"
                              href={
                                "/player/" +
                                playerUrls[bowler?.pid]
                              }
                              key={index}
                            >
                              <div className="text-center p-4 ">
                                <div className="relative">
                                  <PlayerImage key={bowler?.pid} player_id={bowler?.pid} height={47} width={47} className="w-[47px] h-[47px] mx-auto rounded-full mb-2" />
                                  <Image loading="lazy"
                                    src="/assets/img/player/ball.png"
                                    className="h-[19px] w-[19px] absolute md:right-[19px] right-[35px] bottom-0 bg-white rounded-full p-[4px]"
                                    width={19}
                                    height={19}
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
                        <h3 className="text-1xl font-semibold pl-[5px] border-l-[3px] border-[#1a80f8] mb-4">
                          All-Rounder
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                          {teamslist?.players?.map((allrounder: any, index: number) => (
                            allrounder.playing_role === 'all' &&
                            <Link className="rounded-md border-[1px] border-[##E2E2E2]"
                              href={
                                "/player/" +
                                playerUrls[allrounder?.pid]
                              }
                              key={index}
                            >
                              <div className="text-center p-4">
                                <div className="relative">
                                  <PlayerImage key={allrounder?.pid} player_id={allrounder?.pid} height={47} width={47} className="w-[47px] h-[47px] mx-auto rounded-full mb-2" />
                                  <Image loading="lazy"
                                    src="/assets/img/player/bat-ball.png"
                                    className="h-[23px] md:w-[23px] w-[23px] absolute md:right-[15px] right-[32px] bottom-0 bg-white rounded-full p-[4px]"
                                    width={23}
                                    height={23}
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
