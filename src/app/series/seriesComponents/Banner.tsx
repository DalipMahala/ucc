"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { urlStringEncode } from "./../../../utils/utility";
import { format } from "date-fns";

interface HeaderProps {
  seriesData: any[];
  seriesInfo: any;
}

export default function IplBanner({
  seriesData = [],
  seriesInfo,
}: HeaderProps) {
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  const images = seriesData?.map((item) => ({
    cid: item.cid,
    url: `/series/${urlStringEncode(item.title + "-" + item.season)}/${item.cid}`,
    src: item?.header_logo ? item?.header_logo : "/assets/img/series/series-1.png",
  }));

  const previousAndNext = (data: any[], targetCid: number) => {
    const index = data.findIndex((item) => item.cid === targetCid);
    if (index === -1) return { previous: null, current: null, next: null };
    return {
      previous: data[index - 1] || null,
      current: data[index] || null,
      next: data[index + 1] || null,
    };
  };

  const result = previousAndNext(seriesData, seriesInfo?.cid);

  const nextUrl = result?.next
    ? `/series/${urlStringEncode(result.next.title + "-" + result.next.season)}/${result.next.cid}`
    : "";
  const backUrl = result?.previous
    ? `/series/${urlStringEncode(result.previous.title + "-" + result.previous.season)}/${result.previous.cid}`
    : "";

  const nextImage = result?.next?.header_logo
    ? result?.next?.header_logo
    : "/assets/img/series/series-1.png";

  const currentImage = result?.current?.header_logo
    ? result?.current?.header_logo
    : "/assets/img/series/series-1.png";

  const handleScroll = (direction: "left" | "right") => {
    if (!sliderRef.current) return;

    const slider = sliderRef.current;
    const slideWidth = slider.children[0]?.clientWidth + 80 || 200;

    if (direction === "right" && scrollPosition < images.length - 3) {
      setScrollPosition((prev) => prev + 1);
      slider.scrollBy({ left: slideWidth, behavior: "smooth" });
    } else if (direction === "left" && scrollPosition > 0) {
      setScrollPosition((prev) => prev - 1);
      slider.scrollBy({ left: -slideWidth, behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (sliderRef.current) {
      const activeElement = sliderRef.current.querySelector(".active-series");
      if (activeElement) {
        (activeElement as HTMLElement).scrollIntoView({
          behavior: "smooth",
          inline: "center",
          block: "nearest",
        });
      }
    }
  }, [seriesInfo?.cid]);

  return (
    <section className="bg-[#0E2149]">
      <div
        className="lg:w-[1000px] mx-auto text-white pt-5 pb-10"
        style={{ paddingTop: "37px" }}
      >
        <div className="flex items-center justify-between md:p-4 max-w-6xl mx-auto">
          {backUrl !== "" && (
            <Link href={backUrl}>
              <button className="md:block hidden p-2 bg-gray-700 rounded-full hover:bg-gray-600">
                <svg
                  className="w-6 h-6 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            </Link>
          )}

          {/* Desktop Content */}
          <div className="hidden md:flex flex-grow items-center justify-between px-6">
            <div className="flex items-center space-x-4">
              <Image
                loading="lazy"
                src={currentImage}
                alt="Event Logo"
                className="md:h-[70px] lg:h-[100px] rounded-full"
                width={100}
                height={100}
              />
              <div>
                <h1 className="lg:text-2xl md:text-[17px] font-semibold">
                  {seriesInfo?.title} {seriesInfo?.season}
                </h1>
                <p className="lg:text-sm md:text-[14px] text-gray-300 mb-2 capitalize">
                  {seriesInfo?.game_format} - {seriesInfo?.total_matches} Matches -{" "}
                  {seriesInfo?.total_teams} Teams |{" "}
                  {seriesInfo?.datestart
                    ? format(new Date(seriesInfo?.datestart), "dd MMMM")
                    : ""}{" "}
                  to{" "}
                  {seriesInfo?.dateend
                    ? format(new Date(seriesInfo?.dateend), "dd MMMM")
                    : ""}
                </p>
                <select className="border border-gray-500 rounded px-2 bg-[#0e2149] hidden">
                  <option>2020</option>
                  <option>2021</option>
                  <option>2022</option>
                </select>
              </div>
            </div>

            {result?.next?.title && (
              <Link href={nextUrl}>
              <div className="flex items-center space-x-4">
                <h2 className="text-sm">
                  {result?.next?.title}
                  <br />
                  {result?.next?.season}
                </h2>
                <div className="flex items-center justify-center w-12 h-12 rounded-full">
                  <Image
                    loading="lazy"
                    src={nextImage}
                    width={40}
                    height={40}
                    alt="Series Logo"
                    className="rounded-full w-12 h-12"
                  />
                </div>
              </div>
              </Link>
            )}
          </div>

          {/* Mobile Banner */}
          <div className="md:hidden">
            <div className="relative">
              <div className="relative mx-4">
                <div
                  id="series"
                  ref={sliderRef}
                  className="flex items-center gap-3 transition-transform duration-300 overflow-x-scroll 
                  [&::-webkit-scrollbar]:h-[1px] 
                  [&::-webkit-scrollbar-track]:bg-[#0e2149] 
                  [&::-webkit-scrollbar-thumb]:bg-[#0e2149]"
                >
                  {images?.map((image: any, index: number) => {
                    const isActive = image.cid === seriesInfo?.cid;
                    return (
                      <div key={index} className="flex-none w-1/4">
                        <Link href={image.url} className="flex justify-center">
                          <Image
                            loading="lazy"
                            src={image.src}
                            alt={`series-${index + 1}`}
                            width={70}
                            height={70}
                            className={` ${
                              isActive
                                ? "w-[100px] h-[90px] border-[2px] border-[#539ff9] p-2 rounded-[10px] active-series"
                                : "w-[70px] h-[70] rounded-full"
                            }`}
                          />
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="px-4 mt-5">
              <h2 className="text-[17px] font-semibold">
                {seriesInfo?.title} {seriesInfo?.season}
              </h2>
              <p className="text-[13px] text-gray-300 mb-2">
                {seriesInfo?.game_format} - {seriesInfo?.total_matches} Matches -{" "}
                {seriesInfo?.total_teams} Teams |{" "}
                {seriesInfo?.datestart
                  ? format(new Date(seriesInfo?.datestart), "dd MMMM")
                  : ""}{" "}
                to{" "}
                {seriesInfo?.dateend
                  ? format(new Date(seriesInfo?.dateend), "dd MMMM")
                  : ""}
              </p>

              <select className="border border-gray-500 rounded px-2 bg-[#0e2149] hidden">
                <option>2020</option>
                <option>2021</option>
              </select>
            </div>
          </div>

          {/* Right Arrow */}
          {nextUrl !== "" && (
            <Link href={nextUrl}>
              <button className="md:block hidden p-2 bg-gray-700 rounded-full hover:bg-gray-600">
                <svg
                  className="w-6 h-6 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
