import request from '@/utils/request';
import {eapAppToken, formatDateTime} from "@/pages/comm";

const url = '/api/eap/task';

export async function queryList(params) {
  console.log(params);
  let q;
  let f = '/f';
  let s = '/s';
  if (Object.keys(params).length === 2) {
    f = `${f};status=N`;
  } else {
    if (params.executorId) {
      f = `${f};executorId=${params.executorId}`;
    }
    if (params.status) {
      f = `${f};status=${params.status}`;
    }
  }
  if (params.current && params.pageSize) {
    q = `${url}${f}${s}/${(params.current - 1) * params.pageSize}/${params.pageSize}`;
  } else {
    q = url
  }
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

export async function create(params) {
  let response;
  response = request(url, {
    method: 'POST',
    data: {...params},
    params: {
      ...eapAppToken
    },
  });
  return response;
}

export async function update(params) {
  let response;
  response = await request(`${url}/${params.id}`, {
    method: 'PUT',
    data: {...params, method: 'update'},
    params: {
      ...eapAppToken
    },
  });
  return response;
}

export async function remove(id) {
  let response;
  response = await request(`${url}/${id}`, {
    method: 'DELETE',
    params: {
      ...eapAppToken
    },
  });
  return response;
}

