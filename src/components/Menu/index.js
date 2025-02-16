import "./index.less";

import {
  // MenuUnfoldOutlined,
  // MenuFoldOutlined,
  // UserOutlined,
  // VideoCameraOutlined,
  // UploadOutlined,
  // HomeOutlined,
  // PieChartOutlined,
  // DesktopOutlined,
  // ContainerOutlined,
  // MailOutlined,
  // AppstoreOutlined,
  // WarningOutlined,
  SettingOutlined,
  SnippetsOutlined
  // ProjectOutlined
} from "@ant-design/icons";
import { matchPath } from "@/router/react-lazy-router-dom/matchPath.js";
import routesComponent from "@/router/routesComponent.js";
import config from "./config";
import { mapTree } from "@/utils";

import {
  Menu
  //  Select
} from "antd";
import React, {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState
} from "react";

const { SubMenu } = Menu;
// const { Option } = Select;
// const { Header, Sider, Content } = Layout;
const MindMap = memo(
  forwardRef(() => {
    return (
      <div className="mind-map">
        <svg
          className="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18">
          <path d="M122.368 165.888h778.24c-9.216 0-16.384-7.168-16.384-16.384v713.728c0-9.216 7.168-16.384 16.384-16.384h-778.24c9.216 0 16.384 7.168 16.384 16.384V150.016c0 8.192-6.656 15.872-16.384 15.872z m-32.768 684.544c0 26.112 20.992 47.104 47.104 47.104h750.08c26.112 0 47.104-20.992 47.104-47.104V162.304c0-26.112-20.992-47.104-47.104-47.104H136.704c-26.112 0-47.104 20.992-47.104 47.104v688.128z"></path>
          <path d="M716.8 642.56h-71.68c-34.304 0-61.952 27.136-62.976 61.44-48.64-2.56-90.112-14.336-123.392-34.304-26.112-15.872-47.616-37.376-64-64.512 32.768-3.584 58.88-29.184 63.488-62.464h123.392c6.656 28.672 31.744 49.152 61.44 49.664h71.68c34.816 0 62.976-28.16 62.976-62.976v-30.208c0-34.816-28.16-62.976-62.976-62.976h-71.68c-31.232 0-57.856 23.04-62.464 54.272H458.24c-3.584-33.792-30.72-60.416-64-63.488 16.896-27.648 38.4-49.152 65.024-65.536 33.28-19.968 74.24-31.744 122.368-34.304 4.096 31.232 30.72 54.272 62.464 54.784h71.68c34.816 0 62.976-28.16 62.976-62.976v-30.208c0-34.816-28.16-62.976-62.976-62.976h-71.68c-29.184 0-54.784 20.48-61.44 49.152-58.368 2.56-109.056 16.896-150.528 41.984-41.984 25.6-74.752 62.464-96.768 109.568h-38.912c-39.424 0-71.68 32.256-71.68 71.68v35.84c0 39.424 32.256 71.68 71.68 71.68h39.424c22.528 46.592 54.784 83.456 96.256 108.544 42.496 25.6 94.208 39.936 154.112 42.496 8.704 25.088 32.768 41.984 59.392 41.984h71.68c34.816 0 62.976-28.16 62.976-62.976v-30.208c-0.512-34.816-28.672-62.976-63.488-62.976z m-83.968-354.304c0-5.632 4.608-10.24 10.752-10.752h71.68c5.632 0 10.752 4.608 10.752 10.752v30.208c0 5.632-4.608 10.752-10.752 10.752h-71.68c-5.632 0-10.752-4.608-10.752-10.752v-30.208z m-0.512 210.944c0-5.632 4.608-10.752 10.752-10.752h71.68c5.632 0 10.752 4.608 10.752 10.752v30.208c0 5.632-4.608 10.24-10.752 10.752h-71.68c-5.632 0-10.752-4.608-10.752-10.752v-30.208z m-356.352 34.816v-35.84c0-10.752 8.704-19.456 19.456-19.456h91.136c10.752 0 19.456 8.704 19.456 19.456v35.84c0 10.752-8.704 19.456-19.456 19.456H295.424c-10.752-0.512-19.456-8.704-19.456-19.456z m451.584 201.728c0 5.632-4.608 10.752-10.752 10.752h-71.68c-5.632 0-10.752-4.608-10.752-10.752v-30.208c0-5.632 4.608-10.24 10.752-10.752h71.68c5.632 0 10.752 4.608 10.752 10.752v30.208z"></path>
        </svg>
      </div>
    );
  })
);

export default memo((props) => {
  const {
    match: { path, params: { id } = {} } = {},
    routePaths = {},
    pushRoute,
    location
  } = props;

  const [selectedKeys, setSelectedKeys] = useState("-1");
  const [openKeys, setOpenKeys] = useState([]);

  const goTo = useCallback((url) => {
    pushRoute({
      url
    });
  }, []);

  const getItems = useCallback((menuData, index = null) => {
    return menuData.map((item, _index) => {
      const menuKey = index === null ? _index : `${index}_${_index}`;
      const { title, iconComponent = null, children = [], url } = item;
      let { exact, path, strict, sensitive } =
        routesComponent.find((_item) => {
          return _item.path === item.url;
        }) || {};

      return {
        exact,
        path,
        strict,
        sensitive,
        url,
        label: title,
        key: menuKey,
        icon: iconComponent,
        children: children.length ? getItems(children, menuKey) : null
      };
    });
  }, []);

  const menuData = useMemo(() => {
    return getItems(config(routePaths));
  }, [routePaths]);

  const findMenuSelectedKey = useCallback((data) => {
    for (let item of data) {
      const { exact, path, strict, sensitive, children = [] } = item;
      let menu = matchPath(location.pathname, {
        path: path,
        exact: exact,
        strict: strict,
        sensitive: sensitive
      });
      if (menu) {
        return {
          ...menu,
          ...item
        };
      } else if (children && children.length) {
        return findMenuSelectedKey(children);
      }
    }
  }, []);

  useEffect(() => {
    let { key } = findMenuSelectedKey(menuData) || {};

    setSelectedKeys(key);
  }, [menuData]);

  useEffect(() => {
    // 打开的key
    let menuOpenKeys = sessionStorage.getItem("adminMenuOpenKeys") || "[]";
    menuOpenKeys = JSON.parse(menuOpenKeys);
    setOpenKeys(menuOpenKeys);
  }, [id, path]);

  return (
    <Menu
      theme="dark"
      mode="inline"
      selectedKeys={[selectedKeys]}
      openKeys={openKeys}
      onOpenChange={(keyPath) => {
        sessionStorage.setItem("adminMenuOpenKeys", JSON.stringify(keyPath));
        setOpenKeys(keyPath);
      }}
      onSelect={(value) => {
        const {
          key: selectedKeys,
          keyPath,
          item: { props: { url } = {} } = {}
        } = value;

        sessionStorage.setItem("adminMenuOpenKeys", JSON.stringify(keyPath));

        setSelectedKeys(selectedKeys);
        setOpenKeys(keyPath);

        goTo(url);
      }}
      items={menuData}
      defaultSelectedKeys={[selectedKeys]}></Menu>
  );
});
