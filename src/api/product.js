import { stringify } from 'qs';
import request from '../utils/request';

const wrapUrl = url => `https://sevenrabbit.cn/${url}`;
// const wrapUrl = url => `http://localhost:3000/${url}`;

const getProducts = params => request(wrapUrl(`product?${stringify(params)}`));

const addProduct = ({ name, detail, category, cover, features }) =>
  request(wrapUrl('product'), {
    method: 'POST',
    body: {
      name,
      detail,
      category,
      cover,
      features,
    },
  });
const modProduct = ({ id, name, cover, detail, features, category }) =>
  request(wrapUrl(`product/${id}`), {
    method: 'POST',
    body: {
      id,
      name,
      cover,
      detail,
      category,
      features,
    },
  });
const delProduct = id =>
  request(`${wrapUrl('product')}/${id}`, {
    method: 'DELETE',
  });
export default {
  getProducts,
  addProduct,
  modProduct,
  delProduct,
};
