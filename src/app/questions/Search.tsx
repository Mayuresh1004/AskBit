"use client";

import { Input } from "@/components/ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { Suspense } from "react";

const SearchForm = () => {
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
    <form className="flex w-full flex-row gap-4" onSubmit={handleSearch}>
      <Input
        type="text"
        placeholder="Search questions..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <button
        type="submit"
        className="shrink-0 rounded bg-orange-500 px-4 py-2 font-semibold text-white hover:bg-orange-600 transition-colors"
      >
        Search
      </button>
    </form>
  );
};

const Search = () => {
  return (
    <Suspense fallback={<div>Loading search...</div>}>
      <SearchForm />
    </Suspense>
  );
};

export default Search;
