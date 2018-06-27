import React from 'react';
import './Zap.css';
import * as THREE from 'three';
import * as components from './components';
import Entity from './ecs/Entity';
import System from './ecs/System';

import getInitScene from './getInitScene';
import getRenderSystem from './getRenderSystem';
import compileSystem from './compileSystem';

import newSystemInitialCode from './newSystemInitialCode';

// In CSS vw units
const DIVIDER_WIDTH = 1;
const WINDOW_PADDING = 1.5;
// In CSS vh units
const DIVIDER_HEIGHT = 2;
const COMMAND_BAR_HEIGHT = 10;

const NOOP = () => undefined;

class Zap extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      initSceneBackup: null,
      currentScene: getInitScene(),
      runStatus: 'STOPPED',
      systemSrcDict: {},
      systemWindowDict: {},

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
          <button
            className="Zap-CommandButton"
            onClick={() => {
              if (this.state.runStatus === 'RUNNING' || this.state.runStatus === 'PAUSED') {
                this.stop();
              } else {
                this.play();
              }
            }}
          >
            {this.state.runStatus !== 'STOPPED'
              ? <div className="Zap-IconStop" />
              : <div className="Zap-IconPlay" />
            }
          </button>
          <button
            className={'Zap-CommandButton' + (this.state.runStatus !== 'STOPPED' ? '' : ' Zap-DisabledButton')}
            onClick={() => {
              if (this.state.runStatus === 'RUNNING') {
                this.setState({
                  runStatus: 'PAUSED',
                });
              } else if (this.state.runStatus === 'PAUSED') {
                this.setState({
                  runStatus: 'RUNNING',
                });
              }
            }}
          >
            {this.state.runStatus === 'PAUSED'
              ? <div className="Zap-IconPlay" />
              : <div className="Zap-IconPause" />
            }
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
          <h2 onClick={() => this.openTextEditor()}>Hierarchy</h2>
          <div className="Zap-HierarchyEntities">
            <h3>Entities</h3>
            <ul>
              {this.state.currentScene.entities.map((entity) => {
                const nameComp = entity.InspectorName;
                const name = nameComp ? nameComp.inspectorName : 'Unnamed Entity';
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
              {this.state.currentScene.systems.map((system) => {
                return (
                  <li
                    onClick={() => {
                      this.setState({ inspected: system });
                    }}
                  >
                    {system.name}
                  </li>
                );
              })}
              <li
                className="Zap-NewButton"
                onClick={() => this.newSystem()}
              >
                New system
              </li>
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
            : (this.state.inspected instanceof System
              ? (
                <div className="Zap-InspectorSystem">
                  <div className="Zap-SystemName">
                    {this.state.inspected.name}
                  </div>
                  <div
                    className="Zap-EditButton"
                    onClick={() => this.editSystem(this.state.inspected.name)}
                  >
                    Edit system
                  </div>
                </div>
              )
              : null
            )
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
      const renderSystem = getRenderSystem(this);
      this.state.currentScene.addSystem(renderSystem);
      this.startLoop();
    });

    window.addEventListener('resize', () => {
      this.resizeCanvases();
    });
  }

  startLoop() {
    let then = performance.now();
    const render = () => {
      requestAnimationFrame(render);
      const now = performance.now();
      if (this.state.runStatus === 'RUNNING') {
        const dt = now - then;
        this.state.currentScene.globals.deltaTime = dt;
        this.state.currentScene.update();
      } else {
        this.manuallyRender();
      }
      then = now;
    };
    render();
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
    const debugCameraComps = this.state.currentScene.entities.map(ent => ent.IsMainDebugCamera && ent.CameraEnum).filter(ent => ent !== undefined && ent !== null);
    debugCameraComps.forEach((cameraComp) => {
      cameraComp.value.aspectRatio = previewCanvasAspectRatio;
    });

    const {
      width: playCanvasWidth,
      height: playCanvasHeight,
      aspectRatio: playCanvasAspectRatio,
    } = this.getPlayCanvasDimensions();
    playThreeRenderer.setSize(playCanvasWidth, playCanvasHeight);
    const playCameraComps = this.state.currentScene.entities.map(ent => ent.IsMainPlayerCamera && ent.CameraEnum).filter(ent => ent !== undefined && ent !== null);
    playCameraComps.forEach((cameraComp) => {
      cameraComp.value.aspectRatio = playCanvasAspectRatio;
    });
  }

  manuallyRender() {
    const renderSystem = getRenderSystem(this);
    const renderSystemIndexes = [];
    const scene = this.state.currentScene;
    for (const spec of renderSystem.indexSpecs) {
      let hasFoundIndex = false;
      for (const index of scene.indexes) {
        if (index.name === spec.name) {
          hasFoundIndex = true;
          renderSystemIndexes.push(index);
          break;
        }
      }
      if (!hasFoundIndex) {
        throw new ReferenceError('Cannot find an index with name "' + spec.name + '".');
      }
    }
    renderSystem.update(scene, renderSystemIndexes);
  }

  newSystem() {
    const newSystem = new System(
      'MyAwesomeSystem',
      NOOP,
      []
    );
    this.state.currentScene.addSystem(newSystem);
    this.setState((prevState) => {
      return {
        systemSrcDict: {
          ...prevState.systemSrcDict,
          MyAwesomeSystem: newSystemInitialCode,
        },
      };
    });
  }

  editSystem(systemName) {
    const existingEditorWindow = this.state.systemWindowDict[systemName];
    if (existingEditorWindow && !existingEditorWindow.closed) {
      existingEditorWindow.focus();
      return;
    }

    const editorWindow = window.open('/#editor');
    this.setState((prevState) => {
      return {
        systemWindowDict: {
          ...prevState.systemWindowDict,
          [systemName]: editorWindow,
        },
      };
    });
    window.addEventListener('message', (event) => {
      const message = event.data;
      if (message.type === 'READY') {
        editorWindow.postMessage(
          {
            type: 'SET_INITIAL_CODE',
            code: this.state.systemSrcDict[systemName],
          },
          '*'
        );
      } else if (message.type === 'CODE_UPDATE') {
        this.setState((prevState) => {
          return {
            systemSrcDict: {
              ...prevState.systemSrcDict,
              [systemName]: message.code,
            },
          };
        });
      }
    });
    window.addEventListener('beforeunload', () => {
      editorWindow.close();
    });
  }

  play() {
    this.compileSystemSrcs();
    this.setState((prevState) => {
      return {
        runStatus: 'RUNNING',
        initSceneBackup: prevState.currentScene.getBackup(),
      };
    });
  }

  stop() {
    this.state.currentScene.restoreWithBackup(this.state.initSceneBackup);
    this.resizeCanvases();
    this.setState((prevState) => {
      return {
        runStatus: 'STOPPED',
        initSceneBackup: null,
      };
    });
  }

  compileSystemSrcs() {
    const { currentScene, systemSrcDict } = this.state;
    const systemNames = Object.keys(systemSrcDict);

    for (const systemName of systemNames) {
      const system = currentScene.systems.find(s => s.name === systemName);
      if (system) {
        currentScene.removeSystem(system);
      }
    }
    for (const systemName of systemNames) {
      const systemSrc = systemSrcDict[systemName];
      const system = compileSystem(systemSrc);
      if (system !== null) {
        if (system.name !== systemName) {
          delete systemSrcDict[systemName];
          systemSrcDict[system.name] = systemSrc;
        }
        currentScene.addSystem(system);
      }
    }
  }
}

export default Zap;
