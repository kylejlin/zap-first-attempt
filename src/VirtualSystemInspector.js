import React from 'react';

const VirtualSystemInspector = ({
  systemName,

  editSystem,
}) => (
  <div className="Zap-SystemInspector">
    <div className="Zap-SystemName">
      {systemName}
    </div>
    <button
      className="Zap-Button Zap-EditButton"
      onClick={() => editSystem(systemName)}
    >
      Edit system
    </button>
  </div>
);



export default VirtualSystemInspector;
