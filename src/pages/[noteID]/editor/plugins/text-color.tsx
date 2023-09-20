import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RGB, colors } from "@/consts";
import { rgbToHex } from "@/lib/utils";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import * as Toolbar from "@radix-ui/react-toolbar";
import { $getSelection, $isRangeSelection, TextNode } from "lexical";
import React from "react";

type Props = {
  activeTextColor: RGB | undefined,
  setActiveTextColor: React.Dispatch<React.SetStateAction<RGB | undefined>>
}

export const TextColorPlugin: React.FC<Props> = React.memo(
  ({ activeTextColor, setActiveTextColor }) => {
    const [editor] = useLexicalComposerContext();
    const [chosenColorInHex, setChosenColorInHex] = React.useState<string>(rgbToHex(activeTextColor ?? [0, 0, 0]));
    const changeTextRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
      if (!changeTextRef.current) {
        return;
      }

      const el = changeTextRef.current;
      const currColor =  (activeTextColor ? `rgb(${activeTextColor[0]}, ${activeTextColor[1]}, ${activeTextColor[2]})` : "rgb(0, 0, 0)");
      if (el.style.backgroundColor !== currColor) {
        el.style.backgroundColor = currColor;
      }
    }, [activeTextColor]);

    const changeColor = React.useCallback(
      (color: RGB) => {
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
                  node.setStyle(`color: rgb(${color[0]}, ${color[1]}, ${color[2]});${prevBackground ? ` background-color: ${prevBackground}` : ""}`);
                }
              });
            }
            const style = selection.style;
            const prevBackground = style.split("background-color: ")[1];
            selection.setStyle(`color: rgb(${color[0]}, ${color[1]}, ${color[2]});${prevBackground ? ` background-color: ${prevBackground}` : ""}`);
          }
        }, {
          onUpdate: () => {
            setActiveTextColor(color);
            setChosenColorInHex(rgbToHex(color));
          },
          discrete: true,
          skipTransforms: true
        });
      },
      [editor, setActiveTextColor, setChosenColorInHex]
    );

    return (
      <Toolbar.Root>
        <Toolbar.ToggleGroup type="single" className="items-center flex gap-1">
          <Popover>
            <PopoverTrigger asChild>
              <Toolbar.Button
                title="Text Color"
                aria-label="Text Color"
                className="text-xs w-6 h-6 p-0 px-1 hover:text-inherit hover:bg-accent/10 rounded-sm"
              >
                <span className="font-bold select-none text-xs">A</span>
                <div
                  className="w-full h-[0.1rem]"
                  ref={changeTextRef}
                />
              </Toolbar.Button>
            </PopoverTrigger>

            <PopoverContent
              className="animate-slidedown"
              alignOffset={5}
              align="center"
              asChild
            >
              <div className="flex flex-col gap-4 p-4 rounded-lg shadow-md shadow-black/20">
                <Heading typeOfHeading="h5">Text Color</Heading>

                <div className="flex flex-col gap-2">
                  <label htmlFor="copy-hex-code" className="text-base">Hex Code</label>
                  <Input
                    id="copy-hex-code"
                    readOnly
                    value={chosenColorInHex}
                    type="text"
                  />
                </div>

                <section className="flex flex-wrap gap-2">
                  <h6 className="sr-only">Hardcoded Colors</h6>

                  {colors.map((c, idx) => (
                    <Button
                      size="icon"
                      key={c + "text" + idx}
                      className="hover:bg-transparent focus-visible:outline focus-visible:outline-2  focus-visible:outline-foreground focus-visible:ring-background hover:outline hover:outline-2 hover:outline-offset-2 hover:outline-foreground hover:ring-background focus-visible:outline-offset-2 rounded-sm w-4 h-4"
                      style={{
                        backgroundColor: `rgb(${c[0]}, ${c[1]}, ${c[2]})`
                      }}
                      title={`rgb(${c[0]}, ${c[1]}, ${c[2]})`}
                      aria-label={`rgb(${c[0]}, ${c[1]}, ${c[2]})`}
                      onClick={() => {
                        changeColor(c);
                      }}
                    />
                  ))}
                </section>
              </div>
            </PopoverContent>
          </Popover>
        </Toolbar.ToggleGroup>
      </Toolbar.Root>
    );
  }
);

TextColorPlugin.displayName = "TextColorPlugin";