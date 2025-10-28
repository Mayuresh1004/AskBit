import { tablesDB, users } from "@/src/models/server/config";
import { UserPrefs } from "@/src/store/Auth";
import React from "react";
import { answerCollection, db, questionCollection } from "@/src/models/name";
import { Query } from "node-appwrite";
import { NumberTicker } from "@/src/components/magicui/number-ticker";
import { IconMessageCircle, IconThumbUp, IconUser } from "@tabler/icons-react";

const Page = async ({ params }: { params: Promise<{ userId: string; userSlug: string }> }) => {
    const { userId, userSlug } = await params;
    
    const [user, questions, answers] = await Promise.all([
        users.get<UserPrefs>(userId),
        tablesDB.listRows({
            databaseId: db,
            tableId: questionCollection,
            queries: [
                Query.equal("authorId", userId),
                Query.limit(1), // for optimization
            ],
        }),
        tablesDB.listRows({
            databaseId: db,
            tableId: answerCollection,
            queries: [
                Query.equal("authorId", userId),
                Query.limit(1), // for optimization
            ],
        }),
    ]);

    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="group relative flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border border-orange-500/30 bg-white/5 p-8 backdrop-blur-sm shadow-xl shadow-orange-500/10 transition-all duration-300 hover:border-orange-500/50 hover:bg-white/10">
                <div className="absolute inset-x-4 top-4">
                    <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-200">
                        <IconUser className="h-5 w-5 text-orange-400" />
                        Reputation
                    </h2>
                </div>
                <div className="mt-8 text-center">
                    <p className="text-5xl font-bold bg-gradient-to-r from-orange-300 via-orange-400 to-orange-500 bg-clip-text text-transparent">
                        <NumberTicker value={user.prefs.reputation} />
                    </p>
                </div>
                <div className="pointer-events-none absolute inset-0 h-full bg-[radial-gradient(circle_at_50%_120%,rgba(249,115,22,0.15),rgba(255,255,255,0))]" />
            </div>
            
            <div className="group relative flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border border-orange-500/30 bg-white/5 p-8 backdrop-blur-sm shadow-xl shadow-orange-500/10 transition-all duration-300 hover:border-orange-500/50 hover:bg-white/10">
                <div className="absolute inset-x-4 top-4">
                    <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-200">
                        <IconMessageCircle className="h-5 w-5 text-blue-400" />
                        Questions
                    </h2>
                </div>
                <div className="mt-8 text-center">
                    <p className="text-5xl font-bold bg-gradient-to-r from-blue-300 via-blue-400 to-blue-500 bg-clip-text text-transparent">
                        <NumberTicker value={questions.total} />
                    </p>
                </div>
                <div className="pointer-events-none absolute inset-0 h-full bg-[radial-gradient(circle_at_50%_120%,rgba(59,130,246,0.15),rgba(255,255,255,0))]" />
            </div>
            
            <div className="group relative flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border border-orange-500/30 bg-white/5 p-8 backdrop-blur-sm shadow-xl shadow-orange-500/10 transition-all duration-300 hover:border-orange-500/50 hover:bg-white/10">
                <div className="absolute inset-x-4 top-4">
                    <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-200">
                        <IconThumbUp className="h-5 w-5 text-green-400" />
                        Answers
                    </h2>
                </div>
                <div className="mt-8 text-center">
                    <p className="text-5xl font-bold bg-gradient-to-r from-green-300 via-green-400 to-green-500 bg-clip-text text-transparent">
                        <NumberTicker value={answers.total} />
                    </p>
                </div>
                <div className="pointer-events-none absolute inset-0 h-full bg-[radial-gradient(circle_at_50%_120%,rgba(34,197,94,0.15),rgba(255,255,255,0))]" />
            </div>
        </div>
    );
};

export default Page;