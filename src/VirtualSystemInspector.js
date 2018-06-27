import React from 'react';

const VirtualSystemInspector = ({
  systemName,

  editSystem,
}) => (
  <div className="Zap-SystemInspector">
    <div className="Zap-SystemName">
      {systemName}
    </div>
    <div
      className="Zap-EditButton"
      onClick={() => editSystem(systemName)}
    >
      Edit system
    </div>
  </div>
);



export default VirtualSystemInspector;
