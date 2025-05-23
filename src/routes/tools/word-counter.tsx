import ContentLayout from "@/components/shared/content-layout";
import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";

export const Route = createFileRoute("/tools/word-counter")({
  component: RouteComponent,
});

function RouteComponent() {
  const [text, setText] = useState("");

  const stats = useMemo(() => {
    const words = text.trim().split(/\s+/).filter(Boolean);
    const characters = text.length;
    const specialChars = (text.match(/[^a-zA-Z0-9\s]/g) || []).length;
    const paragraphs = text.split(/\n\s*\n/).filter(Boolean).length;

    const wordCountMap: Record<string, number> = {};
    for (const word of words) {
      const clean = word.toLowerCase().replace(/[^a-zA-Z0-9]/g, "");
      if (clean) wordCountMap[clean] = (wordCountMap[clean] || 0) + 1;
    }

    const topWords = Object.entries(wordCountMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    return {
      wordCount: words.length,
      characters,
      specialChars,

      paragraphs,
      topWords,
    };
  }, [text]);

  return (
    <ContentLayout title="Word Counter">
      <div className="flex gap-10">
        <div className="w-[70%] border border-purple-200 rounded-lg p-4 bg-purple-100">
          <div className="flex gap-4 justify-between">
            <Stat label="Words" value={stats.wordCount} />
            <Stat label="Characters" value={stats.characters} />
            <Stat label="Special Characters" value={stats.specialChars} />
            <Stat label="Paragraphs" value={stats.paragraphs} />
          </div>
          <textarea
            className="w-full h-[calc(100vh-400px)] mt-4 border-none outline-none"
            placeholder="Type or paste text here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        <div className="w-[30%]">
          <p className="text-lg font-semibold">Top words</p>
          <div className="mt-4">
            <div className="flex font-medium w-full justify-between">
              <p>Word</p>
              <p>Count</p>
            </div>
            <div className="w-full mt-4 flex flex-col gap-2">
              {stats.topWords.map(([word, count]) => (
                <div key={word} className="flex w-full justify-between">
                  <p>{word}</p>
                  <p>{count}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ContentLayout>
  );
}

const Stat = ({ label, value }: { label: string; value: number }) => (
  <div className="flex flex-col items-center">
    <p>{label}</p>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);
