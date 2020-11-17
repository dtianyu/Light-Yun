import {
  queryList,
  querySummary,
  add,
  remove,
  update,
} from '@/pages/ProductionMarketing/services/ProductionPlan';
import { message } from 'antd';

const Model = {
  namespace: 'productionPlanModel',
  state: {
    currentObject: {},
    data: [],
    total: 0,
    extData: {},
    summaryData: [],
    demandData: [],
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
    *fetchSummary({ payload }, { call, put }) {
      // console.log(payload);
      const response = yield call(querySummary, payload);
      yield put({
        type: 'summary',
        payload: response ? response : {},
      });
    },
    *add({ payload }, { call, put }) {
      const res = yield call(add, payload.data);
      const { code, msg } = res;
      if (code < '300') {
        message.success('新增成功');
      } else {
        message.error(msg);
      }
    },
    *update({ payload }, { call, put }) {
      const res = yield call(update, payload.data);
      const { code, msg } = res;
      if (code < '300') {
        message.success('更新成功');
      } else {
        message.error(msg);
      }
    },
    *remove({ payload }, { call, put }) {
      const res = yield call(remove, payload.id);
      const { code, msg } = res;
      if (code < '300') {
        message.success('删除成功');
      } else {
        message.error(msg);
      }
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
    clear() {
      return {
        currentObject: {},
        data: [],
        total: 0,
        extData: {},
        summaryData: [],
      };
    },
  },
};

export default Model;
