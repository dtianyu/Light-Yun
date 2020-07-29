import {queryProjectNotice, queryTask} from './service';
import {queryChartData} from "@/pages/Workplace/service";

const Model = {
  namespace: 'workplaceModel',
  state: {
    currentUser: undefined,
    projectNotice: [],
    tasks: [],
    radarData: [],
  },
  effects: {
    * init({payload}, {put}) {
      yield put({
        type: 'fetchTask', payload: payload,
      });
      yield put({
        type: 'fetchChartData', payload: payload,
      });
    },

    * fetchProjectNotice(_, {call, put}) {
      const response = yield call(queryProjectNotice);
      yield put({
        type: 'save',
        payload: {
          projectNotice: Array.isArray(response) ? response : [],
        },
      });
    },

    * fetchTask({payload}, {call, put}) {
      const response = yield call(queryTask, {executorId: payload.userid, status: "N"});
      yield put({
        type: 'save',
        payload: {
          tasks: Array.isArray(response.data) ? response.data : [],
        },
      });
    },

    * fetchChartData({payload: {userid}}, {call, put}) {
      const {radarData} = yield call(queryChartData, {userid});
      yield put({
        type: 'save',
        payload: {
          radarData,
        },
      });
    },

  },
  reducers: {
    save(state, {payload}) {
      return {...state, ...payload};
    },

    clear() {
      return {
        currentUser: undefined,
        projectNotice: [],
        tasks: [],
        radarData: [],
      };
    },
  },
};
export default Model;
