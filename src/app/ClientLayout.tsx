"use client";

import { useEffect } from "react";
import { useAuthStore } from "../store/Auth";
import MainNavbar from "../components/MainNavbar";

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { hydrated, verifySession } = useAuthStore();

    useEffect(() => {
        if (hydrated) {
            verifySession();
        }
    }, [hydrated, verifySession]);

    return (
        <>
            <MainNavbar />
            {children}
        </>
    );
}

