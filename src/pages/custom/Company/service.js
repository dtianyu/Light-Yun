import request from '@/utils/request';
import {eapAppToken} from "@/pages/comm";

const url = '/jrs/api/eap/company';

export async function queryList(params) {
  let q;
  let f = '/f';
  let s = '/s';
  if (params.company) {
    f = `${f};company=${params.company}`;
  }
  if (params.name) {
    f = `${f};name=${params.name}`;
  }
  if (params.status) {
    f = `${f};status=${params.status}`;
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

export async function add(params) {
  const response = request(url, {
    method: 'POST',
    data: {...params, method: 'post'},
    params: {
      ...eapAppToken
    },
  });
  return response;
}

export async function update(params) {
  const response = await request(`${url}/${params.id}`, {
    method: 'PUT',
    data: {...params, method: 'update'},
    params: {
      ...eapAppToken
    },
  });
  return response;
}

export async function remove(id) {
  const response = await request(`${url}/${id}`, {
    method: 'DELETE',
    params: {
      ...eapAppToken
    },
  });
  return response;
}
