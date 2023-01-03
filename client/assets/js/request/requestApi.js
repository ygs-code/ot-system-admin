/*
 * @Author: your name
 * @Date: 2020-12-14 10:03:45
 * @LastEditTime: 2022-06-09 14:12:19
 * @LastEditors: Yao guan shou
 * @Description: In User Settings Edit
 * @FilePath: /Blogs/BlogsAdmin/src/common/js/request/requestApi.js
 */
import { gql, GraphqlClient } from "./request";

// 查询
export const query = (operationName, schema, parameter = {}, options = {}) => {
  return GraphqlClient.query(
    {
      operationName,
      query: schema,
      variables: parameter
    },
    {
      filterData: true,
      ...options
    }
  );
};

// 变异
export const mutation = (
  operationName,
  schema,
  parameter = {},
  options = {}
) => {
  return GraphqlClient.mutation(
    {
      operationName,
      mutation: `${schema}`,
      variables: parameter
    },
    {
      filterData: true,
      ...options
    }
  );
};

// 获取验证码
export const getVerifyCode = () => {
  return query(
    "getVerifyCode",
    ` query{
      getVerifyCode {
          code
          message
          data {
            svg
          }
        }
    }
  `
  );
};

// 注册用户
export const createUser = (parameter) => {
  return mutation(
    "createUser",
    `
        mutation($userInfo: CreateUserInfoInput!) { 
          createUser(userInfo: $userInfo) {
              code
              message
            }
        }
    `,
    {
      userInfo: parameter
    }
  );
};

//  编辑用户
export const editUser = (parameter = {}) => {
  return mutation(
    "editUser",
    `
      mutation ($userInfo: EditUserInfoInput!) {
        editUser(userInfo: $userInfo) {
          code
          message
        }
      }
    `,
    {
      userInfo: parameter
    }
  );
};

// 登录
export const login = (parameter) => {
  const { password, name, verificationCode } = parameter;
  return query(
    "login",
    ` query{
        login(
          password:"${password}",
          name:"${name}",
          verificationCode:"${verificationCode}"
          ){
            code
            data {
              token 
              authKeys
              role{
                id 
                name 
                description 
              }
              permission{
                id 
                name 
                description 
                authKey 
              }
              user {
                  name
                  phone
                  id
              } 
            }
            message
          } 
   }
    `

    // {
    //   userInfo: parameter,
    // }
  );

  //return Request.post("/set/user/login", parameter);
};

// 获取用户列表
export const getUserList = (parameter = {}) => {
  // const { type = "" } = parameter;

  // const { type, pageName = 1, pageSize = 10 } = parameter;

  return query(
    "getUserList",
    `
    query($parameter: UserListInfoInput!){
      getUserList(parameter: $parameter) {
          code
          data {
            hasNextPage
            pageNum
            pageSize
            pages
            total
            list{
              name
              phone
              id
              type
              email
              createTime
              updateTime
            }
          }
          message
        } 
    }
  `,
    {
      parameter
    },
    {
      filterData: true
    }
  );
};

// 查询用户
export const getUserInfo = (parameter = {}) => {
  const { id = "" } = parameter;
  return query(
    "getUserInfo",
    `
      query{
          getUserInfo(id: "${id}") {
            code
            data {
              token 
              authKeys
              role{
                id 
                name 
                description 
              }
              permission{
                id 
                name 
                description 
                authKey 
              }
              user {
                  name
                  phone
                  id
                  email
                  type
              } 
            }
            message
          } 
      }
    `,
    {},
    {
      filterData: true
    }
  );
};

// 获取角色列表
export const getRoleList = (parameter = {}) => {
  // const { type = "" } = parameter;

  // const { type, pageName = 1, pageSize = 10 } = parameter;

  return query(
    "getRoleList",
    `
    query($parameter: ListInfoInput!){
      getRoleList(parameter: $parameter) {
          code
          data {
            hasNextPage
            pageNum
            pageSize
            pages
            total
            list{
              name
              id
              description
              createTime
              updateTime
            }
          }
          message
        } 
    }
  `,
    {
      parameter
    },
    {
      filterData: true
    }
  );
};

// 查询角色
export const getRoleInfo = (parameter = {}) => {
  const { id = "" } = parameter;
  return query(
    "getRoleInfo",
    `
      query{
        getRoleInfo(id: "${id}") {
            code
            data {
                id 
                name 
                description
                createTime 
                updateTime
            }
            message
          } 
      }
    `,
    {},
    {
      filterData: true
    }
  );
};

//  编辑用户
export const editRole = (parameter = {}) => {
  return mutation(
    "editRole",
    `
      mutation ($roleInfo: EditInfoInput!) {
        editRole(roleInfo: $roleInfo) {
          code
          message
        }
      }
    `,
    {
      roleInfo: parameter
    }
  );
};

// 获取权限列表
export const getPermissionList = (parameter = {}) => {
  // const { type = "" } = parameter;

  // const { type, pageName = 1, pageSize = 10 } = parameter;

  return query(
    "getPermissionList",
    `
    query($parameter: ListInfoInput!){
      getPermissionList(parameter: $parameter) {
          code
          data {
            hasNextPage
            pageNum
            pageSize
            pages
            total
            list{
              name
              id
              description
              authKey 
              parentId
              createTime
              updateTime
            }
          }
          message
        } 
    }
  `,
    {
      parameter
    },
    {
      filterData: true
    }
  );
};

// 查询角色
export const getPermissionInfo = (parameter = {}) => {
  const { id = "" } = parameter;
  return query(
    "getPermissionInfo",
    `
      query{
        getPermissionInfo(id: "${id}") {
            code
            data {
                id 
                name 
                authKey
                parentId
                description
                createTime 
                updateTime
            }
            message
          } 
      }
    `,
    {},
    {
      filterData: true
    }
  );
};

//  编辑用户
export const editPermission = (parameter = {}) => {
  return mutation(
    "editPermission",
    `
      mutation ($permissionInfo: EditInfoInput!) {
        editPermission(permissionInfo: $permissionInfo) {
          code
          message
        }
      }
    `,
    {
      permissionInfo: parameter
    }
  );
};
