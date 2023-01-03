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
      },
      {
        path: "/role-management",
        name: "roleManagement",
        entry: "/pages/Index/pages/system/pages/RoleManagement/index.js",
        level: 2,
        children: [
          {
            path: "/details/:action/:id?",
            name: "roleManagementDetails",
            entry:
              "/pages/Index/pages/system/pages/RoleManagement/details/index.js",
            level: 2,
            children: []
          }
        ]
      },
      {
        path: "/permission-management",
        name: "permissionManagement",
        entry: "/pages/Index/pages/system/pages/PermissionManagement/index.js",
        level: 2,
        children: [
          {
            path: "/details/:action/:id?",
            name: "permissionManagementDetails",
            entry:
              "/pages/Index/pages/system/pages/PermissionManagement/details/index.js",
            level: 2,
            children: []
          }
        ]
      }
    ]
  }
];
