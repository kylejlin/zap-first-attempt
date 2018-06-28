import React from 'react';
import './ComponentCreatorInspector.css';

import Button from './Button';

const ComponentCreatorInspector = ({
  creatorName,

  editCreator,
}) => (
  <div className="Zap-ComponentCreatorInspector">
    <div className="Zap-ComponentCreatorName">
      {creatorName}
    </div>
    <Button
      className="Zap-EditButton"
      onClick={() => editCreator(creatorName)}
    >
      Edit component creator
    </Button>
  </div>
);



export default ComponentCreatorInspector;
