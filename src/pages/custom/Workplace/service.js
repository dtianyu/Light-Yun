import request from '@/utils/request';
import {eapAppToken, formatDateTime} from "@/pages/comm";

const url = '/api/eap/demands';

export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities(params) {
  return request('/api/activities');
}

export async function queryDemands(params) {
  // console.log(params);
  let q;
  let f = '/f';
  let s = '/s';
  if (Object.keys(params).length === 2) {
    f = `${f};status=N`;
  } else {
    if (params.demanderDeptID) {
      f = `${f};demanderDeptID=${params.demanderDeptID}`;
    }
    if (params.demanderName) {
      f = `${f};demanderName=${params.demanderName}`;
    }
    if (params.demandResume) {
      f = `${f};demandResume=${params.demandResume}`;
    }
    if (params.directorDeptID) {
      f = `${f};directorDeptID=${params.directorDeptID}`;
    }
    if (params.directorID) {
      f = `${f};directorID=${params.directorID}`;
    }
    if (params.directorName) {
      f = `${f};directorName=${params.directorName}`;
    }
    if (params.formdate && params.formdate.length === 2) {
      f = `${f};formdateBegin=${formatDateTime(params.formdate[0])};formdateEnd=${formatDateTime(params.formdate[1])}`;
    }
    if (params.planOverDate && params.planOverDate.length === 2) {
      f = `${f};planOverDateBegin=${formatDateTime(params.planOverDate[0])};planOverDateEnd=${formatDateTime(params.planOverDate[1])}`;
    }
    if (params.realOverDate && params.realOverDate.length === 2) {
      f = `${f};realOverDateBegin=${formatDateTime(params.realOverDate[0])};realOverDateEnd=${formatDateTime(params.realOverDate[1])}`;
    }
    if (params.systemName) {
      f = `${f};systemName=${params.systemName}`;
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

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}
