"use client";

import React from "react";
import { BorderBeam } from "./magicui/border-beam";
import Link from "next/link";
import { Models } from "appwrite";
import slugify from "@/src/utils/slugify";
import { avatars } from "@/src/models/client/config";
import convertDateToRelativeTime from "@/src/utils/relativeTime";
import { IconMessageCircle, IconThumbUp } from "@tabler/icons-react";
import { Question, User } from "@/src/types/database";

const QuestionCard = ({ ques }: { ques: Question }) => {
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
            className="group relative overflow-hidden rounded-xl border border-white/20 bg-white/5 p-6 transition-all duration-300 hover:border-white/40 hover:bg-white/10 hover:shadow-xl"
        >
            <BorderBeam size={height} duration={12} delay={9} />
            
            <div className="relative flex flex-col gap-6">
                {/* Title and Stats Row */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                    <div className="flex-1">
                        <Link
                            href={`/questions/${ques.$id}/${slugify(ques.title)}`}
                            className="group-hover:text-orange-400 transition-colors duration-200"
                        >
                            <h2 className="text-xl font-semibold text-white ">
                                {ques.title}
                            </h2>
                        </Link>
                    </div>
                    
                    {/* Stats */}
                    <div className="flex shrink-0 gap-4 text-sm sm:flex-col sm:gap-2">
                        <div className="flex items-center gap-2">
                            <IconThumbUp className="h-4 w-4 text-gray-400" />
                            <span className="font-medium text-white">{ques.totalVotes}</span>
                            <span className="text-gray-400">votes</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <IconMessageCircle className="h-4 w-4 text-gray-400" />
                            <span className="font-medium text-white">{ques.totalAnswers}</span>
                            <span className="text-gray-400">answers</span>
                        </div>
                    </div>
                </div>

                {/* Tags */}
                {ques.tags && ques.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {ques.tags.map((tag: string) => (
                            <Link
                                key={tag}
                                href={`/questions?tag=${tag}`}
                                className="inline-block rounded-lg bg-white/10 px-3 py-1 text-xs font-medium text-orange-400 transition-all duration-200 hover:bg-white/20 hover:text-orange-300"
                            >
                                #{tag}
                            </Link>
                        ))}
                    </div>
                )}

                {/* Author and Time */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                        <picture>
                            <img
                                src={avatars.getInitials(ques.author?.name || 'Unknown', 32, 32).toString()}
                                alt={ques.author?.name || 'Unknown'}
                                className="rounded-full"
                            />
                        </picture>
                        <div className="flex items-center gap-2">
                            <Link
                                href={`/users/${ques.author?.$id}/${slugify(ques.author?.name || 'Unknown')}`}
                                className="font-medium text-white hover:text-orange-400 transition-colors"
                            >
                                {ques.author?.name || 'Unknown'}
                            </Link>
                            <span className="flex items-center gap-1 text-orange-500">
                                <IconThumbUp className="h-3 w-3" />
                                {ques.author?.reputation || 0}
                            </span>
                        </div>
                    </div>
                    <span className="text-gray-500">
                        asked {convertDateToRelativeTime(new Date(ques.$createdAt))}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default QuestionCard;
