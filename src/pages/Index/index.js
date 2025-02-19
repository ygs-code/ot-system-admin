import {Skeleton} from "antd";
import {getUserInfo} from "src/assets/js/request";
import Layout from "src/components/Layout";
import {mapRedux} from "src/redux";
import Routers, {addRouterApi} from "src/router";
import React, {useCallback, useEffect, useState} from "react";
  
 

const Index = (props) => {
  const {
    dispatch: {
      user: {setUserInfo}
    }
  } = props;
  const {routesComponent, history} = props;
  const [loading, setLoading] = useState(true);

  const getUser = useCallback(async () => {
    let {data} = await getUserInfo({});
    setUserInfo(data);
  }, []);

  useEffect(() => {
    getUser().then(() => {
      setLoading(false);
    });
  }, []);
  return (
    <Skeleton active loading={loading}>
      <Layout>
        <Routers
          level={2}
          history={history}
          routesComponent={routesComponent}
        />
      </Layout>
    </Skeleton>
  );
};

export default mapRedux()(addRouterApi(Index));
