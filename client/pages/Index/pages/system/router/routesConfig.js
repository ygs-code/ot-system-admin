// 路由配置
export default [
  {
    path: "/system",
    exact: true,
    name: "system",
    entry: "/pages/Index/pages/system/index.js",
    level: 2,
    children: [
      {
        path: "/user-management",
        name: "userManagement",
        entry: "/pages/Index/pages/system/pages/UserManagement/index.js",
        level: 2,
        children: [
          {
            path: "/details/:action/:id?",
            name: "userManagementDetails",
            entry:
              "/pages/Index/pages/system/pages/UserManagement/details/index.js",
            level: 2,
            children: []
          }
        ]
      }
    ]
  }
];
