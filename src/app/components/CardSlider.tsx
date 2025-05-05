"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {textLimit} from "@/utils/utility";

interface Story {
  title: string;
  link: string;
  description: string;
  image?: string;
}

export default function Slider() {
  const [images, setImages] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const itemsPerPage = 1.5;

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await fetch("/api", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_TOKEN}`,
          },
          cache: "no-store",
        });
        const text = await response.text();
        const parser = new DOMParser();
        const xml = parser.parseFromString(text, "text/xml");

        const items = xml.querySelectorAll("item");
        const storiesArray = Array.from(items)?.map((item) => {
          const title = item.querySelector("title")?.textContent || "";
          const link = item.querySelector("link")?.textContent || "";
          const description = item.querySelector("description")?.textContent || "";
          const imgMatch = description.match(/<img[^>]+src=["'](.*?)["']/);
          const image = imgMatch ? imgMatch[1] : "";

          return { title, link, image };
        });

        setImages(storiesArray);
      } catch (error) {
        console.error("Error fetching stories:", error);
      }
    };

    fetchStories();
  }, []);

  const handleNext = () => {
    if (currentIndex < images.length - itemsPerPage) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
    }
  };

  // Touch event handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      // Swipe left (next)
      handleNext();
    }

    if (touchStart - touchEnd < -50) {
      // Swipe right (prev)
      handlePrev();
    }
  };

  return (
    <>
      <div className="flex justify-between items-center py-4">
        <div>
          <h3 className="text-1xl font-semibold pl-[4px] border-l-[3px] border-[#2182F8]">
            Web Stories
          </h3>
        </div>
        <Link href="https://uccricket.live/web-stories/">
          <div className="text-[#1A80F8] font-semibold flex items-center justify-center text-[13px] pt-2 underline">
            View More{" "}
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
      <div className="relative w-full max-w-5xl mx-auto overflow-hidden pb-2">
        {/* Main Slider */}
        <div
          ref={sliderRef}
          className="flex gap-4 transition-transform duration-500"
          style={{ transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)` }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {images?.map((image, index) => (
            <div
              key={index}
              className="md:w-1/5 w-1/2 flex-shrink-0 relative"
              style={{ minWidth: '20%' }}
            >
              <Link href={image.link}>
                <Image 
                  loading="lazy" 
                  src={image.image} 
                  alt={image.title} 
                  className="rounded-lg w-full" 
                  width={200} 
                  height={30} 
                />
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/100 to-transparent rounded-b-lg" />
                
                <p className="absolute bottom-2 left-0 right-0 text-white font-semibold px-2 text-[14px] text-center">
                  {textLimit(image.title,40)}
                </p>
              </Link>
            </div>
          ))}
        </div>

        {/* Controls */}
        <button
          className="absolute top-1/2 left-4 transform -translate-y-1/2 md:bg-white bg-[#224ea4] md:text-[black] text-[white] bg-opacity-80 px-2 py-2 rounded-full"
          onClick={handlePrev}
          disabled={currentIndex === 0}
        >
          <span className="text-[20px] font-bold">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
          </span>
        </button>
        <button
          className="absolute top-1/2 right-4 transform -translate-y-1/2 md:bg-white bg-[#224ea4] md:text-[black] text-[white] bg-opacity-80 px-2 py-2 rounded-full"
          onClick={handleNext}
          disabled={currentIndex >= images.length - itemsPerPage}
        >
          <span className="text-[20px] font-bold">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-3">
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </span>
        </button>
      </div>
    </>
  );
}