import dynamic from "next/dynamic";
import Head from "next/head";
import React, { useState, useRef, useEffect } from "react";
import  "../node_modules/quill/dist/quill.snow.css"
import 'mathquill4quill/mathquill4quill.css';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { addStyles } from 'react-mathquill'

addStyles()

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
{ ssr: false})

//const MathQuill = dynamic(() => import("mathquill/build/mathquill"),{ ssr: false})

const mathquill4quill = dynamic(() => import("mathquill4quill"),{ ssr: false})

export default function App() {
  const [value, setValue] = useState("");
  const quillRef = useRef();

  useEffect(() => {
    console.log(Quill);
    import("./mathquill/mathquill.js").catch(() => console.log("Error loading mathquill"))
    window.katex = katex;
    window.Quill = Quill;
    import("mathquill4quill").catch(() => console.log("Error loading mq"))

    const init = (quill) => {
      console.log(quill);
      const enableMathQuillFormulaAuthoring = window.mathquill4quill({Quill});
      enableMathQuillFormulaAuthoring(quillRef.current.editor, {});
    };
    const check = () => {
      if (quillRef.current) {
        init(quillRef.current);
        return;
      }
      setTimeout(check, 200);
    };
    check();
  }, [quillRef]);

  return (
    <>
    <Head>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>
    </Head>
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
    </>
  );
}
