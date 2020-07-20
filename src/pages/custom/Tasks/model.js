import {create, update, remove, queryList, queryProgress, queryRange} from "./service";
import {message} from "antd";

const Model = {
  namespace: 'tasksModel',
  state: {
    data: [],
    total: 0,
    progress: {},
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
    * fetchProgress({payload}, {call, put}) {
      // console.log(payload);
      const response = yield call(queryProgress, payload);
      yield put({
        type: 'progress',
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
        yield put({
          type: 'fetchProgress',
          payload: payload.params
        })
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
        yield put({
          type: 'fetchProgress',
          payload: payload.params
        })
        message.success('更新成功');
      } else {
        message.error(msg);
      }
    },
    * remove({payload}, {call, put}) {
      const {range} = payload.params;
      const res = yield call(remove, payload.id);
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
        yield put({
          type: 'fetchProgress',
          payload: payload.params
        })
        message.success('删除成功');
      } else {
        message.error(msg);
      }
    },
  },
  reducers: {
    query(state, {payload}) {
      return {...state, data: payload.data, total: payload.total,};
    },
    progress(state, {payload}) {
      return {...state, progress: payload.progress,}
    }
  },
};

export default Model;
