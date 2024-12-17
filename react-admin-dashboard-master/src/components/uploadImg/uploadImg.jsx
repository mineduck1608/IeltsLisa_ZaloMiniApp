import React, { useState } from "react";
import { BlobServiceClient } from "@azure/storage-blob";


const UploadImage = ({ onImageUploaded }) => {
    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);

  // URL kết nối tới Azure Blob Storage (cần thay đổi thành của bạn)
  const account = "<dangminhduc>";
  const containerName = "<ieltslisasavepic>";
  const sasToken = "sp=r&st=2024-12-16T09:43:14Z&se=2027-03-10T17:43:14Z&spr=https&sv=2022-11-02&sr=c&sig=fHnEAbzPpMc2zH%2BXg9mPu6tnLm8xui29R94b3iCdYLg%3D"; // SAS token để truy cập Azure Blob Storage

  const blobServiceClient = new BlobServiceClient(`https://${account}.blob.core.windows.net${sasToken}`);
  const containerClient = blobServiceClient.getContainerClient(containerName);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
        console.log("1" + file);
      setImage(file);
    }
  };

  const handleUpload = async () => {
    if (image) {
      const blobClient = containerClient.getBlockBlobClient(image.name);
      try {
        await blobClient.uploadBrowserData(image);
        const uploadedImageUrl = blobClient.url; // URL của ảnh đã upload
        onImageUploaded(uploadedImageUrl); // Trả URL ảnh về cho parent component
      } catch (error) {
        console.error("Upload failed:", error);
      }
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {image && (
        <div>
          <p>{image.name}</p>
          <button onClick={handleUpload}>Tải lên</button>
        </div>
      )}
    </div>
  );
};

export default UploadImage;
