import { Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useEffect, useState } from "react";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Gifts = () => {
  const initialState = {
    giftId: '',
    giftName: '',
    giftDescription: '',
    giftQuantity: '',
    giftStatus: ''
  };
  const [formState, setFormState] = useState(initialState);
  const [rows, setRows] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false); // Check if editing or adding new

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
      ), align: "center", headerAlign: "center"
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
    {
      field: "actions",
      headerName: "Quản lý",
      sortable: false,
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Box>
          <Button type="primary"
            onClick={() => handleEdit(params.row)}
            variant="contained"
            color="secondary"
            size="small"
            style={{ marginLeft: 8 }}
          >
            Sửa
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={() => handleDelete(params.row.giftId)} // Xử lý xóa
            style={{ backgroundColor: '#b22222', color: 'white', marginLeft: 8 }}
          >
            Xóa
          </Button>
        </Box>
      )
    }
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
        setRows(data);
      } else {
        const data = await response.json();  // Parse the response as JSON
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleEdit = (row) => {
    setFormState(row);
    setIsEditMode(true);
    setOpenDialog(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa quà tặng này?")) {
      try {
        const response = await fetch(`https://ieltslisazaloapp.azurewebsites.net/Gift/DeleteGift?giftId=${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          toast.success("Xóa thành công!");
          FetchGift();
        } else {
          toast.error("Xóa thất bại");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formState.giftName || !formState.giftDescription || !formState.giftQuantity) {
      alert("Tất cả các trường đều là bắt buộc!");
      return;
    }
    try {
      const method = isEditMode ? "PUT" : "POST";
      const url = isEditMode
        ? `https://ieltslisazaloapp.azurewebsites.net/Gift/UpdateGift/${formState.giftId}`
        : "https://ieltslisazaloapp.azurewebsites.net/Gift/AddNewGift";


      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          giftName: formState.giftName,
          giftDescription: formState.giftDescription,
          giftQuantity: formState.giftQuantity
        }),
      });
      if (response.ok) {
        toast.success(isEditMode ? "Cập nhật thành công!" : "Thêm mới thành công!");
        setFormState(initialState);
        FetchGift();
      } else {
        const data = await response.json();
        toast.error("Thất bại!")
      }
    } catch (error) {
      console.log(error);
    }
    setOpenDialog(false);
  };


  useEffect(() => {
    FetchGift();
  }, [openDialog]);


  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Quà tặng" subtitle="Danh sách các quà tặng" />
        <Button
          onClick={() => {
            setIsEditMode(false);
            setFormState(initialState);
            setOpenDialog(true);
          }}
          variant="contained"
          color="secondary"
          sx={{ mb: 2 }}
        >
          Thêm quà tặng
        </Button>
      </Box>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} sx={{
        "& .MuiDialog-paper": {
          width: '50%', // Thay đổi chiều rộng theo tỷ lệ
          maxWidth: 'none', // Hủy bỏ giới hạn chiều rộng tối đa mặc định
          height: '60vh', // Thay đổi chiều cao theo tỷ lệ
          backgroundColor: "white", // Đặt màu nền của Dialog thành trắng
        }
      }}>
        <DialogTitle sx={{
          fontSize: "x-large",
          fontWeight: "semibold",
          textAlign: "center",  // Căn giữa chữ
          color: "black"
        }}>{isEditMode ? "Sửa nội dung quà" : "Thêm quà tặng mới"}</DialogTitle>

        <DialogContent>
          <DialogTitle
            sx={{
              fontSize: "large",
              textAlign: "left",  // Căn giữa chữ
              color: "black"
            }}
          >
            Tên quà:
          </DialogTitle>
          <TextField
            margin="dense"
            label="Tên quà tặng"
            fullWidth
            value={formState.giftName}
            onChange={(e) =>
              setFormState({ ...formState, giftName: e.target.value })
            }
            sx={{
              "& .MuiInputLabel-root": {
                color: "gray",  // Màu label khi chưa nhập
              },
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "gray", // Màu viền khi chưa focus và hover
                },
                "&.Mui-focused fieldset": {
                  borderColor: "black", // Màu viền khi focus
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "black", // Màu chữ label khi focus
                },
                "& .MuiOutlinedInput-input": {
                  color: "black", // Màu chữ nhập vào
                },
                "&:hover fieldset": {
                  borderColor: "gray", // Màu viền khi hover
                },
              },
            }}
          />
          <DialogTitle
            sx={{
              fontSize: "large",
              textAlign: "left",  // Căn giữa chữ
              color: "black"
            }}
          >
            Miêu tả:
          </DialogTitle>
          <TextField
            margin="dense"
            label="Miêu tả quà tặng"
            fullWidth
            value={formState.giftDescription}
            onChange={(e) =>
              setFormState({ ...formState, giftDescription: e.target.value })
            }
            sx={{
              "& .MuiInputLabel-root": {
                color: "gray",  // Màu label khi chưa nhập
              },
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "gray", // Màu viền khi chưa focus và hover
                },
                "&.Mui-focused fieldset": {
                  borderColor: "black", // Màu viền khi focus
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "black", // Màu chữ label khi focus
                },
                "& .MuiOutlinedInput-input": {
                  color: "black", // Màu chữ nhập vào
                },
                "&:hover fieldset": {
                  borderColor: "gray", // Màu viền khi hover
                },
              },
            }}
          />

          <DialogTitle
            sx={{
              fontSize: "large",
              textAlign: "left", // Căn trái chữ
              color: "black",
            }}
          >
            Số lượng:
          </DialogTitle>
          <TextField
            margin="dense"
            label="Số lượng quà tặng"
            fullWidth
            type="number" // Chỉ cho phép nhập số
            value={formState.giftQuantity}
            onChange={(e) =>
              setFormState({
                ...formState,
                giftQuantity: Number(e.target.value), // Không có `.Value`
              })
            }
            sx={{
              "& .MuiInputLabel-root": {
                color: "gray", // Màu label khi chưa nhập
              },
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "gray", // Màu viền khi chưa focus và hover
                },
                "&.Mui-focused fieldset": {
                  borderColor: "black", // Màu viền khi focus
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "black", // Màu chữ label khi focus
                },
                "& .MuiOutlinedInput-input": {
                  color: "black", // Màu chữ nhập vào
                },
                "&:hover fieldset": {
                  borderColor: "gray", // Màu viền khi hover
                },
              },
            }}
            InputProps={{
              inputProps: {
                min: 0, // Giới hạn giá trị nhỏ nhất là 0
              },
            }}
          />


        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">Hủy</Button>
          <Button onClick={handleSubmit} variant="contained" color="secondary">
            {isEditMode ? "Cập nhật" : "Thêm"}
          </Button>
        </DialogActions>
      </Dialog>
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
          rows={rows}
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
