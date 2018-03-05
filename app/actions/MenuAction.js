
import * as actionTypes from './actionTypes';


export function openMenu() {
  return {
    type: actionTypes.OPEN_MENU,
  };
}

export function closeMenu() {
  return {
    type: actionTypes.CLOSE_MENU,
  };
}
