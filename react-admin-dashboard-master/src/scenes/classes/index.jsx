import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { BlobServiceClient } from "@azure/storage-blob";

const Classes = () => {
  const initialState = {
    classId: '',
    className: '',
    classContent: '',
    classImg: ''
  };

  const [formState, setFormState] = useState(initialState);
  const [rows, setRows] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false); // Check if editing or adding new

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);  // State lưu trữ URL tạm thời của ảnh
  const account = "dangminhduc";
  const containerName = "ieltslisasavepic";
  const sasToken = "sp=racwdli&st=2024-12-16T14:17:04Z&se=2025-12-31T22:17:04Z&spr=https&sv=2022-11-02&sr=c&sig=gYbxO%2B8KamUjCELAvKir90B7N5LG21Z5N8qnNInvT2c%3D"; // SAS token để truy cập Azure Blob Storage

  const blobServiceClient = new BlobServiceClient(
    `https://${account}.blob.core.windows.net?${sasToken}`
  );

  const containerClient = blobServiceClient.getContainerClient(containerName);

  const columns = [
    { field: "classId", headerName: "ID", align: "center", headerAlign: "center" },
    {
      field: "className",
      headerName: "Tên khóa học",
      flex: 1,
      cellClassName: "name-column--cell",
      align: "center",
      headerAlign: "center",
    },
    {
      field: "classContent",
      headerName: "Thông tin khóa học",
      flex: 2,
      renderCell: (params) => (
        <Box
          sx={{
            whiteSpace: "normal",
            wordWrap: "break-word",
            lineHeight: "1.5",
          }}
          dangerouslySetInnerHTML={{ __html: params.value }}
        />
      ),
      align: "center",
      headerAlign: "center"
    },
    {
      field: "classImg",
      headerName: "Ảnh khóa học",
      flex: 1,
      renderCell: (params) => (
        <img
          src={params.value}
          alt="Ảnh bài viết"
          style={{ width: "100%", height: "auto", objectFit: "contain" }}
        />
      ),
      align: "center",
      headerAlign: "center",
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
            onClick={() => handleDelete(params.row.classId)} // Xử lý xóa
            style={{ backgroundColor: '#b22222', color: 'white', marginLeft: 8 }}
          >
            Xóa
          </Button>
        </Box>
      )
    }
  ];

  const FetchClass = async () => {
    try {
      const response = await fetch('https://ieltslisazaloapp.azurewebsites.net/Class/GetAll', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        setRows(data);
      } else {
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (row) => {
    setNewClass({
      className: row.className,
      classContent: row.classContent,
      classImg: row.classImg
    });
    setFormState(row);
    setIsEditMode(true);
    setOpenDialog(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa khóa học này?")) {
      try {
        const response = await fetch(`https://ieltslisazaloapp.azurewebsites.net/Class/DeleteClass?classId=${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          toast.success("Xóa thành công!");
          FetchClass();
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
    if (!formState.className || !formState.classContent || !formState.classImg) {
      alert("Tất cả các trường đều là bắt buộc!");
      return;
    }
    try {
      const method = isEditMode ? "PUT" : "POST";
      const url = isEditMode
        ? `https://ieltslisazaloapp.azurewebsites.net/Class/UpdateClass/${formState.classId}`
        : "https://ieltslisazaloapp.azurewebsites.net/Class/AddNewClass";


      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          className: formState.className,
          classContent: formState.classContent,
          classImg: formState.classImg
        }),
      });
      if (response.ok) {
        toast.success(isEditMode ? "Cập nhật thành công!" : "Thêm mới thành công!");
        setFormState(initialState);
        FetchClass();
      } else {
        const data = await response.json();
        toast.error("Thất bại!")
      }
    } catch (error) {
      console.log(error);
    }
    setOpenDialog(false);
  };

  const [newClass, setNewClass] = useState({
    className: '',
    classContent: '',
    classImg: ''
  });

  useEffect(() => {
    FetchClass();
    setNewClass({
      className: '',
      classContent: '',
      classImg: ''
    });
    if (!openDialog) {
      // Reset dữ liệu khi modal đóng
      setNewClass({
        className: '',
        classContent: '',
        classImg: ''
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
          classImg: uploadedImageUrl, // Store the URL of the uploaded image
        });

        toast.success("Image uploaded successfully: ", uploadedImageUrl);

      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Khóa học" subtitle="Danh sách các khóa học tại trung tâm" />
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
          Thêm khóa học mới
        </Button>
      </Box>
      <Box
        m="20px 0 0 0"
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
          getRowId={(row) => row.classId}
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
        }}>{isEditMode ? "Sửa khóa học" : "Thêm khóa học mới"}</DialogTitle>
        <DialogContent>
          <DialogTitle
            sx={{
              fontSize: "large",
              textAlign: "left",  // Căn giữa chữ
              color: "black"
            }}
          >
            Tên khóa học:
          </DialogTitle>
          <TextField
            margin="dense"
            label="Tên khóa học"
            fullWidth
            value={formState.className}
            onChange={(e) =>
              setFormState({ ...formState, className: e.target.value })
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
            Ảnh khóa học:
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
            Thông tin:
          </DialogTitle>
          <ReactQuill
            value={formState.classContent}
            onChange={(value) => setFormState({ ...formState, classContent: value })}
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
    </Box>
  );
};

export default Classes;
