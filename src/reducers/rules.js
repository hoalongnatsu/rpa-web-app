import { GET_ALL_RULES, ADD_RULE } from 'actions/rules';

export default function rules(state = [], action) {
  switch (action.type) {
    case GET_ALL_RULES:
      return action.payload;
    case ADD_RULE:
      return [...state, action.payload];
    default:
      return state;
  }
}