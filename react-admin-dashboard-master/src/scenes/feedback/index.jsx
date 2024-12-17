import { Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataInvoices } from "../../data/mockData";
import Header from "../../components/Header";
import { useEffect, useState } from "react";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { BlobServiceClient } from "@azure/storage-blob";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Feedbacks = () => {
  const initialState = {
    fdId: '',
    fdbTitle: '',
    fbContent: '',
    fbName: '',
    fbClass: '',
    fbPic: '',
  };
  const [formState, setFormState] = useState(initialState);
  const [rows, setRows] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false); // Check if editing or adding new

  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);  // State lưu trữ URL tạm thời của ảnh
  const account = "dangminhduc";
  const containerName = "ieltslisasavepic";
  const sasToken = "sp=racwdli&st=2024-12-16T14:17:04Z&se=2025-12-31T22:17:04Z&spr=https&sv=2022-11-02&sr=c&sig=gYbxO%2B8KamUjCELAvKir90B7N5LG21Z5N8qnNInvT2c%3D"; // SAS token để truy cập Azure Blob Storage

  const blobServiceClient = new BlobServiceClient(
    `https://${account}.blob.core.windows.net?${sasToken}`
  );

  const containerClient = blobServiceClient.getContainerClient(containerName);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const columns = [
    { field: "fbId", headerName: "ID" },
    {
      field: "fbTitle",
      headerName: "Tiêu đề",
      flex: 1,
      cellClassName: "name-column--cell", align: "center", headerAlign: "center"
    },
    {
      field: "fbContent",
      headerName: "Nội dung đánh giá", align: "center", headerAlign: "center",
      flex: 2,
      renderCell: (params) => (
        <Box
          sx={{
            whiteSpace: "normal",
            wordWrap: "break-word",
            lineHeight: "1.5", // Khoảng cách dòng
          }}
          dangerouslySetInnerHTML={{ __html: params.value }}
        >
        </Box>
      ),
    },
    {
      field: "fbName",
      headerName: "Tên học viên",
      flex: 1, align: "center", headerAlign: "center"
    },
    {
      field: "fbClass",
      headerName: "Lớp",
      flex: 1,
      align: "center", headerAlign: "center"
    },
    {
      field: "fbPic",
      headerName: "Ảnh học viên",
      flex: 1,
      renderCell: (params) => (
        <img
          src={params.value}
          alt="Ảnh bài viết"
          style={{ width: "100%", height: "auto", objectFit: "contain" }}
        />
      )
      , align: "center", headerAlign: "center"
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
            onClick={() => handleDelete(params.row.fbId)} // Xử lý xóa
            style={{ backgroundColor: '#b22222', color: 'white', marginLeft: 8 }}
          >
            Xóa
          </Button>
        </Box>
      )
    }
  ];

  const handleEdit = (row) => {
    setNewFeedback({
      fbTitle: row.fbTitle,
      fbContent: row.fbContent,
      fbName: row.fbName,
      fbClass: row.fbClass,
      fbPic: row.fbPic
    });
    setFormState(row);
    setIsEditMode(true);
    setOpenDialog(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa khóa học này?")) {
      try {
        const response = await fetch(`https://ieltslisazaloapp.azurewebsites.net/Feedback/DeleteFeedback?feedbackId=${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          toast.success("Xóa thành công!");
          FetchFeedback();
        } else {
          console.log("Xóa thất bại");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formState.fbTitle || !formState.fbContent || !formState.fbName || !formState.fbClass || !formState.fbPic) {
      alert("Tất cả các trường đều là bắt buộc!");
      return;
    }
    try {
      const method = isEditMode ? "PUT" : "POST";
      const url = isEditMode
        ? `https://ieltslisazaloapp.azurewebsites.net/Feedback/UpdateFeedback/${formState.fbId}`
        : "https://ieltslisazaloapp.azurewebsites.net/Feedback/AddNewFeedback";


      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fbTitle: formState.fbTitle,
          fbContent: formState.fbContent,
          fbName: formState.fbName,
          fbClass: formState.fbClass,
          fbPic: formState.fbPic
        }),
      });
      if (response.ok) {
        toast.success(isEditMode ? "Cập nhật thành công!" : "Thêm mới thành công!");
        setFormState(initialState);
        FetchFeedback();
      } else {
        const data = await response.json();
        toast.error("Thất bại!")
        console.log(data);
      }
    } catch (error) {
      console.log(error);
    }
    setOpenDialog(false);
  };

  const [newFeedback, setNewFeedback] = useState({
    fbTitle: '',
    fbContent: '',
    fbName: '',
    fbClass: '',
    fbPic: ''
  });

  useEffect(() => {
    FetchFeedback();
    setNewFeedback({
      fbTitle: '',
      fbContent: '',
      fbName: '',
      fbClass: '',
      fbPic: ''
    });
    if (!openDialog) {
      // Reset dữ liệu khi modal đóng
      setNewFeedback({
        fbTitle: '',
        fbContent: '',
        fbName: '',
        fbClass: '',
        fbPic: ''
      });
      setImageUrl("");
      setSelectedFile("");
    }
  }, [openDialog]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0]; // Get the file from the input

    if (file) {
      const url = URL.createObjectURL(file);
      setSelectedFile(file.name); // Set the file name in the state
      setImageUrl(url);

      // Directly upload the file to Azure Blob Storage
      try {
        // Use the BlobServiceClient to upload the image
        const blockBlobClient = containerClient.getBlockBlobClient(file.name);

        // Upload the file to Azure Blob Storage
        await blockBlobClient.uploadBrowserData(file);

        // After the upload, set the image URL from Azure Blob Storage
        const uploadedImageUrl = blockBlobClient.url;
        setFormState({
          ...formState,
          fbPic: uploadedImageUrl, // Store the URL of the uploaded image
        });

        console.log("Image uploaded successfully: ", uploadedImageUrl);

      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  const FetchFeedback = async () => {
    try {
      const response = await fetch('https://ieltslisazaloapp.azurewebsites.net/Feedback/GetAll', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',  // Set content type to JSON
        },
      });
      if (response.ok) {
        const data = await response.json();  // Parse the response as JSON
        console.log(data);
        setRows(data);
      } else {
        const data = await response.json();  // Parse the response as JSON
        console.log(data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Đánh giá" subtitle="Danh sách các đánh giá của học viên về trung tâm" />
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
          Thêm đánh giá
        </Button>
      </Box>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} sx={{
        "& .MuiDialog-paper": {
          width: '50%', // Thay đổi chiều rộng theo tỷ lệ
          maxWidth: 'none', // Hủy bỏ giới hạn chiều rộng tối đa mặc định
          height: '75vh', // Thay đổi chiều cao theo tỷ lệ
          backgroundColor: "white", // Đặt màu nền của Dialog thành trắng
        }
      }}>
        <DialogTitle sx={{
          fontSize: "x-large",
          fontWeight: "semibold",
          textAlign: "center",  // Căn giữa chữ
          color: "black"
        }}>{isEditMode ? "Sửa đánh giá" : "Thêm đánh giá mới"}</DialogTitle>

        <DialogContent>
          <DialogTitle
            sx={{
              fontSize: "large",
              textAlign: "left",  // Căn giữa chữ
              color: "black"
            }}
          >
            Tên học viên:
          </DialogTitle>
          <TextField
            margin="dense"
            label="Tên học viên"
            fullWidth
            value={formState.fbName}
            onChange={(e) =>
              setFormState({ ...formState, fbName: e.target.value })
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
            Lớp học:
          </DialogTitle>
          <TextField
            margin="dense"
            label="Học sinh lớp"
            fullWidth
            value={formState.fbClass}
            onChange={(e) =>
              setFormState({ ...formState, fbClass: e.target.value })
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
            Ảnh học viên:
          </DialogTitle>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{
                paddingLeft: "8px",
                marginRight: "-100px",  // Thêm margin nhỏ để phần tử input và div chứa ảnh gần nhau
              }}
            />
            <div>
              {/* Hiển thị bức ảnh đã chọn */}
              {imageUrl && (
                <div>
                  <img
                    src={imageUrl}
                    alt="Preview"
                    style={{
                      width: "20%",
                      maxHeight: "300px",
                      objectFit: "contain",
                    }}
                  />
                </div>
              )}

              {/* Hiển thị tên tệp đã chọn */}
              {selectedFile && (
                <div style={{ color: "gray" }}>
                  <span>Chọn file: {selectedFile}</span>
                </div>
              )}
            </div>
          </div>

          <DialogTitle
            sx={{
              fontSize: "large",
              textAlign: "left",  // Căn giữa chữ
              color: "black"
            }}
          >
            Tiêu đề:
          </DialogTitle>
          <TextField
            margin="dense"
            label="Tiêu đề"
            fullWidth
            value={formState.fbTitle}
            onChange={(e) =>
              setFormState({ ...formState, fbTitle: e.target.value })
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
            Nội dung đánh giá:
          </DialogTitle>
          <ReactQuill
            value={formState.fbContent}
            onChange={(value) => setFormState({ ...formState, fbContent: value })}
            theme="snow"
            modules={{
              toolbar: [
                [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                ['bold', 'italic', 'underline'],
                ['link', 'image'],
                [{ 'align': [] }],
                ['clean'],
              ],
            }}
            style={{
              height: "200px",
              color: "black", // Màu chữ trong editor
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
          getRowId={(row) => row.fbId}
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

export default Feedbacks;
