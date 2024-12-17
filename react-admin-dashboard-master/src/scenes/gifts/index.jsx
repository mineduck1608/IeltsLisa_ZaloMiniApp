import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useEffect, useState } from "react";

const Gifts = () => {
  const initialState = {
      giftId: '',
      giftName: '',
      giftDescription: '',
      giftQuantity: '',
      giftStatus: ''
    };
    const [formState, setFormState] = useState(initialState);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const columns = [
    { field: "giftId", headerName: "ID", align: "center", headerAlign: "center" },
    {
      field: "giftName",
      headerName: "Tên quà",
      flex: 1,
      cellClassName: "name-column--cell",
      align: "center", headerAlign: "center"
    },
    {
      field: "giftDescription",
      headerName: "Miêu tả",
      flex: 1,
      flex: 2,
      renderCell: (params) => (
        <Box
          sx={{
            whiteSpace: "normal",
            wordWrap: "break-word",
            lineHeight: "1.5", // Khoảng cách dòng
          }}
        >
          {params.value}
        </Box>
      ),align: "center", headerAlign: "center"
    },
    {
      field: "giftQuantity",
      headerName: "Số lượng",
      flex: 1,
      align: "center", headerAlign: "center"
    },
    {
      field: "giftStatus",
      headerName: "Trạng thái",
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
          {params.value ? "Còn hàng" : "Hết hàng"}
        </Typography>
      ),
    },
  ];

  const FetchGift = async () => {
      try {
        const response = await fetch('https://ieltslisazaloapp.azurewebsites.net/Gift/GetAll', {
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
      FetchGift();
    }, []);

  return (
    <Box m="20px">
      <Header title="Quà tặng" subtitle="Danh sách các quà tặng" />
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
        }}
      >
        <DataGrid checkboxSelection
          rows={formState}
          columns={columns}
          getRowId={(row) => row.giftId}
          getRowHeight={() => 'auto'} // Tự động điều chỉnh chiều cao theo nội dung
          sx={{
            "& .MuiDataGrid-cell": {
              whiteSpace: "normal", // Cho phép xuống dòng
              wordWrap: "break-word",
            },
            "& .MuiDataGrid-root": {
              lineHeight: "1.5", // Giãn dòng trong ô
            },
          }} />
      </Box>
    </Box>
  );
};

export default Gifts;
