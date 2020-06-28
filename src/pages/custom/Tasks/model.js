import {queryList, create, update} from "./service";
import {message} from "antd";

const Model = {
  namespace: 'tasksModel',
  state: {
    data: [],
    total: 0,
  },
  effects: {
    * fetch({payload}, {call, put}) {
      // console.log(payload);
      const response = yield call(queryList, payload);
      yield put({
        type: 'queryList',
        payload: response ? response : {},
      });
    },
    * add({payload}, {call, put}) {
      const res = yield call(create, payload.data);
      const {code, msg} = res;
      if (code < "300") {
        yield put({
          type: 'fetch',
          payload: payload.pagination,
        });
        message.success('新增成功');
      } else {
        message.error(msg);
      }
    },
    * update({payload}, {call, put}) {
      const res = yield call(update, payload.data);
      const {code, msg} = res;
      if (code < "300") {
        yield put({
          type: 'fetch',
          payload: payload.pagination,
        });
        message.success('更新成功');
      } else {
        message.error(msg);
      }
    }
  },
  reducers: {
    queryList(state, {payload}) {
      return {...state, data: payload.data, total: payload.total,};
    },
  },
};
export default Model;
