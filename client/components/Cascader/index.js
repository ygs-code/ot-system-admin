// import React from 'react';
// import { Cascader } from 'antd';
// const options = [
//   {
//     value: 'zhejiang',
//     label: 'Zhejiang',
//     children: [
//       {
//         value: 'hangzhou',
//         label: 'Hanzhou',
//         children: [
//           {
//             value: 'xihu',
//             label: 'West Lake',
//           },
//         ],
//       },
//     ],
//   },
//   {
//     value: 'jiangsu',
//     label: 'Jiangsu',
//     children: [
//       {
//         value: 'nanjing',
//         label: 'Nanjing',
//         children: [
//           {
//             value: 'zhonghuamen',
//             label: 'Zhong Hua Men',
//           },
//         ],
//       },
//     ],
//   },
// ];
// const onChange = (value) => {

// };
// const App = () => <Cascader options={options} onChange={onChange} changeOnSelect />;
// export default App;

import {Divider, Select, Space, Spin, Cascader} from 'antd';

import {stabilization, mapTree} from '@/utils';
import React, {useCallback, useEffect, useState, useRef} from 'react';

const Index = (props) => {
  const {
    loadData,
    searchKey,
    value,
    selectProps,
    onChange,
    defaultOptions,
    fieldNames = {},
    dataMap,
    readOnly,
    showSearch,
    searchType,
    cascaderProps = {},
  } = props;
  const {
    value: valueKey = 'value',
    label: labelKey = 'label',
    childrenKey = 'chlidren',
  } = fieldNames;

  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [data, setData] = useState({});
  const [searchValue, setSearchValue] = useState('');
  const stabilizationRef = useRef(null);

  stabilizationRef.current = stabilization();

  const {list = [], pageNum = 0, pageSize = 10, total = 0} = data;
  let hasNextPage = pageNum * pageSize < total;

  const getData = useCallback(
    async (parameter = {}, defaultOptions = []) => {
      setLoading(true);

      const {data} = await loadData({
        // pageNum: pageNum + 1,
        // pageSize,
        ...parameter,
      });
      setLoading(false);
      setData(
        dataMap({
          ...data,
          list: mapTree(
            defaultOptions
              .concat(list)
              .concat(data.list)
              .reduce((acc, item) => {
                // 过滤重复数据
                const flag = acc.some(($item) => {
                  return `${$item[valueKey]}` === `${item[valueKey]}`;
                });
                acc = flag ? acc : [...acc, item];
                return acc;
              }, []),
            (item) => {
              return {
                ...item,
                label: item[labelKey],
                value: item[valueKey],
              };
            },
            childrenKey,
          ),

          // .map((item) => {
          //   return mapTree(
          //     item,
          //     (item) => {
          //       return {
          //         ...item,
          //         label: item[labelKey],
          //         value: item[valueKey],
          //       };
          //     },
          //     childrenKey,
          //   );
          // }),
        }),
      );
    },
    [data, loading, labelKey, searchValue],
  );

  useEffect(() => {
    if (searchType == 'local') {
      return;
    }
    stabilizationRef.current(400).then(() => {
      getData(
        {
          //   pageNum: 1,
          ...(searchKey || labelKey ? {[searchKey || labelKey]: searchValue} : {}),
        },
        searchValue.trim() === '' ? defaultOptions : [],
      );
    });
  }, [searchValue, labelKey]);

  useEffect(() => {
    stabilizationRef.current(400).then(() => {
      getData(
        {
          //   pageNum: 1,
        },
        searchValue.trim() === '' ? defaultOptions : [],
      );
    });
  }, []);

  useEffect(() => {
    if (!open) {
      //   setLoading(false);
    } else if (hasNextPage) {
      //   stabilization(300).then(() => {
      //   getData();
      //   });
    }
  }, [open, hasNextPage]);

  let searchProps = {};

  if (showSearch) {
    const filter = (input, path) => {
      return path.some((option) => {
        return (
          option?.label?.toString()?.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
          option?.[labelKey]?.toString()?.toLowerCase()?.indexOf(input.toLowerCase()) >= 0 ||
          option?.[valueKey]?.toString()?.indexOf(input.toLowerCase()) >= 0
        );
      });
    };
    searchProps =
      searchType == 'local'
        ? {
            showSearch: {
              filter,
            },
          }
        : {
            showSearch: {
              filter,
            },
            onSearch: (searchValue) => {
              setData({
                list: [],
                pageNum: 0,
                pageSize: 10,
                hasNextPage: true,
              });
              setSearchValue(searchValue);
            },
          };
  }

  return (
    <Cascader
      {...searchProps}
      value={value}
      disabled={readOnly}
      options={list}
      onChange={onChange}
      {...cascaderProps}
    />
  );
};

Index.defaultProps = {
  dataMap: (data) => data,
  onChange: () => {},
  loadData: () => {},
  showSearch: true,
  // searchKey: 'label', //
  searchType: 'local', // local or  remote
  selectProps: {},
  defaultOptions: [],
};
export default Index;
