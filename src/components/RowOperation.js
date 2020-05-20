import {Dropdown, Menu} from "antd";
import {DownOutlined} from "@ant-design/icons";
import React from "react";
import * as PropTypes from "prop-types";

export const RowOperation = ({item, operate}) => (
  <Dropdown
    overlay={
      <Menu onClick={async ({key}) => operate(key, item)}>
        <Menu.Item key="0">查看</Menu.Item>
        {item.status === 'N' ? (<Menu.Item key="e">修改</Menu.Item>) : null}
        {item.status === 'N' ? (<Menu.Item key="d">删除</Menu.Item>) : null}
        {item.status === 'N' ? (<Menu.Item key="v">确认</Menu.Item>) : null}
        {item.status === 'V' ? (<Menu.Item key="r">还原</Menu.Item>) : null}
      </Menu>
    }
  >
    <a>
      操作 <DownOutlined/>
    </a>
  </Dropdown>
);
RowOperation.propTypes = {
  item: PropTypes.object.isRequired,
  operate: PropTypes.func.isRequired,
};
