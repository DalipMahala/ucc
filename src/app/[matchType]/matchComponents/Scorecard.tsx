"use client";
import React, { useState } from 'react'
import Image from "next/image";
import Link from 'next/link';
import eventEmitter from "@/utils/eventEmitter";
import { urlStringEncode} from "@/utils/utility";
import PlayerImage from "@/app/components/PlayerImage";

interface Scorecard {
  match_id: number;

  matchData:any | null;

  // matchLast:any | null;

  matchStates:any | null;

  matchUrl :string | null;
  isPointTable: boolean;
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
  const [matchLiveData, setmatchLiveData] = useState(matchData);

  
    const handleMatchData = (data:any) => {
      if (data?.match_id == match_id) {
        setmatchLiveData(data); // ✅ Update only when new data is received
      }
    };

    eventEmitter.on("matchLiveData", handleMatchData);
    // eventEmitter.removeListener("matchData", handleMatchData);
    
 
  
  const [openHeading, setOpenHeading] = useState<number>(0);
  
    const handleToggle = (index: number) => {
      // console.log("toggle",index);
      setOpenHeading(openHeading === index ? 0 : index);
    };
  const tabIndex = openHeading;


  let matchscorecard = matchLiveData?.scorecard?.innings;
  let matchinning = matchLiveData?.scorecard?.innings[tabIndex];
  let batsman = matchinning?.batsmen;
  let bowlers = matchinning?.bowlers;
  let fows = matchinning?.fows;
  let yetTobat = matchinning?.did_not_bat;
  
  

  const partnership = matchStates?.innings[tabIndex]?.statistics?.partnership;
  const players = matchStates?.players;
  

  // const liveData = matchLiveData;

  //console.log("partnership",players.find((p: { player_id: number; }) => p.player_id === 77)?.name );
  
  if(matchLiveData !== undefined && matchLiveData?.match_id == match_id && matchLiveData?.scorecard?.innings[tabIndex] !== undefined && matchLiveData?.scorecard?.innings[tabIndex] !== ''){
    console.log(tabIndex, "new",matchLiveData);    
    matchData = matchLiveData;
    matchscorecard = matchLiveData?.scorecard?.innings;
    matchinning = matchLiveData?.scorecard?.innings[tabIndex];
    batsman = matchinning?.batsmen;
    bowlers = matchinning?.bowlers;
    fows = matchinning?.fows;
    yetTobat = matchinning?.did_not_bat;
    // let currPartnership = matchinning.current_partnership;
    
  }

  
  

  

  return (
    <div className="lg:w-[1000px] mx-auto md:mb-0 mb-4 px-2 lg:px-0">
    <div className="my-4">
      <div id="tabs" className="my-4">
        <div className="flex text-1xl space-x-8 p-2 bg-[#ffffff] rounded-lg overflow-auto">
        <Link href={"/moreinfo/"+matchUrl+"/" + match_id}>
            <button
              className="font-medium py-2 px-3 whitespace-nowrap "
            >
              More Info
            </button>
          </Link>
          <Link href={"/live-score/"+matchUrl+"/" + match_id}>
            <button
              className="font-medium py-2 px-3 whitespace-nowrap"
            >
              Live
            </button>
          </Link>
          <Link href={"/scorecard/"+matchUrl+"/" + match_id}>
            <button
              className="font-medium py-2 px-3 whitespace-nowrap bg-[#1A80F8] text-white rounded-md"
            >
              Scorecard
            </button>
          </Link>
          <Link href={"/squad/"+matchUrl+"/"+ match_id}>
            <button
              className="font-medium py-2 px-3 whitespace-nowrap"
            >
              Squad
            </button>
          </Link>
          {isPointTable && (
          <Link href={"/series/"+urlStringEncode(matchDetails?.competition?.title+"-"+matchDetails?.competition?.season)+"/"+matchDetails?.competition?.cid+"/points-table"}>
            <button className="font-medium py-2 px-3 whitespace-nowrap">
              Points Table
            </button>
          </Link>
          )}
          <Link href={"/series/"+urlStringEncode(matchDetails?.competition?.title+"-"+matchDetails?.competition?.season)+"/"+matchDetails?.competition?.cid+"/stats/most-run"}>
            <button className="font-medium py-2 px-3 whitespace-nowrap">
              Stats
            </button>
          </Link>
        </div>
      </div>
    </div>
    <div id="tab-content">
      <div id="scorecard" className="tab-content cust-box-click-container">
        <div className="flex items-center gap-3 md:mb-4 mb-2 md:pb-0 pb-2 font-medium text-[14px] whitespace-nowrap overflow-auto">
          {
          matchscorecard?.map((scorecard:any, index: number) => (
            <button key={index}
            className={`cust-box-click-button ${openHeading === index ? "bg-[#081736] text-white" : "bg-[#ffffff] text-[#6A7586]" }  font-medium  px-5 py-1 rounded-full`}
            onClick={() => handleToggle(index)} >
           <span>{scorecard['short_name']}</span>
         </button>
          ))}
        </div>
        <div className="cust-box-click-content cust-box-click-ind1stinning mt-4">
          <div className="md:grid grid-cols-12 gap-4">
            <div className="lg:col-span-8 md:col-span-7">
              <div className="rounded-lg bg-[#ffffff] mb-4 p-4">
                <div className="flex justify-between items-center text-[16px]">
                  <div className="">
                    <p className="mx-2 font-semibold">Total Score</p>
                  </div>
                  <div className="">
                    <p className="mx-2 font-semibold ">
                      {" "}
                      {matchscorecard?.[tabIndex]?.equations?.runs}-{matchscorecard?.[tabIndex]?.equations?.wickets} <span className="text-[#586577]">({matchscorecard?.[tabIndex]?.equations?.overs})</span>
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-lg bg-[#ffffff] mb-4 p-4">
                <h3 className="text-1xl font-semibold mb-3 pl-[7px] border-l-[3px] border-[#229ED3]">
                  Batting
                </h3>
                <div>
                  <div className="overflow-x-auto">
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
                        
                      {batsman?.map((batsman:any, index: number) => (
                        <tr className="border-b" key={index}>
                          <td className="md:px-4 py-2 font-medium text-gray-800">
                            <Link href={"/player/"+urlStringEncode(batsman.name)+"/"+batsman.batsman_id} className='hover:text-[#0b59ff] flex gap-1 items-center'>
                              {" "}
                              {batsman.name}
                              {
                                batsman.position === "striker"? (<Image  loading="lazy"  src="/assets/img/home/bat.png" width={12} height={12} className="h-[13px]" alt="" />) : ` `
                              }
                              <p className="md:hidden text-[#909090] text-[11px] font-normal">
                              {batsman.how_out}
                              
                              </p>
                            </Link>
                          </td>
                          <td className="md:px-4 py-2 hidden md:block text-[13px]">
                          {batsman.how_out}
                          </td>
                          <td className="md:px-4 py-2 font-medium text-gray-800">
                          {batsman.runs}
                          </td>
                          <td className="md:px-4 py-2">{batsman.balls_faced}</td>
                          <td className="md:px-4 py-2 text-center md:text-start">
                          {batsman.fours}
                          </td>
                          <td className="md:px-4 py-2 text-center md:text-start">
                          {batsman.sixes}
                          </td>
                          <td className="md:px-4 py-2">{batsman.strike_rate}</td>
                        </tr>
                       ))} 
                        
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-2 py-2 px-4 bg-[#ecf2fd]">
                    <p className="flex justify-between text-[14px]">
                      <span className="font-medium text-gray-800">Extras: </span>
                      <span className="text-sm text-gray-500">
                        {" "}
                        <span className="font-medium text-gray-800"> {matchinning?.extra_runs?.total}</span>(B {matchinning?.extra_runs?.byes},
                        Lb {matchinning?.extra_runs?.legbyes}, W {matchinning?.extra_runs?.wides}, Nb {matchinning?.extra_runs?.noballs}, P {matchinning?.extra_runs?.penalty})
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-lg bg-[#ffffff] mb-4 p-4">
                <h3 className="text-1xl font-semibold mb-3 pl-[7px] border-l-[3px] border-[#229ED3]">
                  Bowling
                </h3>
                <div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 whitespace-nowrap">
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
                        {bowlers?.map((bowlers:any, index: number) => (
                        <tr  key={index}>
                          <td className="px-4 py-3 font-medium text-gray-800">
                            <Link href={"/player/"+urlStringEncode(bowlers.name)+"/"+bowlers.bowler_id} className='hover:text-[#0b59ff]'>{bowlers.name} </Link>
                          </td>
                          <td className="md:px-4 pl-[14px] py-3">{bowlers.overs} </td>
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
              </div>
              <div className="rounded-lg bg-[#ffffff] mb-4 p-4">
                <h3 className="text-1xl font-semibold mb-3 pl-[7px] border-l-[3px] border-[#229ED3]">
                  Fall of Wickets
                </h3>
                <div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                      <thead className="bg-blue-50 text-gray-700">
                        <tr>
                          <th className="px-4 py-3 font-medium">Batter</th>
                          <th className="px-4 py-3 font-medium">Score</th>
                          <th className="px-4 py-3 font-medium">Overs</th>
                        </tr>
                      </thead>
                      <tbody>
                      {fows?.map((fows:any, index: number) => (
                        <tr className="border-b"  key={index}>
                          <td className="px-4 py-3 font-medium text-gray-800">
                            <Link href={"/player/"+urlStringEncode(fows.name)+"/"+fows.batsman_id} className='hover:text-[#0b59ff]'>  {fows.name} </Link>
                          </td>
                          <td className="px-4 py-3">{fows.score_at_dismissal} </td>
                          <td className="px-4 py-3">{fows.overs_at_dismissal}</td>
                        </tr>
                      ))}
                        
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-[#ffffff] mb-4 p-4">
                <h3 className="text-1xl font-semibold mb-3 pl-[7px] border-l-[3px] border-[#229ED3]">
                  Partnership
                </h3>
                <div className="flex justify-between items-center bg-blue-50 text-gray-700 text-sm px-4 py-3 font-medium">
                  <div>Batter 1</div>
                  <div>Batter 2</div>
                </div>
                {partnership && partnership?.map((partnership:any, index: number, playerA_percent:number) => (

                   playerA_percent = ((partnership.batsmen[0].runs / (partnership.batsmen[0].runs+partnership.batsmen[1].runs)) * 100),
                  //  playerB_percent = ((partnership.batsmen[1].runs / (partnership.batsmen[0].runs+partnership.batsmen[1].runs)) * 100),
                  
                  <div key={index}>
                <div className="text-sm flex items-center justify-between font-medium px-2 py-3">
                  <div className="w-full ">
                    <p className="text-[13px] text-[#909090]">{partnership.order}{partnership.order === 1?("st"):partnership.order === 2?("nd"):partnership.order === 3?("rd"):("th")} Wicket</p>
                    <div className="flex md:flex-row flex-col md:gap-2">
                      <Link href={"/player/"+urlStringEncode(players.find((p: { player_id: number; }) => p.player_id === partnership.batsmen[0].batsman_id)?.name)+"/"+partnership.batsmen[0].batsman_id} className='hover:text-[#0b59ff]'>  {players.find((p: { player_id: number; }) => p.player_id === partnership.batsmen[0].batsman_id)?.name} </Link>
                      <p>
                        <span>{partnership.batsmen[0].runs} </span>
                        <span className="text-[13px] text-[#909090]">({partnership.batsmen[0].balls_faced})</span>
                      </p>
                    </div>
                  </div>
                  <div className=" w-full">
                    <p className="mb-1 text-center">
                    {partnership.runs} <span className="text-[#909090]">({partnership.balls_faced})</span>
                    </p>
                    <div className="bg-[#B7132B] w-[75px] mx-auto h-[4px]">
                      <div
                        className="bg-[#13b76dbd] h-[4px]"
                        style={{ width: `${playerA_percent}%` }}
                      />
                    </div>
                  </div>
                  <div className=" w-full flex md:flex-row flex-col md:gap-2 items-end md:items-center  justify-end">
                    <Link href={"/player/"+urlStringEncode(players.find((p: { player_id: number; }) => p.player_id === partnership.batsmen[1].batsman_id)?.name)+"/"+partnership.batsmen[1].batsman_id} className='hover:text-[#0b59ff]'> <p>{players.find((p: { player_id: number; }) => p.player_id === partnership.batsmen[1].batsman_id)?.name}</p> </Link>
                    <p>
                    {partnership.batsmen[1].runs} <span className="text-[#909090]">({partnership.batsmen[1].balls_faced})</span>
                    </p>
                  </div>
                </div>
                <div className="border-t-[1px] border-[#E4E9F0]" />
                </div>
                ))}
               
                
              </div>
            </div>
            {yetTobat?.length > 0 && yetTobat !== undefined? (
            <div className="lg:col-span-4 md:col-span-5">
              <div className="rounded-lg bg-[#ffffff]">
                <div className="p-4">
                  <h3 className="text-1xl font-semibold pl-[7px] mb-3 border-l-[3px] border-[#229ED3]">
                    Yet to bat
                  </h3>
                  <div className="border-t-[1px] border-[#E4E9F0]" />
                  <div className="">
                  {yetTobat?.map((yetTobat:any, index: number) => (
                    <Link href={"/player/"+urlStringEncode(yetTobat.name)+"/"+yetTobat.player_id} className='hover:text-[#0b59ff]'  key={index}>
                      <div className="flex items-center space-x-3 py-3 border-b-[1px] border-border-gray-700">
                        <div>
                         <PlayerImage key={yetTobat?.player_id} player_id={yetTobat.player_id} width={40} height={40} className="rounded-lg" />
                        </div>
                        <div className="font-medium">
                          <h2 className="text-[15px]">{yetTobat.name} </h2>
                          <p className="text-[#909090] font-normal">Avg 7.34</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                    </div>
                </div>
              </div>
            </div>
            ) : ` `
          }
          </div>
        </div>
       
      </div>
    </div>
  </div>
  )
}
