import request from '@/utils/request';
import { eapAppToken } from '@/pages/comm';

const url = '/jrs/api/eap/salesorderschedule';

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
