import React from 'react';
import AceEditor from 'react-ace';
import 'brace/mode/markdown';
import 'brace/theme/github';
import 'brace/ext/language_tools';

export default class App extends React.Component {
  render() {
    const aceOptions = { };
    return (
      <div>
        <h2>Welcome to React 2!</h2>
        <AceEditor mode="markdown" theme="github" name="editor" fontSize={12} width="100%" setOptions={aceOptions} />
      </div>
    );
  }
}
