"use client";
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from "next/image";
import { urlStringEncode } from "./../../utils/utility";
import { usePathname, useRouter } from "next/navigation";
import { GoTrophy } from "react-icons/go";
import { FiHome } from "react-icons/fi";
import { IoNewspaperOutline } from "react-icons/io5";
import { CgDetailsMore } from "react-icons/cg";

interface HeaderProps {
  data: any; // Adjust type based on your data
}
const PhoneMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openNav = () => {
    setIsOpen(true);
  };

  const closeNav = () => {
    setIsOpen(false);
  };


  const pathname = usePathname();

  // console.log("pathname",pathname);

  return (
    <>
      {/* Side Navigation */}
      <div
        id="mySidenav"
        className={`fixed top-0 left-0 h-full bg-[#081736] overflow-x-hidden z-[99999] transition-width duration-500 ease-in-out ${isOpen ? 'w-full' : 'w-0'
          }`}
      >
        <button
          className="absolute top-4 right-6 text-3xl text-gray-400 hover:text-white"
          onClick={closeNav}
        >
          &times;
        </button>
        <div className="text-1xl text-white space-y-4 p-5">
          <Link href="/" className="block hover:text-yellow-400">Home </Link>
          {/* <Link href="#" className="block hover:text-yellow-400">Fixtures </Link> */}
          <Link href="/series" className="block hover:text-yellow-400">Series </Link>
          {/* <Link href="#" className="block hover:text-yellow-400">Teams </Link> */}
          <Link href="/iccranking/man/team/odis" className="block hover:text-yellow-400">ICC Ranking </Link>
          <Link href="#" className="block hover:text-yellow-400">News </Link>
          <Link href="https://uccricket.live/fantasy-cricket/dream11-prediction/" className="block hover:text-yellow-400">Fantasy Tips </Link>
          {/* <Link href="#" className="block hover:text-yellow-400">Point Table </Link> */}
        </div>
      </div>

      <div className="md:hidden sticky bottom-0 bg-[#0e2149] text-[#8a8a8a] text-1xl py-2 flex justify-around items-center">
        <Link
          href="/"
          className={`flex flex-col items-center ${pathname === '/' ? "text-[#ffffff] rounded-lg font-semibold" : ""}`}
        >
          <FiHome className="text-[20px]" />
          <span>Home</span>
        </Link>

        <Link href="/series" className={`flex flex-col items-center ${pathname === '/series' ? "text-[#ffffff] rounded-lg font-semibold" : ""}`}>
          <GoTrophy className="text-[20px]" />
          Series
        </Link>

        <Link href="https://uccricket.live/news/" className="flex flex-col items-center">
          <IoNewspaperOutline className="text-[20px]" />
          News
        </Link>

        <Link
          href="#"
          onClick={openNav}
          className="flex flex-col items-center" >
          <CgDetailsMore className="text-[20px]" />
          More
        </Link>
        
      </div>
    </>
  );
};

export default PhoneMenu;
