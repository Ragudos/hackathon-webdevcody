import { $getSelection, $isRangeSelection, REDO_COMMAND, type TextFormatType } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { FontBoldIcon, FontItalicIcon, StrikethroughIcon, UnderlineIcon } from "@radix-ui/react-icons";
import * as Toolbar from "@radix-ui/react-toolbar";
import React from "react";
import { cn } from "@/lib/utils";

const supportedFormatTypes: Array<TextFormatType> = ["bold", "italic", "underline", "strikethrough"];

const getTitle = (format: TextFormatType) => {
  switch(format) {
    case "bold":
      return "Bold ( Ctrl + B )";
    case "italic":
      return "Italic ( Ctrl + I )";
    case "underline":
      return "Underline ( Ctrl + U )";
    case "strikethrough":
      return "Strikethrough ( Ctrl + S )";
  }
};

const getFormat = (format: TextFormatType) => {
  switch(format) {
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

const TextFormatsPlugin: React.FC<{ activeFormats: Array<TextFormatType> }> = ({
  activeFormats
}) => {
  const [editor] = useLexicalComposerContext();

  const onClick = React.useCallback((format: TextFormatType) => {
    editor.update(() => {
      const selection = $getSelection();
      const isInRange = $isRangeSelection(selection);
      if (isInRange) {
        selection.formatText(format);
        console.log(selection.format);
      }
    }, {
      discrete: true,
      tag: format
    });
  }, [editor]);

  return (
    <Toolbar.Root className="p-1 gap-1 flex flex-wrap border-b-[1px]">
      {supportedFormatTypes.map((format) => (
        <Toolbar.Button
          className={cn(
            "p-1 hover:bg-accent/10 opacity-50 rounded-sm",
            { "opacity-90 bg-accent/20": activeFormats.indexOf(format) !== -1 }
          )}
          key={format}
          onClick={() => onClick(format)}
          title={getTitle(format)}
          aria-label={getTitle(format)}
        >
          {getFormat(format)}
        </Toolbar.Button>
      ))}
    </Toolbar.Root>
  );
};

export default TextFormatsPlugin;