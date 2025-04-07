import Image from "next/image";
interface MatchCardProps {
    teamA: string; // Image URL for Team A
    teamB: string; // Image URL for Team B
  }
export default function MatchCard({ teamA, teamB }:MatchCardProps) {
    return (
        <div className="relative w-20 h-20 rounded-md overflow-hidden border border-gray-300">
          {/* Diagonal Split */}
          <div className="absolute inset-0">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <polygon points="0,0 100,0 0,100" className="fill-green-600" />
              <polygon points="100,0 100,100 0,100" className="fill-blue-600" />
            </svg>
          </div>
    
          {/* Team Logos */}
          <div className="absolute top-2 left-2">
            <Image src={teamA} alt="Team A" width={25} height={25} className="rounded-full" />
          </div>
          <div className="absolute bottom-2 right-2">
            <Image src={teamB} alt="Team B" width={25} height={25} className="rounded-full" />
          </div>
    
          {/* VS Text - Centered on Divider */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 bg-white border border-gray-400 rounded-full flex items-center justify-center shadow-md">
              <span className="text-black font-bold text-xs">VS</span>
            </div>
          </div>
        </div>
      );
    };
