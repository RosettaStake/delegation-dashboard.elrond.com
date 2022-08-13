import React from 'react';
import { ScaleOrdinal } from 'd3';
import styles from './styles.module.scss';

interface LegendProps {
  colors: ScaleOrdinal<string, string>;
  ranges: Array<number[]>;
}

const Legend = (props: LegendProps) => {
  return (
    <div className={`${styles.legendWrapper}`}>
      {props.ranges.map((range, index) => (
        <div key={`range-${index}`} className={`${styles.chartLegend}`}>
          <span
            style={{ backgroundColor: props.colors(index.toString()) }}
          ></span>
          <p>
            {'>'} {range[0]} - {range[1]}{' '}
          </p>
        </div>
      ))}
    </div>
  );
};

export default Legend;
