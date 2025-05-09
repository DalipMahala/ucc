"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from 'next/link';
import DOMPurify from "dompurify";
import { format } from "date-fns";
import { textLimit } from "@/utils/utility";

function SeriesListNews() {
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

        <>
        {news.slice(0, 10)?.map((post: any, index: number) => (
             <div className="flex gap-3 my-4 p-4 bg-[#ffffff] rounded-lg " key={index}>
                    <Link className="w-[45%]" href={post?.link}>
                    {post._embedded["wp:featuredmedia"]?.[0]?.media_details
                        .sizes.medium.source_url && (
                        <Image priority
                          src=
                          {post._embedded["wp:featuredmedia"]?.[0]
                            .media_details.sizes.medium.source_url
                        }
                          width={300}
                          height={144}
                          alt=""
                          className="rounded-lg h-[90px] w-[100%]" />
                        )}
                    </Link>
                    <div className="w-[55%] flex flex-col justify-between">
                      <Link className="" href={post?.link}>
                        <h2 className="text-[14px] font-semibold mb-2 hover:text-[#1a80f8]" dangerouslySetInnerHTML={{
                                                    __html: DOMPurify.sanitize(
                                                        textLimit(post?.title.rendered,60)
                                                    ),
                                                  }}>
                        </h2>
                      </Link>
                      <p className="text-[12px] text-gray-500 flex gap-1 items-center">
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
            ))}

        </>
    )
}

export default SeriesListNews