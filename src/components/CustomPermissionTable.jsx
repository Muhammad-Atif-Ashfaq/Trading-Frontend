
import React from 'react';
import { Table } from 'antd';

const CustomPermissionTable = ({columns,data}) => <Table columns={columns} dataSource={data}  pagination={false} style={{ border: '1px solid #e8e8e8e8', borderRadius: '5px', marginBottom: '30px' }}/>;
export default CustomPermissionTable;