import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getAge } from "@/utils/timerUtils";
import PlayerProfileImage from "@/app/components/PlayerProfileImage";
import { MdSportsCricket } from "react-icons/md";

interface Banner {
  playerStats: any | null;
  ranking: any | null;
}
export default function Banner({ playerStats, ranking }: Banner) {
  const profile = playerStats?.player;

  const playerRole =
    profile?.playing_role === "bat"
      ? "Batting"
      : profile?.playing_role === "bowl"
        ? "Bowler"
        : profile?.playing_role === "all"
          ? "All-Rounder"
          : "Unknown";
  const playerRank = ranking?.ranks ?? {};

  let odiRank = "",
    testRank = "",
    t20Rank = "";
  if (profile?.playing_role === "bat") {
    odiRank =
      playerRank?.batsmen?.odis?.find(
        (item: { pid: number }) => Number(item.pid) === profile?.pid
      )?.rank ?? "";
    testRank =
      playerRank?.batsmen?.tests?.find(
        (item: { pid: number }) => Number(item.pid) === profile?.pid
      )?.rank ?? "";
    t20Rank =
      playerRank?.batsmen?.t20s?.find(
        (item: { pid: number }) => Number(item.pid) === profile?.pid
      )?.rank ?? "";
  } else if (profile?.playing_role === "bowl") {
    odiRank =
      playerRank?.bowlers?.odis?.find(
        (item: { pid: number }) => Number(item.pid) === profile?.pid
      )?.rank ?? "";
    testRank =
      playerRank?.bowlers?.tests?.find(
        (item: { pid: number }) => Number(item.pid) === profile?.pid
      )?.rank ?? "";
    t20Rank =
      playerRank?.bowlers?.t20s?.find(
        (item: { pid: number }) => Number(item.pid) === profile?.pid
      )?.rank ?? "";
  } else if (profile?.playing_role === "all") {
    odiRank =
      playerRank?.["all-rounders"]?.odis?.find(
        (item: { pid: number }) => Number(item.pid) === profile?.pid
      )?.rank ?? "";
    testRank =
      playerRank?.["all-rounders"]?.tests?.find(
        (item: { pid: number }) => Number(item.pid) === profile?.pid
      )?.rank ?? "";
    t20Rank =
      playerRank?.["all-rounders"]?.t20s?.find(
        (item: { pid: number }) => Number(item.pid) === profile?.pid
      )?.rank ?? "";
  }

  return (

    <section
      className=" md:pt-4 md:pb-0 md:px-8 px-4 py-4 bg-[#0E2149]"

    >
      <div className="lg:w-[1000px] mx-auto text-white relative">
        <div className="flex items-center md:space-x-8 relative">

          {/* desktop player img start */}

          <div className="hidden md:flex justify-center relative">
            <PlayerProfileImage key={profile?.pid} player_id={profile?.pid} height={300} width={230} className="rounded-lg " />



            <div className="absolute bottom-0 md:hidden" style={{
              height: '82px',
              background: 'linear-gradient(rgb(0 198 255 / 0%), rgb(14 33 73))',
              position: 'absolute',
              width: '100%',
            }}>
            </div>

          </div>

          {/* desktop player img end */}

          {/* mobile player img start */}

          <div className="md:hidden flex justify-center absolute right-0 bottom-0">


            <PlayerProfileImage key={profile?.pid + "_" + profile?.pid} player_id={profile?.pid} height={150} width={120} className="rounded-lg" />

            <div className="absolute bottom-0 md:hidden" style={{
              height: '82px',
              background: 'linear-gradient(rgb(0 198 255 / 0%), rgb(14 33 73))',
              position: 'absolute',
              width: '100%',
            }}>
            </div>

          </div>

          {/* mobile player img start */}


          <div className="md:mb-4 mb-2 relative z-[1] h-[145px] md:h-auto w-[60%] md:w-auto">

            <h1 className="text-[24px] font-medium mb-3 text-start md:block hidden">{profile?.first_name}</h1>

            <h1 className="text-[24px] font-medium mb-3 text-start md:hidden min-h-[70px]">{profile?.first_name} <br /> {profile?.first_name} </h1>


            <div className="lg:flex items-center lg:space-x-5">
              <div className="flex justify-start items-center space-x-2 mb-2 ">
                <Link href="#">
                  <Image loading="lazy" src="/assets/img/india.png" alt="" className="h-[1.5rem]" width={24} height={24} />
                </Link>
                <span>{profile?.nationality} &nbsp; - &nbsp; {profile?.birthdate !== undefined && profile?.birthdate !== '' ? getAge(profile?.birthdate) : ""} </span>
              </div>
              <div className="md:flex md:justify-start items-center md:space-x-2 m-0 hidden">
                {profile?.batting_style !== '' ? (
                  <span className="flex items-center bg-[#E3E9FF12] hover:bg-[#a8bbff45] rounded-full py-[5px] px-[15px] my-2 md:my-0">
                    <Image loading="lazy"
                      src="/assets/img/bat.png"
                      alt=""
                      className="h-[0.8125rem] mr-[0.375rem]"
                      width={12} height={12}
                    />{" "}
                    {profile?.batting_style}
                  </span>
                ) : ("")}
                {profile?.bowling_style !== '' ? (
                  <span className="flex items-center bg-[#E3E9FF12] hover:bg-[#a8bbff45] rounded-full py-[5px] px-[15px]	">
                    <Image loading="lazy"
                      src="/assets/img/ball.png"
                      alt=""
                      className="h-[0.8125rem] mr-[0.375rem]"
                      width={12} height={12}
                    />{" "}
                    {profile?.bowling_style}
                  </span>
                ) : ("")}
              </div>
            </div>

            {/* <h2 className='md:hidden'>{playerRole}</h2> */}

             <div className="md:flex md:justify-start items-center md:space-x-2 m-0 ">
                {playerRole === 'Batting' ? (
                  <span className="flex items-center py-[5px]">
                    <Image loading="lazy"
                      src="/assets/img/bat.png"
                      alt=""
                      className="h-[0.8125rem] mr-[0.375rem]"
                      width={12} height={12}
                    />{" "}
                    {playerRole}
                  </span>
                ) : ("")}
                {playerRole === 'Bowler' ? (
                  <span className="flex items-center py-[5px]	">
                    <Image loading="lazy"
                      src="/assets/img/ball.png"
                      alt=""
                      className="h-[0.8125rem] mr-[0.375rem]"
                      width={12} height={12}
                    />{" "}
                    {playerRole}
                  </span>
                ) : ("")}
                {playerRole === 'All-Rounder' ? (
                  <span className="flex gap-2 items-center py-[5px]">
                    <MdSportsCricket className='text-[#c2d0ed]' />
                    {playerRole}
                  </span>
                ) : ("")}
              </div>

            {/* desktop icc ranking start */}

            <div className='hidden md:block'>
              <div className='flex gap-1 mt-4'>
                <div className='bg-[#0086D7]'>
                  <p className='bg-[#006CAD] py-1 px-3'>🏆 {playerRole}</p>
                  <div className='flex gap-1 items-center'>
                    <p className='px-8 py-2 flex flex-col justify-center items-center'><span className='text-[#FFC21C]  text-[14px] font-semibold'>{testRank ? testRank : "-"}</span>
                      <span className='text-[11px]'>TEST</span>
                    </p>
                    <div className='border-[#0098F4] border-l-[1px] h-[40px]'></div>
                    <p className='px-8 py-2 flex flex-col justify-center items-center '><span className='text-[#FFC21C] text-[14px]  font-semibold'>{odiRank ? odiRank : "-"}</span>
                      <span className='text-[11px]'>ODI</span>
                    </p>

                    <div className='border-[#0098F4] border-l-[1px] h-[40px]'></div>

                    <p className='px-8 py-2 flex flex-col justify-center items-center'><span className='text-[#FFC21C]  text-[14px] font-semibold'>{t20Rank ? t20Rank : "-"}</span>
                      <span className='text-[11px]'>T20</span>
                    </p>

                  </div>
                </div>

              </div>
              <button className='py-1 px-4 rounded-t-none rounded-md bg-[#FFC21C] text-[#0E2149] uppercase font-semibold text-[12px]'>ICC Ranking</button>
            </div>

            {/* desktop icc ranking end */}


          </div>


        </div>
        <div className="absolute bottom-0 hidden md:block" style={{
          height: '82px',
          background: 'linear-gradient(rgb(0 198 255 / 0%), rgb(14 33 73))',
          position: 'absolute',
          width: '100%',
        }}>
        </div>
      </div>
    </section>



  )
}