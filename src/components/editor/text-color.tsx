import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import * as Toolbar from "@radix-ui/react-toolbar";
import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { $getSelection, $isRangeSelection, TextNode, } from "lexical";
import { cn } from "@/lib/utils";
import { Heading } from "../ui/heading";

export type HSL = [`${number}`, `${number}%`, `${number}%`, `${number}`];

type Props = {
  activeColor: string,
  setActiveColor: React.Dispatch<React.SetStateAction<string>>,
  activeBg: string,
  setActiveBg: React.Dispatch<React.SetStateAction<string>>
}

const ORANGE: HSL = ["29", "91%", "79%", "1"];
const BLUE: HSL = ["210", "57%", "78%", "1"];
const GREEN: HSL = ["120", "35%", "82%", "1"];
const PINK: HSL = ["335", "77%", "88%", "1"];
const PURPLE: HSL = ["263", "44%", "79%", "1"];
const BLACK: HSL = ["0", "0%", "0%", "1"];
const WHITE: HSL = ["0", "0%", "100%", "1"];

const constantColors: Array<HSL> = [ORANGE, BLUE, GREEN, PINK, PURPLE, BLACK, WHITE];

export const TextColorPlugin: React.FC<Props> = ({
  activeColor,
  setActiveColor,
  activeBg,
  setActiveBg
}) => {
  const [editor] = useLexicalComposerContext();

  const changeTextRef = React.useRef<HTMLDivElement>(null);
  const changeBgRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!changeBgRef.current) {
      return;
    }

    const el = changeBgRef.current;
    if (el.style.backgroundColor !== activeBg) {
      el.style.backgroundColor = activeBg.split(";")[0];
    }
  }, [activeBg]);

  React.useEffect(() => {
    if (!changeTextRef.current) {
      return;
    }

    const el = changeTextRef.current;
    if (el.style.backgroundColor !== activeColor) {
      el.style.backgroundColor = activeColor.split(";")[0];
    }
  }, [activeColor]);

  const changeColor = React.useCallback(
    (color: HSL) => {
      editor.update(() => {
        const selection = $getSelection();
        const isInRange = $isRangeSelection(selection);
        if (isInRange) {
          // selection.isBackward()
          // means that the user highlighted a text from the end
          // of a node backwards.

          // IF A SPECIFIC CHUNK OF TEXT IS HIGHLIGHTED,
          // THAT MEANS THE SELECTION IS NOT COLLAPSED,

          // IF SO, WE GET ALL NODES FOR THIS SELECTION
          // OR LINE (ParagraphNode) AND
          // FOR ALL SELECTED TEXT NODE, WE SET A STYLE TO IT.
          if (!selection.isCollapsed()) {
            selection.extract().forEach((node) => {
              if (node instanceof TextNode && node.isSelected(selection)) {
                const nodeStyle = node.getStyle();
                const prevBackground = nodeStyle.split("background-color: ")[1];
                node.setStyle(`color: hsla(${color[0]}, ${color[1]}, ${color[2]}, ${color[3]});${prevBackground ? ` background-color: ${prevBackground}` : ""}`);
              }
            });
          }
          const style = selection.style;
          const prevBackground = style.split("background-color: ")[1];
          selection.setStyle(`color: hsla(${color[0]}, ${color[1]}, ${color[2]}, ${color[3]});${prevBackground ? ` background-color: ${prevBackground}` : ""}`);
        }
      }, {
        onUpdate: () => {
          setActiveColor(`hsla(${color[0]}, ${color[1]}, ${color[2]}, ${color[3]})`);
        }
      });
    },
    [editor, setActiveColor],
  );

  const changeBg = React.useCallback(
    (color: HSL) => {
      editor.update(() => {
        const selection = $getSelection();
        const isInRange = $isRangeSelection(selection);
        if (isInRange) {
          if (!selection.isCollapsed()) {
            selection.extract().forEach((node) => {
              if (node instanceof TextNode && node.isSelected(selection)) {
                const nodeStyle = node.getStyle();
                const prevBackground = nodeStyle.split("background-color: ");
                const prevColor = prevBackground[0].split("color: ")[1];
                node.setStyle(`${prevColor ? `color: ${prevColor} ` : ""}background-color: hsla(${color[0]}, ${color[1]}, ${color[2]}, ${color[3]});`);
              }
            });
          }
          const style = selection.style;
          const prevBackground = style.split("background-color: ");
          const prevColor = prevBackground[0].split("color: ")[1];
          selection.setStyle(`${prevColor ? `color: ${prevColor} ` : ""}background-color: hsla(${color[0]}, ${color[1]}, ${color[2]}, ${color[3]});`);
        }
      }, {
        onUpdate: () => {
          setActiveBg(`hsla(${color[0]}, ${color[1]}, ${color[2]}, ${color[3]})`);
        }
      });
    },
    [editor, setActiveBg]
  );

  return (
    <Toolbar.Root>
      <Toolbar.ToggleGroup type="multiple" className="items-center flex">
        <Popover>
          <PopoverTrigger asChild>
            <Toolbar.Button title="Text Color" aria-label="Text Color" className="text-xs w-6 h-6 p-0 px-1 hover:text-inherit hover:bg-accent/10 rounded-sm">
              <span className="font-bold select-none">A</span>
              <div
                className="w-full h-[0.1rem]"
                ref={changeTextRef}
              />
            </Toolbar.Button>
          </PopoverTrigger>

          <PopoverContent
            className="bg-background/80 p-2 w-44"
            alignOffset={2}
            align="center"
          >
            <Heading typeOfHeading="h6">Color</Heading>

            <hr className="mt-0 bg-foreground w-full h-[0.1rem]" />
            <div className="mt-2 flex gap-1 flex-wrap">
              {constantColors.map((color) => (
                <Button
                  key={color.join()}
                  size="icon"
                  className={cn(
                    "rounded-sm w-4 h-4 outline-offset-2 hover:outline hover:outline-foreground hover:outline-2 focus-visible:outline focus-visible:outline-foreground focus-visible:outline-2",
                    { "scale-110": (`hsla(${color[0]}, ${color[1]}, ${color[2]}, ${color[3]});` === activeColor || `hsla(${color[0]}, ${color[1]}, ${color[2]}, ${color[3]})` === activeColor) }
                  )}
                  onClick={() => changeColor(color)}
                  style={{
                    backgroundColor: `hsla(${color[0]}, ${color[1]}, ${color[2]}, ${color[3]})`,
                  }}
                />
              ))}
            </div>
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger asChild>
            <Toolbar.Button title="Highlight Color" aria-label="Highlight Color" className="text-xs w-6 h-6 p-0 px-1 hover:text-inherit hover:bg-accent/10 rounded-sm">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
              </svg>
              <div
                className="w-full h-[0.1rem]"
                ref={changeBgRef}
              />
            </Toolbar.Button>
          </PopoverTrigger>
          <PopoverContent
            className="bg-background/80 p-2 w-44"
            alignOffset={2}
            align="center"
          >
            <Heading typeOfHeading="h6">Highlight Color</Heading>

            <hr className="mt-0 bg-foreground w-full h-[0.1rem]" />
            <div className="mt-2 flex gap-1 flex-wrap">
              {constantColors.map((color) => (
                <Button
                  key={color.join()}
                  size="icon"
                  className={cn(
                    "rounded-sm w-4 h-4 outline-offset-2 hover:outline hover:outline-foreground hover:outline-2 focus-visible:outline focus-visible:outline-border focus-visible:outline-[1px]",
                    { "scale-110": (`hsla(${color[0]}, ${color[1]}, ${color[2]}, ${color[3]});` === activeBg || `hsla(${color[0]}, ${color[1]}, ${color[2]}, ${color[3]})` === activeBg) }
                  )}
                  onClick={() => changeBg(color)}
                  style={{
                    backgroundColor: `hsla(${color[0]}, ${color[1]}, ${color[2]}, ${color[3]})`,
                  }}
                />
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </Toolbar.ToggleGroup>
    </Toolbar.Root>
  );
};