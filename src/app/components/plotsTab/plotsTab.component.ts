import { Component, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';
import { FileService } from 'src/app/services/file.service';

@Component({
  selector: 'app-plots-tab',
  templateUrl: './plotsTab.component.html',
  styleUrls: ['./plotsTab.component.scss'],
})
export class PlotsTabComponent implements OnInit {
  public isViewReady = false;
  public plotsOptions: Map<string, Array<EChartsOption>> = new Map<
    string,
    Array<EChartsOption>
  >();

  public defaultScatterPlot: EChartsOption = {
    title: {
      text: 'Scatter Plot',
      subtext: 'Top 25 words',
      left: 'left',
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
          [1, 0.9],
          [2, 0.77],
          [3, 0.6],
          [4, 0.45],
          [5, 0.33],
          [6, 0.25],
          [7, 0.2],
          [8, 0.1],
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

  constructor(private fileService: FileService) {}
  
  ngOnInit() {

    this.plotsOptions = new Map<string, Array<EChartsOption>>();
    //this.groups.forEach((value: any, key: string) => {
    const scatterChartOption = {
      title: {
        text: 'Scatter Plot',
        subtext: 'Top 25 words',
        left: 'left',
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
    } as EChartsOption;

    const barChartOption = {
      title: {
        text: 'Bar Plot',
        subtext: 'Top 25 words',
        left: 'left',
      },
      xAxis: {
        type: 'category',
        data: ['Word1', 'Word2', 'Word3'],
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          data: [120, 200, 150, 80, 70, 110, 130],
          type: 'bar',
        },
      ],
    } as EChartsOption;

    this.plotsOptions.set('Test', [scatterChartOption, barChartOption]);
  }

  get groups() {
    return this.fileService.getAllGroups();
  }
}
