import {Skeleton} from "antd";
import {getUserInfo} from "src/assets/js/request";
import Layout from "src/components/Layout";
import {mapRedux} from "src/redux";
import Routers, {addRouterApi} from "src/router";
import React, {useCallback, useEffect, useState} from "react";

interface UserInfo {
  name: string;
  age: number;
  // Add other user info properties here
}

interface DispatchProps {
  user: {
    setUserInfo: (userInfo: UserInfo) => void;
  };
}
  
interface IndexProps extends DispatchProps {
  routesComponent: React.ReactNode;
  history: any; // You can replace `any` with a more specific type if available
  dispatch: {
    user: {
          setUserInfo: (userInfo: UserInfo) => void;
    };
  };
}

const Index: React.FC<IndexProps> = (props) => {
  const {
    dispatch: {
      user: {setUserInfo}
    }={}
  } = props;
 
  return (
      <div> tsx 测试 </div>
  );
};

export default mapRedux()(addRouterApi(Index));
