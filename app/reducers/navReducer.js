/**
 * @file navReducer.js
 * @author Kjetil Fossheim
 */
import { ActionConst } from 'react-native-router-flux';
import * as actionTypes from '../actions/actionTypes';

const DEFAULT_STATE = {scene: {}, fromPage: -1, lastPage: ''};

export default function reducer(state = DEFAULT_STATE, action = {}) {
  switch(action.type) {
    // focus action is dispatched when a new screen comes into focus
  case ActionConst.FOCUS:
    return {
      ...state,
      scene: action.scene,
      lastPage: state.scene.name,
    };
  case actionTypes.FROM_PAGE:
    return{...state,
      fromPage: action.fromPage,
    };
  default:
    return state;
  }
}

export const getNav = ({scene}) => ({
  scene
});
