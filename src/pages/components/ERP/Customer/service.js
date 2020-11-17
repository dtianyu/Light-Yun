import request from '@/utils/request';
import { eapAppToken } from "@/pages/comm";

const url = '/jrs/api/shberp/cdrcus/pagination';

export async function queryList(params) {
    let q;
    let c = '/' + params.facno;
    let f = '/f';
    let s = '/s';
    if (params.cusno) {
        f = `${f};cusno=${params.cusno}`;
    }
    if (params.cusna) {
        f = `${f};cusna=${params.cusna}`;
    };
    q = `${url}${c}${f}${s}`;
    console.log(q);
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
