import request from '@/utils/request';
import {eapAppToken} from "@/pages/comm";

const url = '/api/eap/systemuser';

export async function queryList(params) {
  // console.log(params);
  let q;
  let f = '/f';
  let s = '/s';
  if (params.userid) {
    f = `${f};userid=${params.userid}`;
  }
  if (params.username) {
    f = `${f};username=${params.username}`;
  }
  if (params.deptno) {
    f = `${f};deptno=${params.deptno}`;
  }
  q = `${url}/pagination${f}${s}`
  const response = await request(q, {
    params: {
      offset: (params.current - 1) * params.pageSize,
      pageSize: params.pageSize,
      ...eapAppToken
    },
  });
  const {code, data, count} = response;
  return {
    data,
    page: params.current,
    success: code === '200',
    total: count,
  };
}

export async function query(params) {
  let q = `${url}/query`;
  return await request(q, {
    params: {
      ...eapAppToken,
      q: params.q,
    },
  });
}
