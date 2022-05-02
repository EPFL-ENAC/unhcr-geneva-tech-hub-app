/**
 * https://echarts.apache.org/en/option.html#tooltip.formatter
 */
export interface TooltipFormatterParams<D = Record<string, unknown>> {
  componentType: "series";
  // Series type
  seriesType: string;
  // Series index in option.series
  seriesIndex: number;
  // Series name
  seriesName: string;
  // Data name, or category name
  name: string;
  // Data index in input data array
  dataIndex: number;
  // Original data as input
  data: D;
  // Value of data. In most series it is the same as data.
  // But in some series it is some part of the data (e.g., in map, radar)
  value: number | number[] | Record<string, unknown>;
  // encoding info of coordinate system
  // Key: coord, like ('x' 'y' 'radius' 'angle')
  // value: Must be an array, not null/undefined. Contain dimension indices, like:
  // {
  //     x: [2] // values on dimension index 2 are mapped to x axis.
  //     y: [0] // values on dimension index 0 are mapped to y axis.
  // }
  encode: Record<string, unknown>;
  // dimension names list
  dimensionNames: Array<string>;
  // data dimension index, for example 0 or 1 or 2 ...
  // Only work in `radar` series.
  dimensionIndex: number;
  // Color of data
  color: string;
  // the percentage of pie chart
  percent: number;
}
