import { Box } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataContacts } from "../../data/mockData";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import { Typography, Button } from "@mui/material";
import { useEffect, useState } from "react";
import * as XLSX from 'xlsx';
import { toast } from "react-toastify";

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
      field: "isConfirmed",
      headerName: "Tình trạng",
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Typography
          sx={{
            color: params.value ? "lightgreen" : "red",
            fontWeight: "medium",
          }}
        >
          {params.value ? "Đã liên hệ" : "Chưa liên hệ"}
        </Typography>
      ),
    },
    {
      field: "confirm",
      headerName: "Xác nhận thông tin",
      flex: 1,
      align: "center", headerAlign: "center",
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
            <Typography color={colors.grey[100]} sx={{ ml: "5px" }} onClick={() => handleConfirm(params.row.userId)}>
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
        setFormState(data);
      } else {
        const data = await response.json();  // Parse the response as JSON
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    FetchUser();
  }, []);

  const handleConfirm = async (id) => {
    try {
      const response = await fetch(`https://ieltslisazaloapp.azurewebsites.net/User/ConfirmUser?userId=${id}`, {
        method: 'PUT',
      });
      if (response.ok) {
        toast.success("Xác nhật người dùng mới thành công");
        FetchUser();
      } else {
        toast.error("Thất bại!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const exportToExcel = () => {
    const dataToExport = formState.map((row) => ({
      ID: row.userId,
      "Họ và tên": row.userName,
      "Số điện thoại": row.phone,
      "Tình trạng": row.isConfirmed ? "Đã liên hệ" : "Chưa liên hệ"
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Khách hàng");

    XLSX.writeFile(workbook, "DanhSachKhachHang.xlsx");
  };

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header
          title="Thông tin khách hàng"
          subtitle="Danh sách thông tin các khách hàng đã sử dụng zalo mini app"
        />
        <Button
          onClick={exportToExcel}
          variant="contained"
          color="secondary"
          sx={{ mb: 2 }}
        >
          Xuất Excel
        </Button>
      </Box>
      <Box
        m="0px 0 0 0"
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
        />
      </Box>
    </Box>
  );
};

export default Contacts;
