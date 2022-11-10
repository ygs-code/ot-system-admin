/*
 * @Author: your name
 * @Date: 2020-12-24 16:21:28
 * @LastEditTime: 2021-09-30 09:53:22
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /error-sytem/client/src/redux/models/reducers/user.js
 */
import { actions } from "@/redux/store";
import { getUserInfo } from "@/common/js/request";
import modelsStore from "../modelsStore";

export default {
  name: "user",
  state: {
    breadcrumb: [],
    userInfo: {},
  },
  reducers: {
    setBreadcrumb(state, { payload }) {
      console.log("payload======", payload);
      return {
        ...state,
        breadcrumb: [
          // ...state.breadcrumb,
          ...payload,
        ],
      };
    },
    setUserInfo(state, { payload }) {
      return {
        ...state,
        userInfo: {
          ...state.userInfo,
          ...payload,
        },
      };
    },

    // setCurrentUser(state, { payload }) {
    //   return {
    //     ...state,
    //     currentUser: {
    //       ...state.currentUser,
    //       ...payload,
    //     },
    //   };
    // },
  },
  effects: (dispatch) => {
    return {
      async getUserInfo(state, { payload: param = {} }) {
        const { data } = await getUserInfo(param);

        dispatch({
          modelsName: "user",
          type: "setUserInfo",
          payload: {
            ...data,
          },
        });

        return data;
      },
      // // 登陆
      // async login(state, { payload }) {
      //   const {
      //     //模块
      //     user: { setUserInfo },
      //   } = actions;
      //   dispatch({
      //     type: setUserInfo,
      //     payload: payload,
      //   });
      //   return {
      //     name: "你好",
      //   };
      // },
    };
  },
};
