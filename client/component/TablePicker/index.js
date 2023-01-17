import "./index.less";

import { Button, Input, Modal } from "antd";
import { getUserList } from "client/assets/js/request";
import TableButton from "client/component/TableButton";
import { tablePage } from "client/component/TablePage";
import { addRouterApi } from "client/router";
import React, { Component } from "react";

@addRouterApi
@tablePage
class TablePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableData: {
        list: [{ title: "你好" }]
      },
      dataSource: []
    };
  }

  // // 获取默认搜索参数
  // getDefaultSearchParams = () => {
  //   return {
  //     status: ""
  //   };
  // };

  // 定义搜索栏字段
  getSearchFields() {
    return [
      {
        label: "用户名称",
        name: "name",
        type: "input",
        span: 1
        // labelCol: { span: 5 },
        // wrapperCol: { span: 10 },
        // rules: [
        //   {
        //     required: true,
        //     message: "Please input your username1",
        //   },
        // ],
      },
      {
        label: "用户ID",
        name: "id",
        type: "input"
        // span: 2
        // labelCol: { span: 5 },
        // wrapperCol: { span: 10 }
        // rules: [
        //   {
        //     required: true,
        //     message: "Please input your username2",
        //   },
        // ],
      },
      {
        label: "用户Email",
        name: "email",
        type: "input",
        // span: 3,
        // labelCol: { span: 3 },
        // wrapperCol: { span: 25 },
        render: (props) => {
          return <Input {...props}></Input>;
        }
        // rules: [
        //   {
        //     required: true,
        //     message: "Please input your username3",
        //   },
        // ],
      },
      {
        label: "用户手机",
        name: "phone",
        type: "input",
        render: (props) => {
          return <Input {...props}></Input>;
        }
        // rules: [
        //   {
        //     required: true,
        //     message: "Please input your username3",
        //   },
        // ],
      },
      {
        label: "用户类型",
        name: "type",
        type: "select",
        props: {
          options: [
            {
              label: "全部类型",
              value: ""
            },
            {
              label: "管理员",
              value: "1"
            },
            {
              label: "会员",
              value: "2"
            }
          ]
        },
        itemProps: {},
        options: {}
        // labelCol: { span: 5 },
        // wrapperCol: { span: 10 },
      }
    ];
  }

  // 定义Tab字段
  getTabFilterItems = () => {
    return [];
  };

  // 定义表头字段
  getTableColumns = () => {
    const { pushRoute, routePaths: { userSetRoleDetails } = {} } = this.props;
    return [
      {
        title: "用户ID",
        dataIndex: "id",
        key: "id"
      },
      {
        title: "用户名称",
        dataIndex: "name",
        key: "name"
      },
      // {
      //   title: "Email",
      //   dataIndex: "email",
      //   key: "email"
      // },
      // {
      //   title: "手机",
      //   dataIndex: "phone",
      //   key: "phone"
      // },

      // {
      //   title: "创建时间",
      //   dataIndex: "createTime",
      //   key: "createTime"
      // },
      // {
      //   title: "更新时间",
      //   dataIndex: "updateTime",
      //   key: "updateTime"
      // },
      {
        title: "操作",
        dataIndex: "actions",
        key: "actions",
        width: 300,
        render: (text, row) => {
          const { id } = row;

          return (
            <TableButton
              render={[
                {
                  // showPopconfirm: true, // 是否需要弹窗提示
                  // confirmInfo: "你确定要发布该标签吗？", //弹窗信息
                  label: "编辑", // 按钮文字
                  status: true, //权限控制
                  props: {
                    onClick: () => {
                      pushRoute({
                        path: userSetRoleDetails,
                        params: {
                          action: "edit",
                          id
                        } // 地址传参
                      });
                    }
                  }
                },
                {
                  // showPopconfirm: true, // 是否需要弹窗提示
                  // confirmInfo: "你确定要发布该标签吗？", //弹窗信息
                  label: "查看拥有角色", // 按钮文字
                  status: true, //权限控制
                  props: {
                    onClick: () => {}
                  }
                },
                {
                  // showPopconfirm: true, // 是否需要弹窗提示
                  // confirmInfo: "你确定要发布该标签吗？", //弹窗信息
                  label: "查看拥有权限", // 按钮文字
                  status: true, //权限控制
                  props: {
                    onClick: () => {}
                  }
                }
              ]}
            />
          );
        }
      }
    ];
  };

  /**
   * 定义表格的数据加载功能
   */
  tableDataLoader = async (searchParams = {}) => {
    // console.log("searchParams==", searchParams);
    // debugger;
    const { data } = await getUserList(searchParams);

    return data;
  };

  getTableProps = () => {
    return {
      isShowSelect: true
      // rowSelection: {
      //   onChange: (selectedRowKeys, selectedRows) => {
      //     console.log(
      //       `selectedRowKeys: ${selectedRowKeys}`,
      //       "selectedRows: ",
      //       selectedRows
      //     );
      //   },
      //   getCheckboxProps: (record) => ({
      //     disabled: record.name === "Disabled User",
      //     // Column configuration not to be checked
      //     name: record.name
      //   })
      // }
    };
  };

  componentDidMount() {}
  render() {
    return (
      <div className="table-page">
        {this.renderSearch({
          shrinkLength: 5,
          initialValues: {
            type: ""
          }
          // style: {
          //   padding: "10px 0",
          // },
        })}

        {this.renderTable({
          rowKey: "id"
        })}
      </div>
    );
  }
}

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false
    };
  }

  componentDidMount() {}
  showModal = async () => {
    const { modalProps: { showModal = () => {} } = {} } = this.props;
    await showModal();
    this.setState({
      isModalOpen: true
    });
  };
  onOk = async () => {
    const { modalProps: { onOk = () => {} } = {} } = this.props;
    await onOk();
    this.setState({
      isModalOpen: false
    });
  };
  onCancel = async () => {
    const { modalProps: { onCancel = () => {} } = {} } = this.props;
    await onCancel();
    this.setState({
      isModalOpen: false
    });
  };
  render() {
    const {
      modalProps = {},
      buttonText = "打开弹窗",
      tableProps = {}
    } = this.props;
    const { isModalOpen } = this.state;

    return (
      <div className="table-picker">
        <Button type="primary" onClick={this.showModal}>
          {buttonText}
        </Button>
        <Modal
          width={800}
          title="Modal标题"
          open={isModalOpen}
          {...modalProps}
          onOk={this.onOk}
          onCancel={this.onCancel}>
          <div className="table-picker-content">
            <TablePage {...tableProps} />
          </div>
        </Modal>
      </div>
    );
  }
}

export { TablePage };
export default Index;
