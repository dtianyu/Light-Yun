import {
  create,
  update,
  remove,
  queryList,
  queryProgress,
  querySearch,
  queryRange,
  querySingle,
  querySubList,
  querySubProgress,
  querySubRange,
  querySubSearch,
} from "./service";
import {message} from "antd";

const Model = {
  namespace: 'tasksModel',
  state: {
    currentObject: {},
    data: [],
    total: 0,
    progress: {},
    subData: [],
    subTotal: 0,
    subProgress: {},
    extData: {},
  },
  effects: {
    * fetchCurrent({payload}, {call, put}) {
      const response = yield call(querySingle, payload);
      yield put({
        type: 'current',
        payload: response ? response : {},
      })
    },
    * fetchList({payload}, {call, put}) {
      // console.log(payload);
      const response = yield call(queryList, payload);
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
    * fetchRange({payload}, {call, put}) {
      // console.log(payload);
      const response = yield call(queryRange, payload);
      yield put({
        type: 'query',
        payload: response ? response : {},
      });
    },
    * fetchSearch({payload}, {call, put}) {
      // console.log(payload);
      const response = yield call(querySearch, payload);
      yield put({
        type: 'query',
        payload: response ? response : {},
      });
    },
    * fetchSubList({payload}, {call, put}) {
      // console.log(payload);
      const response = yield call(querySubList, payload);
      yield put({
        type: 'query',
        payload: response ? response : {},
      });
    },
    * fetchSubProgress({payload}, {call, put}) {
      // console.log(payload);
      const response = yield call(querySubProgress, payload);
      yield put({
        type: 'progress',
        payload: response ? response : {},
      });
    },
    * fetchSubRange({payload}, {call, put}) {
      // console.log(payload);
      const response = yield call(querySubRange, payload);
      yield put({
        type: 'query',
        payload: response ? response : {},
      });
    },
    * fetchSubSearch({payload}, {call, put}) {
      // console.log(payload);
      const response = yield call(querySubSearch, payload);
      yield put({
        type: 'query',
        payload: response ? response : {},
      });
    },
    * add({payload}, {call, put}) {
      const res = yield call(create, payload.data);
      const {code, msg} = res;
      if (code < "300") {
        if (payload.params) {
          const {range} = payload.params;
          if (range && range !== 'all' && range !== 'progress') {
            yield put({
              type: 'fetchRange',
              payload: payload.params
            });
            yield put({
              type: 'fetchSubRange',
              payload: payload.params
            });
          } else {
            yield put({
              type: 'fetchList',
              payload: payload.params
            });
            yield put({
              type: 'fetchSubList',
              payload: payload.params
            });
          }
          yield put({
            type: 'fetchProgress',
            payload: payload.params
          })
          yield put({
            type: 'fetchSubProgress',
            payload: payload.params
          })
        }
        message.success('新增成功');
      } else {
        message.error(msg);
      }
    },
    * update({payload}, {call, put}) {
      const res = yield call(update, payload.data);
      const {code, msg} = res;
      if (code < "300") {
        if (payload.params) {
          const {range} = payload.params;
          if (range && range !== 'all' && range !== 'progress') {
            yield put({
              type: 'fetchRange',
              payload: payload.params
            });
            yield put({
              type: 'fetchSubRange',
              payload: payload.params
            });
          } else {
            yield put({
              type: 'fetchList',
              payload: payload.params
            });
            yield put({
              type: 'fetchSubList',
              payload: payload.params
            });
          }
          yield put({
            type: 'fetchProgress',
            payload: payload.params
          })
          yield put({
            type: 'fetchSubProgress',
            payload: payload.params
          })
        }
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
          yield put({
            type: 'fetchSubRange',
            payload: payload.params
          });
        } else {
          yield put({
            type: 'fetchList',
            payload: payload.params
          });
          yield put({
            type: 'fetchSubList',
            payload: payload.params
          });
        }
        yield put({
          type: 'fetchProgress',
          payload: payload.params
        })
        yield put({
          type: 'fetchSubProgress',
          payload: payload.params
        })
        message.success('删除成功');
      } else {
        message.error(msg);
      }
    },
  },
  reducers: {
    current(state, {payload}) {
      return {...state, currentObject: payload.object, extData: payload.extData,};
    },
    query(state, {payload}) {
      return {...state, ...payload,};
    },
    progress(state, {payload}) {
      return {...state, ...payload,}
    },
    clear() {
      return {
        data: [],
        total: 0,
        progress: {},
        subData: [],
        subTotal: 0,
        subProgress: {},
        extData: {},
      };
    },
  },
};

export default Model;
