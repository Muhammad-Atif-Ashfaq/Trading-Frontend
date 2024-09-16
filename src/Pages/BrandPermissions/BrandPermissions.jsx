import { useCallback, useState } from "react";
import CustomPermissionTable from "../../components/CustomPermissionTable";
import { Space,Tag,theme,Checkbox, Spin  } from 'antd';
import ARROW_BACK_CDN from '../../assets/images/arrow-back.svg';
import { useNavigate } from "react-router-dom";
import CustomButton from "../../components/CustomButton";
import { SaveBrandPermission } from "../../utils/_PermissionAPI";
import { useSelector ,useDispatch} from "react-redux";
import CustomNotification from "../../components/CustomNotification";
import { setBrandUser } from "../../store/BrandsSlice";


const BrandPermissions = () => {
  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate()
  const token = useSelector(({ user }) => user?.user?.token)
  const brand = useSelector((state)=>state?.brands?.user) ?? []
    const dispatch = useDispatch();

  const data = [
  {
    index: 0,
    module: 'Trading Account List',
    key:'trading_account_list',
    read:brand?.permissions?.find((br)=>br.name=== 'trading_account_list_read') ? true : false,
    create:brand?.permissions?.find((br)=>br.name=== 'trading_account_list_create') ? true : false,
    update:brand?.permissions?.find((br)=>br.name=== 'trading_account_list_update') ? true : false,
    del:brand?.permissions?.find((br)=>br.name=== 'trading_account_list_delete') ? true : false,
  },
  {
    index: 1,
    module: 'Trading Account Group',
    key:'trading_account_group',
    read:brand?.permissions?.find((br)=>br.name=== 'trading_account_group_read') ? true : false,
    create:brand?.permissions?.find((br)=>br.name=== 'trading_account_group_create') ? true : false,
    update:brand?.permissions?.find((br)=>br.name=== 'trading_account_group_update') ? true : false,
    del:brand?.permissions?.find((br)=>br.name=== 'trading_account_group_delete') ? true : false
  },
  {
    index: 2,
    module: 'Active Account Group',
    key:'active_account_group',
    read:brand?.permissions?.find((br)=>br.name=== 'active_account_group_read') ? true : false,
    create:brand?.permissions?.find((br)=>br.name=== 'active_account_group_create') ? true : false,
    update:brand?.permissions?.find((br)=>br.name=== 'active_account_group_update') ? true : false,
    del:brand?.permissions?.find((br)=>br.name=== 'active_account_group_delete') ? true : false
  },
  {
    index: 3,
    module: 'Margin Call Trading Account',
    key:'margin_call_trading',
    read:brand?.permissions?.find((br)=>br.name=== 'margin_call_trading_read') ? true : false,
    create:brand?.permissions?.find((br)=>br.name=== 'margin_call_trading_create') ? true : false,
    update:brand?.permissions?.find((br)=>br.name=== 'margin_call_trading_update') ? true : false,
    del:brand?.permissions?.find((br)=>br.name=== 'margin_call_trading_delete') ? true : false,
  },
   {
    index: 4,
    module: 'Live Orders',
    key:'live_orders',
    read:brand?.permissions?.find((br)=>br.name=== 'live_orders_read') ? true : false,
    create:brand?.permissions?.find((br)=>br.name=== 'live_orders_create') ? true : false,
    update:brand?.permissions?.find((br)=>br.name=== 'live_orders_update') ? true : false,
    del:brand?.permissions?.find((br)=>br.name=== 'live_orders_delete') ? true : false,
  },
  {
    index: 5,
    module: 'Pending Orders',
    key:'pending_orders',
    read:brand?.permissions?.find((br)=>br.name=== 'pending_orders_read') ? true : false,
    create:brand?.permissions?.find((br)=>br.name=== 'pending_orders_create') ? true : false,
    update:brand?.permissions?.find((br)=>br.name=== 'pending_orders_update') ? true : false,
    del:brand?.permissions?.find((br)=>br.name=== 'pending_orders_delete') ? true : false,
  },
  {
    index: 6,
    module: 'Close Orders',
    key:'close_orders',
    read:brand?.permissions?.find((br)=>br.name=== 'close_orders_read') ? true : false,
    create:brand?.permissions?.find((br)=>br.name=== 'close_orders_create') ? true : false,
    update:brand?.permissions?.find((br)=>br.name=== 'close_orders_update') ? true : false,
    del:brand?.permissions?.find((br)=>br.name=== 'close_orders_delete') ? true : false
  },
  {
    index: 7,
    module: 'Transaction Orders',
    key:'transaction_orders',
    read:brand?.permissions?.find((br)=>br.name=== 'transaction_orders_read') ? true : false,
    create:brand?.permissions?.find((br)=>br.name=== 'transaction_orders_create') ? true : false,
    update:brand?.permissions?.find((br)=>br.name=== 'transaction_orders_update') ? true : false,
    del:brand?.permissions?.find((br)=>br.name=== 'transaction_orders_delete') ? true : false,
  },
  ];



  const [permissions,setPermissions ] = useState(data)

  const handleChange =useCallback((e,index,key) => {
    const updatedPermissions = [...permissions];
    updatedPermissions[index][key] = e.target.checked; 
    setPermissions(updatedPermissions);
  },[permissions]);


  const handleAllowPermission = async()=>{

    try{
      setIsLoading(true)
    const PermissionData ={ user_id:brand.user_id,permissions: permissions}
    const mData = await SaveBrandPermission(PermissionData,token)
    const { data: { message, payload, success } } = mData
      if(success)
      {
        setIsLoading(false)
        const storePayload = {user_id:brand.user_id,permissions:payload}
        dispatch(setBrandUser(storePayload))
        
        CustomNotification({
          type: 'success',
          title: 'Permissions',
          description:message ,
          key: 1 
        });

      }
      else
      {
        setIsLoading(false)
        CustomNotification({
          type: 'error',
          title: 'Permissions',
          description:message ,
          key: 1 
        });

      }
      
    }
    catch(error)
    {
      setIsLoading(false)
       CustomNotification({
          type: 'error',
          title: 'Permissions',
          description: error.message,
          key: 1 
      });
    }
    

  }
  
  

const columns = [

  {
    title: 'Module',
    dataIndex: 'module',
    key: 'module',
    render: (text) => <a>{text}</a>,
  },
  {
    title: 'Public: Read',
    dataIndex: 'read',
    align: 'center',
    key: 'public_read',
    render: (_,{index,read} ) => (
      <div className="flex flex-row items-center justify-center">
        <Checkbox  checked = {read} onChange={(e) =>{ 
          handleChange(e,index,'read')} } />
        
       </div>
    ),
    
  },
  {
    title: 'Public: Create',
    dataIndex: 'create',
    align: 'center',
    key: 'public_create',
    render: (_, {index,create}) => (
      <div className="flex flex-row items-center justify-center">
        <Checkbox  checked = {create}  onChange={(e) => handleChange(e,index,'create')} />
       </div>
    ),
  },
  {
    title: 'Public: Update',
    dataIndex: 'update',
    align: 'center',
    key: 'public_create',
    render: (_, {index,update}) => (
      <div className="flex flex-row items-center justify-center">
        <Checkbox  checked = {update}  onChange={(e) => handleChange(e,index,'update')} />
       </div>
    ),
  },
  {
    title: 'Public: Delete',
    dataIndex: 'del',
    align: 'center',
    key: 'public_create_edit_delete',
    render: (_, {index,del}) => (
      <div className="flex flex-row items-center justify-center">
        <Checkbox  checked={del} onChange={(e) => handleChange(e,index,'del')} />
       </div>
    ),
  },

];
  
  const { token: { colorBG, TableHeaderColor, colorPrimary } } = theme.useToken();

  return (
    <Spin spinning={isLoading} size="large">
      <div className='flex flex-col gap-5 p-8' style={{ backgroundColor: colorBG }}>
        <div className='flex flex-col sm:flex-row items-center gap-2 justify-between'>
          <div className='flex gap-3'>
          <img 
           src={ARROW_BACK_CDN} 
           alt='back icon' 
           className='cursor-pointer'
           onClick={() => navigate('/brand')}
           />
          <h1 className='text-2xl font-semibold'>Brand Permissions</h1>
          </div>
         
          <CustomButton
              Text='Allow Permission'
              onClickHandler={handleAllowPermission}
            />
        
        </div>
      
        <div>
          <CustomPermissionTable  columns={columns}  data={permissions}/> 
        </div>
       
      </div>
      </Spin>
  )
}

export default BrandPermissions