import { Box, Typography, useTheme, CircularProgress } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useEffect, useState } from "react";

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
    ]
    : [
      { field: "voucherName", headerName: "Voucher Name", flex: 1, align: "center", headerAlign: "center" },
      { field: "giftName", headerName: "Gift Name", flex: 1, align: "center", headerAlign: "center" },
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
        setFormState(data);
      } else {
        console.log(await response.json());
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);  // Kết thúc loading
    }
  };

  useEffect(() => {
    FetchVoucher();
  }, [selectedType]); // Theo dõi thay đổi của selectedType  

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
      </Box>
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
            rows={formState}
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
