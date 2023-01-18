import "./index.less";

import {
  ExclamationCircleOutlined,
  DeleteOutlined,
  CloseCircleOutlined
} from "@ant-design/icons";
import { Button, Modal, Tree, Input, Avatar, List, message } from "antd";
import VirtualList from "rc-virtual-list";
import { tablePage } from "client/component/TablePage";
import { addRouterApi } from "client/router";
import { findTreePath ,deepCopy, CheckDataType, findTreeData, filterTreeData} from "client/utils";
import React, { Component, useState, useEffect } from "react";

const { Search } = Input;
const { confirm } = Modal;
const treeData = [
  {
    title: "parent 1",
    key: "0-0",
    children: [
      {
        title: "parent 1-0",
        key: "0-0-0",
        children: [
          {
            title: "leaf",
            key: "0-0-0-0"
          },
          {
            title: "leaf",
            key: "0-0-0-1"
          }
        ]
      },
      {
        title: "parent 1-1",
        key: "0-0-1",
        children: [
          {
            title: (
              <span
                style={{
                  color: "#1890ff"
                }}>
                sss
              </span>
            ),
            key: "0-0-1-0"
          }
        ]
      }
    ]
  }
];

const TreeContent = (props) => {
  const {
    readOnly,
    defaultExpandAll,
    // expandedKeys,
    treeProps = {},
    valueKey = "key",
    labelKey = "title"
  } = props;

  /*
  checkedChildrenKeys
  selectedChildrenTreeData


  checkedKeys
  selectedTreeData



  treeData
  searchTreeData

  */

  const [checkedKeys, setCheckedKeys] = useState([]);
  const [selectedTreeData, setSelectedTreeData] = useState([]);

  const [checkedChildrenKeys, setCheckedChildrenKeys] = useState([]);
  const [selectedChildrenTreeData, setSelectedChildrenTreeData] = useState([]);
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [listData, setListData] = useState([]);
  const [treeDataKeys, setTreeDataKeys] = useState([]);
  const [searchValue, setSearchValue] = useState([]);
  const [treeData, setTreeData] = useState( [
    {
      title: "parent 1",
      key: "0-0",
      children: [
        {
          title: "parent 1-0",
          key: "0-0-0",
          children: [
            {
              title: "leaf",
              key: "0-0-0-0"
            },
            {
              title: "leaf",
              key: "0-0-0-1"
            }
          ]
        },
        {
          title: "parent 1-1",
          key: "0-0-1",
          children: [
            {
              title: (
                <span
                  style={{
                    color: "#1890ff"
                  }}>
                  sss
                </span>
              ),
              key: "0-0-1-0"
            }
          ]
        }
      ]
    }
  ]);

  

 

   

  const onSelect = (selectedKeys, info) => {
    console.log("selected", selectedKeys, info);
  };

    //搜索
  const  onSearch = (value) => {
      const { treeDataCopy } = this.state
      let {
        searchProps = {},
        searchKeys,
        isKeypadsSearchChange,
        checkedKeys,
        key,
        treeProps: {
          defaultExpandAll, //是否展开
        },
        isSearchExpandAll,
      } = this.props
  
      let searchCode = ''
      searchKeys.forEach((element) => {
        searchCode += `||item['${element}']&&item['${element}'].toString().search(value) != -1`
      })
      searchCode = searchCode.substr(2)
      searchCode = `if(${searchCode}){
         return true
      }else{
        return false;
      }`


      setSearchValue(value.trim())

      setTreeData( value !== ''
      ? filterTreeData(deepCopy(treeDataCopy, []), (item) => {
          return new Function('item', 'value', searchCode)(item, value)
        })
      : deepCopy(treeDataCopy, []))

      // this.setState(
      //   {
      //     searchValue: value.trim(),
      //     treeData:
      //       value !== ''
      //         ? filterTreeData(deepCopy(treeDataCopy, []), (item) => {
      //             return new Function('item', 'value', searchCode)(item, value)
      //           })
      //         : deepCopy(treeDataCopy, []),
      //   },
      //   () => {
      //     // const { checkedKeys, treeData } = this.state
      //     // let flatTreeData = []
      //     // let expandedKeys = []
      //     // let treeDataKeys = []
      //     // this.recursion({
      //     //   treeData,
      //     //   childrenCallback() {},
      //     //   itemCallback(item) {
      //     //     treeDataKeys.push(item.index)
      //     //     isSearchExpandAll && expandedKeys.push(item.index)
      //     //   },
      //     // })
      //     // isSearchExpandAll && this.onExpand(expandedKeys)
  
      //     // this.setState({
      //     //   treeDataKeys,
      //     //   flatTreeData: this.flatMap(this.state.treeData),
      //     // })
      //   }
      // )
    }

  const onCheck = ($checkedKeys, e) => {
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
        return $checkedKeys.includes(item);

        // || !treeDataKeys.includes(item);
      });
    }

    setCheckedKeys($checkedKeys);
    let selectedTreeData = listData.filter((item) => {
      return $checkedKeys.includes(item[valueKey]);
    });
    let selectedChildrenTreeData = listData.filter((item) => {
      return (
        !(item.children && item.children.length) &&
        $checkedKeys.includes(item[valueKey])
      );
    });

    let checkedChildrenKeys = selectedChildrenTreeData.map((item) => {
      return item[valueKey];
    });

    setSelectedTreeData(selectedTreeData);
    setCheckedChildrenKeys(checkedChildrenKeys);
    setSelectedChildrenTreeData(selectedChildrenTreeData);
  };

  const onDelete = (item) => {
    const treePath = findTreePath({
      treeData,
      value: item[valueKey],
      valueKey
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

    console.log("treePath===", treePath);
  };

   const onDeleteAll = () =>  {
    setCheckedKeys([])
    setSelectedTreeData([])
    setCheckedChildrenKeys([])
    setSelectedChildrenTreeData([])
   }

  // 拉平树，一维数组
  const flatMap = (treeData, listData = []) => {
    for (let item of treeData) {
      const { children = [] } = item;

      if (children.length >= 1) {
        flatMap(children, listData);
      }

      listData.push(item);
    }
    return listData;
  };
  const onExpand = (expandedKeys) => {
    setExpandedKeys(expandedKeys);
    // this.setState({
    //   expandedKeys,
    //   autoExpandParent: false,
    // })
  };

  //获取总共标题
  const getTotalTitle = () => {
    const { totalTitle } = props;
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
    const { selectedTitle } = props;
    const titleRE = /\{((?:.|\n)+?)\}/g;
    const str = selectedTitle.match(titleRE);
    if (!str || (str && str.length >= 2)) {
      console.error("selectedTitle标题格式错误，应该为:已选{n}条数据");
      return ["", ""];
    }
    return selectedTitle.split(str);
  };

  useEffect(() => {
    setListData(flatMap(treeData));
  }, []);
  console.log("listData=", listData);
  console.log("checkedKeys=", checkedKeys);
  console.log("selectedTreeData=", selectedTreeData);
  console.log("checkedChildrenKeys=", checkedChildrenKeys);
  console.log("selectedChildrenTreeData=", selectedChildrenTreeData);

  return (
    <div className="tree-content">
      <div>
        <div className="header">
          <div>
            共 <span className="color">100</span> 家
          </div>
          <div className="color select-all">选择全部</div>
          <div className="search">
            <Search
              style={{ marginBottom: 8 }}
              placeholder="搜索门店名称/编码"
              name="keyword"
              onSearch={(v) => {

                console.log('onSearch')
              }}
              onChange={({
               
                  target
                
              }) => {
                console.log('onChange')

                onSearch(target.value)
                // isKeypadsSearchChange && this.handleSearch(v.target.value)
                // onChange(v.target.value)
              }}
            />
          </div>
        </div>
        <div className="tree-box">
          <Tree
            height={388}
            disabled={readOnly}
            checkable
            onExpand={onExpand}
            defaultExpandAll={defaultExpandAll}
            expandedKeys={expandedKeys}
            defaultExpandedKeys={expandedKeys}
            onCheck={(checkedKeys, e, d) => {
              // this.setState({
              //   valueChanged: true
              // });
              onCheck(checkedKeys, e);
            }}
            checkedKeys={checkedKeys}
            {...treeProps}
            treeData={treeData}
            onSelect={(selectedKeys, e) => {
              // const { checked, selected } = e || {};
              // if (checkable || !selected) {
              //   return;
              // }
              // this.setState({
              //   valueChanged: true
              // });
              // this.onCheck(selectedKeys, e);
            }}
          />
        </div>
      </div>
      <div>
        <div className="header">
          <div>
            已选 <span className="color">100</span> 家
          </div>
          <div onClick={()=>{
            onDeleteAll()
          }} className="color delete">
            <DeleteOutlined /> 删除全部
          </div>
        </div>
        <List className="tree-content-list">
          <VirtualList
            data={selectedChildrenTreeData}
            height={400}
            itemHeight={47}
            itemKey="email">
            {(item) => {
              const { key, title } = item;
              console.log("item===", item);
              // return <div >

              // 12323</div>
              return (
                <List.Item
                  size="small"
                  actions={[
                    <CloseCircleOutlined
                      key={item.key}
                      type="close-circle"
                      onClick={() => onDelete(item)}
                    />
                  ]}
                  key={key}>
                  {title}
                </List.Item>
              );
            }}
          </VirtualList>
        </List>
      </div>
    </div>
  );
};

class Index extends Component {
  constructor(props) {
    super(props);
    const { value = [], tableProps = {} } = this.props;
    const { rowKey } = tableProps;
    let selectedRows = value;
    let selectedRowKeys = value.map((item) => {
      return item[rowKey];
    });
    this.state = {
      loading: false,
      isModalOpen: false,
      isOnSelect: false,
      cacheSelectedRows: selectedRows,
      cacheSelectedRowKeys: value.map((item) => {
        return item[rowKey];
      }),
      selectedRows,
      selectedRowKeys
    };
  }

  componentDidMount() {}
  showModal = async () => {
    const { modalProps: { showModal = () => {} } = {} } = this.props;
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
    const { modalProps: { onOk = () => {} } = {}, onChange = () => {} } =
      this.props;
    const {
      cacheSelectedRows,
      cacheSelectedRowKeys,
      selectedRows,
      selectedRowKeys
    } = this.state;
    this.setState(() => ({
      loading: true
    }));
    await onOk({
      cacheSelectedRows,
      cacheSelectedRowKeys,
      selectedRows,
      selectedRowKeys,
      isOnSelect: false
    });
    this.setState({
      isModalOpen: false,
      loading: false,
      cacheSelectedRows: selectedRows,
      cacheSelectedRowKeys: selectedRowKeys,
      isOnSelect: false
    });

    onChange(selectedRows, selectedRowKeys);
  };
  onCancel = async () => {
    const { modalProps: { onCancel = () => {} } = {} } = this.props;
    const {
      isOnSelect,
      cacheSelectedRows,
      cacheSelectedRowKeys,
      selectedRows,
      selectedRowKeys
    } = this.state;
    isOnSelect &&
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
      cacheSelectedRows,
      cacheSelectedRowKeys,
      selectedRows,
      selectedRowKeys,
      isOnSelect: false
    });

    this.setState({
      isModalOpen: false,
      loading: false,
      selectedRows: cacheSelectedRows,
      selectedRowKeys: cacheSelectedRowKeys,
      isOnSelect: false
    });
  };
  onSelect = (selectedRows, selectedRowKeys) => {
    const { tableProps = {} } = this.props;

    const { onSelect = () => {} } = tableProps;
    this.setState({
      isOnSelect: true,
      selectedRows,
      selectedRowKeys
    });

    onSelect(selectedRows, selectedRowKeys);
  };
  render() {
    const {
      modalProps = {},
      buttonText = "请选择",
      tableProps = {},
      value = [],
      request,
      openButton = true
    } = this.props;
    const { isModalOpen, isOnSelect, loading, selectedRowKeys } = this.state;

    return (
      <div className="tree-picker">
        {openButton ? (
          <>
            <Button type="primary" onClick={this.showModal}>
              {buttonText}
            </Button>
            <div>
              <div key={"selected"} className="tree-picker-select">
                已选: <span>({selectedRowKeys.length})</span>
              </div>
            </div>
          </>
        ) : null}

        <Modal
          destroyOnClose={true}
          getContainer={false}
          width={900}
          title="Modal标题"
          open={isModalOpen}
          onCancel={this.onCancel}
          onOk={this.onOk}
          {...modalProps}
          footer={[
            <div key={"selected"} className="tree-picker-select">
              已选: <span>({selectedRowKeys.length})</span>
            </div>,
            <Button key="back" loading={loading} onClick={this.onCancel}>
              关闭
            </Button>,
            <Button
              key="submit"
              type="primary"
              loading={loading}
              onClick={this.onOk}>
              确定
            </Button>
          ]}>
          <div className="tree-picker-content">
            <TreeContent />
          </div>
        </Modal>
      </div>
    );
  }
}

export default Index;
