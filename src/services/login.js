import request from '@/utils/request';
import {eapAppToken} from "@/pages/comm";

const q = '/api/eap/systemuser/login/yun';

export async function loginYun(params) {
  return request(q, {
    method: 'POST',
    data: params,
    params: {
      ...eapAppToken
    },
  });
}

export async function getFakeCaptcha(mobile) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}
