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
    <div className="lg:grid grid-cols-12 gap-4 mt-4">
      {/* Main News Item */}
      {news.slice(0, 1)?.map((post: any, index: number) => (
        <div
          className="col-span-6 border-r-[1px] border-[#E7F2F4] pr-[16px]"
          key={index}
        >
          {post._embedded?.["wp:featuredmedia"]?.[0]?.source_url && (
            <Image  loading="lazy" 
              src={post._embedded["wp:featuredmedia"]?.[0]?.source_url}
              width={300}
              height={300}
              alt={post?.title.rendered}
              className="rounded-lg w-full h-48 object-cover mb-3"
            />
          )}

          <h3
            className="text-1xl font-semibold mb-1"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(
                truncateText(post?.title.rendered, 20)
              ),
            }}
          ></h3>

          <p
            className="text-gray-500 font-normal"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(post?.uagb_excerpt),
            }}
          ></p>
          <div className="border-l-[1px] border-[#E7F2F4]" />
        </div>
      ))}
      {/* Side News Items */}
      
      <div className="col-span-6">
      {news.slice(1, 4)?.map((post: any, index: number) => (
        <React.Fragment key={index}>
          <Link href={post?.link}>
          <div className="flex gap-3 my-3">
            {post._embedded["wp:featuredmedia"]?.[0]?.media_details.sizes
              .thumbnail.source_url && (
                <Image  loading="lazy" 
                  src={post._embedded["wp:featuredmedia"]?.[0].media_details.sizes
                    .thumbnail.source_url}
                  width={90}
                  height={90}
                  alt={post?.title.rendered}
                  className="rounded-lg h-[90px]" />
              )}
            <div>
              <h4
                className="text-[13px] font-semibold mb-2"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(
                    truncateText(post?.title.rendered, 20)
                  ),
                }}
              ></h4>
              <p className="text-[12px] text-gray-500 flex items-center">
                <span className="ml-2 pr-[1px]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    width={15}
                    height={15}
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
                {post._embedded?.author[0]?.name}{" "}
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
        </Link><div className="border-t-[1px] border-[#E7F2F4]" />
        </React.Fragment>
      ))}
      </div>
    </div>
  );
}
