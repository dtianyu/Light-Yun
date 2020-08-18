import request from '@/utils/request';
import {eapAppToken} from "@/pages/comm";

const q = '/jrs/api/eap/systemuser/yun';

export async function query() {
  return request('/jrs/api/users');
}

export async function queryCurrent() {
  return request('/jrs/api/currentUser');
}

export async function queryNotices() {
  return request('/jrs/api/notices');
}

export async function queryYun(params) {
  return request(q, {
    params: {
      ...params,
      ...eapAppToken
    },
  });
}
