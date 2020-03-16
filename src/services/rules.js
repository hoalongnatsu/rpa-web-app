import axios from 'axios';

/* Env */
import { API_URL } from 'env';

function list() {
  return axios.get(`${API_URL}/api/rules`).then(({data}) => data);
}

function create(rule) {
  rule.image = rule.image.split('base64,')[1];

  return axios.post(`${API_URL}/api/rules`, JSON.stringify(rule), {
    headers: {
      'Content-Type': 'application/json',
    }
  }).then(({data}) => data);
}

function get_raw_parser(image) {
  image = image.split('base64,')[1];

  return axios.post(`${API_URL}/api/rawparser`, JSON.stringify({image}), {
    headers: {
      'Content-Type': 'application/json',
    }
  }).then(({data}) => data);
}


function review_key_word(rule){
  return axios.post(`${API_URL}/api/reviewKeyWord`, JSON.stringify(rule), {
    headers: {
      'Content-Type': 'application/json',
    }
  }).then(({data}) => data);
}

function review(rule) {
  rule.image = rule.image.split('base64,')[1];

  return axios.post(`${API_URL}/api/reviewRules`, JSON.stringify(rule), {
    headers: {
      'Content-Type': 'application/json',
    }
  }).then(({data}) => {
    data.name = "Review result";
    data.texts = data.result;
    return data;
  });
}

export const rules = {
  list,
  create,
  get_raw_parser,
  review_key_word,
  review
}