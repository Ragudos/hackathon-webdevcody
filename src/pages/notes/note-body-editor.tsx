import type { noteTheme } from "convex/schema";
import {
	$isRangeSelection,
	TextFormatType,
	type EditorState,
	TextNode,
	EditorThemeClasses,
} from "lexical";
import React from "react";

import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { HeadingNode } from "@lexical/rich-text";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { ListNode, ListItemNode } from "@lexical/list";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { cn } from "@/lib/utils";
import TextFormatsPlugin from "@/components/editor/text-formats";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import { CollaborationPlugin } from "@lexical/react/LexicalCollaborationPlugin";
import { TextColorPlugin } from "@/components/editor/text-color";

type Props = {
	noteBody: string;
	mode: "read" | "write";
	noteTheme?: typeof noteTheme.type
	setState?: (state: EditorState) => void;
	styles?: string;
	placeholderStyles?: string;
};

const theme = {
	text: {
		bold: "font-semibold",
		italic: "italic",
		underline: "underline",
		strikethrough: "line-through",
	},
} as EditorThemeClasses;

const onError = (error: Error) => {
	console.error(error);
};

// Order of formats:
// const supportedFormatTypes: Array<TextFormatType> = ["bold", "italic", "underline", "strikethrough"];

const LiveUpdatePlugin = ({
	noteBody,
}: {
	noteBody: string;
}): JSX.Element | null => {
	const [editor] = useLexicalComposerContext();

	React.useEffect(() => {
		if (noteBody !== JSON.stringify(editor._editorState)) {
			editor.update(
				() => {
					editor.setEditorState(editor.parseEditorState(noteBody), { tag: "Updated from other clients" });
				},
				{
					onUpdate: () => {
						editor.focus();
					},
					discrete: true
				},
			);
		}
	}, [editor, noteBody]);

	return null;
};

export const NoteBodyEditor: React.FC<Props> = ({
	noteBody,
	noteTheme,
	mode,
	setState,
	styles,
	placeholderStyles,
}) => {
	const initialConfig = {
		namespace: "MyEditor",
		theme,
		onError,
		editorState: noteBody,
		editable: mode === "write",
		nodes: [HeadingNode, ListNode, ListItemNode],
	};

	const [activeFormats, setActiveFormats] = React.useState<
		Array<TextFormatType>
	>([]);
	const [activeColor, setActiveColor] = React.useState<string>("hsla(0, 0%, 0%, 1)");
	const [activeBg, setActiveBg] = React.useState<string>(`hsl(var(--${noteTheme})`);

	const onChange = React.useCallback(
		(state: EditorState) => {
			if (setState) {
				setState(state);
			}

			const selection = state._selection;
			/** REFACTOR */
			if ($isRangeSelection(selection)) {
				state.read(() => {

					if (!selection.style) {
						setActiveColor("hsla(0, 0%, 0%, 1)");
						setActiveBg(`hsl(var(--${noteTheme}))`);
					}

					selection.getNodes().forEach((node) => {
						if (node instanceof TextNode) {
							const nodeStyle = node.getStyle();
							const prevBackground = nodeStyle.split("background-color: ");
              if (prevBackground[0]) {
								const prevColor = prevBackground[0].split("color: ")[1];
								setActiveColor(prevColor ?? "hsla(0, 0%, 0%, 1)");
							} else {
								setActiveColor("hsla(0, 0%, 0%, 1)");
							}
							setActiveBg(prevBackground[1] ?? `hsl(var(--${noteTheme})`);
						}
					});

					if (selection.format === 0) {
						setActiveFormats([]);
					}
	
					if (selection.format === 1) {
						setActiveFormats(["bold"]);
					}
	
					if (selection.format === 2) {
						setActiveFormats(["italic"]);
					}
	
					if (selection.format === 4) {
						setActiveFormats(["strikethrough"]);
					}
	
					if (selection.format === 8) {
						setActiveFormats(["underline"]);
					}
	
					if (selection.format === 3) {
						setActiveFormats(["bold", "italic"]);
					}
	
					if (selection.format === 5) {
						setActiveFormats(["bold", "strikethrough"]);
					}
	
					if (selection.format === 6) {
						setActiveFormats(["italic", "strikethrough"]);
					}
	
					if (selection.format === 9) {
						setActiveFormats(["bold", "underline"]);
					}
	
					if (selection.format === 10) {
						setActiveFormats(["italic", "underline"]);
					}
	
					if (selection.format === 7) {
						setActiveFormats(["bold", "italic", "strikethrough"]);
					}
	
					if (selection.format === 11) {
						setActiveFormats(["bold", "italic", "underline"]);
					}
	
					if (selection.format === 12) {
						setActiveFormats(["underline", "strikethrough"]);
					}
	
					if (selection.format === 15) {
						setActiveFormats(["bold", "italic", "underline", "strikethrough"]);
					}
				});
			}
		},
		[noteTheme, setState],
	);

	return (
		<React.Fragment>
			{mode === "write" ? (
				<LexicalComposer initialConfig={initialConfig}>
					<ListPlugin />
					<section className="border-b-[1px] p-1 flex gap-1">
						<h5 className="sr-only">Rich Text Toolbar</h5>
						<TextFormatsPlugin
							activeFormats={activeFormats}
						/>
						
						<TextColorPlugin
							setActiveColor={setActiveColor}
							activeColor={activeColor}
							activeBg={activeBg}
							setActiveBg={setActiveBg}
						/>
					</section>
					<LiveUpdatePlugin noteBody={noteBody} />
					<OnChangePlugin onChange={onChange} />
					<div className="relative">
						<RichTextPlugin
							contentEditable={
								<ContentEditable
									autoFocus
									className={cn(
										"relative z-10 min-h-[10rem] focus:outline-none focus:ring-0",
										styles,
									)}
									id="note-body"
								/>
							}
							placeholder={
								<div
									className={cn(
										"select-none z-0 opacity-60 absolute top-0 left-0",
										placeholderStyles,
									)}
								>
									Add a body to your note...
								</div>
							}
							ErrorBoundary={LexicalErrorBoundary}
						/>
					</div>

					<HistoryPlugin />
				</LexicalComposer>
			) : (
				<LexicalComposer initialConfig={initialConfig}>
					<ListPlugin />
					<LiveUpdatePlugin noteBody={noteBody} />
					<OnChangePlugin onChange={onChange} />
					<RichTextPlugin
						contentEditable={
							<ContentEditable
								className={cn(
									"relative z-10 min-h-[10rem] focus:outline-none focus:ring-0",
									styles,
								)}
								id="note-body"
							/>
						}
						placeholder={
							<div
								className={cn(
									"select-none z-0 opacity-60 absolute top-0 left-0",
									placeholderStyles,
								)}
							>
								Add a body to your note...
							</div>
						}
						ErrorBoundary={LexicalErrorBoundary}
					/>

					<HistoryPlugin />
				</LexicalComposer>
			)}
		</React.Fragment>
	);
};

NoteBodyEditor.displayName = "NoteBodyEditor";
