import React from 'react';
import './Zap.css';
import * as THREE from 'three';
import * as components from './components';
import VirtualSystem from './ecs/VirtualSystem';

import getInitScene from './getInitScene';
import getRenderSystem from './getRenderSystem';
import compileSystem from './compileSystem';

import newSystemInitialCode from './newSystemInitialCode';

import PlayButton from './PlayButton';
import PauseButton from './PauseButton';
import VirtualEntityInspector from './VirtualEntityInspector';
import VirtualSystemInspector from './VirtualSystemInspector';

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

  render = () => {
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
            this.resizeRenderers();
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
            this.resizeRenderers();
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
          <PlayButton
            isInPlayMode={this.state.runStatus !== 'STOPPED'}
            play={this.play}
            stop={this.stop}
          />
          <PauseButton
            isInPlayMode={this.state.runStatus !== 'STOPPED'}
            isPaused={this.state.runStatus === 'PAUSED'}
            pause={this.pause}
            resume={this.resume}
          />
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
              <li>
                <button
                  className="Zap-Button Zap-AddButton"
                  onClick={() => this.addSystem()}
                >
                  Add system
                </button>
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
          {(() => {
            if (this.state.inspected === null) {
              return null;
            }
            if (this.state.inspected.isEntity) {
              if (this.state.inspected.isVirtual) {
                return (
                  <VirtualEntityInspector
                    virtualEntity={this.state.inspected}
                    openAddComponentMenu={this.openAddComponentMenu}
                  />
                );
              }
              return null; // TODO EntityInspector
            }
            if (this.state.inspected.isSystem) {
              if (this.state.inspected.isVirtual) {
                return (
                  <VirtualSystemInspector
                    systemName={this.state.inspected.name}
                    editSystem={this.editSystem}
                  />
                );
              }
              return null; // TODO SystemInspector
            }
          })()}
        </div>
      </div>
    );
  }

  componentDidMount = () => {
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
      this.resizeRenderers();
      this.startLoop();
    });

    window.addEventListener('resize', () => {
      this.resizeRenderers();
    });
  }

  startLoop = () => {
    let then = performance.now();
    const gameLoop = () => {
      requestAnimationFrame(gameLoop);
      const now = performance.now();
      if (this.state.runStatus === 'RUNNING') {
        const dt = now - then;
        this.state.currentScene.globals.deltaTime = dt;
        this.state.currentScene.update();
      }
      then = now;
    };
    gameLoop();
  }

  getPreviewCanvasDimensions = () => {
    const width = (this.state.canvasHierarchyDividerLeft / 100) * window.innerWidth;
    const height = ((this.state.previewPlayDividerTop - COMMAND_BAR_HEIGHT) / 100) * window.innerHeight;
    const aspectRatio = width / height;
    return {
      width,
      height,
      aspectRatio,
    };
  }

  getPlayCanvasDimensions = () => {
    const width = (this.state.canvasHierarchyDividerLeft / 100) * window.innerWidth;
    const height = ((100 - (this.state.previewPlayDividerTop + DIVIDER_HEIGHT)) / 100) * window.innerHeight;
    const aspectRatio = width / height;
    return {
      width,
      height,
      aspectRatio,
    };
  }

  resizeRenderers = () => {
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

    if (this.state.runStatus !== 'RUNNING') {
      this.manuallyRender();
    }
  }

  manuallyRender = () => {
    const scene = (() => {
      if (this.state.runStatus !== 'STOPPED') {
        return this.state.currentScene;
      }

      const scene = this.state.currentScene.intoSceneWithoutSystems();
      scene.addSystem(getRenderSystem(this));
      return scene;
    })();
    const renderSystem = scene.systems.find(s => s.name === 'Render');
    const renderSystemIndexes = [];
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

  addSystem = () => {
    const newSystem = new VirtualSystem(
      'MyAwesomeSystem',
      newSystemInitialCode
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

  editSystem = (systemName) => {
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
            code: newSystemInitialCode,
          },
          '*'
        );
      } else if (message.type === 'CODE_UPDATE') {
        const virtualSystem = this.state.currentScene.systems.find(v => v.name === systemName);
        if (!virtualSystem) {
          throw new Error('Virtual system not found.');
        }
        virtualSystem.src = message.code;
      }
    });
    window.addEventListener('beforeunload', () => {
      editorWindow.close();
    });
  }

  play = () => {
    this.setState((prevState) => {
      const liveScene = prevState.currentScene.intoScene();
      liveScene.addSystem(getRenderSystem(this));
      return {
        runStatus: 'RUNNING',
        initSceneBackup: prevState.currentScene,
        currentScene: liveScene,
      };
    });
  }

  stop = () => {
    this.setState((prevState) => {
      return {
        runStatus: 'STOPPED',
        initSceneBackup: null,
        currentScene: prevState.initSceneBackup,
      };
    }, () => {
      // In case the windows were resized in play mode.
      this.resizeRenderers();
    });
  }

  pause = () => {
    this.setState({
      runStatus: 'PAUSED',
    });
  }

  resume = () => {
    this.setState({
      runStatus: 'RUNNING',
    });
  }

  openAddComponentMenu = () => {
    const entity = this.state.inspected;
    // TODO
  }
}

export default Zap;
