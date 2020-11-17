import request from '@/utils/request';
import {eapAppToken} from "@/pages/comm";

const url = '/jrs/api/eap/task';

export async function queryList(params) {
  // console.log(params);
  let q;
  let f = '/f';
  let s = '/s;plannedStartDate=ASC;priority=ASC';

  if (params.userId) {
    f = `${f};executorId=${params.userId}`;
  }
  if (params.status) {
    f = `${f};status=${params.status}`;
  }

  q = `${url}/pagination${f}${s}`;
  const response = await request(q, {
    params: {
      ...eapAppToken,
      offset: (params.current - 1) * params.pageSize,
      pageSize: params.pageSize,
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

export async function queryProgress(params) {
  // console.log(params);
  let q;
  if (params.userId) {
    q = `${url}/executor/${params.userId}/progress`;
    const response = await request(q, {
      params: {
        ...eapAppToken,
      },
    });
    const {code, object} = response;
    return {
      progress: object,
    };
  } else {
    return {
      progress: {},
    };
  }
}

export async function queryRange(params) {
  // console.log(params);
  let q;
  if (params.userId) {
    q = `${url}/executor/${params.userId}/${params.range}/${params.number}`;
    const response = await request(q, {
      params: {
        ...eapAppToken,
        offset: (params.current - 1) * params.pageSize,
        pageSize: params.pageSize,
      },
    });
    const {code, data, count} = response;
    return {
      data,
      page: params.current,
      success: code === '200',
      total: count,
    };
  } else {
    return {
      data: [],
      page: params.current,
      success: false,
      total: 0,
    };
  }
}

export async function querySearch(params) {
  // console.log(params);
  let q;
  if (params.userId) {
    q = `${url}/executor/${params.userId}/pagination/query`;
    const response = await request(q, {
      params: {
        q: params.q,
        offset: (params.current - 1) * params.pageSize,
        pageSize: params.pageSize,
        ...eapAppToken,
      },
    });
    const {code, data, count} = response;
    return {
      data,
      success: code === '200',
      total: count,
    };
  } else {
    return {
      data: [],
      success: false,
      total: 0,
    };
  }
}

export async function querySingle(params) {
  // console.log(params);
  let q;
  if (params.id) {
    q = `${url}/${params.id}`;
    const response = await request(q, {
      params: {
        ...eapAppToken,
      },
    });
    const {code, object, extData} = response;
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

export async function querySubList(params) {
  let q;
  if (params.userId) {
    q = `${url}/manager/${params.userId}`;
    const response = await request(q, {
      params: {
        ...eapAppToken,
        status: params.status ? params.status : 'N',
        offset: (params.current - 1) * params.pageSize,
        pageSize: params.pageSize,
      },
    });
    const {code, data, count} = response;
    return {
      subData: data,
      subTotal: count,
    };
  } else {
    return {
      subData: [],
      subTotal: 0,
    };
  }
}

export async function querySubProgress(params) {
  // console.log(params);
  let q;
  if (params.userId) {
    q = `${url}/manager/${params.userId}/progress`;
    const response = await request(q, {
      params: {
        ...eapAppToken,
      },
    });
    const {code, object} = response;
    return {
      subProgress: object,
    };
  } else {
    return {
      subProgress: {},
    };
  }
}

export async function querySubRange(params) {
  // console.log(params);
  let q;
  if (params.userId) {
    q = `${url}/manager/${params.userId}/${params.range}/${params.number}`;
    const response = await request(q, {
      params: {
        ...eapAppToken,
        offset: (params.current - 1) * params.pageSize,
        pageSize: params.pageSize,
      },
    });
    const {code, data, count} = response;
    return {
      subData: data,
      subPage: params.current,
      success: code === '200',
      subTotal: count,
    };
  } else {
    return {
      subData: [],
      subPage: params.current,
      success: false,
      subTotal: 0,
    };
  }
}

export async function querySubSearch(params) {
  // console.log(params);
  let q;
  if (params.userId) {
    q = `${url}/manager/${params.userId}/pagination/query`;
    const response = await request(q, {
      params: {
        q: params.q,
        offset: (params.current - 1) * params.pageSize,
        pageSize: params.pageSize,
        ...eapAppToken,
      },
    });
    const {code, data, count} = response;
    return {
      subData: data,
      success: code === '200',
      subTotal: count,
    };
  } else {
    return {
      subData: [],
      success: false,
      subTotal: 0,
    };
  }
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

