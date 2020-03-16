import axios from 'axios';

/* Env */
import { API_URL } from 'env';

/* Constants */
import { STATUS } from 'constants.js';

function parse({_id, engine_type}, {name, image}) {
  const document = { rule_id: _id, image: image.split('base64,')[1] };

  return axios.post(`${API_URL}/api/documents`, JSON.stringify(document)).then(({data}) => {
    data.status = STATUS.SUCCESS;
    data.engine_type = engine_type;
    data.name = name;
    data.checked = false;
    data.texts = data.result;
    return data;
  }).catch(() => {
    return {
      status: STATUS.ERROR,
      name: name,
      image: 'images/error.jpg',
      texts: [{field_name: 'Error', result: 'Document error'}]
    }
  });

  // return new Promise((resolve) => {
  //   setTimeout(() => resolve({
  //     name,
  //     image,
  //     accuracy: 60,
  //     texts: [{
  //       _key: 'Id',
  //       value: '000-000-000'
  //     }, {
  //       _key: 'Name',
  //       value: 'Evan Rachel Wood'
  //     }, {
  //       _key: 'Gender',
  //       value: 'Female'
  //     }, {
  //       _key: 'Born',
  //       value: '7 September'
  //     }, {
  //       _key: 'Location',
  //       value: 'North Carolina, USA'
  //     }]
  //   }), 3000)
  // })
}

export const core = {
  parse
}