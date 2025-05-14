"use client";
import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useState } from 'react';

interface faqs{
    seriesInfo:any;
}
export default function FAQ({seriesInfo}:faqs) {
    const standings = seriesInfo?.standing?.standings;
    const total_rounds = seriesInfo?.total_rounds;
  const [openIndex, setOpenIndex] = useState<number>(0); // First item open by default

  let faqs:any = [];
  if(total_rounds == 1){
   faqs = [
    {
      question: "What is NRR in Points Table?",
      answer: ["NRR (Net Run Rate) shows how strong a team is by comparing runs scored vs runs conceded. It's used to break ties when teams have same points."]
    },
    {
      question: "How is NRR Calculated?",
      answer: [" NRR is calculated by the difference between runs scored and runs conceded divided by the number of overs.",
        "OR",
        "It's calculated using this formula: (Total Runs Scored ÷ Overs Faced) – (Total Runs Conceded ÷ Overs Bowled)"
      ]
    },
    {
        question: `How Many Teams Qualify for ${seriesInfo.abbr} Playoffs?`,
        answer: ["Top 4 teams in the points table qualify for playoffs."]
      },
      {
        question: `What if teams have same points?`,
        answer: ["If two or more teams have the same points, Net Run Rate (NRR) is used to decide ranking."]
      },
      {
        question: `Which team is on top right now - ${seriesInfo.abbr}?`,
        answer: [`Currently, ${standings[0]?.standings?.[0]?.team?.abbr} is on top with ${standings[0]?.standings?.[0]?.points} points and ${standings[0]?.standings?.[0]?.netrr} NRR.`]
      },
      {
        question: `Which teams are at the bottom of the table?`,
        answer: [`As of now, ${standings[0]?.standings?.[standings[0]?.standings.length - 1]?.team?.abbr} and ${standings[0]?.standings?.[standings[0]?.standings.length - 2]?.team?.abbr} are ranked lowest in the table.`]
      },
  ];
  }else{
    faqs = [
      {
        question: `Which teams are at the bottom of the table?`,
        answer: ["As per current standings:",
          Array.from({ length: total_rounds }, (_, i) => {
            const index = i; 
          return `In ${standings[index]?.round?.name}, the lowest-ranked team is  ${standings[index]?.standings?.[standings[0]?.standings.length - 1]?.team?.abbr} with ${standings[index]?.standings?.[0]?.points} points and a negative NRR of ${standings[index]?.standings?.[0]?.netrr}.`;
        }).join(',')
      ]
      },
        {
          question: `Which team is on top right now - ${seriesInfo.abbr}?`,
          answer: [
            Array.from({ length: total_rounds }, (_, i) => {
              const index = i; 
                return `${standings[index]?.standings?.[0]?.team?.abbr} is leading ${standings[index]?.round?.name} with ${standings[index]?.standings?.[0]?.points} points and ${standings[index]?.standings?.[0]?.netrr} NRR. ${'\n'}`
              })
          ]
        },
        
    ];

  }
  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index); // Close if clicking the open one
  };

  return (
    <div className="rounded-lg bg-[#ffffff] p-4 mb-4">
      <div>
        <h2 className="text-1xl font-semibold mb-1">FAQs on {seriesInfo.abbr} Points Table</h2>
        <div className="border-t-[1px] border-[#E7F2F4]" />
        <div className="space-y-2 my-2">
          {faqs.map((faq:any, index:number) => (
            <div key={index}>
              <button
                className="w-full text-left flex justify-between items-center px-4 py-2 transition"
                onClick={() => toggleFAQ(index)}
              >
                <span className="text-[14px] font-medium">{faq.question}</span>
                <span
                  className={`transition-transform transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m19.5 8.25-7.5 7.5-7.5-7.5"
                    />
                  </svg>
                </span>
              </button>
              {openIndex === index && (
                <>
                  
                  {faq.answer.map((text: string , index: number) => (
                      <p className="my-2 px-4 text-gray-600" key={index}>
                        {text}
                      </p>
                    ))}
                  
                  <div className="border-t-[1px] border-[#E7F2F4]" />
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}