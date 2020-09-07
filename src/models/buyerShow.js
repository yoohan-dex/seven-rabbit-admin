import api from '../api/buyerShow';

export default {
  namespace: 'buyerShow',

  state: {
    list: [],
    toggle: false,
    total: 0,
    page: 1,
  },

  effects: {
    *modOne({ payload }, { call, put }) {
      console.log('modOne', payload);
      yield call(api.modBuyerShow, payload);
      yield put({ type: 'fetchCurrent' });
    },
    *fetchCurrent(_, { call, put, select }) {
      const page = yield select(state => state.buyerShow.page);

      const res = yield call(api.getBuyShow, { page, size: 8, type: 'video' });
      yield put({ type: 'saveList', payload: res || [] });
      yield put({
        type: 'toggle',
        payload: false,
      });
    },
    *fetch({ payload }, { call, put }) {
      yield put({ type: 'savePage', payload });
      const res = yield call(api.getBuyShow, payload);
      yield put({ type: 'saveList', payload: res || [] });
      yield put({
        type: 'toggle',
        payload: false,
      });
    },
    *post({ payload }, { call, put }) {
      yield call(api.addBuyerShow, payload);
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
    saveList(state, action) {
      return {
        ...state,
        list: action.payload.list.map(item => ({ ...item, cover: item.detail[0] })),
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
