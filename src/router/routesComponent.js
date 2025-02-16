
// 按需加载插件
import { lazy } from "src/router/react-lazy-router-dom";
import pagesIndexPagesOfficeRouterRoutesconfig from "src/pages/Index/pages/office/router/routesConfig.js";
import pagesIndexPagesSystemRouterRoutesconfig from "src/pages/Index/pages/system/router/routesConfig.js";
import pagesIndexRouterRoutesconfig from "src/pages/Index/router/routesConfig.js";
import pagesRouterRoutesconfig from "src/pages/router/routesConfig.js";


let routesComponentConfig=[
                    {  
                     path: "/office/document/details/:action/:id?",
                     exact: false,
                     name:"documentDetails",
                     entry:"/pages/Index/pages/office/pages/Document/details/index.js",
                     Component:lazy(
                           () => import(/* webpackChunkName:"documentDetails" */ "src/pages/Index/pages/office/pages/Document/details/index.js")
                      ),
                    //  syncComponent:Documentdetails,
                     level:2,
                     routesConfigPath:"K:/ot-system/ot-system-admin/src/pages/Index/pages/office/router/routesConfig.js",
                   },
                    {  
                     path: "/office/document",
                     exact: false,
                     name:"document",
                     entry:"/pages/Index/pages/office/pages/Document/index.js",
                     Component:lazy(
                           () => import(/* webpackChunkName:"document" */ "src/pages/Index/pages/office/pages/Document/index.js")
                      ),
                    //  syncComponent:Document,
                     level:2,
                     routesConfigPath:"K:/ot-system/ot-system-admin/src/pages/Index/pages/office/router/routesConfig.js",
                   },
                    {  
                     path: "/office",
                     exact: true,
                     name:"office",
                     entry:"/pages/Index/pages/office/index.js",
                     Component:lazy(
                           () => import(/* webpackChunkName:"office" */ "src/pages/Index/pages/office/index.js")
                      ),
                    //  syncComponent:Office,
                     level:2,
                     routesConfigPath:"K:/ot-system/ot-system-admin/src/pages/Index/pages/office/router/routesConfig.js",
                   },
                    {  
                     path: "/system/user-management/details/:action/:id?",
                     exact: false,
                     name:"userManagementDetails",
                     entry:"/pages/Index/pages/system/pages/UserManagement/details/index.js",
                     Component:lazy(
                           () => import(/* webpackChunkName:"userManagementDetails" */ "src/pages/Index/pages/system/pages/UserManagement/details/index.js")
                      ),
                    //  syncComponent:Usermanagementdetails,
                     level:2,
                     routesConfigPath:"K:/ot-system/ot-system-admin/src/pages/Index/pages/system/router/routesConfig.js",
                   },
                    {  
                     path: "/system/user-management",
                     exact: false,
                     name:"userManagement",
                     entry:"/pages/Index/pages/system/pages/UserManagement/index.js",
                     Component:lazy(
                           () => import(/* webpackChunkName:"userManagement" */ "src/pages/Index/pages/system/pages/UserManagement/index.js")
                      ),
                    //  syncComponent:Usermanagement,
                     level:2,
                     routesConfigPath:"K:/ot-system/ot-system-admin/src/pages/Index/pages/system/router/routesConfig.js",
                   },
                    {  
                     path: "/system/role-management/details/:action/:id?",
                     exact: false,
                     name:"roleManagementDetails",
                     entry:"/pages/Index/pages/system/pages/RoleManagement/details/index.js",
                     Component:lazy(
                           () => import(/* webpackChunkName:"roleManagementDetails" */ "src/pages/Index/pages/system/pages/RoleManagement/details/index.js")
                      ),
                    //  syncComponent:Rolemanagementdetails,
                     level:2,
                     routesConfigPath:"K:/ot-system/ot-system-admin/src/pages/Index/pages/system/router/routesConfig.js",
                   },
                    {  
                     path: "/system/role-management",
                     exact: false,
                     name:"roleManagement",
                     entry:"/pages/Index/pages/system/pages/RoleManagement/index.js",
                     Component:lazy(
                           () => import(/* webpackChunkName:"roleManagement" */ "src/pages/Index/pages/system/pages/RoleManagement/index.js")
                      ),
                    //  syncComponent:Rolemanagement,
                     level:2,
                     routesConfigPath:"K:/ot-system/ot-system-admin/src/pages/Index/pages/system/router/routesConfig.js",
                   },
                    {  
                     path: "/system/permission-management/details/:action/:id?",
                     exact: false,
                     name:"permissionManagementDetails",
                     entry:"/pages/Index/pages/system/pages/PermissionManagement/details/index.js",
                     Component:lazy(
                           () => import(/* webpackChunkName:"permissionManagementDetails" */ "src/pages/Index/pages/system/pages/PermissionManagement/details/index.js")
                      ),
                    //  syncComponent:Permissionmanagementdetails,
                     level:2,
                     routesConfigPath:"K:/ot-system/ot-system-admin/src/pages/Index/pages/system/router/routesConfig.js",
                   },
                    {  
                     path: "/system/permission-management",
                     exact: false,
                     name:"permissionManagement",
                     entry:"/pages/Index/pages/system/pages/PermissionManagement/index.js",
                     Component:lazy(
                           () => import(/* webpackChunkName:"permissionManagement" */ "src/pages/Index/pages/system/pages/PermissionManagement/index.js")
                      ),
                    //  syncComponent:Permissionmanagement,
                     level:2,
                     routesConfigPath:"K:/ot-system/ot-system-admin/src/pages/Index/pages/system/router/routesConfig.js",
                   },
                    {  
                     path: "/system/user-role/details/:action/:id?",
                     exact: false,
                     name:"userRoleDetails",
                     entry:"/pages/Index/pages/system/pages/UserRole/details/index.js",
                     Component:lazy(
                           () => import(/* webpackChunkName:"userRoleDetails" */ "src/pages/Index/pages/system/pages/UserRole/details/index.js")
                      ),
                    //  syncComponent:Userroledetails,
                     level:2,
                     routesConfigPath:"K:/ot-system/ot-system-admin/src/pages/Index/pages/system/router/routesConfig.js",
                   },
                    {  
                     path: "/system/user-role",
                     exact: false,
                     name:"userRole",
                     entry:"/pages/Index/pages/system/pages/UserRole/index.js",
                     Component:lazy(
                           () => import(/* webpackChunkName:"userRole" */ "src/pages/Index/pages/system/pages/UserRole/index.js")
                      ),
                    //  syncComponent:Userrole,
                     level:2,
                     routesConfigPath:"K:/ot-system/ot-system-admin/src/pages/Index/pages/system/router/routesConfig.js",
                   },
                    {  
                     path: "/system/role-permission/details/:action/:id?",
                     exact: false,
                     name:"rolePermissionDetails",
                     entry:"/pages/Index/pages/system/pages/RolePermission/details/index.js",
                     Component:lazy(
                           () => import(/* webpackChunkName:"rolePermissionDetails" */ "src/pages/Index/pages/system/pages/RolePermission/details/index.js")
                      ),
                    //  syncComponent:Rolepermissiondetails,
                     level:2,
                     routesConfigPath:"K:/ot-system/ot-system-admin/src/pages/Index/pages/system/router/routesConfig.js",
                   },
                    {  
                     path: "/system/role-permission",
                     exact: false,
                     name:"rolePermission",
                     entry:"/pages/Index/pages/system/pages/RolePermission/index.js",
                     Component:lazy(
                           () => import(/* webpackChunkName:"rolePermission" */ "src/pages/Index/pages/system/pages/RolePermission/index.js")
                      ),
                    //  syncComponent:Rolepermission,
                     level:2,
                     routesConfigPath:"K:/ot-system/ot-system-admin/src/pages/Index/pages/system/router/routesConfig.js",
                   },
                    {  
                     path: "/system",
                     exact: true,
                     name:"system",
                     entry:"/pages/Index/pages/system/index.js",
                     Component:lazy(
                           () => import(/* webpackChunkName:"system" */ "src/pages/Index/pages/system/index.js")
                      ),
                    //  syncComponent:System,
                     level:2,
                     routesConfigPath:"K:/ot-system/ot-system-admin/src/pages/Index/pages/system/router/routesConfig.js",
                   },
                    {  
                     path: "/",
                     exact: true,
                     name:"~index",
                     entry:"/pages/Index/pages/Home",
                     Component:lazy(
                           () => import(/* webpackChunkName:"~index" */ "src/pages/Index/pages/Home")
                      ),
                    //  syncComponent:~index,
                     level:2,
                     routesConfigPath:"K:/ot-system/ot-system-admin/src/pages/Index/router/routesConfig.js",
                   },
                    {  
                     path: "/home",
                     exact: true,
                     name:"home",
                     entry:"/pages/Index/pages/Home",
                     Component:lazy(
                           () => import(/* webpackChunkName:"home" */ "src/pages/Index/pages/Home")
                      ),
                    //  syncComponent:Home,
                     level:2,
                     routesConfigPath:"K:/ot-system/ot-system-admin/src/pages/Index/router/routesConfig.js",
                   },
                    {  
                     path: "/",
                     exact: false,
                     name:"index",
                     entry:"/pages/Index/index.js",
                     Component:lazy(
                           () => import(/* webpackChunkName:"~index" */ "src/pages/Index/index.js")
                      ),
                    //  syncComponent:Index,
                     level:1,
                     routesConfigPath:"K:/ot-system/ot-system-admin/src/pages/router/routesConfig.js",
                   },
                    {  
                     path: "/log-in",
                     exact: true,
                     name:"logIn",
                     entry:"/pages/LogIn/index.js",
                     Component:lazy(
                           () => import(/* webpackChunkName:"logIn" */ "src/pages/LogIn/index.js")
                      ),
                    //  syncComponent:Login,
                     level:1,
                     routesConfigPath:"K:/ot-system/ot-system-admin/src/pages/router/routesConfig.js",
                   },
                    {  
                     path: "/register",
                     exact: false,
                     name:"register",
                     entry:"/pages/Register/index.js",
                     Component:lazy(
                           () => import(/* webpackChunkName:"register" */ "src/pages/Register/index.js")
                      ),
                    //  syncComponent:Register,
                     level:1,
                     routesConfigPath:"K:/ot-system/ot-system-admin/src/pages/router/routesConfig.js",
                   },
    ]

export const routesConfigs = [
  ...pagesIndexPagesOfficeRouterRoutesconfig,
  ...pagesIndexPagesSystemRouterRoutesconfig,
  ...pagesIndexRouterRoutesconfig,
  ...pagesRouterRoutesconfig,
];     

export default routesComponentConfig;
        