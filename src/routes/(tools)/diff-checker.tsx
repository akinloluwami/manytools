import ContentLayout from "@/components/shared/content-layout";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { diffLines } from "diff";

export const Route = createFileRoute("/(tools)/diff-checker")({
  component: RouteComponent,
});

function RouteComponent() {
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");
  const [diffResult, setDiffResult] = useState<any[]>([]);

  const compareTexts = () => {
    const differences = diffLines(text1, text2);
    setDiffResult(differences);
  };

  return (
    <ContentLayout title="Text Difference Checker">
      <div className="flex gap-10">
        <div className="w-full space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="border border-purple-500 rounded-lg p-4 bg-purple-500/5">
              <textarea
                value={text1}
                onChange={(e) => setText1(e.target.value)}
                className="w-full h-[calc(100vh-400px)] border-none outline-none resize-none"
                placeholder="Enter first text here..."
              />
            </div>
            <div className="border border-purple-500 rounded-lg p-4 bg-purple-500/5">
              <textarea
                value={text2}
                onChange={(e) => setText2(e.target.value)}
                className="w-full h-[calc(100vh-400px)] border-none outline-none resize-none"
                placeholder="Enter second text here..."
              />
            </div>
          </div>
          <Button onClick={compareTexts} className="w-full">
            Compare Texts
          </Button>
          {diffResult.length > 0 && (
            <div className="border border-purple-500 rounded-lg p-4 bg-purple-500/5">
              <div className="prose max-w-none font-mono">
                {diffResult.map((part, index) => {
                  const lines = part.value
                    .split("\n")
                    .filter((line: string) => line.trim() !== "");
                  return lines.map((line: string, lineIndex: number) => (
                    <div
                      key={`${index}-${lineIndex}`}
                      className={`flex items-start gap-2 ${
                        part.added
                          ? "bg-green-200 text-green-800"
                          : part.removed
                            ? "bg-red-200 text-red-800"
                            : ""
                      }`}
                    >
                      <span className="text-gray-500 select-none">
                        {part.added ? "+" : part.removed ? "-" : " "}
                      </span>
                      <span>{line}</span>
                    </div>
                  ));
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </ContentLayout>
  );
}
