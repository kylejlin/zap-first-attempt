import React from 'react';
import './Zap.css';
import * as THREE from 'three';
import * as components from './components';

import Entity from './ecs/Entity';
import Scene from './ecs/Scene';
import System from './ecs/System';
import IndexSpec from './ecs/IndexSpec';

import getInitScene from './getInitScene';

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
// In CSS vh units
const DIVIDER_HEIGHT = 2;
const COMMAND_BAR_HEIGHT = 10;

class Zap extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      initScene: null,
      currentScene: getInitScene(),
      isPlaying: false,
      inspected: null,

      canvasHierarchyDividerLeft: 50,
      hierarchyInspectorDividerLeft: 75,
      previewPlayDividerTop: 53,
      isCanvasHierarchyDividerBeingDragged: false,
      isHierarchyInspectorDividerBeingDragged: false,
      isPreviewPlayDividerTopBeingDragged: false,
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

        const topVh = 100 * e.clientY / window.innerHeight;
        if (this.state.isPreviewPlayDividerTopBeingDragged) {
          e.preventDefault();
          this.setState({
            previewPlayDividerTop: topVh,
          }, () => {
            this.resizeCanvases();
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
            width: this.state.canvasHierarchyDividerLeft + 'vw',
          }}
        >
          <canvas
            ref={this.previewCanvasRef}
            width={this.getPreviewCanvasDimensions().width}
            height={this.getPreviewCanvasDimensions().height}
          />
        </div>

        <div
          className="Zap-PreviewPlay-Divider"
          style={{
            top: this.state.previewPlayDividerTop + 'vh',
            width: this.state.canvasHierarchyDividerLeft + 'vw',
          }}
          onMouseDown={() => this.setState({ isPreviewPlayDividerTopBeingDragged: true })}
          onMouseUp={() => this.setState({ isPreviewPlayDividerTopBeingDragged: false })}
        />

        <div
          className="Zap-PlayWindow"
          style={{
            width: this.state.canvasHierarchyDividerLeft + 'vw',
            top: this.state.previewPlayDividerTop + DIVIDER_HEIGHT + 'vh',
            height: 100 - (this.state.previewPlayDividerTop + DIVIDER_HEIGHT) + 'vh',
          }}
        >
          <canvas
            ref={this.playCanvasRef}
            width={this.getPlayCanvasDimensions().width}
            height={this.getPlayCanvasDimensions().height}
          />
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
              {(this.state.isPlaying ? this.state.currentScene : this.state.currentScene).entities.map((entity) => {
                const nameComp = entity.getComponent(components.Name);
                const name = nameComp ? nameComp.name : 'Unnamed Entity';
                return (
                  <li
                    onClick={() => this.setState((prevState) => {
                      return {
                        inspected: prevState.inspected === entity
                          ? null
                          : entity,
                      };
                    })}
                    className={entity === this.state.inspected ? 'Zap-HierarchySelectedEntity' : ''}
                  >
                    {name}
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="Zap-HierarchySystems">
            <h3>Systems</h3>
            <ul >
              {(this.state.isPlaying ? this.state.currentScene : this.state.currentScene).systems.map((system) => {
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
    const previewThreeScene = new THREE.Scene();
    const previewThreeRenderer = new THREE.WebGLRenderer({
      canvas: this.previewCanvasRef.current,
    });
    const playThreeScene = new THREE.Scene();
    const playThreeRenderer = new THREE.WebGLRenderer({
      canvas: this.playCanvasRef.current,
    });

    this.setState({
      previewThreeScene,
      previewThreeRenderer,
      playThreeScene,
      playThreeRenderer,
    }, () => {
      this.resizeCanvases();
      this.setUpRenderSystem();
    });

    window.addEventListener('resize', () => {
      this.resizeCanvases();
    });
  }

  setUpRenderSystem() {
    const { previewThreeScene, previewThreeRenderer, playThreeScene, playThreeRenderer } = this.state;
// TODO: complete render system
    const render = new System(
      'Render',
      ({ dt }, scene, [playerCameraIndex, debugCameraIndex, thingIndex]) => {
        {
          previewThreeScene.children = [];
          const [debugCamera] = debugCameraIndex.entities;
          const { fov, aspectRatio, near, far } = debugCamera.getComponent(components.CameraEnum).value;
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
            previewThreeScene.add(threeMesh);
          }

          previewThreeRenderer.render(previewThreeScene, threeCamera);
        }

        {
          playThreeScene.children = [];
          const [playerCamera] = playerCameraIndex.entities;
          const { fov, aspectRatio, near, far } = playerCamera.getComponent(components.CameraEnum).value;
          //console.log('cam',fov);
          const playThreeCamera = new THREE.PerspectiveCamera(fov, aspectRatio, near, far);
          playThreeCamera.position.set(0, 0, 5);

          for (const thingEnt of thingIndex.entities) {
            const geoComp = thingEnt.getComponent(components.Geometry);
            const matComp = thingEnt.getComponent(components.MaterialEnum);
            const threeGeo = new THREE.Geometry();
            threeGeo.vertices = geoComp.vertices;
            threeGeo.faces = geoComp.faces;
            // TODO get actual material (+ standard)
            const threeMat = new THREE.MeshBasicMaterial({ color: matComp.value.color });
            const threeMesh = new THREE.Mesh(threeGeo, threeMat);
            playThreeScene.add(threeMesh);
          }

          playThreeRenderer.render(playThreeScene, playThreeCamera);
        }
      },
      [
        new IndexSpec([
          components.CameraEnum,
          components.IsMainPlayerCamera
        ]),
        new IndexSpec([
          components.CameraEnum,
          components.IsMainDebugCamera
        ]),
        new IndexSpec([
          components.Geometry,
          components.MaterialEnum,
        ])
      ]
    );
    this.state.currentScene.addSystem(render);
    this.startLoop();
  }

  startLoop() {
    let then = performance.now();
    const render = () => {
      if (this.state.isPlaying) {
        requestAnimationFrame(render);
      }
      const now = performance.now();
      const dt = now - then;
      then = now;
      this.state.currentScene.update({ dt });
    };
    render();

    this.setState({
      render,
    });
  }

  getPreviewCanvasDimensions() {
    const width = (this.state.canvasHierarchyDividerLeft / 100) * window.innerWidth;
    const height = ((this.state.previewPlayDividerTop - COMMAND_BAR_HEIGHT) / 100) * window.innerHeight;
    const aspectRatio = width / height;
    return {
      width,
      height,
      aspectRatio,
    };
  }

  getPlayCanvasDimensions() {
    const width = (this.state.canvasHierarchyDividerLeft / 100) * window.innerWidth;
    const height = ((100 - (this.state.previewPlayDividerTop + DIVIDER_HEIGHT)) / 100) * window.innerHeight;
    const aspectRatio = width / height;
    return {
      width,
      height,
      aspectRatio,
    };
  }

  resizeCanvases() {
    const { previewThreeRenderer, playThreeRenderer } = this.state;

    const {
      width: previewCanvasWidth,
      height: previewCanvasHeight,
      aspectRatio: previewCanvasAspectRatio,
    } = this.getPreviewCanvasDimensions();
    previewThreeRenderer.setSize(previewCanvasWidth, previewCanvasHeight);
    const debugCameraComps = this.state.currentScene.entities.map(ent => ent.getComponent(components.IsMainDebugCamera) && ent.getComponent(components.CameraEnum)).filter(ent => ent !== undefined && ent !== null);
    debugCameraComps.forEach((cameraComp) => {
      cameraComp.value.aspectRatio = previewCanvasAspectRatio;
    });

    const {
      width: playCanvasWidth,
      height: playCanvasHeight,
      aspectRatio: playCanvasAspectRatio,
    } = this.getPlayCanvasDimensions();
    playThreeRenderer.setSize(playCanvasWidth, playCanvasHeight);
    const playCameraComps = this.state.currentScene.entities.map(ent => ent.getComponent(components.IsMainPlayerCamera) && ent.getComponent(components.CameraEnum)).filter(ent => ent !== undefined && ent !== null);
    playCameraComps.forEach((cameraComp) => {
      cameraComp.value.aspectRatio = playCanvasAspectRatio;
    });

    if (this.state.render) {
      this.state.render();
    }
  }
}

export default Zap;
