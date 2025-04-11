"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

interface Story {
  title: string;
  link: string;
  description: string;
  image?: string;
}

export default function Slider() {

  const [images, setImages] = useState<any[]>([]);

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
        }); // Your API route
        const text = await response.text();
        const parser = new DOMParser();
        const xml = parser.parseFromString(text, "text/xml");

        const items = xml.querySelectorAll("item");
        const storiesArray = Array.from(items)?.map((item) => {
          const title = item.querySelector("title")?.textContent || "";
          const link = item.querySelector("link")?.textContent || "";
          const description = item.querySelector("description")?.textContent || "";

          // Extract image URL from description using regex
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

  // console.log("yes",images);
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 1.5;

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



  return (
    <>
      <div className="flex justify-between items-center py-4">
        <div>
          <h3 className="text-1xl font-semibold pl-[4px] border-l-[3px] border-[#2182F8]">
            Web Stories
          </h3>
        </div>
      </div>
      <div className="relative w-full max-w-5xl mx-auto overflow-hidden pb-2">
        {/* Main Slider */}
        <div
          className="flex gap-4 transition-transform duration-500"
          style={{ transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)` }}
        >


          {images?.map((image, index) => (

            <div
              key={index}
              className="md:w-1/5 w-1/2 flex-shrink-0 relative"
              style={{ minWidth: '20%' }}

            >
              <Link href={image.link}>
                <Image loading="lazy" src={image.image} alt={image.title} className="rounded-lg w-full" width={200} height={30} />
                <p className="absolute bottom-[12px] text-white font-semibold text-center px-2 text-[14px] md:text-[13px]">{image.title}</p>
              </Link>
            </div>

          ))}
        </div>

        {/* Controls */}
        <button
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white bg-opacity-80 px-2 py-2 rounded-full"
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
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white bg-opacity-80 px-2 py-2 rounded-full"
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
