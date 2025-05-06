"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import DOMPurify from "dompurify";
import { truncateText } from "@/utils/utility";
import { format } from "date-fns";
import TabMenu from "./menu";

interface News {
  urlString: string;
  isPointTable:boolean;
}
export default function News({ urlString, isPointTable }: News) {
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
        default:
          return "21";
      }
    })(); // Call the function immediately

    setCatids(currentId); // Update category ID
    setActiveTab(tab); // Update active tab
  };
  useEffect(() => {
    fetch(
      `https://uccricket.live/wp-json/wp/v2/posts?_embed&&categories=${catids}`
    )
      .then((res) => res.json())
      .then((data) => setNews(data))
      .catch((err) => console.error("Error fetching news:", err));
  }, [catids]);
  return (
    <section className="lg:w-[1000px] mx-auto md:mb-0 mb-4 px-2 lg:px-0">
      <TabMenu urlString={urlString} isPointTable={isPointTable}/>

      <div className="tab-content-container">
        <div
          id="news" style={{ textShadow: 'rgb(0 0 0 / 4%) 1px 2px 3px' }}
          className={`tab-content ${activeTab === "news" ? "" : ""}`}
        >
          <div className="rounded-lg py-4 px-4 bg-[#ffffff] mb-4">
            {news.slice(0, 1)?.map((post: any, index: number) => (
              <div className="lg:grid grid-cols-12 gap-4" key={index}>
               
                <div className="col-span-6 ">
                  {post._embedded["wp:featuredmedia"]?.[0]?.media_details.sizes.medium_large.source_url && (
                     <Link href={post?.link}>
                    <Image  priority
                    style={{ boxShadow: 'rgb(180 179 179 / 29%) 0px 8px 16px' }}
                      // src={post._embedded["wp:featuredmedia"]?.[0]?.source_url}
                      src={post._embedded["wp:featuredmedia"]?.[0]?.media_details.sizes.medium_large.source_url}
                      width={300}
                      height={300}
                      alt={post?.title.rendered}
                      className="rounded-lg w-full h-48 object-cover mb-3"
                    />
                    </Link>
                  )}
                </div>
               
                <div className="col-span-6">
                
                  <p className="text-gray-500 font-normal text-[13px] mb-2 flex items-center">
                    By{" "}
                    <span className="ml-2 pr-[1px]">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        x="0px"
                        y="0px"
                        width="15"
                        height="15"
                        viewBox="0 0 48 48"
                      >
                        <polygon
                          fill="#42a5f5"
                          points="29.62,3 33.053,8.308 39.367,8.624 39.686,14.937 44.997,18.367 42.116,23.995 45,29.62 39.692,33.053 39.376,39.367 33.063,39.686 29.633,44.997 24.005,42.116 18.38,45 14.947,39.692 8.633,39.376 8.314,33.063 3.003,29.633 5.884,24.005 3,18.38 8.308,14.947 8.624,8.633 14.937,8.314 18.367,3.003 23.995,5.884"
                        ></polygon>
                        <polygon
                          fill="#fff"
                          points="21.396,31.255 14.899,24.76 17.021,22.639 21.428,27.046 30.996,17.772 33.084,19.926"
                        ></polygon>
                      </svg>
                    </span>{" "}
                    <Link href={post?._embedded?.author[0]?.link}>{post._embedded?.author[0]?.name}{" "}</Link>
                    <span className="ml-2 pr-[1px]">
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
                    {format(new Date(post?.modified), "dd MMM, yyyy")}
                  </p>
                  <h3
                    className="text-1xl font-semibold mb-1"
                    style={{ lineHeight: "21px" }}
                  ></h3>
                  <Link href={post?.link}>
                  <h4 className="text-[12px] font-semibold mb-2"  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(truncateText(post?.title.rendered,20))}} >
                                                
                                                </h4>
                                                </Link>
                  <p
                    className="text-gray-500 font-normal"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(post?.uagb_excerpt),
                    }}
                  ></p>
                  
                  <Link href={post?.link}>
                    <p className="text-[#1A80F8] font-semibold flex items-center text-[13px] pt-2 underline">
                      Read more{" "}
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
                    </p>
                  </Link>
                </div>
              </div>
            ))}

            <div className="lg:grid grid-cols-12 gap-4">
              {news.slice(1, 7)?.map((post: any, index: number) => (
                <div className="col-span-6" key={index}>
                    <div className="flex gap-3 my-5" style={{ textShadow: 'rgb(0 0 0 / 4%) 1px 2px 3px' }}>
                    <Link className="" href={post?.link}>
                      {post._embedded["wp:featuredmedia"]?.[0]?.media_details
                        .sizes.medium.source_url && (
                          
                        <Image  loading="lazy" 
                          src={
                            post._embedded["wp:featuredmedia"]?.[0]
                              .media_details.sizes.medium.source_url
                          }
                          width={90}
                          height={90}
                          alt={post?.title.rendered}
                          className="rounded-lg h-[90px]"
                          style={{ boxShadow: 'rgb(180 179 179 / 29%) 0px 8px 16px' }}
                        />
                        
                      )}
                      </Link>
                      <div>
                      <Link href={post?.link}>
                        <h2
                          className="text-[12px] font-semibold mb-2"
                          dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(
                              truncateText(post?.title.rendered, 20)
                            ),
                          }}
                        ></h2>
                        </Link>
                        <p className="text-[11px] text-gray-500 flex items-center">
                          By{" "}
                          <span className="ml-2 pr-[1px]">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              x="0px"
                              y="0px"
                              width="15"
                              height="15"
                              viewBox="0 0 48 48"
                            >
                              <polygon
                                fill="#42a5f5"
                                points="29.62,3 33.053,8.308 39.367,8.624 39.686,14.937 44.997,18.367 42.116,23.995 45,29.62 39.692,33.053 39.376,39.367 33.063,39.686 29.633,44.997 24.005,42.116 18.38,45 14.947,39.692 8.633,39.376 8.314,33.063 3.003,29.633 5.884,24.005 3,18.38 8.308,14.947 8.624,8.633 14.937,8.314 18.367,3.003 23.995,5.884"
                              ></polygon>
                              <polygon
                                fill="#fff"
                                points="21.396,31.255 14.899,24.76 17.021,22.639 21.428,27.046 30.996,17.772 33.084,19.926"
                              ></polygon>
                            </svg>
                          </span>{" "}
                          <Link href={post?._embedded?.author[0]?.link}>{post._embedded?.author[0]?.name}{" "}</Link>
                          <span className="ml-2 pr-[1px]">
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
    </section>
  );
}
