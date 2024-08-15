import "./index.less";

import {message} from "antd";
import {editRolePermission, getRoleInfo} from "client/assets/js/request";
import FormPage from "client/component/FormPage";
import setBreadcrumbAndTitle from "client/component/setBreadcrumbAndTitle";
import PermissionPicker from "client/pages/Index/pages/system/component/PermissionPicker";
import {mapRedux} from "client/redux";
import {addRouterApi, routePaths} from "client/router";
import React from "react";

class Index extends FormPage {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
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
        params: {id}
      }
    } = this.props;

    const {data: {description, name} = {}} = await getRoleInfo({
      id
    });

    return await this.mapInitData({
      description,
      id,
      name
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
      history: {back}
    } = this.props;

    const {
      id: roleId,
      permissionIds: {checkedKeys: permissionIds = []} = {}
    } = await this.mapSubmitData(formData);

    const {message: mgs} = await editRolePermission({
      roleId,
      permissionIds
    });

    message.success(mgs);

    setTimeout(() => {
      back();
    }, 500);
  };
  getFields = () => {
    const {
      match: {
        params: {action, id}
      }
    } = this.props;

    const readOnly = action === "view";

    return [
      {
        type: "section",
        title: "详情基本设置",
        items: [
          {
            label: "角色ID",
            name: "id",
            itemProps: {},

            render: (props) => {
              const {value} = props;

              return <div>{value}</div>;
            },
            rules: []
          },
          {
            label: "角色名称",
            name: "name",
            type: "input",
            props: {
              showCount: true,
              maxLength: 20,
              readOnly: true
            },

            rules: [
              {
                required: true,
                message: "请输入角色名称"
              }
            ]
          },

          {
            label: "描述",
            name: "description",
            type: "textArea",
            props: {
              showCount: true,
              maxLength: 200,
              readOnly: true
            },

            rules: [
              {
                required: true,
                message: "请输入描述"
              }
            ]
          },

          {
            label: "权限设置",
            name: "permissionIds",
            itemProps: {},

            render: (props) => {
              const {onChange, value} = props;
              return (
                <PermissionPicker
                  readOnly={readOnly}
                  value={value}
                  roleId={id}
                  onChange={onChange}
                  modalProps={{
                    title: "编辑权限"
                  }}></PermissionPicker>
              );
            },
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
      }
    ],
    title: "角色管理/详情"
  })(addRouterApi(Index))
);
