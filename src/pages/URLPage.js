import { Helmet } from 'react-helmet-async';
import { useEffect, useState, useRef, forwardRef } from 'react';
import MaterialTable from 'material-table'
import { read, utils } from 'xlsx'
import toast, { Toaster } from 'react-hot-toast';
import openSocket from "socket.io-client";

// components
import Iconify from '../components/iconify';
// @mui
import { Stack, Button, Typography } from '@mui/material';
import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';

// ----------------------------------------------------------------------

const EXTENSIONS = ['xlsx', 'xls', 'csv']
const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};
const options = ["SBTI", "CDP", "Ecovadis", "B-Corp"/*, "Test 5 of SBTI"*/];
const optionsICP = ["All - P1 + P2 + P3", "P1 - Persona Sustainability", "P2 - Persona CEO/COO/Legal", "P3 - Persona RH & Marketing"];
// const ENDPOINT = "http://localhost:8080";
const ENDPOINT = "https://greenly-backend.onrender.com"
const socket = openSocket(ENDPOINT, { transports: ['websocket'] });

// ----------------------------------------------------------------------

export default function UserPage() {

  let toastView

  const colDefs = [
    { title: "URL", field: "URL", lookup: { "SBTI": options[0], "CDP": options[1], "Ecovadis": options[2], "B-Corp": options[3], /*"Test 5 of SBTI": options[4]*/ } },
    { title: "isNew", field: "isNew", lookup: { "yes": "New", "": "Old", "notfound": "Not Found" } },
    { title: "Persona", field: "Persona", filtering: false },
    { title: "Rank", field: "Rank", filtering: false },
    { title: "Company", field: "Company", filtering: false },
    { title: "Location", field: "Location" },
    { title: "Greenly Geography", field: "Greenly Geography" },
    { title: "Industry", field: "Industry"},
    { title: "Size", field: "Size" },
    { title: "Linkedin URL", field: "Linkedin URL", filtering: false },
    { title: "Firstname", field: "Firstname" },
    { title: "Lastname", field: "Lastname" },
    { title: "Position", field: "Position" },
    { title: "Linkedin Profile", field: "Linkedin Profile", filtering: false },
    { title: "Web Domain", field: "Web Domain", filtering: false },
    { title: "Email", field: "Email", filtering: false },
    { title: "Phone", field: "Phone", filtering: false },
  ]
  const columns = colDefs.map((column) => {
    return { ...column };
  });
  const [selectedOption, setSelectedOption] = useState(options[0])
  const [selectedOptionICP, setSelectedOptionICP] = useState(optionsICP[0])
  const [data, setData] = useState([])
  const [fileData, setFileData] = useState([])
  const [newLead, setNewLead] = useState(0)
  const [notFoundLead, setNotFoundLead] = useState(0)
  const [fileName, setFileName] = useState("")
  const [isFile, setIsFile] = useState({val: false})
  const [isScraping, setIsScraping] = useState(false)
  const [isScrapingVal, setIsScrapingVal] = useState(false)
  const [isScrapingComp, setIsScrapingComp] = useState(false)
  const [scrapError, setScrapError] = useState(false)
  const inputRef = useRef(null)
  const [scrapVal, setScrapVal] = useState("Scrap companies & PoC")
  const [scrapCompVal, setScrapCompVal] = useState("Scrap companies")
  const [debVal, setDebVal] = useState(0)

  // Select URL SCrap
  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };

  // Select ICP SCrap
  const handleChangeICP = (event) => {
    setSelectedOptionICP(event.target.value);
  };

  // Capitalize
  function capitalizeWords(str) {
    return str.split(' ').map(word => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(' ');
  }

  // LOAD CSV File
  const getExention = (file) => {
    const parts = file.name.split('.')
    const extension = parts[parts.length - 1]
    return EXTENSIONS.includes(extension) // return boolean
  }

  const convertToJson = (headers, data) => {
    const rows = []
    data.forEach(row => {
      let rowData = {}
      row.forEach((element, index) => {
        rowData[headers[index]] = element
      })
      rows.push(rowData)
    });
    return rows
  }

  const handleClick = () => {
    // 👇️ open file input box on click of another element
    inputRef.current.click();
    setIsFile({val: true})
  };

  const viderTable = () => {
    setData([])
    setDebVal(0)
    setNewLead(0)
    setNotFoundLead(0)
  };

  const importExcel = (e) => {
    const file = e.target.files[0]
    setFileName(capitalizeWords(file.name.split(".csv")[0]))
    setNewLead(0)
    setNotFoundLead(0)
    setIsFile({val: true})

    const reader = new FileReader()
    reader.onload = (event) => {
      //parse data
      const bstr = event.target.result
      const workBook = read(bstr, { type: "binary" })
      //get first sheet
      const workSheetName = workBook.SheetNames[0]
      const workSheet = workBook.Sheets[workSheetName]
      //convert to array
      const fileData = utils.sheet_to_json(workSheet, { header: 1 })
      // console.log(fileData)
      const headers = fileData[0]
      //removing header
      fileData.splice(0, 1)
      let tmp = convertToJson(headers, fileData)
      tmp.forEach((item) => { (item.isNew === "Not Found") ? item.isNew="notfound" : item.isNew = ""})
      setData(tmp)
      setFileData(tmp)
      if(tmp.length > 0) setDebVal(tmp[tmp.length - 1]["Rank"])
    }

    if (file) {
      if (getExention(file)) {
        reader.readAsBinaryString(file)
      }
      else {
        alert("Invalid file input ! \nSelect Excel or CSV file !")
      }
    } else {
      setData([])
    }
  }

  // SCRAP
  const getScrap = () => {
    if(scrapVal === "Scrap companies & PoC"){
      // setData([])
      // setNewLead(0)
      setScrapVal("Stop Scrap")
      setScrapError(false)
      setIsScraping(true)
      setIsScrapingComp(true)
      setIsScrapingVal(false)
      socket.emit("get_scrap", {
        "selectedOption" : selectedOption,
        "selectedOptionICP" : selectedOptionICP,
        "debVal": debVal
      })
      toastView = toast.loading('Scraping new leads of ' + selectedOption + '...\nThis can take a while, about 3 hours !')
    } else {
      socket.emit("stop_scrap")
      setScrapVal("Scrap companies & PoC")
      setIsScraping(false)
      setIsScrapingComp(false)
      setIsScrapingVal(false)
      setIsFile({val: false})
    }
  }

  const getCompScrap = () => {
    if(scrapCompVal === "Scrap companies"){
      // setData([])
      // setNewLead(0)
      setScrapCompVal("Stop Scrap")
      setIsScraping(true)
      setScrapError(false)
      setIsScrapingComp(false)
      setIsScrapingVal(true)
      socket.emit("get_comp_scrap", {
        "selectedOption" : selectedOption,
        "selectedOptionICP" : selectedOptionICP,
        "debVal": debVal
      })
      toastView = toast.loading('Scraping companies of ' + selectedOption + '...\nThis can take a while, about 1 hour !')
    } else {
      socket.emit("stop_scrap")
      setScrapCompVal("Scrap companies")
      setIsScraping(false)
      setIsScrapingComp(false)
      setIsScrapingVal(false)
      setIsFile({val: false})
    }
  }

  // USE EFFECT
  useEffect(() => {
    socket.on("scrap_result", ({result, deb}) => {
      // console.log(deb, result, data)
      if(result.length !== 0){
        const uniqueValues = result.filter(arr22Item => {
          return !data.some(arr11Item => {
            return arr22Item.URL === arr11Item.URL &&
                   arr22Item.Company === arr11Item.Company 
                  // && arr22Item["URL Linkedin"] === arr11Item["URL Linkedin"]
                  //  arr22Item.Industrie === arr11Item.Industrie 
                  // && arr22Item.isNew === arr11Item.isNew
          })
        })
        const combinedArray = [...data, ...uniqueValues];
        setData(combinedArray);
        const count = combinedArray.filter(item => item.isNew === 'yes').length;
        const countNotFound = combinedArray.filter(item => item.isNew === 'notfound').length;
        setNewLead(count)
        setNotFoundLead(countNotFound)
        setDebVal(deb)
      }
      /*if(isFile.val === true){
        // console.log("file")
        if(result.length !== 0){
          const uniqueValues = result.filter(arr22Item => {
            return !data.some(arr11Item => {
              return arr22Item.URL === arr11Item.URL &&
                     arr22Item.Entreprise === arr11Item.Entreprise &&
                     arr22Item["URL Linkedin"] === arr11Item["URL Linkedin"]
                    //  arr22Item.Industrie === arr11Item.Industrie 
                    //  arr22Item.isNew !== arr11Item.isNew;
            })
          })
          const combinedArray = [...data, ...uniqueValues];
          setData(combinedArray);
          const count = combinedArray.filter(item => item.isNew === 'yes').length;
          const countNotFound = combinedArray.filter(item => item.isNew === 'notfound').length;
          setNewLead(count)
          setNotFoundLead(countNotFound)
          setDebVal(deb)
        }
      } else {
        // setData(result);
        // const count = result.filter(item => item.isNew === 'yes').length;
        // const countNotFound = result.filter(item => item.isNew === 'notfound').length;
        // setNewLead(count)
        // setNotFoundLead(countNotFound)
        // setDebVal(deb)
      }*/
    }, []);
    
    socket.on("scrap_end", () => {
      setScrapCompVal("Scrap companies")
      setScrapVal("Scrap companies & PoC")
      setIsScraping(false)
      setIsScrapingComp(false)
      setIsScrapingVal(false)
      setFileName("")
      setIsFile({val: false})
      // setDebVal(0)
      toast.dismiss(toastView);
      toast.success('fetched data leads');
      toast.dismiss();
    });

    socket.on("scrap_error", () => {
      setScrapError(true)
    });
  }, [data, fileName, toastView, fileData, scrapCompVal, scrapVal, isFile]);

  return (
    <>
      <Helmet>
        <title> Home </title>
      </Helmet>

      <div>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            {"Scrap / Load CSV file"}
          </Typography>

          {/* <Stack direction="column" alignItems="center" justifyContent="space-between">
            {
              (newLead <=0 ) ? null : <div><span style={{color:"blue", fontWeight:"bold"}}>{newLead}</span> new leads discovered</div>
            }
            {
              (notFoundLead <=0 ) ? null : <div><span style={{color:"red", fontWeight:"bold"}}>{notFoundLead}</span> companies to review</div> 
            }
            {
              (!scrapError) ? null : <div><span style={{color:"white", fontWeight:"bold", backgroundColor: "red"}}>{"Error 429 : Too Many Requests"}</span></div> 
            }
          </Stack> */}

          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <input
              style={{display: 'none'}}
              ref={inputRef}
              id="myFileInput"
              type="file"
              onChange={importExcel}
            />

            {/* <Stack direction="column" alignItems="center" justifyContent="space-between"> */}
              <select id="combo-box-icp" value={selectedOptionICP} disabled={isScraping} onChange={handleChangeICP} style={{marginRight:10}}>
                {optionsICP.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>

              <select id="combo-box" value={selectedOption} disabled={isScraping} onChange={handleChange} style={{marginRight:10}}>
                {options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            {/* </Stack> */}

            <input
                type='number'
                min={0}
                max={10000}
                inputMode='numeric'
                style={{marginRight:"10px"}}
                pattern='[0-9]{0,5}'
                onChange= {(e) => {setDebVal(parseInt(e.target.value) ? parseInt(e.target.value) : 0)}}
                value={debVal}
                disabled={isScraping}
            />

            <Button onClick={getCompScrap} disabled={isScrapingComp} variant="outlined" color="error" startIcon={<Iconify icon="ic:baseline-search" />} style={{marginRight:10}}>
              {scrapCompVal}
            </Button>
              
            <Button onClick={getScrap} disabled={isScrapingVal} variant="contained" color="error" startIcon={<Iconify icon="ic:baseline-search" />} style={{marginRight:10}}>
              {scrapVal}
            </Button>

            <Button onClick={handleClick} disabled={isScraping} variant="contained" color="info" startIcon={<Iconify icon="game-icons:load" />} style={{marginRight:10}}>
              Load CSV File
            </Button>
            
            <Button onClick={viderTable} variant="contained" disabled={isScraping} color="warning" startIcon={<Iconify icon="gridicons:trash" />}>
              Empty
            </Button>
          </Stack>
        </Stack>

        <div style={{}}>
          <MaterialTable 
            title={
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                {
                  (fileName === "" ) ? null : <div style={{ marginRight:10}}><span style={{color:"black", fontWeight:"bold"}}>« {fileName}.csv »</span></div>
                }
                {
                  (newLead <=0 ) ? null : <div style={{ marginRight:10}}><span style={{color:"blue", fontWeight:"bold"}}>{newLead}</span> new leads discovered</div>
                }
                {
                  (notFoundLead <=0 ) ? null : <div style={{ marginRight:10}}><span style={{color:"red", fontWeight:"bold"}}>{notFoundLead}</span> companies to review</div> 
                }
                {
                  (!scrapError) ? null : <div style={{ marginRight:10}}><span style={{color:"white", fontWeight:"bold", backgroundColor: "red"}}>{"Error 429 : Too Many Requests"}</span></div> 
                }
              </Stack>
            }
            data={data} 
            columns={columns}
            icons={tableIcons}
            options={{
              exportButton: true,
              exportAllData: true,
              pageSize: 10,
              pageSizeOptions: [10, 20, 50],
              searchAutoFocus: true,
              filtering: true,
              rowStyle: rowData => ({
                backgroundColor: (rowData.isNew === "yes") ? 'skyblue' : (rowData.isNew === "notfound") ? 'pink' : 'white'
              })
              //selection: true
            }}
            editable={{
              onRowAdd: newData =>
                new Promise((resolve, reject) => {
                  setTimeout(() => {
                    setData([...data, newData]);
                    resolve();
                  }, 1000)
                }),
              onRowUpdate: (newData, oldData) =>
                new Promise((resolve, reject) => {
                  setTimeout(() => {
                    const dataUpdate = [...data];
                    const index = oldData.tableData.id;
                    dataUpdate[index] = newData;
                    setData([...dataUpdate]);
                    resolve();
                  }, 1000)
                }),
              onRowDelete: oldData =>
                new Promise((resolve, reject) => {
                  setTimeout(() => {
                    const dataDelete = [...data];
                    const index = oldData.tableData.id;
                    dataDelete.splice(index, 1);
                    setData([...dataDelete]);
                    resolve()
                  }, 1000)
                }),
            }}
            cellEditable={{
                cellStyle: {},
                onCellEditApproved: (newValue, oldValue, rowData, columnDef) => {
                    return new Promise((resolve, reject) => {
                        // console.log('newValue: ' + newValue);
                        setTimeout(resolve, 10);
                    });
                }
            }}
          />
        </div>

        <Toaster
          toastOptions={{
            className: '',
            style: {
              background: '#f87171',
              color: '#ffe4e6',
            }
          }}
        />
      </div>
    </>
  );
}
