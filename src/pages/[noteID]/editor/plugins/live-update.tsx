import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import React from "react";

type Props = {
  incomingTitle: string,
  incomingDescription: string,
  incomingBody: string,
  currentTitle: string,
  currentDescription: string,
  currentBody: string,

  setTitle: React.Dispatch<React.SetStateAction<string>>,
  setDescription: React.Dispatch<React.SetStateAction<string>>,
  setBody: React.Dispatch<React.SetStateAction<string>>
}

export const LiveUpdatePlugin: React.FC<Props> = React.memo(
  ({
    incomingTitle,
    incomingDescription,
    incomingBody,

    currentTitle,
    currentDescription,
    currentBody,

    setTitle,
    setDescription,
    setBody
  }) => {
    const [editor] = useLexicalComposerContext();
    return null;
  }
);

LiveUpdatePlugin.displayName = "LiveUpdatePlugin";