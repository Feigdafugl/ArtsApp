import * as actionTypes from './actionTypes';
import AsyncStore from '../config/AsyncStore';
import LangStrings from '../config/LangStrings';
import { NetInfo } from 'react-native';
import DB_helper from '../config/DB/DB_helper';
import KeyDownload from '../config/nettwork/KeyDownload';
import ImageConfig from '../config/nettwork/ImageConfig';

export function setLanguage(lang) {
  this.AsyncStore = new AsyncStore();
  return {
    type: actionTypes.SET_LANGUAGE,
    payload: {
      promise: this.AsyncStore.setLanguage(lang),
    },
  };
};

export function getLanguage() {
  this.AsyncStore = new AsyncStore();
  return {
    type: actionTypes.GET_LANGUAGE,
    payload: {
      promise: this.AsyncStore.getLanguage(),
    },
  };
};


export function setlastDownloaddate(date) {
  this.AsyncStore = new AsyncStore();
  return {
    type: actionTypes.SET_LAST_DOWNLOAD,
    payload: {
      promise: this.AsyncStore.setLastDownloadDate(date),
    },
  };
};

export function getlastDownload() {
  this.AsyncStore = new AsyncStore();
  return {
    type: actionTypes.GET_LAST_DOWNLOAD,
    payload: {
      promise: this.AsyncStore.getLastDownloadDate(),
    },
  };
};

export function setContantStrings(lang) {
  this.LangStrings = new LangStrings();
  return {
    type: actionTypes.GET_LANG_STRINGS,
    strings: this.LangStrings.getLangStrings(lang),
  };
};

export function isOnline(isConnected) {
  return {
    type: actionTypes.UPDATE_CONNECTIVITY,
    isConnected: isConnected
  };
};

export function debugMode(bool) {
  return {
    type: actionTypes.DEBUG_MODE,
    debugMode: bool
  };
};

export function setUpDataBase() {
  this.DB_helper = new DB_helper();
  return {
    type: actionTypes.SETUP_DB,
    payload: {
      promise: this.DB_helper.testDatabase(),
    },
  };
}

export function updateKeys(keys) {
  this.KeyDownload = new KeyDownload();
  return {
    type: actionTypes.UPDATE_KEYS,
    payload: {
      promise: this.KeyDownload.updateKeys(keys),
    },
  };
}

export function getkeysFromApi() {
  this.KeyDownload = new KeyDownload();
  return {
    type: actionTypes.KEYS_FROM_API,
    payload: {
      promise: this.KeyDownload.getkeyListFromApi(),
    },
  };
}

export function setLocation(lat, long) {
  return {
    type: actionTypes.SET_LOCATION,
    latitude: lat,
    longitude: long,
  };
}


export function keyListUpdated() {
  return {
    type: actionTypes.KEY_LIST_UPDATED,
  };
}

export function deletedata(key_id) {
  this.DB_helper = new DB_helper();
  this.ImageConfig = new ImageConfig();
  return {
    type: actionTypes.DELETE_KEY_DATA,
    payload: {
      promise: Promise.all([this.DB_helper.deleteKeyData(key_id), this.ImageConfig.deleteImagesToKeyData(key_id)]),
    },
  };
}

export function setUpdateList() {
  this.DB_helper = new DB_helper();
  return {
    type: actionTypes.SET_UPDATELIST,
    payload: {
      promise: this.DB_helper.getDownloadedKeys(),
    },
  };
};

export function resetUpdateKey() {
  return {
    type: actionTypes.RESET_UPDATE_KEY,
  };
};
