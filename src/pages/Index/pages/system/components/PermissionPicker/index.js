import "./index.less";

import {
  getPermissionList,
  getRolePermissionList,
} from "src/assets/js/request";
import TreePicker from "src/components/TreePicker";
import { findTreeData } from "src/utils";
import React, { useEffect } from "react";

export const transformTreeData = (data, treeData = []) => {
  if (!data.length) {
    return treeData;
  }
  for (let index = data.length - 1; index >= 0; index--) {
    const item = data[index];
    const { parentId, id } = item;
    if (parentId === null) {
      treeData.push(item);
      data.splice(index, 1);
    } else {
      const $data = findTreeData(treeData, parentId, "id", "children");
      if ($data) {
        const { children = [] } = $data;
        $data.children = [...children, item];
        data.splice(index, 1);
      }
    }
  }
  return transformTreeData(data, treeData);
};

const Picker = (props) => {
  const { searchProps = {}, readOnly } = props;

  return (
    <TreePicker
      {...props}
      searchProps={{
        placeholder: "搜索权限名称/ID",
        ...searchProps,
      }}
      buttonText={readOnly ? "查看" : "请选择"}
      isSelectLast={false}
      isSelectLastHasParent
      requestParameter={{
        pageNum: 1,
        pageSize: 10000,
      }}
      promiseRequest={getPermissionList}
      searchKeys={["name", "id"]}
      totalTitle={"一共有{n}条数据"}
      selectedTitle={"已选{n}条数据"}
      valueKey="id"
      titleKey="name"
      nextLevelKey="children"
      dataMapper={(data) => {
        data = transformTreeData(data.data.list);
        return data;
      }}
    />
  );
};

export default (props) => {
  const { roleId, onChange } = props;

  useEffect(() => {
    roleId &&
      getRolePermissionList({
        roleId,
        pageNum: 1,
        pageSize: 10000,
      }).then((data) => {
        const { data: { list = [] } = {} } = data;
        onChange({
          checkedKeys: list.map((item) => {
            return item.permissionId;
          }),
        });
      });
  }, [roleId]);

  return <Picker {...props} />;
};
