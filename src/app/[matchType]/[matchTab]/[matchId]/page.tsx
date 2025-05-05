import Page from "../../page";
import { Metadata } from "next";
import { MatcheInfo } from "@/controller/matchInfoController";
import { urlStringEncode } from "../../../../utils/utility";

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
  const imageUrl = `https://uccricket.live/api/og-image?title=${encodeURIComponent(
    `${teama?.short_name} vs ${teamb?.short_name} Live Score`
  )}&format=webp`;
  // console.log(params);

  const robots = "nofollow, noindex";
  const other = {
    googlebot:
      "index, follow, max-snippet:-1, max-video-preview:-1, max-image-preview:large",
  };
  const openGraphtype = "article";
  const siteName = "UC Cricket";
  const twittercard = "summary_large_image";
  let title = "";
  let description = "";
  let keywords = "";
  let canonical = "";
  let openGraphtitle = "";
  let openGraphdescription = "";
  let openGraphurl = "";
  let twittertitle = "";
  let twitterdescription = "";

  if (matchType === "live-score") {
    title = `${teama?.short_name} vs ${teamb?.short_name} Live Score: ${matchInfo?.subtitle}, ${matchInfo?.competition?.title} ${matchInfo?.competition?.season}`;
    description = `Live Score of ${teama?.short_name} vs ${teamb?.short_name} ${matchInfo?.subtitle} in ${matchInfo?.competition?.title} ${matchInfo?.competition?.season}. Follow real-time updates, ball-by-ball commentary, key player stats, and match highlights on UC Cricket. Stay updated with all ${teama?.name} vs ${teamb?.name} live match details.`;
    keywords = `${teama?.short_name} vs ${teamb?.short_name} live score, ${teama?.name} vs ${teamb?.name} ${matchInfo?.subtitle}, ${matchInfo?.competition?.title} ${matchInfo?.competition?.season} live match, ${teama?.short_name} vs ${teamb?.short_name} commentary, ${teama?.short_name} vs ${teamb?.short_name} updates`;

    canonical = `https://uccricket.live/live-score/${
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
    }`;
    openGraphtitle = `${teama?.short_name} vs ${teamb?.short_name} Live Score: ${matchInfo?.subtitle} | ${matchInfo?.competition?.title} ${matchInfo?.competition?.season}`;
    openGraphdescription = `Follow ${teama?.short_name} vs ${teamb?.short_name} live score updates for the ${matchInfo?.subtitle} of ${matchInfo?.competition?.title} ${matchInfo?.competition?.season}. Live commentary, batting stats & match highlights on UC Cricket.`;
    openGraphurl = `https://uccricket.live/live-score/${
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
    }`;

    twittertitle = `${teama?.short_name} vs ${teamb?.short_name} Live Score: ${matchInfo?.subtitle} | ${matchInfo?.competition?.title} ${matchInfo?.competition?.season}`;
    twitterdescription = `Live updates of ${teama?.short_name} vs ${teamb?.short_name} ${matchInfo?.subtitle}  in ${matchInfo?.competition?.title} ${matchInfo?.competition?.season} with ball-by-ball commentary and match highlights.`;
  }else if (matchType === "scorecard") {
    title = `${teama?.short_name} vs ${teamb?.short_name} Scorecard: ${matchInfo?.subtitle}, ${matchInfo?.competition?.title} ${matchInfo?.competition?.season}`;
    description = `Check ${teama?.short_name} vs ${teamb?.short_name} full scorecard for the ${matchInfo?.subtitle} of ${matchInfo?.competition?.title} ${matchInfo?.competition?.season}. Get complete batting, bowling, partnerships, and fall of wickets details. Stay updated with live match stats on UC Cricket.`;
    keywords = `${teama?.short_name} vs ${teamb?.short_name} scorecard, ${teama?.name} vs ${teamb?.name} match stats, ${matchInfo?.competition?.title} ${matchInfo?.competition?.season} scorecard, ${teama?.short_name} vs ${teamb?.short_name} batting performance, ${teama?.short_name} vs ${teamb?.short_name} bowling figures`;

    canonical = `https://uccricket.live/scorecard/${
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
    }`;
    openGraphtitle = `${teama?.short_name} vs ${teamb?.short_name} Scorecard: ${matchInfo?.subtitle} | ${matchInfo?.competition?.title} ${matchInfo?.competition?.season}`;
    openGraphdescription = `Full scorecard of ${teama?.short_name} vs ${teamb?.short_name} ${matchInfo?.subtitle} in ${matchInfo?.competition?.title} ${matchInfo?.competition?.season}. See batting, bowling stats, fall of wickets, and partnerships.`;
    openGraphurl = `https://uccricket.live/scorecard/${
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
    }`;

    twittertitle = `${teama?.short_name} vs ${teamb?.short_name} Scorecard: ${matchInfo?.subtitle} | ${matchInfo?.competition?.title} ${matchInfo?.competition?.season}`;
    twitterdescription = `${teama?.short_name} vs ${teamb?.short_name} full scorecard for ${matchInfo?.subtitle} of ${matchInfo?.competition?.title} ${matchInfo?.competition?.season} Complete batting, bowling, partnerships & match stats.`;
  }else if (matchType === "squad") {
    title = `${teama?.short_name} vs ${teamb?.short_name} Squad: ${matchInfo?.subtitle}, ${matchInfo?.competition?.title} ${matchInfo?.competition?.season}`;
    description = `Check the full squad details of ${teama?.name} vs ${teamb?.name} for the ${matchInfo?.subtitle} of ${matchInfo?.competition?.title} ${matchInfo?.competition?.season}. See player roles, captains, batsmen, bowlers, and all-rounders. Stay updated with team lineup on UC Cricket.`;
    keywords = `${teama?.short_name} vs ${teamb?.short_name} squad, ${teama?.name} vs ${teamb?.name} team, ${matchInfo?.competition?.title} ${matchInfo?.competition?.season} squad, ${teama?.short_name} vs ${teamb?.short_name} playing XI, ${teama?.short_name} vs ${teamb?.short_name} team players`;

    canonical = `https://uccricket.live/squad/${
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
    }`;
    openGraphtitle = `${teama?.short_name} vs ${teamb?.short_name} Squad: ${matchInfo?.subtitle} | ${matchInfo?.competition?.title} ${matchInfo?.competition?.season}`;
    openGraphdescription = `Full squad details of ${teama?.short_name} vs ${teamb?.short_name} for ${matchInfo?.subtitle}. See captains, batsmen, bowlers & all-rounders.`;
    openGraphurl = `https://uccricket.live/squad/${
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
    }`;

    twittertitle = `${teama?.short_name} vs ${teamb?.short_name} Squad: ${matchInfo?.subtitle} | ${matchInfo?.competition?.title} ${matchInfo?.competition?.season}`;
    twitterdescription = `See the official squad details of ${teama?.name} vs ${teamb?.name} for the ${matchInfo?.subtitle} of ${matchInfo?.competition?.title} ${matchInfo?.competition?.season}. Captains, batsmen, bowlers & all-rounders included.`;
  }else if (matchType === "moreinfo") {
    title = `${teama?.short_name} vs ${teamb?.short_name} More Info: ${matchInfo?.subtitle}, ${matchInfo?.competition?.title} ${matchInfo?.competition?.season}`;
    description = `Get detailed match insights for ${teama?.name} vs ${teamb?.name} ${matchInfo?.subtitle} in ${matchInfo?.competition?.title} ${matchInfo?.competition?.season}. Check team stats, recent performances, head-to-head records, venue details, and match predictions on UC Cricket.`;
    keywords = `${teama?.short_name} vs ${teamb?.short_name} match stats, ${teama?.name} vs ${teamb?.name} head to head, ${matchInfo?.competition?.season} squad, ${teama?.short_name} vs ${teamb?.short_name} match venue, team comparison`;

    canonical = `https://uccricket.live/moreinfo/${
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
    }`;
    openGraphtitle = `${teama?.short_name} vs ${teamb?.short_name} More Info: ${matchInfo?.subtitle} | ${matchInfo?.competition?.title} ${matchInfo?.competition?.season}`;
    openGraphdescription = `Get in-depth details for ${teama?.name} vs ${teamb?.name} ${matchInfo?.subtitle}. See team performance, head-to-head stats, venue records & match insights.`;
    openGraphurl = `https://uccricket.live/moreinfo/${
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
    }`;

    twittertitle = `${teama?.short_name} vs ${teamb?.short_name} More Info: ${matchInfo?.subtitle} | ${matchInfo?.competition?.title} ${matchInfo?.competition?.season}`;
    twitterdescription = `Explore detailed match insights for ${teama?.name} vs ${teamb?.name} ${matchInfo?.subtitle} in ${matchInfo?.competition?.title} ${matchInfo?.competition?.season}, including past performances & venue stats.`;
  }

  return {
    title: title,
    description: description,
    keywords: keywords,

    robots: robots,
    other: other,
    alternates: {
      canonical: canonical,
    },
    openGraph: {
      title: openGraphtitle,
      description: openGraphdescription,
      url: openGraphurl,
      siteName: siteName,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: "Live Cricket Match Score",
          type: "image/webp",
        },
      ],
      type: openGraphtype,
    },

    twitter: {
      card: twittercard,
      title: twittertitle,
      description: twitterdescription,
      images: [imageUrl],
    },
  };
}
export default Page;
