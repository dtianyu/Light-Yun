import request from '@/utils/request';
import {eapAppToken} from "@/pages/comm";

const q = '/api/eap/systemuser/yun';

export async function query() {
  return request('/api/users');
}

export async function queryCurrent() {
  return request('/api/currentUser');
}

export async function queryNotices() {
  return request('/api/notices');
}

export async function queryYun(params) {
  return request(q, {
    params: {
      ...params,
      ...eapAppToken
    },
  });
}
