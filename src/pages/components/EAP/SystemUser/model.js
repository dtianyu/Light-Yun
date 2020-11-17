import {query, queryList} from "@/pages/components/EAP/SystemUser/service";


const Model = {
  namespace: 'systemUserModel',
  state: {
    currentObject: {},
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
    * fetchQuery({payload}, {call, put}) {
      // console.log(payload);
      const response = yield call(query, payload);
      yield put({
        type: 'query',
        payload: response ? response : {},
      });
    },
  },
  reducers: {
    query(state, {payload}) {
      return {...state, ...payload,};
    },
  }
}

export default Model;
