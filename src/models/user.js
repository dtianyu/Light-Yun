import { queryCurrent, query as queryUsers, queryYun } from '@/services/user';

const UserModel = {
  namespace: 'user',
  state: {
    currentUser: {},
    menuData: [],
    radarData: [],
  },
  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },

    *fetchCurrent({ payload }, { call, put }) {
      const response = yield call(queryYun, payload);
      yield put({
        type: 'setCurrentUser',
        payload: response,
      });
    },
  },
  reducers: {
    setCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload.object || {},
        menuData: action.payload.extData.menu || [],
        radarData: action.payload.extData.radarData || [],
      };
    },

    changeNotifyCount(
      state = {
        currentUser: {},
      },
      action,
    ) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
  },
};
export default UserModel;
