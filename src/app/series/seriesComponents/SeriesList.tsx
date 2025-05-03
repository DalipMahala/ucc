"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { urlStringEncode } from "./../../../utils/utility";
import { format } from "date-fns";
import SeriesListNews from "./SeriesListNews";
import PLSeries from "@/app/components/popularSeries";


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
  let seriesList = tournamentsList.filter(
    (item: { category: string, status: string }) => item.category === filter && (statusFilter === "All" || item.status === statusFilter)
  );

  seriesList = [...seriesList].sort((a, b) => ['live', 'fixture', 'result'].indexOf(a.status) - ['live', 'fixture', 'result'].indexOf(b.status) || new Date(a.datestart).getTime() - new Date(b.datestart).getTime());

  console.log(statusTypes);
  return (
    <section className="lg:w-[1000px] mx-auto md:mb-0 px-2 lg:px-0">
      <div className="md:grid grid-cols-12 gap-4">
        <div className="lg:col-span-8 md:col-span-7">
          <div className="tab-section">
            <div className="tabs my-3 md:my-4">
              <div
                className="flex text-[13px] md:space-x-8 space-x-6  p-2 bg-[#ffffff] rounded-lg overflow-auto relative overflow-x-auto  [&::-webkit-scrollbar] [&::-webkit-scrollbar]:h-[5px] 
                              [&::-webkit-scrollbar-track]:bg-[#ecf2fd] 
                              [&::-webkit-scrollbar-thumb]:bg-[#ecf2fd] 
                               dark:[&::-webkit-scrollbar-track]:bg-neutral-[#ecf2fd] 
                                 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-[#ecf2fd]"
              >
                {uniqueTypes?.map((item: any) => (
                  <button
                    key={item}
                    className={`uppercase font-semibold py-2 md:px-5 px-3 whitespace-nowrap ${filter === item ? "bg-[#1A80F8] text-white" : ""
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
                className="flex text-[13px] md:space-x-8 space-x-4 rounded-lg overflow-auto relative overflow-x-scroll  [&::-webkit-scrollbar] [&::-webkit-scrollbar]:h-[1px] 
                              [&::-webkit-scrollbar-track]:bg-[#ecf2fd] 
                              [&::-webkit-scrollbar-thumb]:bg-[#ecf2fd] 
                               dark:[&::-webkit-scrollbar-track]:bg-[#ecf2fd] 
                                 dark:[&::-webkit-scrollbar-thumb]:bg-[#ecf2fd]"
              >
                {["All", ...statusTypes]?.map((item: any) => (
                  <button
                    key={item}
                    className={`font-medium py-1 md:px-7 px-6 whitespace-nowrap border-[1px] border-[#E5E8EA]  ${statusFilter === item ? "bg-[#1b2d51] text-white" : "bg-[#ffffff] text-[#6A7586]"
                      } rounded-full`}
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
                      <div className="flex items-center justify-between mb-3">
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
                      <Link href={"/series/" + urlStringEncode(series?.title + "-" + series?.season) + "/" + series.cid}>
                        <div className="md:pt-4 pt-3">
                          <div className="hidden md:flex justify-between items-center text-[14px]">


                            <div className="flex items-center space-x-2 font-medium w-[162px] md:w-[50%]">
                              <div className="flex items-center space-x-2">
                                <Image loading="lazy"
                                  src={series?.logo ? series?.logo : "/assets/img/series/ipl.webp"}
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



                            <div className="font-semibold text-end w-[50%]">
                              <div className="text-[#144280]">
                                <div className=" font-semibold text-end">

                                  <p className="text-[#2F335C] text-[14px]">
                                    {format(new Date(series.datestart), "dd MMMM")} -
                                    {format(new Date(series.dateend), "dd MMMM yyyy")}


                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="md:hidden flex items-center justify-between">

                            <div className=" flex items-center gap-3 text-[14px]">
                              <div className="flex items-center space-x-2">
                                <Image loading="lazy"
                                  src={series?.logo ? series?.logo : "/assets/img/series/ipl.webp"}
                                  className="h-[50px] w-[50px] rounded-lg"
                                  width={50}
                                  height={50}
                                  alt={series?.title}
                                />

                              </div>

                              <div className="">
                                <p className="font-semibold">
                                  {series?.title}
                                </p>

                                <p className="text-[#586577] text-[13px] ">
                                  {format(new Date(series.datestart), "dd MMMM")} -
                                  {format(new Date(series.dateend), "dd MMMM yyyy")}
                                </p>
                              </div>
                            </div>



                            <Image
                              src="/assets/img/arrow.png"
                              className="rotate-[270deg]"
                              width={10}
                              height={15}
                              alt=""
                              loading="lazy"
                            />



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

        <div className="lg:col-span-4 md:col-span-5">
          <PLSeries />
          <SeriesListNews></SeriesListNews>
        </div>

      </div>
    </section>
  );
}
