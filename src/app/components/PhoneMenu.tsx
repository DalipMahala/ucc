"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { GoTrophy } from "react-icons/go";
import { FiHome } from "react-icons/fi";
import { IoNewspaperOutline } from "react-icons/io5";
import { CgDetailsMore } from "react-icons/cg";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";

const PhoneMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null); // 'news' | 'sports' | 'ranking' | null

  const openNav = () => {
    setIsOpen(true);
  };

  const closeNav = () => {
    setIsOpen(false);
    setOpenDropdown(null);
  };

  const pathname = usePathname();

  return (
    <>
      {/* Side Navigation */}
      <div
        id="mySidenav"
        className={`fixed top-[57px] left-0 h-full bg-[#081736] overflow-auto z-[99999] transition-width duration-500 ease-in-out ${isOpen ? "w-full" : "w-0"}`}
      >
        <button
          className="absolute top-1 right-6 text-3xl text-gray-400 hover:text-white"
          onClick={closeNav}
        >
          &times;
        </button>

        <div className="text-1xl text-white space-y-2 p-5">
          <Link href="/" className="block hover:text-[#6aaefe] border-b-[1px] border-[#3d3d3d] pb-2" onClick={closeNav}>Home</Link>
          <Link href="/series" className="block hover:text-[#6aaefe] border-b-[1px] border-[#3d3d3d] pb-2" onClick={closeNav}>Series</Link>
          <Link href="https://uccricket.live/news/" className="block hover:text-[#6aaefe] border-b-[1px] border-[#3d3d3d] pb-2" onClick={closeNav}>News</Link>

          {/* Cricket Dropdown */}
          <div className="block text-white border-b-[1px] border-[#3d3d3d] pb-2">
            <button
              onClick={() => setOpenDropdown(openDropdown === "news" ? null : "news")}
              className="w-full flex justify-between items-center text-left hover:text-[#6aaefe]"
            >
              <span> Cricket </span> <MdOutlineKeyboardArrowDown />
            </button>
            {openDropdown === "news" && (
              <div className="py-2 px-4 bg-[#14274d] rounded-lg space-y-2 mt-2">
                <Link href="https://uccricket.live/cricket/ipl/" className="block hover:text-[#6aaefe] pb-2" onClick={closeNav}>IPL</Link>
                <Link href="https://uccricket.live/cricket/t10/" className="block hover:text-[#6aaefe] pb-2" onClick={closeNav}>T10</Link>
                <Link href="https://uccricket.live/cricket/t20/" className="block hover:text-[#6aaefe] pb-2" onClick={closeNav}>T20</Link>
                <Link href="https://uccricket.live/cricket/t20-world-cup/" className="block hover:text-[#6aaefe] pb-2" onClick={closeNav}>T20 World Cup</Link>
                <Link href="https://uccricket.live/cricket/stadium/" className="block hover:text-[#6aaefe] pb-2" onClick={closeNav}>Stadium</Link>
                <Link href="https://uccricket.live/cricket/" className="block hover:text-[#6aaefe] pb-2" onClick={closeNav}>View All</Link>
              </div>
            )}
          </div>

          {/* Sports Dropdown */}
          <div className="block text-white border-b-[1px] border-[#3d3d3d] pb-2">
            <button
              onClick={() => setOpenDropdown(openDropdown === "sports" ? null : "sports")}
              className="w-full flex justify-between items-center text-left hover:text-[#6aaefe]"
            >
              <span> Sports </span> <MdOutlineKeyboardArrowDown />
            </button>
            {openDropdown === "sports" && (
              <div className="py-2 px-4 bg-[#14274d] rounded-lg space-y-2 mt-2">
                <Link href="https://uccricket.live/sports/kabaddi/" className="block hover:text-[#6aaefe] pb-2" onClick={closeNav}>Kabaddi</Link>
                <Link href="https://uccricket.live/sports/football/" className="block hover:text-[#6aaefe] pb-2" onClick={closeNav}>Football</Link>
                <Link href="https://uccricket.live/sports/hockey/" className="block hover:text-[#6aaefe] pb-2" onClick={closeNav}>Hockey</Link>
                <Link href="https://uccricket.live/sports/tennis/" className="block hover:text-[#6aaefe] pb-2" onClick={closeNav}>Tennis</Link>
                <Link href="https://uccricket.live/sports/nfl/" className="block hover:text-[#6aaefe] pb-2" onClick={closeNav}>NFL</Link>
              </div>
            )}
          </div>

          <Link href="/points-table/" className="block hover:text-[#6aaefe] border-b-[1px] border-[#3d3d3d] pb-2" onClick={closeNav}>Points Table</Link>

          {/* ICC Ranking Dropdown */}
          <div className="block text-white border-b-[1px] border-[#3d3d3d] pb-2">
            <button
              onClick={() => setOpenDropdown(openDropdown === "ranking" ? null : "ranking")}
              className="w-full flex justify-between items-center text-left hover:text-[#6aaefe]"
            >
              <span> ICC Ranking </span> <MdOutlineKeyboardArrowDown />
            </button>
            {openDropdown === "ranking" && (
              <div className="py-2 px-4 bg-[#14274d] rounded-lg space-y-2 mt-2">
                <Link href="/iccranking/men/team/odi" className="block hover:text-[#6aaefe] pb-2" onClick={closeNav}>Men</Link>
                <Link href="/iccranking/women/team/odi" className="block hover:text-[#6aaefe] pb-2" onClick={closeNav}>Women</Link>
              </div>
            )}
          </div>

          <Link href="https://uccricket.live/fantasy-cricket/dream11-prediction/" className="block hover:text-[#6aaefe] border-b-[1px] border-[#3d3d3d] pb-2" onClick={closeNav}>Fantasy Tips</Link>
          <Link href="https://uccricket.live/get-in-touch/" className="block hover:text-[#6aaefe] border-b-[1px] border-[#3d3d3d] pb-2" onClick={closeNav}>Contact</Link>

           <div className="pb-[57px]">

            <p className="text-center mt-5">Follow Us:</p>
            <div className="mt-4 flex justify-center md:justify-end space-x-4">
              <Link href="https://www.facebook.com/people/UC-Cricket/61568243565685/" className="bg-[white] p-1 rounded-full" aria-label="Visit our Facebook page">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  width={20}
                  height={20}
                  viewBox="0 0 30 30"
                >
                  <path d="M15,3C8.373,3,3,8.373,3,15c0,6.016,4.432,10.984,10.206,11.852V18.18h-2.969v-3.154h2.969v-2.099c0-3.475,1.693-5,4.581-5 c1.383,0,2.115,0.103,2.461,0.149v2.753h-1.97c-1.226,0-1.654,1.163-1.654,2.473v1.724h3.593L19.73,18.18h-3.106v8.697 C22.481,26.083,27,21.075,27,15C27,8.373,21.627,3,15,3z"></path>
                </svg>
              </Link>
              <Link href="https://x.com/uccricketlive" className="bg-[white] p-1 rounded-full" aria-label="Visit our X (Twitter) profile">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  width={20}
                  height={20}
                  viewBox="0 0 30 30"
                >
                  <path d="M28,6.937c-0.957,0.425-1.985,0.711-3.064,0.84c1.102-0.66,1.947-1.705,2.345-2.951c-1.03,0.611-2.172,1.055-3.388,1.295 c-0.973-1.037-2.359-1.685-3.893-1.685c-2.946,0-5.334,2.389-5.334,5.334c0,0.418,0.048,0.826,0.138,1.215 c-4.433-0.222-8.363-2.346-10.995-5.574C3.351,6.199,3.088,7.115,3.088,8.094c0,1.85,0.941,3.483,2.372,4.439 c-0.874-0.028-1.697-0.268-2.416-0.667c0,0.023,0,0.044,0,0.067c0,2.585,1.838,4.741,4.279,5.23 c-0.447,0.122-0.919,0.187-1.406,0.187c-0.343,0-0.678-0.034-1.003-0.095c0.679,2.119,2.649,3.662,4.983,3.705 c-1.825,1.431-4.125,2.284-6.625,2.284c-0.43,0-0.855-0.025-1.273-0.075c2.361,1.513,5.164,2.396,8.177,2.396 c9.812,0,15.176-8.128,15.176-15.177c0-0.231-0.005-0.461-0.015-0.69C26.38,8.945,27.285,8.006,28,6.937z"></path>
                </svg>
              </Link>
              <Link href="https://www.instagram.com/uccricketlive/" className="bg-[white] p-1 rounded-full" aria-label="Visit our Instagram profile">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  width={20}
                  height={20}
                  viewBox="0 0 30 30"
                >
                  <path d="M 9.9980469 3 C 6.1390469 3 3 6.1419531 3 10.001953 L 3 20.001953 C 3 23.860953 6.1419531 27 10.001953 27 L 20.001953 27 C 23.860953 27 27 23.858047 27 19.998047 L 27 9.9980469 C 27 6.1390469 23.858047 3 19.998047 3 L 9.9980469 3 z M 22 7 C 22.552 7 23 7.448 23 8 C 23 8.552 22.552 9 22 9 C 21.448 9 21 8.552 21 8 C 21 7.448 21.448 7 22 7 z M 15 9 C 18.309 9 21 11.691 21 15 C 21 18.309 18.309 21 15 21 C 11.691 21 9 18.309 9 15 C 9 11.691 11.691 9 15 9 z M 15 11 A 4 4 0 0 0 11 15 A 4 4 0 0 0 15 19 A 4 4 0 0 0 19 15 A 4 4 0 0 0 15 11 z"></path>
                </svg>
              </Link>
              <Link href="https://www.youtube.com/" className="bg-[white] p-1 rounded-full" aria-label="Visit our YouTube channel">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  width={20}
                  height={20}
                  viewBox="0 0 24 24"
                >
                  <path d="M21.582,6.186c-0.23-0.86-0.908-1.538-1.768-1.768C18.254,4,12,4,12,4S5.746,4,4.186,4.418 c-0.86,0.23-1.538,0.908-1.768,1.768C2,7.746,2,12,2,12s0,4.254,0.418,5.814c0.23,0.86,0.908,1.538,1.768,1.768 C5.746,20,12,20,12,20s6.254,0,7.814-0.418c0.861-0.23,1.538-0.908,1.768-1.768C22,16.254,22,12,22,12S22,7.746,21.582,6.186z M10,14.598V9.402c0-0.385,0.417-0.625,0.75-0.433l4.5,2.598c0.333,0.192,0.333,0.674,0,0.866l-4.5,2.598 C10.417,15.224,10,14.983,10,14.598z"></path>
                </svg>
              </Link>
              <Link href="https://in.linkedin.com/" className="bg-[white] p-1 rounded-full" aria-label="Visit our LinkedIn page">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  width={20}
                  height={20}
                  viewBox="0 0 30 30"
                >
                  <path d="M24,4H6C4.895,4,4,4.895,4,6v18c0,1.105,0.895,2,2,2h18c1.105,0,2-0.895,2-2V6C26,4.895,25.105,4,24,4z M10.954,22h-2.95 v-9.492h2.95V22z M9.449,11.151c-0.951,0-1.72-0.771-1.72-1.72c0-0.949,0.77-1.719,1.72-1.719c0.948,0,1.719,0.771,1.719,1.719 C11.168,10.38,10.397,11.151,9.449,11.151z M22.004,22h-2.948v-4.616c0-1.101-0.02-2.517-1.533-2.517 c-1.535,0-1.771,1.199-1.771,2.437V22h-2.948v-9.492h2.83v1.297h0.04c0.394-0.746,1.356-1.533,2.791-1.533 c2.987,0,3.539,1.966,3.539,4.522V22z"></path>
                </svg>
              </Link>
              <Link href="https://telegram.org/" className="bg-[white] p-1 rounded-full" aria-label="Join our Telegram channel">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  width={20}
                  height={20}
                  viewBox="0 0 24 24"
                >
                  <path d="M 20.572266 3.0117188 C 20.239891 2.9764687 19.878625 3.028375 19.515625 3.171875 C 19.065625 3.348875 12.014406 6.3150313 5.4414062 9.0820312 L 3.2695312 9.9960938 C 2.4285313 10.337094 2.0039062 10.891672 2.0039062 11.638672 C 2.0039062 12.161672 2.22525 12.871063 3.28125 13.289062 L 6.9472656 14.757812 C 7.2642656 15.708813 8.0005469 17.916906 8.1855469 18.503906 C 8.2955469 18.851906 8.5733906 19.728594 9.2753906 19.933594 C 9.4193906 19.982594 9.5696563 20.007813 9.7226562 20.007812 C 10.165656 20.007812 10.484625 19.801641 10.640625 19.681641 L 12.970703 17.710938 L 15.800781 20.328125 C 15.909781 20.439125 16.486719 21 17.261719 21 C 18.228719 21 18.962234 20.195016 19.115234 19.416016 C 19.198234 18.989016 21.927734 5.2870625 21.927734 5.2890625 C 22.172734 4.1900625 21.732219 3.6199531 21.449219 3.3769531 C 21.206719 3.1694531 20.904641 3.0469688 20.572266 3.0117188 z M 19.910156 5.171875 C 19.533156 7.061875 17.478016 17.378234 17.166016 18.865234 L 13.029297 15.039062 L 10.222656 17.416016 L 11 14.375 C 11 14.375 16.362547 8.9468594 16.685547 8.6308594 C 16.945547 8.3778594 17 8.2891719 17 8.2011719 C 17 8.0841719 16.939781 8 16.800781 8 C 16.675781 8 16.506016 8.1197812 16.416016 8.1757812 C 15.272669 8.8885973 10.404094 11.662239 8.0078125 13.025391 L 4.53125 11.636719 L 6.21875 10.927734 C 10.51775 9.1177344 18.174156 5.893875 19.910156 5.171875 z"></path>
                </svg>
              </Link>
            </div>

            <p className="text-center mt-5">Download For :</p>
            <div className="flex justify-center space-x-4 mt-4 ">
              <a href="#" >
                <Image priority src="/assets/img/store-1.png" alt="Google Play" className="h-[35px]" width={100} height={35} />
              </a>
              <a href="#">
                <Image priority src="/assets/img/store-2.png" alt="App Store" className="h-[35px]" width={100} height={35} />
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Mobile Navigation */}
      <div className="md:hidden sticky bottom-0 bg-[#0e2149] text-[#8a8a8a] text-1xl py-2 flex justify-around items-center">
        <Link href="/" className={`flex flex-col items-center ${pathname === "/" ? "text-[#ffffff] font-semibold" : ""}`}>
          <FiHome className="text-[20px]" />
          <span>Home</span>
        </Link>
        <Link href="/series" className={`flex flex-col items-center ${pathname === "/series" ? "text-[#ffffff] font-semibold" : ""}`}>
          <GoTrophy className="text-[20px]" />
          Series
        </Link>
        <Link href="https://uccricket.live/news/" className="flex flex-col items-center">
          <IoNewspaperOutline className="text-[20px]" />
          News
        </Link>
        <button onClick={openNav} className="flex flex-col items-center">
          <CgDetailsMore className="text-[20px]" />
          More
        </button>
      </div>
    </>
  );
};

export default PhoneMenu;
