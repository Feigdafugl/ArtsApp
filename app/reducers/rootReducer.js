// @flow weak
/**
 * @file rootReducer.js
 * @author Kjetil Fossheim
 */

// This is the root reducer and root selectors
import {combineReducers} from 'redux';
import key, * as keyReducer from './keyReducer';
import nav, * as navReducer from './navReducer';
import menu, * as menuReducer from './menuReducer';
import settings, * as SettingsReducer from './SettingsReducer';
import observations, * as observationReduser from './observationReduser';

export default combineReducers({
  key,
  nav,
  menu,
  observations,
  settings,
});
