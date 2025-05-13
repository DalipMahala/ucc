"use client"; // Mark this file as a client component

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { urlStringEncode } from "../../utils/utility";

interface Competition {
  cid: number;
  title: string;
  season: string;
}

interface Country {
  country_name: string;
  country_code: string;
  competitions: Competition[];
}

interface countries {
  countries: any;
}

export default function CountriesList({ countries }: countries) {
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filteredCountries = countries
    ?.map((country: Country) => {
      const countryNameMatch = country.country_name.toLowerCase().includes(search.toLowerCase());
      
      const filteredCompetitions = country.competitions?.filter((competition: Competition) => 
        competition.title.toLowerCase().includes(search.toLowerCase())
      );

      // If search is empty, show all countries with all competitions
      if (search === "") {
        return { ...country, competitions: country.competitions };
      }

      // If country name matches, show all its competitions
      if (countryNameMatch) {
        return { ...country, competitions: country.competitions };
      }

      // If competitions match, show country with only matching competitions
      if (filteredCompetitions.length > 0) {
        return { ...country, competitions: filteredCompetitions };
      }

      return null;
    })
    .filter(Boolean);

  // Auto-expand countries that have matching competitions when searching
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    
    // If search is not empty, expand all countries that have matching competitions
    if (e.target.value.trim() !== "") {
      const matchingCountries = filteredCountries
        .filter((country: Country | null) => country !== null)
        .map((country: Country) => country.country_name);
      
      // If only one country matches, expand it; otherwise expand all matching
      if (matchingCountries.length === 1) {
        setExpanded(matchingCountries[0]);
      }
    } else {
      // If search is empty, collapse all
      setExpanded(null);
    }
  };

  return (
    <>
      
        <h2 className="text-1xl font-semibold pl-[3px] border-l-[3px] border-[#1a80f8] mb-2 uppercase">
          Domestic Leagues
        </h2>
     

      <div className="bg-white rounded-lg px-4">
        {/* Search Form */}
        <div className="py-2 mb-3">
          <form className="flex justify-between items-center border-2 p-1 px-3 rounded-lg">
           
              <input
                className="font-normal text-[15px] outline-none"
                type="text"
                placeholder="Filter countries or leagues..."
                value={search}
                onChange={handleSearchChange}
              />
            
           
              <Image 
                loading="lazy"
                src="/assets/img/flag/search.png"
                className="h-[14px]"
                width={15}
                height={15}
                style={{ width: "15px", height: "15px" }}
                alt="Search"
              />
           
          </form>
        </div>

        {/* Country Blocks */}
        {filteredCountries?.length > 0 ? (
          filteredCountries.map((country: any, index: number) => (
            <div key={index} className="border-b mb-4">
              <button 
                className="w-full flex text-[14px] justify-between items-center pb-3" 
                onClick={() =>
                  setExpanded(expanded === country.country_name ? null : country.country_name)
                }
              >
                <span className="flex items-center font-medium text-[#394351]">
                  <Image 
                    loading="lazy"
                    src={`https://flagcdn.com/w320/${
                      country.country_code.toLowerCase() === "wi" ? "kn" : 
                      country.country_code.toLowerCase() === "en" ? "gb" : 
                      country.country_code.toLowerCase()
                    }.webp`}
                    className="mr-3 rounded-full object-cover"
                    width={20}
                    height={20}
                    style={{ width: "20px", height: "20px" }}
                    alt={`${country.country_name} Flag`}
                  />
                  {country.country_name}
                </span>
                <span className={`transform transition-transform ${
                  expanded === country.country_name ? "rotate-[180deg]" : ""
                }`}>
                  <Image 
                    loading="lazy"
                    src="/assets/img/arrow.png"
                    className="h-[7px]"
                    width={10}
                    height={15}
                    style={{ width: "auto", height: "auto" }}
                    alt="Arrow"
                  />
                </span>
              </button>
              
              {expanded === country.country_name && (
                <div className="pl-8 py-2 space-y-2">
                  {country.competitions?.length > 0 ? (
                    country.competitions.map((compt: Competition, index: number) => (
                      <div className="flex items-center gap-[2px] font-normal text-[13px] text-[#51555E]" key={index}>
                       
                          <span>
                            <svg 
                              xmlns="http://www.w3.org/2000/svg" 
                              fill="none" 
                              viewBox="0 0 24 24" 
                              strokeWidth="1.5" 
                              stroke="currentColor" 
                              className="size-3 text-[#1A80F8]"
                            >
                              <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5" 
                              />
                            </svg>
                          </span>
                          <Link 
                            className="hover:text-[#1a80f8]" 
                            href={`series/${urlStringEncode(`${compt.title}-${compt.season}`)}/${compt.cid}`}
                          >
                            <p>{compt.title}</p>
                          </Link>
                       
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No leagues found</p>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="py-4 text-center text-gray-500">No countries or leagues match your search</p>
        )}
      </div>
    </>
  );
}