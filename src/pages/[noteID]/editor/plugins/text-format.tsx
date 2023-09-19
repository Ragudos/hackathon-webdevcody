import React from "react";
import { $getSelection, $isRangeSelection, type TextFormatType } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  CodeIcon,
  FontBoldIcon,
  FontItalicIcon,
  StrikethroughIcon,
  UnderlineIcon,
} from "@radix-ui/react-icons";
import * as Toolbar from "@radix-ui/react-toolbar";
import { cn } from "@/lib/utils";

type Props = {
  activeFormat: number;
};

type TextFormatKeyValuePair = {
  [key: number]: TextFormatType | Array<TextFormatType>
};

const formatCodeToValuePair: TextFormatKeyValuePair = {
  1: "bold",
  2: "italic",
  3: ["bold", "italic"],
  4: "strikethrough",
  5: ["bold", "strikethrough"],
  6: ["italic", "strikethrough"],
  7: ["bold", "italic", "strikethrough"],
  8: "underline",
  9: ["bold", "underline"],
  10: ["italic", "underline"],
  11: ["bold", "italic", "underline"],
  12: ["underline", "strikethrough"],
  13: ["bold", "underline", "strikethrough"],
  14: ["italic", "underline", "strikethrough"],
  15: ["bold", "italic", "underline", "strikethrough"],
  16: "code",
  17: ["bold", "code"],
  18: ["italic", "code"],
  19: ["bold", "italic", "code"],
  20: ["strikethrough", "code"],
  21: ["bold", "strikethrough", "code"],
  23: ["bold", "italic", "strikethrough", "code"],
  25: ["bold", "underline", "code"],
  26: ["italic", "underline", "code"],
  27: ["bold", "italic", "underline", "code"],
  29: ["bold", "underline", "strikethrough", "code"],
  30: ["italic", "underline", "strikethrough", "code"],
  31: ["bold", "italic", "underline", "strikethrough", "code"],
  128: "highlight",
  129: ["bold", "highlight"],
  130: ["italic", "highlight"],
  132: ["strikethrough", "highlight"],
  136: ["underline", "highlight"],
  139: ["bold", "italic", "code", "highlight"],
  141: ["bold", "underline", "strikethrough", "highlight"],
  144: ["code", "highlight"],
  131: ["bold", "italic", "highlight"],
  134: ["italic", "strikethrough", "highlight"],
  138: ["italic", "underline", "highlight"],
  133: ["bold", "strikethrough", "highlight"],
  137: ["bold", "underline", "highlight"],
  148: ["strikethrough", "code", "highlight"],
  145: ["bold", "code", "highlight"],
  146: ["italic", "code", "highlight"],
  147: ["bold", "italic", "code", "highlight"],
  149: ["bold", "strikethrough", "code", "highlight"],
  151: ["bold", "italic", "strikethrough", "code", "highlight"],
  155: ["bold", "italic", "underline", "strikethrough", "code", "highlight"],
  153: ["bold", "underline", "code", "highlight"],
  157: ["bold",  "strikethrough", "underline", "code", "highlight"],
  159: ["bold", "italic", "underline", "code", "highlight", "strikethrough"]
};

const supportedFormatTypes: Array<TextFormatType> = [
  "bold",
  "italic",
  "underline",
  "strikethrough",
  "code",
  "highlight"
];

const getTitle = (format: TextFormatType) => {
  switch (format) {
    case "bold":
      return "Bold (Ctrl+B)";
    case "italic":
      return "Italic (Ctrl+I)";
    case "underline":
      return "Underline (Ctrl+U)";
    case "strikethrough":
      return "Strikethrough";
    case "code":
      return "Code";
    case "highlight":
      return "Highlight";
  }
};

const getFormat = (format: TextFormatType) => {
  switch (format) {
    case "bold":
      return <FontBoldIcon className="w-4 h-4" />;
    case "italic":
      return <FontItalicIcon className="w-4 h-4" />;
    case "underline":
      return <UnderlineIcon className="w-4 h-4" />;
    case "strikethrough":
      return <StrikethroughIcon className="w-4 h-4" />;
    case "code":
      return <CodeIcon className="w-4 h-4" />;
    case "highlight":
      return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
      </svg>;
    default:
      return null;
  }
};

const isFormatActive = (activeFormat: number, format: TextFormatType): boolean => {
  const keys = Object.keys(formatCodeToValuePair);

  for (let idx = 0; idx < keys.length; ++idx) {
    const key = +keys[idx];
    if (key === activeFormat) {
      if (Array.isArray(formatCodeToValuePair[key])) {
        for (let j = 0; j < formatCodeToValuePair[key].length; ++j) {
          if (formatCodeToValuePair[key][j] === format) {
            return true;
          }
        }
      } else {
        if (formatCodeToValuePair[key] === format) {
          return true;
        }
      }
    }
  }

  return false;
};

const TextFormatPlugin: React.FC<Props> = React.memo(
  ({ activeFormat }) => {
    const [editor] = useLexicalComposerContext();

    const changeFormat = React.useCallback(
      (format: TextFormatType) => {
        editor.update(() => {
          const selection = $getSelection();
          const isInRange = $isRangeSelection(selection);
          if (isInRange) {
            selection.formatText(format);
          }
        });
      },
      [editor],
    );

    return (
      <Toolbar.Root className="gap-1 flex flex-wrap">
        <Toolbar.ToggleGroup type="multiple" className="flex gap-1 items-center">
          {supportedFormatTypes.map((format) => {
            const isActive = isFormatActive(activeFormat, format);

            return (
              <Toolbar.ToggleItem
                className={cn("p-1 hover:bg-accent/10 opacity-60 rounded-sm", {
                  "opacity-90 bg-accent/20": isActive,
                })}
                key={format}
                value={format}
                onClick={() => changeFormat(format)}
                title={getTitle(format)}
                aria-label={getTitle(format)}
                aria-pressed={isActive}
                data-state={isActive}
              >
                {getFormat(format)}
              </Toolbar.ToggleItem>
            );
          })}
        </Toolbar.ToggleGroup>
      </Toolbar.Root>
    );
  }
);

TextFormatPlugin.displayName = "TextFormatPlugin";
export default TextFormatPlugin;
