/**
 * @file DB_helper.js
 * @author Kjetil Fossheim
 *
 * Helper controller for all database calls.
 */

import SQLite from 'react-native-sqlite-storage';
import * as URLs from '../nettwork/URLs';
const database_name = 'AAdb.db';
const database_version = 2;
const database_displayname = 'SQLite ArtsApp Database';
const database_size = 2000000;
import ImageConfig from '../nettwork/ImageConfig';

export default class DB_helper {

  constructor() {
    this.db = SQLite.openDatabase(this.getDbName(), this.getDbVersion(), this.getDbDisplayName(), this.getDbSize(), this.openCB, this.errorCB);
    SQLite.DEBUG(false); // set database debug, false in release
  }



  /**
                    Functions for config of DB
                    ####################################
  */
  getDbName() {
    return database_name;
  };

  getDbVersion() {
    return database_version;
  };


  getDbDisplayName() {
    return database_displayname;
  };

  getDbSize() {
    return database_size;
  };

  static closeCB() {
  }

  static openCB() {
  }
  static closeCB() {
  }

  static errorCB(err) {
    return false;
  }

  dbDeleted() {
  }

  deleteDatabase() {
    SQLite.deleteDatabase(database_name, this.dbDeleted, this.errorCB);
  }

  closeDatabase() {
    if (this.db) {
      this.db.close(this.closeCB,this.errorCB);
    }
    else {
    }
  }

  /**
   * Tests database, that it exists, and it is the lates version. Initiate database if app is newly installed, and Updates DB if necessary.
   * @see this.updateDB
   * @see this.updateLastUpdate
   * @see this.populateDB
   * @return {void}
   */
  testDatabase() {
    return new Promise((resolve, reject) => {
      this.db.executeSql('SELECT * FROM Settings ', [],(res) => {
        if(typeof res.rows.raw()[0] === 'undefined') {
          this.updateDB({force: true}).then((value) => {
            this.updateLastUpdate().then(resolve());
          })
          .catch((err) => {
            resolve();
          });
        }
        else {
          if (res.rows.raw()[0].version_id < database_version) {
            this.updateDB({old_version: res.rows.raw()[0].version_id}).then((value) => {
              resolve();
            });
          }
          else if (res.rows.raw()[0].version_id === database_version) {
            resolve();
          }
          else {
            resolve();
          }
        }
      }, (err) => {
        this.populateDB()
        .then((value) => {
          resolve();
        })
        .catch((err) => {
          reject();
        });
      });
    });
  };

  /**
   * Updates database to last version.
   * @arg {Object} * containing information about updates.
   * @return {Promise} promise of update complete.
   */
  updateDB() {
    let arg = arguments[0];
    return new Promise((resolve, reject) => {
      if (arg.old_version === 1 || arg.force) {
        this.db.executeSql('CREATE TABLE IF NOT EXISTS traitHasSP( '
            + '_id INTEGER PRIMARY KEY NOT NULL, '
            + 'trait_id INTEGER NOT NULL, '
            + 'species_id INTEGER NOT NULL, '
            + 'key_id INTEGER, '
            + 'FOREIGN KEY ( species_id ) REFERENCES Species ( species_id ), '
            + 'FOREIGN KEY ( trait_id ) REFERENCES Trait ( trait_id ), '
            + 'FOREIGN KEY ( key_id ) REFERENCES Key ( key_id ) ON DELETE CASCADE ) ; ', [], () =>{
              resolve();
            }, (e) => {
              reject(e);
            });
      }
      else if (arg.old_version === 2 || arg.force) {
        resolve();
      }
    });
  }

  /**
   * Drops all tables
   * @param {Object} tx database to use.
   * @return {void}
   */
  static droptables(tx) {

    tx.executeSql('DROP TABLE IF EXISTS Settings;');
    tx.executeSql('DROP TABLE IF EXISTS traitHasSP;');
    tx.executeSql('DROP TABLE IF EXISTS Species;');
    tx.executeSql('DROP TABLE IF EXISTS SpHasValue;');
    tx.executeSql('DROP TABLE IF EXISTS Key;');
    tx.executeSql('DROP TABLE IF EXISTS Trait;');
    tx.executeSql('DROP TABLE IF EXISTS Value;');
    tx.executeSql('DROP TABLE IF EXISTS Image;');
    tx.executeSql('DROP TABLE IF EXISTS Observation;');
    tx.executeSql('DROP TABLE IF EXISTS Distrubution;');
    tx.executeSql('DROP TABLE IF EXISTS traitHasSP;');
  };

  /**
   * Initiate database if app is newly installed.
   * @param {[type]} successCB success function, not in use because of use of promise instead
   * @param {[type]} errorCB   error function, not in use because of use of promise instead
   * @return {Promise} Resolves promise if DB transaction is successful.
   */
  populateDB(successCB, errorCB) {
    return new Promise((resolve, reject) => {
      this.db.transaction(()=>{
        this.db.executeSql('CREATE TABLE IF NOT EXISTS Settings( '
            + 'version_id INTEGER PRIMARY KEY NOT NULL, '
            + 'lastUpdate DATETIME DEFAULT CURRENT_TIMESTAMP ); ', [], successCB, errorCB);

        this.db.executeSql('CREATE TABLE IF NOT EXISTS Key( '
            + 'key_id INTEGER PRIMARY KEY NOT NULL, '
            + 'title TEXT, '
            + 'keyInfo TEXT, '
            + 'keyStatus TEXT, '
            + 'level TEXT, '
            + 'author TEXT, '
            + 'version INTEGER, '
            + 'image INTEGER DEFAULT 1,'
            + 'keyDownloaded INTEGER DEFAULT 0, '
            + 'updateTrigger INTEGER DEFAULT 0, '
            + 'keyWeb TEXT ); ', [], successCB, errorCB);

        this.db.executeSql('CREATE TABLE IF NOT EXISTS Species( '
            + 'species_id INTEGER PRIMARY KEY NOT NULL, '
            + 'latinName TEXT, '
            + 'localName TEXT, '
            + 'speciesText TEXT, '
            + 'spOrder TEXT, '
            + 'family TEXT, '
            + 'distributionLocal TEXT, '
            + 'distributionCountry TEXT, '
            + 'key_id INTEGER, '
            + 'spesialKey INTEGER DEFAULT 0); '
            + 'FOREIGN KEY ( key_id ) REFERENCES Key ( key_id ) ON DELETE CASCADE; ', [], successCB, errorCB);

        this.db.executeSql('CREATE TABLE IF NOT EXISTS Trait( '
            + 'trait_id INTEGER PRIMARY KEY NOT NULL, '
            + 'traitText TEXT, '
            + 'important INTEGER DEFAULT 0, '
            + 'key_id INTEGER, '
            + 'FOREIGN KEY ( key_id ) REFERENCES Key ( key_id ) ON DELETE CASCADE ) ; ', [], successCB, errorCB);

        this.db.executeSql('CREATE TABLE IF NOT EXISTS Value( '
            + 'value_id INTEGER PRIMARY KEY NOT NULL, '
            + 'valueText TEXT, '
            + 'valueInfo TEXT, '
            + 'trait_id INTEGER, '
            + 'key_id INTEGER, '
            + 'FOREIGN KEY ( trait_id ) REFERENCES Trait ( trait_id ), '
            + 'FOREIGN KEY ( key_id ) REFERENCES Key ( key_id ) ON DELETE CASCADE ) ; ', [], successCB, errorCB);

        this.db.executeSql('CREATE TABLE IF NOT EXISTS SpHasValue( '
            + 'spHasValue_id INTEGER PRIMARY KEY NOT NULL, '
            + 'species_id INTEGER, '
            + 'value_id INTEGER, '
            + 'key_id INTEGER, '
            + 'FOREIGN KEY ( species_id ) REFERENCES Species ( species_id ), '
            + 'FOREIGN KEY ( value_id ) REFERENCES Value ( value_id ), '
            + 'FOREIGN KEY ( key_id ) REFERENCES Key ( key_id ) ON DELETE CASCADE ) ; ', [], successCB, errorCB);


        this.db.executeSql('CREATE TABLE IF NOT EXISTS Image( '
            + 'image_id INTEGER PRIMARY KEY NOT NULL, '
            + 'type TEXT NOT NULL, '
            + 'typeId INTEGER, '
            + 'img TEXT NOT NULL, '
            + 'key_id INTEGER, '
            + 'FOREIGN KEY ( key_id ) REFERENCES Key ( key_id ) ON DELETE CASCADE ) ; ', [], successCB, errorCB);

        this.db.executeSql('CREATE TABLE IF NOT EXISTS TraitEliminate( '
            + 'traitEliminate_id INTEGER PRIMARY KEY NOT NULL, '
            + 'trait_id INTEGER, '
            + 'value_Id TEXT NOT NULL, '
            + 'key_id INTEGER, '
            + 'FOREIGN KEY ( trait_id ) REFERENCES Trait ( trait_id ), '
            + 'FOREIGN KEY ( value_id ) REFERENCES Value ( value_id ), '
            + 'FOREIGN KEY ( key_id ) REFERENCES Key ( key_id ) ON DELETE CASCADE ) ; ', [], successCB, errorCB);

        this.db.executeSql('CREATE TABLE IF NOT EXISTS NerbyObservation( '
          + 'nerbyObservation_id INTEGER PRIMARY KEY NOT NULL, '
          + 'species_id INTEGER NOT NULL, '
          + 'obsSmall INTEGER NOT NULL, '
          + 'obsMedium INTEGER NOT NULL, '
          + 'obsLarge INTEGER NOT NULL, '
          + 'obsCounty INTEGER NOT NULL, '
          + 'key_id INTEGER NOT NULL, '
          + 'FOREIGN KEY ( species_id ) REFERENCES Species ( species_id )'
          + 'FOREIGN KEY ( key_id ) REFERENCES Key ( key_id ) ON DELETE CASCADE ) ; ', [], successCB, errorCB);

        this.db.executeSql('CREATE TABLE IF NOT EXISTS ObsUpdateLocation( '
          + 'obsUpdateLocation_id INTEGER PRIMARY KEY NOT NULL, '
          + 'locLat TEXT NOT NULL, '
          + 'locLong TEXT NOT NULL, '
          + 'place TEXT, '
          + 'county TEXT, '
          + 'municipality TEXT, '
          + 'dateTime DATETIME DEFAULT CURRENT_TIMESTAMP) ; ', [], successCB, errorCB);


        this.db.executeSql('CREATE TABLE IF NOT EXISTS UserObservation( '
          + 'userObservation_id INTEGER PRIMARY KEY NOT NULL, '
          + 'latinName TEXT, '
          + 'localName TEXT, '
          + 'spOrder TEXT, '
          + 'family TEXT, '
          + 'species_id TEXT, '
          + 'latitude TEXT NOT NULL, '
          + 'longitude TEXT NOT NULL, '
          + 'place TEXT, '
          + 'county TEXT, '
          + 'municipality TEXT, '
          + 'key_id INTEGER NOT NULL, '
          + 'obsDateTime DATETIME DEFAULT CURRENT_TIMESTAMP) ; '
          + 'FOREIGN KEY ( key_id ) REFERENCES Key ( key_id )) ; ', [], successCB, errorCB);

        this.db.executeSql('CREATE TABLE IF NOT EXISTS traitHasSP( '
            + '_id INTEGER PRIMARY KEY NOT NULL, '
            + 'trait_id INTEGER NOT NULL, '
            + 'species_id INTEGER NOT NULL, '
            + 'key_id INTEGER, '
            + 'FOREIGN KEY ( species_id ) REFERENCES Species ( species_id ), '
            + 'FOREIGN KEY ( trait_id ) REFERENCES Trait ( trait_id ), '
            + 'FOREIGN KEY ( key_id ) REFERENCES Key ( key_id ) ON DELETE CASCADE ) ; ', [], successCB, errorCB);

        this.db.executeSql('INSERT INTO Settings VALUES (' + database_version + ', CURRENT_TIMESTAMP );', [],
            () => {
            }, (e) => {
            });
      }, (err) => {
        reject(err);
      }, (value) => {
        resolve(value);
      });
    });
  };

  /**
                    Functions for inserting data into DB.
                    ####################################
  */


  /**
   * Updates timestamp of last update.
   * @return {Promise}
   */
  updateLastUpdate() {
    let v = 1;
    if (database_version !== 1) {
      v = database_version;
    }
    return new Promise ((resolve, reject) => {
      this.db.executeSql('UPDATE Settings SET version_id = ?, lastUpdate =  CURRENT_TIMESTAMP  WHERE version_id = ?;', [database_version, v ],
    () => {
      resolve();
    },
    (e) => {
      reject(e);
    });
    });
  }

  /**
   * Stores the key info without any key data to the database.
   * @param {Object} key        The Key to be inserted.
   * @param {boolean} downloaded Is the key downloaded.
   * @return {Promise}
   */
  insertKeysSheel(key, downloaded) {
    let im = 1;
    if(key.keyImageInfo === null) {
      im = 0;
    }
    return new Promise((resolve, reject) => {
      webnavn = 'null';
      if (typeof key.keyWeb !== 'undefined') {
        webnavn = key.keyWeb;
      }
      this.db.executeSql('INSERT INTO Key VALUES (?,?,?,?,?,?,?,?,?,?,?);', [key.id, key.title, key.description, key.keyStatus, key.level, key.author, key.version, im, (downloaded ? 1 : 0), 0, webnavn ], () => {
        resolve();
      },
      (e) => {
        if (e.message.substring(0, 6) === 'UNIQUE') {
          resolve();
        }
        else {
          reject(e);
        }
      });
    });
  }

  /**
   * Update key info
   * @param {Object} key        The Key to be updated.
   * @param {boolean} downloaded Is the key downloaded.
   * @return {Promise}
   */
  updateKey(key, downloaded) {
    return new Promise((resolve, reject) => {
      webnavn = 'null';
      if (typeof key.keyWeb !== 'undefined') {
        webnavn = key.keyWeb;
      }
      this.db.executeSql('UPDATE Key SET title = ?, keyInfo = ?, keyStatus = ?, level = ?, author = ?, version = ?, keyDownloaded = ?, keyWeb = ? '
      + 'WHERE key_id = ? ', [key.title, key.description, key.keyStatus, key.level, key.author, key.version, (downloaded ? 1 : 0), webnavn, key.key_id ], () => {
        resolve();
      },
      (e) => {
        reject();
      });
    });
  }

  /**
   * Fetch numbers of nearby observations from api, and store them to DB.
   * @see this.insertnerbyObservation
   * @param {array} keys      keys to get observations for.
   * @param {double} latitude  latitude
   * @param {double} longitude longitude
   * @return {Promise} Resolves promise if DB transaction is successful.
   */
  fethObservationNumbers(keys, latitude, longitude) {
    let promises = keys.map((key, index) => {
      return new Promise((res, rej) => {
        fetch(URLs.OCCURENCE_BASE + key.keyWeb + '?lon=' + longitude + '&lat=' + latitude)
        .then((response) => response.json())
        .then((responseJson) => {
          this.deleteObservationNumbers(key.key_id)
          .then( () =>{
            this.db.transaction( () =>{
              if (typeof responseJson.arter !== 'undefined') {
                for (let i = 0; i < responseJson.arter.length; i++) {
                  if (responseJson.arter[i].speciesId !== null) {
                    this.insertnerbyObservation({
                      species_id: responseJson.arter[i].speciesId,
                      obsSmall: responseJson.arter[i].Counts.small,
                      obsMedium: responseJson.arter[i].Counts.medium,
                      obsLarge: responseJson.arter[i].Counts.large,
                      obsCounty:  responseJson.arter[i].Counts.fylke,
                      key_id: key.key_id
                    });
                  }
                }
              }
              else {
                rej('err_null_sp');
              }
            }, (err) => {
              rej(err);
            }, (value) => {
              res(value);
            });
          });
        })
        .catch((err) => {
          rej(err);
        });
      });
    });
    return Promise.all(promises);
  }


  /**
   * Inserts nearby observation
   * @param {Object} nerbyObservation observation to be inserted
   * @return {Promise}
   */
  insertnerbyObservation(nerbyObservation) {
    return new Promise((resolve, reject) => {
      this.db.executeSql('INSERT INTO NerbyObservation (species_id, obsSmall, obsMedium, obsLarge, obsCounty, key_id ) '
      + 'VALUES (?,?,?,?,?,?);', [
        nerbyObservation.species_id,
        nerbyObservation.obsSmall,
        nerbyObservation.obsMedium,
        nerbyObservation.obsLarge,
        nerbyObservation.obsCounty,
        nerbyObservation.key_id ], () => {
          resolve();
        }, (e) => {
          reject(e);
        });
    });
  }


  /**
   * Sets/or removes i trigger on the key that there is an update for the keydata.
   * @param {Integer}  keyId     id of the key to be updated.
   * @param {Boolean} isUpdated true if the trigger is to be removed.
   * @return {Promise}
   */
  setUpdateTrigger(keyId, isUpdated) {
    if (isUpdated) {
      return new Promise((resolve, reject) => {
        this.db.executeSql('UPDATE Key SET updateTrigger = 0 WHERE key_id = ? ;',[keyId], () => {
          resolve();
        },
        (e) => {
          reject();
        });
      });
    }
    return new Promise((resolve, reject) => {
      this.db.executeSql('UPDATE Key SET updateTrigger = 1 WHERE key_id = ? ;',[keyId], () => {
        resolve();
      },
      (e) => {
        reject();
      });
    });
  }

  /**
   * Insert Key data for selected key. Also updates the Key info, and sets downloaded on selected key to TRUE
   * @see this.insertSpecies
   * @see this.insertTrait
   * @see this.insertValue
   * @see this.spHasValue
   * @see this.insertImage
   * @see this.insertTraitHasSP
   * @see this.insertTraitEliminate
   * @param {Object} key Key object to be inserted to DB.
   * @return {Promise}
   */
  insertKey(key) {
    return new Promise ((resolve, reject) =>{
      this.db.transaction(() => {
        for (let i = 0; i < key.content.species.length; i++) {
          this.insertSpecies(key.content.species[i]);
        }
        for (let i = 0; i < key.content.trait.length; i++) {
          this.insertTrait(key.content.trait[i]);
        }
        for (let i = 0; i < key.content.value.length; i++) {
          if (key.content.value[i].valueText !== null) {
            this.insertValue(key.content.value[i]);
          }
        }
        for (let i = 0; i < key.content.spHasValue.length; i++) {
          this.spHasValue(key.content.spHasValue[i]);
        }
        for (let i = 0; i < key.content.image.length; i++) {
          this.insertImage(key.content.image[i]);
        }
        for (let i = 0; i < key.content.traitEliminate.length; i++) {
          this.insertTraitEliminate(key.content.traitEliminate[i]);
        }
        for (let i = 0; i < key.content.traitHasSpecies.length; i++) {
          this.insertTraitHasSP(key.content.traitHasSpecies[i]);
        }
      },
      (e) => {
        reject();
      }, () => {
        this.db.transaction(()=> {

          this.db.executeSql('UPDATE Key SET key_id = ?, title = ?, keyInfo = ?, keyStatus = ?, level = ?, author = ?, version = ?, keyDownloaded = ?  '
          + 'WHERE keyWeb = ? ', [key.id, key.title, key.description, key.keyStatus, key.level, key.author, key.version, 1 , key.keyWeb]);
        },
        (e) => {
          reject();
        }, ()=>{
          resolve();
        });
      });
    });
  }

  /**
   * inserts species
   * @param {Object} sp Species object
   * @return {Promise} [description]
   */
  insertSpecies(sp) {
    this.db.executeSql('INSERT INTO Species (species_id, latinName, localName, speciesText, spOrder, family, distributionLocal, distributionCountry, key_id, spesialKey) '
    + 'VALUES (?,?,?,?,?,?,?,?,?,?);', [sp.speciesId, sp.latinName, sp.localName, sp.speciesText, sp.order, sp.family, sp.distributionLocal, sp.distributionCountry, sp.keyId, sp.spesialKey], () => {
    },
    (e) => {
    });
  }

  /**
   * inserts trait
   * @param {Object} trait Trait object
   * @return {Promise} [description]
   */
  insertTrait(trait) {
    this.db.executeSql('INSERT INTO Trait (trait_id, traitText, important, key_id) '
    + 'VALUES (?,?,?,?);', [trait.traitId, trait.traitText, trait.important, trait.keyId,], () => {
    },
    (e) => {
    });
  }

  /**
   * inserts value
   * @param {[type]} value Value object
   * @return {Promise} [description]
   */
  insertValue(value) {
    this.db.executeSql('INSERT INTO Value (value_id, valueText, valueInfo, trait_id, key_id) '
    + 'VALUES (?,?,?,?,?);', [value.valueId, value.valueText, value.valueInfo, value.traitId, value.keyId,], () => {
    },
    (e) => {
    });
  }

  /**
   * insert spHasValue (species has value)
   * @param {Object} spHV spHasValue (species has value) object
   * @return {Promise} [description]
   */
  spHasValue(spHV) {
    this.db.executeSql('INSERT INTO SpHasValue (spHasValue_id, species_id, value_id, key_id) '
    + 'VALUES (?,?,?,?);', [spHV.spHasValueId, spHV.spId ,spHV.valueId , spHV.keyId ], () => {
    },
    (e) => {
    });
  }

  /**
   * inserts image  name to DB
   * @param {Object} image Image object, type v or s (v= value, s = species)
   * @return {Promise} [description]
   */
  insertImage(image) {
    this.db.executeSql('INSERT INTO Image (image_id, type, typeId, img, key_id ) '
    + 'VALUES (?,?,?,?,?);', [image.imageId , image.type , image.typeId , image.image, image.keyId ], () => {
    },
    (e) => {
    });
  }

  /**
   * inserts traitEliminate to database. ()
   * @param {Object} trEl traitEliminate object
   * @return {Promise} [description]
   */
  insertTraitEliminate(trEl) {
    this.db.executeSql('INSERT INTO TraitEliminate (trait_id, value_Id, key_id) '
    + 'VALUES (?,?,?);', [trEl.traitId ,trEl.valueId , trEl.keyId ], () => {
    },
    (e) => {
    });
  }

  /**
   * inserts TraitHasSP (Trait has species)
   * @param {Object} trSP TraitHasSP object
   * @return {Promise} [description]
   */
  insertTraitHasSP(trSP) {
    this.db.executeSql('INSERT INTO traitHasSP (trait_id, species_id, key_id) '
    + 'VALUES (?,?,?);', [trSP.traitId ,trSP.species_id , trSP.keyId ], () => {
    },
    (e) => {
    });
  }

  /**
   * inserts new user observation
   * @param {Object} observation User observation object
   * @return {Promise} [description]
   */
  insertNewObservation(observation) {
    let tempDateTime = observation.obsDateTime;
    if (observation.obsDateTime === '' || observation.obsDateTime === null ) {
      tempDateTime = new Date().toJSON();
    }
    return new Promise((resolve, reject)=>{
      this.db.executeSql('INSERT INTO UserObservation ( latinName, localName, spOrder, family, species_id, latitude, longitude, place, county, key_id, obsDateTime) '
      + 'VALUES (?,?,?,?,?,?,?,?,?,?,? )', [observation.latinName, observation.localName, observation.order, observation.family, observation.species_id,
        observation.latitude, observation.longitude, observation.place, observation.county, observation.key_id, tempDateTime], () => {
          resolve();
        }, (e) => {
          reject(e);
        });
    });
  }



  /**
                    Functions for getting data from DB.
                    ####################################
  */


  /**
   * gets all value images to selected key from db, and sort them to each value.
   * @param {Integer} keyId id of selected key
   * @return {Promise} with Map of all value images ret = map -> {vlaueId: [image urls]}
   */
  getValueImagestoKey(keyId) {
    return new Promise((resolve, reject)=>{
      this.db.executeSql('SELECT * FROM Image '
      + 'WHERE key_id = ? '
      + 'AND type =? '
      + 'ORDER BY typeId ', [keyId, 'v'], (result) => {
        templist =  result.rows.raw().map( (ele, index) => {
          return {
            typeId: ele.typeId,
            img: ImageConfig.getValueImg({id: ele.typeId, name: ele.img, keyId: ele.key_id}),
          };
        });
        ret = new Map();
        tempObj = {
          typeId: null,
          images: [],
        };
        for (let i = 0; i < templist.length; i++) {
          if (templist[i].typeId === tempObj.typeId  || tempObj.typeId === null) {
            tempObj.typeId = templist[i].typeId;
            tempObj.images.push(templist[i].img);
          }
          else {
            ret.set(tempObj.typeId, tempObj.images);
            tempObj.typeId = templist[i].typeId;
            tempObj.images = [];
            tempObj.images.push(templist[i].img);
            ret.set(tempObj.typeId, tempObj.images);
          }
        }
        resolve(ret);
      }, (e) => {
        reject(e);
      });
    });
  }

  /**
  * gets all Species images to selected key from db, and sort them to each species.
  * @param {Integer} keyId id of selected key
  * @return {Promise} with Map of all species images ret = map -> {speciesId: [image urls]}
   */
  getAllSpImagestoKey(keyId) {
    return new Promise((resolve, reject)=>{
      this.db.executeSql('SELECT * FROM Image '
      + 'WHERE key_id = ? '
      + 'AND type =? '
      + 'ORDER BY typeId ', [keyId, 's'], (result) => {
        templist =  result.rows.raw().map( (ele, index) => {
          return {
            typeId: ele.typeId,
            img: ImageConfig.getSingleSpeciesImg({id: ele.typeId, name: ele.img, keyId: ele.key_id}),
          };
        });
        ret = new Map();
        tempObj = {
          typeId: null,
          images: [],
        };
        for (let i = 0; i < templist.length; i++) {
          if (templist[i].typeId === tempObj.typeId  || tempObj.typeId === null) {
            tempObj.typeId = templist[i].typeId;
            tempObj.images.push(templist[i].img);
          }
          else {
            ret.set(tempObj.typeId, tempObj.images);
            tempObj.typeId = templist[i].typeId;
            tempObj.images = [];
            tempObj.images.push(templist[i].img);
            ret.set(tempObj.typeId, tempObj.images);
          }
        }
        resolve(ret);
      }, (e) => {
        reject(e);
      });
    });
  }


  /**
   * gets all user getObservations
   * @return {Promise} array of user observations
   */
  getObservations() {
    return new Promise((resolve, reject)=>{
      this.db.executeSql('SELECT * FROM UserObservation ', [], (result) => {
        resolve(result.rows);
      }, (e) => {
        reject(e);
      });
    });
  }


  /**
   * Revives combinations of trait and values with trait eliminate list and species to trait list.
   * @param {Integer} keyId id of selected key to retrieve trait/value combos for
   * @return {Promise} array of Trait/Value combos
   */
  getTraitValuecombo(keyId) {
    return new Promise((resolve, reject)=>{
      this.db.executeSql('SELECT * FROM Trait WHERE key_id=? ', [keyId], (traitRet)=>{
        traits = traitRet.rows.raw();
        const promises = traits.map((trait, index) => {
          return Promise.all([this.getValueToTrait(keyId, trait.trait_id), this.getTraitElim(trait.trait_id), this.getSpeciesToTrait(trait.trait_id)])
          .then( results => {
            trait.values = results[0];
            trait.eliminate = results[1];
            trait.speciesToTrait = results[2];
            return trait;
          },
            error => {
              reject();
            });
        });
        Promise.all(promises)
        .then( listOfpromises => {
          resolve(listOfpromises);
        });
      },
      (e)=> {
        reject(e);
      });
    });
  }

  /**
   * gets all Species to trait from DB
   * @return {Promise} array of species IDs
   */
  getSpeciesToTrait(keyId, trait_id) {
    return new Promise((resolve, reject)=>{
      this.db.executeSql('SELECT species_id FROM traitHasSP WHERE key_id=? AND trait_id =?', [keyId, trait_id], (ret)=> {
        resolve(ret.rows.raw());
      }, (e)=> {
        reject(e);
      });
    });
  }

  /**
   * gets all values to trait from DB
   * @param {Integer} keyId    Id of selected KEY
   * @param {Integer} trait_id  Id of selected trait
   * @return {Promise} Promise with array of values
   */
  getValueToTrait(keyId, trait_id) {
    return new Promise((resolve, reject)=>{
      this.db.executeSql('SELECT * FROM Value WHERE key_id=? AND trait_id =?', [keyId, trait_id], (valueRet)=> {
        resolve(valueRet.rows.raw());
      }, (e)=> {
        reject(e);
      });
    });
  }

  /**
   * Retrieves a list of values that eliminates trait.
   * @param {Integer} trait_id selected trait.
   * @return {Promise} Resolves with an array of value ID
   */
  getTraitElim(trait_id) {
    return new Promise((resolve, reject)=>{
      this.db.executeSql('SELECT value_Id FROM TraitEliminate '
      + ' WHERE trait_id = ?', [trait_id], (result) => {
        ret =  result.rows.raw().map( (value, index) => {
          return parseInt(value.value_Id);
        });
        resolve(ret);
      }, (e) => {
        reject(e);
      });
    });
  }


  getKeyDetails(keyId) {
    return new Promise((resolve, reject)=>{
      this.db.executeSql('SELECT * FROM Key '
      + 'WHERE key_id=? ', [keyId], (result) => {
        resolve(result.rows.raw());
      }, (e) => {
        reject(e);
      });
    });
  }

  /**
   * get all keys
   * @return {Promise} resolve an array of keys
   */
  getKeys() {
    return new Promise((resolve, reject)=>{
      this.db.executeSql('SELECT * FROM Key ORDER BY title', [], (result) => {
        resolve(result.rows.raw());
      }, (e) => {
        reject(e);
      });
    });
  }

  /**
   * get all downloaded keys
   * @return {Promise} resolve an array of keys
   */
  getDownloadedKeys() {
    return new Promise((resolve, reject)=>{
      this.db.executeSql('SELECT * FROM Key '
      + 'WHERE keyDownloaded = 1 ORDER BY title', [], (result) => {
        resolve(result.rows.raw());
      }, (e) => {
        reject(e);
      });
    });
  }

  /**
   * get all species to a selected key, also gives each species a list of values that species has.
   * @param {Integer} keyId id of selected key
   * @return {Promise} resolve an array of species
   */
  getSpeciesFromDb(keyId) {
    return new Promise((resolve, reject)=>{
      this.db.executeSql('SELECT * FROM Species '
      + ' WHERE key_id = ?', [keyId], (result) => {
        this.db.transaction( () =>{
          res = result.rows.raw();
          for (let i = 0; i < res.length; i++) {
            this.db.executeSql(' SELECT trait_id '
            + ' FROM Value AS v'
            + ' WHERE v.value_id IN ('
            + ' SELECT sv.value_id'
            + ' FROM SpHasValue AS sv'
            + ' WHERE sv.species_id = ? AND key_id = ?)'
            ,[res[i].species_id, keyId], (tr) => {
              res[i].traits = Array.from(new Set(tr.rows.raw().map((item)=> {
                return item.trait_id;
              })));
            });
            this.db.executeSql(' SELECT value_id'
            + ' FROM SpHasValue '
            + ' WHERE species_id = ? '
            ,[res[i].species_id], (ve) => {
              res[i].values = ve.rows.raw().map((item)=> {
                return item.value_id;
              });
            });
          }
        }, (err) => {
          reject(e);
        }, (value) => {
          resolve(result.rows.raw());
        });
      }, (e) => {
        reject(e);
      });
    });
  }

  /**
   * Retrieves list of species that has an given set of values.
   * @param {array} values selected value ID in an array
   * @param {Integer} keyId  key ID
   * @return {Promise} resolves an array of species
   */
  getSpeciesWithvalue(values, keyId) {
    return new Promise((resolve, reject)=>{
      qString = '(' + values.join(',') + ')';
      this.db.executeSql('SELECT s.species_id, s.latinName, s.localName, s.speciesText, s.spOrder, s.family, s.distributionLocal, s.distributionCountry,s.key_id, s.spesialKey'
      +  ' FROM Species AS s'
      +  ' WHERE s.species_id IN ('
        + ' SELECT sv.species_id'
        + ' FROM SpHasValue AS sv'
        + ' WHERE sv.value_id IN '
        + qString
        + ' AND sv.key_id = ?'
        + ' GROUP BY species_id'
        + ' HAVING count(species_id) = '
        + values.length
        + ' ) ', [keyId], (result) => {
          resolve(result.rows.raw());
        }, (e) => {
          reject(e);
        }
      );
    });
  }

  /**
   * retrieves numbers of nearby observations for selected key
   * @param {Integer} keyId id selected key
   * @return {Promise} resolves an array of NerbyObservation
   */
  getNerbyObservation(keyId) {
    return new Promise((resolve, reject)=>{
      this.db.executeSql('SELECT * FROM NerbyObservation WHERE key_id=? ', [keyId], (result) => {
        resolve(result.rows.raw());
      }, (e) => {
        reject(e);
      });
    });
  }


  /**
                    Functions for deleting data from DB.
                    ####################################
  */

  /**
   * Deletes nearby observation to selected key, used in updating of Nearby Observation.
   * @param {[Integer} keyId Id of selected Key
   * @return {Promise} Promise success for deleting all NerbyObservation
   */
  deleteObservationNumbers(keyId) {
    return new Promise((resolve, reject)=>{
      this.db.executeSql('DELETE FROM NerbyObservation'
      + ' WHERE key_id = ?', [keyId], () => {
        resolve();
      }, (e) => {
        reject(e);
      });
    });
  }

  /**
   * Deletes selected user observation.
   * @param {Integer} observationId Id of selected user observation.
   * @return {Promise} Promise success for deleting
   */
  deleteObservation(observationId) {
    return new Promise((resolve, reject)=>{
      this.db.executeSql('DELETE FROM UserObservation'
      + ' WHERE userObservation_id = ?', [observationId], () => {
        this.db.executeSql('SELECT * FROM UserObservation ', [], (result) => {
          resolve(result.rows);
        }, (e) => {
          reject(e);
        });
      }, (e) => {
        reject(e);
      });
    });
  }


  /**
   * Deletes the key totally from the database. Used to also delete the key-sheel, and not only the key data.
   * @param {Integer} keyID ID of the Key to delete.
   * @return {Promise} Promise success for deleting
   */
  deleteKey(keyID) {
    let ret = [];
    ret.push(new Promise((resolve, reject) => {
      this.db.executeSql('DELETE FROM Key'
      + ' WHERE key_id = ?', [keyID], () => {
        resolve();
      }, (e) => {
        reject(e);
      });
    }));
    ret.push(new Promise((resolve, reject) => {
      this.db.executeSql('DELETE FROM NerbyObservation'
      + ' WHERE key_id = ?', [keyID], () => {
        resolve();
      }, (e) => {
        reject(e);
      });
    }));
    ret.push(new Promise((resolve, reject) => {
      this.db.executeSql('DELETE FROM TraitEliminate'
      + ' WHERE key_id = ?', [keyID], () => {
        resolve();
      }, (e) => {
        reject(e);
      });
    }));
    ret.push(new Promise((resolve, reject) => {
      this.db.executeSql('DELETE FROM Image'
      + ' WHERE key_id = ?', [keyID], () => {
        resolve();
      }, (e) => {
        reject(e);
      });
    }));
    ret.push(new Promise((resolve, reject) => {
      this.db.executeSql('DELETE FROM SpHasValue'
      + ' WHERE key_id = ?', [keyID], () => {
        resolve();
      }, (e) => {
        reject(e);
      });
    }));
    ret.push(new Promise((resolve, reject) => {
      this.db.executeSql('DELETE FROM Value'
      + ' WHERE key_id = ?', [keyID], () => {
        resolve();
      }, (e) => {
        reject(e);
      });
    }));
    ret.push(new Promise((resolve, reject) => {
      this.db.executeSql('DELETE FROM Species'
      + ' WHERE key_id = ?', [keyID], () => {
        resolve();
      }, (e) => {
        reject(e);
      });
    }));
    ret.push(new Promise((resolve, reject) => {
      this.db.executeSql('DELETE FROM Trait'
      + ' WHERE key_id = ?', [keyID], () => {
        resolve();
      }, (e) => {
        reject(e);
      });
    }));
    return Promise.all(ret);
  }

  /**
   * Deletes the key data from the database. Used to delete only the key data, and not the key_sheel. It also sets the key keyDownloaded to FALSE(0)
   * @param {Integer} keyID ID of the Key to delete.
   * @return {Promise} Promise success for deleting
   */
  deleteKeyData(keyID) {
    let ret = [];
    ret.push(new Promise((resolve, reject) => {
      this.db.executeSql('DELETE FROM NerbyObservation'
      + ' WHERE key_id = ?', [keyID], () => {
        resolve();
      }, (e) => {
        reject(e);
      });
    }));
    ret.push(new Promise((resolve, reject) => {
      this.db.executeSql('DELETE FROM TraitEliminate'
      + ' WHERE key_id = ?', [keyID], () => {
        resolve();
      }, (e) => {
        reject(e);
      });
    }));
    ret.push(new Promise((resolve, reject) => {
      this.db.executeSql('DELETE FROM Image'
      + ' WHERE key_id = ?', [keyID], () => {
        resolve();
      }, (e) => {
        reject(e);
      });
    }));
    ret.push(new Promise((resolve, reject) => {
      this.db.executeSql('DELETE FROM SpHasValue'
      + ' WHERE key_id = ?', [keyID], () => {
        resolve();
      }, (e) => {
        reject(e);
      });
    }));
    ret.push(new Promise((resolve, reject) => {
      this.db.executeSql('DELETE FROM Value'
      + ' WHERE key_id = ?', [keyID], () => {
        resolve();
      }, (e) => {
        reject(e);
      });
    }));
    ret.push(new Promise((resolve, reject) => {
      this.db.executeSql('DELETE FROM Species'
      + ' WHERE key_id = ?', [keyID], () => {
        resolve();
      }, (e) => {
        reject(e);
      });
    }));
    ret.push(new Promise((resolve, reject) => {
      this.db.executeSql('DELETE FROM Trait'
      + ' WHERE key_id = ?', [keyID], () => {
        resolve();
      }, (e) => {
        reject(e);
      });
    }));
    ret.push(this.setUpdateTrigger(keyID, true));
    this.db.executeSql('UPDATE Key SET keyDownloaded = 0 WHERE key_id = ' + keyID + ';');
    return Promise.all(ret);
  }
};
