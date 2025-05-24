import { createFileRoute } from "@tanstack/react-router";
import ContentLayout from "@/components/shared/content-layout";
import { LoremIpsum } from "lorem-ipsum";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AnimatePresence, motion } from "motion/react";
import { posthog } from "@/lib/posthog";

export const Route = createFileRoute("/(tools)/lorem-ipsum")({
  component: RouteComponent,
});

function RouteComponent() {
  const lorem = new LoremIpsum({
    sentencesPerParagraph: {
      max: 8,
      min: 4,
    },
    wordsPerSentence: {
      max: 16,
      min: 4,
    },
  });

  const [value, setValue] = useState(5);
  const [type, setType] = useState<"paragraphs" | "sentences" | "words">(
    "paragraphs"
  );
  const [result, setResult] = useState<string>("");

  const generateLoremIpsum = () => {
    posthog.capture("lorem_ipsum_generator");
    if (type === "paragraphs") {
      const ipsum = lorem.generateParagraphs(value);
      setResult(ipsum);
    } else if (type === "sentences") {
      const ipsum = lorem.generateSentences(value);
      setResult(ipsum);
    } else {
      const ipsum = lorem.generateWords(value);
      setResult(ipsum);
    }
  };

  useEffect(() => {
    generateLoremIpsum();
  }, []);

  const [copied, setCopied] = useState(false);

  return (
    <ContentLayout title="Lorem Ipsum Generator">
      <div className="flex gap-10">
        <div className="w-[70%] border border-purple-500 rounded-lg p-4 bg-purple-500/5">
          <textarea
            value={result}
            className="w-full h-[calc(100vh-400px)] border-none outline-none"
            readOnly
          ></textarea>
        </div>
        <div className="w-[30%]">
          <div className="flex gap-2">
            <Input
              value={value}
              onChange={(e) => {
                if (isNaN(Number(e.target.value))) return;
                setValue(Number(e.target.value));
              }}
              className="w-[50%]"
            />
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="border-2 border-purple-100 focus:border-purple-500 rounded-lg px-4 py-2 outline-none w-[50%]"
            >
              <option value="paragraphs">Paragraphs</option>
              <option value="sentences">Sentences</option>
              <option value="words">Words</option>
            </select>
          </div>
          <Button onClick={generateLoremIpsum} className="w-full mt-2">
            Generate
          </Button>
          <Button
            onClick={() => {
              navigator.clipboard.writeText(result);
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            }}
            className="w-full mt-2 !bg-purple-100 !text-purple-500 border !border-purple-500 border-dotted hover:!bg-purple-200 overflow-hidden relative h-10"
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={copied ? "copied" : "copy"}
                initial={false}
                animate={{ y: 0 }}
                exit={{ y: -20 }}
                transition={{ duration: 0.25 }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              >
                {copied ? "Copied!" : "Copy"}
              </motion.span>
            </AnimatePresence>
          </Button>
        </div>
      </div>
    </ContentLayout>
  );
}
