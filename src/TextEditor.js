import React from 'react';
import AceEditor from 'react-ace';

import 'brace/mode/javascript';
import 'brace/theme/xcode';

class TextEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      code: '',
    };
  }

  render() {
    return (
      <div>
      <AceEditor
        mode="javascript"
        theme="xcode"
        value={this.state.code}
        onChange={(newCode) => this.onCodeChange(newCode)}
        name="ZapTextEditor-Ace"
        width="100vw"
        height="100vh"
        fontSize={16}
      />
      </div>
    );
  }

  componentDidMount() {
    window.addEventListener('message', (event) => {
      const message = event.data;
      if (message.type === 'SET_INITIAL_CODE') {
        this.setState({
          code: message.code,
        });
      }
    });
    window.opener.postMessage(
      {
        type: 'READY',
      },
      '*'
    );
  }

  onCodeChange(newCode) {
    window.opener.postMessage(
      {
        type: 'CODE_UPDATE',
        code: newCode,
      },
      '*'
    );
  }
}

export default TextEditor;
