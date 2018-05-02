/**
 * @file ImageConfig.js
 * @author Kjetil Fossheim
 *
 * controller class for images, download and storage of images.
 */

import RNFetchBlob from 'react-native-fetch-blob';

/**
 * base directions for images
 * @type {String}
 */
const keyImgURL = '';
const speciesImgURL = '';
const valueImgURL = '';
const dirs = RNFetchBlob.fs.dirs.DocumentDir;
const keyThumbsDir = '/image/keyThumbs';
const keyInfoDir = '/image/keyInfo';
const valueDir = '/image/values';
const speciesDir = '/image/species';


export default class ImageConfig {


  /**
   * stores icons and other images for the Key itself, not species and values.
   * @param {object} keyObj selected key
   * @return {Promise}
   */
  saveKeyImages(keyObj) {
    let promises = [];
    if (keyObj.icon !== null ) {
      let url = keyObj.icon.replace(String.fromCharCode(92), '');
      promises.push(new Promise( (resolve, reject) => {
        RNFetchBlob
          .config({
            path : dirs + '/' + keyObj.id + keyThumbsDir + '/t' + keyObj.id + '.png'
          })
          .fetch('GET', url, {
          })
          .then((res) => {
            resolve(res);
          })
          .catch((err) => {
            reject(err);
          });
      }));
    }
    if (keyObj.keyImageInfo !== null ) {
      let url = keyObj.keyImageInfo.replace(String.fromCharCode(92), '');
      promises.push(new Promise( (resolve, reject) => {
        RNFetchBlob
          .config({
            path : dirs + '/' + keyObj.id + keyInfoDir + '/i' + keyObj.id + '.png'
          })
          .fetch('GET', url, {
          })
          .then((res) => {
            resolve(res);
          })
          .catch((err) => {
            reject(err);
          });
      }));
    }
    return new Promise.all(promises);
  }


  /**
   * Stores content images as species and value images.
   * @param {Object} images Object containing all content images
   * @return {Promise} promises of all stored images
   */
  saveContaintInmages(images) {
    let retList = images.map((img, index)=>{
      if (img.type === 's') {
        return RNFetchBlob
          .config({
            path : dirs + '/' + img.keyId + speciesDir + '/s' + img.typeId + img.image
          })
          .fetch('GET', img.imageWeb, {
          })
          .then((res) => {
          })
          .catch((err) => {
          });
      }
      else if (img.type === 'v') {
        return RNFetchBlob
          .config({
            path : dirs + '/' + img.keyId + valueDir + '/v' + img.typeId + img.image
          })
          .fetch('GET', img.imageWeb, {
          }).then((res) => {
          })
          .catch((err) => {
          });
      }
      return false;
    });
    return new Promise.all(retList);
  }


  // not in use
  static saveSpeciesImages(species) {
    let url = speciesImgURL + species.id;
    return new Promise.all(()=>{
      return species.names.map((img, index)=>{
        return RNFetchBlob
          .config({
            path : dirs + '/' + keyObj.id + speciesDir + '/s' + species.id + img
          })
          .fetch('GET', url, {
          });
      });
    });
  }

  // not in use
  static saveValueImages(values) {
    let url = speciesImgURL + values.id;
    return new Promise.all(()=>{
      return values.names.map((img, index)=>{
        return RNFetchBlob
          .config({
            path : dirs + '/' + keyObj.id + speciesDir + '/v' + values.id + img
          })
          .fetch('GET', url, {
          });
      });
    });
  }


  static getkeyThumbs(keyId) {
    return dirs + '/' + keyId + keyThumbsDir + '/t' + keyId + '.png';
  }
  // takes in {id: , name: }
  static getValueImg(valueImg) {
    return dirs + '/' + valueImg.keyId + valueDir + '/v' + valueImg.id + valueImg.name;
  }
  static getInfoImg(keyId) {
    return dirs + '/' + keyId + keyInfoDir + '/i' + keyId + '.png';
  }
  // takes in {id: , name: }
  static getSingleSpeciesImg(SpeciesImg) {
    return dirs + '/' + SpeciesImg.keyId + speciesDir + '/s' + SpeciesImg.id + SpeciesImg.name;
  }
  // takes in {id: , names: []}
  static getSpeciesImg(SpeciesImg) {
    return SpeciesImg.names.map((img, index) => {
      return dirs + '/' + SpeciesImg.keyId + speciesDir + '/s' + SpeciesImg.id + img;
    });
  }

  deleteImagesToKey(key_id) {
    return Promise.all([
      RNFetchBlob.fs.unlink(ImageConfig.getInfoImg(key_id)),
      RNFetchBlob.fs.unlink(ImageConfig.getkeyThumbs(key_id)),
      RNFetchBlob.fs.unlink(dirs + '/' + key_id)
    ]);
  }

  deleteImagesToKeyData(key_id) {
    return Promise.all([
      RNFetchBlob.fs.unlink(dirs + '/' + key_id + speciesDir),
      RNFetchBlob.fs.unlink(dirs + '/' + key_id + valueDir)
    ]);
  }


}
