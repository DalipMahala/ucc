"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import DOMPurify from "dompurify";
import { truncateText } from "@/utils/utility";
import { format } from "date-fns";

interface News {
  urlString: string;
}
export default function NewsSection({ urlString }: News) {
  const activeTab = "news";
  const [news, setNews] = useState([]);
  useEffect(() => {
    fetch(`https://uccricket.live/wp-json/wp/v2/posts?_embed&&categories=21`)
      .then((res) => res.json())
      .then((data) => setNews(data))
      .catch((err) => console.error("Error fetching news:", err));
  }, [21]);
  return (
    <>

      {/* Main News Item */}
      {news.slice(0, 1)?.map((post: any, index: number) => (
        <div
          className="lg:grid grid-cols-12 gap-4 mt-4"
          key={index}
        >
          <div className="col-span-6">
            {post._embedded["wp:featuredmedia"]?.[0]?.media_details?.sizes?.medium_large.source_url && (
              <Link href={post?.link}>
                <Image priority
                  // src={post._embedded["wp:featuredmedia"]?.[0]?.source_url}
                  src={post._embedded["wp:featuredmedia"]?.[0]?.media_details?.sizes?.medium_large.source_url}
                  width={307}
                  height={192}
                  alt={post?.title.rendered}
                  className="rounded-lg w-full h-48 object-cover"
                />
              </Link>
            )}

          </div>
          <div className="col-span-6 flex justify-between flex-col">
            <div>
              <Link href={post?.link}>
                <h2
                  className="text-[18px] font-semibold mb-2 leading-[24px] hover:text-[#1a80f8]"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(
                      truncateText(post?.title.rendered, 8)
                    ),
                  }}
                >

                </h2>
              </Link>

              <p
                className="text-gray-500 font-normal"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(truncateText(post?.uagb_excerpt, 30)),
                }}
              >

              </p>
            </div>
            <p className="text-gray-500 font-normal text-[13px] mt-2 flex items-center">

              <span className="pr-[4px]">
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

          </div>

        </div>
      ))}

      <div className="lg:grid grid-cols-12 gap-4 mt-4">
        <div className="col-span-12">
          {news.slice(1, 4)?.map((post: any, index: number) => (
            <React.Fragment key={index}>

              <div className="flex gap-3 my-3">
                <Link href={post?.link} className="w-[30%]">
                  {post._embedded["wp:featuredmedia"]?.[0]?.media_details?.sizes
                    ?.medium?.source_url && (
                      <Image loading="lazy"
                        src={post._embedded["wp:featuredmedia"]?.[0].media_details?.sizes
                          ?.medium?.source_url}
                        width={185}
                        height={89}
                        alt={post?.title.rendered}
                        className="rounded-lg h-[auto] w-full" />
                    )}
                </Link>


                <div className="w-[70%] flex justify-between flex-col">
                  <Link href={post?.link}>
                    <h2
                      className="text-[14px] font-semibold mb-2 hover:text-[#1a80f8]"
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(
                          post?.title.rendered
                        ),
                      }}
                    ></h2>
                  </Link>
                  <p className="text-[12px] text-gray-500 flex items-center">

                    <span className="pr-[4px]">
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


            </React.Fragment>
          ))}
        </div>

        
      </div>
<Link href="">
      
      <div className="text-[#1A80F8] font-semibold flex items-center justify-center text-[13px] pt-2 underline">More from News <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-3 ml-2"><path strokeLinecap="round" strokeLinejoin="round" d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5"></path></svg></div>
      </Link>
    </>

  );
}
