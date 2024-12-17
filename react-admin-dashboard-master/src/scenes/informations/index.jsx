import { useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useEffect, useState } from "react";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { BlobServiceClient } from "@azure/storage-blob";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Informations = () => {
  const initialState = {
    infoId: '',
    infoName: '',
    infoContent: '',
    infoImg: ''
  };
  const [formState, setFormState] = useState(initialState);
  const [formStateUpdate, setFormStateUpdate] = useState(initialState);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);  // State lưu trữ URL tạm thời của ảnh
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const account = "dangminhduc";
  const containerName = "ieltslisasavepic";
  const sasToken = "sp=racwdli&st=2024-12-16T14:17:04Z&se=2025-12-31T22:17:04Z&spr=https&sv=2022-11-02&sr=c&sig=gYbxO%2B8KamUjCELAvKir90B7N5LG21Z5N8qnNInvT2c%3D"; // SAS token để truy cập Azure Blob Storage

  const blobServiceClient = new BlobServiceClient(
    `https://${account}.blob.core.windows.net?${sasToken}`
  );

  const containerClient = blobServiceClient.getContainerClient(containerName);
  const columns = [
    { field: "infoId", headerName: "ID" },
    {
      field: "infoName",
      headerName: "Tên bài viết",
      flex: 1,
      cellClassName: "name-column--cell", align: "center", headerAlign: "center"
    },
    {
      field: "infoContent",
      headerName: "Nội dung bài viết",
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
      field: "infoImg",
      headerName: "Ảnh bài viết",
      flex: 1,
      renderCell: (params) => (
        <img
          src={params.value}
          alt="Ảnh bài viết"
          style={{ width: "100%", height: "auto", objectFit: "contain" }}
        />
      ), align: "center", headerAlign: "center"
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
            onClick={() => handleDelete(params.row.infoId)} // Xử lý xóa
            style={{ backgroundColor: '#b22222', color: 'white', marginLeft: 8 }}
          >
            Xóa
          </Button>
        </Box>
      )
    }
  ];

  const handleEdit = (rowData) => {
    setNewInfo({
      infoName: rowData.infoName,
      infoContent: rowData.infoContent,
      infoImg: rowData.infoImg,
    });
    setFormStateUpdate(rowData); // Lưu thông tin dòng được chọn vào state
    setOpenModal(true);
  };


  const FetchInformation = async () => {
    try {
      const response = await fetch('https://ieltslisazaloapp.azurewebsites.net/Information/GetAll', {
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
  const [newInfo, setNewInfo] = useState({
    infoName: '',
    infoContent: '',
    infoImg: ''
  });
  const [openModal, setOpenModal] = useState(false);
  useEffect(() => {
    FetchInformation();
    setNewInfo({
      infoName: '',
      infoContent: '',
      infoImg: ''
    });
    if (!openModal) {
      // Reset dữ liệu khi modal đóng
      setNewInfo({
        infoName: '',
        infoContent: '',
        infoImg: ''
      });
      setFormStateUpdate("");
      setImageUrl("");
      setSelectedFile("");
    }
  }, [openModal]);


  

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

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
        setNewInfo({
          ...newInfo,
          infoImg: uploadedImageUrl, // Store the URL of the uploaded image
        });

        console.log("Image uploaded successfully: ", uploadedImageUrl);

      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewInfo({
      ...newInfo,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newInfo.infoName || !newInfo.infoContent || !newInfo.infoImg) {
      alert("Tất cả các trường đều là bắt buộc!");
      return;
    }

    try {
      // Nếu có ID, thực hiện chỉnh sửa
      const url = formStateUpdate.infoId
        ? `https://ieltslisazaloapp.azurewebsites.net/Information/UpdateInformation/${formStateUpdate.infoId}`
        : "https://ieltslisazaloapp.azurewebsites.net/Information/AddNewInformation";

      const method = formStateUpdate.infoId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          infoName: newInfo.infoName,
          infoImg: newInfo.infoImg,
          infoContent: newInfo.infoContent,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(
          formStateUpdate.infoId
            ? "Cập nhật thông tin thành công!"
            : "Thêm thông tin mới thành công!"
        ); // Thông báo thành công
        FetchInformation(); // Tải lại dữ liệu
      } else {
        const data = await response.json();
        toast.error(data.msg || "Đã xảy ra lỗi khi thực hiện yêu cầu!"); // Thông báo lỗi từ server
      }
    } catch (error) {
      toast.error(
        formStateUpdate.infoId
          ? "Đã xảy ra lỗi khi cập nhật thông tin!"
          : "Đã xảy ra lỗi khi thêm thông tin mới!"

      );
    }

    setOpenModal(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa bài viết này?")) {
      try {
        const response = await fetch(`https://ieltslisazaloapp.azurewebsites.net/Information/DeleteInformation/?informationId=${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          toast.success("Xóa thành công!");
          FetchInformation(); // Tải lại dữ liệu sau khi xóa
        } else {
          toast.error("Xóa thất bại!");
        }
      } catch (error) {
        console.error("Error deleting information:", error);
      }
    }
  };


  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Thông tin" subtitle="Danh sách các thông tin bài viết được hiển thị trên Zalo Mini App" />
        <Button
          variant="contained"
          color="secondary"
          onClick={() => {
            handleOpenModal();
          }}
        >
          Tạo mới
        </Button>
      </Box>

      {/* Modal Tạo Mới */}
      <Dialog open={openModal} onClose={handleCloseModal}
        sx={{
          "& .MuiDialog-paper": {
            width: '50%', // Thay đổi chiều rộng theo tỷ lệ
            maxWidth: 'none', // Hủy bỏ giới hạn chiều rộng tối đa mặc định
            height: '75vh', // Thay đổi chiều cao theo tỷ lệ
            backgroundColor: "white", // Đặt màu nền của Dialog thành trắng
          }
        }}>
        <DialogTitle
          sx={{
            fontSize: "x-large",
            fontWeight: "semibold",
            textAlign: "center",  // Căn giữa chữ
            color: "black"
          }}
        >
          {formStateUpdate.infoId ? "Cập nhật thông tin" : "Thêm thông tin mới"}
        </DialogTitle>
        <DialogContent>
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
            name="infoName"
            label="Tiêu đề bài viết"
            fullWidth
            value={newInfo.infoName}
            required
            onChange={handleChange}
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
            Ảnh:
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
            Nội dung thông tin:
          </DialogTitle>

          <ReactQuill
            value={newInfo.infoContent}
            onChange={(value) => setNewInfo({ ...newInfo, infoContent: value })}
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
          <Button onClick={handleCloseModal} color="primary">
            Hủy
          </Button>
          <Button onClick={handleSubmit} color="secondary">
            Lưu
          </Button>
        </DialogActions>
      </Dialog>

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
          rows={formState}
          columns={columns}
          getRowId={(row) => row.infoId}
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

export default Informations;
