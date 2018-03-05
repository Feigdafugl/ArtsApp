/**
 * @file AsyncStore.js
 * @author Kjetil Fossheim
 *
 * controller that is used to access the AsyncStorage.
 */

import {
  AsyncStorage,
} from 'react-native';


// available items in store;
const LANGUAGE = 'LANGUAGE';


export default class AcyncStore {

  constructor() {
  }

  /**
   * set language in AcyncStore
   * @param {String} a language to set
   */
  setLanguage(a) {
    return new Promise((resolve, reject)=>{
      return Promise.all([AsyncStorage.setItem('LANGUAGE', a) , AsyncStorage.getItem('LANGUAGE') ])
      .then( res => {
        resolve(res[1]);
      })
      .catch(reason => {
      });
    });
  }

  /**
   * get language in AcyncStore
   * @return {String} language stored
   */
  getLanguage() {
    return AsyncStorage.getItem('LANGUAGE');
  }

  /**
   * sets timestamp in AsyncStore for when the app last was updated.
   * @param {String} date
   */
  setLastDownloadDate(date) {
    return new Promise((resolve, reject)=>{
      return Promise.all([AsyncStorage.setItem('LAST_DOWNLOAD', date) , AsyncStorage.getItem('LAST_DOWNLOAD') ])
      .then( res => {
        resolve(res[1]);
      })
      .catch(reason => {
      });
    });
  }

  /**
   * get timestamp from AcyncStore
   * @return {String} timestamp
   */
  getLastDownloadDate() {
    return AsyncStorage.getItem('LAST_DOWNLOAD');
  }

}
