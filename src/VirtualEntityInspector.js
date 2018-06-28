import React from 'react';

import sortBySimilarityToQuery from './sortBySimilarityToQuery';

import Button from './Button';

const VirtualEntityInspector = ({
  virtualEntity,
  isAddComponentMenuOpen,
  searchQuery,
  componentCreators,
  existingComponentNames,
  selectedComponent,
  isDerived,

  openAddComponentMenu,
  updateSearchQuery,
  selectComponentToAdd,
  toggleIsDerived,
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
      ? (selectedComponent === null
        ? (
          <div className="Zap-AddComponentMenu">
            <input
              type="text"
              className="Zap-AddComponentMenuHead"
              placeholder="Search"
              autoFocus={true}
              value={searchQuery}
              onChange={(e) => updateSearchQuery(e.target.value)}
            />
            <div className="Zap-AddComponentMenuMain">
              <ul>
                {sortBySimilarityToQuery(searchQuery, Object.values(componentCreators).map(c => c.name)).map((componentName) => (
                  <li
                    onClick={() => {
                      if (!existingComponentNames.includes(componentName)) {
                        selectComponentToAdd(componentCreators[componentName]());
                      }
                    }}
                    className={existingComponentNames.includes(componentName) ? 'Zap-UnaddableComponent' : ''}
                  >
                    {componentName}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )
        : (
          <div className="Zap-AddComponentMenu">
            <div className="Zap-AddComponentMenuHead">
              {selectedComponent.name}
            </div>
            <div className="Zap-AddComponentMenuMain">
              <label className="Zap-IsDerived">
                <input
                  type="checkbox"
                  checked={isDerived}
                  onChange={(e) => toggleIsDerived(e.target.checked)}
                />
                Derive
              </label>
              {isDerived
                ? null
                : (
                  <ul>
                    {Object.keys(selectedComponent).map((propertyName) => (
                      <li>
                        <label>
                          {propertyName}:
                          <textarea
                            value={JSON.stringify(selectedComponent[propertyName], null, 4)}
                          />
                        </label>
                      </li>
                    ))}
                  </ul>
                )
              }
              <Button
                className="Zap-AddButton"
                onClick={addComponent}
              >
                Add
              </Button>
            </div>
          </div>
        )
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
