import React, { useEffect, useState } from 'react';
import { Select } from 'antd';
import { queryList as querySystemName } from '@/pages/components/EAP/SystemName/service';

const { Option } = Select;

const SystemNameSelect = (props) => {
  const [data, setData] = useState([]);
  const [systemName, setSystemName] = useState('');

  useEffect(() => {
    querySystemName({}).then((response) => {
      setData(response.data);
    });
  }, []);

  const selectChanged = (selected) => {
    setSystemName(selected);
    if (props.onChange) {
      props.onChange(selected);
    }
  };

  return (
    <Select
      value={props.value}
      allowClear={true}
      placeholder="Select System"
      filterOption={false}
      style={props.width ? { width: props.width } : { width: '100%' }}
      disabled={props.disabled}
      onChange={selectChanged}
    >
      {data.map((d) => (
        <Option value={d.name}>
          {d.name}-{d.descript}
        </Option>
      ))}
    </Select>
  );
};

export default SystemNameSelect;
