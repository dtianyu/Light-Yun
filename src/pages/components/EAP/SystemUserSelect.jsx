import React, { useEffect, useState } from 'react';
import debounce from 'lodash/debounce';
import { connect } from 'umi';
import { Select, Spin } from 'antd';

const { Option } = Select;

const SystemUserSelect = (props) => {
  const [data, setData] = useState([]);

  const { queryData, dispatch, loading } = props;
  const { mode, value, disabled } = props;

  useEffect(() => {
    if (queryData && queryData.length > 0) {
      setData(queryData);
    }
  }, [queryData]);

  let fetchQuery = (value) => {
    if (dispatch) {
      dispatch({
        type: 'systemUserModel/fetchQuery',
        payload: {
          q: value,
        },
      });
    }
  };

  fetchQuery = debounce(fetchQuery, 1500);

  const selectChange = (value) => {
    setData([]);
    if (props.onChange) {
      props.onChange(value);
    }
  };

  return (
    <Select
      mode={mode ? mode : 'tags'}
      labelInValue
      value={value}
      placeholder="Select Users"
      notFoundContent={loading ? <Spin size="small" /> : null}
      filterOption={false}
      onSearch={fetchQuery}
      onChange={selectChange}
      style={{ width: '100%' }}
      disabled={disabled}
    >
      {data.map((d) => (
        <Option value={d.userid}>
          {d.userid}
          {d.username}
        </Option>
      ))}
    </Select>
  );
};

export default connect(({ systemUserModel, loading }) => ({
  queryData: systemUserModel.data,
  loading: loading.effects['systemUserModel/fetchQuery'],
}))(SystemUserSelect);
