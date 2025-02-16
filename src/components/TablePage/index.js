/*
 * @Author: your name
 * @Date: 2021-08-23 19:39:29
 * @LastEditTime: 2021-08-26 17:03:57
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /error-sytem/src/src/common/component/Table/index.js
 */

import "./index.less";

import { SearchForm } from "src/components/Form";
// import FormPicker from "src/components/FormPicker";
import Table from "src/components/Table";
import React from "react"; // , { memo, PureComponent }
import { Spin, message } from "antd"; // , { memo, PureComponent }
import Store from "src/redux/Store.js"; // , { memo, PureComponent }
import { CheckDataType } from "src/utils/CheckDataType";
// class TablePage extends PureComponent {
//   constructor(props) {
//     super(props);
//     this.state = {
//       tableData: {
//         list: [{ title: "你好" }]
//       },
//       dataSource: []
//     };
//   }
//   // 获取默认搜索参数
//   getDefaultSearchParams = () => {
//     return {
//       // status: ""
//     };
//   };

//   // 定义搜索栏字段
//   getSearchFields = () => {
//     return [];
//   };

//   // 定义Tab字段
//   getTabFilterItems = () => {
//     return [];
//   };

//   // 定义表头字段
//   // getColumns = () => {
//   //   return [];
//   // };

//   /**
//    * 定义表格的数据加载功能
//    */
//   tableDataLoader = async () => {
//     return {};
//   };

//   loadTableData = async (searchParams = {}) => {
//     return await this.tableDataLoader(searchParams);
//   };

//   getDataSource = () => {
//     return [];
//   };

//   getTableProps = () => {
//     return {};
//   };

//   componentDidMount() {
//   }

//   renderSearch = (props = {}) => {
//     const { shrinkLength = 5 } = props;
//     return (
//       <SearchForm
//         // shrinkLength={2}
//         {...props}
//         shrinkLength={shrinkLength}
//         fields={this.getSearchFields()}
//         type="search"
//         onReady={(form) => {
//           this.searchForm = form;
//         }}
//       />
//     );
//   };

//   renderTable = (props = {}) => {
//     return (
//       <Table
//         columns={this.getColumns ? this.getColumns() : []}
//         dataSource={this.getDataSource()}
//         // title={() => "Header"}
//         // footer={() => "Footer"}
//         {...this.getTableProps()}
//         {...props}
//       />
//     );
//   };
//   render() {
//     return (
//       <>
//         {this.renderSearch()} {this.renderTable()}
//       </>
//     );
//   }
// }

const { dispatch, getState } = Store;
const tablePage = (Component) => {
  class TablePage extends Component {
    // state = {
    //   searchParams: {}
    // };
    constructor(props) {
      super(props);
      const { selectedRows = [], selectedRowKeys = [] } = this.state;
      this.state = {
        ...this.state,
        searchParams: {
          pageNum: 1,
          pageSize: 10
        },
        tableData: {},
        selectedRows,
        selectedRowKeys,
        loading: false,
        exportOpen: false
      };
    }

    // // 获取默认搜索参数
    getDefaultSearchParams = () => {
      return {
        // status: ""
      };
    };

    // // 定义搜索栏字段
    // getSearchFields = () => {
    //   return [];
    // };

    // 定义Tab字段
    getTabFilterItems = () => {
      return [];
    };

    // // 定义表头字段
    // getColumns = () => {
    //   return [];
    // };

    /**
     * 定义表格的数据加载功能
     */
    // tableDataLoader = async () => {
    //   return {};
    // };

    checkTabelData = (data) => {
      let mapKey = [
        // 'hasNextPage',
        "list",
        "pageNum",
        "pageSize",
        // "pages",
        "total"
      ];
      let index = -1;
      for (let key in data) {
        if (data.hasOwnProperty(key)) {
          index = mapKey.indexOf(key);
          if (index !== -1) {
            mapKey.splice(index, 1);
          }
        }
      }

      if (mapKey.length) {
        return `列表表格数据数据缺少${mapKey.join(",")}字段`;
      }
      return null;
    };

    checkAbstractFunction = () => {
      let checkFunction = [
        {
          name: "tableDataLoader",
          message: "tableDataLoader是抽象方法需要实现,请设置ajax请求列表"
        },

        {
          name: "getColumns",
          message: "getColumns是抽象方法需要实现,请配置表格columns"
        }
      ];

      for (let item of checkFunction) {
        const { name, message } = item;
        if (!this[name]) {
          return message;
        }
      }
      return null;
    };
    loadTableData = async (searchParams = {}) => {
      this.setState({
        loading: true
      });

      let newSearchParams = this.getSearchParams(searchParams) || {};

      let errprMessage = this.checkAbstractFunction();
      if (errprMessage) {
        console.error(errprMessage);

        return;
      }

      if (!this.tableDataLoader) {
        console.error("tableDataLoader抽象方法需要实现");
        return;
      }

      const data = await this.tableDataLoader(newSearchParams).catch((err) => {
        this.setState({
          loading: false
        });
      });
      this.setState({
        loading: false
      });
      errprMessage = this.checkTabelData(data);
      if (errprMessage) {
        console.error(errprMessage);
        return;
      }
      this.setState({ tableData: data });
      return data;
    };

    getDataSource = () => {
      return [];
    };

    // getTableProps = () => {
    //   return {
    //     rowSelection: {
    //       onChange: (selectedRows, selectedRowKeys) => {
    //       },
    //       getCheckboxProps: (record) => ({
    //         disabled: record.name === "Disabled User",
    //         // Column configuration not to be checked
    //         name: record.name
    //       })
    //     }
    //   };
    // };

    componentDidMount(...ags) {
      super.componentDidMount(...ags);
      this.setBreadcrumb();
    }

    componentWillUnmount(...ags) {
      super.componentDidMount(...ags);
    }

    onResetForm = () => {
      const { resetFields = () => {} } = this.searchForm || {};
      resetFields();
      this.setState(() => ({
        searchParams: {
          pageNum: 1,
          pageSize: 10
        }
      }));
    };
    renderSearch = (props = {}) => {
      const { shrinkLength } = props;
      return (
        <div className="search-box">
          <SearchForm
            {...props}
            getSearchButtons={this.getSearchButtons}
            onConfirm={(v) => {
              this.loadTableData({
                ...v,
                pageNum: 1,
                pageSize: 10
              });
            }}
            onReset={(searchParams) => {
              this.loadTableData({
                ...searchParams,
                pageNum: 1,
                pageSize: 10
              });
            }}
            shrinkLength={shrinkLength}
            fields={this.getSearchFields()}
            type="search"
            onReady={(form) => {
              this.searchForm = form;
              this.loadTableData();
            }}
          />
        </div>
      );
    };

    // getBreadcrumb() {
    //   return undefined;
    // }

    setBreadcrumb(breadcrumb) {
      let nextBreadcrumb =
        breadcrumb || (this?.getBreadcrumb && this?.getBreadcrumb()) || [];
      // Store.getState().breadcrumb
      try {
        if (typeof nextBreadcrumb !== "undefined") {
          if (CheckDataType.isString(nextBreadcrumb)) {
            nextBreadcrumb = [
              {
                title: nextBreadcrumb
              }
            ];
          }
          dispatch.breadcrumb.setBreadcrumb(nextBreadcrumb);
          // store.setState({ state: transformBreadCrumbData(nextBreadcrumb) });
        }
      } catch (error) {
        console.log(error);
      }
    }

    onSelect = (selectedRows, selectedRowKeys) => {
      this.setState({
        selectedRows,
        selectedRowKeys
      });
    };

    // renderLeftButton = (props = {}) => {
    //   return null
    // };

    // renderRightButton = (props = {}) => {
    //   return  null
    // };
    renderCenterButton = (props = {}) => {
      let renderLeftButton =
        (this.renderLeftButton && this.renderLeftButton(props)) || null;
      let renderRightButton =
        (this.renderRightButton && this.renderRightButton(props)) || null;

      return renderLeftButton || renderRightButton ? (
        <div className="render-center-button">
          <div className="render-left-button">{renderLeftButton}</div>
          <div className="render-right-button">{renderRightButton}</div>
        </div>
      ) : null;
    };
    renderTable = (props = {}) => {
      const { tableData, loading } = this.state;
      let { tableProps = {}, paginationProps = {} } = props;
      let { readOnly } = this.props;

      tableProps = {
        ...tableProps,
        ...props,
        ...(this.getTableProps ? this.getTableProps() : {})
      };

      const { onSelect = () => {} } = tableProps;
      // 加载
      return (
        <div className="page-table-box">
          {loading ? (
            <div className="mask-layer">
              <Spin tip="加载中..." spinning={loading}>
                <div className="div-box"></div>
              </Spin>
            </div>
          ) : null}

          <Table
            readOnly={readOnly}
            tableProps={tableProps}
            // {...tableProps}
            columns={this.getColumns ? this.getColumns() : []}
            data={tableData}
            paginationProps={paginationProps}
            onChange={(searchParams) => {
              this.loadTableData(searchParams);
            }}
            onSelect={(selectedRows, selectedRowKeys) => {
              this.onSelect(selectedRows, selectedRowKeys);
              onSelect(selectedRows, selectedRowKeys);
            }}
          />
        </div>
      );

      // <Table
      //   readOnly={readOnly}
      //   tableProps={tableProps}
      //   // {...tableProps}
      //   columns={this.getColumns ? this.getColumns() : []}
      //   data={tableData}
      //   paginationProps={paginationProps}
      //   onChange={(searchParams) => {
      //     this.loadTableData(searchParams);
      //   }}
      //   onSelect={(selectedRows, selectedRowKeys) => {
      //     this.onSelect(selectedRows, selectedRowKeys);
      //     onSelect(selectedRows, selectedRowKeys);
      //   }}
      // />
    };

    getSearchParams = (searchParams) => {
      const { getFieldsValue = () => ({}) } = this.searchForm || {};
      let newSearchParams = {};

      if (this.getDefaultSearchParams) {
        searchParams = {
          ...this.getDefaultSearchParams(),
          ...this.state.searchParams,
          ...searchParams
        };
      }

      this.setState(() => {
        return {
          searchParams
        };
      });

      const searchFormValue = getFieldsValue();

      if (Object.keys(searchFormValue).length) {
        searchParams = {
          ...searchParams,
          ...searchFormValue
        };
      }

      //
      for (let key in searchParams) {
        if (searchParams.hasOwnProperty(key)) {
          if (
            searchParams[key] === null ||
            (searchParams[key] !== undefined &&
              searchParams[key].toString().trim() !== "")
          ) {
            newSearchParams[key] = searchParams[key];
          }
        }
      }

      return newSearchParams;
    };

    exportTable = async (searchParams = {}) => {
      this.setState({ exportOpen: true });

      //
    };
    render() {
      const { exportOpen } = this.state;
      return (
        <>
          {/* <FormPicker
            open={exportOpen}
            onCancel={() => {
              this.setState({ exportOpen: false });
            }}
            title="下载文件重命名"
            onOk={async (values) => {
              const { flieName } = values;
              const { tabsValue } = this.state;
              const hide = message.loading("正在导出");
              let newSearchParams = this.getSearchParams({}) || {};

              const data = await super
                .exportTable({
                  ...values,
                  ...newSearchParams
                })
                .catch(() => {
                  message.error("导出失败，请重试");
                  hide();
                });
              hide();
              this.setState({ exportOpen: false });
              setTimeout(() => {
                message.success("导出成功");
              }, 100);
            }}
            getFields={() => {
              return [
                {
                  label: "下载文件名称",
                  name: "flieName",
                  type: "input",
                  props: {
                    // showCount: true,
                    // maxLength: 20,
                    // readOnly: true,
                  },

                  rules: [
                    {
                      required: true,
                      message: "请输入下载文件名称"
                    }
                  ]
                }
              ];
            }}></FormPicker> */}
          {super.render()}

          {/* {this.renderSearch()} {this.renderTable()} */}
        </>
      );
    }
  }

  return TablePage;
};

// export default TablePage;

export { tablePage };
