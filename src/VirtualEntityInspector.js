import React from 'react';

const VirtualEntityInspector = ({
  virtualEntity,

  openAddComponentMenu,
}) => (
  <div className="Zap-EntityInspector">
    {
      Object.keys(virtualEntity).filter((componentName) => {
        const component = virtualEntity[componentName];
        return 'scene' !== componentName && component !== null;
      }).map((componentName) => {
        return (
          <div className="Zap-InspectorComponent">
            <h3>{componentName}</h3>
            {Object.keys(virtualEntity[componentName]).filter(n => n !== 'name').map((propertyName) => {
              const stringifiedValue = JSON.stringify(virtualEntity[componentName][propertyName], null, 4);
              return (
                <div className="Zap-InspectorComponentProperty">
                  <div>{propertyName}:</div>
                  <textarea value={stringifiedValue} className="Zap-InspectorComponentPropertyEditor" />
                </div>
              );
            })}
          </div>
        );
      })
    }
    <li
      className="Zap-AddButton"
      onClick={openAddComponentMenu}
    >
      Add component
    </li>
  </div>
);



export default VirtualEntityInspector;
