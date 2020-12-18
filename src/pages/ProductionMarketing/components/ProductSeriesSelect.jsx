import React, { useEffect, useState } from 'react';
import { Select, Spin } from 'antd';
import { queryList } from '@/pages/ProductionMarketing/services/ProductSeries';

const { Option } = Select;

const ProductSeriesSelect = (props) => {
  const [data, setData] = useState([]);
  const [series, setSeries] = useState('');

  const { category } = props;

  useEffect(() => {
    if (category) {
      queryList({ category: category, current: 1, pageSize: 2000 }).then((response) => {
        setData(response.data);
      });
    } else {
      queryList({ current: 1, pageSize: 2000 }).then((response) => {
        setData(response.data);
      });
    }
  }, []);

  useEffect(() => {
    if (category) {
      queryList({ category: category, current: 1, pageSize: 2000 }).then((response) => {
        setData(response.data);
      });
    }
  }, [category]);

  const selectChanged = (selected) => {
    setSeries(selected);
    if (props.onChange) {
      props.onChange(selected);
    }
  };

  return (
    <Select
      value={props.value}
      allowClear={true}
      placeholder={props.placeholder || '产品系列'}
      filterOption={false}
      style={props.width ? { width: props.width } : { width: '100%' }}
      disabled={props.disabled}
      onChange={selectChanged}
    >
      {data.map((d) => (
        <Option key={d.id} value={d.series}>
          {d.description}
        </Option>
      ))}
    </Select>
  );
};

export default ProductSeriesSelect;
