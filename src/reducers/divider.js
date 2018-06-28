import { SET_DIVIDER_IS_DRAGGED, SET_DIVIDER_TOP, SET_DIVIDER_LEFT } from '../actions/types';

const HORIZONTAL_DIVIDERS = [
  'PreviewPlay',
  'HierarchyAssets'
];
const VERTICAL_DIVIDERS = [
  'CanvasHierarchy',
  'HierarchyInspector'
];
const DIVIDERS = HORIZONTAL_DIVIDERS.concat(VERTICAL_DIVIDERS);

const dividerReducer = (
  state = {
    previewPlayDividerTop: 53,
    canvasHierarchyDividerLeft: 50,
    hierarchyAssetsDividerTop: 75,
    hierarchyInspectorDividerLeft: 75,
    isPreviewPlayDividerBeingDragged: false,
    isCanvasHierarchyDividerBeingDragged: false,
    isHierarchyAssetsDividerBeingDragged: false,
    isHierarchyInspectorDividerBeingDragged: false,
  },
  action
) => {
  switch (action.type) {
    case SET_DIVIDER_IS_DRAGGED:
      if (DIVIDERS.includes(action.divider)) {
        return {
          ...state,
          ['is' + action.divider + 'DividerBeingDragged']: action.isDragged,
        };
      } else {
        throw new TypeError(action.divider + ' is not a valid divider.');
      }

    case SET_DIVIDER_TOP:
      if (HORIZONTAL_DIVIDERS.includes(action.divider)) {
        return {
          ...state,
          [action.divider.charAt(0).toLowerCase() + action.divider.slice(1) + 'DividerTop']: action.top,
        }
      } else {
        throw new TypeError(action.divider + ' is not a horizontal divider.');
      }

    case SET_DIVIDER_LEFT:
      if (VERTICAL_DIVIDERS.includes(action.divider)) {
        return {
          ...state,
          [action.divider.charAt(0).toLowerCase() + action.divider.slice(1) + 'DividerLeft']: action.left,
        }
      } else {
        throw new TypeError(action.divider + ' is not a vertical divider.');
      }

    default:
      return state;
  }
};

export default dividerReducer;
