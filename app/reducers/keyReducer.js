// @flow weak
/**
 * @file keyReducer.js
 * @author Kjetil Fossheim
 */

import * as actionTypes from '../actions/actionTypes';


/**
 * DEFAULT_STATE has the collection of empty states in the keyReducer.
 *
 * state:
 * -test = debug state
 * -chosenKey = id of selected Key, default -1
 * -chosenKeyTitle = title of selected Key
 * -chosenValues = array of selected values in current key.
 * -chosenTraits = array of traits containing the selected values in current key.
 * -speciesLeft = array of all reminding species after chosenValues
 * -relevant: List of relevant traits for the remaining species.
 * -irelevant: List of irrelevant traits for the remaining species.
 * -speciesLeftLoading = loading flag, default false
 * -fullSpList = total species list for selected key
 * -traitValueCombo = array of all trait value combinations to current key
 * -keyDownloaded_SUCCESS = success flag, default false
 * -keyDownloaded_LOADING = loading flag, default false
 * -keys = list of all keys availablein the app
 * -key = object of one selected key
 * -valueImages = array of all value images in the key
 * -spesiecImageList = array of all species images in the key
 * -spTraits = list of all trait possible used by the reminding species
 * -spValues =list of all values possible used by the reminding species
 * -resetting = resetting flag, default false
 * @type {Object}
 */
const DEFAULT_STATE = {onLogging: false,
  test: -1,
  chosenKey: -1,
  chosenKeyTitle: '',
  chosenValues: [],
  chosenTraits: [],
  speciesLeft: [],
  relevant: [],
  irelevant: [],
  speciesLeftLoading: false,
  fullSpList: [],
  traitValueCombo: [],
  keyDownloaded_SUCCESS: false,
  keyDownloaded_LOADING: false,
  keys: [],
  key: '',
  valueImages: new Map(),
  spesiecImageList: new Map(),
  spTraits: [],
  spValues: [],
  resetting: false,
};

export default function(state = DEFAULT_STATE, actions) {
  switch(actions.type) {
  case actionTypes.TEST_ACTION_TYPE_ONE:
    return{...state,
      test: state.test + 1,
    };
  case actionTypes.ACTION_CHOSEN_KEY:
    return{...state,
      chosenKey: actions.chosenKey,
      chosenKeyTitle: actions.chosenKeyTitle
    };
  case actionTypes.ACTION_VALUE_CHANGE:
    return{...state,
      loading: true,
      chosenValues: actions.chosenValues,
      chosenTraits: actions.chosenTraits,
    };
  case `${actionTypes.ACTION_SP_LEFT}_LOADING`:
    return{...state,
      speciesLeftLoading: true,
    };
  case `${actionTypes.ACTION_SP_LEFT}_SUCCESS`:
    let temp = [];
    let ret = actions.payload.map((item) => {
      let i = _.findIndex(state.fullSpList, {species_id: item.species_id});
      temp = temp.concat(state.fullSpList[i].values);
      return state.fullSpList[i].traits;
    });
    ret =  Array.from(new Set([].concat.apply([],ret)));
    temp =  Array.from(new Set([].concat.apply([],temp)));
// ##########
    let traitList = state.traitValueCombo;
    let tempRel = [];
    let tempIRel = [];
    if (state.chosenTraits.length === 0) {
      tempRel = traitList;
    }
    else {
      for (let i = 0; i < traitList.length; i++) {
        let k = ret.findIndex((ele) =>{
          return ele === traitList[i].trait_id;
        });
        if (k !== -1 ) {
          tempRel.push(traitList[i]);
        }
        else {
          tempIRel.push(traitList[i]);
        }
      }
    }
// ##########
    return{...state,
      spTraits: ret,
      spValues: temp,
      relevant: tempRel,
      irelevant: tempIRel,
      speciesLeftLoading: false,
      speciesLeft: actions.payload
    };
  case `${actionTypes.ACTION_SP_LEFT}_ERROR`:
    return{...state,
      speciesLeft: [],
      speciesLeftLoading: false,
      speciesLeftError: actions.payload
    };
  case `${actionTypes.ACTION_FULL_SPECIES}_SUCCESS`:
    return {...state,
      fullSpList: actions.payload
    };
  case `${actionTypes.ACTION_FULL_SPECIES}_ERROR`:
    return{...state,
      fullSpList: [],
      fullSpListError: actions.payload
    };
  case actionTypes.ACTION_SELCTED_SP:
    return{...state,
      selectedSpecies: actions.selectedSpecies,
    };
  case `${actionTypes.ACTION_ALL_KEYS}_SUCCESS`:
    return{...state,
      keys: actions.payload,
      keyDownloaded_SUCCESS: false,
    };
  case `${actionTypes.ACTION_ALL_KEYS}_ERROR`:
    return{...state,
      keysError: actions.payload
    };
  case actionTypes.RESETTING_RESET:
    return {...state,
      resetting: false,
    };
  case actionTypes.ACTION_RESET_KEY:
    return{...state,
      chosenTraits: [],
      chosenValues: [],
      speciesLeft: [],
      relevant: state.traitValueCombo,
      irelevant: [],
      resetting: true,
    };
  case `${actionTypes.TRAIT_VALUE_COMBO}_SUCCESS`:
    return{...state,
      traitValueCombo: actions.payload,
      speciesLeft: [],
    };
  case `${actionTypes.TRAIT_VALUE_COMBO}_LOADING`:
  case `${actionTypes.TRAIT_VALUE_COMBO}_ERROR`:
    return{...state,
      traitValueCombo: [],
      traitValueComboError: actions.payload
    };
  case `${actionTypes.KEY_DETAILS}_SUCCESS`:
    return{...state,
      key: actions.payload
    };
  case `${actionTypes.KEY_DETAILS}_LOADING`:
  case `${actionTypes.KEY_DETAILS}_ERROR`:
    return{...state,
      key: '',
      keyError: actions.payload
    };
  case `${actionTypes.VALUE_IMAGES}_SUCCESS`:
    return{...state,
      valueImages: actions.payload
    };
  case `${actionTypes.VALUE_IMAGES}_LOADING`:
  case `${actionTypes.VALUE_IMAGES}_ERROR`:
    return{...state,
      valueImageError: actions.payload,
    };
  case `${actionTypes.ALL_SPESIES_IMAGES}_SUCCESS`:
    return{...state,
      spesiecImageList: actions.payload
    };
  case `${actionTypes.ALL_SPESIES_IMAGES}_LOADING`:
  case `${actionTypes.ALL_SPESIES_IMAGES}_ERROR`:
    return{...state,
      speciesImageError: actions.payload,
    };
  case `${actionTypes.DOWNLOAD_KEY}_SUCCESS`:
    return{...state,
      keyDownloaded_SUCCESS: true,
      keyDownloaded_LOADING: false,
      chosenKey: -1,
      chosenKeyTitle: '',
    };
  case `${actionTypes.DOWNLOAD_KEY}_LOADING`:
    return{...state,
      keyDownloaded_LOADING: true,
    };
  case `${actionTypes.DOWNLOAD_KEY}_ERROR`:
    return{...state,
      keyDownloaded_ERROR: actions.payload,
      keyDownloaded_LOADING: false,
    };
  default:
    return state;
  }
}
