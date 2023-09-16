import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import * as Toolbar from "@radix-ui/react-toolbar";
import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { $createParagraphNode, $createTextNode, $getSelection, $isRangeSelection, TextNode, $createNodeSelection, $createRangeSelection, $setSelection } from "lexical";

export type HSL = [`${number}`, `${number}%`, `${number}%`, `${number}`];

type Props = {
  activeColor: string,
  setActiveColor: React.Dispatch<React.SetStateAction<string>>
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
  setActiveColor
}) => {
  const [editor] = useLexicalComposerContext();

  const changeTextRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!changeTextRef.current) {
      return;
    }

    const el = changeTextRef.current;

    if (el.style.backgroundColor !== activeColor) {
      el.style.backgroundColor = activeColor;
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
                node.setStyle(`color: hsla(${color[0]}, ${color[1]}, ${color[2]}, ${color[3]})`);
              }
            });
          }
          selection.setStyle(`color: hsla(${color[0]}, ${color[1]}, ${color[2]}, ${color[3]})`);
        }
      }, {
        onUpdate: () => {
          setActiveColor(`hsla(${color[0]}, ${color[1]}, ${color[2]}, ${color[3]})`);
        }
      });
    },
    [editor, setActiveColor],
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
            className="bg-background/50 p-2 w-44"
            alignOffset={2}
            align="center"
          >
            <div className="flex gap-1 flex-wrap">
              {constantColors.map((color) => (
                <Button
                  key={color.join()}
                  size="icon"
                  className="rounded-sm w-4 h-4 outline-offset-2 hover:outline hover:outline-border hover:outline-[1px] focus-visible:outline focus-visible:outline-border focus-visible:outline-[1px]"
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
            <Toolbar.Button className="text-xs w-6 h-6 p-0 px-1 hover:text-inherit hover:bg-accent/10 rounded-sm">
              <div
                className="w-full h-[0.1rem]"
              />
            </Toolbar.Button>
          </PopoverTrigger>
        </Popover>
      </Toolbar.ToggleGroup>
    </Toolbar.Root>
  );
};