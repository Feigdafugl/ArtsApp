/**
 * @file configureStore.js
 * @author Kjetil Fossheim
 *
 * configure redux Store
 */

// @flow
import {createStore, applyMiddleware, compose} from 'redux';
import promise from 'redux-promise';
import rootReducer from '../reducers/rootReducer';
// import {createLogger} from 'redux-logger';
import promiseMiddleware from 'redux-promise-middleware';


// add logger for logger
export default function configureStore(initialState: any = undefined) {
  // const logger = createLogger({ predicate: (getState, action) => __DEV__  });
  const enhancer = compose(
    applyMiddleware(promise, promiseMiddleware({ promiseTypeSuffixes: ['LOADING', 'SUCCESS', 'ERROR']}))
  );
  return createStore(rootReducer, initialState, enhancer);
}
