"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/src/store/Auth";
import { FloatingNav } from "@/src/components/ui/floating-navbar";
import { IconHome, IconQuestionMark, IconSearch, IconUser, IconLogout, IconLogin } from "@tabler/icons-react";

const MainNavbar = () => {
    const pathname = usePathname();
    const { user, logout } = useAuthStore();

    const navItems = [
        { name: "Home", link: "/", icon: <IconHome className="h-4 w-4" /> },
        { name: "Questions", link: "/questions", icon: <IconQuestionMark className="h-4 w-4" /> },
        { name: "Search", link: "/questions?search=", icon: <IconSearch className="h-4 w-4" /> },
    ];

    const handleLogout = async () => {
        await logout();
    };

    return (
        <FloatingNav
            navItems={navItems.map(item => ({
                name: item.name,
                link: item.link,
                icon: item.icon,
            }))}
        >
            {user ? (
                <>
                    <Link
                        href={`/users/${user.$id}/${user.name.toLowerCase().replace(/\s+/g, '-')}`}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-orange-400 hover:bg-orange-500/10 transition-all duration-200"
                    >
                        <IconUser className="h-4 w-4" />
                        <span className="hidden sm:inline">{user.name}</span>
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
                    >
                        <IconLogout className="h-4 w-4" />
                        <span className="hidden sm:inline">Logout</span>
                    </button>
                </>
            ) : (
                <Link 
                    href="/login" 
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-500 transition-all duration-200 shadow-lg shadow-orange-500/20"
                >
                    <IconLogin className="h-4 w-4" />
                    <span>Login</span>
                </Link>
            )}
        </FloatingNav>
    );
};

export default MainNavbar;

