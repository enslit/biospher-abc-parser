import React, { useMemo } from 'react';
import LoaderPart from './LoaderPart';
import { styled, useTheme } from '@mui/material/styles';

type LoaderProps = {
  count?: number;
  speed?: number;
  color?: string;
  size?: number;
};

const LoaderWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: 'center',
}));

const Loader = ({
  count = 15,
  size = 140,
  speed = 1000,
  color,
}: LoaderProps): JSX.Element => {
  const theme = useTheme();

  const buildParts = useMemo<JSX.Element[]>(() => {
    const rotateStep: number = 360 / count;
    const delayStep: number = speed / count;
    const parts: JSX.Element[] = [];

    for (let i = 0, j = speed; i < 360; i += rotateStep, j -= delayStep) {
      parts.push(
        <LoaderPart
          key={i}
          step={i}
          delay={j}
          speed={speed}
          color={color || theme.palette.primary.main}
          size={size}
          count={count}
        />
      );
    }

    return parts;
  }, [color, count, size, speed, theme.palette.primary.main]);

  return (
    <LoaderWrapper>
      <svg
        className="loader"
        width={`${size}px`}
        height={`${size}px`}
        preserveAspectRatio="xMidYMid"
      >
        {buildParts}
      </svg>
    </LoaderWrapper>
  );
};

export default Loader;
