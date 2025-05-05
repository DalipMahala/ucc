import Page from '../../../page'
import { Metadata } from "next";
import { MatcheInfo } from "@/controller/matchInfoController";
import { urlStringEncode } from "../../../../../utils/utility";

type Params = Promise<{
  matchType: string;
  matchTab: string;
  matchId: number;
  matchTitle: string;
}>;

export async function generateMetadata(props: {
  params: Params;
}): Promise<Metadata> {
  const params = await props.params;
  const matchid = params.matchId;
  const matchTab = params.matchTab;
  const matchType = params.matchType;
  const matchTitle = params.matchTitle;

  const liveMatch = await MatcheInfo(matchid);
  const matchInfo = liveMatch?.match_info;
  const teama = matchInfo?.teama;
  const teamb = matchInfo?.teamb;
  const imageUrl = `https://uccricket.live/api/og-image?title=${encodeURIComponent(`${teama?.short_name} vs ${teamb?.short_name} Live Score`)}&format=webp`;
  // console.log(liveMatch);

  return {
    title: `${teama?.short_name} vs ${teamb?.short_name} Live Score: ${matchInfo?.subtitle}, ${matchInfo?.competition?.abbr}`,
    description: `Live Score of ${teama?.short_name} vs ${teamb?.short_name} ${matchInfo?.subtitle} in ${matchInfo?.competition?.abbr}. Follow real-time updates, ball-by-ball commentary, key player stats, and match highlights on UC Cricket. Stay updated with all ${teama?.name} vs ${teamb?.name} live match details.`,
    keywords: `${teama?.short_name} vs ${teamb?.short_name} live score, ${teama?.name} vs ${teamb?.name} ${matchInfo?.subtitle}, ${matchInfo?.competition?.abbr} live match, ${teama?.short_name} vs ${teamb?.short_name} commentary, ${teama?.short_name} vs ${teamb?.short_name} updates`,

    robots: "nofollow, noindex",
    other: {
        "googlebot": "index, follow, max-snippet:-1, max-video-preview:-1, max-image-preview:large",
      },
    alternates: {
      canonical: `https://uccricket.live/live-score//live-score/${
        urlStringEncode(
          teama?.short_name +
            "-vs-" +
            teamb?.short_name +
            "-" +
            matchInfo?.subtitle +
            "-" +
            matchInfo?.competition?.title
        ) +
        "/" +
        matchInfo?.match_id
      }`,
    },
    openGraph: {
      title: `${teama?.short_name} vs ${teamb?.short_name} Live Score: ${matchInfo?.subtitle}  | ${matchInfo?.competition?.abbr}`,
      description: `Follow ${teama?.short_name} vs ${teamb?.short_name} live score updates for the ${matchInfo?.subtitle} of ${matchInfo?.competition?.abbr}. Live commentary, batting stats & match highlights on UC Cricket.`,
      url: `https://uccricket.live/live-score/${
        urlStringEncode(
            teama?.short_name +
              "-vs-" +
              teamb?.short_name +
              "-" +
              matchInfo?.subtitle +
              "-" +
              matchInfo?.competition?.title
          ) +
          "/" +
          matchInfo?.match_id
      }`,
      siteName: "UC Cricket",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: "Live Cricket Match Score",
        },
      ],
      type: "article",
    },

    twitter: {
      card: "summary_large_image",
      title: `${teama?.short_name} vs ${teamb?.short_name} Live Score: ${matchInfo?.subtitle}  | ${matchInfo?.competition?.abbr}`,
      description: `Live updates of ${teama?.short_name} vs ${teamb?.short_name} ${matchInfo?.subtitle}  in ${matchInfo?.competition?.abbr} with ball-by-ball commentary and match highlights.`,
      images: [imageUrl],
    },
  };
}
export default Page