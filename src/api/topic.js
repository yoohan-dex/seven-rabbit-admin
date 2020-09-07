import request from '../utils/request';
import { wrapUrl } from '../utils/utils';

const url = wrapUrl('topic');

const getTopics = () => request(`${url}?admin=true`);
const getTopicSort = () => request(`${url}/sort/topic`);
const updateTopicSort = ids => {
  return request(`${url}/sort/topic`, { method: 'POST', body: ids });
};
const addTopic = ({ name, detail, category, cover, features, hot, title, background }) =>
  request(url, {
    method: 'POST',
    body: {
      title,
      hot,
      name,
      detail,
      category,
      cover,
      background,
      features,
    },
  });
const modTopic = ({ id, name, cover, detail, features, category, hot, title, background }) =>
  request(`${url}/${id}`, {
    method: 'POST',
    body: {
      title,
      id,
      name,
      hot,
      cover,
      background,
      detail,
      category,
      features,
    },
  });
const delTopic = id =>
  request(`${url}/${id}`, {
    method: 'DELETE',
  });
export default {
  getTopics,
  addTopic,
  modTopic,
  delTopic,
  getTopicSort,
  updateTopicSort,
};
