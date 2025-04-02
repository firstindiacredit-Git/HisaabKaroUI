import React, { useState, useEffect, useRef } from 'react';
import { Modal, Spin, Button, Typography, message, FloatButton, Space, Tooltip, Image } from 'antd';
import { 
  DownloadOutlined, 
  FullscreenOutlined, 
  FullscreenExitOutlined,
  LoadingOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
  RotateRightOutlined
} from '@ant-design/icons';
import styled from 'styled-components';
import * as pdfjsLib from 'pdfjs-dist';
import 'pdfjs-dist/web/pdf_viewer.css';

// Set worker path for PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const { Text } = Typography;

const PreviewContainer = styled.div`
  width: 100%;
  height: ${props => props.isFullScreen ? '98vh' : '85vh'};
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f5f5f5;
  border-radius: 8px;
  overflow: hidden;
`;

const FileContent = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
  
  img, video {
    max-width: 100%;
    max-height: ${props => props.isFullScreen ? '85vh' : '65vh'};
    object-fit: contain;
  }
  
  iframe {
    width: 100%;
    height: 100%;
    border: none;
  }
`;

const PDFContainer = styled.canvas`
  width: 100%;
  height: 100%;
`;

const ToolBar = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  gap: 8px;
  background: rgba(255, 255, 255, 0.9);
  padding: 8px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 1000;
`;

const FloatingControls = styled(Space)`
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 1001;
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    transform: ${props => `scale(${props.scale}) rotate(${props.rotation}deg)`};
    transition: transform 0.3s ease;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-bottom: 1px solid #f0f0f0;
`;

const HeaderTitle = styled(Typography.Text)`
  font-size: 16px;
  font-weight: 500;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 8px;
`;

const FilePreviewModal = ({ 
  visible, 
  onClose, 
  fileUrl, 
  fileName,
  fileType 
}) => {
  const [loading, setLoading] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [error, setError] = useState(null);
  const canvasRef = useRef(null);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [downloading, setDownloading] = useState(false);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    if (visible && fileUrl) {
      setLoading(true);
      setError(null);
      
      if (fileType === 'application/pdf') {
        loadPDF();
      }
    }
  }, [visible, fileUrl]);

  const loadPDF = async () => {
    try {
      const loadingTask = pdfjsLib.getDocument(fileUrl);
      const pdf = await loadingTask.promise;
      setPdfDoc(pdf);
      setCurrentPage(1);
      renderPage(1, pdf);
    } catch (err) {
      setError('Failed to load PDF');
      setLoading(false);
    }
  };

  const renderPage = async (pageNum, pdfDocument) => {
    if (!canvasRef.current) return;

    try {
      const pdf = pdfDocument || pdfDoc;
      const page = await pdf.getPage(pageNum);
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      const viewport = page.getViewport({ scale: 1.5 });
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };

      await page.render(renderContext).promise;
      setLoading(false);
    } catch (err) {
      setError('Failed to render PDF page');
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!fileUrl) return;
    
    setDownloading(true);
    try {
      const response = await fetch(fileUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch the file');
      }

      const blob = await response.blob();
      const downloadFileName = fileName || fileUrl.split('/').pop();
      
      // Create a temporary link element
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = downloadFileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(link.href);
      
      message.success('File downloaded successfully!');
    } catch (error) {
      console.error('Download failed:', error);
      message.error('Failed to download the file. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.1, 3));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.1, 0.1));
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const imageToolbar = ({ transform: { scale, rotate }, actions }) => {
    return (
      <>
        {actions.map((action) => (
          <span
            key={action}
            className="anticon"
            onClick={
              action === 'download'
                ? handleDownload
                : actions[action]
            }
            style={{ marginRight: 8, cursor: 'pointer' }}
          >
            {action === 'download' ? (
              <DownloadOutlined style={{ fontSize: '18px' }} />
            ) : (
              actions[action]
            )}
          </span>
        ))}
      </>
    );
  };

  const renderPreview = () => {
    if (loading) {
      return <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />;
    }

    if (error) {
      return <Text type="danger">{error}</Text>;
    }

    if (fileType === 'application/pdf') {
      return (
        <PDFContainer ref={canvasRef} />
      );
    } else if (fileType?.startsWith('image/')) {
      return (
        <div style={{ width: '100%', height: '100%' }}>
          <Image
            src={fileUrl}
            alt={fileName}
            style={{ maxWidth: '100%', maxHeight: isFullScreen ? '85vh' : '65vh' }}
            preview={{
              visible,
              mask: false,
              onVisibleChange: (vis) => {
                if (!vis) onClose();
              },
              icons: {
                rotateLeft: <RotateRightOutlined rotate={-90} />,
                rotateRight: <RotateRightOutlined />,
                zoomIn: <ZoomInOutlined />,
                zoomOut: <ZoomOutOutlined />,
                close: <span>
                  <DownloadOutlined 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload();
                    }}
                    style={{ marginRight: 8 }}
                  />
                  <FullscreenExitOutlined />
                </span>,
              }
            }}
            onLoad={() => setLoading(false)}
            onError={() => {
              setLoading(false);
              setError('Failed to load image');
            }}
          />
        </div>
      );
    } else if (fileType?.startsWith('video/')) {
      return (
        <video 
          controls
          onLoadedData={() => setLoading(false)}
          onError={() => {
            setLoading(false);
            setError('Failed to load video');
          }}
        >
          <source src={fileUrl} type={fileType} />
          Your browser does not support the video tag.
        </video>
      );
    } else {
      return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <Text>Preview not available for this file type</Text>
          <br />
          <Button 
            type="primary" 
            icon={<DownloadOutlined />}
            onClick={handleDownload}
            style={{ marginTop: '10px' }}
          >
            Download to view
          </Button>
        </div>
      );
    }
  };

  return (
    <Modal
      visible={visible}
      onCancel={onClose}
      width="80%"
      style={{ top: 20 }}
      title={
        <ModalHeader>
          <HeaderTitle>{fileName || 'File Preview'}</HeaderTitle>
          <HeaderActions>
            <Tooltip title="Download File">
              <Button
                type="primary"
                icon={<DownloadOutlined />}
                onClick={handleDownload}
                loading={downloading}
                disabled={!fileUrl || loading}
              >
                Download
              </Button>
            </Tooltip>
          </HeaderActions>
        </ModalHeader>
      }
      bodyStyle={{ 
        height: isFullScreen ? '90vh' : '70vh',
        padding: '20px',
        overflow: 'hidden'
      }}
      footer={[
        <Button
          key="fullscreen"
          icon={isFullScreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
          onClick={toggleFullScreen}
        >
          {isFullScreen ? 'Exit Fullscreen' : 'Fullscreen'}
        </Button>,
        <Button key="close" onClick={onClose}>
          Close
        </Button>
      ]}
    >
      <PreviewContainer isFullScreen={isFullScreen}>
        {renderPreview()}
        <FloatButton
          icon={<DownloadOutlined />}
          onClick={handleDownload}
          loading={downloading}
          tooltip="Download"
          style={{
            right: 24,
            bottom: 24,
          }}
          type="primary"
        />
      </PreviewContainer>
    </Modal>
  );
};

export default FilePreviewModal;
