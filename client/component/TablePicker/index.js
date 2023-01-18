import "./index.less";

import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Button, Modal, Popconfirm } from "antd";
import { tablePage } from "client/component/TablePage";
import { addRouterApi } from "client/router";
import React, { Component } from "react";

const { confirm } = Modal;
@addRouterApi
@tablePage
class TablePage extends Component {
  constructor(props) {
    super(props);

    const { tableProps: { rowSelection: { selectedRowKeys = [] } = {} } = {} } =
      this.props;

    this.state = {
      selectedRowKeys
    };
  }

  // 定义搜索栏字段
  getSearchFields() {
    const { searchFields = [], getSearchFields = () => ({}) } = this.props;

    return searchFields.length ? searchFields : getSearchFields(this);
  }

  // 定义Tab字段
  getTabFilterItems = () => {
    const { tabFilterItems = [], getTabFilterItems = () => ({}) } = this.props;
    return tabFilterItems.length ? tabFilterItems : getTabFilterItems(this);
  };

  // 定义表头字段
  getColumns = () => {
    const { columns = [], getColumns = () => ({}) } = this.props;
    return columns.length ? columns : getColumns(this);
  };

  /**
   * 定义表格的数据加载功能
   */
  tableDataLoader = async (searchParams = {}) => {
    const { request = () => {} } = this.props;
    const { data } = await request(searchParams);

    return {
      ...data,
      list: (() => {
        // for (let i = 0; i < 100; i++) {
        //   data.list.push(data.list[0]);
        // }
        return data.list;
      })()
    };
  };

  getTableProps = () => {
    const { tableProps = {}, getTableProps = () => ({}) } = this.props;
    // const { onSelect = () => {} } = tableProps;
    // const { onSelect: $onSelect = () => {} } = getTableProps();
    return {
      ...tableProps,
      ...getTableProps(),
      isShowSelect: true
      // onSelect: (selectedRowKeys,selectedRows ) => {
      //   onSelect(selectedRowKeys,selectedRows );
      //   $onSelect(selectedRowKeys,selectedRows );
      //   this.setState({
      //     isOnSelect: true
      //   });
      // }
    };
  };

  componentDidMount() {}
  render() {
    const { tableProps: { rowKey } = {} } = this.props;
    return (
      <div className="table-page">
        {this.renderSearch({
          shrinkLength: 5,
          initialValues: {
            type: ""
          }
          // style: {
          //   padding: "10px 0",
          // },
        })}

        {this.renderTable({
          rowKey
        })}
      </div>
    );
  }
}

class Index extends Component {
  constructor(props) {
    super(props);
    const { value = [], tableProps = {} } = this.props;
    const { rowKey } = tableProps;
    let selectedRows = value;
    let selectedRowKeys = value.map((item) => {
      return item[rowKey];
    });
    this.state = {
      loading: false,
      isModalOpen: false,
      isOnSelect: false,
      cacheSelectedRows: selectedRows,
      cacheSelectedRowKeys: value.map((item) => {
        return item[rowKey];
      }),
      selectedRows,
      selectedRowKeys
    };
  }

  componentDidMount() {}
  showModal = async () => {
    const { modalProps: { showModal = () => {} } = {} } = this.props;
    this.setState(() => ({
      loading: true
    }));
    await showModal();
    this.setState({
      isModalOpen: true,
      loading: false
    });
  };
  onOk = async () => {
    const { modalProps: { onOk = () => {} } = {}, onChange = () => {} } =
      this.props;
    const {
      cacheSelectedRows,
      cacheSelectedRowKeys,
      selectedRows,
      selectedRowKeys
    } = this.state;
    this.setState(() => ({
      loading: true
    }));
    await onOk({
      cacheSelectedRows,
      cacheSelectedRowKeys,
      selectedRows,
      selectedRowKeys,
      isOnSelect: false
    });
    this.setState({
      isModalOpen: false,
      loading: false,
      cacheSelectedRows: selectedRows,
      cacheSelectedRowKeys: selectedRowKeys,
      isOnSelect: false
    });

    onChange(selectedRows, selectedRowKeys);
  };
  onCancel = async () => {
    const { modalProps: { onCancel = () => {} } = {} } = this.props;
    const {
      isOnSelect,
      cacheSelectedRows,
      cacheSelectedRowKeys,
      selectedRows,
      selectedRowKeys
    } = this.state;
    isOnSelect &&
      (await new Promise((resolve, reject) => {
        confirm({
          icon: <ExclamationCircleOutlined />,
          content: "已选数据已更改，但未保存，您确定关闭吗？",
          onOk() {
            resolve();
          },
          onCancel() {
            reject();
          }
        });
      }));

    await onCancel({
      cacheSelectedRows,
      cacheSelectedRowKeys,
      selectedRows,
      selectedRowKeys,
      isOnSelect: false
    });

    this.setState({
      isModalOpen: false,
      loading: false,
      selectedRows: cacheSelectedRows,
      selectedRowKeys: cacheSelectedRowKeys,
      isOnSelect: false
    });
  };
  onSelect = (selectedRows, selectedRowKeys) => {
    const { tableProps = {} } = this.props;

    const { onSelect = () => {} } = tableProps;
    this.setState({
      isOnSelect: true,
      selectedRows,
      selectedRowKeys
    });

    onSelect(selectedRows, selectedRowKeys);
  };
  render() {
    const {
      modalProps = {},
      buttonText = "请选择",
      tableProps = {},
      value = [],
      request,
      openButton = true
    } = this.props;
    const { isModalOpen, isOnSelect, loading, selectedRowKeys } = this.state;

    return (
      <div className="table-picker">
        {openButton ? (
          <>
            <Button type="primary" onClick={this.showModal}>
              {buttonText}
            </Button>
            <div>
              <div key={"selected"} className="table-picker-select">
                已选: <span>({selectedRowKeys.length})</span>
              </div>
            </div>
          </>
        ) : null}

        <Modal
          destroyOnClose={true}
          width={800}
          title="Modal标题"
          open={isModalOpen}
          onCancel={this.onCancel}
          onOk={this.onOk}
          {...modalProps}
          footer={[
            <div key={"selected"} className="table-picker-select">
              已选: <span>({selectedRowKeys.length})</span>
            </div>,
            <Button key="back" loading={loading} onClick={this.onCancel}>
              关闭
            </Button>,
            <Button
              key="submit"
              type="primary"
              loading={loading}
              onClick={this.onOk}>
              确定
            </Button>
          ]}>
          <div className="table-picker-content">
            <div className="table-picker-content-table">
              <TablePage
                request={request}
                {...tableProps}
                tableProps={{
                  ...tableProps,
                  onSelect: this.onSelect,
                  rowSelection: {
                    selectedRowKeys,
                    defaultSelectedRowKeys: selectedRowKeys
                  }
                }}
              />
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

export { TablePage };
export default Index;