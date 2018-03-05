// @flow weak
/**
 * @file menuReducer.js
 * @author Kjetil Fossheim
 */

import * as actionTypes from '../actions/actionTypes';


// Reducer
const DEFAULT_STATE = {onLogging: false,
  test: -1,
  menuOpen: false,
  drawerDisabled: true,
};

export default function(state = DEFAULT_STATE, actions) {
  switch(actions.type) {
  case actionTypes.OPEN_MENU:
    return{...state,
      menuOpen: true,
    };
  case actionTypes.CLOSE_MENU:
    return{...state,
      menuOpen: false,
    };
  default:
    return state;
  }
}
