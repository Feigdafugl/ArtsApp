
import * as actionTypes from './actionTypes';
import DB_helper from '../config/DB/DB_helper';
import KeyDownload  from '../config/nettwork/KeyDownload';

export function setTest() {
  return {
    type: actionTypes.TEST_ACTION_TYPE_ONE,
  };
}
export function resettingReset() {
  return {
    type: actionTypes.RESETTING_RESET,
  };
}
export function setKey(key, title) {
  return {
    type: actionTypes.ACTION_CHOSEN_KEY,
    chosenKey: key,
    chosenKeyTitle: title,
  };
}

export function changeValues(chosenValues, chosenTraits, keyId) {
  return {
    type: actionTypes.ACTION_VALUE_CHANGE,
    chosenValues: chosenValues,
    chosenTraits: chosenTraits,
  };
}

export function setAllSpToKEy(keyId) {
  this.DB_helper = new DB_helper();
  return {
    type: actionTypes.ACTION_FULL_SPECIES,
    payload: {
      promise: this.DB_helper.getSpeciesFromDb(keyId),
    },
  };
};

export function setSpeciesLeft(chosenValues, keyId) {
  this.DB_helper = new DB_helper();
  return { // dette må være med
    type: actionTypes.ACTION_SP_LEFT,
    payload: {
      promise: this.DB_helper.getSpeciesWithvalue(chosenValues, keyId),
    },
  };
}

export function selectSpecies(species) {
  return {
    type: actionTypes.ACTION_SELCTED_SP,
    selectedSpecies: species,
  };
}

export function setAllKeys() {
  this.DB_helper = new DB_helper();
  return {
    type: actionTypes.ACTION_ALL_KEYS,
    payload: {
      promise: this.DB_helper.getKeys(),
    },
  };
}

export function resetKey(keyId) {
  return {
    type: actionTypes.ACTION_RESET_KEY,
  };
}

export function setTraitValuecombo(keyId) {
  this.DB_helper = new DB_helper();
  return {
    type: actionTypes.TRAIT_VALUE_COMBO,
    payload: {
      promise: this.DB_helper.getTraitValuecombo(keyId),
    },
  };
}

export function getKey(keyId) {
  this.DB_helper = new DB_helper();
  return {
    type: actionTypes.KEY_DETAILS,
    payload: {
      promise: this.DB_helper.getKeyDetails(keyId),
    },
  };
}

export function getValueImages(keyId) {
  this.DB_helper = new DB_helper();
  return {
    type: actionTypes.VALUE_IMAGES,
    payload: {
      promise: this.DB_helper.getValueImagestoKey(keyId),
    },
  };
}

export function getAllSpImages(keyId) {
  this.DB_helper = new DB_helper();
  return {
    type: actionTypes.ALL_SPESIES_IMAGES,
    payload: {
      promise: this.DB_helper.getAllSpImagestoKey(keyId),
    },
  };
}


export function downloadKey(keyWebName) {
  this.KeyDownload = new KeyDownload();
  return {
    type: actionTypes.DOWNLOAD_KEY,
    payload: {
      promise: this.KeyDownload.downloadKey(keyWebName),
    },
  };
}
