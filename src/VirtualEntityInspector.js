import React from 'react';

import sortBySimilarityToQuery from './sortBySimilarityToQuery';

import Button from './Button';

const VirtualEntityInspector = ({
  virtualEntity,
  isAddComponentMenuOpen,
  searchQuery,
  componentCreators,
  existingComponentNames,

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
              <li
                onClick={() => addComponent(componentCreators[componentName]())}
                className={existingComponentNames.includes(componentName) ? 'Zap-UnaddableComponent' : ''}
              >
                {componentName}
              </li>
            ))}
          </ul>
        </div>
      )
      : (
        <Button
          className="Zap-AddButton"
          onClick={openAddComponentMenu}
        >
          Add component
        </Button>
      )
    }
  </div>
);

export default VirtualEntityInspector;
