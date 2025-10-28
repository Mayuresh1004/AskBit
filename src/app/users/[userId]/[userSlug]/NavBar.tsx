"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import React from "react";

const Navbar = () => {
    const { userId, userSlug } = useParams();
    const pathname = usePathname();

    const items = [
        {
            name: "Summary",
            href: `/users/${userId}/${userSlug}`,
        },
        {
            name: "Questions",
            href: `/users/${userId}/${userSlug}/questions`,
        },
        {
            name: "Answers",
            href: `/users/${userId}/${userSlug}/answers`,
        },
        {
            name: "Votes",
            href: `/users/${userId}/${userSlug}/votes`,
        },
    ];

    return (
        <ul className="flex w-full shrink-0 gap-2 overflow-auto sm:w-48 sm:flex-col">
            {items.map(item => (
                <li key={item.name}>
                    <Link
                        href={item.href}
                        className={`block w-full rounded-lg px-4 py-2.5 text-sm font-medium duration-200 transition-all ${
                            pathname === item.href
                                ? "bg-orange-500/20 border border-orange-500/40 text-orange-300 shadow-lg shadow-orange-500/10"
                                : "border border-white/20 bg-white/5 text-gray-300 hover:bg-white/10 hover:border-orange-500/30 hover:text-orange-200"
                        }`}
                    >
                        {item.name}
                    </Link>
                </li>
            ))}
        </ul>
    );
};

export default Navbar;