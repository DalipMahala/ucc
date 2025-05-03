"use client";

import React from 'react'
import Image from "next/image";
import Link from 'next/link';
import { useState, useEffect } from "react";
import { urlStringEncode} from "@/utils/utility";
import PlayerImage from "@/app/components/PlayerImage";
import MatchTabs from "./Menu";


interface Squads {
    match_id: number;
  
    matchData:any | null;

    matchUrl :string | null;
    isPointTable: boolean;

  }
export default function Squads({
    match_id,
    matchData,
    matchUrl,
    isPointTable
  }: Squads) {

    match_id;
    const matchDetails = matchData?.match_info;
    const [activeTab, setActiveTab] = useState("tab1");
    
    const teamADetails = matchData?.match_info?.teama;
    const teamBDetails = matchData?.match_info?.teamb;

    const seriesName = matchData?.match_info?.competition?.title+"-"+matchData?.match_info?.competition?.season;

    const teamASquad = matchData?.["match-playing11"]?.teama?.squads;
    const teamBSquad = matchData?.["match-playing11"]?.teamb?.squads;

    const teamASquadBatsmen = teamASquad?.filter(
        (events: { role: string; }) =>
          events.role === "bat" || events.role === "wk"
      );

    const teamASquadBowler = teamASquad?.filter(
        (events: { role: string; }) =>
          events.role === "bowl"
      );

    const teamASquadAll = teamASquad?.filter(
        (events: { role: string; }) =>
          events.role === "all"
      );

      const teamBSquadBatsmen = teamBSquad?.filter(
        (events: { role: string; }) =>
          events.role === "bat" || events.role === "wk"
      );

    const teamBSquadBowler = teamBSquad?.filter(
        (events: { role: string; }) =>
          events.role === "bowl"
      );

    const teamBSquadAll = teamBSquad?.filter(
        (events: { role: string; }) =>
          events.role === "all"
      );

     

    return (
        <section className="lg:w-[1000px] mx-auto md:mb-0 mb-4 px-2 lg:px-0">
            <MatchTabs matchUrl={matchUrl} match_id={match_id} matchDetails={matchDetails} isPointTable={isPointTable}/>

            {teamADetails && teamBDetails &&
                        <div id="squads" className="tab-content">
                <div className="py-2 mb-2">
                    <h3 className="text-1xl font-semibold pl-[3px] border-l-[3px] border-[#1a80f8]">
                        {seriesName}
                    </h3>
                </div>
                <div className="md:grid grid-cols-12 gap-4">
                    <div className="lg:col-span-4 md:col-span-5">
                        <div className="rounded-lg p-2 mb-4 bg-[#ffffff]">
                            <div id="team-buttons" className="text-[14px]">

                                <button
                                    className={`team-btn border-b px-2 mb-1 py-3 w-full font-medium flex items-center ${activeTab === "tab1"
                                            ? "text-[#394351] bg-[#eaeaea] rounded-md"
                                            : "text-[#1c1c1c] bg-[#fcfcfc] rounded-md"
                                        }`}
                                    onClick={() => setActiveTab("tab1")}
                                >
                                    <Image  loading="lazy" 
                                        src={teamADetails.logo_url}
                                        className="mr-3"
                                        width={20} height={20} alt={teamADetails.name}
                                    />
                                    {teamADetails.name}
                                </button>

                                <button
                                    className={`team-btn border-b px-2 mb-1 py-3 w-full font-medium flex items-center ${activeTab === "tab2"
                                            ? "text-[#394351] bg-[#eaeaea] rounded-md"
                                            : "text-[#1c1c1c] bg-[#fcfcfc] rounded-md"
                                        }`}
                                    onClick={() => setActiveTab("tab2")}
                                >
                                    <Image  loading="lazy" 
                                        src={teamBDetails.logo_url}
                                        className="mr-3"
                                        width={20} height={20} alt={teamBDetails.name}
                                    />
                                    {teamBDetails.name}
                                </button>

                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-8 md:col-span-7">
                        {activeTab === "tab1" &&
                            <div id="south-team" className="team-content ">
                                <div className="max-w-7xl mx-auto bg-white rounded-lg p-6">
                                    <div className="flex items-center space-x-4 mb-3">
                                        <Image  loading="lazy" 
                                            src={teamADetails.logo_url}
                                            width={45} height={45} alt={teamADetails.name}
                                            className="h-[45px] rounded-full"
                                        />
                                        <h1 className="text-[16px] font-semibold text-[#000000]">
                                        {teamADetails.name}{" "}
                                            <span className="text-[#586577]">({teamASquad.length} players)</span>
                                        </h1>
                                    </div>
                                    <div className='border-[#E4E9F0] border-b-[1px] w-full'></div>
                                    {/* Categories */}
                                    <div className="space-y-6 mt-3">
                                        {/* Batsman Section */}
                                        <div>
                                            <h2 className="text-1xl font-medium pl-[5px] border-l-[3px] border-[#1a80f8] mb-4">
                                                Batsman
                                            </h2>
                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                                {teamASquadBatsmen?.map((squads:any, index:number) => (
                                                <Link className='border-[1px] border-[##E2E2E2] rounded-md' href={"/player/"+urlStringEncode(squads?.name)+"/"+squads?.player_id}  key={index}>
                                                    <div className="text-center p-4">
                                                        <div className="relative">
                                                        <PlayerImage key={squads?.player_id} player_id={squads?.player_id} width={47} height={47} className="w-[47px] h-[47px] mx-auto rounded-full mb-2" />
                                                       
                                                            <Image  loading="lazy" 
                                                                src="/assets/img/player/bat.png"
                                                                className="h-[23px] absolute md:right-[17px] right-[35px] bottom-0 bg-white rounded-full p-[4px]"
                                                                width={20} height={20} alt=""
                                                            />
                                                        </div>
                                                        <h3 className="text-sm font-medium text-[#217AF7] ">
                                                        {squads.name} {squads.role_str !== '' && squads.role_str !== undefined ? (<span className="text-[#217AF7]">{squads.role_str}</span>):("")}
                                                        </h3>
                                                        <p className="text-xs text-[#586577]">Batsman</p>
                                                    </div>
                                                </Link>
                                                ))}
                                                
                                            </div>
                                        </div>
                                        {/* Bowler Section */}
                                        <div>
                                            <h2 className="text-1xl font-medium pl-[5px] border-l-[3px] border-[#1a80f8] mb-4">
                                                Bowler
                                            </h2>
                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                            {teamASquadBowler?.map((bowler:any, index:number) => (
                                                <Link className='border-[1px] border-[##E2E2E2] rounded-md' href={"/player/"+urlStringEncode(bowler?.name)+"/"+bowler?.player_id}  key={index}>
                                                    <div className="text-center p-4">
                                                        <div className="relative">
                                                        <PlayerImage key={bowler?.player_id} player_id={bowler?.player_id} width={47} height={47} className="w-[47px] h-[47px] mx-auto rounded-full mb-2" />
                                                       
                                                            <Image  loading="lazy" 
                                                                src="/assets/img/player/ball.png"
                                                                className="h-[19px] w-[19px] absolute md:right-[19px] right-[35px] bottom-0 bg-white rounded-full p-[4px]"
                                                                width={19} height={19} alt=""
                                                            />
                                                        </div>
                                                        <h3 className="text-sm font-medium text-[#211726]">
                                                        {bowler.name}
                                                        </h3>
                                                        <p className="text-xs text-[#586577]">Bowler</p>
                                                    </div>
                                                </Link>
                                            ))}
                                                
                                            </div>
                                        </div>
                                        {/* All-Rounder Section */}
                                        <div>
                                            <h2 className="text-1xl font-medium pl-[5px] border-l-[3px] border-[#1a80f8] mb-4">
                                                All-Rounder
                                            </h2>
                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                            {teamASquadAll?.map((allrounder:any, index:number) => (
                                                <Link className='border-[1px] border-[##E2E2E2] rounded-md' href={"/player/"+urlStringEncode(allrounder?.name)+"/"+allrounder?.player_id}  key={index}>
                                                    <div className="text-center p-4">
                                                        <div className="relative">
                                                        <PlayerImage key={allrounder?.player_id} player_id={allrounder?.player_id} width={47} height={47} className="w-[47px] h-[47px] mx-auto rounded-full mb-2" />
                                                            <Image  loading="lazy" 
                                                                src="/assets/img/player/bat-ball.png"
                                                                className="h-[23px] md:w-[23px] w-[23px] absolute md:right-[15px] right-[32px] bottom-0 bg-white rounded-full p-[4px]"
                                                                width={23} height={23} alt=""
                                                            />
                                                        </div>
                                                        <h3 className="text-sm font-medium text-[#211726]">
                                                        {allrounder.name}
                                                        </h3>
                                                        <p className="text-xs text-[#586577]">All-Rounder</p>
                                                    </div>
                                                </Link>
                                            ))}
                                               
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }

                        {activeTab === "tab2" && 
                        <div id="south-team" className="team-content ">
                        <div className="max-w-7xl mx-auto bg-white rounded-lg p-6">
                            <div className="flex items-center space-x-4 mb-3">
                                <Image  loading="lazy" 
                                    src={teamBDetails.logo_url}
                                    width={45} height={45} alt={teamBDetails.name}
                                    className="h-[45px] rounded-full"
                                />
                                <h1 className="text-[16px] font-semibold text-[#000000]">
                                {teamBDetails.name}{" "}
                                    <span className="text-[#586577]">({teamBSquad.length} players)</span>
                                </h1>
                            </div>

                            <div className='border-[#E4E9F0] border-b-[1px] w-full'></div>
                            {/* Categories */}
                            <div className="space-y-6 mt-3">
                                        {/* Batsman Section */}
                                        <div>
                                            <h2 className="text-1xl font-medium pl-[5px] border-l-[3px] border-[#1a80f8] mb-4">
                                                Batsman
                                            </h2>
                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                                {teamBSquadBatsmen?.map((squads:any, index:number) => (
                                                <Link className='border-[1px] border-[##E2E2E2] rounded-md' href={"/player/"+urlStringEncode(squads?.name)+"/"+squads?.player_id}  key={index}>
                                                    <div className="text-center p-4">
                                                        <div className="relative">
                                                        <PlayerImage key={squads?.player_id} player_id={squads?.player_id} width={47} height={47} className="w-[47px] h-[47px] mx-auto rounded-full mb-2" />
                                                            <Image  loading="lazy" 
                                                                src="/assets/img/player/bat.png"
                                                                className="h-[23px] absolute md:right-[17px] right-[35px] bottom-0 bg-white rounded-full p-[4px]"
                                                                width={20} height={20} alt=""
                                                            />
                                                        </div>
                                                        <h3 className="text-sm font-medium text-[#217AF7] ">
                                                        {squads.name} {squads.role_str !== '' && squads.role_str !== undefined ? (<span className="text-[#217AF7]">{squads.role_str}</span>):("")}
                                                        </h3>
                                                        <p className="text-xs text-[#586577]">Batsman</p>
                                                    </div>
                                                </Link>
                                                ))}
                                                
                                            </div>
                                        </div>
                                        {/* Bowler Section */}
                                        <div>
                                            <h2 className="text-1xl font-medium pl-[5px] border-l-[3px] border-[#1a80f8] mb-4">
                                                Bowler
                                            </h2>
                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                            {teamBSquadBowler?.map((bowler:any, index:number) => (
                                                <Link className='border-[1px] border-[##E2E2E2] rounded-md' href={"/player/"+urlStringEncode(bowler?.name)+"/"+bowler?.player_id}  key={index}>
                                                    <div className="text-center p-4">
                                                        <div className="relative">
                                                        <PlayerImage key={bowler?.player_id} player_id={bowler?.player_id} width={47} height={47} className="w-[47] h-[47] mx-auto rounded-full mb-2" />
                                                            <Image  loading="lazy" 
                                                                src="/assets/img/player/ball.png"
                                                                className="h-[19px] w-[19px] absolute md:right-[19px] right-[35px] bottom-0 bg-white rounded-full p-[4px]"
                                                                width={19} height={19} alt=""
                                                            />
                                                        </div>
                                                        <h3 className="text-sm font-medium text-[#211726]">
                                                        {bowler.name}
                                                        </h3>
                                                        <p className="text-xs text-[#586577]">Bowler</p>
                                                    </div>
                                                </Link>
                                            ))}
                                                
                                            </div>
                                        </div>
                                        {/* All-Rounder Section */}
                                        <div>
                                            <h2 className="text-1xl font-medium pl-[5px] border-l-[3px] border-[#1a80f8] mb-4">
                                                All-Rounder
                                            </h2>
                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                            {teamBSquadAll?.map((allrounder:any, index:number) => (
                                                <Link className='border-[1px] border-[##E2E2E2] rounded-md' href={"/player/"+urlStringEncode(allrounder.name)+"/"+allrounder.player_id}  key={index}>
                                                    <div className="text-center p-4 rounded-md ">
                                                        <div className="relative">
                                                        <PlayerImage key={allrounder?.player_id} player_id={allrounder?.player_id} width={47} height={47} className="w-[47] h-[47] mx-auto rounded-full mb-2" />
                                                            <Image  loading="lazy" 
                                                                src="/assets/img/player/bat-ball.png"
                                                                className="h-[23px] md:w-[23px] w-[23px] absolute md:right-[15px] right-[32px] bottom-0 bg-white rounded-full p-[4px]"
                                                                width={23} height={23} alt=""
                                                            />
                                                        </div>
                                                        <h3 className="text-sm font-medium text-[#211726]">
                                                        {allrounder.name}
                                                        </h3>
                                                        <p className="text-xs text-[#586577]">All-Rounder</p>
                                                    </div>
                                                </Link>
                                            ))}
                                               
                                            </div>
                                        </div>
                                    </div>
                        </div>
                    </div>
                        
                        }

                    </div>
                </div>
            </div>
  }

        </section>
    )
}
