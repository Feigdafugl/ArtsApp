
import * as actionTypes from './actionTypes';


export function fromP(a) {
  return {
    type: actionTypes.FROM_PAGE,
    fromPage: a,
  };
}
