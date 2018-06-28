import React from 'react';

import sortBySimilarityToQuery from './sortBySimilarityToQuery';

const VirtualEntityInspector = ({
  virtualEntity,
  isAddComponentMenuOpen,
  searchQuery,
  componentCreators,

  openAddComponentMenu,
  updateSearchQuery,
  addComponent,
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
    {isAddComponentMenuOpen
      ? (
        <div className="Zap-AddComponentMenu">
          <input
            type="text"
            className="Zap-SearchInput"
            placeholder="Search"
            autoFocus={true}
            value={searchQuery}
            onChange={(e) => updateSearchQuery(e.target.value)}
          />
          <ul>
            {sortBySimilarityToQuery(searchQuery, Object.values(componentCreators).map(c => c.name)).map((componentName) => (
              <li onClick={() => addComponent(componentCreators[componentName]())}>{componentName}</li>
            ))}
          </ul>
        </div>
      )
      : (
        <button
          className="Zap-Button Zap-AddButton"
          onClick={openAddComponentMenu}
        >
          Add component
        </button>
      )
    }
  </div>
);

export default VirtualEntityInspector;
