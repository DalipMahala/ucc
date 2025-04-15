"use client"; // Mark this file as a client component

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { urlStringEncode } from "../../utils/utility";
import FeatureNews from "@/app/components/FeatureNews";
import { format, isSameDay } from "date-fns";
import CountdownTimer from "./countdownTimer";

interface Series {
  featuredSeries: any;
}
export default function FeatureSeries({ featuredSeries }: Series) {
  const series = featuredSeries;
  const [matches, setMatches] = useState<any[]>([]); // Explicitly set type as an array of 'any'

  useEffect(() => {
    async function fetchMatches() {
      if (!series || series.length === 0) return;

      try {
        const matchPromises = series.map(async (feature: any) => {
          const response = await fetch(`/api/series/SeriesPointsTableMatches`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_TOKEN}`,
            },
            body: JSON.stringify({ cid: feature.cid }), // Send cid in the body
          });

          // console.log(`Response for CID ${feature.cid}:`, response.status);

          if (!response.ok) {
            console.error(
              `Error: API returned ${response.status} for CID ${feature.cid}`
            );
            return null; // Skip failed requests
          }

          const result = await response.json();
          let items = result?.data?.items || [];

          // 🔹 Filter items based on status
          let filteredItem =
            items.find((item: any) => item.status === 1) ||
            items.find((item: any) => item.status === 3);

          return { [feature.cid]: filteredItem || null };
        });

        const matchesData = await Promise.all(matchPromises);
        const mergedMatches = Object.assign({}, ...matchesData);
        setMatches(mergedMatches);
      } catch (error) {
        console.error("Error fetching matches:", error);
      }
    }

    fetchMatches();
  }, [series]);
  // console.log("response", matches);
  return (
    <>
      {series &&
        series.map((feature: any, index: number) => (
          <React.Fragment key={index}>
            <div className="flex items-center justify-center py-4">
              <div className="flex items-center space-x-4 w-full">
                <div className="flex-grow h-0.5 bg-gray-300"></div>
                <h2 className="md:text-[24px] text-[18px] text-black font-bold whitespace-nowrap">
                  {feature.title} {feature.season}
                </h2>
                <div className="flex-grow h-0.5 bg-gray-300"></div>
              </div>
            </div>
            <div className="lg:grid grid-cols-12 gap-4">
              <div className="col-span-2"></div>

              <div className="col-span-8">
                <div className="mb-4">
                  <div
                    className="flex text-1xl md:space-x-8 space-x-4 p-2 bg-[#ffffff] rounded-lg overflow-auto relative overflow-x-auto  [&::-webkit-scrollbar] [&::-webkit-scrollbar]:h-[5px] 
    [&::-webkit-scrollbar-track]:bg-gray-100 
    [&::-webkit-scrollbar-thumb]:bg-[#DFE9F6] 
    dark:[&::-webkit-scrollbar-track]:bg-neutral-700 
    dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
                  >
                    <button className="font-medium py-2 md:px-5 px-2 bg-[#1A80F8] text-white rounded-md whitespace-nowrap">
                      <span>Fixtures</span>
                    </button>
                    <Link
                      href={
                        "/series/" +
                        urlStringEncode(feature.title + "-" + feature.season) +
                        "/" +
                        feature.cid +
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
                        urlStringEncode(feature.title + "-" + feature.season) +
                        "/" +
                        feature.cid +
                        "/stats/most-run"
                      }
                    >
                      <button className="font-medium py-2 px-3 whitespace-nowrap">
                        Stats
                      </button>
                    </Link>
                    <Link
                      href={
                        "/series/" +
                        urlStringEncode(feature.title + "-" + feature.season) +
                        "/" +
                        feature.cid +
                        "/squads"
                      }
                    >
                      <button className="font-medium py-2 px-3 whitespace-nowrap">
                        Squads
                      </button>
                    </Link>
                  </div>
                </div>

                {/* <!-- SCHEDULED match desktop view start --> */}
                {matches[feature.cid] && (
                  <div className="lg:block hidden rounded-lg p-4 mb-4 bg-[#ffffff] hover:shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <div
                          className={`flex items-center text-[12px] uppercase ${matches[feature.cid]?.status == 3 ? "text-[#A70B0B]" : "text-[#A45B09]"} rounded-full pr-2 font-semibold`}
                          style={{ gap: "3px" }}
                        >
                          <div className="w-[8px] h-[8px] bg-[#A45B09] rounded-full"></div> {matches[feature.cid]?.status_str}
                        </div>
                        <div>
                          <h4 className="text-[13px] font-semibold pl-[15px] border-l-[1px] border-[#E4E9F0]">
                            {matches[feature.cid]?.competition?.title}
                          </h4>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-[11px] text-[#1F2937] font-semibold">{matches[feature.cid]?.teama?.short_name}</span>
                        <span className="flex items-center bg-[#FAFFFC] border-[1px] border-[#0B773C] rounded-full text-[#0B773C] pr-2">
                          <span className="">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              className="h-[14px] w-[17px]"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M8.25 6.75 12 3m0 0 3.75 3.75M12 3v18"
                              />
                            </svg>
                          </span>
                          0
                        </span>
                        <span className="flex items-center bg-[#FFF7F7] border-[1px] border-[#A70B0B]  rounded-full text-[#A70B0B] pr-2">
                          <span className="">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              className="h-[14px] w-[17px]"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15.75 17.25 12 21m0 0-3.75-3.75M12 21V3"
                              />
                            </svg>
                          </span>
                          0
                        </span>
                      </div>
                    </div>

                    <div className="border-t-[1px] border-[#E7F2F4]"></div>
                    <Link href="/scheduled/infoUpcoming-match">
                      <div className="py-4 px-3">
                        <div className="flex justify-between items-center text-[14px]">
                          <div className="w-[50%]">
                            <p className="text-[#586577] text-[13px] mb-4 font-medium">
                              {matches[feature.cid]?.subtitle}, {matches[feature.cid]?.venue?.location}, {matches[feature.cid]?.venue?.country}
                            </p>
                            <div className="flex items-center space-x-2 font-medium w-[162px] md:w-full mb-4">
                              <div className="flex items-center space-x-2">
                                <Image
                                  src={matches[feature.cid]?.teama?.thumb_url}
                                  className="h-[30px] rounded-full"
                                  width={30}
                                  height={30}
                                  alt="aus"
                                  loading="lazy"
                                />
                                <span className="text-[#586577] font-medium text-[14px]">
                                  {matches[feature.cid]?.teama?.short_name}
                                </span>
                              </div>
                            </div>

                            <div>
                              <div className="flex items-center space-x-2 font-medium w-[162px] md:w-full">
                                <div className="flex items-center space-x-2">
                                  <Image
                                    src={matches[feature.cid]?.teamb?.thumb_url}
                                    className="h-[30px]"
                                    width={30}
                                    height={30}
                                    alt="ind"
                                    loading="lazy"
                                  />
                                  <span className="text-[#586577] font-medium text-[14px]">
                                    {matches[feature.cid]?.teamb?.short_name}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="h-[100px] border-l-[1px] border-[#efefef]"></div>

                          <div className="w-[50%] font-medium text-center">
                          {isSameDay(new Date(), new Date(matches[feature.cid]?.date_start_ist)) ? (
                                       <>
                                       <span className="text-[13px] font-normal text-[#a45b09]">Start in</span> 

                                        <CountdownTimer targetTime={matches[feature.cid]?.date_start_ist} />
                                        </> 

                                      ) : (
                            <p className="text-[#2F335C] text-[14px]">
                              {format(new Date(matches[feature.cid]?.date_start_ist), "dd MMMM - EEEE")}, <br /> {format(new Date(matches[feature.cid]?.date_start_ist), "hh:mm:aa")}
                            </p>
                             )}
                          </div>
                        </div>
                      </div>
                    </Link>
                    <div className="border-t-[1px] border-[#E7F2F4]"></div>

                    <div className="flex items-center justify-between space-x-5 mt-3">
                      <div className="flex items-center">
                        <Link
                          href={
                            "/series/" +
                            urlStringEncode(
                              feature.title + "-" + feature.season
                            ) +
                            "/" +
                            feature.cid +
                            "/points-table"
                          }
                        >
                          <p className="   text-[#909090] font-semibold">
                            {" "}
                            Points Table
                          </p>
                        </Link>
                        <div className="h-[20px] border-l-[1px] mx-5 border-[#d0d3d7]"></div>
                        <Link
                          href={
                            "/series/" +
                            urlStringEncode(
                              feature.title + "-" + feature.season
                            ) +
                            "/" +
                            feature.cid +
                            "/schedule-results/schedule"
                          }
                        >
                          <p className="  text-[#909090] font-semibold">Schedule</p>
                        </Link>
                      </div>
                      {matches[feature.cid]?.format_str && ['T20I', 'T20', 'Test', 'Odi'].includes(matches[feature.cid]?.format_str) &&
                                <Link href={("/h2h/"+urlStringEncode(matches[feature.cid]?.teama?.name+"-vs-"+matches[feature.cid]?.teamb?.name)+"-head-to-head-in-"+matches[feature.cid]?.format_str).toLowerCase()}>
                         
                        <div className="flex mt-2 justify-end items-center space-x-2">
                          <Image
                            src="/assets/img/home/handshake.png"
                            width={25}
                            height={25}
                            alt=""
                            loading="lazy"
                          />
                          <span className="text-[#586577] font-medium">
                            H2H
                          </span>
                        </div>
                      </Link>
                      }
                    </div>
                  </div>
                )}
                {/* <!-- SCHEDULED match desktop view end -->

<!-- SCHEDULED match mobile view start --> */}
                {matches[feature.cid] && (
                  <div className="lg:hidden rounded-lg p-4 mb-4 bg-[#ffffff] performance-section relative">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div
                          className={`flex items-center ${matches[feature.cid]?.status == 3 ? "text-[#A70B0B]" : "text-[#A45B09]"} uppercase rounded-full font-semibold`}
                          style={{ gap: "3px" }}
                        >
                          <span className="rounded-full">●</span> {matches[feature.cid]?.status_str}
                        </div>
                        <div>
                          <h4 className="text-[14px] font-semibold pl-[10px] border-l-[1px] border-[#E4E9F0]">
                            {matches[feature.cid]?.competition?.title}
                          </h4>
                        </div>
                        <span className="absolute right-[12px] top-[19px]">
                          <button className="arro-button">
                            <Image
                              src="/assets/img/arrow.png"
                              className=""
                              width={10}
                              height={15}
                              alt=""
                              loading="lazy"
                            />
                          </button>
                        </span>
                      </div>
                    </div>

                    <div className="border-t-[1px] border-[#E7F2F4]"></div>
                    <div className="open-Performance-data">
                      <div className="py-2 pb-3">
                        <p className="text-[#586577] text-[13px] mb-4 font-medium">
                          {matches[feature.cid]?.subtitle}, {matches[feature.cid]?.venue?.name} {matches[feature.cid]?.venue?.location}, {matches[feature.cid]?.venue?.country}
                        </p>
                        <div className="flex justify-between items-center text-[14px]">
                          <div className="">
                            <div className="items-center space-x-2 font-medium w-[162px] md:w-full mb-4">
                              <div className="flex items-center space-x-2">
                                <Image
                                  src={matches[feature.cid]?.teama?.thumb_url}
                                  className="h-[30px] rounded-full"
                                  width={30}
                                  height={30}
                                  alt="aus"
                                  loading="lazy"
                                />
                                <div>
                                  <span className="flex items-center gap-1">
                                    <span className="text-[#5e5e5e] font-medium">
                                      {matches[feature.cid]?.teama?.short_name}
                                    </span>
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div>
                              <div className="flex items-center space-x-2 font-medium w-[162px] md:w-full">
                                <div className="flex items-center space-x-2">
                                  <Image
                                    src={matches[feature.cid]?.teamb?.thumb_url}
                                    className="h-[30px] rounded-full"
                                    width={30}
                                    height={30}
                                    alt="aus"
                                    loading="lazy"
                                  />
                                  <div>
                                    <span className="flex items-center gap-1">
                                      <span className="text-[#5e5e5e] font-medium">
                                        {matches[feature.cid]?.teamb?.short_name}
                                      </span>
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="h-[100px] border-l-[1px] border-[#E7F2F4]"></div>

                          <div className="">
                            <div className=" font-medium text-center">
                              <p className="text-[#2F335C] font-medium mt-1 text-[13px]">
                                
                                {format(new Date(matches[feature.cid]?.date_start), "dd MMMM - EEEE")}
                                <br />
                                {format(new Date(matches[feature.cid]?.date_start), "hh:mm:aa")}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="border-t-[1px] border-[#E7F2F4]"></div>

                      <div className="flex items-center justify-between space-x-5 mt-2">
                        <div className="flex items-center">
                          <Link
                            href={
                              "/series/" +
                              urlStringEncode(
                                feature.title + "-" + feature.season
                              ) +
                              "/" +
                              feature.cid +
                              "/points-table"
                            }
                          >
                            <p className=" text-[#586577] text-[13px] font-medium">
                              {" "}
                              Points Table
                            </p>
                          </Link>
                          <div className="h-[20px] border-l-[1px] mx-5 border-[#d0d3d7]"></div>
                          {matches[feature.cid]?.format_str && ['T20I', 'T20', 'Test', 'Odi'].includes(matches[feature.cid]?.format_str) &&
                                <Link href={("/h2h/"+urlStringEncode(matches[feature.cid]?.teama?.name+"-vs-"+matches[feature.cid]?.teamb?.name)+"-head-to-head-in-"+matches[feature.cid]?.format_str).toLowerCase()}>
                         
                          <div className="flex justify-end items-center space-x-2">
                            <Image
                              src="/assets/img/home/handshake.png"
                              className="h-[15px]"
                              width={17}
                              height={17}
                              style={{ width: "17px", height: "17px" }}
                              alt=""
                              loading="lazy"
                            />
                            <span className="text-[#586577] text-[13px] font-medium">
                              H2H
                            </span>
                          </div>
                          </Link>
                        }
                        </div>

                        <div className="flex items-center space-x-2 text-[13px]">
                          <span className="text-[#586577] font-medium">
                            {matches[feature.cid]?.teama?.short_name}
                          </span>
                          <span className="flex items-center bg-[#00a632] border-[1px] border-[#00a632] rounded-md text-[#ffffff] pr-2">
                            <span className="">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="h-[14px] w-[17px]"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M8.25 6.75 12 3m0 0 3.75 3.75M12 3v18"
                                ></path>
                              </svg>
                            </span>
                            0
                          </span>
                          <span className="flex items-center bg-[#ea2323] border-[1px] border-[#ea2323]  rounded-md text-[#ffffff] pr-2">
                            <span className="">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="h-[14px] w-[17px]"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M15.75 17.25 12 21m0 0-3.75-3.75M12 21V3"
                                ></path>
                              </svg>
                            </span>
                            0
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {/* <!-- SCHEDULED match mobile view end --> */}
                <FeatureNews newsUrl={feature?.newUrl}></FeatureNews>
              </div>

              <div className="col-span-2"></div>
            </div>
          </React.Fragment>
        ))}
    </>
  );
}
