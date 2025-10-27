"use client";

import { FloatingNav } from "@/components/ui/floating-navbar";
import { useAuthStore } from "@/store/Auth";
import { IconHome, IconQuestionMark, IconUser, IconLogin, IconLogout, IconPlus } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navigation() {
  const { user, hydrated, logout } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  if (!mounted) {
    return null;
  }

  const navItems = [
    {
      name: "Home",
      link: "/",
      icon: <IconHome className="h-4 w-4" />,
    },
    {
      name: "Questions",
      link: "/questions",
      icon: <IconQuestionMark className="h-4 w-4" />,
    },
    ...(user
      ? [
          {
            name: "Ask Question",
            link: "/questions/ask",
            icon: <IconPlus className="h-4 w-4" />,
          },
          {
            name: "Profile",
            link: `/users/${user.$id}/${user.name}`,
            icon: <IconUser className="h-4 w-4" />,
          },
          {
            name: "Logout",
            link: "#",
            icon: <IconLogout className="h-4 w-4" />,
            onClick: handleLogout,
          },
        ]
      : [
          {
            name: "Login",
            link: "/login",
            icon: <IconLogin className="h-4 w-4" />,
          },
          {
            name: "Register",
            link: "/register",
            icon: <IconUser className="h-4 w-4" />,
          },
        ]),
  ];

  return (
    <FloatingNav
      navItems={navItems}
      className="border border-white/[0.2] bg-black-100/80 backdrop-blur-md"
    />
  );
}
