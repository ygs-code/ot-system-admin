import "./index.less";

import {
  getPermissionList,
  getRolePermissionList
} from "client/assets/js/request";
import TreePicker from "client/component/TreePicker";
import { findTreeData } from "client/utils";
import React, { useEffect, useState } from "react";

const Picker = (props) => {
  const transformTreeData = (data, treeData = []) => {
    if (!data.length) {
      return treeData;
    }
    let addIds = [];

    for (let [index, item] of data.entries()) {
      const { parentId, id } = item;
      if (parentId === null) {
        addIds.push(id);
        treeData.push(item);
      } else {
        const data = findTreeData(treeData, parentId, "id", "children");
        if (data) {
          const { children = [] } = data;
          data.children = [...children, item];
          addIds.push(id);
        }
      }
    }
    data = data.filter((item) => {
      return !addIds.includes(item.id);
    });
    return transformTreeData(data, treeData);
  };

  return (
    <TreePicker
      //   readOnly
      //   openButton={false}
      {...props}
      isSelectLast={false}
      isSelectLastHasParent
      requestParameter={{
        pageNum: 1,
        pageSize: 10000
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
      modalProps={{
        title: "权限查看"
        //   open: authOpen,
        //   onCancel: async () => {
        //     // this.setState({
        //     //   authOpen: false
        //     // });
        //   },
        //   onOk: async () => {
        //     // this.setState({
        //     //   authOpen: false
        //     // });
        //   }
      }}
    />
  );
};

export default (props) => {
  const { roleId, onChange } = props;

  useEffect(() => {
    getRolePermissionList({
      roleId,
      pageNum: 1,
      pageSize: 10000
    }).then((data) => {
      const { data: { list = [] } = {} } = data;

      onChange({
        checkedKeys: list.map((item) => {
          return item.id;
        })
      });
    });
  }, []);

  console.log("props=", props);
  return <Picker {...props} />;
};
