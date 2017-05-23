import React from 'react'
import AceEditor from 'react-ace'
import CodeEditor from './CodeEditor'
import Docs from './Docs'
import TipsTricks from './TipsTricks'
import 'brace/mode/javascript';
import 'brace/theme/monokai';

const EditorDocs = (props) => {
  return (
      <div>
        <div className="col-md-6">
          <CodeEditor />
        </div>
        <div className="col-md-6">
          <TipsTricks />
        </div>
      </div>
  )
}

export default EditorDocs
