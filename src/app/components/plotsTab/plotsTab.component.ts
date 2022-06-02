import { Component } from '@angular/core';
import { EChartsOption } from 'echarts';

@Component({
  selector: 'app-plots-tab',
  templateUrl: './plotsTab.component.html',
  styleUrls: ['./plotsTab.component.scss'],
})
export class PlotsTabComponent {
  public isViewReady = false;

  chartOption: EChartsOption = {
    title: {
      text: 'PlotName',
      subtext: 'By ecStat.regression',
      left: 'center',
    },
    xAxis: {
      splitLine: {
        lineStyle: {
          type: 'dashed',
        },
      },
    },
    yAxis: {
      splitLine: {
        lineStyle: {
          type: 'dashed',
        },
      },
    },
    dataset: [
      {
        source: [
          [1, 0.4],
          [2, 0.7],
          [3, 0.5],
          [4, 0.0],
          [5, 0.4],
          [6, 0.2],
        ],
      },
    ],
    series: [
      {
        name: 'scatter',
        type: 'scatter',
        datasetIndex: 0,
      },
      {
        name: 'line',
        type: 'line',
        smooth: true,
        datasetIndex: 1,
        symbolSize: 0.1,
        symbol: 'circle',
        label: { show: true, fontSize: 16 },
        labelLayout: { dx: -20 },
        encode: { label: 2, tooltip: 1 },
      },
    ],
  };

  constructor() {}
}
