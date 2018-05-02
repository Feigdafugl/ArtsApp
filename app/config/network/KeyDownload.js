/**
 * @file KeyDownload.js
 * @author Kjetil Fossheim
 *
 * KeyDownload it main purpose it to downloads keys but it also look for updates and updates keys.
 */

import DB_helper from '../DB/DB_helper';
import ImageConfig from './ImageConfig';
import * as URLs from './URLs';

export default class KeyDownload {

  constructor() {
    this.DB_helper = new DB_helper();
    this.ImageConfig = new ImageConfig();
  }


  /**
   * collects all keys from the web-servant and saves them to the locale database. I also downloads Images to the selected key.
   * @return {Promise} Returns a Promise of the downloaded keys.
   */
  getkeyListFromApi() {
    return new Promise((resolve, reject) =>{
      fetch(URLs.KEY_ALL)
      .then((response) => response.json())
      .then((retJSON) => {
        let ret = this.keysJSONParser(retJSON);
        let promises = [];
        for (let i = 0; i < ret.length; i++) {
          promises.push(this.DB_helper.insertKeysSheel(ret[i], false));
          promises.push(this.ImageConfig.saveKeyImages(ret[i]));
        }
        Promise.all(promises)
        .then((value) => {
          resolve(value);
        })
        .catch((err2) => {
          reject(err2);
        });
      })
      .catch((err) => {
        reject(err);
      });
    });
  }


  /**
   * looks for update or updates n the list of available.
   * @param {array} oldKeys input list of all old keys.
   * @see DB_helper .insertKeysSheel .setUpdateTrigger .updateKey .deleteKey
   * @see ImageConfig .saveKeyImages .deleteImagesToKey
   * @see this.keyJSONParser
   * @return {Promise} promises with object(list of new keys and a boolean true if some need update)
   */
  // input list of all old keys.
  lookForUpdate(oldKeys) {
    let newKeylist = [];
    let someUpdate = false;
    return new Promise((resolve, reject) =>{
      fetch(URLs.KEY_ALL)
      .then((response) => response.json())
      .then((retJSON) => {
        let ret = this.keysJSONParser(retJSON);
        newKeylist = ret;
        let promises = [];
        for (let i = 0; i < ret.length; i++) {
          let o = oldKeys[_.findIndex(oldKeys, {keyWeb: ret[i].keyWeb})];
          if (typeof o === 'undefined') {
            promises.push(this.DB_helper.insertKeysSheel(ret[i], false));
            promises.push(this.ImageConfig.saveKeyImages(ret[i]));
          }
          else{
            if (ret[i].version > o.version) {
              if (o.keyDownloaded === 1) {
                this.DB_helper.setUpdateTrigger(o.key_id);
                someUpdate = true;
              }
              else {
                promises.push(this.DB_helper.updateKey(ret[i], false));
                promises.push(this.ImageConfig.saveKeyImages(ret[i]));
              }
            }
          };
        }
        for (let i = 0; i < oldKeys.length; i++) {
          let old = oldKeys[_.findIndex(ret, {keyWeb: oldKeys[i].keyWeb})];
          if (typeof old === 'undefined' && oldKeys[i].keyDownloaded === 0) {
            this.DB_helper.deleteKey(oldKeys[i].key_id);
            this.ImageConfig.deleteImagesToKey(oldKeys[i].key_id);
          }
        }
        Promise.all(promises)
        .then((value) => {
          resolve({newKeylist:newKeylist,someUpdate:someUpdate});
        })
        .catch((err2) => {
          reject(err2);
        });
      })
      .catch((err) => {
        reject(err);
      });
    });
  }

  /**
   * Downloads key data and images for selected key.
   * @param {String} webname name of the key to be downloaded
   * @see DB_helper.insertKey
   * @see ImageConfig .saveContaintInmages .saveKeyImages
   * @return {Promise}
   */
  downloadKey(webname) {
    return new Promise((resolve, reject) => {
      fetch(BASE_URL + 'keys/get/' + webname)
      .then((response) => response.json())
      .then((retJSON) => {
        this.keyJSONParser(retJSON)
        .then((value) => {
          Promise.all([this.DB_helper.insertKey(value), this.ImageConfig.saveContaintInmages(value.content.image), this.ImageConfig.saveKeyImages(value)])
          .then((value) => {
            resolve();
          })
          .catch((err) => {
            reject(err);
          });
        });

      })
      .catch((err) => {
        reject(err);
      });
    });
  }

  /**
   * updates selected key
   * @param {String} webname name of the key update
   * @see DB_helper .insertKey .insertKeysSheel
   * @see ImageConfig .saveKeyImages .saveContaintInmages
   * @return {Promise}
   */
  downloadKeyUpdate(webname) {
    return new Promise((resolve, reject) => {
      fetch(BASE_URL + 'keys/get/' + webname)
      .then((response) => response.json())
      .then((retJSON) => {
        this.keyJSONParser(retJSON)
        .then((value) => {
          this.DB_helper.insertKeysSheel(value, true)
          .then(() => {
            Promise.all([this.DB_helper.insertKey(value), this.ImageConfig.saveKeyImages(value), this.ImageConfig.saveContaintInmages(value.content.image)])
            .then(() => {
              resolve();
            })
            .catch((err) => {
              reject(err);
            });
          })
          .catch((err) => {
            reject(err);
          });
        });

      })
      .catch((err) => {
        reject(err);
      });
    });
  }

  /**
   * update one key at a time deletes old data and then update
   * @see this.downloadKeyUpdate
   * @see DB_helper.deleteKey
   * @see ImageConfig.deleteImagesToKey
   * @param {array} keys list of keys to update
   * @return {Promise}
   */
  // updates list of keys
  updateKeys(keys) {
    ret = keys.map((key, i) =>{
      return new Promise((resolve, reject) => {
        let k = key;
        this.DB_helper.deleteKey(k.key_id).then((value) => {
          this.ImageConfig.deleteImagesToKey(k.key_id).then((value) => {
            Promise.all([ this.downloadKeyUpdate(k.keyWeb)]).then((value) => {
              resolve();
            });
          })
          .catch((err) => {
            reject(err);
          });
        })
        .catch((err) => {
          reject(err);
        });
      });
    });
    return Promise.all(ret);
  }


  /**
   * JSON parser for list of keys from web api, used on keydata without content.
   * @param {array} keysJsonString array of keys
   * @return {Promise}
   */
  keysJSONParser(keysJsonString) {
    return  (keysJsonString.map( (ele, index) => {
      return {
        id: ele.keyId,
        title: ele.name,
        description: ele.keyInfo,
        keyStatus: ele.keyStatus,
        level: (typeof ele.level === 'undefined' ? null : ele.level ),
        version: ele.version,
        keyWeb: ele.keyWeb,
        icon: (typeof ele.keyImage === 'undefined' ? null : ele.keyImage ),
        keyImageInfo: (typeof ele.keyImageInfo === 'undefined' ? null : ele.keyImageInfo ),
      };
    }));
  }

  /**
   * JSON parser for single Key with content
   * @param {object} keyJsonString object of key data from api
   * @return {Promise}
   */
  async keyJSONParser(keyJsonString) {
    return new Promise ((resolve, reject) =>{
      let r = {
        id: keyJsonString.keyId,
        title: keyJsonString.name,
        description: keyJsonString.keyInfo,
        keyStatus: keyJsonString.keyStatus,
        level: (typeof keyJsonString.level === 'undefined' ? null : keyJsonString.level ),
        author: (typeof keyJsonString.author === 'undefined' ? null : keyJsonString.author ),
        version: keyJsonString.version,
        keyWeb: keyJsonString.keyWeb,
        icon: (typeof keyJsonString.keyImage === 'undefined' ? null : keyJsonString.keyImage ),
        keyImageInfo: (typeof keyJsonString.keyImageInfo === 'undefined' ? null : keyJsonString.keyImageInfo ),
        content: {
          species: keyJsonString.species,
          trait: keyJsonString.trait,
          value: keyJsonString.value,
          spHasValue: keyJsonString.spHasValue,
          image: (typeof keyJsonString.image === 'undefined' || keyJsonString.image === null ? [] :
            keyJsonString.image.map((ele, index) => {
              return {
                image: (ele.image.split('/').pop()),
                imageWeb: ele.image,
                imageId: ele.imageId,
                keyId: ele.keyId,
                type: ele.type,
                typeId: ele.typeId,
              };
            })
          ),
          traitEliminate: (typeof keyJsonString.traitEliminate === 'undefined' ? [] : keyJsonString.traitEliminate ),
          traitHasSpecies: (typeof keyJsonString.traitHasSpecies === 'undefined' ? [] : keyJsonString.traitHasSpecies ),
        }
      };
      resolve(r);
    });
  }

}
