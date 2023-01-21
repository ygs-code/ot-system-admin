import "./index.less";

import {
  ExclamationCircleOutlined,
  DeleteOutlined,
  CloseCircleOutlined
} from "@ant-design/icons";
import { Button, Modal, Tree, Input, Tooltip, List, message } from "antd";
import VirtualList from "rc-virtual-list";
import { tablePage } from "client/component/TablePage";
import { addRouterApi } from "client/router";
import {
  findTreeData,
  findTreePath,
  deepCopy,
  recursionTreeData,
  filterTreeData
} from "client/utils";
import React, { Component, useState, useEffect } from "react";

const { Search } = Input;
const { confirm } = Modal;

const TreeContent = (props) => {
  const {
    readOnly,
    defaultExpandAll,
    totalTitle,
    selectedTitle,
    treeProps = {},
    valueKey = "key",
    titleKey = "title",
    searchKeys,
    nextLevelKey = "children",
    onChange,
    searchProps,
    promiseRequest,
    requestParameter,
    dataMapper,
    value,
    isSelectLast,
    isSelectLastHasParent
  } = props;
 
  const [valueChanged, setValueChanged] = useState(false);
  const [checkedKeys, setCheckedKeys] = useState([]);
  const [selectedTreeData, setSelectedTreeData] = useState([]);
  const [checkedChildrenKeys, setCheckedChildrenKeys] = useState([]);
  const [selectedChildrenTreeData, setSelectedChildrenTreeData] = useState([]);
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [listData, setListData] = useState([]);
  const [treeDataKeys, setTreeDataKeys] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [cacheTreeData, setCacheTreeData] = useState([]);
  const [treeData, setTreeData] = useState([]);

  const onSelectedAll = () => {
    onCheck(treeDataKeys, {
      checked: true
    });
  };

  const loop = (data) => {
    return data.map((item) => {
      const strTitle = item[titleKey];
      const index = strTitle.indexOf(searchValue);
      const beforeStr = strTitle.substring(0, index);
      const afterStr = strTitle.slice(index + searchValue.length);
      const title =
        index > -1 ? (
          <span
            className={
              checkedKeys.includes(item[valueKey]) ? "selected-tree" : ""
            }>
            {beforeStr}
            <span className="site-tree-search-value">{searchValue}</span>
            {afterStr}
          </span>
        ) : (
          <span
            className={
              checkedKeys.includes(item[valueKey]) ? "selected-tree" : ""
            }>
            {strTitle}
          </span>
        );

      if (item[nextLevelKey]) {
        return {
          title,
          key: item[valueKey],
          children: loop(item[nextLevelKey])
        };
      }
      return {
        title,
        key: item[valueKey]
      };
    });
  };

  const mapKey = (data, callback = () => { }) => {
    return data.map((item) => {
      callback(item);
      return {
        ...item,
        key: item[valueKey],
        title: item[titleKey],
        children:
          item[nextLevelKey] && item[nextLevelKey].length
            ? mapKey(item[nextLevelKey])
            : []
      };
    });
  };

  //搜索
  const onSearch = (value) => {
    let searchCode = "";
    searchKeys.forEach((element) => {
      searchCode += `||item['${element}']&&item['${element}'].toString().search(value) != -1`;
    });
    searchCode = searchCode.substr(2);
    searchCode = `if(${searchCode}){
         return true
      }else{
        return false;
      }`;

    const treeData =
      value !== ""
        ? filterTreeData(
          deepCopy(cacheTreeData, []),
          (item) => {
            return new Function("item", "value", searchCode)(item, value);
          },
          nextLevelKey
        )
        : deepCopy(cacheTreeData, []);

    let treeDataKeys = [];
    recursionTreeData(
      treeData,
      (item) => {
        treeDataKeys.push(item[valueKey]);
      },
      nextLevelKey
    );
    setSearchValue(value.trim());
    setTreeData(treeData);
    setExpandedKeys(treeDataKeys);
    setTreeDataKeys(treeDataKeys);
  };

  const onCheck = ($checkedKeys, e, valueChanged = true) => {
    const { checked, selected } = e || {};

    // 这里需要根据选中的状态保留key
    if (checked || selected) {
      // 增加
      $checkedKeys = checked
        ? [
          ...$checkedKeys.filter((item) => {
            return !checkedKeys.includes(item);
          }),
          ...checkedKeys
        ]
        : $checkedKeys;
    } else {
      // 删除
      $checkedKeys = checkedKeys.filter((item) => {
        return $checkedKeys.includes(item) || !treeDataKeys.includes(item);
      });
    }

    if (isSelectLastHasParent) {
      let $$checkedKeys = [...$checkedKeys];

      for (let item of $checkedKeys) {
        const treePath = findTreePath({
          treeData: cacheTreeData,
          value: item,
          valueKey,
          nextKey: nextLevelKey
        });
        $$checkedKeys = $$checkedKeys.concat(
          treePath.map((item) => {
            return item[valueKey];
          })
        );
      }
      $checkedKeys = [...new Set($$checkedKeys)];
    }

    let selectedTreeData = listData.filter((item) => {
      return $checkedKeys.includes(item[valueKey]);
    });

    let selectedChildrenTreeData = listData.filter((item) => {
      return (
        !(item[nextLevelKey] && item[nextLevelKey].length) &&
        $checkedKeys.includes(item[valueKey])
      );
    });

    let checkedChildrenKeys = selectedChildrenTreeData.map((item) => {
      return item[valueKey];
    });

    setCheckedKeys($checkedKeys);
    setSelectedTreeData(selectedTreeData);
    setCheckedChildrenKeys(checkedChildrenKeys);
    setSelectedChildrenTreeData(selectedChildrenTreeData);

    onChange({
      checkedKeys: $checkedKeys,
      selectedTreeData,
      checkedChildrenKeys,
      selectedChildrenTreeData,
      valueChanged,
      cacheTreeData,
      treeData,
      listData
    });
  };

  const onDelete = (item) => {
    if (item[nextLevelKey] && item[nextLevelKey].length) {
      return message.warning("当前级不是最后一级，所以删除子级才能删除该级。");
    }

    const treePath = findTreePath({
      treeData: cacheTreeData,
      value: item[valueKey],
      valueKey,
      nextKey: nextLevelKey
    });

    let $checkedKeys = treePath.map((item) => {
      return item[valueKey];
    });

    $checkedKeys = checkedKeys.filter((item) => {
      return !$checkedKeys.includes(item);
    });

    onCheck($checkedKeys, {
      checked: false
    });
  };

  const onDeleteAll = () => {
    // setValueChanged(true);
    setCheckedKeys([]);
    setSelectedTreeData([]);
    setCheckedChildrenKeys([]);
    setSelectedChildrenTreeData([]);
    onChange({
      checkedKeys: [],
      selectedTreeData: [],
      checkedChildrenKeys: [],
      selectedChildrenTreeData: [],
      valueChanged: true,
      cacheTreeData,
      treeData,
      listData
    });
  };

  // 拉平树，一维数组
  const flatMap = (treeData) => {
    let listData = [];
    recursionTreeData(
      treeData,
      (item) => {
        // delete item[nextLevelKey];
        listData.push(item);
      },
      nextLevelKey
    );

    return listData;
  };
  const onExpand = (expandedKeys) => {
    setExpandedKeys(expandedKeys);
  };

  //获取总共标题
  const getTotalTitle = () => {
    const titleRE = /\{((?:.|\n)+?)\}/g;
    const str = totalTitle.match(titleRE);
    if (!str || (str && str.length >= 2)) {
      console.error("totalTitle标题格式错误，应该为:一共有{n}条数据");
      return ["", ""];
    }
    return totalTitle.split(str);
  };
  // 获取选中标题
  const getSelectedTitle = () => {
    const titleRE = /\{((?:.|\n)+?)\}/g;
    const str = selectedTitle.match(titleRE);
    if (!str || (str && str.length >= 2)) {
      console.error("selectedTitle标题格式错误，应该为:已选{n}条数据");
      return ["", ""];
    }
    return selectedTitle.split(str);
  };

  const getTreeData = async () => {
    return await promiseRequest(requestParameter);
  };

  const getTitle = (item) => {
    const treePath = findTreePath({
      treeData: cacheTreeData,
      value: item[valueKey],
      valueKey,
      nextKey: nextLevelKey
    });

    const title = treePath.map((item) => item[titleKey]).join(" - ");

    return (
      <Tooltip placement="top" title={title}>
        <div className="list-text"> {title} </div>
      </Tooltip>
    );
  };

  useEffect(() => {
    getTreeData().then((data) => {
      const treeData = dataMapper(data);
      let treeDataKeys = [];
      recursionTreeData(
        treeData,
        (item) => {
          treeDataKeys.push(item[valueKey]);
        },
        nextLevelKey
      );
      setTreeData(treeData);
      setCacheTreeData(treeData);
      setListData(flatMap(treeData));
      setTreeDataKeys(treeDataKeys);
    });
  }, []);

  useEffect(() => {
    const { checkedKeys = [], checkedChildrenKeys = [] } = value;

    if (listData.length > 1) {
      
      onCheck(
        checkedKeys.length > checkedChildrenKeys.length
          ? checkedKeys
          : checkedChildrenKeys,
        {
          checked: true
        },
        false
      );
      onExpand(
        checkedKeys.length > checkedChildrenKeys.length
          ? checkedKeys
          : checkedChildrenKeys
      );
    }
  }, [listData.length > 1, value]);

  return (
    <div className="tree-content">
      <div>
        <div className="header">
          <div>
            {getTotalTitle()[0]}{" "}
            <span className="tree-picker-color">
              {isSelectLast
                ? listData.filter((item) => {
                  return !(item[nextLevelKey] && item[nextLevelKey].length);
                }).length
                : listData.length}
            </span>{" "}
            {getTotalTitle()[1]}
          </div>
          {!readOnly ? (
            <div
              className="tree-picker-color tree-picker-select-all"
              onClick={() => {
                onSelectedAll();
              }}>
              选择全部
            </div>
          ) : (
            <div></div>
          )}

          <div className="search">
            <Search
              style={{ marginBottom: 8 }}
              placeholder="搜索门店名称/编码"
              name="keyword"
              {...searchProps}
              onSearch={({ target }) => {
                onSearch(target.value);
              }}
              onChange={({ target }) => {
                onSearch(target.value);
              }}
            />
          </div>
        </div>
        <div className="tree-box">
          <Tree
            height={397}
            checkable
            disabled={readOnly}
            {...treeProps}
            onExpand={onExpand}
            defaultExpandAll={defaultExpandAll}
            expandedKeys={expandedKeys}
            defaultExpandedKeys={expandedKeys}
            onCheck={(checkedKeys, e, d) => {
              const { event } = e || {};
              if (event !== "check") {
                return;
              }

              onCheck(checkedKeys, e);
            }}
            checkedKeys={checkedChildrenKeys}
            treeData={loop(treeData)}
            onSelect={(selectedKeys, e) => {
              const { selected, event } = e || {};
              if (event !== "select" || !selected) {
                return;
              }
              const data = findTreeData(
                treeData,
                selectedKeys[0],
                valueKey,
                nextLevelKey
              );
              if (data[nextLevelKey] && data[nextLevelKey].length) {
                return;
              }
              onCheck(selectedKeys, e);
            }}
          />
        </div>
      </div>
      <div>
        <div className="header">
          <div>
            {getSelectedTitle()[0]}{" "}
            <span className="tree-picker-color">
              {isSelectLast ? checkedChildrenKeys.length : checkedKeys.length}
            </span>{" "}
            {getSelectedTitle()[1]}
          </div>

          {!readOnly ? (
            <div
              onClick={() => {
                onDeleteAll();
              }}
              className="tree-picker-color delete">
              <DeleteOutlined /> 删除全部
            </div>
          ) : (
            <div></div>
          )}
        </div>
        <List className="tree-content-list">
          <VirtualList
            data={isSelectLast ? selectedChildrenTreeData : selectedTreeData}
            height={460}
            itemHeight={39}
            itemKey={valueKey}>
            {(item) => {
              return (
                <List.Item
                  size="small"
                  actions={
                    !readOnly
                      ? [
                        <CloseCircleOutlined
                          key={item[valueKey]}
                          type="close-circle"
                          onClick={() => onDelete(item)}
                        />
                      ]
                      : []
                  }
                  key={item[valueKey]}>
                  {getTitle(item)}
                </List.Item>
              );
            }}
          </VirtualList>
        </List>
      </div>
    </div>
  );
};

TreeContent.defaultProps = {
  readOnly: false,
  onChange: () => { },
  defaultExpandAll: false,
  totalTitle: "一共有{n}条数据",
  selectedTitle: "已选{n}条数据",
  treeProps: {},
  valueKey: "key",
  titleKey: "title",
  searchKeys: [],
  nextLevelKey: "children",
  searchProps: {},
  promiseRequest: () => { },
  requestParameter: {},
  dataMapper: (data) => data,
  value: {},
  isSelectLast: true,
  isSelectLastHasParent: false
};

class Index extends Component {
  constructor(props) {
    super(props);
    const { value = {} } = this.props;

    this.state = {
      loading: false,
      isModalOpen: false,
      valueChanged: false,
      value,
      cacheValue: value
    };
  }

  componentDidMount() { }
  showModal = async () => {
    const { modalProps: { showModal = () => { } } = {} } = this.props;
    this.setState(() => ({
      loading: true
    }));
    await showModal();
    this.setState({
      isModalOpen: true,
      loading: false
    });
  };
  onOk = async () => {
    const { modalProps: { onOk = () => { } } = {}, onChange = () => { } } =
      this.props;
    const { value = {} } = this.state;
    this.setState(() => ({
      loading: true
    }));
    await onOk({
      ...value
    });
    this.setState({
      isModalOpen: false,
      loading: false,
      cacheValue: {
        ...value
      },
      value: {
        ...value
      }
    });

    onChange({
      ...value
    });
  };
  onCancel = async () => {
    const { modalProps: { onCancel = () => { } } = {} } = this.props;
    const { value, cacheValue } = this.state;

    const { valueChanged } = value;

    valueChanged &&
      (await new Promise((resolve, reject) => {
        confirm({
          icon: <ExclamationCircleOutlined />,
          content: "已选数据已更改，但未保存，您确定关闭吗？",
          onOk() {
            resolve();
          },
          onCancel() {
            reject();
          }
        });
      }));

    await onCancel({
      ...cacheValue,
      valueChanged: false
    });

    this.setState({
      isModalOpen: false,
      loading: false,
      value: {
        ...cacheValue,
        valueChanged: false
      }
    });
  };

  componentDidUpdate(preProps) {
    const {
      value: {
        checkedChildrenKeys: prePropsCheckedChildrenKeys = [],
        checkedKeys: prePropsCheckedKeys = []
      } = {}
    } = preProps;

    const { value = {} } =
      this.props;

    const { checkedChildrenKeys = [], checkedKeys = [] } =
      value

    if (
      prePropsCheckedChildrenKeys.length !== checkedChildrenKeys.length ||
      prePropsCheckedKeys.length !== checkedKeys.length
    ) {
      this.setState({
        value
      })
    }
  }

  render() {
    const {
      modalProps = {},
      buttonText = "请选择",
      tableProps = {},
      request,
      openButton = true,
      readOnly,
      isSelectLast = true
    } = this.props;
    const {
      isModalOpen,
      value: { checkedChildrenKeys = [], checkedKeys = [] } = {},
      loading
    } = this.state;
   
    return (
      <div className="tree-picker">
        {openButton ? (
          <>
            <Button type="primary" onClick={this.showModal}>
              {buttonText}
            </Button>
            <div>
              <div key={"selected"} className="tree-picker-select">
                已选:{" "}
                <span>
                  (
                  {isSelectLast
                    ? checkedChildrenKeys.length
                    : checkedKeys.length}
                  )
                </span>
              </div>
            </div>
          </>
        ) : null}

        <Modal
          destroyOnClose={true}
          width={900}
          title="Modal标题"
          open={isModalOpen}
          onCancel={this.onCancel}
          onOk={this.onOk}
          {...modalProps}
          footer={[
            <div key={"selected"} className="tree-picker-select">
              已选:{" "}
              <span>
                (
                {isSelectLast ? checkedChildrenKeys.length : checkedKeys.length}
                )
              </span>
            </div>,
            <Button key="back" loading={loading} onClick={this.onCancel}>
              关闭
            </Button>,
            !readOnly ? (
              <Button
                key="submit"
                type="primary"
                loading={loading}
                onClick={this.onOk}>
                确定
              </Button>
            ) : null
          ]}>
          <div className="tree-picker-content">
            <TreeContent
              {...this.props}
              onChange={(value) => {
                this.setState({
                  value
                });
              }}
            />
          </div>
        </Modal>
      </div>
    );
  }
}

export default Index;
