// components/TeamSelect.tsx
'use client';

import { Listbox } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import Image from 'next/image';

interface Team {
  tid: string;
  abbr: string;
  logo_url: string;
}

interface TeamSelectProps {
  selectedTeam: any;
  onChange: (team: any) => void;
  teams: Team[];
  label: string;
}

export default function TeamSelect({ selectedTeam, onChange, teams, label }: TeamSelectProps) {
  return (
      <Listbox value={selectedTeam} onChange={onChange}>
        <div className="relative mt-1">
          <Listbox.Button className="relative w-full cursor-pointer outline-none">
            <span className="flex items-center">
              {selectedTeam && (
                <Image
                  src={selectedTeam.logo_url}
                  alt=""
                  width={24}
                  height={24}
                  className="mr-2 h-6 w-6 rounded-full"
                />
              )}
              {selectedTeam?.abbr || `Select ${label}`}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
            </span>
          </Listbox.Button>

          <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {teams.map((team) => (
              <Listbox.Option
                key={team.tid}
                className={({ active }) =>
                  `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                    active ? 'bg-blue-100 text-blue-900' : 'text-gray-900'
                  }`
                }
                value={team}
              >
                {({ selected }) => (
                  <>
                    <span className="flex items-center">
                      <Image
                        src={team.logo_url}
                        alt={team.abbr}
                        width={24}
                        height={24}
                        className="mr-2 h-6 w-6 rounded-full"
                      />
                      {team.abbr}
                    </span>
                    {selected ? (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                        <CheckIcon className="h-5 w-5 text-blue-600" />
                      </span>
                    ) : null}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </div>
      </Listbox>
  );
}
