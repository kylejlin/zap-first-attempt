import React from 'react';

import VirtualEntityInspector from './VirtualEntityInspector';
import VirtualSystemInspector from './VirtualSystemInspector';

const InspectorWindow = ({
  left,
  width,
  inspected,

  openAddComponentMenu,
  editSystem,
}) => (
  <div
    className="Zap-InspectorWindow"
    style={{
      left,
      width,
    }}
  >
    <h2>Inspector</h2>
    {(() => {
      if (inspected === null) {
        return null;
      }
      if (inspected.isEntity) {
        if (inspected.isVirtual) {
          return (
            <VirtualEntityInspector
              virtualEntity={inspected}
              openAddComponentMenu={openAddComponentMenu}
            />
          );
        }
        return null; // TODO EntityInspector
      }
      if (inspected.isSystem) {
        if (inspected.isVirtual) {
          return (
            <VirtualSystemInspector
              systemName={inspected.name}
              editSystem={editSystem}
            />
          );
        }
        return null; // TODO SystemInspector
      }
    })()}
  </div>
);



export default InspectorWindow;
