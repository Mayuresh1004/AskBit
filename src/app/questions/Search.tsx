"use client";

import { Input } from "@/src/components/ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { IconSearch } from "@tabler/icons-react";

const Search = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [search, setSearch] = React.useState(searchParams.get("search") || "");

  // Update input value when URL changes (e.g., via back/forward navigation)
  React.useEffect(() => {
    setSearch(searchParams.get("search") || "");
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newSearchParams = new URLSearchParams(searchParams);

    if (search.trim()) {
      newSearchParams.set("search", search.trim());
    } else {
      newSearchParams.delete("search"); // removes query if input is empty
    }

    router.push(`${pathname}?${newSearchParams.toString()}`);
  };

  return (
    <form className="flex w-full flex-row gap-3" onSubmit={handleSearch}>
      <div className="relative flex-1">
        <IconSearch className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <Input
          type="text"
          placeholder="Search for questions, topics, or keywords..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl bg-white/10 pl-11 pr-4 py-3 text-white placeholder:text-gray-400 border-white/20 focus:border-orange-500 focus:ring-orange-500/20"
        />
      </div>
      <button
        type="submit"
        className="shrink-0 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-3 font-semibold text-white shadow-lg shadow-orange-500/20 transition-all hover:from-orange-600 hover:to-orange-500 hover:shadow-orange-500/30"
      >
        Search
      </button>
    </form>
  );
};

export default Search;
