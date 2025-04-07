"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { urlStringEncode } from "./../../../utils/utility";
import { format } from "date-fns";

interface HeaderProps {
  seriesData: any[]; // Adjust type based on your data
  seriesInfo: any;
}
export default function IplBanner({
  seriesData = [],
  seriesInfo,
}: HeaderProps) {
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  // Default images array if seriesData is empty
  const images = seriesData?.map((item) => ({
    url: `/series/${urlStringEncode(item.title + "-" + item.season)}/${
      item.cid
    }`,
    src: item?.logo ? item?.logo : "/assets/img/series/series-1.png",
  }));

  // Get previous, current, and next series info
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
    ? `/series/${urlStringEncode(
        result.next.title + "-" + result.next.season
      )}/${result.next.cid}`
    : "";
  const backUrl = result?.previous
    ? `/series/${urlStringEncode(
        result.previous.title + "-" + result.previous.season
      )}/${result.previous.cid}`
    : "";

    const nextImage = result?.next?.logo ? result?.next?.logo : "/assets/img/series/series-1.png";
    const currentImage = result?.current?.logo ? result?.current?.logo : "/assets/img/series/series-1.png";
console.log(result?.next?.logo);
  // Handle slider scrolling
  const handleScroll = (direction: "left" | "right") => {
    if (!sliderRef.current) return;

    const slider = sliderRef.current;
    const slideWidth = slider.children[0]?.clientWidth + 80 || 200; // Default width fallback

    if (direction === "right" && scrollPosition < images.length - 3) {
      setScrollPosition((prev) => prev + 1);
      slider.scrollBy({ left: slideWidth, behavior: "smooth" });
    } else if (direction === "left" && scrollPosition > 0) {
      setScrollPosition((prev) => prev - 1);
      slider.scrollBy({ left: -slideWidth, behavior: "smooth" });
    }
  };

  return (
    <section className="bg-[#0E2149]">
      <div
        className="lg:w-[1000px] mx-auto text-white pt-5 pb-10 "
        style={{ paddingTop: "37px" }}
      >
        <div className="flex items-center justify-between md:p-4 max-w-6xl mx-auto">
          {/* Left Arrow */}
          {backUrl !== "" ? (
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
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
            </Link>
          ) : (
            ""
          )}
          {/* Content Section */}
          {/* Content Section full screen  */}
          <div className="hidden md:flex flex-grow items-center justify-between px-6 ">
            {/* Left Section */}
            <div className="flex items-center space-x-4">
              <Image  loading="lazy" 
                src={currentImage}
                alt="Event Logo"
                className="md:h-[70px] lg:h-[100px] rounded-full"// border-[2px] border-[solid] border-color-[#7779a8]
                width={100}
                height={100}
              />
              <div>
                <h2 className="lg:text-2xl md:text-[17px] font-semibold">
                  {seriesInfo?.title} {seriesInfo?.season}
                </h2>
                <p className="lg:text-sm md:text-[14px] text-gray-300 mb-2">
                  {seriesInfo?.game_format} - {seriesInfo?.total_matches} Matches
                  - {seriesInfo?.total_teams} Teams |{" "}
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
            {/* Right Section */}
            {result?.next?.title ? (
              <div className="flex items-center space-x-4">
                <p className="text-sm">
                  {result?.next?.title}
                  <br />
                  {result?.next?.season}
                </p>
                <div className="flex items-center justify-center w-12 h-12 rounded-full">
                  <Image  loading="lazy" 
                    src={nextImage}
                    width={40}
                    height={40}
                    alt="Series Logo"
                    className="rounded-full w-12 h-12 "
                  />
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
          {/* Content Section mobile screen  */}
          <div className="md:hidden">
            <div className="relative">
              {/* Left Arrow */}
              {backUrl !== "" ? (
                <Link href={backUrl}>
                  <button
                    id="left-arrow"
                    className={`absolute left-[6px] top-1/2 -translate-y-1/2 bg-[#ffffff] p-[7px] rounded-full border-2 ${
                      scrollPosition === 0 ? "hidden" : ""
                    }`}
                    onClick={() => handleScroll("left")}
                    style={{ zIndex: 1 }}
                  >
                    <span className="text-[20px] font-bold">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="size-3 text-[black]"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.75 19.5 8.25 12l7.5-7.5"
                        ></path>
                      </svg>
                    </span>
                  </button>
                </Link>
              ) : (
                ""
              )}
              {/* Slider */}
              <div className="relative overflow-hidden mx-4">
                <div
                  id="series"
                  ref={sliderRef}
                  className="flex gap-3 transition-transform duration-300 overflow-x-hidden"
                >
                  {images?.map((image: any, index: number) => (
                    <div key={index} className="flex-none w-1/5">
                      <Link
                        href={image.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Image  loading="lazy" 
                          src={image.src}
                          alt={`series-${index + 1}`}
                          width={70}
                          height={70}
                        />
                      </Link>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Arrow */}
              {nextUrl !== "" ? (
                <Link href={nextUrl}>
                  <button
                    id="right-arrow"
                    className={`absolute right-[31px] top-1/2 -translate-y-1/2 bg-[#ffffff] p-[7px] rounded-full border-2 ${
                      scrollPosition >= images.length - 5 ? "hidden" : ""
                    }`}
                    onClick={() => handleScroll("right")}
                    style={{ zIndex: 1 }}
                  >
                    <span className="text-[20px] font-bold">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="size-3 text-[black]"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m8.25 4.5 7.5 7.5-7.5 7.5"
                        ></path>
                      </svg>
                    </span>
                  </button>
                </Link>
              ) : (
                ""
              )}
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
          {nextUrl !== "" ? (
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
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </Link>
          ) : (
            ""
          )}
        </div>
      </div>
    </section>
  );
}
