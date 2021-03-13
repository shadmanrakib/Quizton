import React from 'react';
import ReactQuill, { Quill } from 'react-quill';
import mathquill4quill from 'mathquill4quill';
import 'mathquill4quill/mathquill4quill.css';

const App = () => {
  const [browser, setBrowser] = useState(false);
  const reactQuill = useRef()

  useEffect(() => {
    setBrowser(true);
    const enableMathQuillFormulaAuthoring = mathquill4quill({ Quill });
    enableMathQuillFormulaAuthoring(this.reactQuill.current.editor);
  }, [])

  if (browser) {
    return (
      <ReactQuill
        ref={this.reactQuill}
        modules={{
          formula: true,
          toolbar: [["formula", /* ... other toolbar items here ... */]]
        }}
      />
    );
  } else {
    return <textarea></textarea>
  }
}

export default App;