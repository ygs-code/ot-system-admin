

import _ from "lodash";

import { CheckDataType } from "./CheckDataType";

const mapTree = (
  data,
  callback = () => {},
  childrenKey = "children",
  parentData = {}
) => {
  for (let [index, item] of data.entries()) {
    data[index] = {
      ...item,
      ...(callback(item, index, parentData) || {}),
    };
    if (data[index][childrenKey] && data[index][childrenKey].length) {
      data[index] = {
        ...data[index],
        children: mapTree(
          data[index][childrenKey],
          callback,
          childrenKey,
          parentData
        ),
      };
    }
  }

  return data;
};

const mapTreeData = ({
  treeData,
  childrenCallback = () => {},
  itemCallback = () => {},
  nextKey = "children",
}) => {
  for (let item of treeData) {
    if (item[nextKey] && item[nextKey].length) {
      mapTreeData({
        treeData: item[nextKey],
        childrenCallback,
        itemCallback,
        nextKey,
      });
    } else {
      childrenCallback(item);
    }

    itemCallback(item);
  }
};

// 递归treeData 会给 treeData 添加index 索引
const recursionTreeData = (parameter, _index = null) => {
  let {
    treeData = [],
    childrenCallback = () => {},
    itemCallback = () => {},
  } = parameter;
  return treeData.map((item, index) => {
    if (item.children && item.children.length >= 1) {
      item = {
        ...item,
        children: recursionTreeData(
          {
            treeData: item.children,
            childrenCallback,
            itemCallback,
          },
          _index === null ? `${index}` : `${_index}-${index}`
        ),
        index: _index === null ? `${index}` : `${_index}-${index}`,
      };
      childrenCallback(item);
    }
    item = {
      ...item,
      index: _index === null ? `${index}` : `${_index}-${index}`,
    };
    itemCallback(item);
    return item;
  });
};

const getPrefixTreeData = (
  data,
  filter = () => true,
  nextKey = "children",
  treeData = []
) => {
  for (let [index, item] of [...data].entries()) {
    if (filter(item)) {
      treeData.push({ ...item });
      if (item[nextKey].length) {
        let childrenData = getPrefixTreeData(
          item[nextKey],
          filter,
          nextKey,
          []
        );
        if (childrenData.length) {
          treeData[treeData.length - 1][nextKey] = childrenData;
        } else {
          delete treeData[treeData.length - 1][nextKey];
        }
      }
    }
  }
  return treeData;
};

// 用于 查找 树 形结构数据，形成一个路劲数组
const findTreePath = (options, path = []) => {
  const {
    treeData,
    value,
    valueKey,
    nextKey = "children",
    callback = () => {},
  } = options;
  for (var i = 0; i < treeData.length; i++) {
    var tempPath = [...path];

    tempPath.push(treeData[i]);
    if (treeData[i][valueKey] === value) {
      return tempPath;
    }
    if (treeData[i][nextKey] && treeData[i][nextKey].length) {
      const reuslt = findTreePath(
        {
          treeData: treeData[i][nextKey],
          value,
          valueKey,
          callback,
        },
        tempPath
      );
      if (reuslt) {
        callback(reuslt);
        return reuslt;
      }
    }
  }
};

// 过滤数据 可以用于搜索，包括父层的数据树形结构
const filterTreeData = (
  data = [], //树形数组对象
  filterCallback = () => true, //条件的回调函数
  _index = null,
  nextLevelKey = "children"
) => {
  return data.filter((item, index) => {
    if (item[nextLevelKey] && item[nextLevelKey].length >= 1) {
      if (
        filterCallback(
          item,
          _index === null ? `${index}` : `${_index}-${index}`
        )
      ) {
        return true;
      }
      item[nextLevelKey] = filterTreeData(
        item[nextLevelKey],
        filterCallback,
        _index === null ? `${index}` : `${_index}-${index}`,
        nextLevelKey
      );
      return item[nextLevelKey] && item[nextLevelKey].length >= 1;
    } else {
      return filterCallback(
        item,
        _index === null ? `${index}` : `${_index}-${index}`
      );
    }
  });
};

// 复杂类型数据，深拷贝
const deepRemoveNll = (
  source, // 来源数据
  target // 新的数据 如果是数组则为 [], 如果是对象传参则为{}
) => {};

// 复杂类型数据，深拷贝
const deepCopy = (
  source, // 来源数据
  target // 新的数据 如果是数组则为 [], 如果是对象传参则为{}
) => {
  target = target || {};
  for (let i in source) {
    if (source[i] && source.hasOwnProperty(i)) {
      if (typeof source[i] === "object") {
        target[i] = source[i] && source[i].constructor === Array ? [] : {};
        deepCopy(source[i], target[i]);
      } else {
        target[i] = source[i];
      }
    }
  }
  return target;
};

// 搜索到树数据的某一条数据单条 不包括父层数据的
const findTreeData = (
  treeData, // 树形数组或者数组数据
  value, // 需要查找的value
  key, //需要查找数组对象的key
  findValue = null, //获取到的值，这个不用传
  nextKey = "children" // 下一级的key，这个不用传
) => {
  for (let item of treeData) {
    if (value != undefined && item[key] != undefined && item[key] == value) {
      return item;
    }

    if (item && item[nextKey] && item[nextKey].length >= 1) {
      findValue = findTreeData(item[nextKey], value, key, findValue, nextKey);
    }
  }
  return findValue;
};

// 深度比较两个数据
const diffData = (oldData, newData) => {
  let flag = true;
  if (oldData !== newData) {
    return false;
  }
  if (
    (CheckDataType.isObject(oldData) && CheckDataType.isObject(newData)) ||
    (CheckDataType.isArray(oldData) && CheckDataType.isArray(newData))
  ) {
    const oldDataKeys =
      CheckDataType.isObject(oldData) && CheckDataType.isObject(newData)
        ? Object.keys(oldData)
        : oldData;
    const newDataKeys =
      CheckDataType.isObject(oldData) && CheckDataType.isObject(newData)
        ? Object.keys(newData)
        : newData;
    if (oldDataKeys.length !== oldDataKeys.length) {
      return false;
    }
    for (let [index, elem] of oldDataKeys.entries()) {
      if (elem !== newDataKeys[index]) {
        return false;
      }
      if (
        (CheckDataType.isObject(elem) &&
          CheckDataType.isObject(newDataKeys[index])) ||
        (CheckDataType.isArray(elem) &&
          CheckDataType.isArray(newDataKeys[index]))
      ) {
        flag = diffData(elem, newDataKeys[index]);
      }
    }
  }
  return flag;
};

const transformData = (source, path = "", obj = {}, type = "object") => {
  type = CheckDataType.isArray(source) ? "array" : "object";

  if (source && typeof source === "object") {
    for (let key in source) {
      if (source.hasOwnProperty(key)) {
        type = CheckDataType.isArray(source) ? "array" : "object";
        if (CheckDataType.isArray(source) || CheckDataType.isObject(source)) {
          transformData(
            source[key],
            type === "object"
              ? path
                ? `${path}.${key}`
                : key
              : path
              ? `${path}[${key}]`
              : `[${key}]`,
            obj,
            type
          );
        }

        if (
          !(
            CheckDataType.isArray(source[key]) ||
            CheckDataType.isObject(source[key])
          )
        ) {
          obj[
            type === "object"
              ? path
                ? `${path}.${key}`
                : key
              : path
              ? `${path}[${key}]`
              : `[${key}]`
          ] = source[key];
        }
      }
    }
  }

  return obj;
};

const mergeData = (old, source) => {
  let obj = {
    ...transformData(old),
    ...transformData(source),
  };
  let data = CheckDataType.isArray(old) ? [] : {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      _.set(data, key, obj[key]);
    }
  }
  return data;
};

function findParent(options, path = []) {
  const {
    data = [],
    value,
    valueKey,
    childrenKey = "children",
  } = options;

  for (const item of data) {
    // 当前路径包含这个项的code
    const newPath = [...path, item];

    if (item[valueKey] === value) {
      // 找到目标code，返回当前路径
      return newPath;
    }

    // 如果有子项，递归查找子项
    if (item[childrenKey] && item[childrenKey].length > 0) {
      const result = findParent(
        { data: item[childrenKey], value, valueKey, childrenKey },
        newPath
      );
      if (result) return result; // 如果在子项中找到目标，返回结果
    }
  }
  // 如果在当前路径下没有找到目标，返回null
  return null;
}

export {
  mapTreeData,
  transformData,
  getPrefixTreeData,
  mergeData,
  recursionTreeData,
  filterTreeData,
  deepCopy,
  diffData,
  findTreeData,
  findTreePath,
  findParent,
  mapTree,
};
