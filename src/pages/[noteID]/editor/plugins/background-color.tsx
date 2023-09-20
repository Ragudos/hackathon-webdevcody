import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import * as Toolbar from "@radix-ui/react-toolbar";
import { Input } from "@/components/ui/input";
import { Heading } from "@/components/ui/heading";
import { rgbToHex } from "@/lib/utils";
import { RGB, colors } from "@/consts";
import { Button } from "@/components/ui/button";
import { $getSelection, $isRangeSelection, TextNode } from "lexical";
import { ColorWheelIcon } from "@radix-ui/react-icons";

type Props = {
  activeBgColor: RGB | undefined,
  setActiveBgColor: React.Dispatch<React.SetStateAction<RGB | undefined>>
}

export const BackgroundColorPlugin: React.FC<Props> = React.memo(
  ({ activeBgColor, setActiveBgColor }) => {
    const [editor] = useLexicalComposerContext();
    const [chosenColorInHex, setChosenColorInHex] = React.useState(rgbToHex(activeBgColor));

    const changeBgRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
      if (!changeBgRef.current) {
        return;
      }

      const el = changeBgRef.current;
      const currColor = (activeBgColor ? `rgb(${activeBgColor[0]}, ${activeBgColor[1]}, ${activeBgColor[2]})` : "rgb(0, 0, 0)");
      if (el.style.backgroundColor !== currColor) {
        el.style.backgroundColor = currColor;
      }
    }, [activeBgColor]);

    const changeColor = React.useCallback(
      (color: RGB) => {
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
                  node.setStyle(`${prevColor ? `color: ${prevColor} ` : ""}background-color: rgb(${color[0]}, ${color[1]}, ${color[2]});`);
                }
              });
            }
            const style = selection.style;
            const prevBackground = style.split("background-color: ");
            const prevColor = prevBackground[0].split("color: ")[1];
            selection.setStyle(`${prevColor ? `color: ${prevColor} ` : ""}background-color: rgb(${color[0]}, ${color[1]}, ${color[2]});`);
          }
        }, {
          onUpdate: () => {
            setActiveBgColor(color);
            setChosenColorInHex(rgbToHex(color));
          },
          discrete: true,
          skipTransforms: true
        });
      },
      [editor, setActiveBgColor, setChosenColorInHex]
    );

    return (
      <Toolbar.Root>
        <Toolbar.ToggleGroup type="single" className="items-center flex gap-1">
          <Popover>
            <PopoverTrigger asChild>
              <Toolbar.Button
                title="Background Color"
                aria-label="Background Color"
                className="text-xs w-6 h-6 p-0 px-1 hover:text-inherit hover:bg-accent/10 rounded-sm"
              >
                <ColorWheelIcon className="w-4 h-4" />
                <div
                  className="w-full h-[0.1rem]"
                  ref={changeBgRef}
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
                <Heading typeOfHeading="h5">Background Color</Heading>

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
                      key={c + "bg" + idx}
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

BackgroundColorPlugin.displayName = "BackgroundColorPlugin";