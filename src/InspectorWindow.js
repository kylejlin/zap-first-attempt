import React from 'react';
import './InspectorWindow.css';

import VirtualEntityInspector from './VirtualEntityInspector';
import VirtualSystemInspector from './VirtualSystemInspector';
import ComponentCreatorInspector from './ComponentCreatorInspector';

const InspectorWindow = ({
  left,
  width,
  inspected,
  isAddComponentMenuOpen,
  searchQuery,
  componentCreators,
  existingComponentNames,

  openAddComponentMenu,
  editSystem,
  updateSearchQuery,
  addComponent,
  editCreator,
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
              isAddComponentMenuOpen={isAddComponentMenuOpen}
              searchQuery={searchQuery}
              componentCreators={componentCreators}
              existingComponentNames={existingComponentNames}

              openAddComponentMenu={openAddComponentMenu}
              updateSearchQuery={updateSearchQuery}
              addComponent={addComponent}
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
      if (inspected.isComponentCreatorSource) {
        return (
          <ComponentCreatorInspector
            creatorName={inspected.name}
            editCreator={editCreator}
          />
        );
      }
    })()}
  </div>
);



export default InspectorWindow;
