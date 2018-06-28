import React from 'react';
import './AssetWindow.css';

import Button from './Button';

const AssetWindow = ({
  top,
  left,
  width,
  height,
  componentCreatorNames,
  componentProviderNames,

  addComponentCreator,
  addComponentProvider,
  inspectComponentCreator,
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
      <h3>Component creators</h3>
      <ul>
        {componentCreatorNames.map((creatorName) => (
          <li onClick={() => inspectComponentCreator(creatorName)}>{creatorName}</li>
        ))}
        <li>
          <Button
            className="Zap-AddButton"
            onClick={addComponentCreator}
          >
            Add creator
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
            onClick={addComponentProvider}
          >
            Add provider
          </Button>
        </li>
      </ul>
    </div>
  </div>
);

export default AssetWindow;
