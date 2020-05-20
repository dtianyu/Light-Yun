import moment from "moment";

export const eapAppToken = {
  appid: '1505912014724',
  token: '0ec858293fccfad55575e26b0ce31177',
};

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

export function utcDate(value) {
  return moment(value, 'YYYY-MM-DDTHH:mm:ssZ').format("YYYY-MM-DD")
}

export function utcFormat(date) {
  return moment.utc(date).format();
}
