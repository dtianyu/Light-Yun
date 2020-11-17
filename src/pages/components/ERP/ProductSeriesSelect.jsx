import React, { useEffect, useState } from 'react';
import { Select } from 'antd';

const { Option } = Select;

const ProductSeriesSelect = (props) => {
  const [data, setData] = useState([]);
  const [itemModel, setItemModel] = useState('');

  useEffect(() => {}, []);

  const selectChanged = (selected) => {
    setItemModel(selected);
    if (props.onChange) {
      props.onChange(selected);
    }
  };

  return (
    <Select
      value={props.value}
      allowClear={true}
      placeholder={props.placeholder || '产品类别'}
      filterOption={false}
      style={props.width ? { width: props.width } : { width: '100%' }}
      disabled={props.disabled}
      onChange={selectChanged}
    >
      <Option value="PS">PS系列</Option>
      <Option value="PR">PR系列</Option>
      <Option value="PD">PD系列</Option>
      <Option value="PL">PL系列</Option>
    </Select>
  );
};

export default ProductSeriesSelect;
