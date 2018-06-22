import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Zap from './Zap';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<Zap />, document.getElementById('root'));
registerServiceWorker();
