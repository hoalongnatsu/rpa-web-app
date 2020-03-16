/* Services */
import { rules } from 'services/rules';

export const GET_ALL_RULES = 'GET_ALL_RULES';
export const ADD_RULE = 'ADD_RULE';

export function get_all_rules() {
  return (dispatch) => {
    rules.list().then((data) => {
      dispatch({
        type: GET_ALL_RULES,
        payload: data
      })
    })
  }
}

export function add_rule(data) {
  return {
    type: ADD_RULE,
    payload: data
  }
}