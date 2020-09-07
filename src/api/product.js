import { stringify } from 'qs';
import request from '../utils/request';
import { wrapUrl } from '../utils/utils';

const url = wrapUrl('product');

const getProducts = hot => params =>
  hot
    ? request(`${url}/new-hot-admin?${stringify(params)}`)
    : request(`${url}?${stringify(params)}`);
const getProductOrder = type => request(`${url}/new-hot-sort?type=${type}`);
const updateProductOrder = (ids, type) => () => {
  return request(`${url}/new-hot-sort`, { method: 'POST', body: { ids, type } });
};
const addProduct = ({ name, detail, category, cover, features, hot, hotType }) =>
  request(url, {
    method: 'POST',
    body: {
      hotType,
      hot,
      name,
      detail,
      category,
      cover,
      features,
    },
  });
const modProduct = ({ id, name, cover, detail, features, category, hot, hotType }) =>
  request(wrapUrl(`product/${id}`), {
    method: 'POST',
    body: {
      hotType,
      id,
      name,
      hot,
      cover,
      detail,
      category,
      features,
    },
  });
const delProduct = id =>
  request(`${url}/${id}`, {
    method: 'DELETE',
  });
export default {
  getProducts,
  addProduct,
  modProduct,
  delProduct,
  getProductOrder,
  updateProductOrder,
};
