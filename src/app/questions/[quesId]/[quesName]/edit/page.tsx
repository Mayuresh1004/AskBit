"use client";

import QuestionForm from "@/src/components/QuestionForm";
import { Particles } from "@/src/components/magicui/particles";
import { TracingBeam } from "@/src/components/ui/tracing-beam";
import { tablesDB } from "@/src/models/client/config";
import { db, questionCollection } from "@/src/models/name";
import { Models } from "appwrite";
import React, { useEffect, useState } from "react";

const EditQuestionPage = ({ params }: { params: { quesId: string } }) => {
    const [question, setQuestion] = useState<Models.Row | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuestion = async () => {
            try {
                const data = await tablesDB.getRow({
                    databaseId: db,
                    tableId: questionCollection,
                    rowId: params.quesId,
                });
                setQuestion(data);
            } catch (error) {
                console.error("Error fetching question:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchQuestion();
    }, [params.quesId]);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p className="text-xl">Loading...</p>
            </div>
        );
    }

    if (!question) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p className="text-xl">Question not found</p>
            </div>
        );
    }

    return (
        <TracingBeam className="container pl-6">
            <Particles
                className="fixed inset-0 h-full w-full"
                quantity={500}
                ease={100}
                color="#ffffff"
                refresh
            />
            <div className="relative mx-auto max-w-4xl px-4 pb-20 pt-36">
                <h1 className="mb-8 text-3xl font-bold">Edit Question</h1>
                <QuestionForm question={question} />
            </div>
        </TracingBeam>
    );
};

export default EditQuestionPage;

