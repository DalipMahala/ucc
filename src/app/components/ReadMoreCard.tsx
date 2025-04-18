// components/ReadMoreCard.tsx
"use client"

import { useState } from "react";
import Link from "next/link";

interface ReadMoreCardProps {
  title: string;
  content: string;
  wordLimit?: number; // Default = 100
  link?: string;      // Optional full page link
}

const ReadMoreCard = ({ title, content, wordLimit = 100, link }: ReadMoreCardProps) => {
  const words = content.trim().split(/\s+/);
  const isLong = words.length > wordLimit;
  const truncated = isLong ? words.slice(0, wordLimit).join(" ") + "..." : content;

  const [isExpanded, setIsExpanded] = useState(false);

  const handleReadMore = () => {
    setIsExpanded(true);
  };

  return (
    <div className="">
      <h3 className="text-1xl font-semibold mb-1">{title}</h3>
      <p className="text-gray-500 font-normal">
        {isExpanded || !isLong ? content : truncated}
      </p>

      {!isExpanded && isLong && (
        link ? (
          <Link href={link}>
            <a className="text-[#1A80F8] font-semibold flex items-center text-[13px] pt-2 underline">
              Read more
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
            </a>
          </Link>
        ) : (
          <button
            onClick={handleReadMore}
            className="text-[#1A80F8] font-semibold flex items-center text-[13px] pt-2 underline"
          >
            Read more
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
          </button>
        )
      )}
    </div>
  );
};

export default ReadMoreCard;
