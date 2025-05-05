"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { format, isSameDay } from "date-fns";
import Link from "next/link";
import { urlStringEncode } from "../../utils/utility";
import CountdownTimer from "./../components/countdownTimer";

interface MatchItem {
  match_info: any;
}

const WeeklySlider = () => {

  const [featuredMatch, setFeaturedMatch] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/match/featuredMatches", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_TOKEN}`,
      },
      cache: "no-store",
    })
      .then((res) => res.json())
      .then((res) => {

        if (res.success) {

          const futuredM = res?.data?.map(({ match_info, ...rest }: MatchItem) => ({
            ...match_info,
            ...rest
          }));

          setFeaturedMatch(futuredM);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const [activeIndex, setActiveIndex] = useState(0);
  const [slides, setSlides] = useState<any[]>([]); // Use state to store the slides

  useEffect(() => {
    if (featuredMatch && featuredMatch.length > 0) {
      // Transform the data only once after the component mounts
      const transformedSlides = featuredMatch.map((match: any) => ({
        teams: [
          { country: match?.teama?.short_name, flag: match?.teama?.logo_url },
          { country: match?.teamb?.short_name, flag: match?.teamb?.logo_url },
        ],
        countdown: match?.date_start_ist,
        match: match?.competition?.title + " " + match?.competition?.season,
        subtitle: match?.subtitle,
        title: match?.competition?.title,
        season: match?.competition?.season,
        match_id: match?.match_id,
        odds: match?.live_odds,
        teamList: match,
        cid: match?.competition?.cid,
      }));
      setSlides(transformedSlides); // Store the transformed data
    }
  }, [featuredMatch]); // Re-run when featuredMatch changes

  const handlePrevClick = () => {
    setActiveIndex(activeIndex === 0 ? slides.length - 1 : activeIndex - 1);
  };

  const handleNextClick = () => {
    setActiveIndex(activeIndex === slides.length - 1 ? 0 : activeIndex + 1);
  };

  return (
    <div className="cust-slider-container w-full overflow-hidden my-4 ">

      <div
        className="cust-slider w-full flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {slides.map((slide: any, index: number) => (
          <div key={index} className="cust-slide w-full flex-shrink-0">
            <div className="rounded-lg p-4 mb-2 bg-[#ffffff]">
              <div className="flex items-center justify-between md:mb-4 mb-2">
                  <div
                    className="flex space-x-2 w-[45%] text-[13px] items-center text-[#0F55A5] rounded-full pr-3 font-semibold"
                    style={{ gap: 3 }}
                  >
                    <div className="w-[8px] h-[8px] bg-[#0F55A5] rounded-full animate-blink"></div> FEATURED
                  
                </div>
                <div className="h-[20px] border-l-[1px] border-[#efefef]" />
                <div className="flex items-center justify-end space-x-2 w-[50%] ">
                  <span className="text-[13px] text-[#1F2937] font-medium">
                    {slide?.teamList?.[parseFloat(slide?.odds?.matchodds?.teama?.back) < parseFloat(slide?.odds?.matchodds?.teamb?.back) ? 'teama' : 'teamb']?.short_name}
                  </span>
                  <span className="flex  items-center md:bg-[#FAFFFC] bg-[#00a632] border-[1px] md:border-[#0B773C] border-[#00a632] md:rounded-full rounded-md md:text-[#0B773C] text-[#ffffff] pr-2">
                    
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
                    
                    {
                      (parseFloat(slide?.odds?.matchodds?.teama?.back) < parseFloat(slide?.odds?.matchodds?.teamb?.back)
                        ? slide?.odds?.matchodds?.teama?.back
                        : slide?.odds?.matchodds?.teamb?.back) > 0
                        ? Math.round((parseFloat(slide?.odds?.matchodds?.teama?.back) < parseFloat(slide?.odds?.matchodds?.teamb?.back)
                          ? slide?.odds?.matchodds?.teama?.back
                          : slide?.odds?.matchodds?.teamb?.back) * 100 - 100)
                        : 0
                    }
                  </span>
                  <span className="flex items-center md:bg-[#FFF7F7] bg-[#ea2323] border-[1px] md:border-[#A70B0B] border-[#ea2323]  md:rounded-full rounded-md md:text-[#A70B0B] text-[#ffffff] pr-2">
                    
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
                    {
                      (parseFloat(slide?.odds?.matchodds?.teama?.lay) < parseFloat(slide?.odds?.matchodds?.teamb?.lay)
                        ? slide?.odds?.matchodds?.teama?.lay
                        : slide?.odds?.matchodds?.teamb?.lay) > 0
                        ? Math.round((parseFloat(slide?.odds?.matchodds?.teama?.lay) < parseFloat(slide?.odds?.matchodds?.teamb?.lay)
                          ? slide?.odds?.matchodds?.teama?.lay
                          : slide?.odds?.matchodds?.teamb?.lay) * 100 - 100)
                        : 0
                    }
                  </span>
                </div>
              </div>
              <div className="border-t-[1px] border-[#E7F2F4]" />
              <div className="md:py-4 py-2 md:mb-0 mb-2">
                <Link
                  href={
                    "/moreinfo/" +
                    urlStringEncode(
                      slide?.teams?.[0].country +
                      "-vs-" +
                      slide?.teams?.[1].country +
                      "-" +
                      slide?.subtitle +
                      "-" +
                      slide?.title +
                      "-" +
                      slide?.season
                    ) +
                    "/" +
                    slide.match_id
                  }
                >
                  <div className="flex justify-between items-center text-[14px]">
                    <div className="w-[45%]">
                      {slide.teams?.map((team: any, idx: number) => (
                        <div
                          key={idx}
                          className="flex items-center space-x-2 font-medium w-[162px] md:w-full mb-4"
                        >
                            <Image
                              loading="lazy"
                              src={team.flag}
                              alt={team.country}
                              className=" h-[25px] rounded-full"
                              width={25}
                              height={25}
                            />
                            <span className=" text-[#5e5e5e] font-medium text-[14px]">
                              {team.country}
                            </span>
                        </div>
                      ))}
                    </div>
                    <div className=" h-[70px] border-l-[1px] border-[#efefef]"></div>
                    <div className="font-semibold w-[50%] text-center">
                      {isSameDay(new Date(), slide.countdown ? new Date(slide.countdown) : '') ? (
                        <>
                          <span className="text-[13px] font-normal text-[#a45b09]">Start in</span>

                          <CountdownTimer targetTime={slide.countdown} />
                        </>

                      ) : (
                        <p className="text-[#586577] text-[13px] mb:mb-4 mb-1 font-medium">

                          {slide.countdown ? format(new Date(slide.countdown), "dd MMMM - EEEE") : ''}
                          <br />

                          <span className="text-[#144280] text-[14px] font-semibold">
                            {" "}
                            {slide.countdown ? format(new Date(slide.countdown), "hh:mm:aa") : ''}{" "}
                          </span>


                        </p>
                      )}

                    </div>
                  </div>
                </Link>
              </div>
              <div className="border-t-[1px] border-[#E7F2F4]" />
              <Link href={
                "/series/" +
                urlStringEncode(slide.match) +
                "/" +
                slide.cid
              }>
                <div className="mt-2">
                  <p className="text-[#909090] font-medium">{slide.match}</p>
                </div>
              </Link>

            </div>
          </div>
        ))}
      </div>

      {slides.length > 1 && (
        <div className="cust-slider-nav flex justify-between items-center relative py-[5px] px-[4px]">

          {/* Prev Button */}
          <button
            onClick={handlePrevClick}
            className="cust-prev-btn bg-[#ffffff] p-[7px] rounded-full"
            style={{ boxShadow: '2px 4px 5px 0px #D0CCF4' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>

          {/* Dot Navigation */}
          <div className="flex justify-center space-x-2">
            {(() => {
              const windowSize = 5;
              let start = Math.max(0, activeIndex - Math.floor(windowSize / 2));
              let end = start + windowSize;

              if (end > slides.length) {
                end = slides.length;
                start = Math.max(0, end - windowSize);
              }

              return slides.slice(start, end).map((_, idx) => {
                const realIndex = start + idx;
                return (
                  <span
                    key={realIndex}
                    className={`w-[13px] h-[4px] rounded-full cursor-pointer transition-all ${activeIndex === realIndex ? "bg-blue-500" : "bg-gray-400"
                      }`}
                    onClick={() => setActiveIndex(realIndex)}
                  />
                );
              });
            })()}
          </div>

          {/* Next Button */}
          <button
            onClick={handleNextClick}
            className="cust-next-btn bg-[#ffffff] p-[7px] rounded-full"
            style={{ boxShadow: '2px 4px 5px 0px #D0CCF4' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-3">
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </button>

        </div>
      )}



    </div>
  );
};

export default WeeklySlider;
