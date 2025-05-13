"use client";
import React, { useState, useEffect } from 'react'
import Image from 'next/image';
import Link from 'next/link'
import { urlStringEncode } from "@/utils/utility";
import PlayerImage from "@/app/components/PlayerImage";
import Banner from './Banner';
import News from '@/app/series/seriesComponents/SeriesListNews'

interface Team {
  ranking: any | null;
  iccRankingName: string | null;
  iccRankingType: string | null;
  iccRankingTap: string | null;
}
export default function Team({ ranking, iccRankingName, iccRankingType, iccRankingTap }: Team) {

  const [visibleCount, setVisibleCount] = useState(10);

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

      <Banner></Banner>

      <section className="lg:w-[1000px] mx-auto md:mb-0 mb-4 px-2 lg:px-0">

        <div className='md:grid grid-cols-12 gap-4'>

          <div className='lg:col-span-8 md:col-span-7'>

            <div id="tabs" className="my-4">
              <div className="flex text-[15px] space-x-8 p-2 bg-[#ffffff] rounded-lg overflow-auto">
                <Link href="/iccranking/man/team/odis">
                  <button
                    className={`font-medium py-2 px-5 whitespace-nowrap ${iccRankingName === 'man' ? "bg-[#1A80F8] text-white rounded-md" : ""} `}
                  >
                    Men
                  </button>
                </Link>

                <Link href="/iccranking/woman/team/odis">
                  <button
                    className={`font-medium py-2 px-5 whitespace-nowrap ${iccRankingName === 'woman' ? "bg-[#1A80F8] text-white rounded-md" : ""} `}
                  >
                    Women
                  </button>
                </Link>
              </div>
            </div>



            <div id="info">
              <div className="cust-box-click-container">
                <div className="flex gap-4 items-center my-2 md:py-2 relative overflow-x-auto [&::-webkit-scrollbar] [&::-webkit-scrollbar]:h-[1px] 
                              [&::-webkit-scrollbar-track]:bg-[#ecf2fd] 
                              [&::-webkit-scrollbar-thumb]:bg-[#ecf2fd] 
                               dark:[&::-webkit-scrollbar-track]:bg-[#ecf2fd] 
                                 dark:[&::-webkit-scrollbar-thumb]:bg-[#ecf2fd]">
                  <Link href={"/iccranking/" + iccRankingName + "/team/odis"}>
                    <button className={`cust-box-click-button font-medium md:px-7 px-[19px] py-1 rounded-full whitespace-nowrap ${iccRankingType === 'team' ? "bg-[#081736] text-white" : "bg-[#ffffff] text-[#6A7586]"}`}>

                      <span>Team</span>
                    </button>
                  </Link>
                  <Link href={"/iccranking/" + iccRankingName + "/batter/odis"}>
                    <button className={`cust-box-click-button font-medium md:px-7 px-[19px] py-1 rounded-full whitespace-nowrap ${iccRankingType === 'batter' ? "bg-[#081736] text-white" : "bg-[#ffffff] text-[#6A7586]"}`}

                    >
                      <span>Batter</span>
                    </button>
                  </Link>
                  <Link href={"/iccranking/" + iccRankingName + "/bowler/odis"}>
                    <button className={`cust-box-click-button font-medium md:px-7 px-[19px] py-1 rounded-full whitespace-nowrap ${iccRankingType === 'bowler' ? "bg-[#081736] text-white" : "bg-[#ffffff] text-[#6A7586]"}`}

                    >
                      <span>Bowler</span>
                    </button>
                  </Link>
                  <Link href={"/iccranking/" + iccRankingName + "/all-rounder/odis"}>
                    <button className={`cust-box-click-button font-medium md:px-7 px-[19px] py-1 rounded-full whitespace-nowrap ${iccRankingType === 'all-rounder' ? "bg-[#081736] text-white" : "bg-[#ffffff] text-[#6A7586]"}`}

                    >
                      <span>All Rounder</span>
                    </button>
                  </Link>
                </div>

                <div className="flex gap-4 items-center my-2 py-2 overflow-auto">
                  {Object.keys(rankDetails)?.map((key, index: number) => (
                    <Link href={"/iccranking/" + iccRankingName + "/" + iccRankingType + "/" + key} key={index}>
                      <button
                        className={`cust-box-click-button font-medium px-7 py-1 rounded-full whitespace-nowrap ${iccRankingTap === key ? 'bg-[#081736] text-white' : 'bg-[#ffffff] text-[#6A7586]'
                          }`}>
                        <span>{key.toUpperCase()}</span>
                      </button>
                    </Link>
                  ))}

                </div>


                <div className="cust-box-click-team">

                  <div className="">

                    <div className="cust-box-click-content mt-4">

                      <div className="md:col-span-4 col-span-12">
                        <div className="bg-white rounded-lg p-4 overflow-hidden">
                          <h3 className="text-[15px] font-semibold pl-[7px] border-l-[3px] mb-3 border-[#229ED3]">
                            {iccRankingTap?.toUpperCase() ?? ""}
                          </h3>
                          <div className="border-t-[1px] border-[#E4E9F0]" />
                          {rankData?.slice(0, 1)?.map((rankDetails: any, index: number) => (
                            <div
                              className="flex items-center rounded-lg justify-between text-white mt-3 p-4"
                              style={{
                                background: "linear-gradient(90deg, #3C1492 0%, #6D1E93 100%)"
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
                          <div className="py-4">
                            <table className="w-full text-left text-sm text-gray-600">
                              <thead className="bg-gray-100">
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
                                    {iccRankingType !== 'team' &&
                                      <td className="py-2 px-3 font-medium text-[#3d3d3d]">
                                        <Link href={"/player/" + playerUrls[rankDetails.pid]}> {rankDetails.player} </Link> </td>
                                    }
                                    <td className="py-2 px-3">{rankDetails.team}</td>
                                    <td className="py-2 px-3 font-semibold">{rankDetails.rating}</td>
                                  </tr>
                                ))}

                              </tbody>

                            </table>
                          </div>
                          {/* Footer Button */}
                          <div className="px-4 text-center">
                            {visibleCount < rankData.length && (
                              <button onClick={loadMore} className="px-8 bg-[#081736] font-semibold text-white py-2 rounded hover:bg-blue-700">
                                View More
                              </button>
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