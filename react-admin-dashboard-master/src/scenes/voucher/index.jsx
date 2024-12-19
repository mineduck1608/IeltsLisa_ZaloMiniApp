import { Typography, useTheme, CircularProgress } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useEffect, useState } from "react";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Select, MenuItem } from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const Vouchers = () => {
  const [selectedType, setSelectedType] = useState("voucher");
  const [isLoading, setIsLoading] = useState(false);  // Thêm state loading
  const initialVoucherState = {
    voucherId: '',
    voucherCode: '',
    voucherName: '',
    voucherDescription: '',
    voucherStatus: '',
    startDate: '',
    endDate: '',
  };
  const initialVoucherGiftState = {
    voucherId: '',
    giftId: '',
    voucherName: '',
    giftName: ''
  };

  // Xác định trạng thái ban đầu dựa trên selectedType
  const initialState = selectedType === "voucher" ? initialVoucherState : initialVoucherGiftState;
  const [formState, setFormState] = useState(initialState);
  const [rows, setRows] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false); // Check if editing or adding new

  const [vouchers, setVouchers] = useState([]);
  const [gifts, setGifts] = useState([]);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Cấu hình columns dựa trên selectedType
  const columns = selectedType === "voucher"
    ? [
      { field: "voucherId", headerName: "ID", align: "center", headerAlign: "center" },
      {
        field: "voucherCode",
        headerName: "Voucher Code",
        flex: 1,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "voucherName",
        headerName: "Voucher Name",
        flex: 1,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "voucherDescription",
        headerName: "Voucher Description",
        flex: 1,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "startDate",
        headerName: "Ngày Bắt Đầu",
        flex: 1,
        align: "center",
        headerAlign: "center",
        renderCell: (params) => {
          const date = new Date(params.value);
          return (
            <Typography>
              {date.toLocaleString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false,
              })}
            </Typography>
          );
        },
      },
      {
        field: "endDate",
        headerName: "Ngày Kết Thúc",
        flex: 1,
        align: "center",
        headerAlign: "center",
        renderCell: (params) => {
          const date = new Date(params.value);
          return (
            <Typography>
              {date.toLocaleString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false,
              })}
            </Typography>
          );
        },
      },
      {
        field: "voucherStatus",
        headerName: "Trạng thái Voucher",
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
            {params.value ? "Còn hạn" : "Hết hạn"}
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
              onClick={() => handleDelete(params.row.voucherId)} // Xử lý xóa
              style={{ backgroundColor: '#b22222', color: 'white', marginLeft: 8 }}
            >
              Xóa
            </Button>
          </Box>
        )
      }
    ]
    : [
      { field: "voucherName", headerName: "Voucher Name", flex: 1, align: "center", headerAlign: "center" },
      { field: "giftName", headerName: "Gift Name", flex: 1, align: "center", headerAlign: "center" },
      {
        field: "actions",
        headerName: "Quản lý",
        sortable: false,
        flex: 1,
        align: "center",
        headerAlign: "center",
        renderCell: (params) => (
          <Button
            variant="contained"
            size="small"
            onClick={() => handleDelete(params.row)} // Xử lý xóa
            style={{ backgroundColor: '#b22222', color: 'white', marginLeft: 8 }}
          >
            Xóa
          </Button>
        )
      }
    ];

  const FetchVoucher = async () => {
    try {
      setIsLoading(true);  // Bắt đầu loading
      const endpoint =
        selectedType === "voucher"
          ? "https://ieltslisazaloapp.azurewebsites.net/Voucher/GetAll"
          : "https://ieltslisazaloapp.azurewebsites.net/VoucherGift/GetAllName";

      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setRows(data);
      } else {
        console.log(await response.json());
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);  // Kết thúc loading
    }
  };

  const handleEdit = (row) => {
    setFormState(row);
    setIsEditMode(true);
    setOpenDialog(true);
  };

  const handleDelete = async (id) => {
    if (selectedType === "voucher") {
      if (window.confirm("Bạn có chắc chắn muốn xóa quà tặng này?")) {
        try {
          const response = await fetch(`https://ieltslisazaloapp.azurewebsites.net/Voucher/DeleteVoucher?voucherId=${id.voucherId}`, {
            method: 'DELETE',
          });
          if (response.ok) {
            toast.success("Xóa thành công!");
            FetchVoucher();
          } else {
            console.log("Xóa thất bại");
          }
        } catch (error) {
          console.log(error);
        }
      }
    } else {
      if (window.confirm("Bạn có chắc chắn muốn xóa quà tặng này?")) {
        try {
          const response = await fetch(`https://ieltslisazaloapp.azurewebsites.net/VoucherGift/DeleteVoucherGift?voucherId=${id.voucherId}&giftId=${id.giftId}`, {
            method: 'DELETE',
          });
          if (response.ok) {
            toast.success("Xóa thành công!");
            FetchVoucher();
          } else {
            console.log("Xóa thất bại");
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
  };

  const handleSubmit = async (e) => {
    if (selectedType === "voucher") {
      e.preventDefault();
      if (!formState.voucherCode || !formState.voucherName || !formState.voucherDescription || !formState.startDate || !formState.endDate) {
        alert("Tất cả các trường đều là bắt buộc!");
        return;
      }
      try {
        const method = isEditMode ? "PUT" : "POST";
        const url = isEditMode
          ? `https://ieltslisazaloapp.azurewebsites.net/Voucher/UpdateVoucher/${formState.voucherId}`
          : "https://ieltslisazaloapp.azurewebsites.net/Voucher/AddNewVoucher";


        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            voucherCode: formState.voucherCode,
            voucherName: formState.voucherName,
            voucherDescription: formState.voucherDescription,
            startDate: formState.startDate,
            endDate: formState.endDate
          }),
        });
        if (response.ok) {
          toast.success(isEditMode ? "Cập nhật thành công!" : "Thêm mới thành công!");
          setFormState(initialState);
          FetchVoucher();
        } else {
          const data = await response.json();
          toast.error("Thất bại!")
          console.log(data);
        }
      } catch (error) {
        console.log(error);
      }
      setOpenDialog(false);
    }
    else {
      e.preventDefault();
      if (!formState.voucherId || !formState.giftId) {
        alert("Tất cả các trường đều là bắt buộc!");
        return;
      }
      try {
        const method = "POST";
        console.log(formState.voucherId);
        console.log(formState.giftId);
        const url = "https://ieltslisazaloapp.azurewebsites.net/VoucherGift/AddVoucherGift";


        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            voucherId: formState.voucherId,
            giftId: formState.giftId
          }),
        });
        if (response.ok) {
          toast.success("Thêm mới thành công!");
          setFormState(initialState);
          FetchVoucher();
        } else {
          const data = await response.json();
          toast.error(data.msg)
        }
      } catch (error) {
        console.log(error);
      }
      setOpenDialog(false);
    }
  };


  useEffect(() => {
    FetchVoucher();
    if (selectedType === "voucher") {
      fetchGifts();
      fetchVouchers();
    }
  }, [selectedType, openDialog]);

  const fetchVouchers = async () => {
    try {
      const response = await fetch('https://ieltslisazaloapp.azurewebsites.net/Voucher/GetAll'); // Thay URL bằng API thực tế của bạn 
      const data = await response.json();
      setVouchers(data);
    } catch (error) {
      console.error('Error fetching vouchers:', error);

    }
  };
  const fetchGifts = async () => {
    try {
      const response = await fetch('https://ieltslisazaloapp.azurewebsites.net/Gift/GetAll'); // Thay URL bằng API thực tế của bạn 
      const data = await response.json();
      setGifts(data);
    } catch (error) {
      console.error('Error fetching gifts:', error);

    }
  };



  return (
    <Box m="20px 20px 20px 20px">
      <Box display="flex" justifyContent="space-between">
        <Header title="Danh sách voucher" subtitle="Lưu ý: khi tạo voucher phải qua mục quà tặng voucher để đính kèm những phần quà với voucher đó, nếu tạo nhiều phần quà ứng với mỗi voucher thì sẽ được random 1 trong các phần quà đó." />
        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="subtitle1" sx={{ whiteSpace: "nowrap" }}>
            Chọn loại dữ liệu:
          </Typography>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            style={{
              padding: "8px",
              fontSize: "16px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          >
            <option value="voucher">Voucher</option>
            <option value="vouchergift">VoucherGift</option>
          </select>
        </Box>
        {selectedType === "voucher" ? (
          <Box display="flex" alignItems="center" gap={2}>
            <Button
              onClick={() => {
                setIsEditMode(false);
                setFormState(initialState);
                setOpenDialog(true);
              }}
              variant="contained"
              color="secondary"
              sx={{ m: 4, width: 160 }}          >
              Thêm voucher
            </Button>
          </Box>
        ) : (
          <Box display="flex" alignItems="center" gap={2}>
            <Button
              onClick={() => {
                setIsEditMode(false);
                setFormState(initialState);
                setOpenDialog(true);
              }}
              variant="contained"
              color="secondary"
              sx={{ m: 4, width: 160 }}          >
              Thêm quà voucher
            </Button>
          </Box>
        )}
      </Box>
      {selectedType === "voucher" ? (
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} sx={{
          "& .MuiDialog-paper": {
            width: '50%', // Thay đổi chiều rộng theo tỷ lệ
            maxWidth: 'none', // Hủy bỏ giới hạn chiều rộng tối đa mặc định
            height: '70vh', // Thay đổi chiều cao theo tỷ lệ
            backgroundColor: "white", // Đặt màu nền của Dialog thành trắng
          }
        }}>
          <DialogTitle sx={{
            fontSize: "x-large",
            fontWeight: "semibold",
            textAlign: "center",  // Căn giữa chữ
            color: "black"
          }}>{isEditMode ? "Sửa voucher" : "Thêm voucher mới"}</DialogTitle>

          <DialogContent>
            <DialogTitle
              sx={{
                fontSize: "large",
                textAlign: "left",  // Căn giữa chữ
                color: "black"
              }}
            >
              Voucher Code:
            </DialogTitle>
            <TextField
              margin="dense"
              label="Mã voucher"
              fullWidth
              value={formState.voucherCode}
              onChange={(e) =>
                setFormState({ ...formState, voucherCode: e.target.value })
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
              Tên Voucher:
            </DialogTitle>
            <TextField
              margin="dense"
              label="Tên của voucher"
              fullWidth
              value={formState.voucherName}
              onChange={(e) =>
                setFormState({ ...formState, voucherName: e.target.value })
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
              Miêu tả:
            </DialogTitle>
            <TextField
              margin="dense"
              label="Miêu tả cách nhận voucher"
              fullWidth
              value={formState.voucherDescription}
              onChange={(e) =>
                setFormState({
                  ...formState,
                  voucherDescription: e.target.value,
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
            />

            <DialogTitle
              sx={{
                fontSize: "large",
                textAlign: "left", // Căn trái chữ
                color: "black",
              }}
            >
              Thời gian bắt đầu:
            </DialogTitle>
            <TextField
              margin="dense"
              type="datetime-local"
              fullWidth
              value={formState.startDate || ""}
              onChange={(e) =>
                setFormState({
                  ...formState,
                  startDate: e.target.value, // Lưu giá trị datetime dưới dạng chuỗi ISO
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
            />

            <DialogTitle
              sx={{
                fontSize: "large",
                textAlign: "left", // Căn trái chữ
                color: "black",
              }}
            >
              Thời gian kết thúc:
            </DialogTitle>
            <TextField
              margin="dense"
              type="datetime-local"
              fullWidth
              value={formState.endDate || ""}
              onChange={(e) =>
                setFormState({
                  ...formState,
                  endDate: e.target.value, // Lưu giá trị datetime dưới dạng chuỗi ISO
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
            />



          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)} color="primary">Hủy</Button>
            <Button onClick={handleSubmit} variant="contained" color="secondary">
              {isEditMode ? "Cập nhật" : "Thêm"}
            </Button>
          </DialogActions>
        </Dialog>
      ) : (
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} sx={{
          "& .MuiDialog-paper": {
            width: '50%',
            maxWidth: 'none',
            height: '45vh',
            backgroundColor: "white",
          }
        }}>
          <DialogTitle sx={{
            fontSize: "x-large",
            fontWeight: "semibold",
            textAlign: "center",
            color: "black"
          }}>Thêm voucher gift mới</DialogTitle>

          <DialogContent>
            <DialogTitle
              sx={{
                fontSize: "large",
                textAlign: "left",
                color: "black",
              }}
            >
              Chọn Voucher:
            </DialogTitle>
            <Select
              fullWidth
              value={formState.voucherId}
              onChange={(e) => setFormState({ ...formState, voucherId: e.target.value })}
              displayEmpty // Hiển thị placeholder khi chưa chọn
              sx={{
                color: "black",
                "& .MuiSelect-icon": {
                  color: "black", // Màu của icon dropdown
                },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "gray", // Màu viền xám cố định
                  },
                  "&:hover fieldset": {
                    borderColor: "gray", // Màu viền xám khi hover
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "gray", // Màu viền xám khi focus
                  },
                },
              }}
              renderValue={(selected) => {
                if (!selected) {
                  return <span style={{ color: "gray" }}>Chọn một voucher</span>; // Placeholder
                }
                return vouchers.find((voucher) => voucher.voucherId === selected)?.voucherName;
              }}
            >
              {vouchers.map((voucher) => (
                <MenuItem key={voucher.voucherId} value={voucher.voucherId}>
                  {voucher.voucherName}
                </MenuItem>
              ))}
            </Select>


            <DialogTitle
              sx={{
                fontSize: "large",
                textAlign: "left",
                color: "black",
              }}
            >
              Chọn Gift:
            </DialogTitle>
            <Select
              fullWidth
              value={formState.giftId}
              onChange={(e) => setFormState({ ...formState, giftId: e.target.value })}
              displayEmpty // Hiển thị placeholder khi chưa chọn
              sx={{
                color: "black",
                "& .MuiSelect-icon": {
                  color: "black", // Màu của icon dropdown
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "black", // Màu viền khi chưa chọn
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "black", // Màu viền khi hover
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "black", // Màu viền khi focus
                },
              }}
              renderValue={(selected) => {
                if (!selected) {
                  return <span style={{ color: "gray" }}>Chọn một món quà</span>; // Placeholder
                }
                return gifts.find((gift) => gift.giftId === selected)?.giftName;
              }}
            >
              {gifts.map((gift) => (
                <MenuItem key={gift.giftId} value={gift.giftId}>
                  {gift.giftName}
                </MenuItem>
              ))}
            </Select>

          </DialogContent>

          <DialogActions>
            <Button onClick={() => setOpenDialog(false)} color="primary">Hủy</Button>
            <Button onClick={handleSubmit} variant="contained" color="secondary">
              Thêm
            </Button>
          </DialogActions>
        </Dialog>
      )}

      <Box
        m="10px 0 0 0"
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
        {isLoading ? (
          <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100%">
            <CircularProgress sx={{ color: colors.greenAccent[200] }} />
            <Typography variant="h6" sx={{ marginTop: 2 }}>
              Đang tải dữ liệu...
            </Typography>
          </Box>
        ) : (
          <DataGrid
            checkboxSelection
            rows={rows}
            columns={columns}
            getRowId={(row) => selectedType === "voucher" ? row.voucherId : `${row.voucherId}-${row.giftId}`}
            getRowHeight={() => 'auto'} // Tự động điều chỉnh chiều cao theo nội dung
            sx={{
              "& .MuiDataGrid-cell": {
                whiteSpace: "normal", // Cho phép xuống dòng
                wordWrap: "break-word",
              },
              "& .MuiDataGrid-root": {
                lineHeight: "1.5", // Giãn dòng trong ô
              },
            }}
          />
        )}
      </Box>
    </Box>
  );
};

export default Vouchers;
