import request from '@/utils/request';
import {eapAppToken} from "@/pages/comm";

const url = '/api/eap/systemname';

export async function queryList(params) {
  console.log(params);
  let q;
  params.name ? q = `${url}/query` : q = `${url}`;

  const response = await request(q, {
    params: {
      q: params.name,
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
