import { queryList } from '@/pages/ProductionMarketing/services/ProductionDemand';

const Model = {
  namespace: 'productionDemandModel',
  state: {
    currentObject: {},
    data: [],
    total: 0,
    extData: {},
  },
  effects: {
    *fetchList({ payload }, { call, put }) {
      // console.log(payload);
      const response = yield call(queryList, payload);
      yield put({
        type: 'query',
        payload: response ? response : {},
      });
    },
  },
  reducers: {
    current(state, { payload }) {
      return { ...state, currentObject: payload.object, extData: payload.extData };
    },
    query(state, { payload }) {
      return { ...state, ...payload };
    },
    summary(state, { payload }) {
      return { ...state, summaryData: payload.data };
    },
    demand(state, { payload }) {
      return { ...state, demandData: payload.data };
    },
    clear() {
      return {
        currentObject: {},
        data: [],
        total: 0,
        extData: {},
      };
    },
  },
};

export default Model;
