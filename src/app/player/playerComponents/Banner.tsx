import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getAge } from "@/utils/timerUtils";

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
      )?.rating ?? "";
    testRank =
      playerRank?.batsmen?.tests?.find(
        (item: { pid: number }) => Number(item.pid) === profile?.pid
      )?.rating ?? "";
    t20Rank =
      playerRank?.batsmen?.t20s?.find(
        (item: { pid: number }) => Number(item.pid) === profile?.pid
      )?.rating ?? "";
  } else if (profile?.playing_role === "bowl") {
    odiRank =
      playerRank?.bowlers?.odis?.find(
        (item: { pid: number }) => Number(item.pid) === profile?.pid
      )?.rating ?? "";
    testRank =
      playerRank?.bowlers?.tests?.find(
        (item: { pid: number }) => Number(item.pid) === profile?.pid
      )?.rating ?? "";
    t20Rank =
      playerRank?.bowlers?.t20s?.find(
        (item: { pid: number }) => Number(item.pid) === profile?.pid
      )?.rating ?? "";
  } else if (profile?.playing_role === "all") {
    odiRank =
      playerRank?.["all-rounders"]?.odis?.find(
        (item: { pid: number }) => Number(item.pid) === profile?.pid
      )?.rating ?? "";
    testRank =
      playerRank?.["all-rounders"]?.tests?.find(
        (item: { pid: number }) => Number(item.pid) === profile?.pid
      )?.rating ?? "";
    t20Rank =
      playerRank?.["all-rounders"]?.t20s?.find(
        (item: { pid: number }) => Number(item.pid) === profile?.pid
      )?.rating ?? "";
  }

    return (

        <section
            className=" md:pt-4 md:pb-0 md:px-8 px-4 py-4 bg-[#0E2149]"

        >
            <div className="lg:w-[1000px] mx-auto text-white relative">
                <div className="md:flex items-center md:space-x-8">
                    <div className="flex justify-center relative">

                        <Image loading="lazy"
                            src="/assets/img/playerProfile/p-2.svg"
                            alt="Player Image"
                            className=" rounded-lg hidden md:block"
                            width={230} height={300}

                        />

                        <Image loading="lazy"
                            src="/assets/img/playerProfile/p-2.svg"
                            alt="Player Image"
                            className=" rounded-lg md:hidden"
                            width={150} height={200}

                        />

                        <div className="absolute bottom-0 md:hidden" style={{
                            height: '82px',
                            background: 'linear-gradient(rgb(0 198 255 / 0%), rgb(14 33 73))',
                            position: 'absolute',
                            width: '100%',
                        }}>
                        </div>

                    </div>

                    <div className="md:mb-4 mb-2 relative z-[1]">
                        <h2 className="text-2xl font-medium mb-3 md:text-start text-center">{profile?.first_name}</h2>
                        <div className="lg:flex items-center lg:space-x-5">
                            <div className="flex md:justify-start justify-center items-center space-x-2 mb-2 ">
                                <Link href="#">
                                    <Image loading="lazy" src="/assets/img/india.png" alt="" className="h-[1.5rem]" width={24} height={24} />
                                </Link>
                                <span>{profile?.nationality} &nbsp; - &nbsp; {profile?.birthdate !== undefined && profile?.birthdate !== '' ? getAge(profile?.birthdate) : ""} </span>
                            </div>
                            <div className="flex md:justify-start justify-center items-center space-x-2 m-0">
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
                        <div className='hidden md:block'>
                            <div className='flex gap-1 mt-4'>
                                <div className='bg-[#0086D7]'>
                                    <p className='bg-[#006CAD] py-1 px-3'>{playerRole}</p>
                                    <div className='flex gap-1 items-center'>
                                        <p className='px-8 py-2 flex flex-col justify-center items-center'><span className='text-[#FFC21C]  text-[14px] font-semibold'>{testRank ? testRank : "-"}</span>
                                            <span className='text-[11px]'>TEST</span>
                                        </p>
                                        <div className='border-[#0098F4] border-l-[1px] h-[40px]'></div>
                                        <p className='px-8 py-2 flex flex-col justify-center items-center '><span className='text-[#FFC21C] text-[14px]  font-semibold'>{odiRank ? odiRank : "-"}</span>
                                            <span className='text-[11px]'>ODI</span>
                                        </p>

                                        <div className='border-[#0098F4] border-l-[1px] h-[40px]'></div>

                                        <p className='px-8 py-2 flex flex-col justify-center items-center'><span className='text-[#FFC21C]  text-[14px] font-semibold'>{t20Rank ? t20Rank: "-"}</span>
                                            <span className='text-[11px]'>T20</span>
                                        </p>

                                    </div>
                                </div>

                            </div>
                            <button className='py-1 px-4 rounded-t-none rounded-md bg-[#FFC21C] text-[#0E2149] uppercase font-semibold text-[12px]'>ICC Ranking</button>
                        </div>
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