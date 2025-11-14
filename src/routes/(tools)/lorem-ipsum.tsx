import { createFileRoute } from "@tanstack/react-router";
import ContentLayout from "@/components/shared/content-layout";
import { LoremIpsum } from "lorem-ipsum";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { posthog } from "@/lib/posthog";
import { NumberInput, Select, CopyButton } from "@/components/shared";

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
    "paragraphs",
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

  return (
    <ContentLayout title="Lorem Ipsum Generator">
      <div className="flex flex-col lg:flex-row gap-10">
        <div className="lg:w-[70%] border border-black rounded-lg p-4">
          <textarea
            value={result}
            className="w-full h-[calc(100vh-400px)] border-none outline-none"
            readOnly
          ></textarea>
        </div>
        <div className="lg:w-[30%]">
          <div className="flex gap-2">
            <NumberInput
              value={value}
              onChange={(e) => {
                if (isNaN(Number(e.target.value))) return;
                setValue(Number(e.target.value));
              }}
            />
            <Select
              options={[
                { value: "paragraphs", label: "Paragraphs" },
                { value: "sentences", label: "Sentences" },
                { value: "words", label: "Words" },
              ]}
              value={type}
              onChange={(e) => setType(e.target.value as any)}
            />
          </div>
          <Button onClick={generateLoremIpsum} className="w-full mt-2">
            Generate
          </Button>
          <CopyButton textToCopy={result} className="w-full mt-2" />
        </div>
      </div>
    </ContentLayout>
  );
}
