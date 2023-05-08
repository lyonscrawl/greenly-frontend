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
const options = ["SBTI", "CDP", "Ecovadis", "B-Corp", "Test 5 of SBTI"];
// const ENDPOINT = "http://localhost:8080";
const ENDPOINT = "https://greenly-backend.onrender.com"
const socket = openSocket(ENDPOINT, { transports: ['websocket'] });

// ----------------------------------------------------------------------

export default function UserPage() {

  let toastView

  const colDefs = [
    { title: "URL", field: "URL", lookup: { "SBTI": options[0], "CDP": options[1], "Ecovadis": options[2], "B-Corp": options[3], "Test 5 of SBTI": options[4] } },
    { title: "isNew", field: "isNew", lookup: { "yes": "yes" } },
    { title: "Entreprise", field: "Entreprise", filtering: false },
    { title: "Localisation", field: "Localisation" },
    { title: "Industrie", field: "Industrie"},
    { title: "Taille", field: "Taille" },
    { title: "URL Linkedin", field: "URL Linkedin", filtering: false },
    { title: "Prenom", field: "Prenom" },
    { title: "Nom", field: "Nom" },
    { title: "Poste", field: "Poste" },
    { title: "Profil Linkedin", field: "Profil Linkedin", filtering: false },
    { title: "Domaine Web", field: "Domaine Web", filtering: false },
    { title: "Email", field: "Email", filtering: false },
    { title: "Telephone", field: "Telephone", filtering: false },
  ]
  const columns = colDefs.map((column) => {
    return { ...column };
  });
  const [selectedOption, setSelectedOption] = useState(options[0])
  const [data, setData] = useState([])
  const [fileData, setFileData] = useState([])
  const [newLead, setNewLead] = useState(0)
  const [fileName, setFileName] = useState("Scrap / Load CSV file")
  const [isFile, setIsFile] = useState({val: false})
  const inputRef = useRef(null)
  const [scrapVal, setScrapVal] = useState("Scrap all datas")
  const [scrapCompVal, setScrapCompVal] = useState("Scrap all companies")

  // Select URL SCrap
  const handleChange = (event) => {
    setSelectedOption(event.target.value);
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

  const importExcel = (e) => {
    const file = e.target.files[0]
    setFileName(capitalizeWords(file.name.split(".csv")[0]))
    setNewLead(0)
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
      tmp.forEach((item) => { item.isNew = ""})
      setData(tmp)
      setFileData(tmp)
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
    if(scrapVal === "Scrap all datas"){
      // setData([])
      // setNewLead(0)
      setScrapVal("Stop Scrap")
      socket.emit("get_scrap", selectedOption)
      toastView = toast.loading('Scraping new leads of ' + selectedOption + '...\nThis can take a while, about 3 hours !')
    } else {
      socket.emit("stop_scrap", selectedOption)
      setScrapVal("Scrap all datas")
      setIsFile({val: false})
    }
  }

  const getCompScrap = () => {
    if(scrapCompVal === "Scrap all companies"){
      // setData([])
      // setNewLead(0)
      setScrapCompVal("Stop Scrap")
      socket.emit("get_comp_scrap", selectedOption)
      toastView = toast.loading('Scraping companies of ' + selectedOption + '...\nThis can take a while, about 1 hour !')
    } else {
      socket.emit("stop_scrap", selectedOption)
      setScrapCompVal("Scrap all companies")
      setIsFile({val: false})
    }
  }

  // USE EFFECT
  useEffect(() => {
    socket.on("scrap_result", result => {
      if(isFile.val === true){
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
          setNewLead(count)
        }
      } else {
        // console.log("hey")
        setData(result);
        const count = result.filter(item => item.isNew === 'yes').length;
        setNewLead(count)
      }
    }, []);
    
    socket.on("scrap_end", inc => {
      setScrapCompVal("Scrap all companies")
      setScrapVal("Scrap all datas")
      setFileName("Scrap / Load CSV file")
      setIsFile({val: false})
      toast.dismiss(toastView);
      toast.success('fetched data leads');
      toast.dismiss();
    });
  }, [data, fileName, toastView, fileData, scrapCompVal, scrapVal, isFile]);

  return (
    <>
      <Helmet>
        <title> Accueil </title>
      </Helmet>

      <div>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            {fileName}
          </Typography>
          {
            (newLead <=0 ) ?
              null
              :
              <div><span style={{color:"red", fontWeight:"bold"}}>{newLead}</span> new discovered</div> 
          }
          
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <input
              style={{display: 'none'}}
              ref={inputRef}
              id="myFileInput"
              type="file"
              onChange={importExcel}
            />

            <select id="combo-box" value={selectedOption} onChange={handleChange} style={{marginRight:10}}>
              {options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>

            <Button onClick={getCompScrap} variant="outlined" color="error" startIcon={<Iconify icon="ic:baseline-search" />} style={{marginRight:10}}>
              {scrapCompVal}
            </Button>
              
            <Button onClick={getScrap} variant="contained" color="error" startIcon={<Iconify icon="ic:baseline-search" />} style={{marginRight:10}}>
              {scrapVal}
            </Button>

            <Button onClick={handleClick} variant="contained" color="info" startIcon={<Iconify icon="game-icons:load" />} style={{marginRight:10}}>
              Load CSV File
            </Button>
            
            <Button variant="contained" color="warning" startIcon={<Iconify icon="carbon:data-enrichment-add" />}>
              Enrich
            </Button>
          </Stack>
        </Stack>

        <div style={{}}>
          <MaterialTable 
            title={fileName}
            data={data} 
            columns={columns}
            icons={tableIcons}
            options={{
              exportButton: true,  
              pageSize: 10,
              pageSizeOptions: [10, 20, 50],
              searchAutoFocus: true,
              filtering: true,
              rowStyle: rowData => ({
                backgroundColor: (rowData.isNew === "yes") ? 'skyblue' : '#FFF'
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
                        console.log('newValue: ' + newValue);
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
