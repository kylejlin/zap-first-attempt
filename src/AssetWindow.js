import React from 'react';
import './AssetWindow.css';

import Button from './Button';

const AssetWindow = ({
  top,
  left,
  width,
  height,
}) => (
  <div
    className="Zap-AssetWindow"
    style={{
      top,
      left,
      width,
      height,
    }}
  >
    <h2>Assets</h2>
    <div className="Zap-Components">
      <h3>Components</h3>
      <ul>
        {/*TODO*/}
        <li>
          <Button
            className="Zap-AddButton"
          >
            Add component
          </Button>
        </li>
      </ul>
    </div>

    <div className="Zap-ComponentProviders">
      <h3>Component providers</h3>
      <ul >
        {/*TODO*/}
        <li>
          <Button
            className="Zap-AddButton"
          >
            Add provider
          </Button>
        </li>
      </ul>
    </div>
  </div>
);

export default AssetWindow;
