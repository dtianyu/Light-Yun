import request from '@/utils/request';
import { eapAppToken } from '@/pages/comm';

const url = '/jrs/api/eap/product';

export async function queryList(params) {
  let q = '/pagination';
  let f = '/f';
  let s = '/s;itemno=ASC';
  if (params.company) {
    f = `${f};company=${params.company}`;
  }
  if (params.series) {
    f = `${f};series=${params.series}`;
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

export async function queryByUID(params) {
  let q;
  if (params.uid) {
    q = `${url}/${params.uid}`;
    const response = await request(q, {
      params: {
        ...eapAppToken,
      },
    });
    const { code, object, extData } = response;

    if (object.BOM) {
      object.BOM.map((item) => {
        if (item.product) {
          item.children = item.product.BOM;
        }
      });
    }
    console.log(object);
    if (code < '300') {
      return {
        object,
        extData,
      };
    } else {
      return {
        object: {},
      };
    }
  } else {
    return {
      object: {},
    };
  }
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
