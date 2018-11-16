import api from '../api/product';

export default {
  namespace: 'product',

  state: {
    list: [],
    toggle: false,
    total: 0,
    page: 1,
  },
  effects: {
    *modOne({ payload }, { call, put }) {
      yield call(api.modProduct, payload);
      yield put({ type: 'fetchCurrent' });
    },
    *fetchCurrent(_, { call, put, select }) {
      const page = yield select(state => state.product.page);
      const res = yield call(api.getProducts, { page, size: 8 });
      yield put({ type: 'saveList', payload: res });
      yield put({
        type: 'toggle',
        payload: false,
      });
    },
    *fetch({ payload }, { call, put }) {
      yield put({ type: 'savePage', payload });
      const res = yield call(api.getProducts, payload);
      yield put({ type: 'saveList', payload: res });
      yield put({
        type: 'toggle',
        payload: false,
      });
    },
    *post({ payload }, { call, put }) {
      yield call(api.addProduct, payload);
      yield put({ type: 'fetchCurrent' });
    },
    *del({ payload }, { call, put }) {
      yield call(api.delProduct, payload);
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
