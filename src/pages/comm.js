import moment from "moment";

export const eapAppToken = {
  appid: '1505912014724',
  token: '0ec858293fccfad55575e26b0ce31177',
};

export const uploadURL = 'https://i2.hanbell.com.cn/FileUploadServer/FileUploadServlet';

export function formatDateTime(value, format) {
  let date, dateFormat;
  if (value.length > 10 && !format) {
    date = value.substring(0, 10);
    dateFormat = 'YYYY-MM-DD';
  } else if (value.length === 10 && !format) {
    date = value;
    dateFormat = 'YYYY-MM-DD';
  } else if (value.length === 8 && !format) {
    date = value;
    dateFormat = 'YYYYMMDD';
  } else {
    date = value;
  }
  return moment(date).format(format ? format : dateFormat);
}

export function utc2Local(value, {length = 20, utcFormat = 'YYYY-MM-DDTHH:mm:ssZ', localFormat} = {}) {
  if (localFormat) {
    return moment(value.substring(0, length), utcFormat).format(localFormat);
  } else {
    return moment(value.substring(0, length), utcFormat);
  }
}

export function local2UTC(date) {
  return moment.utc(date).format();
}
