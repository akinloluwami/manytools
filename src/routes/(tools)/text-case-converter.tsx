import ContentLayout from "@/components/shared/content-layout";
import { Textarea } from "@/components/ui/textarea";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CopyButton } from "@/components/shared";

export const Route = createFileRoute("/(tools)/text-case-converter")({
  component: RouteComponent,
});

type CaseType =
  | "uppercase"
  | "lowercase"
  | "capitalize"
  | "sentence"
  | "title"
  | "camel"
  | "pascal"
  | "snake"
  | "kebab"
  | "constant";

function RouteComponent() {
  const [inputText, setInputText] = useState("");

  const convertCase = (text: string, caseType: CaseType): string => {
    if (!text) return "";

    switch (caseType) {
      case "uppercase":
        return text.toUpperCase();

      case "lowercase":
        return text.toLowerCase();

      case "capitalize":
        return text.replace(/\b\w/g, (char) => char.toUpperCase());

      case "sentence":
        return text
          .toLowerCase()
          .replace(/(^\s*\w|[.!?]\s+\w)/g, (char) => char.toUpperCase());

      case "title":
        const smallWords = [
          "a",
          "an",
          "the",
          "and",
          "but",
          "or",
          "for",
          "nor",
          "on",
          "at",
          "to",
          "from",
          "by",
          "in",
          "of",
        ];
        return text
          .toLowerCase()
          .split(" ")
          .map((word, index) => {
            if (index === 0 || !smallWords.includes(word)) {
              return word.charAt(0).toUpperCase() + word.slice(1);
            }
            return word;
          })
          .join(" ");

      case "camel":
        return text
          .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
            index === 0 ? word.toLowerCase() : word.toUpperCase(),
          )
          .replace(/\s+/g, "")
          .replace(/[^a-zA-Z0-9]/g, "");

      case "pascal":
        return text
          .replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => word.toUpperCase())
          .replace(/\s+/g, "")
          .replace(/[^a-zA-Z0-9]/g, "");

      case "snake":
        return text
          .trim()
          .replace(/\s+/g, "_")
          .replace(/[^a-zA-Z0-9_]/g, "")
          .toLowerCase();

      case "kebab":
        return text
          .trim()
          .replace(/\s+/g, "-")
          .replace(/[^a-zA-Z0-9-]/g, "")
          .toLowerCase();

      case "constant":
        return text
          .trim()
          .replace(/\s+/g, "_")
          .replace(/[^a-zA-Z0-9_]/g, "")
          .toUpperCase();

      default:
        return text;
    }
  };

  const cases: { type: CaseType; label: string; example: string }[] = [
    { type: "uppercase", label: "UPPERCASE", example: "HELLO WORLD" },
    { type: "lowercase", label: "lowercase", example: "hello world" },
    {
      type: "capitalize",
      label: "Capitalize Each Word",
      example: "Hello World",
    },
    { type: "sentence", label: "Sentence case", example: "Hello world" },
    { type: "title", label: "Title Case", example: "Hello World" },
    { type: "camel", label: "camelCase", example: "helloWorld" },
    { type: "pascal", label: "PascalCase", example: "HelloWorld" },
    { type: "snake", label: "snake_case", example: "hello_world" },
    { type: "kebab", label: "kebab-case", example: "hello-world" },
    { type: "constant", label: "CONSTANT_CASE", example: "HELLO_WORLD" },
  ];

  return (
    <ContentLayout title="Text Case Converter">
      <div className="flex gap-6">
        <div className="w-[50%] flex flex-col gap-4">
          <div className="border border-black rounded-xl overflow-hidden">
            <div className="bg-black text-white p-3">
              <p className="font-medium">Input Text</p>
            </div>
            <Textarea
              className="w-full h-[calc(100vh-400px)] border-none outline-none focus-visible:ring-0"
              placeholder="Enter text to convert..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
          </div>
        </div>

        <div className="w-[50%] flex flex-col gap-3">
          <p className="text-lg font-semibold">Select Case Type</p>
          <div className="grid gap-2">
            {cases.map(({ type, label, example }) => (
              <div
                key={type}
                className="border border-gray-300 rounded-lg p-4 hover:border-black transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{label}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {convertCase(inputText || example, type) || example}
                    </p>
                  </div>
                  <CopyButton
                    textToCopy={convertCase(inputText, type)}
                    disabled={!inputText}
                    size="sm"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ContentLayout>
  );
}
