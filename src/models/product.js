import api from '../api/product';

export default {
  namespace: 'product',

  state: {
    hot: false,
    list: [],
    toggle: false,
    total: 0,
    page: 1,
    productOrder: '',
    hotSort: [],
    hotType: 1,
  },
  effects: {
    *fetchHotSort(_, { call, put, select }) {
      const hotType = yield select(state => state.product.hotType);
      const payload = yield call(api.getProductOrder, hotType);

      yield put({ type: 'saveHotSort', payload: payload.map(v => parseInt(v, 10)) });
    },
    *fetchProductOrder(_, { call, put }) {
      const payload = yield call(api.getProductOrder);
      yield put({ type: 'saveProductOrder', payload: payload.map(v => parseInt(v, 10)) });
    },
    *modOne({ payload }, { call, put }) {
      yield call(api.modProduct, payload);
      yield put({ type: 'fetchCurrent' });
    },
    *fetchCurrent(_, { call, put, select }) {
      const page = yield select(state => state.product.page);
      const hot = yield select(state => state.product.hot);
      const hotType = yield select(state => state.product.hotType);
      let res;
      if (hot) {
        res = yield call(api.getProducts(hot), { type: hotType });
      } else {
        res = yield call(api.getProducts(hot), { page, size: 8 });
      }

      yield put({
        type: 'saveList',
        payload: typeof res.length === 'number' ? { list: res, total: 1 } : res,
      });
      yield put({
        type: 'toggle',
        payload: false,
      });
      yield put({ type: 'fetchHotSort' });
    },
    *fetch({ payload }, { call, put, select }) {
      yield put({ type: 'savePage', payload });
      const hot = yield select(state => state.product.hot);
      const hotType = yield select(state => state.product.hotType);
      let res;

      if (hot) {
        res = yield call(api.getProducts(hot), { type: hotType });
      } else {
        res = yield call(api.getProducts(hot), payload);
      }
      yield put({
        type: 'saveList',
        payload: typeof res.length === 'number' ? { list: res, total: 1 } : res,
      });
      yield put({
        type: 'toggle',
        payload: false,
      });
      yield put({ type: 'fetchHotSort' });
    },
    *post({ payload }, { call, put }) {
      yield call(api.addProduct, payload);
      yield put({ type: 'fetchCurrent' });
    },
    *del({ payload }, { call, put }) {
      yield call(api.delProduct, payload);
      yield put({ type: 'fetchCurrent' });
    },

    *updateHotSort({ payload }, { call, put, select }) {
      const oldHotSort = yield select(state => state.product.hotSort);
      const hotType = yield select(state => state.product.hotType);

      const { id, order } = payload;
      const oldIdx = oldHotSort.findIndex(v => v === id);
      if (oldHotSort === order) return;
      if (oldIdx !== undefined) {
        oldHotSort.splice(oldIdx, 1);
      }
      let newHotSort;
      if (oldIdx > order) {
        newHotSort = [...oldHotSort.slice(0, order), id, ...oldHotSort.slice(order)];
      } else {
        newHotSort = [...oldHotSort.slice(0, order), id, ...oldHotSort.slice(order)];
      }
      console.log('?');
      yield call(api.updateProductOrder(newHotSort, hotType));
      yield put({ type: 'fetchCurrent' });
    },

    *updateProductOrder({ payload }, { call, put, select }) {
      const oldOrder = yield select(state => state.product.productOrder);
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

      yield call(api.updateProductOrder, newOrder);
      yield put({ type: 'fetchCurrent' });
    },
  },
  reducers: {
    toggleHot(state) {
      return {
        ...state,
        hot: !state.hot,
      };
    },
    changeHotType(state, action) {
      return {
        ...state,
        hotType: action.payload.hotType,
      };
    },
    savePage(state, action) {
      return {
        ...state,
        page: action.payload.page,
      };
    },

    saveProductOrder(state, action) {
      return {
        ...state,
        productOrder: action.payload,
      };
    },
    saveHotSort(state, action) {
      console.log('save hot sort', action);
      return {
        ...state,
        hotSort: action.payload,
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

// const range = (start, end) => {
//   return (next, complete, acc) =>
//     start <= end ? range(start + 1, end)(next, complete, next(start, acc)) : complete(acc);
// };

// const foreach = (source, f) => source(n => f(n), () => { })

// // eslint-disable-next-line no-console
// foreach(range(1, 10), console.log)
