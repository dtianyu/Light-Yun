import moment from 'moment';

export const eapAppToken = {
  appid: '1505912014724',
  token: '0ec858293fccfad55575e26b0ce31177',
};

export const uploadURL = 'https://i2.hanbell.com.cn/FileUploadServer/FileUploadServlet';

export function formatDateTime(value, { length = 10, format = 'YYYY-MM-DD' } = {}) {
  return moment(value.substring(0, length)).format(format);
}

export function utc2Local(
  value,
  { length = 20, utcFormat = 'YYYY-MM-DDTHH:mm:ssZ', localFormat } = {},
) {
  if (localFormat) {
    return moment(value.substring(0, length), utcFormat).format(localFormat);
  } else {
    return moment(value.substring(0, length), utcFormat);
  }
}

export function local2UTC(date) {
  return moment.utc(date).format();
}

export function getMonth() {
  return moment().month() + 1;
}
