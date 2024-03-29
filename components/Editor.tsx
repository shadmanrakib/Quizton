import dynamic from "next/dynamic";
import React, { useState, useRef, useEffect } from "react";
import "../node_modules/quill/dist/quill.snow.css";
import "../node_modules/quill/dist/quill.bubble.css";
import katex from "katex";
import "katex/dist/katex.min.css";
import ReactQuill from "react-quill/types";

const QuillEditor = dynamic(() => import("react-quill"), { ssr: false });

if (process.browser) {
  window.katex = katex;
}
const Editor = React.forwardRef((props: any, ref) => {
  const { onChange, editorValue, ...otherProps } = props;

  const onChangeHandler = (val: string) => {
    if (props.onChange) {
      props.onChange(val);
    }
  };
  return (
    <QuillEditor
      theme={props.theme}
      modules={{
        formula: true,
        toolbar: ["bold", "underline", "italic", "formula", "code"],
      }}
      value={editorValue || ""}
      onChange={(description, delta, source, editor) =>
        onChangeHandler(description)
      }
      ref={ref}
      {...otherProps}
    />
  );
});

export default Editor;
