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

class Zap extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      initScene: this.getInitScene(),
      currentScene: this.getInitScene(),
      isPlaying: false,
      inspected: null,
    };
    this.previewCanvasRef = React.createRef();
    this.playCanvasRef = React.createRef();
  }

  render() {
    return (
      <div className="Zap">
        <div className="Zap-CommandBar">
          <button className="Zap-CommandButton">
            <div className="Zap-IconPlay" />
          </button>
          <button className="Zap-CommandButton">
            <div className="Zap-IconPause" />
          </button>
        </div>

        <div className="Zap-PreviewWindow">
          <canvas ref={this.previewCanvasRef}></canvas>
        </div>

        <div className="Zap-PlayWindow">
          <canvas ref={this.playCanvasRef}></canvas>
        </div>

        <div className="Zap-InspectorWindow">
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
                    const renderedValue = stringifiedValue.length <= 32
                      ? stringifiedValue
                      : stringifiedValue.slice(0, 32) + '...';
                    return (
                      <div className="Zap-InspectorComponentProperty">
                        <div>{propertyName}:</div>
                        <textarea value={stringifiedValue} />
                      </div>
                    );
                  })}
                </div>
              );
            })
            : null
          }
        </div>

        <div className="Zap-HierarchyWindow">
          <h2>Hierarchy</h2>
          <ul className="Zap-HierarchyEntities">
            {(this.state.isPlaying ? this.state.currentScene : this.state.initScene).entities.map((entity) => {
              const nameComp = entity.getComponent(components.Name);
              const name = nameComp ? nameComp.name : 'Unnamed Entity';
              return (
                <li onClick={() => this.setState({ inspected: entity })}>{name}</li>
              );
            })}
          </ul>
          <ul className="Zap-HierarchySystems">
            {(this.state.isPlaying ? this.state.currentScene : this.state.initScene).systems.map((system) => {
              return (
                <li>{system.name}</li>
              );
            })}
          </ul>
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
        const { fov, aspect, near, far } = camera.getComponent(components.CameraEnum).value;
        //console.log('cam',fov);
        const threeCamera = new THREE.PerspectiveCamera(fov, aspect, near, far);
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
      { fov: 75, aspect: this.getCanvasDimensions().aspectRation, near: 0.1, far: 1000.0 }
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
    const width = 0.50 * window.innerWidth;
    const height = 0.45 * window.innerHeight;
    return {
      width,
      height,
      aspectRatio: width / height,
    };
  }
}

export default Zap;
