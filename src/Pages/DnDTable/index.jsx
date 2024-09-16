import React, { Component, createRef } from "react";
import "./index.css";
import { Input, Spin, Table } from "antd";
import { Resizable } from "react-resizable";
import ReactDragListView from "react-drag-listview";
import CustomButton from "../../components/CustomButton";
import TableActions from "./TableActions";
import CustomNotification from "../../components/CustomNotification";
import CustomModal from "../../components/CustomModal";
import { Autocomplete, FormControlLabel, Radio, RadioGroup, Stack, TextField, Typography } from "@mui/material";
import { GenericDelete, MassCloseOrders, UpdateMultiTradeOrder } from "../../utils/_APICalls";
import Swal from "sweetalert2";
import { GetSettings, SetSettings } from "../../utils/_SettingsAPI";
import { setTradingAccountGroupData } from "../../store/tradingAccountGroupSlice";
import { setAccountID } from "../../store/TradeSlice";
import { downloadFile, getValidationMsg } from "../../utils/helpers";
import { massExport } from "../../utils/_ExportApi";
import pusher from "../../pusher";


const ResizableTitle = (props) => {
  const { onResize, width, ...restProps } = props;

  if (!width) {
    return <th {...restProps} />;
  }
  return (
    <Resizable
      width={width}
      height={0}
      handle={
        <span
          className="react-resizable-handle"
          onClick={(e) => {
            e.stopPropagation();
          }}
        />
      }
      onResize={onResize}
      draggableOpts={{ enableUserSelectHack: false }}
    >
      <th {...restProps} />
    </Resizable>
  );
};

class DnDTable extends Component {
  constructor(props) {
    super(props);
    this.inputRef = createRef();
    this.state = {
      columns: props.columns,
      handlePageChange: props.handlePageChange,
      errorMessage:'',
      isRearangments: false,
      isExportModal: false,
      isProceedModal:false,
      isMassEdit: false,
      isMassDelete: false,
      isAddRemove: false,
      selectedRowKeys: [],
      selectedRowKeys_All: [],
      dropDownColumns: [],
      selectedColumns: null,
      isCompleteSelect: false,
      isLoading: false,
      data: [],
      isUpated: true,
      searchValues: {},
      buttonCreated: false,
      isSearching: true,
      isClear: false,
      exportDelimiter: ','

    };
    this.setIsRearangments = this.setIsRearangments.bind(this);
    this.MassExportHandler = this.MassExportHandler.bind(this);
    this.setIsExportModal = this.setIsExportModal.bind(this);
    this.setIsMassEdit = this.setIsMassEdit.bind(this);
    this.setIsMassDelete = this.setIsMassDelete.bind(this);
    this.setIsAddRemove = this.setIsAddRemove.bind(this);
    this.handleSaveChanges = this.handleSaveChanges.bind(this);
    this.onSelectChange = this.onSelectChange.bind(this);
    this.onSelectAllChange = this.onSelectAllChange.bind(this);
    this.toggleCompleteSelect = this.toggleCompleteSelect.bind(this);
    this.MassEditHandler = this.MassEditHandler.bind(this);
    this.MassDeleteHandler = this.MassDeleteHandler.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.setColumnsSetting = this.setColumnsSetting.bind(this)
    this.useEffect = this.useEffect.bind(this)
    this.SearchHandler = this.SearchHandler.bind(this)
    this.MassCloseOrdersHandler = this.MassCloseOrdersHandler.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleClearSearch = this.handleClearSearch.bind(this)
    this.calculateItemRange = this.calculateItemRange.bind(this)
    const that = this;
    this.dragProps = {
      onDragEnd(fromIndex, toIndex) {
        if (that.state.isRearangments) {
          const columns = [...that.state.columns];
          const item = columns.splice(fromIndex - 1, 1)[0];
          columns.splice(toIndex - 1, 0, item);
          that.setState({
            columns,
          });
        } else {
          CustomNotification({
            type: "error",
            title: "Validation",
            description:
              "If you want to Rearrange columns, please first turn on Rearange  mode",
            key: "1",
          });
        }
      },
      nodeSelector: "th",
      handleSelector: ".dragHandler",
      ignoreSelector: "react-resizable-handle",
    };
  }

  callSearchHandler() {
    this.SearchHandler(this.props.current)
  }

  async SearchHandler(currentPage) {
    const queryParams = {
      ...this.state.searchValues,
      ...this.props.SearchQueryList,
    }
    this.props.LoadingHandler(true)
    const res = await this.props.SearchQuery(this.props.token, currentPage, this.props.perPage, queryParams)
    const { data: { payload, success, message } } = res
    if (success) {
      const data = this.props.searchQueryManipulation ? await this.props.searchQueryManipulation(payload.data) : payload.data
      this.props.LoadingHandler(false)
      this.props.setCurrentPage(payload.current_page)
      this.props.setTotalRecords(payload.total)
      this.props.setLastPage(payload.last_page)
      this.setState({ data: data })
      this.props.dispatch(this.props.setTableData(data))
      localStorage.setItem('isCompleteSelect', JSON.stringify(false));
      if (this.state.isCompleteSelect) {
        const allRowKeys = payload?.data?.map((row) => row.id);
        this.setState({ selectedRowKeys: allRowKeys });
      }
    }
  }
 
    handleModalOk() {
    // Add your export logic here
    console.log('Export logic goes here');
    this.setState({ isExportModal: false });
  }
    handleModalCancel() {
    this.setState({ isExportModal: false });
  }
  // createButtonAndHR = () => {
  //   const firstColumnHeaderCell = document.querySelector('.ant-table-thead tr:first-child th:first-child');
  //   if (firstColumnHeaderCell && !this.state.buttonCreated) {
  //     const hr = document.createElement('hr');
  //     hr.classList.add("custom-line");
  //     firstColumnHeaderCell.appendChild(hr);

  //     const button = document.createElement('button');
  //     button.classList.add('custom-button');
  //     button.innerText = 'Search'; // Set initial button text
  //     button.style.backgroundColor = '#1CAC70'; // Set initial button color
  //     button.addEventListener('click', this.handleButtonClick);
  //     firstColumnHeaderCell.appendChild(button);

  //     this.setState({ buttonCreated: true });
  //   }
  // };

  handleClearSearch = () => {
    const clearedSearchValues = {};
    const inputRefs = Object.keys(this.state.searchValues);

    inputRefs.forEach((key) => {
      clearedSearchValues[key] = '';
    });

    this.setState({
      searchValues: clearedSearchValues,
      isSearching: true
    }, () => {
      document.querySelectorAll(".search-input").forEach(element => {
        element.value = '';
      });
      this.SearchHandler(this.props.current);
    });
  };

  async useEffect() {
    const firstColumnHeaderCell = document.querySelector('.ant-table-thead tr:first-child th:first-child');
    if (!this.state.buttonCreated) {
      const hr = document.createElement('hr');
      hr.classList.add("custom-line")
      firstColumnHeaderCell.appendChild(hr);
      const button = document.createElement('button');
      button.classList.add('custom-button');
      // Add event listener to the button
      button.addEventListener('click', () => {
        if (this.state.isSearching) {
          this.SearchHandler(this.props.current)
          this.setState({ isSearching: false })
        } else {
          this.setState({ isSearching: true })
          this.props.LoadingHandler(true)
          this.handleClearSearch()

          setTimeout(() => {
            this.setState({ data: this.props.data });
            this.props.LoadingHandler(false)
          }, 2000)
        }

      });
      firstColumnHeaderCell.appendChild(button);
    }
    this.setState({ buttonCreated: true })
    const columnsWithChildren = this.props.columns?.map(column => ({
      ...column,
      children: [ // inputs
        {
          title: <Input
            id={`search-input`}
            className={'search-input'}
            placeholder={`Search ${column?.title?.props?.children}`}
            value={this.state.searchValues[column.dataIndex]}
            onChange={e => this.handleInputChange(column.dataIndex, e.target.value)}
            onPressEnter={() => {
              // Check if object has no keys and if all keys have empty values. Our object is (this.state.searchValues)
              if (Object.keys(this.state.searchValues).length === 0 || Object.values(this.state.searchValues).every(value => value === null || value === undefined || value === '')) {
                this.setState({ isSearching: true })
              }
              else {
                this.setState({ isSearching: false })
              }
              this.SearchHandler(this.props.current)
            }}
            ref={this.inputRef}
          />,
          dataIndex: column.dataIndex,
          key: `${column.dataIndex}-search`,
          width: 150,
        }
      ]
    }));
    this.setState({ columns: columnsWithChildren })
    try {
      const ColumnsData = columnsWithChildren?.map(x => {
        return {
          key: x.key,
          dataIndex: x.dataIndex,
          title: typeof x.title === 'string' ? x.title : x?.title?.props?.children
        }
      })
      const Params = {
        names: [this.props.formName + this.props.user.id]
      }
      // this.setState({dropDownColumns: ColumnsData, selectedColumns: ColumnsData})
      this.setState({ isLoading: true })
      const res = await GetSettings(Params, this.props.token)
      const { data: { message, payload, success } } = res
      this.setState({ isLoading: false })
      if (payload && payload.length > 0) {
        const selectedCols = JSON.parse(payload[0].value) // from db
        this.SearchHandler(this.props.current)
        // const filteredColumns = columnsWithChildren.filter(column =>  
        //   selectedCols.some(selectedColumn => selectedColumn.dataIndex === column.dataIndex)
        // );
        const columnMap = {};
        columnsWithChildren.forEach(column => {
          columnMap[column.dataIndex] = column;
        });

        console.log(selectedCols)
        const filteredColumns = selectedCols?.map(selectedColumn => {
          const column = columnMap[selectedColumn.dataIndex];
          return column;
        });
        const mData = ColumnsData.filter(column =>
          selectedCols.some(selectedColumn => selectedColumn.dataIndex === column.dataIndex)
        );

        if (success) {
          this.setState({ columns: filteredColumns, dropDownColumns: ColumnsData, selectedColumns: mData });
        } else {
          this.setState({ columns: ColumnsData, dropDownColumns: ColumnsData, selectedColumns: ColumnsData });
        }
      } else {
        this.SearchHandler(this.props.current)
        this.setState({ columns: columnsWithChildren, dropDownColumns: ColumnsData, selectedColumns: ColumnsData });
      }


    } catch (err) {
      alert(`Error occured ${err.message}`)
    }
  }
  async handleReCalculate() {
    if (this.props.searchQueryManipulation) {
      const data = await this.props.searchQueryManipulation(this.state.data);
      this.setState({ data: data });
    }
  }

  componentDidMount() {
   
    this.useEffect()
}

  componentWillUnmount() {
  // Unsubscribe from Pusher channel to prevent memory leaks
  if (this.channel) {
    this.channel.unbind('update',this.handlePusherUpdate);
    pusher.unsubscribe('trading_accounts');
  }
}

  componentDidUpdate(prevProps, prevState) {

    if (prevProps.columns !== this.props.columns) {
      this.setState({ columns: this.props.columns });
    } else if (prevProps.data !== this.props.data && this.state.isCompleteSelect) {
      const allRowKeys = this.props.data?.map((row) => this.props.column_name ? row[this.props.column_name] : row.id);
      this.setState({ selectedRowKeys: allRowKeys });
    }
    if (this.props?.data?.length > 0 && prevProps.data !== this.props.data) {
      this.setState({ data: this.props.data });
    }
    if (prevProps.isSearching !== this.state.isSearching) {
      const buttonText = this.state.isSearching ? 'Search' : 'Clear';
      const searchButton = document.querySelector('.ant-table-thead tr:first-child th:first-child button');
      if (searchButton) {
        searchButton.innerText = buttonText;
        if (!this.state.isSearching) {
          searchButton.style.backgroundColor = 'red'
        } else {
          searchButton.style.backgroundColor = '#1CAC70'
        }
      }
    }

    if(prevProps.isReCalculate !== this.props.isReCalculate && this.state.data.length){
     this.handleReCalculate()
    }

    // active trading account data is setting here

    this.channel = pusher.subscribe('trading_accounts');
    this.channel.bind('update', (data)=> this.handlePusherUpdate(data));

  }

  handlePusherUpdate = (data) => {
    debugger
        
    //  add data in active array 
    if ( data.status === 'login' && Object.keys(this.props.activeAccount).length   && this.props.activeAccountFlag) {
      
      this.props.LoadingHandler(true)

      const newData = this.state.data
      newData.push(data)        
      this.setState({ data: newData })
      this.props.LoadingHandler(false)

    }

    //remove data from array
    if ( !Object.keys(this.props.activeAccount).length  && !this.props.activeAccountFlag) {
      this.props.LoadingHandler(true)
      const newData = this.state.data.filter(x => x.id !== data.id)
      this.setState({ data: newData })
      this.props.LoadingHandler(false)
    }
  }

  // closeOrderHandler = () => {
  // }


  handleInputChange = (dataIndex, value) => {
    this.setState(prevState => ({
      searchValues: {
        ...prevState.searchValues,
        [dataIndex]: value
      }
    }));
  };
  components = {
    header: {
      cell: ResizableTitle,
    },
  };

  onSelectChange(newSelectedRowKeys) {

    this.setState({ selectedRowKeys: newSelectedRowKeys });
  }

  handleResize = (index) => (e, { size }) => {
    this.setState(({ columns }) => {
      const nextColumns = [...columns];
      nextColumns[index] = {
        ...nextColumns[index],
        width: size.width,
      };
      return { columns: nextColumns };
    });
  };

  handleRowClick = (record) => {
    this.setState({ currentRecords: record });
    if (this.props.column_name) {
      this.props.dispatch(this.props.setCurrentData(record))
    }
    this.props.dispatch(this.props.setSelecetdIDs([this.props.column_name ? record[this.props.column_name] : record.id]))
    if (this.props.direction === "/single-trading-accounts/details/live-order") {
      this.props.dispatch(setTradingAccountGroupData(record))
      // this.props.dispatch(setAccountID(record.id))
    }
    this.props.navigate(this.props.direction);
  };

  setIsRearangments(newValue) {
    this.setState({
      isRearangments: newValue,
      isMassEdit: false,
      isMassDelete: false,
      isAddRemove: false,
      isSelectAll: false,
      isCompleteSelect: false,
    });
  }
  setIsMassEdit(newValue) {
    this.setState({
      isRearangments: false,
      isMassEdit: newValue,
      isMassDelete: false,
      isAddRemove: false,
      isSelectAll: false,
      isCompleteSelect: false,
    });
  }
  setIsMassDelete(newValue) {
    this.setState({
      isRearangments: false,
      isMassEdit: false,
      isMassDelete: newValue,
      isAddRemove: false,
      isSelectAll: false,
      isCompleteSelect: false,
    });
  }
  setIsAddRemove(newValue) {
    this.setState({
      isRearangments: false,
      isMassEdit: false,
      isMassDelete: false,
      isAddRemove: newValue,
      isSelectAll: false,
      isCompleteSelect: false,
    });
  }

  setIsExportModal(newValue) {

    this.setState({
      isExportModal: newValue,
      isMassEdit: false,
      isMassDelete: false,
      isAddRemove: false,
      isSelectAll: false,
      isCompleteSelect: false,
    });
  }

  MassExportHandler(newValue) {
    this.setState({
      exportSelected: newValue,
      isMassEdit: false,
      isMassDelete: false,
      isAddRemove: false,
      isSelectAll: false,
      isCompleteSelect: false,
    });
  }
  handleSaveChanges() {
    if (this.state.isRearangments) {
      const ColumnsData = this.state.columns?.map(x => {
        return {
          key: x.key,
          dataIndex: x.dataIndex,
          title: typeof x.title === 'string' ? x.title : x?.title?.props?.children
        }
      })
      this.setColumnsSetting(ColumnsData, "Columns Rearrangement Sucessfully")
      this.setIsRearangments(false);
    }
  }
  // handleClearSearch = () => {
  //   const clearedSearchValues = {};
  //   const inputRefs = Object.keys(this.state.searchValues);
  //   inputRefs.forEach((key) => {
  //     clearedSearchValues[key] = '';
  //   });
  //   console.log(clearedSearchValues, "STATE VALUES")
  //   this.setState({ searchValues:clearedSearchValues, isSearching: true })
  //   document.getElementById("search-input").value = ''
  //   this.SearchHandler(this.props.current)
  // };

  onSelectAllChange(checked, selectedRows) {
    this.setState({ isSelectAll: checked });
  }
  handleDelimiterChange = (event) => {
    this.setState({ exportDelimiter: event.target.value });
  };
  toggleCompleteSelect() {
    this.setState((prevState) => ({ isCompleteSelect: !prevState.isCompleteSelect }),
      () => {
        localStorage.setItem('isCompleteSelect', JSON.stringify(this.state.isCompleteSelect));
        if (this.state.isCompleteSelect) {
          const allRowKeys = this.props.data?.map((row) => this.props?.column_name ? row[this.props?.column_name] : row.id); this.setState({ selectedRowKeys: allRowKeys });

        } else {
          this.setState((prevState) => ({ isSelectAll: !prevState.isSelectAll }))
          this.setState({ selectedRowKeys: [] })
          localStorage.setItem('isCompleteSelect', JSON.stringify(false));
        }
      }
    );


  }
  MassEditHandler() {
    if (this.state.selectedRowKeys.length > 0) {
      this.props.dispatch(this.props.setSelecetdIDs(this.state.selectedRowKeys))
      this.props.navigate(this.props.direction);
    } else {
      CustomNotification({
        type: "error",
        title: "Validation",
        description: "Please select any record first",
        key: "2",
      })
    }
  }

  async MassProceed(skip){

    this.setState({isProceedModal:false}) 
      const Params = {
        table_name: this.props.table_name,
        table_ids: this.state.isCompleteSelect ? [] : this.state.selectedRowKeys,
        skip
      }
      
        const res = await GenericDelete(Params, this.props.token)
          const { data: { success, message, payload } } = res

          if (success) {
            this.props?.setTotalRecords(this.props?.total - this.state?.selectedRowKeys?.length)
            if (this.props.direction === "/trading-group/mass-deposit" || this.props.direction === "/trading-group/mb-to") {
              const newData = this.state.data.filter(item => !this.state.selectedRowKeys.includes(item[this.props.column_name]));
              this.setState({ data: newData })
              
            } else {
              this.SearchHandler(this.props.current)
             
            }
            CustomNotification({
              type: "success",
              title: "Deleted",
              description: message,
              key: "a4",
            })
          } else {

              CustomNotification({
                type: "error",
                title: "Oppssss..",
                description: message,
                key: "b4",
              })            
          }
  




  }

  async MassDeleteHandler() {
    if (this.state.selectedRowKeys.length > 0) {
      const Params = {
        table_name: this.props.table_name,
        table_ids: this.state.isCompleteSelect ? [] : this.state.selectedRowKeys,
      }
      if (this.props.column_name) {
        Params.column_name = this.props.column_name;
      }
      this.setState({ isLoading: true })
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#1CAC70",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then(async (result) => {
        if (result.isConfirmed) {
          //
          const res = await GenericDelete(Params, this.props.token)
          const { data: { success, message, payload } } = res
          this.setState({ isLoading: false })

          if (success) {
            this.props?.setTotalRecords(this.props?.total - this.state?.selectedRowKeys?.length)
            if (this.props.direction === "/trading-group/mass-deposit" || this.props.direction === "/trading-group/mb-to") {
              const newData = this.state.data.filter(item => !this.state.selectedRowKeys.includes(item[this.props.column_name]));
              this.setState({ data: newData })
            } else {
              this.SearchHandler(this.props.current)
            }
            CustomNotification({
              type: "success",
              title: "Deleted",
              description: message,
              key: "a4",
            })
          } else {

            const errorMsg = getValidationMsg(message, payload)
            // CustomNotification({ type: "error", title: "Oppssss..", description: errorMsg, key: 1 })
             
            if (errorMsg){
              // CustomNotification({
              //   type: "error",
              //   title: "Oppssss..",
              //   description: errorMsg,
              //   key: "b4",
              // })
             this.setState({isProceedModal:true})
             this.setState({errorMessage:errorMsg})
            }
            else
              CustomNotification({
                type: "error",
                title: "Oppssss..",
                description: message,
                key: "b4",
              })
          }

        }
      });
      this.setState({ isLoading: false })

    } else {
      CustomNotification({
        type: "error",
        title: "Validation",
        description: "Please select any record first",
        key: "6",
      })
    }
  }
  async MassExportHandler() {

    if (this.state.selectedRowKeys.length > 0) {
      const Params = {
        table_name: this.props.table_name,
        table_ids: this.state.isCompleteSelect ? [] : this.state.selectedRowKeys,
        delimiter: this.state.exportDelimiter,
        export_columns: this.props.exportColumns,
      };
      if (this.props.column_name) {
        Params.column_name = this.props.column_name;
      }
      this.setState({ isLoading: true });

      try {
        const res = await massExport(Params, this.props.token);
        const { data: { success, message, payload } } = res; 
        this.setState({ isLoading: false });
        console.log(res, 'this is response');
        if (success) {
          CustomNotification({
            type: "success",
            title: "Exported",
            description: message,
            key: "a4",
          });
          this.setState({ isExportModal: false,selectedRowKeys:[] })
          downloadFile(payload.url, 'exported_file.csv');
        } else {
          const errorMsg = getValidationMsg(message, payload);
          if (errorMsg) {
            CustomNotification({
              type: "error",
              title: "Oppssss..",
              description: errorMsg,
              key: "b4",
            });
          }
        }
      } catch (error) {
        this.setState({ isLoading: false });
        CustomNotification({
          type: "error",
          title: "Error",
          description: "An error occurred while exporting",
          key: "c4",
        });
      }

    } else {
      CustomNotification({
        type: "error",
        title: "Validation",
        description: "Please select any record first",
        key: "6",
      });
    }
  }

  getCurrentFormattedTime() {
    const now = new Date();
    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    };
    return now.toLocaleString('en-US', options);
  }
  //#region Mass close order handler
  async MassCloseOrdersHandler() {
    const selectedData = this.state.data.filter(item => this.state.selectedRowKeys.includes(item.id))
    const modifiedData = selectedData?.map(item => {
      return {
        ...item,
        order_type: 'close',
        close_time: this.getCurrentFormattedTime(),
        close_price: item.currentPrice
      };
    });
    if (this.state.selectedRowKeys.length > 0) {
      const Params = { orders: modifiedData }
      this.setState({ isLoading: true })
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#1CAC70",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Close it!"
      }).then(async (result) => {
        if (result.isConfirmed) {
          const res = await UpdateMultiTradeOrder(Params, this.props.token)
          const { data: { success, message, payload } } = res
          this.setState({ isLoading: false })
          if (success) {
            const newData = this.state.data.filter(item => !this.state.selectedRowKeys.includes(item.id));
            this.setState({ data: newData })
            CustomNotification({
              type: "success",
              title: "Deleted",
              description: message,
              key: "a4",
            })
          } else {
            CustomNotification({
              type: "error",
              title: "Oppssss..",
              description: message,
              key: "b4",
            })
          }

        }
      });
      this.setState({ isLoading: false })

    } else {
      CustomNotification({
        type: "error",
        title: "Validation",
        description: "Please select any record first",
        key: "6",
      })
    }
  }

  handleExportCancel() {
    this.setState({ isExportModal: false })
  }
  handleCancel() {
    this.setState({ isAddRemove: false })
  }

  handleProceedCancel(){
    this.setState({isProceedModal:false})
  }

  async setColumnsSetting(values, msg) {

    try {
      const Params = {
        data: {
          name: this.props.formName + this.props.user.id,

        }
      }
      const ColumnsData = this.state.columns?.map(x => {
        return {
          key: x.key,
          dataIndex: x.dataIndex,
          title: typeof x.title === 'string' ? x.title : x?.title?.props?.children
        }
      })
      this.props.LoadingHandler(true)
      // Sort array A based on the index of keys in array B
      // if values length is less then its means remove column , if greater means add columns , in case of remove column remove column from columns data else add column
      if (values.length > ColumnsData.length) {
        const keysInB = new Set(ColumnsData?.map(item => item.key));
        values.forEach(item => {
          if (!keysInB.has(item.key)) {
            ColumnsData.push(item);
          }
        });
        Params.data.value = JSON.stringify(ColumnsData)
      } else if (values.length < ColumnsData.length) {
        const keysInValues = new Set(values.map(obj => obj.key));
        const mData = ColumnsData.filter(item => keysInValues.has(item.key));
        Params.data.value = JSON.stringify(mData)
      } else {
        Params.data.value = JSON.stringify(values)
      }
      this.setState({ isLoading: true })
      const res = await SetSettings(Params, this.props.token)
      const { data: { message, data, success } } = res
      this.setState({ isLoading: false })
      if (success) {
        this.handleCancel()
        CustomNotification({
          type: "success",
          title: "Success ",
          description: message,
          key: "arr4",
        })

        this.useEffect()
        this.props.LoadingHandler(false)

      } else {
        CustomNotification({
          type: "error",
          title: "Oppssss... ",
          description: message,
          key: "arr4",
        })
      }
    } catch (err) {
      alert(err.message)
    } finally {
      this.props.LoadingHandler(false)
    }

  }
  calculateItemRange = () => {
    const { current, perPage, total } = this.props;
    const start = (current - 1) * perPage + 1;
    const end = Math.min(current * perPage, total);
    return `Showing ${start}-${end} of ${total} items`;
  };
  render() {
    const { columns, selectedRowKeys } = this.state;
    const combinedColumns = columns?.map((stateCol, index) => ({
      ...stateCol,
      onHeaderCell: (column) => ({
        width: column.width,
        onResize: this.handleResize(index),
      }),
    }));

    // const rowSelection = {
    //   selectedRowKeys: this.state.selectedRowKeys,
    //   onChange: this.onSelectChange, 
    //   onSelectAll: this.onSelectAllChange,
    // };
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: this.onSelectChange,
      onSelectAll: this.onSelectAllChange,
      getCheckboxProps: (record) => ({
        disabled: (record.id === 1 && this.props.table_name === "symbel_groups"),
      }),
    };


    return (
      <>
        <ReactDragListView.DragColumn {...this.dragProps}>

          <div className="flex justify-center gap-4">
            <div></div>
            {
              this.state.isSelectAll &&
              <h1
                className="text-2xl font-semibold text-blue-500 cursor-pointer"
                onClick={this.toggleCompleteSelect}
              >
                {this.state.isCompleteSelect ? `Deselect All Data (${this.props.total})` : `Select All Data (${this.props.total})`}
              </h1>
            }
          </div>
          <Table
            bordered
            className="mt-4"
            title={() => (
              <div style={{ textAlign: 'right' }}>
                <div className="self-end">
                  {!(
                    this.state.isRearangments
                  ) ? (
                    <TableActions
                      setIsExportModal={this.setIsExportModal}
                      setIsRearangments={this.setIsRearangments}
                      setIsMassEdit={this.setIsMassEdit}
                      setIsAddRemove={this.setIsAddRemove}
                      selectedRows={this.state.selectedRowKeys}
                      MassEditHandler={this.MassEditHandler}
                      MassDeleteHandler={this.MassDeleteHandler}
                      setPerPage={this.props.setPerPage}
                      editPermissionName={this.props.editPermissionName}
                      deletePermissionName={this.props.deletePermissionName}
                      direction={this.props.direction}
                      MassCloseOrdersHandler={this.MassCloseOrdersHandler}
                      addButton={this.props.addButton}
                      hideDeleteEdit={this.props.hideDeleteEdit}
                      backendColumns={this.props.backendColumns}
                      tableName={this.props.table_name}
                      exportColumns={this.props.exportColumns}
                    />
                  ) : (
                    <CustomButton
                      Text={"Save Changes"}
                      className='mb-3 mt-6'
                      onClickHandler={this.handleSaveChanges}
                    />
                  )}
                </div>

              </div>
            )}
            footer={this.props.footer}
            components={this.components}
            columns={combinedColumns}
            dataSource={this.state.data}
            pagination={{
              current: this.props.current,
              pageSize: this.props.perPage,
              total: this.props.total,
              onChange: (page, pageSize) => {
                this.SearchHandler(page)
                this.props.setCurrentPage(page);
                this.props.handlePageChange(page)
              },
            }}
            rowSelection={rowSelection}
            showSorterTooltip={false}
            summary={this.props.summary}
            onChange={(pagination, filters, sorter) => {
              this.props.setSortDirection(sorter.order);
            }}
            rowKey={this.props.column_name ? this.props.column_name : "id"}
            onRow={(record) => ({
              onClick: (event) => {
                const clickedCell = event.target.closest("td");
                if (clickedCell) {
                  const columnIndex = clickedCell.cellIndex;
                  const tableHeader = clickedCell.closest("table").querySelector(
                    "thead"
                  );
                  const columnName =
                    tableHeader.querySelector(
                      `th:nth-child(${columnIndex + 1})`
                    ).textContent;

                  if (columnName !== "Action" && columnName !== "Search" && columnName !== "Authorization Key" && columnName !== "Mass Buy/Sell Trading Order" && columnName !== "Mass deposit/widthdraw" && columnName !== "Trading Accounts") {
                    this.handleRowClick(record);
                  }
                }
              },
            })}
            scroll={{ x: 'max-content' }}
          />
        </ReactDragListView.DragColumn>
        <div style={{ textAlign: "right", marginTop: "10px" }}>
          {this.calculateItemRange()}
        </div>
        <CustomModal
          title={this.props.formName + ' - Add Remove Columns'}
          isModalOpen={this.state.isAddRemove}
          footer={[]}
          width={600}
          maskClosable={false}
          handleCancel={this.handleCancel}
        >
          <Autocomplete
            multiple
            id="columns"
            options={this.state.dropDownColumns}
            getOptionLabel={(option) => option?.title ? option?.title : ''}
            value={this.state.selectedColumns}
            onChange={(e, value) => {
              if (value) {
                this.setState({ selectedColumns: value });
              } else {
                this.setState({ selectedColumns: [] });
              }
            }}
            renderInput={(params) => (
              <TextField {...params} label="Columns" placeholder="Columns" variant="standard" />
            )}
            renderOption={(props, option, { selected }) => (
              <div
                {...props}
                className={`option ${selected ? 'selected' : ''}`}
              >
                {option.title}
              </div>
            )}
            fullWidth
          />


          <div className="flex justify-end gap-4 mt-4">
            <CustomButton
              Text={'Submit'}
              style={{
                padding: '12px',
                height: '40px',
                width: '140px',
                borderRadius: '8px',
                zIndex: '100'
              }}
              onClickHandler={() => this.setColumnsSetting(this.state.selectedColumns, "Columns Settings updated successfully")}
              loading={this.state.isLoading}
            />
            <CustomButton
              Text={'Cancel'}
              style={{
                padding: '12px',
                height: '40px',
                width: '140px',
                borderRadius: '8px',
                backgroundColor: '#c5c5c5',
                borderColor: '#c5c5c5',
                color: '#fff'
              }}
              onClickHandler={() => this.setState({ isAddRemove: false })}
            />
          </div>
        </CustomModal>
        <CustomModal
          title="Export Data"
          isModalOpen={this.state.isExportModal}
          handleCancel={this.handleExportCancel}
          maskClosable={false}
          footer={[]}

        >

          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ py: 5 }}>
            <Typography sx={{ fontSize: "18px", fontFamily: "poppins", color: "#616365" }}>Delimiter</Typography>
            <RadioGroup
              row
              aria-labelledby="delimiter-radio-buttons-group-label"
              name="delimiter-radio-buttons-group"
              value={this.state.exportDelimiter}
              onChange={this.handleDelimiterChange}
            >
              <FormControlLabel value="," control={<Radio />} label="comma" />
              <FormControlLabel value=";" control={<Radio />} label="semicolon" />
              <FormControlLabel value="|" control={<Radio />} label="pipe" />
              <FormControlLabel value="^" control={<Radio />} label="caret" />
            </RadioGroup>
          </Stack>
          <div className="flex justify-end gap-4 mt-4">
            <CustomButton
              Text={'Export'}
              style={{
                padding: '12px',
                height: '40px',
                width: '140px',
                borderRadius: '8px',
                zIndex: '100'
              }}
              onClickHandler={this.MassExportHandler}
            // loading={this.state.isLoading}
            />


            <CustomButton
              Text={'Cancel'}
              style={{
                padding: '12px',
                height: '40px',
                width: '140px',
                borderRadius: '8px',
                backgroundColor: '#c5c5c5',
                borderColor: '#c5c5c5',
                color: '#fff'
              }}
              onClickHandler={() => this.setState({ isExportModal: false })}
            />
          </div>
        </CustomModal>
        
         <CustomModal
          isModalOpen={this.state.isProceedModal}
          title={'Proceed Modal'}
          // handleOk={handleOk}
          handleCancel={this.handleProceedCancel}
          footer={[]}
          width={400}
        >
          {this.state.errorMessage}<br />
          Do You still want to Proceed?
          <div className="mb-4 flex justify-center gap-4 mt-4">
                <CustomButton
                  Text={"Cancel"}
                  style={{ height: "48px", width:'206px', backgroundColor: "#D52B1E", borderColor: "#D52B1E", borderRadius: "8px" }}
                  onClickHandler={()=> this.setState({ isProceedModal: false })}
                />
                <CustomButton Text={"Proceed"}
                  style={{ height: "48px", width:'206px', borderRadius: "8px" }}
                  onClickHandler={()=>this.MassProceed(true)}
                />
              </div>
        </CustomModal> 

      </>
    );
  }
}

export default DnDTable;
