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
      },

      {
        path: "/user-role",
        name: "userRole",
        entry: "/pages/Index/pages/system/pages/UserRole/index.js",
        level: 2,
        children: [
          {
            path: "/details/:action/:id?",
            name: "userRoleDetails",
            entry: "/pages/Index/pages/system/pages/UserRole/details/index.js",
            level: 2,
            children: []
          }
        ]
      },
      {
        path: "/user-set-role",
        name: "userSetRole",
        entry: "/pages/Index/pages/system/pages/UserSetRole/index.js",
        level: 2,
        children: [
          {
            path: "/details/:action/:id?",
            name: "userSetRoleDetails",
            entry:
              "/pages/Index/pages/system/pages/UserSetRole/details/index.js",
            level: 2,
            children: []
          }
        ]
      },
      {
        path: "/role-permission",
        name: "rolePermission",
        entry: "/pages/Index/pages/system/pages/RolePermission/index.js",
        level: 2,
        children: [
          {
            path: "/details/:action/:id?",
            name: "rolePermissionDetails",
            entry:
              "/pages/Index/pages/system/pages/RolePermission/details/index.js",
            level: 2,
            children: []
          }
        ]
      },
      {
        path: "/role-set-permission",
        name: "roleSetPermission",
        entry: "/pages/Index/pages/system/pages/RoleSetPermission/index.js",
        level: 2,
        children: [
          {
            path: "/details/:action/:id?",
            name: "roleSetPermissionDetails",
            entry:
              "/pages/Index/pages/system/pages/RoleSetPermission/details/index.js",
            level: 2,
            children: []
          }
        ]
      }
    ]
  }
];
