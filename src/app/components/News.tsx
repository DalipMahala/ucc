"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import DOMPurify from "dompurify";
import { truncateText } from "@/utils/utility";
import { format, isSameDay } from "date-fns";

// interface H2h {
//   newsFeeds: any | null;
// }
const News = () => {
  const [activeTab, setActiveTab] = useState("news");
  const [catids, setCatids] = useState("21");
  const [news, setNews] = useState([]);

  const handleTabClick = (tab: string) => {
    const currentId = (() => {
      switch (tab) {
        case "news":
          return "21";
        case "fantasy-cricket":
          return "80";
        case "ipl":
          return "3";
        case "pointstable2":
          return "112";
        case "pitch-report":
          return "197";
        case "prediction":
          return "180";
        default:
          return "21";
      }
    })(); // Call the function immediately

    setCatids(currentId); // Update category ID
    setActiveTab(tab); // Update active tab
  };

  useEffect(() => {
    fetch(`https://uccricket.live/wp-json/wp/v2/posts?_embed&&categories=${catids}`)
      .then((res) => res.json())
      .then((data) => setNews(data))
      .catch((err) => console.error("Error fetching news:", err));
  }, [catids]);
  // console.log("id",news);
  return (
    <div className="tab-section">
      <div className="tabs my-4">
        <div className="flex text-1xl space-x-4 p-2 bg-[#ffffff] rounded-lg overflow-auto">
          <button className={`font-medium py-2 px-3 whitespace-nowrap ${activeTab === 'news' ? 'bg-[#1A80F8] text-white rounded-md' : ''}  `} onClick={() => handleTabClick('news')}>
            News
          </button>
          <button className={`font-medium py-2 px-3 whitespace-nowrap ${activeTab === 'fantasy-cricket' ? 'bg-[#1A80F8] text-white rounded-md' : ''}  `} onClick={() => handleTabClick('fantasy-cricket')}>
            Fantasy Tips
          </button>
          <button className={`font-medium py-2 px-3 whitespace-nowrap ${activeTab === 'ipl' ? 'bg-[#1A80F8] text-white rounded-md' : ''}  `} onClick={() => handleTabClick('ipl')}>
            IPL 2025
          </button>
          {/* <button className={`font-medium py-2 px-3 whitespace-nowrap ${activeTab === 'dailyquiz2' ? 'bg-[#1A80F8] text-white rounded-md' : ''}  `}  onClick={() => handleTabClick('dailyquiz2')}>
                    Daily Quiz
                  </button> */}
          <Link href={"/points-table"} className={`font-medium py-2 px-3 whitespace-nowrap ${activeTab === 'pointstable2' ? 'bg-[#1A80F8] text-white rounded-md' : ''}  `}  >
            Points Table
          </Link>
          {/* <button className={`font-medium py-2 px-3 whitespace-nowrap ${activeTab === 'socialtrends2' ? 'bg-[#1A80F8] text-white rounded-md' : ''}  `}  onClick={() => handleTabClick('socialtrends2')}>
                    Social Trends
                  </button> */}
          <button className={`font-medium py-2 px-3 whitespace-nowrap ${activeTab === 'pitch-report' ? 'bg-[#1A80F8] text-white rounded-md' : ''}  `} onClick={() => handleTabClick('pitch-report')}>
            Pitch Report
          </button>
          <button className={`font-medium py-2 px-3 whitespace-nowrap ${activeTab === 'prediction' ? 'bg-[#1A80F8] text-white rounded-md' : ''}  `} onClick={() => handleTabClick('prediction')}>
            Prediction
          </button>
        </div>
      </div>
      <div className="tab-content-container">
        <div id="news" className={`tab-content ${activeTab === 'news' ? '' : ''}`}>
          <div className="rounded-lg py-4 px-4 bg-[#ffffff]">
            {news.slice(0, 1)?.map((post: any, index: number) => (
              <div className="lg:grid grid-cols-12 gap-4" key={index}>
                <div className="col-span-6 ">
                  {post._embedded?.["wp:featuredmedia"]?.[0]?.source_url && (
                    <Link href={post?.link}>
                      <Image loading="lazy"
                        src={post._embedded["wp:featuredmedia"]?.[0]?.source_url}

                        width={1000}
                        height={1000}
                        alt={post?.title.rendered}
                        className="rounded-lg w-full h-48 object-cover"
                      />
                    </Link>
                  )}
                </div>
                <div className="col-span-6 flex flex-col justify-between" >

                    <div>
                      <h3
                        className="text-1xl font-semibold mb-1"
                        style={{ lineHeight: "21px" }}
                      >

                      </h3>
                      <Link href={post?.link}>
                        <h2 className="text-[18px] font-semibold mb-2 leading-[24px]" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(truncateText(post?.title?.rendered, 10)) }} >

                        </h2>
                      </Link>
                      <p className="text-gray-500 font-normal" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(truncateText(post?.uagb_excerpt, 30)) }} >

                      </p>
                    </div>
                    <p className="text-gray-500 font-normal text-[13px] mt-4 flex gap-1 items-center">
                      <span className="">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="size-3"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z"
                          />
                        </svg>
                      </span>{" "}
                      <span>
                        {format(new Date(post?.modified), "dd MMM, yyyy")}
                      </span>

                    </p>



                </div>
              </div>
            ))}

            <div className="lg:grid grid-cols-12 gap-4 mt-5">
              {news.slice(1, 9)?.map((post: any, index: number) => (

                <div className="col-span-6" key={index}>

                  <div className="flex gap-3 mb-4 ">
                    <Link className="w-[25%]" href={post?.link}>
                      {post._embedded["wp:featuredmedia"]?.[0]?.media_details?.sizes?.thumbnail?.source_url && (
                        <Image loading="lazy"
                          src={post._embedded["wp:featuredmedia"]?.[0]?.media_details?.sizes?.thumbnail?.source_url}

                          width={1000}
                          height={1000}
                          alt={post?.title.rendered}
                          className="rounded-lg h-[80px] w-[90px]" />
                      )}
                    </Link>
                    <div className="w-[75%] flex flex-col justify-between">
                      <Link className="" href={post?.link}>
                        <h2 className="text-[14px] font-semibold mb-2" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(truncateText(post?.title.rendered, 8)) }} >

                        </h2>
                      </Link>
                      <p className="text-[12px] text-gray-500 flex gap-1 items-center">

                        {/* <Link href={post?._embedded?.author[0]?.link}>{post._embedded?.author[0]?.name}{" "}</Link> */}
                        <span className=" pr-[1px]">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="size-3"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z"
                            ></path>
                          </svg>
                        </span>{" "}
                        {format(new Date(post?.modified), "dd MMM, yyyy")}
                      </p>
                    </div>
                  </div>


                  <div className="border-t-[1px] border-[#E7F2F4]"></div>



                </div>


              ))}
            </div>

            <Link href={"https://uccricket.live/" + activeTab}>
              <div className="text-[#1A80F8] font-semibold flex items-center justify-center text-[13px] pt-2 underline">
                More from News{" "}
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
            </Link>
          </div>
        </div>



      </div>
    </div>

  );
}
export default News;