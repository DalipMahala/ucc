"use client"
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

function page() {
  return (
    <section className="lg:w-[1000px] mx-auto md:mb-0 mb-4 px-2 lg:px-0">
      <div id="tabs" className="my-4">
        <div className="flex text-1xl space-x-8 p-2 bg-[#ffffff] rounded-lg overflow-auto">
          <Link href="/series/IPL/overview">
            <button
              className="font-medium py-2 px-3 whitespace-nowrap bg-[#1A80F8] text-white rounded-md"
            >
              Overview
            </button>
          </Link>
          <Link href="/series/IPL/schedule-results">
            <button
              className="font-medium py-2 px-3 whitespace-nowrap "
            >
              Schedule & Results

            </button>
          </Link>
          <Link href="/series/IPL/squads">
            <button
              className="font-medium py-2 px-3 whitespace-nowrap "
            >
              Squads
            </button>
          </Link>
          <Link href="/series/IPL/points-table">
            <button
              className="font-medium py-2 px-3 whitespace-nowrap"
            >
              Points Table
            </button>
          </Link>
          <Link href="/series/IPL/news">
            <button
              className="font-medium py-2 px-3 whitespace-nowrap"
            >
              News
            </button>
          </Link>
          <Link href="/series/IPL/stats">
            <button
              className="font-medium py-2 px-3 whitespace-nowrap" >
              Stats
            </button>
          </Link>

        </div>
      </div>
      <div className="md:grid grid-cols-12 gap-4">
        <div className="lg:col-span-8 md:col-span-7">
          <div className="rounded-lg bg-[#ffffff] p-4">
            <div className='flex items-center justify-end gap-3 mb-3'>
              <span className='border-[1px] rounded-full border-[#c7c7c7] p-1'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-4">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>

              </span>
              <span className='border-[1px] rounded-full border-[#c7c7c7] p-1'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-4">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
              </span>
            </div>
            {/* Featured Matches desktop view  */}
            <div className="" />
            <div className="hidden lg:block">


              <div className='text-[#586577] text-[14px] mb-1 font-semibold'>
                <span>Fri</span>, <span>18 </span><span>Apr</span> <span>2025</span>
              </div>

              <div className="border-t-[1px] border-[#E4E9F0]"></div>

              <div className="py-3 flex justify-between items-center">
                <div className="flex space-x-2 font-medium	w-full">
                  <Link href="/team/kkr/overview">
                    <div className="flex items-center space-x-1 flex-col">
                      <Image
                        src="/assets/img/ipl/b-1.png"
                        className="h-[35px] rounded-full"
                        width={35} height={35} alt="csk"
                      />
                      <span className="text-[#909090]">CSK</span>
                    </div>
                  </Link>
                  <div className="mt-1">
                    <p className="text-1xl font-semibold">120/8</p>
                    <p className="text-[#909090]">(20.0 overs)</p>
                  </div>
                </div>
                <div className=" font-semibold text-center w-full">
                  <p className="text-[#00a632] text-[14px]">KKR Won</p>
                  <p className="text-[#909090] text-[12px] font-normal">
                    2nd Semi Final WT20 World Cup 2024
                  </p>
                </div>
                <div className="flex space-x-2 font-medium justify-end w-full">
                  <div className="mt-1 text-end">
                    <p className="text-1xl font-semibold">128/9</p>
                    <p className="text-[#909090]">(20.0 overs)</p>
                  </div>
                  <Link href="/team/kkr/overview">
                    <div className="flex items-center space-x-1 flex-col font-medium">
                      <Image
                        src="/assets/img/ipl/b-2.png"
                        className="h-[35px] rounded-full"
                        width={35} height={35} alt="nz"
                      />
                      <span className="text-[#909090]">SRH</span>
                    </div>
                  </Link>
                </div>
              </div>
              <div className="border-t-[1px] border-[#E4E9F0]" />
              <div className="py-3 flex justify-between items-center">
                <div className="flex space-x-2 font-medium	w-full">
                  <Link href="/team/kkr/overview">
                    <div className="flex items-center space-x-1 flex-col">
                      <Image
                        src="/assets/img/ipl/b-2.png"
                        className="h-[35px] rounded-full"
                        width={35} height={35} alt="srh"
                      />
                      <span className="text-[#909090]">SRH</span>
                    </div>
                  </Link>
                  <div className="mt-1">
                    <p className="text-1xl font-semibold">134/5</p>
                    <p className="text-[#909090]">(20.0 overs)</p>
                  </div>
                </div>
                <div className=" font-semibold text-center w-full">
                  <p className="text-[#A45B09] text-[14px]">SRH Won</p>
                  <p className="text-[#909090] text-[12px] font-normal">
                    1st Semi Final WT20 World Cup 2024
                  </p>
                </div>
                <div className="flex space-x-2 font-medium justify-end w-full">
                  <div className="mt-1 text-end">
                    <p className="text-1xl font-semibold">135/2</p>
                    <p className="text-[#909090]">(17.2 overs)</p>
                  </div>
                  <Link href="/team/kkr/overview">
                    <div className="flex items-center space-x-1 flex-col font-medium">
                      <Image
                        src="/assets/img/ipl/b-3.png"
                        className="h-[35px] rounded-full"
                        width={35} height={35} alt="nz"
                      />
                      <span className="text-[#909090]">RR</span>
                    </div>
                  </Link>
                </div>
              </div>
              <div className="border-t-[1px] border-[#E4E9F0]" />
              <div className="py-3 flex justify-between items-center">
                <div className="flex space-x-2 font-medium	w-full">
                  <Link href="/team/kkr/overview">
                    <div className="flex items-center space-x-1 flex-row">
                      <Image
                        src="/assets/img/ipl/b-3.png"
                        className="h-[35px] rounded-full"
                        width={35} height={35} alt="wiw"
                      />
                      <span className="text-[#909090]">RR</span>
                    </div>
                  </Link>
                </div>
                <div className=" font-semibold text-center w-full">
                  <p className="text-[#A70B0B] text-[14px]"> Toss Delayed</p>
                  <p className="text-[#909090] text-[12px] font-normal">
                    Oct 20, 7:30 PM
                  </p>
                </div>
                <div className="flex space-x-2 font-medium justify-end w-full">
                  <Link href="/team/kkr/overview">
                    <div className="flex items-center gap-1 flex-row-reverse font-medium">
                      <Image
                        src="/assets/img/ipl/b-4.png"
                        className="h-[35px] rounded-full"
                        width={35} height={35} alt="nz"
                      />
                      <span className="text-[#909090]">RCB</span>
                    </div>
                  </Link>
                </div>
              </div>







            </div>
            {/* Featured Matches responsive view view  */}
            <div className="lg:hidden">
              <div className="py-4 px-3 bg-[#f7faff] rounded-lg my-3 border-b-[1px] border-[#E4E9F0]">
                <p className="text-[#909090] text-[12px] mb-4 font-normal">
                  2nd Semi Final WT20 World Cup 2024
                </p>
                <div className="flex justify-between items-center">
                  <div className="W-[60%]">
                    <div className="flex space-x-2 items-start font-medium w-[162px] md:w-full mb-3">
                      <Link href="/team/kkr/overview">
                        <div className="flex items-center space-x-1 flex-col">
                          <Image
                            src="/assets/img/ipl/b-1.png"
                            className="h-[25px] rounded-full"
                            width={20} height={20} alt="wiw"
                          />
                          <span className="text-[#909090]">CSK</span>
                        </div>
                      </Link>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-1xl font-semibold">120/8</p>
                        <p className="text-[#909090]">(20.0 overs)</p>
                      </div>
                    </div>
                    <div className="flex space-x-2 items-start font-medium w-[162px] md:w-full">
                      <Link href="/team/kkr/overview">
                        <div className="flex items-center space-x-1 flex-col">
                          <Image
                            src="/assets/img/ipl/b-2.png"
                            className="h-[25px] rounded-full"
                            width={20} height={20} alt="wiw"
                          />
                          <span className="text-[#909090]">SRH</span>
                        </div>
                      </Link>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-1xl font-semibold">128/9</p>
                        <p className="text-[#909090]">(20.0 overs)</p>
                      </div>
                    </div>
                  </div>
                  <div className="h-[60px] border-l-[1px] border-[#d0d3d7]" />
                  <div className="W-[40%] font-semibold text-center">
                  <p className="text-[#00a632] text-center text-[14px]">KKR Won</p>
                  </div>
                </div>
              </div>
              <div className="py-4 px-3 bg-[#f7faff] rounded-lg my-3 border-b-[1px] border-[#E4E9F0]">
                <p className="text-[#909090] text-[12px] mb-4 font-normal">
                  1st Semi Final WT20 World Cup 2024
                </p>
                <div className="flex justify-between items-center">
                  <div className="w-[60%]">
                    <div className="flex space-x-2 items-start font-medium w-[162px] md:w-full mb-3">
                      <Link href="/team/kkr/overview">
                        <div className="flex items-center space-x-1 flex-col">
                          <Image
                            src="/assets/img/ipl/b-2.png"
                            className="h-[25px] rounded-full"
                            width={20} height={20} alt="wiw"
                          />
                          <span className="text-[#909090]">SRH</span>
                        </div>
                      </Link>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-1xl font-semibold">134/5</p>
                        <p className="text-[#909090]">(20.0 overs)</p>
                      </div>
                    </div>
                    <div className="flex space-x-2 items-start font-medium w-[162px] md:w-full">
                      <Link href="/team/kkr/overview">
                        <div className="flex items-center space-x-1 flex-col">
                          <Image
                            src="/assets/img/ipl/b-3.png"
                            className="h-[25px] rounded-full"
                            width={20} height={20} alt="wiw"
                          />
                          <span className="text-[#909090]">RR</span>
                        </div>
                      </Link>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-1xl font-semibold">135/2</p>
                        <p className="text-[#909090]">(17.2 overs)</p>
                      </div>
                    </div>
                  </div>
                  <div className="h-[60px] border-l-[1px] border-[#d0d3d7]" />
                  <div className="w-[40%] font-semibold text-right">
                  <p className="text-[#A45B09] text-center text-[14px]">SRH Won</p>
                  </div>
                </div>
              </div>
              <div className="py-4 px-3 bg-[#f7faff] rounded-lg my-3 border-b-[1px] border-[#E4E9F0]">
                <p className="text-[#909090] text-[12px] mb-4 font-normal">
                  2nd Semi Final WT20 World Cup 2024
                </p>
                <div className="flex justify-between items-center">
                  <div className="w-[60%]">
                    <div className="flex space-x-2 items-start font-medium w-[162px] md:w-full mb-3">
                      <Link href="/team/kkr/overview">
                        <div className="flex items-center space-x-1 ">
                          <Image
                            src="/assets/img/ipl/b-3.png"
                            className="h-[25px] rounded-full"
                            width={20} height={20} alt="wiw"
                          />
                          <span className="text-[#909090]">RR</span>
                        </div>
                      </Link>
                    </div>
                    <div className="flex space-x-2 items-start font-medium w-[162px] md:w-full">
                      <Link href="/team/kkr/overview">
                        <div className="flex items-center space-x-1 ">
                          <Image
                            src="/assets/img/ipl/b-4.png"
                            className="h-[25px] rounded-full"
                            width={20} height={20} alt="wiw"
                          />
                          <span className="text-[#909090]">RCB</span>
                        </div>
                      </Link>
                    </div>
                  </div>
                  <div className="h-[60px] border-l-[1px] border-[#d0d3d7]" />
                  <div className="w-[50%] font-semibold text-right">
                  <p className="text-[#A70B0B] text-center text-[14px]"> Toss Delayed</p>
                  </div>
                </div>
              </div>
            </div>

            <div className='flex items-center justify-center gap-5 mt-14 text-[#3D4DCF] text-[15px]'>

              <button className='flex items-center gap-2'><svg xmlns="http://www.w3.org/2000/svg" fill="#3D4DCF" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-3">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18" />
              </svg>
                <span>   Previous </span></button>

              <button className='flex items-center gap-3'>
                <span>  Next </span> <svg xmlns="http://www.w3.org/2000/svg" fill="#3D4DCF" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-3">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                </svg>

              </button>

            </div>



          </div>
        </div>

        <div className='lg:col-span-4 md:col-span-5'>
          <div className='rounded-lg bg-white p-4'>
            <h3 className="text-[15px] font-semibold mb-2 pl-[7px] border-l-[3px] border-[#229ED3]">Filter Fixtures</h3>

            <div className='my-4'>
              <form action="">
                <div className='mb-4'>
                  <p className='mb-1'>Team</p>

                  <select className="focus:outline-none border text-[#586577]  border-[#cacaca] rounded px-2 w-full text-[14px] font-medium p-3">
                    <option className=''>All Teams</option>

                  </select>
                </div>

                <div className='mb-4'>
                  <p className='mb-1'>Format</p>

                  <select className="focus:outline-none border text-[#586577]  border-[#cacaca] rounded px-2 w-full text-[14px] font-medium p-3">
                    <option className=''>All Format</option>

                  </select>
                </div>

                <div className='mb-4'>
                  <p className='mb-1'>Series Type</p>

                  <select className="focus:outline-none border text-[#586577]  border-[#cacaca] rounded px-2 w-full text-[14px] font-medium p-3">
                    <option className=''>All Series</option>

                  </select>
                </div>


              </form>
            </div>
          </div>
        </div>

      </div>

    </section >
  )
}

export default page