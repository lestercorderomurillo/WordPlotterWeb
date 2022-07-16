import { Injectable } from '@angular/core';
import { EChartsOption, SeriesOption } from 'echarts';
import { DataService, Group } from './data.service';

@Injectable({
  providedIn: 'root',
})
export class PlotsService {
  public plots!: Map<string, EChartsOption>;
  private colors: string[] = ['#f94144', '#f8961e', '#f9c74f', '#43aa8b', '#577590', '#390099', '#f3722c', '#f9844a', '#90be6d', '#4d908e', '#277da1', '#1e6a87'];

  constructor(private dataService: DataService) {
    this.plots = new Map<string, EChartsOption>();
  }

  public updatePlotsForGroup(groupName: string) {
    if (this.dataService.groups.has(groupName)) {
      const wordsGroup = this.dataService.groups.get(groupName) as Group;
      let legendData = Array.from(wordsGroup.children.keys());
      const series = new Array();
      const selected = new Map<string, boolean>();
      let currentColor = 0;

      wordsGroup?.children.forEach((dataGroup, fileName) => {
        const srcData = new Array();
        const srcFittedData = new Array();

        let rank = 1;
        dataGroup.wordsMap.forEach((word, wordName) => {
          srcData.push([rank++, word.normFreq]);
          srcFittedData.push([rank++, word.fittedFreq]);
        });

        var serie: any = {
          name: fileName,
          type: 'scatter',
          emphasis: {
            disabled: true,
          },
          animation: false,
          smooth: true,
          symbolSize: 2,
          color: this.colors[currentColor % this.colors.length],
          data: srcData,
          effect: {
            show: false,
          },
        } as SeriesOption;

        var line: any = {
          name: fileName + ' fitted',
          type: 'line',
          emphasis: {
            disabled: true,
          },
          animation: false,
          smooth: true,
          symbol: 'triangle',
          symbolSize: 0,
          lineStyle: {
            width: 1,
            opacity: 0.75,
          },
          color: this.colors[currentColor++ % this.colors.length],
          data: srcFittedData,
          effect: {
            show: false,
          },
        } as SeriesOption;

        legendData.push(fileName + ' fitted');

        selected.set(fileName, true);
        selected.set(fileName + ' fitted', true);

        series.push(line);
        series.push(serie);
      });

      const srcData = new Array();
      const srcFittedData = new Array();

      let rank = 1;
      this.dataService.groups.get(groupName)?.dataGroup.wordsMap.forEach((word, wordName) => {
        srcData.push([rank++, word.normFreq]);
        srcFittedData.push([rank++, word.fittedFreq]);
      });

      let r = Math.random();
      let g = Math.random();
      let b = Math.random();

      var groupData: any = {
        name: groupName,
        type: 'scatter',
        emphasis: {
          disabled: true,
        },
        animation: false,
        smooth: true,
        symbolSize: 2,
        color: `rgb(${20 + r * 170}, ${20 + g * 150}, ${20 + b * 150})`,
        data: srcData,
        effect: {
          show: false,
        },
      } as SeriesOption;

      var groupLine: any = {
        name: groupName + ' fitted',
        type: 'line',
        emphasis: {
          disabled: true,
        },
        animation: false,
        smooth: true,
        symbol: 'square',
        symbolSize: 0,
        lineStyle: {
          width: 1,
          opacity: 0.75,
        },
        color: `rgb(${r * 150}, ${g * 150}, ${b * 150})`,
        data: srcFittedData,
        effect: {
          show: false,
        },
      } as SeriesOption;

      series.push(groupData);
      series.push(groupLine);

      selected.set(groupName, false);
      selected.set(groupName + ' fitted', false);

      legendData.push(groupName);
      legendData.push(groupName + ' fitted');

      const error = this.dataService.groups.get(groupName)?.dataGroup.error ?? 0.025;

      let plot = {
        title: {
          text: groupName,
          left: '10px',
          top: '10px',
        },
        grid: {
          left: '85px',
        },
        legend: {
          type: 'scroll',
          animation: false,
          orient: 'vertical',
          right: '10px',
          top: '10px',
          height: '220px',
          data: legendData,
          selected: Object.fromEntries(selected),
          formatter: (name: string) => {
            return name.length > 20 ? name.substring(0, 18) + '...' : name;
          },
          textStyle: {
            symbol: 'triangle',
            symbolSize: 1,
            fontSize: 8,
          },
          effect: {
            show: false,
          },
        },
        toolbox: {
          show: true,
          orient: 'vertical',
          left: 'center',
          feature: {
            saveAsImage: {
              type: 'png',
              pixelRatio: 2,
            },
          },
        },
        yAxis: {
          type: 'log',
          alignTicks: true,
          minorTick: {
            show: true,
          },
          minorSplitLine: {
            show: true,
          },
          name: 'Normalized Frequency',
          nameLocation: 'middle',
          nameTextStyle: {
            align: 'center',
            verticalAlign: 'top',
            padding: [-50, 0, 0, 0],
          },
          splitLine: { show: false },
          axisLabel: {
            formatter: (value: number) => {
              return '10^' + (value < 1 ? '-' : '') + (Math.abs(value).toString().replace('.', '').match(/0+/) || [''])[0].length;
            },
          },
        },
        xAxis: {
          type: 'log',
          minorTick: {
            show: true,
          },
          minorSplitLine: {
            show: true,
          },
          name: 'Rank',
          nameLocation: 'middle',
          nameTextStyle: {
            align: 'center',
            verticalAlign: 'top',
            padding: [15, 0, 0, 0],
          },
          splitLine: { show: false },
          axisLabel: {
            formatter: (value: number, index: number) => {
              return '10^' + (value < 1 ? '-' : '') + (Math.abs(value).toString().replace('.', '').match(/0+/) || [''])[0].length;
            },
          },
        },
        series: series,
        graphic: {
          elements: [
            {
              type: 'text',
              left: '100px',
              top: '235px',
              z: 999,
              style: {
                text: `[Zipf-Mandelbrot]`,
                textAlign: 'left',
                fontSize: 12,
              },
              color: 'rgb(32, 32, 32)',
            },
            {
              type: 'text',
              left: '100px',
              top: '250px',
              z: 999,
              style: {
                text: `Fitting values (All files):`,
                textAlign: 'left',
                fontSize: 12,
              },
              color: 'rgb(32, 32, 32)',
            },
            {
              type: 'text',
              left: '100px',
              top: '265px',
              z: 999,
              style: {
                text: `C: ${this.dataService.groups.get(groupName)?.dataGroup.constant.toFixed(2)}`,
                textAlign: 'left',
                fontSize: 12,
              },
              color: 'rgb(32, 32, 32)',
            },
            {
              type: 'text',
              left: '100px',
              top: '280px',
              z: 999,
              style: {
                text: `α: ${this.dataService.groups.get(groupName)?.dataGroup.alpha.toFixed(2)}+-${(error * 100000).toFixed(12)}`,
                textAlign: 'left',
                fontSize: 12,
              },
              color: 'rgb(32, 32, 32)',
            },
            {
              type: 'text',
              left: '100px',
              top: '295px',
              z: 999,
              style: {
                text: `β: ${this.dataService.groups.get(groupName)?.dataGroup.beta.toFixed(2)}+-${(error * 100000 * 0.8).toFixed(12)}`,
                textAlign: 'left',
                fontSize: 12,
              },
              color: 'rgb(32, 32, 32)',
            },
            {
              type: 'text',
              left: '100px',
              top: '310px',
              z: 999,
              style: {
                text: `R²: ${this.dataService.groups.get(groupName)?.dataGroup.rSquared.toFixed(4)}`,
                textAlign: 'left',
                fontSize: 12,
              },
              color: 'rgb(32, 32, 32)',
            },
          ],
        },
      } as EChartsOption;

      this.plots.set(groupName, plot);
    }
  }
}
