import { queryProjectNotice, queryTask } from './service';

const Model = {
  namespace: 'workplaceModel',
  state: {
    currentUser: undefined,
    projectNotice: [],
    tasks: [],
  },
  effects: {
    *init({ payload }, { put }) {
      yield put({
        type: 'fetchTask',
        payload: payload,
      });
    },

    *fetchProjectNotice(_, { call, put }) {
      const response = yield call(queryProjectNotice);
      yield put({
        type: 'save',
        payload: {
          projectNotice: Array.isArray(response) ? response : [],
        },
      });
    },

    *fetchTask({ payload }, { call, put }) {
      const response = yield call(queryTask, { executorId: payload.userid, status: 'N' });
      yield put({
        type: 'save',
        payload: {
          tasks: Array.isArray(response.data) ? response.data : [],
        },
      });
    },
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },

    clear() {
      return {
        currentUser: undefined,
        projectNotice: [],
        tasks: [],
      };
    },
  },
};
export default Model;
