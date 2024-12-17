import { Box } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataContacts } from "../../data/mockData";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import { Typography } from "@mui/material";
import { useEffect, useState } from "react";

const Contacts = () => {
  const theme = useTheme();
  const initialState = {
    userId: '',
    userName: '',
    phone: ''
  };
  const [formState, setFormState] = useState(initialState);
  const colors = tokens(theme.palette.mode);
  const columns = [
    { field: "userId", headerName: "ID", align: "center", headerAlign: "center" },
    {
      field: "userName",
      headerName: "Họ và tên",
      flex: 1,
      cellClassName: "name-column--cell",
      align: "center", headerAlign: "center" 
    },
    {
      field: "phone",
      headerName: "Số điện thoại",
      flex: 1,
      align: "center", headerAlign: "center" 
    },
    {
      field: "confirm",
      headerName: "Xác nhận thông tin",
      flex: 1,
      align: "center", headerAlign: "center" ,
      renderCell: (params) => {
        return (
          <Box
            width="60%"
            m="0 auto"
            p="5px"
            display="flex"
            justifyContent="center"
            backgroundColor={colors.greenAccent[600]}
            borderRadius="4px"
            sx={{
              '&:hover': {
                backgroundColor: colors.greenAccent[500], // Màu khi hover
                cursor: 'pointer', // Thêm hiệu ứng con trỏ nếu muốn
              },
            }}
          >
            <Typography color={colors.grey[100]} sx={{ ml: "5px" }}  onClick={ true }>
              Xác nhận
            </Typography>
          </Box>
        );
      },
    },
  ];

  const FetchUser = async () => {
    try {
      const response = await fetch('https://ieltslisazaloapp.azurewebsites.net/User/GetAll', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',  // Set content type to JSON
        },
      });
      if (response.ok) {
        const data = await response.json();  // Parse the response as JSON
        console.log(data);
        setFormState(data);
      } else {
        const data = await response.json();  // Parse the response as JSON
        console.log(data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    FetchUser();
  }, []);

  return (
    <Box m="20px">
      <Header
        title="Thông tin khách hàng"
        subtitle="Danh sách thông tin các khách hàng đã sử dụng zalo mini app"
      />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid
          checkboxSelection rows={formState} columns={columns} getRowId={(row) => row.userId}
          components={{ Toolbar: GridToolbar }}
        />
      </Box>
    </Box>
  );
};

export default Contacts;
