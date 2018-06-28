import React from 'react';

import Button from './Button';

const VirtualSystemInspector = ({
  systemName,

  editSystem,
}) => (
  <div className="Zap-SystemInspector">
    <div className="Zap-SystemName">
      {systemName}
    </div>
    <Button
      className="Zap-EditButton"
      onClick={() => editSystem(systemName)}
    >
      Edit system
    </Button>
  </div>
);



export default VirtualSystemInspector;
