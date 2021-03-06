import React from 'react';
import './Zap.css';
import * as THREE from 'three';
import * as components from './components';
import VirtualSystem from './ecs/VirtualSystem';
import VirtualEntity from './ecs/VirtualEntity';

import AssetManager from './assetManager/AssetManager';
import ComponentCreatorSource from './assetManager/ComponentCreatorSource';

import getInitScene from './getInitScene';
import getRenderSystem from './getRenderSystem';
import compileSystem from './compileSystem';

import newSystemInitialCode from './newSystemInitialCode';
import newComponentCreatorInitialCode from './newComponentCreatorInitialCode';

import CommandBar from './CommandBar';
import InspectorWindow from './InspectorWindow';
import HierarchyWindow from './HierarchyWindow';
import AssetWindow from './AssetWindow';

import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import reducer from './reducers/index';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  reducer,
  composeEnhancers(
    applyMiddleware(thunk)
  )
);

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
      creatorWindowDict: {},

      inspected: null,

      isAddComponentMenuOpen: false,
      selectedComponent: null,
      searchQuery: '',
      isSelectedComponentDerived: true,

      assetManager: new AssetManager(),

      canvasHierarchyDividerLeft: 50,
      hierarchyAssetsDividerTop: 75,
      hierarchyInspectorDividerLeft: 75,
      previewPlayDividerTop: 53,
      isCanvasHierarchyDividerBeingDragged: false,
      isHierarchyAssetsDividerBeingDragged: false,
      isHierarchyInspectorDividerBeingDragged: false,
      isPreviewPlayDividerBeingDragged: false,
    };
    this.previewCanvasRef = React.createRef();
    this.playCanvasRef = React.createRef();
  }

  render = () => {
    return (
      <Provider store={store}>
        <div
          className="Zap"
          onMouseMove={this.updateDraggedDivider}
        >
          <CommandBar
            width={this.state.canvasHierarchyDividerLeft + 'vw'}
            runStatus={this.state.runStatus}

            play={this.play}
            stop={this.stop}
            pause={this.pause}
            resume={this.resume}
          />

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
            onMouseDown={() => this.setState({ isPreviewPlayDividerBeingDragged: true })}
            onMouseUp={() => this.setState({ isPreviewPlayDividerBeingDragged: false })}
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

          <HierarchyWindow
            left={DIVIDER_WIDTH + this.state.canvasHierarchyDividerLeft + 'vw'}
            width={this.state.hierarchyInspectorDividerLeft - this.state.canvasHierarchyDividerLeft - (2 * WINDOW_PADDING) + 'vw'}
            height={'calc(' + this.state.hierarchyAssetsDividerTop + 'vh - ' + (2 * WINDOW_PADDING) + 'vw)'}
            entities={this.state.currentScene.entities}
            systems={this.state.currentScene.systems}
            inspected={this.state.inspected}

            toggleEntitySelection={this.toggleEntitySelection}
            toggleSystemSelection={this.toggleSystemSelection}
            addSystem={this.addSystem}
            addEntity={this.addEntity}
          />

          <div
            className="Zap-HierarchyAssets-Divider"
            style={{
              top: this.state.hierarchyAssetsDividerTop + 'vh',
              left: DIVIDER_WIDTH + this.state.canvasHierarchyDividerLeft + 'vw',
              width: this.state.hierarchyInspectorDividerLeft - this.state.canvasHierarchyDividerLeft + 'vw',
            }}
            onMouseDown={() => this.setState({ isHierarchyAssetsDividerBeingDragged: true })}
            onMouseUp={() => this.setState({ isHierarchyAssetsDividerBeingDragged: false })}
          />

          <AssetWindow
            top={DIVIDER_HEIGHT + this.state.hierarchyAssetsDividerTop + 'vh'}
            left={DIVIDER_WIDTH + this.state.canvasHierarchyDividerLeft + 'vw'}
            width={this.state.hierarchyInspectorDividerLeft - this.state.canvasHierarchyDividerLeft - (2 * WINDOW_PADDING) + 'vw'}
            height={'calc(' + (100 - this.state.hierarchyAssetsDividerTop - DIVIDER_HEIGHT) + 'vh - ' + (2 * WINDOW_PADDING) + 'vw)'}
            componentCreatorNames={Object.keys(this.state.assetManager.componentCreators)}
            componentProviderNames={Object.keys(this.state.assetManager.componentProviders)}

            addComponentCreator={this.addComponentCreatorToAssets}
            addComponentProvider={this.addComponentProviderToAssets}
            inspectComponentCreator={this.inspectComponentCreator}
          />

          <div
            className="Zap-HierarchyInspector-Divider"
            style={{
              left: this.state.hierarchyInspectorDividerLeft + 'vw',
            }}
            onMouseDown={() => this.setState({ isHierarchyInspectorDividerBeingDragged: true })}
            onMouseUp={() => this.setState({ isHierarchyInspectorDividerBeingDragged: false })}
          />

          <InspectorWindow
            inspected={this.state.inspected}
            isAddComponentMenuOpen={this.state.isAddComponentMenuOpen}
            searchQuery={this.state.searchQuery}
            componentCreators={components}
            existingComponentNames={
              (
              this.state.inspected
              && this.state.inspected.isEntity
              && Object.keys(this.state.inspected)
                .filter(name => !['isEntity', 'isVirtual'].includes(name))
              )
              || []
            }
            selectedComponent={this.state.selectedComponent}
            isDerived={this.state.isSelectedComponentDerived}

            openAddComponentMenu={this.openAddComponentMenu}
            editSystem={this.editSystem}
            updateSearchQuery={this.updateSearchQuery}
            selectComponentToAdd={this.selectComponentToAdd}
            editCreator={this.editCreator}
            toggleIsDerived={this.toggleIsSelectedComponentDerived}
            addComponent={this.addComponent}
          />
        </div>
      </Provider>
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
        const virtualSystem = this.state.currentScene.systems.find(v => v.name === systemName);
        if (!virtualSystem) {
          throw new Error('Virtual system not found.');
        }
        const { src } = virtualSystem;
        editorWindow.postMessage(
          {
            type: 'SET_INITIAL_CODE',
            code: src,
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
        inspected: null,
      };
    });
  }

  stop = () => {
    this.setState((prevState) => {
      return {
        runStatus: 'STOPPED',
        initSceneBackup: null,
        currentScene: prevState.initSceneBackup,
        inspected: null,
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
    this.setState({
      isAddComponentMenuOpen: true,
    });
  }

  toggleEntitySelection = (entity) => {
    this.setState((prevState) => {
      return {
        inspected: prevState.inspected === entity
          ? null
          : entity,
      };
    });
    this.closeAndCleanUpAddComponentMenu();
  }

  toggleSystemSelection = (system) => {
    this.setState((prevState) => {
      return {
        inspected: prevState.inspected === system
          ? null
          : system,
      };
    });
    this.closeAndCleanUpAddComponentMenu();
  }

  updateDraggedDivider = (e) => {
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
    if (this.state.isPreviewPlayDividerBeingDragged) {
      e.preventDefault();
      this.setState({
        previewPlayDividerTop: topVh,
      }, () => {
        this.resizeRenderers();
      });
    }
    if (this.state.isHierarchyAssetsDividerBeingDragged) {
      e.preventDefault();
      this.setState({
        hierarchyAssetsDividerTop: topVh,
      });
    }
  }

  updateSearchQuery = (searchQuery) => {
    this.setState({
      searchQuery,
    });
  }

  selectComponentToAdd = (component) => {
    this.setState({
      selectedComponent: component,
    });
  }

  addComponent = () => {
    const { inspected: entity, isSelectedComponentDerived, selectedComponent } = this.state;

    if (!entity || !entity.isEntity) {
      throw new TypeError('No entity selected.');
    }

    const component = isSelectedComponentDerived
      ? {
        name: selectedComponent.name,
        isDerived: true,
        providerName: null,
      }
      : selectedComponent;

    entity.addComponent(component);
    this.closeAndCleanUpAddComponentMenu();
  }

  closeAndCleanUpAddComponentMenu = () => {
    this.setState({
      isAddComponentMenuOpen: false,
      selectedComponent: null,
      isSelectedComponentDerived: true,
    });
  }

  addEntity = () => {
    const { currentScene } = this.state;
    if (!currentScene.isVirtual) {
      throw new TypeError('Current scene is not a VirtualScene.');
    }
    const entity = new VirtualEntity();
    entity.addComponent(
      components.InspectorName('UnnamedEntity')
    );
    currentScene.entities.push(entity);
    this.forceUpdate();
  }

  addComponentCreatorToAssets = () => {
    const creatorSource = new ComponentCreatorSource('MyAwesomeComponent', newComponentCreatorInitialCode);
    this.state.assetManager.addComponentCreatorSource(creatorSource);
    this.forceUpdate();
  }

  addComponentProviderToAssets = () => {
    throw new Error('TODO addComponentProviderToAssets');
  }

  inspectComponentCreator = (creatorName) => {
    this.setState((prevState) => {
      return {
        inspected: prevState.assetManager.componentCreatorSources[creatorName],
      };
    });
  }

  editCreator = (creatorName) => {
    const existingEditorWindow = this.state.creatorWindowDict[creatorName];
    if (existingEditorWindow && !existingEditorWindow.closed) {
      existingEditorWindow.focus();
      return;
    }

    const editorWindow = window.open('/#editor');
    this.setState((prevState) => {
      return {
        creatorWindowDict: {
          ...prevState.creatorWindowDict,
          [creatorName]: editorWindow,
        },
      };
    });
    window.addEventListener('message', (event) => {
      const message = event.data;
      if (message.type === 'READY') {
        editorWindow.postMessage(
          {
            type: 'SET_INITIAL_CODE',
            code: this.state.assetManager.componentCreatorSources[creatorName].src,
          },
          '*'
        );
      } else if (message.type === 'CODE_UPDATE') {
        const creatorSource = this.state.assetManager.componentCreatorSources[creatorName];
        if (!creatorSource) {
          throw new Error('Virtual system not found.');
        }
        creatorSource.src = message.code;
      }
    });
    window.addEventListener('beforeunload', () => {
      editorWindow.close();
    });
  }

  toggleIsSelectedComponentDerived = (isDerived) => {
    this.setState({
      isSelectedComponentDerived: isDerived,
    });
  }
}

export default Zap;
