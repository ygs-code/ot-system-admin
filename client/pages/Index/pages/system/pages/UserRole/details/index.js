import "./index.less";

import { message } from "antd";
import { editUserRole, getUserRoleInfo } from "client/assets/js/request";
import FormPage from "client/component/FormPage";
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

    const { data: { roleId, userId } = {} } = await getUserRoleInfo({
      id
    });

    return await this.mapInitData({
      roleId,
      id,
      userId
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
    console.log("values===", values);
    const { message: mgs } = await editUserRole({ ...values });

    message.success(mgs);
    setTimeout(() => {
      back();
    }, 500);
  };
  getFields = () => {
    return [
      {
        type: "section",
        title: "详情基本设置",
        items: [
          {
            label: "用户&角色ID",
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
            label: "角色ID",
            name: "roleId",
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
                message: "请输入角色名称"
              }
            ]
          },
          {
            label: "用户ID",
            name: "userId",
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
                message: "请输入角色名称"
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
        label: "角色管理",
        path: routePaths.roleManagement
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
