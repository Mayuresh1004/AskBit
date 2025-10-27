"use client";

import RTE from "@/src/components/RTE";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { useAuthStore } from "@/src/store/Auth";
import { cn } from "@/src/lib/utils";
import slugify from "@/src/utils/slugify";
import { IconX } from "@tabler/icons-react";
import { Models, ID } from "appwrite";
import { useRouter } from "next/navigation";
import React from "react";
import { tablesDB, storage } from "@/src/models/client/config";
import { db, questionAttachmentBucket, questionCollection } from "@/src/models/name";
import confetti from "canvas-confetti";
import { Meteors } from "./magicui/meteors";

const LabelInputContainer = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) => {
    return (
        <div
            className={cn(
                "relative flex w-full flex-col space-y-2 overflow-hidden rounded-xl border border-white/20 bg-slate-950 p-4",
                className
            )}
        >
            <Meteors number={30} />
            {children}
        </div>
    );
};

/**
 * ******************************************************************************
 * ![INFO]: for buttons, refer to https://ui.aceternity.com/components/tailwindcss-buttons
 * ******************************************************************************
 */
const QuestionForm = ({ question }: { question?: Models.Row }) => {
    const { user } = useAuthStore();
    const [tag, setTag] = React.useState("");
    const router = useRouter();

    const [formData, setFormData] = React.useState({
        title: String(question?.title || ""),
        content: String(question?.content || ""),
        authorId: user?.$id,
        tags: new Set((question?.tags || []) as string[]),
        attachment: null as File | null,
    });

    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState("");

    const loadConfetti = (timeInMS = 3000) => {
        const end = Date.now() + timeInMS; // 3 seconds
        const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"];

        const frame = () => {
            if (Date.now() > end) return;

            confetti({
                particleCount: 2,
                angle: 60,
                spread: 55,
                startVelocity: 60,
                origin: { x: 0, y: 0.5 },
                colors: colors,
            });
            confetti({
                particleCount: 2,
                angle: 120,
                spread: 55,
                startVelocity: 60,
                origin: { x: 1, y: 0.5 },
                colors: colors,
            });

            requestAnimationFrame(frame);
        };

        frame();
    };

    const create = async () => {
        let attachmentId: string | null = null;

        if (formData.attachment) {
            const storageResponse = await storage.createFile(
                questionAttachmentBucket,
                ID.unique(),
                formData.attachment
            );
            attachmentId = storageResponse.$id;
        }

        const createData: Record<string, any> = {
            title: formData.title,
            content: formData.content,
            authorId: formData.authorId,
            tags: Array.from(formData.tags),
        };

        if (attachmentId) {
            createData.attachmentId = attachmentId;
        }

        const response = await tablesDB.createRow({
            databaseId: db,
            tableId: questionCollection,
            rowId: ID.unique(),
            data: createData,
        });

        loadConfetti();

        return response;
    };

    const update = async () => {
        if (!question) throw new Error("Please provide a question");

        const attachmentId = await (async () => {
            if (!formData.attachment) return question?.attachmentId as string | null;

            if (question.attachmentId) {
                await storage.deleteFile(questionAttachmentBucket, question.attachmentId);
            }

            const file = await storage.createFile(
                questionAttachmentBucket,
                ID.unique(),
                formData.attachment
            );

            return file.$id;
        })();

        const updateData: Record<string, any> = {
            title: formData.title,
            content: formData.content,
            authorId: formData.authorId,
            tags: Array.from(formData.tags),
        };

        if (attachmentId) {
            updateData.attachmentId = attachmentId;
        }

        const response = await tablesDB.updateRow({
            databaseId: db,
            tableId: questionCollection,
            rowId: question.$id,
            data: updateData,
        });

        return response;
    };

    const submit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Only title and content are required
        if (!formData.title || !formData.content || !formData.authorId) {
            setError(() => "Please fill out title and content (tags and image are optional)");
            return;
        }

        setLoading(() => true);
        setError(() => "");

        try {
            const response = question ? await update() : await create();

            router.push(`/questions/${response.$id}/${slugify(formData.title)}`);
        } catch (error: any) {
            setError(() => error.message);
        }

        setLoading(() => false);
    };

    return (
        <form className="space-y-4" onSubmit={submit}>
            {error && (
                <LabelInputContainer>
                    <div className="text-center">
                        <span className="text-red-500">{error}</span>
                    </div>
                </LabelInputContainer>
            )}
            <LabelInputContainer>
                <Label htmlFor="title" className="text-white">
                    Title Address
                    <br />
                    <small className="text-gray-400">
                        Be specific and imagine you&apos;re asking a question to another person.
                    </small>
                </Label>
                <Input
                    id="title"
                    name="title"
                    placeholder="e.g. Is there an R function for finding the index of an element in a vector?"
                    type="text"
                    value={formData.title}
                    onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="bg-white/10 text-white placeholder:text-gray-500 border-white/20"
                />
            </LabelInputContainer>
            <LabelInputContainer>
                <Label htmlFor="content" className="text-white">
                    What are the details of your problem?
                    <br />
                    <small className="text-gray-400">
                        Introduce the problem and expand on what you put in the title. Minimum 20
                        characters.
                    </small>
                </Label>
                <RTE
                    value={formData.content}
                    onChange={value => setFormData(prev => ({ ...prev, content: value || "" }))}
                />
            </LabelInputContainer>
            <LabelInputContainer>
                <Label htmlFor="image" className="text-white">
                    Image (Optional)
                    <br />
                    <small className="text-gray-400">
                        Add image to your question to make it more clear and easier to understand.
                    </small>
                </Label>
                <Input
                    id="image"
                    name="image"
                    accept="image/*"
                    type="file"
                    onChange={e => {
                        const files = e.target.files;
                        if (!files || files.length === 0) return;
                        setFormData(prev => ({
                            ...prev,
                            attachment: files[0],
                        }));
                    }}
                    className="bg-white/10 text-white border-white/20 file:text-white"
                />
            </LabelInputContainer>
            <LabelInputContainer>
                <Label htmlFor="tag" className="text-white">
                    Tags
                    <br />
                    <small className="text-gray-400">
                        Add tags to describe what your question is about. Start typing to see
                        suggestions.
                    </small>
                </Label>
                <div className="flex w-full gap-4">
                    <div className="w-full">
                        <Input
                            id="tag"
                            name="tag"
                            placeholder="e.g. javascript react nextjs"
                            type="text"
                            value={tag}
                            onChange={e => setTag(() => e.target.value)}
                            className="bg-white/10 text-white placeholder:text-gray-500 border-white/20"
                        />
                    </div>
                    <button
                        className="relative shrink-0 rounded-lg border border-orange-500 bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-2 text-sm font-semibold text-white transition-all duration-200 hover:from-orange-600 hover:to-orange-500 hover:shadow-lg hover:shadow-orange-500/30"
                        type="button"
                        onClick={() => {
                            if (tag.length === 0) return;
                            setFormData(prev => ({
                                ...prev,
                                tags: new Set([...Array.from(prev.tags), tag]),
                            }));
                            setTag(() => "");
                        }}
                    >
                        Add Tag
                    </button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {Array.from(formData.tags).map((tag, index) => (
                        <div key={index} className="group inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-1.5 text-sm transition-all hover:bg-white/20">
                            <span className="text-white">{tag}</span>
                            <button
                                onClick={() => {
                                    setFormData(prev => ({
                                        ...prev,
                                        tags: new Set(
                                            Array.from(prev.tags).filter(t => t !== tag)
                                        ),
                                    }));
                                }}
                                type="button"
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <IconX size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            </LabelInputContainer>
            <button
                className="inline-flex h-12 items-center justify-center rounded-lg border border-orange-500 bg-gradient-to-r from-orange-500 to-orange-600 px-8 font-semibold text-white transition-all duration-200 hover:from-orange-600 hover:to-orange-500 hover:shadow-2xl hover:shadow-orange-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
                type="submit"
                disabled={loading}
            >
                {loading ? "Publishing..." : question ? "Update Question" : "Publish Question"}
            </button>
        </form>
    );
};

export default QuestionForm;