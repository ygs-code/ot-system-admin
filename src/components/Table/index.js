/*
 * @Author: your name
 * @Date: 2021-08-23 19:39:29
 * @LastEditTime: 2021-08-26 11:33:11
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /error-sytem/@/src/common/component/Table/index.js
 */

import './index.less';

import { Pagination, Table } from 'antd';
import React, { useEffect, useState } from 'react';

const Index = (props) => {
  const {
    columns,
    tableProps = {},
    paginationProps = {},
    data: {
      list = [],
      pageNum = 1,
      pageSize = 10,
      // pages,
      total,
    } = {},
    // onChange = () => {},
    // onSelect = () => {}
    // rowSelection = {},
    // isShowSelect,
    // rowKey,
    onChange = () => {},
    onSelect = () => {},
    readOnly,
  } = props;
  const {
    rowSelection = {},
    isShowSelect,
    rowKey,
    // onChange = () => {},
    // onSelect = () => {}
  } = tableProps;

  const {
    onChange: rowSelectionOnSelect = () => {},
    onChange: rowSelectionOnSelectAll = () => {},
    selectedRowKeys: rowSelectionSelectedRowKeys = [],
    selectedRows: rowSelectionSelectedRows = [],
  } = rowSelection;

  let [selectedRows, setSelectedRows] = useState([]);
  let [selectedRowKeys, setSelectedRowKeys] = useState([]);

  useEffect(() => {
    setSelectedRows(rowSelectionSelectedRows);
    setSelectedRowKeys(rowSelectionSelectedRowKeys);
  }, []);

  // 分页算法函数
  const paginate = (array, pageSize, pageNum) => {
    // 计算分页后的起始索引和结束索引
    const startIndex = (pageNum - 1) * pageSize;

    let endIndex = pageNum * pageSize;
    endIndex = array.length >= endIndex ? endIndex : array.length;

    // 返回分页后的数组
    return array.slice(startIndex, endIndex);
  };

  let $rowSelection = isShowSelect
    ? {
        selectedRowKeys,
        onSelect: (changeRow, selected, $selectedRows, nativeEvent) => {
          if (!rowKey) {
            return console.error('rowKey未设置，请设置表格rowKey');
          }
          if (selected) {
            selectedRows.push(changeRow);
            selectedRowKeys.push(changeRow[rowKey]);
          } else {
            let index = selectedRows.findIndex((item) => {
              return changeRow[rowKey] === item[rowKey];
            });

            selectedRows.splice(index, 1);
            selectedRowKeys.splice(index, 1);
          }
          setSelectedRows([...selectedRows]);
          setSelectedRowKeys([...selectedRowKeys]);
          rowSelectionOnSelect(changeRow, selected, $selectedRows, nativeEvent);
          onSelect(selectedRows, selectedRowKeys);
        },
        onSelectAll: (selected, $selectedRows, changeRows) => {
          if (!rowKey) {
            return console.error('rowKey未设置，请设置表格rowKey');
          }
          if (selected) {
            selectedRows = selectedRows.concat(changeRows);
          } else {
            selectedRows = selectedRows.filter((item) => {
              return !changeRows.some(($item) => {
                return item[rowKey] === $item[rowKey];
              });
            });
          }
          selectedRowKeys = selectedRows.map((item) => {
            return item[rowKey];
          });
          setSelectedRows([...selectedRows]);
          setSelectedRowKeys([...selectedRowKeys]);
          rowSelectionOnSelectAll(selected, $selectedRows, changeRows);
          onSelect(selectedRows, selectedRowKeys);
        },
        getCheckboxProps: (record) => ({
          disabled: readOnly,
          // Column configuration not to be checked
          name: record.name,
        }),
      }
    : {};

  $rowSelection =
    Object.keys(rowSelection).length === 0 && Object.keys($rowSelection).length === 0
      ? null
      : {
          ...rowSelection,
          ...$rowSelection,
        };

  return (
    <div className="table-box">
      <div className="table">
        <Table
          {...tableProps}
          columns={columns}
          dataSource={paginate(list, pageSize, pageNum)}
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
          current={pageNum}
          defaultPageSize={pageSize}
          total={total}
          showTotal={(total) => `总共 ${total} 条`}
          // rowKey={rowKey}
          rowKey={(record) => record.uid}
          {...paginationProps}
          onChange={(pageNum, pageSize) => {
            onChange({
              pageNum,
              pageSize,
            });
          }}
        />
      </div>
    </div>
  );
};

export default Index;
