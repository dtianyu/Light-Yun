import request from '@/utils/request';
import { eapAppToken } from '@/pages/comm';

const url = '/jrs/api/eap/productiondemand';

export async function queryList(params) {
  let q = '/' + params.company;
  let f = '/' + params.itemModel + '/' + params.queryDay;
  q = `${url}${q}${f}`;
  const response = await request(q, {
    params: {
      ...eapAppToken,
    },
  });
  const { code, data, count, extData } = response;
  return {
    data,
    success: code === '200',
    total: count,
    extData,
  };
}
