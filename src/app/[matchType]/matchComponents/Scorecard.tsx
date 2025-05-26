"use client";
import React, { useState, useEffect } from 'react'
import Image from "next/image";
import Link from 'next/link';
import eventEmitter from "@/utils/eventEmitter";
import { urlStringEncode } from "@/utils/utility";
import PlayerImage from "@/app/components/PlayerImage";
import MatchTabs from "./Menu";

interface Scorecard {
  match_id: number;

  matchData: any | null;

  // matchLast:any | null;

  matchStates: any | null;

  matchUrl: string | null;
  isPointTable: boolean;
}

function getPlayerRecord(allplayers: any, pid: number) {
  const pData = allplayers?.find((player: { pid: number; }) => Number(player.pid) === pid);
  const prole = pData?.playing_role === 'bowl' ? 'Bowler' : pData?.playing_role === 'bat' ? 'Batsman' : pData?.playing_role === 'wk' ? 'Wicket Keeper' : 'All Rounder';
  return prole;
}
export default function Scorecard({
  match_id,
  matchData,
  // matchLast,
  matchStates,
  matchUrl,
  isPointTable
}: Scorecard) {

  const matchDetails = matchData?.match_info;
  const manOfTheMatch = matchData?.man_of_the_match;
  const [matchLiveData, setmatchLiveData] = useState(matchData);


  const handleMatchData = (data: any) => {
    if (data?.match_id == match_id) {
      setmatchLiveData(data); // ✅ Update only when new data is received
    }
  };
  eventEmitter.off("matchLiveData", handleMatchData);
  eventEmitter.on("matchLiveData", handleMatchData);
  // eventEmitter.removeListener("matchData", handleMatchData);

  let matchscorecard = matchLiveData?.scorecard?.innings;
  const [openHeading, setOpenHeading] = useState<number>(matchscorecard.length ? matchscorecard.length - 1 : 0);

  const handleToggle = (index: number) => {
    // console.log("toggle",index);
    setOpenHeading(openHeading === index ? 0 : index);
  };
  const tabIndex = openHeading;



  let matchinning = matchLiveData?.scorecard?.innings[tabIndex];
  let batsman = matchinning?.batsmen;
  let bowlers = matchinning?.bowlers;
  let fows = matchinning?.fows;
  let yetTobat = matchinning?.did_not_bat;
  let allPlayers = matchLiveData?.players;


  const partnership = matchStates?.innings[tabIndex]?.statistics?.partnership;
  const players = matchStates?.players;


  // const liveData = matchLiveData;

  // console.log("partnership",allPlayers );

  if (matchLiveData !== undefined && matchLiveData?.match_id == match_id && matchLiveData?.scorecard?.innings[tabIndex] !== undefined && matchLiveData?.scorecard?.innings[tabIndex] !== '') {
    // console.log(tabIndex, "new",matchLiveData);    
    matchData = matchLiveData;
    matchscorecard = matchLiveData?.scorecard?.innings;
    matchinning = matchLiveData?.scorecard?.innings[tabIndex];
    batsman = matchinning?.batsmen;
    bowlers = matchinning?.bowlers;
    fows = matchinning?.fows;
    yetTobat = matchinning?.did_not_bat;
    allPlayers = matchLiveData?.players;
    // let currPartnership = matchinning.current_partnership;

  }

  const [playerUrls, setPlayerUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    const getAllPlayerIds = () => {
      // Safely get IDs from each potentially undefined array
      const allIds = [
        ...(batsman?.map((item: { batsman_id: any; }) => item?.batsman_id) || []),
        ...(bowlers?.map((item: { bowler_id: any; }) => item?.bowler_id) || []),
        ...(yetTobat?.map((item: { player_id: any; }) => item?.player_id) || []),
        ...(fows?.map((item: { batsman_id: any; }) => item?.batsman_id) || []),
        ...(partnership?.batsmen?.map((item: { batsman_id: any; }) => item?.batsman_id) || []),
        matchData?.man_of_the_match?.pid
      ].filter(Boolean); // Remove any undefined/null IDs

      return [...new Set(allIds)]; // Deduplicate
    };
    // console.log("ids",getAllPlayerIds());
    const fetchPlayerUrls = async () => {
      const ids = getAllPlayerIds();
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
  }, [batsman, bowlers, yetTobat, fows, partnership]);



  return (
    <div className="lg:w-[1000px] mx-auto md:mb-0 mb-4 px-2 lg:px-0">
      <MatchTabs matchUrl={matchUrl} match_id={match_id} matchDetails={matchDetails} isPointTable={isPointTable} />
      <div id="tab-content">
        <div id="scorecard" className="tab-content cust-box-click-container">
          <div className="flex items-center gap-4 md:mb-4 mb-2 md:pb-0 pb-2 font-medium text-[14px] whitespace-nowrap overflow-auto">
            {
              matchscorecard?.map((scorecard: any, index: number) => (
                <button key={index}
                  className={`cust-box-click-button leading-[22px] ${openHeading === index ? "bg-[#081736] text-white" : "bg-[#ffffff] text-[#6A7586]"}  font-medium px-5 py-1 rounded-full`}
                  onClick={() => handleToggle(index)} >
                  {scorecard['short_name']}
                </button>
              ))}
          </div>


          {manOfTheMatch?.pid !== undefined &&
            <div className="rounded-lg bg-[#ffffff] p-4 mb-4 md:hidden">
              
                <Link href={"/player/" + playerUrls[manOfTheMatch?.pid]}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 ">
                      

                        <PlayerImage key={manOfTheMatch?.pid} player_id={manOfTheMatch?.pid} height={50} width={50} className="rounded-lg" />

                     
                      <div className="font-medium">
                        <h2 className="text-1xl font-semibold hover:text-[#1a80f8]">{manOfTheMatch?.name}</h2>
                        <p className="text-[#6A7586] font-normal"> Man of the match </p>
                      </div>
                    </div>
                    <Image
                      src="/assets/img/home/win.png"
                      width={26}
                      height={30}
                      style={{ width: "26px", height: "30px" }}
                      alt=""
                      loading="lazy"
                    />
                  </div>
                </Link>
              
            </div>
          }



          
            <div className="cust-box-click-content cust-box-click-ind1stinning mt-4 md:grid grid-cols-12 gap-4">
              <div className="lg:col-span-8 md:col-span-7">
                <div className="rounded-t-lg bg-[#ffffff] border-b-[1px] p-4 flex justify-between items-center text-[15px]">
                  
                    
                      <h2 className="mx-2 font-semibold">Total Score</h2>
                    
                      <p className="mx-2 font-semibold ">
                        {" "}
                        {matchscorecard?.[tabIndex]?.equations?.runs}-{matchscorecard?.[tabIndex]?.equations?.wickets} <span className="text-[#586577]">({matchscorecard?.[tabIndex]?.equations?.overs})</span>
                      </p>
                   
                 
                </div>



                <div className="rounded-b-lg bg-[#ffffff] mb-4 p-4">
                  <h2 className="text-1xl font-semibold mb-3 pl-[7px] border-l-[3px] border-[#229ED3]">
                    Batting
                  </h2>
                  
                    <div className=" overflow-auto relative overflow-x-auto  [&::-webkit-scrollbar] [&::-webkit-scrollbar]:h-[5px] 
                              [&::-webkit-scrollbar-track]:bg-gray-100 
                              [&::-webkit-scrollbar-thumb]:bg-[#DFE9F6] 
                               dark:[&::-webkit-scrollbar-track]:bg-neutral-700 
                                 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
                      <table className="w-full text-sm text-left text-gray-600 whitespace-nowrap">
                        <thead className="bg-gray-100">
                          <tr>
                            <th
                              scope="col"
                              className="md:px-4 px-2 py-2 font-medium text-gray-700"
                            >
                              Batter
                            </th>
                            <th
                              scope="col"
                              className="md:px-4 py-2 font-medium text-gray-700 hidden md:block"
                            ></th>
                            <th
                              scope="col"
                              className="md:px-4 px-2 py-2 font-medium text-gray-700"
                            >
                              R
                            </th>
                            <th
                              scope="col"
                              className="md:px-4 px-2 py-2 font-medium text-gray-700"
                            >
                              B
                            </th>
                            <th
                              scope="col"
                              className="md:px-4 px-2 py-2 font-medium text-gray-700"
                            >
                              4s
                            </th>
                            <th
                              scope="col"
                              className="md:px-4 px-2 py-2 font-medium text-gray-700"
                            >
                              6s
                            </th>
                            <th
                              scope="col"
                              className="md:px-4 px-2 py-2 font-medium text-gray-700"
                            >
                              SR
                            </th>
                          </tr>

                        </thead>
                        <tbody>
                          {/* Row 1 */}

                          {batsman?.map((batsman: any, index: number) => (
                            <tr className="border-b" key={index}>
                              <td className="px-2 md:px-4 py-2 font-medium text-gray-800">
                                <Link href={"/player/" + playerUrls[batsman.batsman_id]} className='flex md:items-center md:flex-row flex-col relative hover:text-[#1a80f8]'>
                                  {" "}
                                  <p className={`flex gap-1 items-center ${batsman.position === "striker" || batsman.how_out === "Not out" ? "text-[#1a80f8]" : ""
                                    }`}>
                                    {batsman.name}
                                    {
                                      batsman.position === "striker" ? (<Image loading="lazy" src="/assets/img/home/bat.png" width={12} height={12} className="h-[13px]" alt="" />) : ` `
                                    }
                                  </p>
                                  <p className="md:hidden text-[#757A82] text-[11px] font-normal">
                                    {batsman.how_out}

                                  </p>
                                </Link>
                              </td>
                              <td className="px-2 md:px-4 py-2 hidden md:block text-[13px] text-[#757A82] capitalize">
                                {batsman.how_out}
                              </td>
                              <td className="px-2 md:px-4 py-2 font-medium text-gray-800">
                                {batsman.runs}
                              </td>
                              <td className="px-2 md:px-4 py-2">{batsman.balls_faced}</td>
                              <td className="px-2 md:px-4 py-2 text-center md:text-start">
                                {batsman.fours}
                              </td>
                              <td className="px-2 md:px-4 py-2 text-center md:text-start">
                                {batsman.sixes}
                              </td>
                              <td className="px-2 md:px-4 py-2">{batsman.strike_rate}</td>
                            </tr>
                          ))}

                        </tbody>
                      </table>
                    </div>
                    <div className="mt-2 py-2 px-4 bg-[#ecf2fd]">
                      <p className="flex justify-between text-[14px]">
                        <span className="font-medium text-[#000000]">Extras: </span>
                        <span className="text-sm text-[#586577]">
                          {" "}
                          <span className="font-medium text-[#000000]"> {matchinning?.extra_runs?.total} </span> (B {matchinning?.extra_runs?.byes},
                          Lb {matchinning?.extra_runs?.legbyes}, W {matchinning?.extra_runs?.wides}, Nb {matchinning?.extra_runs?.noballs}, P {matchinning?.extra_runs?.penalty})
                        </span>
                      </p>
                    </div>
                  
                </div>


                <div className='md:hidden mb-4'>

                  {yetTobat?.length > 0 && yetTobat !== undefined ? (

                    <div className="rounded-lg bg-[#ffffff] p-4">
                     
                        <h2 className="text-1xl font-semibold pl-[7px] mb-3 border-l-[3px] border-[#229ED3]">
                          Yet to bat
                        </h2>
                        <div className="border-t-[1px] border-[#E4E9F0]" />
                        
                        <div className="grid grid-cols-2 md:grid-cols-1 md:gap-0 gap-2">
                          {yetTobat?.map((yetTobat: any, index: number) => (
                            <div className='col-span-1'>
                              <Link href={"/player/" + playerUrls[yetTobat.player_id]} className='' key={index}>
                                <div className="flex items-center gap-3 py-3 border-b-[1px] border-border-gray-700">
                                  <div style={{ width: '40px', height: '40px' }}>
                                    <PlayerImage key={yetTobat?.player_id} player_id={yetTobat.player_id} width={35} height={35} className="rounded-lg" />
                                  </div>
                                  <div className="font-medium md:w-full w-[65%]">
                                    <h3 className="text-[15px] hover:text-[#1a80f8]">{yetTobat.name} </h3>
                                    <p className="text-[#757A82] font-normal">{getPlayerRecord(allPlayers, Number(yetTobat.player_id))}</p>
                                  </div>
                                </div>
                              </Link>
                            </div>
                          ))}
                        </div>
                      
                    </div>

                  ) : ` `
                  }

                </div>



                <div className="rounded-lg bg-[#ffffff] mb-4 p-4">
                  <h2 className="text-1xl font-semibold mb-3 pl-[7px] border-l-[3px] border-[#229ED3]">
                    Bowling
                  </h2>
                 
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left text-[#586577] whitespace-nowrap">
                        <thead className="bg-blue-50 text-gray-700 ">
                          <tr>
                            <th className="px-4 py-3 font-medium">Bowling</th>
                            <th className="md:px-4 pl-[14px] py-3 font-medium">
                              O
                            </th>
                            <th className="md:px-4 pl-[14px] py-3 font-medium">
                              M
                            </th>
                            <th className="md:px-4 pl-[14px] py-3 font-medium">
                              R
                            </th>
                            <th className="md:px-4 pl-[14px] py-3 font-medium">
                              W
                            </th>
                            <th className="md:px-4 pl-[14px] py-3 font-medium">
                              ER
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {bowlers?.map((bowlers: any, index: number) => (
                            <tr key={index}>
                              <td className="px-4 py-3 font-medium text-gray-800">
                                <Link href={"/player/" + playerUrls[bowlers.bowler_id]} className='hover:text-[#1a80f8]'>{bowlers.name} </Link>
                              </td>
                              <td className="md:px-4 pl-[14px] py-3 font-medium text-gray-800">{bowlers.overs} </td>
                              <td className="md:px-4 pl-[14px] py-3">{bowlers.maidens} </td>
                              <td className="md:px-4 pl-[14px] py-3">{bowlers.runs_conceded} </td>
                              <td className="md:px-4 pl-[14px] py-3">{bowlers.wickets} </td>
                              <td className="md:px-4 pl-[14px] py-3">{bowlers.econ} </td>
                            </tr>
                          ))}

                        </tbody>
                      </table>
                    </div>
                  
                </div>

                <div className="rounded-lg bg-[#ffffff] mb-4 p-4">
                  <h2 className="text-1xl font-semibold mb-3 pl-[7px] border-l-[3px] border-[#229ED3]">
                    Fall of Wickets
                  </h2>
                  
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left text-[#586577]">
                        <thead className="bg-blue-50 text-gray-700">
                          <tr>
                            <th className="px-4 py-3 font-medium">Batter</th>
                            <th className="px-4 py-3 font-medium">Score</th>
                            <th className="px-4 py-3 font-medium">Overs</th>
                          </tr>
                        </thead>
                        <tbody>
                          {fows?.map((fows: any, index: number) => (
                            <tr className="border-b" key={index}>
                              <td className="px-4 py-3 font-medium text-gray-800">
                                <Link href={"/player/" + playerUrls[fows.batsman_id]} className='hover:text-[#1a80f8]'>  {fows.name} </Link>
                              </td>
                              <td className="px-4 py-3 font-medium text-gray-800">{fows.score_at_dismissal} </td>
                              <td className="px-4 py-3">{fows.overs_at_dismissal}</td>
                            </tr>
                          ))}

                        </tbody>
                      </table>
                    </div>
                  
                </div>

                <div className="rounded-lg bg-[#ffffff] mb-4 p-4">
                  <h2 className="text-1xl font-semibold mb-3 pl-[7px] border-l-[3px] border-[#229ED3]">
                    Partnership
                  </h2>
                  <div className="flex justify-between items-center bg-blue-50 text-gray-700 text-sm px-4 py-3 font-medium">
                    <div>Batter 1</div>
                    <div>Batter 2</div>
                  </div>
                  {partnership && partnership?.map((partnership: any, index: number, playerA_percent: number) => (

                    playerA_percent = ((partnership.batsmen[0].runs / (partnership.batsmen[0].runs + partnership.batsmen[1].runs)) * 100),
                    //  playerB_percent = ((partnership.batsmen[1].runs / (partnership.batsmen[0].runs+partnership.batsmen[1].runs)) * 100),

                    <div key={index}>
                      <div className="text-sm flex items-center justify-between font-medium px-2 py-3">
                        <div className="w-full ">
                          <p className="text-[13px] text-[#757A82]">{partnership.order}{partnership.order === 1 ? ("st") : partnership.order === 2 ? ("nd") : partnership.order === 3 ? ("rd") : ("th")} Wicket</p>
                          <div className="flex md:flex-row flex-col md:gap-2">
                            <Link href={"/player/" + playerUrls[partnership.batsmen[0].batsman_id]} className=''>  {players.find((p: { player_id: number; }) => p.player_id === partnership.batsmen[0].batsman_id)?.name} </Link>
                            <p>
                              <span>{partnership.batsmen[0].runs} </span>
                              <span className="text-[13px] text-[#757A82]">({partnership.batsmen[0].balls_faced})</span>
                            </p>
                          </div>
                        </div>
                        <div className=" w-full">
                          <p className="mb-1 text-center">
                            {partnership.runs} <span className="text-[#757A82]">({partnership.balls_faced})</span>
                          </p>
                          <div className="bg-[#B7132B] w-[75px] mx-auto h-[4px]">
                            <div
                              className="bg-[#13b76dbd] h-[4px]"
                              style={{ width: `${playerA_percent}%` }}
                            />
                          </div>
                        </div>
                        <div className=" w-full flex md:flex-row flex-col md:gap-2 items-end md:items-center  justify-end">
                          <Link href={"/player/" + playerUrls[partnership.batsmen[1].batsman_id]} className=''>
                            <p className='text-end'>{players.find((p: { player_id: number; }) => p.player_id === partnership.batsmen[1].batsman_id)?.name}</p> </Link>
                          <p className='text-end'>
                            {partnership.batsmen[1].runs} <span className="text-[#757A82]">({partnership.batsmen[1].balls_faced})</span>
                          </p>
                        </div>
                      </div>
                      <div className="border-t-[1px] border-[#E4E9F0]" />
                    </div>
                  ))}


                </div>
              </div>

              <div className="lg:col-span-4 md:col-span-5">

                {manOfTheMatch?.pid !== undefined &&
                  <div className="rounded-lg bg-[#ffffff] mb-4 hidden md:block p-4">
                    
                      <Link href={"/player/" + playerUrls[manOfTheMatch?.pid]}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 ">
                         

                            <PlayerImage key={manOfTheMatch?.pid} player_id={manOfTheMatch?.pid} height={50} width={50} className="rounded-lg" />

                          
                          <div className="font-medium">
                            <h2 className="text-1xl font-semibold hover:text-[#1a80f8]">{manOfTheMatch?.name}</h2>
                            <p className="text-[#6A7586] font-normal"> Man of the match </p>
                          </div>
                        </div>
                        <Image
                          src="/assets/img/home/win.png"
                          width={26}
                          height={30}
                          style={{ width: "26px", height: "30px" }}
                          alt=""
                          loading="lazy"
                        />
                      </div>
                    </Link>
                    
                  </div>
                }

                <div className='md:block hidden'>

                  {yetTobat?.length > 0 && yetTobat !== undefined ? (

                    
                      <div className="rounded-lg bg-[#ffffff] p-4">
                        <h2 className="text-1xl font-semibold pl-[7px] mb-3 border-l-[3px] border-[#229ED3]">
                          Yet to bat
                        </h2>
                        <div className="border-t-[1px] border-[#E4E9F0]" />

                        <div className="grid grid-cols-2 md:grid-cols-1">
                          {yetTobat?.map((yetTobat: any, index: number) => (
                            <div className='col-span-1'>
                              <Link href={"/player/" + playerUrls[yetTobat.player_id]} className='' key={index}>
                                <div className="flex items-center space-x-3 py-3 border-b-[1px] border-border-gray-700">
                                  <div style={{ width: '40px', height: '40px' }}>
                                    <PlayerImage key={yetTobat?.player_id} player_id={yetTobat.player_id} width={35} height={35} className="rounded-lg" />
                                  </div>
                                  <div className="font-medium">
                                    <h3 className="text-[15px] hover:text-[#1a80f8]">{yetTobat.name} </h3>
                                    <p className="text-[#757A82] font-normal">{getPlayerRecord(allPlayers, Number(yetTobat.player_id))}</p>
                                  </div>
                                </div>
                              </Link>
                            </div>
                          ))}
                        </div>
                      </div>
                    

                  ) : ` `
                  }

                </div>

              </div>
            </div>
          

        </div>
      </div>
    </div >
  )
}
