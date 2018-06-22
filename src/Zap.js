import React from 'react';
import './Zap.css';
import * as THREE from 'three';

class Zap extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hierarchy: [],
      isPlaying: false,
      inspected: null,
    };
    this.previewCanvasRef = React.createRef();
  }

  render() {
    return (
      <div className="Zap">
        <div className="Zap-CommandBar">

        </div>

        <div className="Zap-PreviewWindow">
          <canvas ref={this.previewCanvasRef}></canvas>
        </div>

        <div className="Zap-PlayWindow">
        </div>

        <div className="Zap-InspectorWindow">
          <h2>Inspector</h2>
        </div>

        <div className="Zap-HierarchyWindow">
          <h2>Hierarchy</h2>
        </div>
      </div>
    );
  }

  componentDidMount() {
    
  }
}

export default Zap;
