import { SET_DIVIDER_IS_DRAGGED } from './types';

export function setDividerIsDragged(divider, isDragged) {
  return {
    type: SET_DIVIDER_IS_DRAGGED,
    divider,
    isDragged,
  };
}

export function setDividerTop(divider, top) {
  return {
    type: SET_DIVIDER_TOP,
    divider,
    top,
  };
}

export function setDividerLeft(divider, left) {
  return {
    type: SET_DIVIDER_LEFT,
    divider,
    left,
  };
}
