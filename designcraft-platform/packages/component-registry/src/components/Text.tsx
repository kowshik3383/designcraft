import React from 'react';

interface TextProps {
  text: string;
  fontSize?: number;
  color?: string;
  fontWeight?: 'normal' | 'bold' | 'lighter' | 'bolder';
  textAlign?: 'left' | 'center' | 'right';
  style?: React.CSSProperties;
}

export const Text: React.FC<TextProps> = ({
  text,
  fontSize = 16,
  color = '#000000',
  fontWeight = 'normal',
  textAlign = 'left',
  style = {}
}) => {
  return (
    <p
      style={{
        fontSize,
        color,
        fontWeight,
        textAlign,
        margin: 0,
        ...style
      }}
    >
      {text}
    </p>
  );
};