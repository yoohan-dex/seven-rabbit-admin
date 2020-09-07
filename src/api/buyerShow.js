import request from '../utils/request';
import { wrapUrl } from '../utils/utils';

const url = wrapUrl('buyer-show');

const addBuyerShow = ({ name, detail, type, videoUrl }) =>
  request(url, {
    method: 'POST',
    body: {
      name,
      detail,
      type,
      videoUrl,
    },
  });

const getBuyShow = ({ page, size, type }) =>
  request(`${url}?page=${page}&size=${size}&type=${type}`);

const modBuyerShow = ({ id, name, detail, type, videoUrl }) =>
  request(url, {
    method: 'POST',
    body: {
      id,
      name,
      detail,
      type,
      videoUrl,
    },
  });
export default {
  addBuyerShow,
  getBuyShow,
  modBuyerShow,
};
