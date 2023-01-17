/*
 * @Author: your name
 * @Date: 2021-08-23 19:39:29
 * @LastEditTime: 2021-08-26 11:33:11
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /error-sytem/client/src/common/component/Table/index.js
 */

import "./index.less";

import { Pagination, Table } from "antd";
import React from "react";

const Index = (props) => {
  const {
    columns,
    tableProps = {},
    paginationProps = {},
    data: {
      list = [],
      pageNum,
      // pageSize,
      // pages,
      total
    } = {},
    onChange = () => {},
    onSelect = () => {}
  } = props;
  const { rowSelection = {}, isShowSelect } = tableProps;

  const {
    onChange: rowSelectionOnSelect = () => {},
    onChange: rowSelectionOnSelectAll = () => {}
  } = rowSelection;

  let $rowSelection = isShowSelect
    ? {
        // onChange: (selectedRowKeys, selectedRows) => {
        //   rowSelectionOnchange(selectedRowKeys, selectedRows);
        //   console.log(
        //     "onChange:",
        //     "selectedRowKeys:",
        //     selectedRowKeys,
        //     "selectedRows: ",
        //     selectedRows
        //   );
        // },
        onSelect: (changeRow, selected, selectedRows, nativeEvent) => {
          console.log("onSelect=");
          console.log("changeRow=", changeRow);
          console.log("selected=", selected);
          console.log("selectedRows=", selectedRows);

          rowSelectionOnSelect(changeRow, selected, selectedRows, nativeEvent);
        },
        onSelectAll: (selected, selectedRows, changeRows) => {
          console.log("onSelectAll=", selected, selectedRows, changeRows);
          rowSelectionOnSelectAll(selected, selectedRows, changeRows);
        }
        // onSelectInvert: (selectedRowKeys) => {
        //   console.log("onSelectInvert=", selectedRowKeys);
        // }
        // getCheckboxProps: (record) => ({
        //   disabled: record.name === "Disabled User",
        //   // Column configuration not to be checked
        //   name: record.name
        // })
      }
    : {};

  $rowSelection =
    Object.keys(rowSelection).length == 0 &&
    Object.keys($rowSelection).length == 0
      ? null
      : {
          ...rowSelection,
          ...$rowSelection
        };

  return (
    <div className="table-box">
      <div className="table">
        <Table
          columns={columns}
          dataSource={list}
          {...tableProps}
          rowSelection={$rowSelection}
          pagination={false}
        />
      </div>

      <div className="pagination-box">
        <Pagination
          className="ant-pagination ant-table-pagination ant-table-pagination-right ant-table-pagination-right"
          showSizeChanger
          showQuickJumper
          defaultCurrent={pageNum}
          total={total}
          showTotal={(total) => `总共 ${total} 条`}
          onChange={(pageNum) => {
            onChange({
              pageNum
            });
          }}
          {...paginationProps}
        />
      </div>
    </div>
  );
};

export default Index;
