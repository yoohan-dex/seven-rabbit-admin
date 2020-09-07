import request from '../utils/request';
import { wrapUrl } from '../utils/utils';

const url = wrapUrl('category');
const getCategory = () => request(url);

const getOne = id => request(wrapUrl(`category/${id}`));

const addCategory = ({ name, filters, image, orderId }) =>
  request(url, {
    method: 'POST',
    body: {
      name,
      filters,
      image,
      orderId: parseInt(orderId, 10),
    },
  });
const modCategory = ({ id, name, filters, image, orderId }) =>
  request(wrapUrl(`category/${id}`), {
    method: 'POST',
    body: {
      name,
      filters,
      image,
      orderId: parseInt(orderId, 10),
    },
  });
const delCategory = id =>
  request(`${url}/${id}`, {
    method: 'DELETE',
  });

const addFilter = ({ name, features }) =>
  request(wrapUrl('filter'), {
    method: 'POST',
    body: {
      name,
      features,
    },
  });

const getFilters = () => request(wrapUrl('filter'));
export default {
  getOne,
  addCategory,
  addFilter,
  getFilters,
  getCategory,
  delCategory,
  modCategory,
};
