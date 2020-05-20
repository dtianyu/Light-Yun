import React, {useEffect, useState} from "react";
import {Select} from "antd";
import {queryList as querySystemName} from "@/pages/modal/SystemName/service";

const {Option} = Select;

const SystemNameSelect = props => {

  const [data, setData] = useState([]);

  useEffect(() => {
    querySystemName({}).then(response => {
      setData(response.data);
    })
  }, []);

  return (
    <Select
      value={props.value}
      allowClear={true}
      placeholder="Select System"
      filterOption={false}
      style={props.width ? {width: props.width} : {width: '100%'}}
      disabled={props.disabled}
    >
      {data.map(d => (
        <Option value={d.name}>{d.name}-{d.descript}</Option>
      ))}
    </Select>
  )

};

export default SystemNameSelect;
