import request from '@/utils/request';
import { eapAppToken } from '@/pages/comm';

export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryTask(params) {
  // console.log(params);
  let url = '/jrs/api/eap/task';
  let q;
  let f = '/f';
  let s = '/s;plannedStartDate=ASC;priority=ASC';
  if (params.executorId) {
    f = `${f};executorId=${params.executorId}`;
  }
  if (params.status) {
    f = `${f};status=${params.status}`;
  }
  q = `${url}${f}${s}/0/7`;
  // console.log(q);
  const response = await request(q, {
    params: {
      ...eapAppToken,
    },
  });
  const { code, data, count } = response;
  return {
    data,
    page: params.current,
    success: code === '200',
    total: count,
  };
}
