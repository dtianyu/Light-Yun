import React, { useEffect, useState } from 'react';
import { Select } from 'antd';

const { Option } = Select;

const ProductCategorySelect = (props) => {
  const [data, setData] = useState([]);

  useEffect(() => {}, []);

  const selectChanged = (selected) => {
    if (props.onChange) {
      props.onChange(selected);
    }
  };

  return (
    <Select
      value={props.value}
      allowClear={true}
      placeholder={props.placeholder || '产品大类'}
      filterOption={false}
      style={props.width ? { width: props.width } : { width: '100%' }}
      disabled={props.disabled}
      onChange={selectChanged}
    >
      <Option value="P">P-真空</Option>
      <Option value="AJ">AJ-空压机体</Option>
    </Select>
  );
};

export default ProductCategorySelect;
