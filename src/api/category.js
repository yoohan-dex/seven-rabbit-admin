import request from '../utils/request';

const wrapUrl = url => `https://sevenrabbit.cn/${url}`;
// const wrapUrl = url => `http://localhost:3000/${url}`;

const getCategory = () => request(wrapUrl('category'));

const getOne = id => request(wrapUrl(`category/${id}`));

const addCategory = ({ name, filters, image }) =>
  request(wrapUrl('category'), {
    method: 'POST',
    body: {
      name,
      filters,
      image,
    },
  });
const modCategory = ({ id, name, filters, image }) =>
  request(wrapUrl(`category/${id}`), {
    method: 'POST',
    body: {
      name,
      filters,
      image,
    },
  });
const delCategory = id =>
  request(`${wrapUrl('category')}/${id}`, {
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
