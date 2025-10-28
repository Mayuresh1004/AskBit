import { avatars } from "@/src/models/client/config";
import { users } from "@/src/models/server/config";
import { UserPrefs } from "@/src/store/Auth";
import convertDateToRelativeTime from "@/src/utils/relativeTime";
import React from "react";
import EditButton from "./EditButton";
import { IconClockFilled, IconUserFilled } from "@tabler/icons-react";
import Navbar from "./NavBar";
import { Particles } from "@/src/components/magicui/particles";

const Layout = async ({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ userId: string; userSlug: string }>;
}) => {
    const { userId, userSlug } = await params;
    const user = await users.get<UserPrefs>(userId);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            <Particles
                className="absolute inset-0"
                quantity={80}
                ease={80}
                color="#ffffff"
                refresh
            />
            <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-6">
                <div className="flex flex-col gap-6 sm:flex-row">
                    <div className="w-40 shrink-0">
                        <picture className="block w-full">
                            <img
                                src={avatars.getInitials(user.name, 200, 200).toString()}
                                alt={user.name}
                                className="h-full w-full rounded-xl border-2 border-orange-500/30 object-cover ring-2 ring-orange-500/20 shadow-xl shadow-orange-500/10"
                            />
                        </picture>
                    </div>
                    <div className="w-full">
                        <div className="flex items-start justify-between">
                            <div className="block space-y-2">
                                <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-white to-orange-300 bg-clip-text text-transparent">{user.name}</h1>
                                <p className="text-lg text-gray-300">{user.email}</p>
                                <div className="flex flex-wrap gap-3 text-sm">
                                    <span className="flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-gray-200">
                                        <IconUserFilled className="w-4 shrink-0" /> 
                                        Joined {convertDateToRelativeTime(new Date(user.$createdAt))}
                                    </span>
                                    <span className="flex items-center gap-1.5 rounded-lg bg-orange-500/20 px-3 py-1.5 text-orange-300">
                                        <IconClockFilled className="w-4 shrink-0" /> 
                                        Last activity {convertDateToRelativeTime(new Date(user.$updatedAt))}
                                    </span>
                                </div>
                            </div>
                            <div className="shrink-0">
                                <EditButton />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="my-6 h-px bg-gradient-to-r from-transparent via-orange-500/40 to-transparent"></div>
                <div className="flex flex-col gap-4 sm:flex-row">
                    <Navbar />
                    <div className="w-full">{children}</div>
                </div>
            </div>
        </div>
    );
};

export default Layout;