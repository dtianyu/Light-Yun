import request from '@/utils/request';
import { eapAppToken } from '@/pages/comm';

const url = '/jrs/api/eap/productionplan';

export async function queryList(params) {
  console.log(params);
  let q = '/pagination';
  let f = '/f';
  let s = '/s;formdate=ASC';
  if (params.company) {
    f = `${f};company=${params.company}`;
  }
  if (params.mon) {
    f = `${f};mon=${params.mon}`;
  }
  if (params.productSeries) {
    f = `${f};productSeries=${params.productSeries}`;
  }
  if (params.itemModel) {
    f = `${f};itemModel=${params.itemModel}`;
  }
  q = `${url}${q}${f}${s}`;
  const response = await request(q, {
    params: {
      offset: (params.current - 1) * params.pageSize,
      pageSize: params.pageSize,
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

export async function querySummary(params) {
  let q = '/summary';
  let f = '/f';
  let s = '/s';
  if (params.mon) {
    f = `${f};mon=${params.mon}`;
  }
  if (params.productSeries) {
    f = `${f};productSeries=${params.productSeries}`;
  }
  if (params.itemModel) {
    f = `${f};itemModel=${params.itemModel}`;
  }
  q = `${url}${q}${f}${s}`;
  const response = await request(q, {
    params: {
      offset: (params.current - 1) * params.pageSize,
      pageSize: params.pageSize,
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

export async function queryDemand(params) {
  let q = '/demand';
  let f = '/f';
  let s = '/s';
  if (params.mon) {
    f = `${f};mon=${params.mon}`;
  }
  if (params.productSeries) {
    f = `${f};productSeries=${params.productSeries}`;
  }
  if (params.itemModel) {
    f = `${f};itemModel=${params.itemModel}`;
  }
  q = `${url}${q}${f}${s}`;
  const response = await request(q, {
    params: {
      offset: (params.current - 1) * params.pageSize,
      pageSize: params.pageSize,
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

export async function add(params) {
  const response = await request(url, {
    method: 'POST',
    data: { ...params },
    params: {
      ...eapAppToken,
    },
  });
  return response;
}

export async function update(params) {
  const response = await request(`${url}/${params.id}`, {
    method: 'PUT',
    data: { ...params },
    params: {
      ...eapAppToken,
    },
  });
  return response;
}

export async function remove(id) {
  const response = await request(`${url}/${id}`, {
    method: 'DELETE',
    params: {
      ...eapAppToken,
    },
  });
  return response;
}
