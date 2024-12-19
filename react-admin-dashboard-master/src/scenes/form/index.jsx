import React, { useEffect, useRef, useState } from "react";
import { Box } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import QrScanner from "qr-scanner";
import Header from "../../components/Header";
import "./qr.css"

const Form = () => {
  const scanner = useRef(null);
  const videoEl = useRef(null);
  const qrBoxEl = useRef(null);
  const [qrOn, setQrOn] = useState(true);
  const [scannedResult, setScannedResult] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isQrDetected, setIsQrDetected] = useState(false);
  const [voucherCode, setVoucherCode] = useState(undefined);
  const [loading, setLoading] = useState(false);

  const onScanSuccess = (result) => {
    console.log(result);
    try {
      const parsedResult = JSON.parse(result?.data);
      setScannedResult(parsedResult);
      setIsModalOpen(true);
      setIsQrDetected(true);
      setVoucherCode(undefined);
      setLoading(true);
      fetchVoucherCode(parsedResult.voucherId);

      if (qrBoxEl.current) {
        qrBoxEl.current.classList.add("scanned");
      }

      scanner.current?.start();
    } catch (error) {
      console.error("Error parsing QR data:", error);
    }
  };

  const onScanFail = (err) => {
    console.log(err);
    setIsQrDetected(false);
    scanner.current?.start().catch((error) => {
      console.error("Scanner restart error:", error);
    });
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleConfirm = async () => {
    try {
      console.log(scannedResult);
      const response = await fetch(
        `https://ieltslisazaloapp.azurewebsites.net/UserVoucher/AdminUpdateUserVoucher?userId=${scannedResult?.userId}&voucherId=${scannedResult?.voucherId}&giftId=${scannedResult?.giftId}&voucherCode=${voucherCode}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();
      alert(result.msg);
    } catch (error) {
      console.error("Error using voucher:", error);
    }
    setIsModalOpen(false);
  };

  const fetchVoucherCode = async (voucherId) => {
    try {
      const response = await fetch(
        `https://ieltslisazaloapp.azurewebsites.net/Voucher/GetVoucherById?voucherId=${voucherId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setVoucherCode(data.voucherCode);
      } else {
        throw new Error("Failed to fetch voucher");
      }
    } catch (error) {
      console.error("Error fetching voucher:", error);
      alert("Có lỗi xảy ra khi tải voucher. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (videoEl.current && !scanner.current) {
      scanner.current = new QrScanner(videoEl.current, onScanSuccess, {
        onDecodeError: onScanFail,
        preferredCamera: "environment",
        highlightScanRegion: true,
        highlightCodeOutline: true,
        overlay: qrBoxEl.current || undefined,
      });

      scanner.current
        .start()
        .then(() => setQrOn(true))
        .catch((err) => {
          if (err) setQrOn(false);
        });
    }

    if (isModalOpen) {
      scanner.current?.pause();
    } else {
      scanner.current?.start();
    }

    return () => {
      scanner.current?.stop();
    };
  }, [isModalOpen]);

  useEffect(() => {
    if (!qrOn) {
      alert("Camera is blocked or not accessible. Please allow camera in your browser permissions and Reload.");
    }
  }, [qrOn]);

  const isNonMobile = useMediaQuery("(min-width:600px)");

  return (
    <Box m="20px">
      <Header title="QR Code Scanner" subtitle="Put user voucher QR code here to scan" />

      <div className="qr-reader">
        <video ref={videoEl} className="qr-video"></video>
        <div ref={qrBoxEl} className={`qr-boxscan ${isQrDetected ? "detected" : ""}`}>
          <div className="curve top-left"></div>
          <div className="curve top-right"></div>
          <div className="curve bottom-left"></div>
          <div className="curve bottom-right"></div>
        </div>

        {scannedResult && isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <button onClick={closeModal} className="close-btn">
                X
              </button>
              <h2 className="modal-title">Thông tin phần quà</h2>
              {loading ? (
                <p className="modal-text text-center">Đang tải...</p>
              ) : (
                <>
                  <p className="modal-text text-center">Voucher Code:</p>
                  <p className="modal-text text-center">{voucherCode}</p>
                  <p className="modal-text text-center">Quà:</p>
                  <p className="modal-text text-center">{scannedResult.giftName}</p>
                </>
              )}
              <div className="modal-actions">
                <button onClick={closeModal} className="cancel-btn">
                  Hủy
                </button>
                <button onClick={handleConfirm} className="confirm-btn">
                  Xác nhận
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Box>
  );
};

export default Form;
