"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { urlStringEncode } from "@/utils/utility";
import { format } from "date-fns";
import SeriesListNews from "@/app/series/seriesComponents/SeriesListNews";
import PLSeries from "@/app/components/popularSeries";


interface SeriesList {
  tournamentsList: any | null;
}
export default function SeriesList({ tournamentsList }: SeriesList) {
  
    const seriesList = tournamentsList.filter(
        (item: { total_teams: number }) => item.total_teams > 2
      );

  console.log(seriesList);
  return (
    <section className="lg:w-[1000px] mx-auto md:mb-0 px-2 lg:px-0">
      <div className="md:grid grid-cols-12 gap-4">
        <div className="lg:col-span-8 md:col-span-7">
          <div className="tab-section">
           


            <div className="lg:col-span-8 md:col-span-7"></div>
            <div className="lg:col-span-8 md:col-span-7">
              <div className="upcomingMatch"></div>
            </div>
            {seriesList?.map((series: any, index: number) => (
              <div className="lg:col-span-8 md:col-span-7" key={index}>
                <div className="rounded-lg bg-[#ffffff] my-4 p-4">
                  <div>
                    <div className="md:px-2">
                      
                      <Link href={"/series/" + urlStringEncode(series?.title + "-" + series?.season) + "/" + series.cid+"/points-table"}>
                        <div className="md:pt-4 pt-3">
                          <div className="hidden md:flex justify-between items-center text-[14px]">


                            <div className="flex items-center space-x-1 font-medium w-[162px] md:w-[50%] ">
                              <div className="flex items-center space-x-2 ">
                                <Image loading="lazy"
                                  src={series?.logo ? series?.logo : "/assets/img/series/ipl.webp"}
                                  className="h-[30px] rounded-full"
                                  width={30}
                                  height={30}
                                  alt={series?.title}
                                />
                                <div className="flex flex-col">
                                    <span className="font-semibold">
                                    {series?.title}
                                    </span>
                                    <span className="text-[13px] font-medium">Total Match - {series?.total_matches}</span>
                                </div>
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
