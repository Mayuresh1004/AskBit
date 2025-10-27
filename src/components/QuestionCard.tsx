"use client";

import React from "react";
import { BorderBeam } from "./magicui/border-beam";
import Link from "next/link";
import { Models } from "appwrite";
import slugify from "@/utils/slugify";
import { avatars } from "@/models/client/config";
import convertDateToRelativeTime from "@/utils/relativeTime";

type ProcessedQuestion = Models.Row & {
    title: string;
    tags: string[];
    totalVotes: number;
    totalAnswers: number;
    author: {
        $id: string;
        name: string;
        reputation: number;
    };
};

const QuestionCard = ({ ques }: { ques: ProcessedQuestion }) => {
    const [height, setHeight] = React.useState(0);
    const ref = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (ref.current) {
            setHeight(ref.current.clientHeight);
        }
    }, [ref]);

    return (
        <div
            ref={ref}
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 p-6 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/10 hover:shadow-2xl hover:shadow-blue-500/10"
        >
            <BorderBeam size={height} duration={12} delay={9} />
            
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            
            <div className="relative flex flex-col gap-6 sm:flex-row">
                {/* Stats */}
                <div className="flex shrink-0 flex-row gap-6 text-center sm:flex-col sm:text-right">
                    <div className="flex flex-col items-center">
                        <div className="text-2xl font-bold text-white">{ques.totalVotes}</div>
                        <div className="text-xs text-gray-400">votes</div>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="text-2xl font-bold text-white">{ques.totalAnswers}</div>
                        <div className="text-xs text-gray-400">answers</div>
                    </div>
                </div>
                
                {/* Content */}
                <div className="relative w-full">
                    <Link
                        href={`/questions/${ques.$id}/${slugify(ques.title)}`}
                        className="block transition-colors duration-200 hover:text-blue-400"
                    >
                        <h2 className="mb-3 text-xl font-semibold text-white group-hover:text-blue-400 sm:text-2xl">
                            {ques.title}
                        </h2>
                    </Link>
                    
                    {/* Tags */}
                    <div className="mb-4 flex flex-wrap gap-2">
                        {ques.tags.map((tag: string) => (
                            <Link
                                key={tag}
                                href={`/questions?tag=${tag}`}
                                className="inline-block rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 px-3 py-1 text-xs font-medium text-blue-300 transition-all duration-200 hover:from-blue-500/30 hover:to-purple-500/30 hover:scale-105"
                            >
                                #{tag}
                            </Link>
                        ))}
                    </div>
                    
                    {/* Author and time */}
                    <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                        <div className="flex items-center gap-2">
                            <picture>
                                <img
                                    src={avatars.getInitials(ques.author.name, 32, 32)}
                                    alt={ques.author.name}
                                    className="rounded-full ring-2 ring-white/20"
                                />
                            </picture>
                            <div className="flex flex-col">
                                <Link
                                    href={`/users/${ques.author.$id}/${slugify(ques.author.name)}`}
                                    className="font-medium text-blue-400 transition-colors duration-200 hover:text-blue-300"
                                >
                                    {ques.author.name}
                                </Link>
                                <span className="text-xs text-gray-400">
                                    {ques.author.reputation} reputation
                                </span>
                            </div>
                        </div>
                        <div className="text-gray-400">
                            asked {convertDateToRelativeTime(new Date(ques.$createdAt))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuestionCard;