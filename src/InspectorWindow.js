import React from 'react';
import { connect } from 'react-redux';
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
  selectedComponent,
  isDerived,

  openAddComponentMenu,
  editSystem,
  updateSearchQuery,
  selectComponentToAdd,
  editCreator,
  toggleIsDerived,
  addComponent,
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
              selectedComponent={selectedComponent}
              isDerived={isDerived}

              openAddComponentMenu={openAddComponentMenu}
              updateSearchQuery={updateSearchQuery}
              selectComponentToAdd={selectComponentToAdd}
              toggleIsDerived={toggleIsDerived}
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

// In CSS vw units
const DIVIDER_WIDTH = 1;
const WINDOW_PADDING = 1.5;
// In CSS vh units
const DIVIDER_HEIGHT = 2;
const COMMAND_BAR_HEIGHT = 10;

const mapStateToProps = (state) => {
  return {
    left: DIVIDER_WIDTH + state.divider.hierarchyInspectorDividerLeft + 'vw',
    width: 100 - state.divider.canvasHierarchyDividerLeft - (2 * WINDOW_PADDING) + 'vw',
  };
};

const mapDispatchToProps = (dispatch) => {
  return {

  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InspectorWindow);
