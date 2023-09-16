import { $isRangeSelection, TextFormatType, type EditorState } from "lexical";
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

type Props = {
	noteBody: string | undefined;
	mode: "read" | "write";
	setState?: (state: EditorState) => void;
	styles?: string;
	placeholderStyles?: string;
};

const theme = {
	text: {
		bold: "font-semibold",
		italic: "italic",
		underline: "underline",
		strikethrough: "line-through"
	}
};

const onError = (error: Error) => {
	console.error(error);
};

export const NoteBodyEditor: React.FC<Props> = React.memo(
	({ noteBody, mode, setState, styles, placeholderStyles }) => {
		const initialConfig = {
			namespace: "MyEditor",
			theme,
			onError,
			editorState: noteBody,
			editable: mode === "write",
			nodes: [HeadingNode, ListNode, ListItemNode],
		};

		const [activeFormats, setActiveFormats] = React.useState<Array<TextFormatType>>([]);

		const onChange = React.useCallback(
			(state: EditorState) => {
				if (setState) {
					setState(state);
				}
				const selection = state._selection;
				/** REFACTOR */
				if ($isRangeSelection(selection)) {
					if (selection.format === 0) {
						setActiveFormats([]);
					}

					if (selection.format === 1) {
						setActiveFormats(["bold"]);
					}

					if (selection.format === 2) {
						setActiveFormats(["italic"]);
					}

					if (selection.format === 3) {
						setActiveFormats(["bold", "italic"]);
					}

					if (selection.format === 4) {
						setActiveFormats(["strikethrough"]);
					}

					if (selection.format === 5) {
						setActiveFormats(["bold", "strikethrough"]);
					}

					if (selection.format === 6) {
						setActiveFormats(["italic", "strikethrough"]);
					}

					if (selection.format === 7) {
						setActiveFormats(["bold", "italic", "strikethrough"]);
					}

					if (selection.format === 8) {
						setActiveFormats(["underline"]);
					}

					if (selection.format === 9) {
						setActiveFormats(["bold", "underline"]);
					}

					if (selection.format === 10) {
						setActiveFormats(["italic", "underline"]);
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
				}
			},
			[setState],
		);

		return (
			<React.Fragment>
				{mode === "write" ? (
					<LexicalComposer initialConfig={initialConfig}>
						<ListPlugin />
						<TextFormatsPlugin
							activeFormats={activeFormats}
						/>
						<OnChangePlugin onChange={onChange} />
						<div className="relative">
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
						</div>

						<HistoryPlugin />
					</LexicalComposer>
				) : (
					<LexicalComposer initialConfig={initialConfig}>
						<ListPlugin />

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
	},
);

NoteBodyEditor.displayName = "NoteBodyEditor";
