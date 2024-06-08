import { $getRoot, $getSelection } from "lexical";
import React, { useEffect } from "react";

import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { TRANSFORMERS } from "@lexical/markdown";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { CodeNode } from "@lexical/code";
import { LinkNode } from "@lexical/link";
import { ListNode, ListItemNode } from "@lexical/list";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { HorizontalRuleNode } from "@lexical/react/LexicalHorizontalRuleNode";

const theme = {};

function onError(error: any) {
  // TODO: trigger popup
  console.error(error);
}

export interface LexicalEditorProps {
  editorState: string;
}

const EditorCapturePlugin = React.forwardRef((props: any, ref: any) => {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    ref.current = editor;
    return () => {
      ref.current = null;
    };
  }, [editor, ref]);

  return null;
});

const LexicalEditor = React.forwardRef((props, ref) => {
  const initialConfig = {
    namespace: "MyEditor",
    nodes: [
      HeadingNode,
      QuoteNode,
      HorizontalRuleNode,
      ListItemNode,
      ListNode,
      LinkNode,
      CodeNode,
    ],
    theme,
    onError,
  };

  return (
    <div className="border border-1">
      <LexicalComposer initialConfig={initialConfig}>
        <RichTextPlugin
          contentEditable={
            <ContentEditable className="lexical p-2 min-h-[25rem]" />
          }
          placeholder={<></>}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <EditorCapturePlugin ref={ref} />
        <HistoryPlugin />
        <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
        <AutoFocusPlugin />
      </LexicalComposer>
    </div>
  );
});

EditorCapturePlugin.displayName = "EditorCapturePlugin";
LexicalEditor.displayName = "LexicalEditor";
export default LexicalEditor;
