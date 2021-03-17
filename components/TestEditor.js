import dynamic from "next/dynamic";
import Head from "next/head";
import React, { useState, useRef, useEffect } from "react";
import "../node_modules/quill/dist/quill.snow.css"
import katex from 'katex';
import 'katex/dist/katex.min.css';

const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import("react-quill");

    return ({ forwardedRef, ...props }) => <RQ ref={forwardedRef} {...props} />;
  },
  {
    ssr: false
  }
);

const Quill = dynamic(() => import("react-quill").then((mod) => mod.Quill),
  { ssr: false })

export default function App() {
  const [value, setValue] = useState("");
  const quillRef = useRef();

  useEffect(async () => {
    window.katex = katex;
  }, [quillRef]);

  return (
    <ReactQuill
      forwardedRef={quillRef}
      theme="snow"
      modules={{
        formula: true,
        toolbar: ["bold", "underline", 'italic', "formula", "code"]
      }}
      value={value}
      onChange={setValue}
    />
  );
}
