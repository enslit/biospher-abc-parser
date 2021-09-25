import { useMemo } from 'react';
import LoaderPart from './LoaderPart';

type LoaderProps = {
  count?: number;
  speed?: number;
  color?: string;
  size?: number;
};

const Loader = ({
  count = 15,
  size = 140,
  speed = 1000,
  color = '#fff',
}: LoaderProps): JSX.Element => {
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
          color={color}
          size={size}
          count={count}
        />
      );
    }

    return parts;
  }, [color, count, size, speed]);

  return (
    <svg
      className="loader"
      width={`${size}px`}
      height={`${size}px`}
      preserveAspectRatio="xMidYMid"
    >
      {buildParts}
    </svg>
  );
};

export default Loader;
