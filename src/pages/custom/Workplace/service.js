import request from '@/utils/request';
import {eapAppToken, formatDateTime} from "@/pages/comm";

export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities(params) {
  return request('/api/activities');
}

export async function queryTask(params) {
  // console.log(params);
  let url = '/api/eap/task';
  let q;
  let f = '/f';
  let s = '/s';
  if (params.executorId) {
    f = `${f};executorId=${params.executorId}`;
  }
  if (params.status) {
    f = `${f};status=${params.status}`;
  }
  if (params.current && params.pageSize) {
    q = `${url}${f}${s}/${(params.current - 1) * params.pageSize}/${params.pageSize}`;
  } else {
    q = url
  }
  // console.log(q);
  const response = await request(q, {
    params: {
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


export async function fakeChartData() {
  return request('/api/fake_chart_data');
}
