import React from 'react';
import './HierarchyWindow.css';

import Button from './Button';

const HierarchyWindow = ({
  left,
  width,
  entities,
  systems,
  inspected,

  toggleEntitySelection,
  toggleSystemSelection,
  addSystem,
  addEntity,
}) => (
  <div
    className="Zap-HierarchyWindow"
    style={{
      left,
      width,
    }}
  >
    <h2>Hierarchy</h2>
    <div className="Zap-HierarchyEntities">
      <h3>Entities</h3>
      <ul>
        {entities.map((entity) => {
          const nameComp = entity.InspectorName;
          const name = nameComp ? nameComp.inspectorName : 'Unnamed Entity';
          return (
            <li
              onClick={() => toggleEntitySelection(entity)}
              className={entity === inspected ? 'Zap-HierarchySelectedEntity' : ''}
            >
              {name}
            </li>
          );
        })}
        <li>
          <Button
            className="Zap-AddButton"
            onClick={addEntity}
          >
            Add entity
          </Button>
        </li>
      </ul>
    </div>

    <div className="Zap-HierarchySystems">
      <h3>Systems</h3>
      <ul >
        {systems.map((system) => {
          return (
            <li
              onClick={() => toggleSystemSelection(system)}
            >
              {system.name}
            </li>
          );
        })}
        <li>
          <Button
            className="Zap-AddButton"
            onClick={addSystem}
          >
            Add system
          </Button>
        </li>
      </ul>
    </div>
  </div>
);



export default HierarchyWindow;
