// @flow weak
/**
 * @file observationReduser.js
 * @author Kjetil Fossheim
 */

import * as actionTypes from '../actions/actionTypes';

/**
 * * DEFAULT_STATE has the collection of empty states in the observationReduser.
 *
 * state:
 * -obsevationsList = list of user saved observations.
 * -deleteObs = delete user observation flag
 * -nerbyList = array of nearby observation for species in currant key.
 * -nerby_updated_loading = loading flag
 * -modalOpen = open and close update nearby observation modal
 * -getGerbyList = retrive nearbylist from DB flag
 * -nerby_updatedErrorBool =error flag
 * @type {Object}
 */
const DEFAULT_STATE = {onLogging: false,
  obsevationsList: [],
  deleteObs: -1,
  nerbyList: [],
  nerby_updated_loading: false,
  modalOpen: false,
  getGerbyList: false,
  nerby_updatedErrorBool: false,
};

export default function(state = DEFAULT_STATE, actions) {
  switch(actions.type) {
  case `${actionTypes.GET_ALL_OBSERVATIONS}_LOADING`:
    return{...state,
    };
  case `${actionTypes.GET_ALL_OBSERVATIONS}_SUCCESS`:
    return{...state,
      obsevationsList: actions.payload
    };
  case `${actionTypes.GET_ALL_OBSERVATIONS}_ERROR`:
    return{...state,
      obsevationsList: [],
      obsevationsListError: actions.payload
    };
  case `${actionTypes.DELETE_OBSERVATION}_LOADING`:
    return{...state,
    };
  case `${actionTypes.DELETE_OBSERVATION}_SUCCESS`:
    return{...state,
      deleteObs: 'sucsess',
      obsevationsList: actions.payload,
    };
  case `${actionTypes.DELETE_OBSERVATION}_ERROR`:
    return{...state,
      deleteObs: 'fail',
      deleteObsError: actions.payload
    };
  case `${actionTypes.NEW_OBSERVATION}_LOADING`:
    return{...state,
    };
  case `${actionTypes.NEW_OBSERVATION}_SUCCESS`:
    return{...state,
      insertObs: 'sucsess',
    };
  case `${actionTypes.NEW_OBSERVATION}_ERROR`:
    return{...state,
      insertObs: 'fail',
      insertObsError: actions.payload
    };
  case `${actionTypes.GET_OBSERVATION}_LOADING`:
    return{...state,
      getGerbyList: false,
    };
  case `${actionTypes.GET_OBSERVATION}_SUCCESS`:
    return{...state,
      nerbyList: actions.payload,
      getGerbyList: true,
    };
  case `${actionTypes.GET_OBSERVATION}_ERROR`:
    return{...state,
      getGerbyList: false,
      getGerbyListError: actions.payload
    };
  case `${actionTypes.UPDATE_NERBY}_LOADING`:
    return{...state,
      nerby_updated_loading: true,
      nerby_updated: false,
      nerby_updatedErrorBool: false,
    };
  case `${actionTypes.UPDATE_NERBY}_SUCCESS`:
    return{...state,
      nerby_updated: true,
      nerby_updatedErrorBool: false,
      nerby_updated_loading: false,
      modalOpen: !state.modalOpen,
    };
  case `${actionTypes.UPDATE_NERBY}_ERROR`:
    return{...state,
      nerby_updated: false,
      nerby_updatedError: actions.payload,
      nerby_updatedErrorBool: true,
      nerby_updated_loading: false,
    };
  case actionTypes.UPDATE_MODAL_OPEN:
    return{...state,
      modalOpen: !state.modalOpen,
    };
  case actionTypes.UPDATE_SUCCESS:
    return {...state,
      nerby_updated: false
    };
  case actionTypes.UPDATE_RESET:
    return {...state,
      nerby_updatedErrorBool: false,
      nerby_updated_loading: false,
    };
  default:
    return state;
  }
}
