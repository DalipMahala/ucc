'use client'; // very important!

import { usePathname, useRouter } from 'next/navigation';
import React from 'react';

const StateSelector = () => {
  const router = useRouter();
  const pathname = usePathname();

  let parts = pathname.split('/');

  let defaultStats = parts[parts.length - 1];
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const statsType = e.target.value;
    defaultStats = statsType;

    if (statsType) {
        parts[parts.length - 1] = statsType;
        const newPath = parts.join('/');
        console.log(newPath);
      router.push(newPath);
    }
  };

  return (

    <select
    className="border-[1px] rounded-md p-2 bg-[#ffffff]"
    onChange={handleChange}
    defaultValue={defaultStats}
    >
    <option value="batting-most-run">Most Runs</option>
    <option value="batting-highest-average">
        Best Batting Average
    </option>
    <option value="batting-highest-strike-rate">
        Best Batting Strike Rate
    </option>
    <option value="batting-most-hundreds">Most Hundreds</option>
    <option value="batting-most-fifties">Most Fifties</option>
    <option value="batting-most-fours">Most Fours</option>
    <option value="batting-most-sixes">Most Sixes</option>
    <option value="bowling-most-wicket">Most Wickets</option>
    <option value="bowling-best-average">Best Bowling Average</option>
    <option value="bowling-best-figures">Best Bowling</option>
    <option value="bowling-most-five-wicket-hauls">Most 5 Wickets Haul</option>
    <option value="bowling-best-economy-rates">Best Economy</option>
    <option value="bowling-best-strike">
        Best Bowling Strike Rate
    </option>
    </select>
  );
};

export default StateSelector;
