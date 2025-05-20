"use client";
import React, { useState, useEffect } from 'react'
import Image from 'next/image';
import Link from 'next/link'
import { urlStringEncode } from "@/utils/utility";
import PlayerImage from "@/app/components/PlayerImage";
import News from '@/app/series/seriesComponents/SeriesListNews'
import { GrUserManager } from "react-icons/gr";
import { GrUserFemale } from "react-icons/gr";

interface Team {
  ranking: any | null;
  iccRankingName: string | null;
  iccRankingType: string | null;
  iccRankingTap: string | null;
}
export default function Team({ ranking, iccRankingName, iccRankingType, iccRankingTap }: Team) {

  const [visibleCount, setVisibleCount] = useState(10);
  const [selected, setSelected] = useState('Men');

  const loadMore = () => {
    setVisibleCount((prevCount) => prevCount + 10);
  };

  let rankDetails = '';
  let arrayName = '';
  let arrayType = String(iccRankingTap);
  let rankData = [];
  if (iccRankingName === 'man') {
    arrayName = 'ranks';
  } else if (iccRankingName === 'woman') {
    arrayName = 'women_ranks';
  }

  if (iccRankingType === 'team') {
    rankDetails = ranking?.[arrayName]?.teams;
    rankData = ranking?.[arrayName]?.teams?.[arrayType];
  } else if (iccRankingType === 'batter') {
    rankDetails = ranking?.[arrayName]?.batsmen;
    rankData = ranking?.[arrayName]?.batsmen?.[arrayType];
  } else if (iccRankingType === 'bowler') {
    rankDetails = ranking?.[arrayName]?.bowlers;
    rankData = ranking?.[arrayName]?.bowlers?.[arrayType];
  } else if (iccRankingType === 'all-rounder') {
    rankDetails = ranking?.[arrayName]?.['all-rounders'];
    rankData = ranking?.[arrayName]?.['all-rounders']?.[arrayType];
  }

  const [playerUrls, setPlayerUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    const getAllPlayerIds = () => {
      const allIds = [
        ...rankData?.map((item: { pid: any; }) => item?.pid),
      ];
      return [...new Set(allIds)]; // Deduplicate
    };

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
  }, [rankData]);
  // console.log('Team',playerUrls);


  return (

    <>



      <section className="relative bg-[#0E2149] border-[1px] border-[#E4E9F01A] lg:px-0 px-3 overflow-hidden">
        {/* Background image */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-[0.1] z-0">
          <Image
            src="/assets/img/bg-logo.png"
            alt="Background"
            width={70}
            height={70}
            className="h-[120px] w-auto"
          />
        </div>

        {/* Content */}
        <div className="relative z-10 border-t-[1px] border-[#E4E9F01A] h-[200px] flex flex-col justify-center items-center space-y-4">
          <h1 className="text-[#459af4] text-[33px] font-bold">
            ICC WORLD <span className="text-[#ffffff]"><i> RANKING </i></span>
          </h1>

          {/* Toggle Switch */}
          <div id="tabs" className="my-4 flex justify-center">
            <div className="flex text-[15px] space-x-2 p-1 bg-[#081736] rounded-full overflow-auto">
              <Link href="/iccranking/man/team/odis">
                <button
                  className={`font-medium py-2 px-6 rounded-full transition-all duration-300 flex gap-1 items-center ${iccRankingName === 'man'
                    ? 'bg-[#ffffff]  shadow-md'
                    : 'text-white/70'
                    }`}
                >
               <span> <GrUserManager /> </span> <span> Men </span>
                </button>
              </Link>

              <Link href="/iccranking/woman/team/odis">
                <button
                  className={`font-medium py-2 px-6 rounded-full transition-all duration-300 flex gap-1 items-center ${iccRankingName === 'woman'
                    ? 'bg-[#ffffff] shadow-md'
                    : 'text-white/70'
                    }`}
                >
              <span><GrUserFemale /></span>  <span>  Women </span>
                </button>
              </Link>
            </div>
          </div>

        </div>
      </section>

      <section className="lg:w-[1000px] mx-auto md:mb-0 mb-4 px-2 lg:px-0">

        <div className='md:grid grid-cols-12 gap-4'>

          <div className='lg:col-span-8 md:col-span-7'>





            <div id="info">
              <div className="cust-box-click-container">
                <div className="flex gap-4 items-center md:justify-start justify-between md:my-2 my-4 md:py-2 relative">
                  <Link href={"/iccranking/" + iccRankingName + "/team/odis"}>
                    <button className={`cust-box-click-button font-medium md:px-7 px-[15px] py-1 whitespace-nowrap ${iccRankingType === 'team' ? "bg-[#1A80F8] text-white" : "bg-[#ffffff] "}`}>

                      <span>Team</span>
                    </button>
                  </Link>
                  <Link href={"/iccranking/" + iccRankingName + "/batter/odis"}>
                    <button className={`cust-box-click-button font-medium md:px-7 px-[15px] py-1 whitespace-nowrap ${iccRankingType === 'batter' ? "bg-[#1A80F8] text-white" : "bg-[#ffffff] "}`}

                    >
                      <span>Batter</span>
                    </button>
                  </Link>
                  <Link href={"/iccranking/" + iccRankingName + "/bowler/odis"}>
                    <button className={`cust-box-click-button font-medium md:px-7 px-[15px] py-1 whitespace-nowrap ${iccRankingType === 'bowler' ? "bg-[#1A80F8] text-white" : "bg-[#ffffff] "}`}

                    >
                      <span>Bowler</span>
                    </button>
                  </Link>
                  <Link href={"/iccranking/" + iccRankingName + "/all-rounder/odis"}>
                    <button className={`cust-box-click-button font-medium md:px-7 px-[15px] py-1 whitespace-nowrap ${iccRankingType === 'all-rounder' ? "bg-[#1A80F8] text-white" : "bg-[#ffffff] "}`}

                    >
                      <span>All Rounder</span>
                    </button>
                  </Link>
                </div>




                <div className="cust-box-click-team">

                  <div className="">

                    <div className="cust-box-click-content mt-4">

                      <div className="md:col-span-4 col-span-12">
                        <div className="bg-white rounded-lg p-4 overflow-hidden relative">
                          <div className='flex justify-between items-center mb-3'>
                            <h3 className="text-[15px] font-semibold pl-[7px] border-l-[3px] border-[#229ED3]">
                              {iccRankingTap?.toUpperCase() ?? ""}
                            </h3>
                            <div className="flex gap-2 items-center">
                              {Object.keys(rankDetails)?.map((key, index: number) => (
                                <Link href={"/iccranking/" + iccRankingName + "/" + iccRankingType + "/" + key} key={index}>
                                  <button
                                    className={`cust-box-click-button font-medium px-7 py-1 rounded-full whitespace-nowrap ${iccRankingTap === key ? 'bg-[#081736] text-white' : 'bg-[#ebebeb] text-[#6A7586]'
                                      }`}>
                                    <span>{key.toUpperCase()}</span>
                                  </button>
                                </Link>
                              ))}

                            </div>
                          </div>
                          <div className="border-t-[1px] border-[#E4E9F0]" />
                          {rankData?.slice(0, 1)?.map((rankDetails: any, index: number) => (
                            <div
                              className="flex items-center rounded-lg justify-between text-white mt-3 p-4"
                              style={{
                                background: "linear-gradient(90deg, #1a80f8 0%, #081736 100%)"
                              }} key={index}  >
                              {iccRankingType !== 'team' ?
                                <Link href={"/player/" + playerUrls[rankDetails.pid]}>
                                  <div className="flex items-center">
                                    <p className='text-[24px] font-semibold text-[#ffffff] mr-3'>#1</p>
                                    <PlayerImage key={rankDetails?.pid} player_id={rankDetails.pid} height={48} width={48} className="w-12 h-12 rounded-lg mr-3" />
                                    <div>
                                      <h3 className="text-[14px] font-normal">{rankDetails.player}</h3>
                                    </div>
                                  </div>
                                </Link>
                                :
                                <Link href={"/team/" + urlStringEncode(rankDetails.team) + "/" + rankDetails.tid}>
                                  <div className="flex items-center">

                                    <p className='text-[24px] font-semibold text-[#ffffff] mr-3'>#1</p>

                                    <Image loading="lazy"
                                      src={rankDetails.logo_url}
                                      width={48} height={48} alt="Player"
                                      className="w-12 h-12 rounded-lg mr-3"
                                    />
                                    <div>
                                      <h3 className="text-[14px] font-normal">{rankDetails.team}</h3>
                                    </div>
                                  </div>
                                </Link>
                              }
                              <div className="text-right">
                                <p className="text-[14px] font-normal">Rating</p>
                                <p className="md:text-[17px] text-[15px] font-semibold">{rankDetails.rating}</p>
                              </div>
                            </div>
                          ))}

                          <table className="w-full text-left text-sm text-gray-600 mt-2 ">
                            <thead className="bg-gray-100 rounded-t-lg">
                              <tr>
                                <th className="py-2 px-3 font-semibold text-gray-700 ">Rank</th>
                                <th className="font-medium text-gray-700" />
                                {iccRankingType !== 'team' &&
                                  <th className="py-2 px-3 font-semibold text-gray-700">Name</th>
                                }
                                <th className="py-2 px-3 font-semibold text-gray-700">Team</th>
                                <th className="py-2 px-3 font-semibold text-gray-700">Rating</th>
                              </tr>
                            </thead>
                            <tbody>
                              {rankData?.slice(1, visibleCount)?.map((rankDetails: any, index: number) => (


                                <tr key={index}>
                                  <td className="py-2 px-3 ">{rankDetails.rank}</td>
                                  <td className="px-1">-</td>
                                  <td className="py-2 px-3 font-medium text-[#3d3d3d]">
                                    {iccRankingType !== 'team' ?

                                      <Link href={"/player/" + playerUrls[rankDetails.pid]}> {rankDetails.player} </Link>
                                      :
                                       <Link href={"/team/" + urlStringEncode(rankDetails.team) + "/" + rankDetails.tid}> {rankDetails.team} </Link>
                                        
                                      }
                                  </td>



                                  <td className="py-2 px-3">{rankDetails.team}</td>
                                  <td className="py-2 px-3 font-semibold">{rankDetails.rating}</td>
                                </tr>
                              ))}

                            </tbody>

                          </table>


                          {visibleCount < rankData.length && (
                            <div className="absolute bottom-[49px] left-0 w-full h-10 bg-gradient-to-t from-white dark:from-neutral-900 to-transparent pointer-events-none z-10"></div>
                          )}
                          {/* Footer Button */}
                          <div className="px-4 text-center">
                            {visibleCount < rankData.length && (

                              <div onClick={loadMore} className="text-[#1A80F8] font-semibold flex items-center justify-center text-[13px] pt-2 underline cursor-pointer">
                                View More{" "}
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
                              </div>

                            )}
                          </div>
                        </div>
                      </div>


                    </div>

                  </div>

                </div>


              </div>
            </div>
          </div>

          <div className='lg:col-span-4 md:col-span-5'>
            <div className="my-4">

              <h2 className="text-1xl font-semibold pl-[3px] border-l-[3px] border-[#1a80f8] mb-2 uppercase">Latest News</h2>
              <News></News>
            </div>
          </div>

        </div>


      </section>
    </>
  )
}