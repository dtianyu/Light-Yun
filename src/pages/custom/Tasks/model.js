import {queryList, create, update, queryRange} from "./service";
import {message} from "antd";

const Model = {
  namespace: 'tasksModel',
  state: {
    data: [],
    total: 0,
  },
  effects: {
    * fetchList({payload}, {call, put}) {
      // console.log(payload);
      const response = yield call(queryList, payload);
      yield put({
        type: 'query',
        payload: response ? response : {},
      });
    },
    * fetchRange({payload}, {call, put}) {
      // console.log(payload);
      const response = yield call(queryRange, payload);
      yield put({
        type: 'query',
        payload: response ? response : {},
      });
    },
    * add({payload}, {call, put}) {
      const {range} = payload.params;
      const res = yield call(create, payload.data);
      const {code, msg} = res;
      if (code < "300") {
        if (range && range !== 'all' && range !== 'progress') {
          yield put({
            type: 'fetchRange',
            payload: payload.params
          });
        } else {
          yield put({
            type: 'fetchList',
            payload: payload.params
          });
        }
        message.success('新增成功');
      } else {
        message.error(msg);
      }
    },
    * update({payload}, {call, put}) {
      const {range} = payload.params;
      const res = yield call(update, payload.data);
      const {code, msg} = res;
      if (code < "300") {
        if (range && range !== 'all' && range !== 'progress') {
          yield put({
            type: 'fetchRange',
            payload: payload.params
          });
        } else {
          yield put({
            type: 'fetchList',
            payload: payload.params
          });
        }
        message.success('更新成功');
      } else {
        message.error(msg);
      }
    },
  },
  reducers: {
    query(state, {payload}) {
      return {...state, data: payload.data, total: payload.total,};
    },
  },
};
export default Model;
