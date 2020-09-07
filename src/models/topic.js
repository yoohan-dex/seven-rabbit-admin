import api from '../api/topic';

export default {
  namespace: 'topic',

  state: {
    hot: false,
    list: [],
    toggle: false,
    total: 0,
    page: 1,
    topicSort: '',
  },
  effects: {
    *fetchTopicSort(_, { call, put }) {
      const payload = yield call(api.getTopicSort);
      yield put({ type: 'saveTopicSort', payload: payload.map(v => parseInt(v, 10)) });
    },
    *modOne({ payload }, { call, put }) {
      yield call(api.modTopic, payload);
      yield put({ type: 'fetchCurrent' });
    },
    *fetchCurrent(_, { call, put }) {
      // const page = yield select(state => state.product.page);
      // const hot = yield select(state => state.product.hot);

      const res = yield call(api.getTopics);
      yield put({
        type: 'saveList',
        payload: typeof res.length === 'number' ? { list: res, total: 1 } : res,
      });
      yield put({
        type: 'toggle',
        payload: false,
      });
      yield put({ type: 'fetchTopicSort' });
    },
    *fetch({ payload }, { call, put }) {
      yield put({ type: 'savePage', payload });
      const res = yield call(api.getTopics, payload);
      console.log('res,', res);
      yield put({
        type: 'saveList',
        payload: typeof res.length === 'number' ? { list: res, total: 1 } : res,
      });
      yield put({
        type: 'toggle',
        payload: false,
      });
      yield put({ type: 'fetchTopicSort' });
    },
    *post({ payload }, { call, put }) {
      yield call(api.addTopic, payload);
      yield put({ type: 'fetchCurrent' });
    },
    *del({ payload }, { call, put }) {
      yield call(api.delTopic, payload);
      yield put({ type: 'fetchCurrent' });
    },

    *updateTopicSort({ payload }, { call, put, select }) {
      const oldOrder = yield select(state => state.topic.topicSort);
      const { id, order } = payload;
      const oldIdx = oldOrder.findIndex(v => v === id);
      if (oldIdx === order) return;
      if (oldIdx !== undefined) {
        oldOrder.splice(oldIdx, 1);
      }
      let newOrder;
      if (oldIdx > order) {
        newOrder = [...oldOrder.slice(0, order), id, ...oldOrder.slice(order)];
      } else {
        newOrder = [...oldOrder.slice(0, order), id, ...oldOrder.slice(order)];
      }

      yield call(api.updateTopicSort, newOrder);
      yield put({ type: 'fetchCurrent' });
    },
  },
  reducers: {
    savePage(state, action) {
      return {
        ...state,
        page: action.payload.page,
      };
    },

    saveTopicSort(state, action) {
      return {
        ...state,
        topicSort: action.payload,
      };
    },
    saveList(state, action) {
      return {
        ...state,
        list: action.payload.list,
        total: action.payload.total,
      };
    },

    toggle(state, action) {
      return {
        ...state,
        toggle: action.payload,
      };
    },
  },
};
