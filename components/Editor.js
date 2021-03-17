import React, { useState, useRef, useEffect } from "react";
import 'katex/dist/katex.min.css';
import { addStyles } from 'react-mathquill'
addStyles()

import "../node_modules/quill/dist/quill.snow.css"

const ReactQuill = dynamic(
    async () => {
        const { default: RQ } = await import("react-quill");

        return ({ forwardedRef, ...props }) => <RQ ref={forwardedRef} {...props} />;
    },
    {
        ssr: false
    }
);

const { Quill } = dynamic(() => import("react-quill"),
    { ssr: false })

import 'mathquill4quill/mathquill4quill.css';

const Editor = () => {
    const [value, setValue] = useState("");
    const quillRef = useRef();

    useEffect(() => {
        console.log(Quill);
        import("./mathquill/mathquill.js").catch(() => console.log("Error loading mathquill"))
        import("mathquill4quill")
        import("katex")

        window.katex = katex;
        window.Quill = Quill;
        import("mathquill4quill").catch(() => console.log("Error loading mq"))

        const init = (quill) => {
            console.log(quill);
            const enableMathQuillFormulaAuthoring = window.mathquill4quill({ Quill });
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
                <link rel="stylesheet" href></link>
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

export default Editor;