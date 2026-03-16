import React from 'react';

interface ImageProps {
  src: string;
  alt?: string;
  width?: number | string;
  height?: number | string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'scale-down' | 'none';
  borderRadius?: number;
  style?: React.CSSProperties;
}

export const Image: React.FC<ImageProps> = ({
  src,
  alt = '',
  width = '100%',
  height = 'auto',
  objectFit = 'cover',
  borderRadius = 0,
  style = {}
}) => {
  return (
    <img
      src={src}
      alt={alt}
      style={{
        width,
        height,
        objectFit,
        borderRadius,
        ...style
      }}
    />
  );
};