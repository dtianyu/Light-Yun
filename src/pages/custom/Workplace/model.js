import {fakeChartData, queryActivities, queryDemands, queryProjectNotice} from './service';

const Model = {
  namespace: 'dashboardAndWorkplace',
  state: {
    currentUser: undefined,
    projectNotice: [],
    activities: [],
    radarData: [],
  },
  effects: {
    * init({payload}, {put}) {
      yield put({
        type: 'fetchProjectNotice',
      });
      yield put({
        type: 'fetchDemands', payload: payload,
      });
      yield put({
        type: 'fetchChart',
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

    * fetchDemands({payload}, {call, put}) {
      const response = yield call(queryDemands, {directorID: "C0160", status: "N", current: 1, pageSize: 500});
      yield put({
        type: 'save',
        payload: {
          activities: Array.isArray(response.data) ? response.data : [],
        },
      });
    },

    * fetchChart(_, {call, put}) {
      const {radarData} = yield call(fakeChartData);
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
        activities: [],
        radarData: [],
      };
    },
  },
};
export default Model;
