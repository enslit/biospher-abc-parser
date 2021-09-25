type LoaderPartProps = {
  step: number;
  speed: number;
  delay: number;
  color: string;
  size: number;
  count: number;
};

const LoaderPart = ({
  step,
  speed,
  delay,
  color,
  size,
  count,
}: LoaderPartProps): JSX.Element => {
  const halfSize: number = size / 2;
  const partSize: number = ((2 * Math.PI * halfSize) / count) * 0.8;

  return (
    <g transform={`rotate(${step} ${halfSize} ${halfSize})`}>
      <rect
        x={halfSize - partSize / 2}
        y="0"
        rx="50"
        ry="50"
        width={partSize}
        height={partSize}
        fill={color}
      >
        <animate
          attributeName="x"
          values={`${halfSize - partSize / 2};${halfSize}`}
          keyTimes="0;1"
          dur={`${speed}ms`}
          begin={`-${delay}ms`}
          repeatCount="indefinite"
        />
        <animate
          attributeName="y"
          values={`0;${partSize / 2}`}
          keyTimes="0;1"
          dur={`${speed}ms`}
          begin={`-${delay}ms`}
          repeatCount="indefinite"
        />
        <animate
          attributeName="width"
          values={`${partSize} ; 0 ; 0`}
          keyTimes="0 ; 0.75 ; 1"
          dur={`${speed}ms`}
          begin={`-${delay}ms`}
          repeatCount="indefinite"
        />
        <animate
          attributeName="height"
          values={`${partSize} ; 0 ; 0`}
          keyTimes="0 ; 0.75 ; 1"
          dur={`${speed}ms`}
          begin={`-${delay}ms`}
          repeatCount="indefinite"
        />
      </rect>
    </g>
  );
};

export default LoaderPart;
