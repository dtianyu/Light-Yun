import { queryCurrent, query as queryUsers, queryYun } from '@/services/user';

const UserModel = {
  namespace: 'user',
  state: {
    currentUser: {},
    menuData: [],
    radarData: [],
    productCategory: 'ALL',
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
      let category = 'ALL';
      const user = action.payload.object || {};
      if (user && user.deptno && user.deptno.substring(0, 2) === '13') {
        category = 'AJ';
      }
      if (user && user.deptno && user.deptno.substring(0, 2) === '1H') {
        category = 'P';
      }
      return {
        ...state,
        currentUser: user,
        menuData: action.payload.extData.menu || [],
        radarData: action.payload.extData.radarData || [],
        productCategory: category,
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
