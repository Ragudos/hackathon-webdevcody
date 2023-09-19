import React from "react";
import { $getSelection, $isRangeSelection, type TextFormatType } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  FontBoldIcon,
  FontItalicIcon,
  StrikethroughIcon,
  UnderlineIcon,
} from "@radix-ui/react-icons";
import * as Toolbar from "@radix-ui/react-toolbar";
import { cn } from "@/lib/utils";

type Props = {
  activeFormats: Array<TextFormatType>;
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
  15: ["bold", "italic", "underline", "strikethrough"]
};

const supportedFormatTypes: Array<TextFormatType> = [
  "bold",
  "italic",
  "underline",
  "strikethrough"
];

const getTitle = (format: TextFormatType) => {
  switch (format) {
    case "bold":
      return "Bold (Ctrl+B)";
    case "italic":
      return "Italic (Ctrl+I)";
    case "underline":
      return "Underline (Ctrl+U)";
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
    default:
      return null;
  }
};

const TextFormatsPlugin: React.FC<Props> = ({ activeFormats }) => {
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
          const isActive = activeFormats.indexOf(format) !== -1;

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
};

export default TextFormatsPlugin;
