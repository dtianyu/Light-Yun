import request from '@/utils/request';
import { eapAppToken } from "@/pages/comm";

const url = '/jrs/api/shberp/purvdr/pagination';

export async function queryList(params) {
    // console.log(params);
    let q;
    let c = '/' + params.facno;
    let f = '/f';
    let s = '/s';
    if (params.vdrno) {
        f = `${f};vdrno=${params.vdrno}`;
    }
    if (params.vdrna) {
        f = `${f};vdrna=${params.vdrna}`;
    };
    q = `${url}${c}${f}${s}`;
    const response = await request(q, {
        params: {
            offset: (params.current - 1) * params.pageSize,
            pageSize: params.pageSize,
            ...eapAppToken
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
