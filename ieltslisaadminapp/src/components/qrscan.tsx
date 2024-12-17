import { useEffect, useRef, useState } from "react";
import QrScanner from "qr-scanner";
import React from "react";
import "css/qr.css";
import { Header, Page } from "zmp-ui";
import { showToast } from "zmp-sdk/apis";

const QrReader = () => {
  const scanner = useRef<QrScanner>();
  const videoEl = useRef<HTMLVideoElement>(null);
  const qrBoxEl = useRef<HTMLDivElement>(null);
  const [qrOn, setQrOn] = useState<boolean>(true);
  const [scannedResult, setScannedResult] = useState<ScanResult>();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isQrDetected, setIsQrDetected] = useState<boolean>(false);
  const [voucherCode, setVoucherCode] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false); // Trạng thái loading

  interface ScanResult {
    voucherId: string;
    giftId: string;
    userId: string;
    voucherCode: string;
    giftName: string;
  }

  const onScanSuccess = (result: QrScanner.ScanResult) => {
    console.log(result);
    const parsedResult: ScanResult = JSON.parse(result?.data);
    setScannedResult(parsedResult);
    setIsModalOpen(true);
    setIsQrDetected(true);
    setVoucherCode(undefined); // Reset voucherCode before fetching
    setLoading(true); // Set loading to true when starting to fetch
    fetchVoucherCode(parsedResult.voucherId);

    if (qrBoxEl.current) {
      qrBoxEl.current.classList.add("scanned");
    }

    scanner.current?.start();
  };

  const onScanFail = (err: string | Error) => {
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
      console.log(scannedResult)
      const useVoucher = await fetch(`https://ieltslisazaloapp.azurewebsites.net/UserVoucher/AdminUpdateUserVoucher?userId=${scannedResult?.userId}&voucherId=${scannedResult?.voucherId}&giftId=${scannedResult?.giftId}&voucherCode=${voucherCode}`, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
          },
      });

      if (useVoucher.ok) {
          const useRes = await useVoucher.json();
          console.log(useRes.msg);
          showToast({
              message: useRes.msg,
            });
      };
      if (!useVoucher.ok){
          const useRes = await useVoucher.json();
          showToast({
              message: useRes.msg,
            });
      }

  } catch (error) {
      console.error('Error using voucher:', error);
  }
    setIsModalOpen(false);
  };

  const fetchVoucherCode = async (voucherId: string) => {
    try {
      const useVoucher = await fetch(`https://ieltslisazaloapp.azurewebsites.net/Voucher/GetVoucherById?voucherId=${voucherId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (useVoucher.ok) {
        const useRes = await useVoucher.json();
        setVoucherCode(useRes.voucherCode);
      } else {
        throw new Error('Failed to fetch voucher');
      }
    } catch (error) {
      console.error('Error voucher:', error);
      alert('Có lỗi xảy ra khi tải voucher. Vui lòng thử lại.');
    } finally {
      setLoading(false); // Set loading to false once fetch is complete
    }
  };

  useEffect(() => {
    if (videoEl?.current && !scanner.current) {
      scanner.current = new QrScanner(videoEl?.current, onScanSuccess, {
        onDecodeError: onScanFail,
        preferredCamera: "environment",
        highlightScanRegion: true,
        highlightCodeOutline: true,
        overlay: qrBoxEl?.current || undefined,
      });

      scanner?.current?.start().then(() => setQrOn(true)).catch((err) => {
        if (err) setQrOn(false);
      });
    }

    // Stop scanner when modal is open and restart when modal is closed
    if (isModalOpen) {
      scanner.current?.pause();
    } else {
      scanner.current?.start();
    }

    return () => {
      if (!videoEl?.current) {
        scanner?.current?.stop();
      }
    };
  }, [isModalOpen]); // Dependency on modal state

  useEffect(() => {
    if (!qrOn)
      alert("Camera is blocked or not accessible. Please allow camera in your browser permissions and Reload.");
  }, [qrOn]);

  return (
    <Page className="flex flex-col">
      <Header title="Quét mã QR" showBackIcon={false} />

      <div className="qr-reader">
        <video ref={videoEl} className="qr-video"></video>
        <div ref={qrBoxEl} className={`qr-boxscan ${isQrDetected ? 'detected' : ''}`}>
          <div className="curve top-left"></div>
          <div className="curve top-right"></div>
          <div className="curve bottom-left"></div>
          <div className="curve bottom-right"></div>
        </div>

        {scannedResult && isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <button onClick={closeModal} className="close-btn">X</button>
              <h2 className="modal-title">Thông tin phần quà</h2>
              {loading ? (
                <p className="modal-text text-center">Đang tải...</p> // Hiển thị "Đang tải..." nếu đang fetch
              ) : (
                <>
                  <p className="modal-text text-center break-words">Voucher Code:</p>
                  <p className="modal-text text-center break-words">{voucherCode}</p>
                  <p className="modal-text text-center break-words">Quà:</p>
                  <p className="modal-text text-center break-words mb-5">{scannedResult.giftName}</p>
                </>
              )}
              <div className="modal-actions">
                <button onClick={closeModal} className="cancel-btn">Hủy</button>
                <button onClick={handleConfirm} className="confirm-btn bg-red-800">Xác nhận</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Page>
  );
};

export default QrReader;
