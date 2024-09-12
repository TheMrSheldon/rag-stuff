import React, { useCallback, useState } from 'react';

import Box, {BoxProps} from '@mui/material/Box';

interface UploadBoxProps extends BoxProps {
  onFileUpload: (file: File) => void;
}

const UploadBox: React.FC<UploadBoxProps> = (props: UploadBoxProps) => {
  const { onFileUpload, ...boxProps } = props;
  const [dragOver, setDragOver] = useState(false);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
      setDragOver(false);
      if (event.dataTransfer.files && event.dataTransfer.files[0]) {
        onFileUpload(event.dataTransfer.files[0]);
      }
    },
    [onFileUpload]
  );

  return (
    <Box
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={{
        background: dragOver ? '#3334' : '#0000',
      }}
      {...boxProps}
    />
  );
}

export default UploadBox;