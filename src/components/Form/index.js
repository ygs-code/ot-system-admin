/*
 * @Author: your name
 * @Date: 2021-08-23 19:51:05
 * @LastEditTime: 2021-08-26 18:17:19
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /error-sytem/@/src/common/components/Form/index.js
 */
import './index.less';

import {DownOutlined, UpOutlined} from '@ant-design/icons';
import {
  Button,
  Checkbox,
  Form,
  Input,
  InputNumber,
  Radio,
  Rate,
  Select,
  Slider,
  Switch,
  TimePicker,
  Transfer,
  DatePicker,
} from 'antd';
import LazySelect from '@/components/LazySelect';
import Cascader from '@/components/Cascader';
import {CheckDataType} from '@/utils';
import React, {Children, cloneElement, useCallback, useEffect, useState} from 'react';
const {RangePicker} = DatePicker;
const {Password, TextArea} = Input;
const ItemChild = (props) => {
  let {type = '', props: formProps = {}, component, render, onChange = () => {}, value} = props;
  type = type ? type.toLowerCase() : type;

  const {readOnly, disabled} = formProps;

  const mapTpye = {
    textarea: (
      <TextArea
        allowClear
        {...formProps}
        disabled={readOnly || disabled}
        value={value}
        onChange={onChange}
        rows={4}
      />
    ),
    input: (
      <Input
        allowClear
        {...formProps}
        disabled={readOnly || disabled}
        value={value}
        onChange={onChange}
      ></Input>
    ),
    inputnumber: (
      <InputNumber
        allowClear
        {...formProps}
        disabled={readOnly || disabled}
        value={value}
        onChange={onChange}
      ></InputNumber>
    ),
    radio: (
      <Radio
        allowClear
        {...formProps}
        disabled={readOnly || disabled}
        value={value}
        onChange={onChange}
      ></Radio>
    ),
    rate: (
      <Rate
        allowClear
        {...formProps}
        disabled={readOnly || disabled}
        value={value}
        onChange={onChange}
      ></Rate>
    ),
    select: (
      <Select
        allowClear
        {...formProps}
        disabled={readOnly || disabled}
        value={value}
        onChange={onChange}
      ></Select>
    ),
    switch: (
      <Switch
        allowClear
        {...formProps}
        disabled={readOnly || disabled}
        value={value}
        onChange={onChange}
      ></Switch>
    ),
    slider: (
      <Slider
        allowClear
        {...formProps}
        disabled={readOnly || disabled}
        value={value}
        onChange={onChange}
      ></Slider>
    ),
    timepicker: (
      <TimePicker
        allowClear
        {...formProps}
        disabled={readOnly || disabled}
        value={value}
        onChange={onChange}
      ></TimePicker>
    ),
    transfer: (
      <Transfer
        allowClear
        {...formProps}
        disabled={readOnly || disabled}
        value={value}
        onChange={onChange}
      ></Transfer>
    ),
    checkbox: (
      <Checkbox
        {...formProps}
        disabled={readOnly || disabled}
        value={value}
        onChange={onChange}
      ></Checkbox>
    ),
    password: (
      <Password
        allowClear
        {...formProps}
        disabled={readOnly || disabled}
        value={value}
        onChange={onChange}
      ></Password>
    ),

    rangepicker: (
      <RangePicker
        allowClear
        {...formProps}
        disabled={readOnly || disabled}
        value={value}
        onChange={onChange}
      ></RangePicker>
    ),

    lazyselect: (
      <LazySelect
        allowClear
        {...formProps}
        disabled={readOnly || disabled}
        value={value}
        onChange={onChange}
      ></LazySelect>
    ),

    cascader: (
      <Cascader
        allowClear
        {...formProps}
        disabled={readOnly || disabled}
        value={value}
        onChange={onChange}
      ></Cascader>
    ),
  };

  return render
    ? render({
        ...props,
        render: undefined,
      })
    : component
    ? component
    : type in mapTpye
    ? mapTpye[type]
    : null;
};

const BaseForm = (props) => {
  const {
    fields = [],
    formProps = {},
    onReady = () => {},
    children = [],
    onConfirm = () => {},
    // onReset = () => {},
    initialValues = {},
  } = props;

  const [form] = Form.useForm();
  const [formInitialValues, setFormInitialValues] = useState({});

  const transformInitialValues = useCallback(async (initialValues) => {
    if (CheckDataType.isFunction(initialValues)) {
      return initialValues(form);
    }
    if (CheckDataType.isPromise(initialValues)) {
      return await initialValues(form);
    }

    return initialValues;
  }, []);
  const getInitialValues = useCallback(async () => {
    const vavlues = await transformInitialValues(initialValues);
    setFormInitialValues(vavlues);
  }, []);

  useEffect(() => {
    getInitialValues();
  }, []);

  // initialValues
  const onFinish = (values) => {
    onConfirm(values);
  };

  const onFinishFailed = (errorInfo) => {};
  useEffect(() => {
    onReady(form);
  }, [form]);

  return (
    <div className="base-form">
      <Form
        key={JSON.stringify(formInitialValues)}
        form={form}
        name="basic"
        labelCol={{
          span: 4,
        }}
        wrapperCol={{
          span: 15,
        }}
        initialValues={formInitialValues}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        {...formProps}
      >
        {fields.map((item, index) => {
          const {
            type,
            title,
            items = [],
            render,
            itemProps = {},
            label,
            name,
            props = {},
            options = [],
            rules,
          } = item;


          console.log('itemProps=',itemProps)

          return type !== 'section' ? (
            <Form.Item rules={rules} label={label} name={name} 
            
            // {...itemProps} 
            
            key={index}
            
            
            
            labelCol ={ {
              span: 4,
            }}
            wrapperCol={{
              span: 100,
            }}
            
            
            >
              <ItemChild type={type} props={props} options={options} render={render}></ItemChild>
            </Form.Item>
          ) : (
            <div className="section" key={index}>
              <div className="title">{title}</div>
              {items.map(($item, index) => {
                const {
                  render,
                  itemProps = {},
                  label,
                  name,
                  options = [],
                  props = {},
                  type,
                  rules,
                } = $item;

                return (
                  <Form.Item label={label} name={name} rules={rules} {...itemProps} key={index}>
                    <ItemChild
                      type={type}
                      props={props}
                      options={options}
                      render={render}
                    ></ItemChild>
                  </Form.Item>
                );
              })}
            </div>
          );
        })}

        {/* 子节点 */}
        {Children.map(CheckDataType.isFunction(children) ? children() : children, (child) => {
          return cloneElement(child, props);
        })}
      </Form>
    </div>
  );
};

const SearchForm = (props) => {
  const {
    fields = [],
    formProps = {},
    onReady = () => {},
    children = [],
    shrinkLength,
    onConfirm = () => {},
    onReset = () => {},
    initialValues = {},
  } = props;

  const [form] = Form.useForm();

  const [formInitialValues, setFormInitialValues] = useState({});

  const transformInitialValues = useCallback(async (initialValues) => {
    if (CheckDataType.isFunction(initialValues)) {
      return initialValues(form);
    }
    if (CheckDataType.isPromise(initialValues)) {
      return await initialValues(form);
    }

    return initialValues;
  }, []);
  const getInitialValues = useCallback(async () => {
    const values = await transformInitialValues(initialValues);
    setFormInitialValues(values);
  }, []);

  useEffect(() => {
    getInitialValues();
  }, []);

  const [expand, setExpand] = useState(false);

  const onFinish = (values) => {
    onConfirm(values);
  };

  const onFinishFailed = (errorInfo) => {};

  const onFill = () => {
    const values = form.getFieldsValue();
    const restValues = Object.keys(values).reduce((acc, item) => {
      return {
        ...acc,
        [item]: undefined,
      };
    }, {});

    form.setFieldsValue(restValues);
    onReset(restValues);
  };

  useEffect(() => {
    onReady(form);
  }, []);

  const renderFields = useCallback(() => {
    let length = shrinkLength
      ? expand
        ? fields.length
        : shrinkLength > fields.length
        ? fields.length
        : shrinkLength
      : fields.length;
    let fieldsVonde = [];
    for (let index = 0; index < length; index++) {
      const item = fields[index];

      const {span = 1, label, name, itemProps = {}, render, type, props, options, rules} = item;

      fieldsVonde.push(
        <div key={index} className={`span span-${span}`}>
          <Form.Item rules={rules} label={label} name={name} {...itemProps}>
            <ItemChild type={type} props={props} options={options} render={render}></ItemChild>
          </Form.Item>
        </div>,
      );
    }
    return fieldsVonde;
  }, [expand, fields]);

  return (
    <div className="search-base-form-box">
      <Form
        key={JSON.stringify(formInitialValues)}
        className="search-base-form"
        form={form}
        name="basic"
        labelCol={{
          span: 7,
        }}
        // wrapperCol={{
        //   span: 20,
        // }}
        initialValues={formInitialValues}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        {...formProps}
      >
        {renderFields()}
        <div className={`buttons`}>
          {shrinkLength >= fields.length || !shrinkLength ? null : (
            <a
              style={{fontSize: 12}}
              onClick={() => {
                setExpand(!expand);
              }}
            >
              {expand ? (
                <>
                  <UpOutlined />
                  收起
                </>
              ) : (
                <>
                  <DownOutlined /> 展开
                </>
              )}
            </a>
          )}
          <Button type="primary" htmlType="submit">
            搜索
          </Button>
          <Button htmlType="button" onClick={onFill}>
            重置
          </Button>

        </div>

        {/* 子节点 */}
        {Children.map(CheckDataType.isFunction(children) ? children() : children, (child) => {
          return cloneElement(child, props);
        })}
      </Form>
    </div>
  );
};
// BaseForm.SearchForm=SearchForm
export default BaseForm;
export {SearchForm};
