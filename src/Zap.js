import React from 'react';
import './Zap.css';
import * as THREE from 'three';
import * as components from './components';

import Entity from './ecs/Entity';
import Scene from './ecs/Scene';
import System from './ecs/System';
import IndexSpec from './ecs/IndexSpec';

window.t = THREE;
window.c = components;
window.ecs = {
  Entity,
  Scene,
  System,
  IndexSpec,
};

// In CSS vw units
const DIVIDER_WIDTH = 1;
const WINDOW_PADDING = 1.5;

class Zap extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      initScene: this.getInitScene(),
      currentScene: this.getInitScene(),
      isPlaying: false,
      inspected: null,

      canvasHierarchyDividerLeft: 50,
      hierarchyInspectorDividerLeft: 75,
      isCanvasHierarchyDividerBeingDragged: false,
      isHierarchyInspectorDividerBeingDragged: false,
    };
    this.previewCanvasRef = React.createRef();
    this.playCanvasRef = React.createRef();
  }

  render() {
    return (
      <div
        className="Zap"
        onMouseMove={(e) => {
        const leftVw = 100 * e.clientX / window.innerWidth;
        if (this.state.isCanvasHierarchyDividerBeingDragged) {
          e.preventDefault();
          this.setState({
            canvasHierarchyDividerLeft: Math.min(leftVw, this.state.hierarchyInspectorDividerLeft),
          }, () => {
            this.resizeCanvases();
          });
        }
        if (this.state.isHierarchyInspectorDividerBeingDragged) {
          e.preventDefault();
          this.setState({
            hierarchyInspectorDividerLeft: Math.max(leftVw, this.state.canvasHierarchyDividerLeft),
          });
        }
      }}
    >
        <div
          className="Zap-CommandBar"
          style={{
            width: this.state.canvasHierarchyDividerLeft + 'vw'
          }}
        >
          <button className="Zap-CommandButton">
            <div className="Zap-IconPlay" />
          </button>
          <button className="Zap-CommandButton">
            <div className="Zap-IconPause" />
          </button>
        </div>

        <div
          className="Zap-PreviewWindow"
          style={{
            width: this.state.canvasHierarchyDividerLeft + 'vw'
          }}
        >
          <canvas ref={this.previewCanvasRef}></canvas>
        </div>

        <div className="Zap-PreviewPlay-Divider" />

        <div
          className="Zap-PlayWindow"
          style={{
            width: this.state.canvasHierarchyDividerLeft + 'vw'
          }}
        >
          <canvas ref={this.playCanvasRef}></canvas>
        </div>

        <div
          className="Zap-CanvasHierarchy-Divider"
          style={{
            left: this.state.canvasHierarchyDividerLeft + 'vw',
          }}
          onMouseDown={() => this.setState({ isCanvasHierarchyDividerBeingDragged: true })}
          onMouseUp={() => this.setState({ isCanvasHierarchyDividerBeingDragged: false })}
        />

        <div
          className="Zap-HierarchyWindow"
          style={{
            left: DIVIDER_WIDTH + this.state.canvasHierarchyDividerLeft + 'vw',
            width: this.state.hierarchyInspectorDividerLeft - this.state.canvasHierarchyDividerLeft - (2 * WINDOW_PADDING) + 'vw',
          }}
        >
          <h2>Hierarchy</h2>
          <div className="Zap-HierarchyEntities">
            <h3>Entities</h3>
            <ul>
              {(this.state.isPlaying ? this.state.currentScene : this.state.initScene).entities.map((entity) => {
                const nameComp = entity.getComponent(components.Name);
                const name = nameComp ? nameComp.name : 'Unnamed Entity';
                return (
                  <li onClick={() => this.setState({ inspected: entity })}>{name}</li>
                );
              })}
            </ul>
          </div>

          <div className="Zap-HierarchySystems">
            <h3>Systems</h3>
            <ul >
              {(this.state.isPlaying ? this.state.currentScene : this.state.initScene).systems.map((system) => {
                return (
                  <li>{system.name}</li>
                );
              })}
            </ul>
          </div>
        </div>

        <div
          className="Zap-HierarchyInspector-Divider"
          style={{
            left: this.state.hierarchyInspectorDividerLeft + 'vw',
          }}
          onMouseDown={() => this.setState({ isHierarchyInspectorDividerBeingDragged: true })}
          onMouseUp={() => this.setState({ isHierarchyInspectorDividerBeingDragged: false })}
        />

        <div
          className="Zap-InspectorWindow"
          style={{
            left: DIVIDER_WIDTH + this.state.hierarchyInspectorDividerLeft + 'vw',
            width: 100 - this.state.canvasHierarchyDividerLeft - (2 * WINDOW_PADDING) + 'vw'
          }}
        >
          <h2>Inspector</h2>
          {this.state.inspected instanceof Entity
            ? Object.keys(this.state.inspected).filter((componentName) => {
              const component = this.state.inspected[componentName];
              return 'scene' !== componentName && component !== null;
            }).map((componentName) => {
              return (
                <div className="Zap-InspectorComponent">
                  <h3>{componentName}</h3>
                  {Object.keys(this.state.inspected[componentName]).map((propertyName) => {
                    const stringifiedValue = JSON.stringify(this.state.inspected[componentName][propertyName], null, 4);
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
            : null
          }
        </div>
      </div>
    );
  }

  componentDidMount() {
    const threeScene = new THREE.Scene();
    const threeRenderer = new THREE.WebGLRenderer({
      canvas: this.previewCanvasRef.current,
    });
    const { width, height } = this.getCanvasDimensions();
    threeRenderer.setSize(width, height);

    this.setState({
      threeScene,
      threeRenderer,
    }, () => {
      this.setUpRenderSystem();
    });
  }

  setUpEcs() {
    // const scene = this.state.scene;
    // const cameraEnt = new Entity();
    // const cameraComp = new components.CameraEnum(
    //   components.CameraEnum.Which.Perspective,
    //   { fov: 75, aspect: this.state.aspect, near: 0.1, far: 1000.0 }
    // );
    // cameraEnt.addComponent(cameraComp);
    // scene.addEntity(cameraEnt);
    // this.setUpRenderSystem();
  }

  setUpRenderSystem() {
    const { threeScene, threeRenderer } = this.state;

    const render = new System(
      'Render',
      ({ dt }, scene, [cameraIndex, thingIndex]) => {
        threeScene.children = [];
        const [camera] = cameraIndex.entities;
        const { fov, aspectRatio, near, far } = camera.getComponent(components.CameraEnum).value;
        //console.log('cam',fov);
        const threeCamera = new THREE.PerspectiveCamera(fov, aspectRatio, near, far);
        threeCamera.position.set(0, 0, 5);

        for (const thingEnt of thingIndex.entities) {
          const geoComp = thingEnt.getComponent(components.Geometry);
          const matComp = thingEnt.getComponent(components.MaterialEnum);
          const threeGeo = new THREE.Geometry();
          threeGeo.vertices = geoComp.vertices;
          threeGeo.faces = geoComp.faces;
          // TODO get actual material (+ standard)
          const threeMat = new THREE.MeshBasicMaterial({ color: matComp.value.color });
          const threeMesh = new THREE.Mesh(threeGeo, threeMat);
          threeScene.add(threeMesh);
        }

        threeRenderer.render(threeScene, threeCamera);
      },
      [
        new IndexSpec([
          components.CameraEnum,
        ]),
        new IndexSpec([
          components.Geometry,
          components.MaterialEnum,
        ])
      ]
    );
    this.state.initScene.addSystem(render);
    this.setState({
      render,
    }, () => {
      this.startLoop();
    });
  }

  startLoop() {
    let then = performance.now();
    const render = () => {
      requestAnimationFrame(render);
      const now = performance.now();
      const dt = now - then;
      then = now;
      this.state.initScene.update({ dt });
    };
    render();
    this.forceUpdate();
  }

  getInitScene() {
    const scene = new Scene();

    const cameraEnt = new Entity();
    const cameraCameraComp = new components.CameraEnum(
      components.CameraEnum.Which.Perspective,
      { fov: 75, aspectRatio: this.getCanvasDimensions().aspectRatio, near: 0.1, far: 1000.0 }
    );
    const cameraNameComp = new components.Name('Perspective Camera');
    cameraEnt.addComponent(cameraCameraComp);
    cameraEnt.addComponent(cameraNameComp);
    scene.addEntity(cameraEnt);

    const cubeEnt = new Entity();
    const threeGeo = new THREE.BoxGeometry(3, 3, 3);
    const cubeGeoComp = new components.Geometry(
      threeGeo.vertices,
      threeGeo.faces
    );
    const cubeMatComp = new components.MaterialEnum(
      components.MaterialEnum.Which.StandardColor,
      { color: 0xffa500 }
    );
    const cubeNameComp = new components.Name('Orange Cube');
    cubeEnt.addComponent(cubeGeoComp);
    cubeEnt.addComponent(cubeMatComp);
    cubeEnt.addComponent(cubeNameComp);
    scene.addEntity(cubeEnt);

    return scene;
  }

  getCanvasDimensions() {
    const [width, height] = this.state
      ? [
        (this.state.canvasHierarchyDividerLeft / 100) * window.innerWidth,
        0.45 * window.innerHeight,
      ]
      : [
        0.50 * window.innerWidth,
        0.45 * window.innerHeight
      ];
    return {
      width,
      height,
      aspectRatio: width / height,
    };
  }

  resizeCanvases() {
    const { threeRenderer } = this.state;
    const { width, height, aspectRatio } = this.getCanvasDimensions();
    const canvas = this.previewCanvasRef.current;
    canvas.width = width;
    canvas.height = height;
    threeRenderer.setSize(width, height);
    const cameraComps = this.state.initScene.entities.map(ent => ent.getComponent(components.CameraEnum)).filter(ent => ent !== undefined && ent !== null);
    cameraComps.forEach((cameraComp) => {
      cameraComp.value.aspectRatio = aspectRatio;
    });
  }
}

export default Zap;
