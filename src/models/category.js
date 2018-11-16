import api from '../api/category';

export default {
  namespace: 'category',

  state: {
    category: '',
    categories: [],
    list: [],
    toggle: false,
  },

  effects: {
    *modOne({ payload }, { call, put }) {
      yield call(api.modCategory, payload);
      yield put({
        type: 'fetchCategory',
      });
      yield put({
        type: 'fetchCategory',
      });
    },
    *getOne({ payload }, { call, put }) {
      const res = yield call(api.getOne, payload);
      yield put({
        type: 'saveOne',
        payload: res,
      });
    },
    *del({ payload }, { call, put }) {
      yield call(api.delCategory, payload);
      yield put({
        type: 'fetchCategory',
      });
    },
    *submit({ payload }, { call, put }) {
      yield call(api.addCategory, payload);
      yield put({
        type: 'fetchCategory',
      });
    },
    *add({ payload }, { call, put }) {
      yield call(api.addFilter, payload);
      yield put({
        type: 'fetch',
      });
    },
    *fetchCategory(_, { call, put }) {
      const response = yield call(api.getCategory);
      yield put({
        type: 'saveCategory',
        payload: Array.isArray(response) ? response : [],
      });
      yield put({
        type: 'toggle',
        payload: false,
      });
    },
    *fetch(_, { call, put }) {
      const response = yield call(api.getFilters);
      yield put({
        type: 'saveList',
        payload: Array.isArray(response) ? response : [],
      });
    },
  },

  reducers: {
    saveCategory(state, action) {
      return {
        ...state,
        categories: action.payload,
      };
    },
    saveList(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    saveOne(state, action) {
      return {
        ...state,
        category: action.payload,
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
