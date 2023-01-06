import "./index.less";

import { message, Tree } from "antd";
import {
  editPermission,
  getPermissionInfo,
  getPermissionList,
  getUserList
} from "client/assets/js/request";
import FormPage from "client/component/FormPage";
import LazySelect from "client/component/LazySelect";
import setBreadcrumbAndTitle from "client/component/setBreadcrumbAndTitle";
import { mapRedux } from "client/redux";
import { addRouterApi, routePaths } from "client/router";
import React from "react";

class Index extends FormPage {
  constructor(props) {
    super(props);
    this.state = {
      ...this.defaultState(),
      data: {}
    };
  }

  getPermissionList = async () => {
    const data = await getPermissionList({});
  };

  /**
   * 用于将从接口获取到的初始化数据，转换成form需要的格式
   * 这个函数需要在getInitData中手动调用，因此函数名不限于mapInitData
   */
  mapInitData = async (initData) => {
    return initData;
  };
  // 初始化值
  getInitialValues = async () => {
    const {
      match: {
        params: { id }
      }
    } = this.props;

    const { data: { description, name, authKey, parentId } = {} } =
      await getPermissionInfo({
        id
      });

    return await this.mapInitData({
      description,
      id,
      name,
      authKey,
      parentId
    });
  };

  /**
   * 用于将form的字段值转换为接口需要的格式
   */
  mapSubmitData = (formData) => {
    return formData;
  };
  // 提交请求到接口
  onSubmitForm = async (formData) => {
    const {
      history: { back }
    } = this.props;
    const values = await this.mapSubmitData(formData);

    const { message: mgs } = await editPermission({ ...values });

    message.success(mgs);
    setTimeout(() => {
      back();
    }, 500);
  };
  getFields = () => {
    // 权限名称	权限ID	权限parentID	权限key	描述
    return [
      {
        type: "section",
        title: "详情基本设置",
        items: [
          {
            label: "权限ID",
            name: "id",
            itemProps: {},
            // type: "input",
            // labelCol: { span: 5 },
            // wrapperCol: { span: 10 },

            render: (props) => {
              const { value } = props;

              return <div>{value}</div>;
            },
            rules: [
              // {
              //   required: true,
              //   message: "Please input your username1"
              // }
            ]
          },
          {
            label: "权限名称",
            name: "name",
            type: "input",
            props: {
              showCount: true,
              maxLength: 20
            },
            // labelCol: { span: 5 },
            // wrapperCol: { span: 10 },
            rules: [
              {
                required: true,
                message: "请输入权限名称"
              }
            ]
          },

          {
            label: "权限key",
            name: "authKey",
            type: "input",
            props: {
              showCount: true,
              maxLength: 100
            },
            // labelCol: { span: 5 },
            // wrapperCol: { span: 10 },
            rules: [
              {
                required: true,
                message: "请输入权限名称"
              }
            ]
          },

          {
            label: "权限parentID",
            name: "parentId",
            type: "input",
            props: {
              showCount: true,
              maxLength: 100
            },
            // labelCol: { span: 5 },
            // wrapperCol: { span: 10 },
            render: (props) => {
              const { value, onChange } = props;
              return (
                <LazySelect
                  value={value}
                  onChange={onChange}
                  defaultOptions={[
                    {
                      name: "账号管理",
                      id: "4"
                    }
                  ]}
                  fieldNames={{
                    label: "name",
                    value: "id"
                  }}
                  searchKey={"name"}
                  loadData={async (searchParams) => {
                    return await getPermissionList(searchParams);
                  }}
                />
              );
            },
            rules: [
              {
                required: true,
                message: "请输入权限名称"
              }
            ]
          },

          {
            label: "描述",
            name: "description",
            type: "textArea",
            props: {
              showCount: true,
              maxLength: 200
            },
            // labelCol: { span: 5 },
            // wrapperCol: { span: 10 },
            rules: [
              {
                required: true,
                message: "请输入描述"
              }
            ]
          }
        ]
      }
    ];
  };

  // // 底部按钮
  // getFooter = () => {
  //   return (
  //     <div className="button-box">
  //       <Button type="primary" onClick={() => {}}>
  //         确认
  //       </Button>
  //       <Button>返回</Button>
  //     </div>
  //   );
  // };
  componentDidMount() {}
  render() {
    return (
      <div className="form-page account-management-details">
        {this.renderForm()}
      </div>
    );
  }
}

export default mapRedux()(
  // 权限控制
  setBreadcrumbAndTitle({
    //设置面包屑和标题
    breadcrumb: [
      {
        label: "权限管理",
        path: routePaths.permissionManagement
      },
      {
        label: "详情"
        // href: "http://localhost:3000/index",
        // path: "/",
        // component: ""
      }
      // {
      //   label: "菜单3",
      //   // href: "http://localhost:3000/index",
      //   // path: "/",
      //   component: "",
      // },
    ]
    // title: "主页"
  })(addRouterApi(Index))
);
