
import * as actionTypes from './actionTypes';
import DB_helper from '../config/DB/DB_helper';


export function getObservations() {
  this.DB_helper = new DB_helper();
  return {
    type: actionTypes.GET_ALL_OBSERVATIONS,
    payload: {
      promise: this.DB_helper.getObservations(),
    },
  };
}

export function deleteObservation(obsId) {
  return {
    type: actionTypes.DELETE_OBSERVATION,
    payload: {
      promise: this.DB_helper.deleteObservation(obsId),
    },
  };
}
export function insertObservation(observationId) {
  return {
    type: actionTypes.NEW_OBSERVATION,
    payload: {
      promise: this.DB_helper.insertNewObservation(observationId),
    },
  };
}

export function setSpNerby(key) {
  return {
    type: actionTypes.GET_OBSERVATION,
    payload: {
      promise: this.DB_helper.getNerbyObservation(key),
    },
  };
}

export function updateNerbyList(keys, latitude, longitude) {
  return {
    type: actionTypes.UPDATE_NERBY,
    payload: {
      promise: this.DB_helper.fethObservationNumbers(keys, latitude, longitude),
    },
  };
}

export function changeModal() {
  return {
    type: actionTypes.UPDATE_MODAL_OPEN,
  };
}

export function changeUpdateSuccess() {
  return {
    type: actionTypes.UPDATE_SUCCESS,
  };
}

export function updateReset() {
  return {
    type: actionTypes.UPDATE_RESET,
  };
}
