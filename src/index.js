import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Zap from './Zap';
import TextEditor from './TextEditor';
import registerServiceWorker from './registerServiceWorker';



if (window.location.hash === '#editor') {
  ReactDOM.render(<TextEditor />, document.getElementById('root'));
} else {
  ReactDOM.render(<Zap />, document.getElementById('root'));
}
registerServiceWorker();
