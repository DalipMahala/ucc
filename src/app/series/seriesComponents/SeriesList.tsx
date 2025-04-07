"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { urlStringEncode } from "./../../../utils/utility";
import { format } from "date-fns";


interface SeriesList {
  tournamentsList: any | null;
}
export default function SeriesList({ tournamentsList }: SeriesList) {
  const uniqueTypes = [
    ...new Set(
      tournamentsList?.map(
        (tournament: { category: any }) => tournament.category
      )
    ),
  ];
  const [filter, setFilter] = useState(uniqueTypes[0]);
  const statusTypes = [
    ...new Set(
      tournamentsList?.map(
        (tournament: { status: any }) => tournament.status
      )
    ),
  ].reverse();
  const [statusFilter, setStatusFilter] = useState('All');
  const seriesList = tournamentsList.filter(
    (item: { category: string, status: string }) => item.category === filter && (statusFilter === "All" || item.status === statusFilter)
  );

  console.log(statusTypes);
  return (
    <section className="lg:w-[1000px] mx-auto md:mb-0 my-4 px-2 lg:px-0">
      <div className="md:grid grid-cols-12 gap-4">
        <div className="lg:col-span-8 md:col-span-7">
          <div className="tab-section">
            <div className="tabs my-3 md:my-4">
              <div
                className="flex text-1xl space-x-8 p-2 bg-[#ffffff] rounded-lg overflow-auto relative overflow-x-auto  [&::-webkit-scrollbar] [&::-webkit-scrollbar]:h-[5px] 
                              [&::-webkit-scrollbar-track]:bg-gray-100 
                              [&::-webkit-scrollbar-thumb]:bg-[#DFE9F6] 
                               dark:[&::-webkit-scrollbar-track]:bg-neutral-700 
                                 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
              >
                {uniqueTypes?.map((item: any) => (
                  <button
                    key={item}
                    className={`font-medium py-2 px-5 whitespace-nowrap ${
                      filter === item ? "bg-[#1A80F8] text-white" : ""
                    } rounded-md`}
                    onClick={() => setFilter(item)}
                  >
                    {item.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
            <div className="tabs my-3 md:my-4">
              <div
                className="flex text-1xl space-x-8 p-2 bg-[#ffffff] rounded-lg overflow-auto relative overflow-x-auto  [&::-webkit-scrollbar] [&::-webkit-scrollbar]:h-[5px] 
                              [&::-webkit-scrollbar-track]:bg-gray-100 
                              [&::-webkit-scrollbar-thumb]:bg-[#DFE9F6] 
                               dark:[&::-webkit-scrollbar-track]:bg-neutral-700 
                                 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
              >
                {["All", ...statusTypes]?.map((item: any) => (
                  <button
                    key={item}
                    className={`font-medium py-2 px-5 whitespace-nowrap ${
                      statusFilter === item ? "bg-[#1A80F8] text-white" : ""
                    } rounded-md`}
                    onClick={() => setStatusFilter(item)}
                  >
                    {item.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
            <div className="lg:col-span-8 md:col-span-7"></div>
            <div className="lg:col-span-8 md:col-span-7">
              <div className="upcomingMatch"></div>
            </div>
            {seriesList?.map((series: any, index: number) => (
              <div className="lg:col-span-8 md:col-span-7" key={index}>
                <div className="rounded-lg bg-[#ffffff] my-4 p-4">
                  <div>
                    <div className="md:px-2">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <div
                            className={`flex items-center ${series?.status === 'upcoming' ? "text-[#A45B09]" : series?.status === 'live' ? "text-[#A70B0B]" : "text-[#0B773C]"} rounded-full pr-3  font-semibold`}
                            style={{ gap: "3px" }}
                          >
                            <span className="rounded-full">●</span>{" "}
                            {series?.status.toUpperCase()}
                          </div>
                          
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-[13px] font-medium">Total Match - {series?.total_matches}</span>
                         
                        </div>
                      </div>

                      <div className="border-t-[1px] border-[#E7F2F4]"></div>
                      <Link href={"/series/"+urlStringEncode(series?.title+"-"+series?.season)+"/" + series.cid}>
                        <div className="py-4 px-3">
                          <div className="flex justify-between items-center text-[14px]">
                            <div className="">
                              <p className="text-[#586577] text-[12px] mb-4 font-medium">
                                
                              </p>
                              <div className="flex items-center space-x-2 font-medium w-[162px] md:w-full mb-4">
                                <div className="flex items-center space-x-2">
                                  <Image  loading="lazy" 
                                    src="/assets/img/series/ipl.png"
                                    className="h-[30px] rounded-full"
                                    width={30}
                                    height={30}
                                    alt={series?.title}
                                />
                                  <span className="font-semibold">
                                    {series?.title}
                                  </span>
                                </div>
                              </div>

                            </div>

                            <div className="font-semibold text-center">
                              <div className="text-[#144280]">
                                <div className=" font-medium text-center">
                                  
                                  <p className="text-[#2F335C] text-[14px]">
                                    {format(new Date(series.datestart), "dd MMMM")} - 
                                    {format(new Date(series.dateend), "dd MMMM yyyy")}
                                  
                                  
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
