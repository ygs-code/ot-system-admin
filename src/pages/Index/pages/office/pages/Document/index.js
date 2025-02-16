import {message} from "antd";
import {getDocumentList, removeDocument} from "src/assets/js/request";
import setBreadcrumbAndTitle from "src/components/setBreadcrumbAndTitle";
import TableButton from "src/components/TableButton";
import {tablePage} from "src/components/TablePage";
import Tabs from "src/components/Tabs";
import {addRouterApi} from "src/router";
import React, {Component} from "react";

/*eslint no-undef: "error"*/
/*eslint-env process*/
const {
  env: {NODE_ENV, PUBLICPATH, RENDER, CLIENT_PORT, CLIENT_PUBLICPATH} = {}
} = process;

// 权限控制
@setBreadcrumbAndTitle({
  //设置面包屑和标题
  breadcrumb: [
    {
      label: "文档"
    }
  ],
  title: "文档"
})
@addRouterApi
@tablePage
class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabsValue: "0"
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
    const {tabsValue} = this.state;
    return [
      [
        {
          label: "文档标题",
          name: "title",
          type: "input",
          span: 1
        }
      ],
      [
        {
          label: "文档标题",
          name: "title",
          type: "input",
          span: 1
        }
      ]
    ][tabsValue];
  }

  // 定义Tab字段
  getTabFilterItems = () => {
    return [];
  };

  // 定义表头字段
  getColumns = () => {
    const {tabsValue} = this.state;
    const {pushRoute, routePaths: {userRoleDetails} = {}} = this.props;
    return [
      {
        title: "文档标题",
        dataIndex: "title",
        key: "title"
      },
      {
        title: "创建人",
        dataIndex: "createBy",
        key: "createBy"
      },

      {
        title: "操作",
        dataIndex: "actions",
        key: "actions",
        width: 300,
        fixed: "right",
        render: (text, row) => {
          const {id} = row;

          // const { env: { NODE_ENV, PUBLICPATH, RENDER } = {} } = process;

          // process: {
          //   env: {
          //     NODE_ENV, // 环境参数
          //     RENDER, // 环境参数
          //     PUBLICPATH,
          //     ADDRESS,
          //     htmlWebpackPluginOptions: {
          //       ...htmlWebpackPluginOptions,
          //       publicPath
          //     }
          //   }
          // }

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
                      // /office/document/details/:action/:type/:id?

                      const {origin, protocol, hostname} = window.location;
                      window.open(
                        NODE_ENV == "development"
                          ? `${protocol}//${hostname}:${CLIENT_PORT}/office/document/details/edit/document/${id}`
                          : `${protocol}//${hostname}${CLIENT_PUBLICPATH}office/document/details/edit/document/${id}`
                      );
                    }
                  }
                },
                {
                  // showPopconfirm: true, // 是否需要弹窗提示
                  // confirmInfo: "你确定要发布该标签吗？", //弹窗信息
                  label: "查看", // 按钮文字
                  status: true, //权限控制
                  props: {
                    onClick: () => {
                      const {origin, protocol, hostname} = window.location;
                      window.open(
                        NODE_ENV == "development"
                          ? `${protocol}//${hostname}:${CLIENT_PORT}/office/document/details/view/document/${id}`
                          : `${protocol}//${hostname}${CLIENT_PUBLICPATH}office/document/details/view/document/${id}`
                      );
                    }
                  }
                },
                {
                  showPopconfirm: true, // 是否需要弹窗提示
                  // confirmInfo: "你确定要发布该标签吗？", //弹窗信息
                  label: "删除", // 按钮文字
                  status: true, //权限控制
                  props: {
                    onClick: async () => {
                      const {message: mgs} = await removeDocument(id);
                      message.success(mgs);

                      this.loadTableData();
                    }
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
    const {tabsValue} = this.state;

    const mapRequest = {
      0: getDocumentList,
      1: getDocumentList
    };

    const {data} = await mapRequest[tabsValue](searchParams);

    return data;
  };

  getTableProps = () => {
    return {};
  };
  componentDidMount() {}
  render() {
    const {tabsValue} = this.state;
    return (
      <div className="table-page">
        <Tabs
          onChange={(value) => {
            this.setState(
              {
                tabsValue: value
              },

              () => {
                this.onResetForm();
                this.loadTableData();
              }
            );
          }}
          value={tabsValue}
          items={[
            {
              label: "全部文档",
              value: "0"
            },
            {
              label: "我的文档",
              value: "1"
            }
          ]}></Tabs>
        {this.renderSearch({
          shrinkLength: 5,
          initialValues: {
            type: ""
          }
        })}
        {this.renderTable({
          rowKey: "id"
        })}
      </div>
    );
  }
}
export default Index;
