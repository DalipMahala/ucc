"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { urlStringEncode } from "@/utils/utility";
import PlayerImage from "@/app/components/PlayerImage";

interface Squads {
  teamPlayers: any | null;
  pointTables: any | null;
  cid: number;
}

// interface Team {
//   players?: Player[];
// }
export default function Squads({
  teamPlayers,
  pointTables,
  cid
}: Squads) {
  const teams = teamPlayers[0]?.team;
  const players = teamPlayers[0]?.players?.["t20"];


   const [squads, setSquads] = useState([]);
    useEffect(() => {
      async function fetchSquads() {
        try {
          const response = await fetch("/api/series/SeriesSquads", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_TOKEN}`,
            },
            body: JSON.stringify({ cid: cid }),
          });
          if (!response.ok) {
            console.error(
              `Error: API returned ${response.status} for CID ${cid}`
            );
            return null; // Skip failed requests
          }
  
          const result = await response.json();
          let items = result?.data?.squads || [];
          const teamSquad = items.find((sd: any) => [sd?.team_id,].includes(Number(teams?.tid )) );
          setSquads(teamSquad?.players);
        } catch (error) {
          console.error("Error fetching matches:", error);
        }
      }
      fetchSquads()
    }, [cid]);

 
 

  const [playerUrls, setPlayerUrls] = useState<Record<string, string>>({});
  
    useEffect(() => {
      const getAllPlayerIds = (squads: any[]) => {
        const allIds = [
          ...squads.flatMap((team: {  pid: any }) => team.pid)
          ];
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
    
  const teamASquadBatsmen = squads?.filter(
    (events: { playing_role: string }) => events.playing_role === "bat" || events.playing_role === "wk"
  );
  let teamASquadBowler: any[] = [];
  let teamASquadAll: any[] = [];
  if (squads?.length > 0) {
     teamASquadBowler = squads?.filter(
      (events: { playing_role: string }) => events.playing_role === "bowl"
    );

     teamASquadAll = squads?.filter(
      (events: { playing_role: string }) => events.playing_role === "all"
    );
  }

  return (
    <section className="lg:w-[1000px] mx-auto md:mb-0 mb-4 px-2 lg:px-0">
      <div id="tabs" className="my-4">
        <div className="flex text-1xl space-x-8 p-2 bg-[#ffffff] rounded-lg overflow-auto">
          <Link
            href={
              "/ipl/" +
              pointTables?.season +
              "/" +
              urlStringEncode(teams?.title) +
              "/" +
              teams?.tid
            }
          >
            <button className="font-medium py-2 px-3 whitespace-nowrap ">
              Overview
            </button>
          </Link>
          <Link
            href={
              "/ipl/" +
              pointTables?.season +
              "/" +
              urlStringEncode(teams?.title) +
              "/" +
              teams?.tid +
              "/schedule-results"
            }
          >
            <button className="font-medium py-2 px-3 whitespace-nowrap ">
              Schedule & Results
            </button>
          </Link>
          <Link
            href={
              "/ipl/" +
              pointTables?.season +
              "/" +
              urlStringEncode(teams?.title) +
              "/" +
              teams?.tid +
              "/squads"
            }
          >
            <button className="font-medium py-2 px-3 whitespace-nowrap  bg-[#1A80F8] text-white rounded-md">
              Squads
            </button>
          </Link>
          <Link
            href={
              "/series/" +
              urlStringEncode(pointTables?.title + "-" + pointTables?.season) +
              "/" +
              pointTables?.cid +
              "/points-table"
            }
          >
            <button className="font-medium py-2 px-3 whitespace-nowrap">
              Points Table
            </button>
          </Link>
          <Link
            href={
              "/series/" +
              urlStringEncode(pointTables?.title + "-" + pointTables?.season) +
              "/" +
              pointTables?.cid +
              "/news"
            }
          >
            <button className="font-medium py-2 px-3 whitespace-nowrap">
              News
            </button>
          </Link>
          <Link
            href={
              "/series/" +
              urlStringEncode(pointTables?.title + "-" + pointTables?.season) +
              "/" +
              pointTables?.cid +
              "/stats/batting-most-run"
            }
          >
            <button className="font-medium py-2 px-3 whitespace-nowrap">
              Stats
            </button>
          </Link>
        </div>
      </div>
      {players && (
        <div id="squads" className="tab-content">
          <div className="py-2 mb-2">
            <h2 className="text-1xl font-semibold pl-[3px] border-l-[3px] border-[#1a80f8] uppercase">
              {/* {pointTables?.title} {teams.alt_name} {pointTables?.season} Squads */}
              {teams.alt_name} {pointTables?.season} Squads
            </h2>
          </div>
          <div className="md:grid grid-cols-12 gap-4">
            <div className="lg:col-span-12">
              <div id="south-team" className="team-content ">
                <div className="max-w-7xl mx-auto bg-white rounded-lg p-6">
                  <div className="flex items-center space-x-4 mb-6">
                    <Image
                      loading="lazy"
                      src={teams?.logo_url}
                      width={45}
                      height={45}
                      alt={teams.alt_name}
                      className="h-[45px] rounded-full"
                    />
                    <h1 className="text-[16px] font-semibold text-gray-800">
                      {teams.alt_name}{" "}
                      <span className="text-gray-500">
                        ({squads?.length} players)
                      </span>
                    </h1>
                  </div>
                  {/* Categories */}
                  <div className="space-y-6">
                    {/* Batsman Section */}
                    <div>
                      <h2 className="text-1xl font-semibold pl-[5px] border-l-[3px] border-[#1a80f8] mb-4">
                        Batsman
                      </h2>
                      <div className="grid grid-cols-2 sm:grid-cols-6 gap-6">
                        {teamASquadBatsmen?.map(
                          (squads: any, index: number) => (
                            <Link className="rounded-md border-[1px] border-[##E2E2E2]"
                              href={
                                "/player/" +
                                playerUrls[squads?.pid]
                              }
                              key={index}
                            >
                              <div className="text-center p-4 ">
                                <div className="relative">
                                  <PlayerImage
                                    key={squads?.pid}
                                    player_id={squads?.pid}
                                    width={47}
                                    height={47}
                                    className="w-[47px] h-[47px] mx-auto rounded-full mb-2"
                                  />

                                  <Image
                                    loading="lazy"
                                    src="/assets/img/player/bat.png"
                                    className="h-[23px] absolute md:right-[17px] right-[35px] bottom-0 bg-white rounded-full p-[4px]"
                                    width={23}
                                    height={23}
                                    alt="1"
                                  />
                                </div>
                                <h3 className="text-sm font-semibold ">
                                  {squads.title}
                                </h3>
                                <p className="text-xs text-gray-600">Batsman</p>
                              </div>
                            </Link>
                          )
                        )}
                      </div>
                    </div>
                    {/* Bowler Section */}
                    <div>
                      <h2 className="text-1xl font-semibold pl-[5px] border-l-[3px] border-[#1a80f8] mb-4">
                        Bowler
                      </h2>
                      <div className="grid grid-cols-2 sm:grid-cols-6 gap-6">
                        {teamASquadBowler.length > 0 && teamASquadBowler?.map((bowler: any, index: number) => (
                          <Link className="rounded-md border-[1px] border-[##E2E2E2]"
                            href={
                              "/player/" +
                              playerUrls[bowler?.pid]
                            }
                            key={index}
                          >
                            <div className="text-center p-4 ">
                              <div className="relative">
                                <PlayerImage
                                  key={bowler?.pid}
                                  player_id={bowler?.pid}
                                  width={47}
                                  height={47}
                                  className="w-[47px] h-[47px] mx-auto rounded-full mb-2"
                                />

                                <Image
                                  loading="lazy"
                                  src="/assets/img/player/ball.png"
                                  className="h-[20px] absolute md:right-[17px] right-[35px] bottom-0 bg-white rounded-full p-[4px]"
                                  width={20}
                                  height={20}
                                  alt="1"
                                />
                              </div>
                              <h3 className="text-sm font-semibold text-gray-800">
                                {bowler.title}
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
                      <div className="grid grid-cols-2 sm:grid-cols-6 gap-6">
                        {teamASquadAll.length > 0 && teamASquadAll?.map(
                          (allrounder: any, index: number) => (
                            <Link className="rounded-md border-[1px] border-[##E2E2E2]"
                              href={
                                "/player/" +
                                playerUrls[allrounder?.pid]
                              }
                              key={index}
                            > 
                              <div className="text-center p-4">
                                <div className="relative">
                                  <PlayerImage
                                    key={allrounder?.pid}
                                    player_id={allrounder?.pid}
                                    width={47}
                                    height={47}
                                    className="w-[47px] h-[47px] mx-auto rounded-full mb-2"
                                  />
                                  <Image
                                    loading="lazy"
                                    src="/assets/img/player/bat-ball.png"
                                    className="h-[23px] absolute md:right-[17px] right-[35px] bottom-0 bg-white rounded-full p-[4px]"
                                    width={23}
                                    height={23}
                                    alt="1"
                                  />
                                </div>
                                <h3 className="text-sm font-semibold text-gray-800">
                                  {allrounder.title}
                                </h3>
                                <p className="text-xs text-gray-600">
                                  All-Rounder
                                </p>
                              </div>
                            </Link>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}


