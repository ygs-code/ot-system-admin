import {Input, message} from "antd";
import {getUserList, removeUser} from "src/assets/js/request";
import setBreadcrumbAndTitle from "src/components/setBreadcrumbAndTitle";
import TableButton from "src/components/TableButton";
import {tablePage} from "src/components/TablePage";
import {addRouterApi} from "src/router";
import React, {Component} from "react";
// 权限控制
@setBreadcrumbAndTitle((props) => ({
  //设置面包屑和标题
  breadcrumb: [
    {
      label: "用户管理",
    },
  ],
  title: "用户管理",
}))
@addRouterApi
@tablePage
class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // // 获取默认搜索参数
  // getDefaultSearchParams = () => {
  //   return {
  //     status: ""
  //   };
  // };

  // 定义搜索栏字段
  getSearchFields = () => {
    return [
      {
        label: "用户名称",
        name: "name",
        type: "input",
        span: 1,
      },
      {
        label: "用户ID",
        name: "id",
        type: "input",
      },
      {
        label: "用户Email",
        name: "email",
        type: "input",

        render: (props) => {
          return <Input {...props}></Input>;
        },
      },
      {
        label: "用户手机",
        name: "phone",
        type: "input",
        render: (props) => {
          return <Input {...props}></Input>;
        },
      },
      {
        label: "用户类型",
        name: "type",
        type: "select",
        props: {
          options: [
            {
              label: "全部类型",
              value: "",
            },
            {
              label: "管理员",
              value: "1",
            },
            {
              label: "会员",
              value: "2",
            },
          ],
        },
        itemProps: {},
        options: {},
      },
    ];
  };

  // 定义Tab字段
  getTabFilterItems = () => {
    return [];
  };

  // 定义表头字段
  getColumns = () => {
    const {
      pushRoute,
      routePaths: {userManagementDetails, userRoleDetails} = {},
    } = this.props;
    return [
      {
        title: "用户ID",
        dataIndex: "id",
        key: "id",
      },
      {
        title: "用户名称",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "Email",
        dataIndex: "email",
        key: "email",
      },
      {
        title: "手机",
        dataIndex: "phone",
        key: "phone",
      },
      {
        title: "用户类型",
        dataIndex: "type",
        key: "type",
        render: (text) => {
          return (
            [
              {
                label: "管理员",
                value: 1,
              },
              {
                label: "会员",
                value: 2,
              },
            ].find((item) => {
              return item.value === text;
            }) || {}
          ).label;
        },
      },

      {
        title: "创建时间",
        dataIndex: "createTime",
        key: "createTime",
      },
      {
        title: "更新时间",
        dataIndex: "updateTime",
        key: "updateTime",
      },
      {
        title: "操作",
        dataIndex: "actions",
        key: "actions",
        width: 300,
        render: (text, row) => {
          const {id} = row;

          return (
            <TableButton
              render={[
                {
                  label: "编辑", // 按钮文字
                  status: true, //权限控制
                  props: {
                    onClick: () => {
                      pushRoute({
                        path: userManagementDetails,
                        params: {
                          action: "edit",
                          id,
                        }, // 地址传参
                      });
                    },
                  },
                },
                {
                  label: "查看", // 按钮文字
                  status: true, //权限控制
                  props: {
                    onClick: () => {
                      pushRoute({
                        path: userManagementDetails,
                        params: {
                          action: "view",
                          id,
                        }, // 地址传参
                      });
                    },
                  },
                },
                {
                  showPopconfirm: true, // 是否需要弹窗提示
                  // confirmInfo: "你确定要发布该标签吗？", //弹窗信息
                  label: "删除", // 按钮文字
                  status: true, //权限控制
                  props: {
                    onClick: async () => {
                      const {message: mgs} = await removeUser(id);
                      message.success(mgs);
                      this.loadTableData();
                    },
                  },
                },
                {
                  label: "查看拥有角色权限", // 按钮文字
                  status: true, //权限控制
                  props: {
                    onClick: () => {
                      pushRoute({
                        path: userRoleDetails,

                        params: {
                          action: "view",
                          id,
                        }, // 地址传参
                      });
                    },
                  },
                },
              ]}
            />
          );
        },
      },
    ];
  };

  /**
   * 定义表格的数据加载功能
   */
  tableDataLoader = async (searchParams = {}) => {
    const {data} = await getUserList(searchParams);

    return data;
  };

  getTableProps = () => {
    return {};
  };
  componentDidMount() {}
  render() {
    return (
      <div className="table-page">
        {this.renderSearch({
          shrinkLength: 5,
          initialValues: {
            type: "",
          },
        })}
        {this.renderTable({
          rowKey: "id",
        })}
      </div>
    );
  }
}
export default Index;
