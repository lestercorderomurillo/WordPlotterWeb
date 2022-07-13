import { Injectable } from '@angular/core';
import { PdfReaderService } from './pdf-reader.service';
import { AngularCsv } from 'angular-csv-ext/dist/Angular-csv';
import { CurveFittingService } from './curve-fitting.service';
import { VocabularyService } from './vocabulary.service';
import { FileStoreService } from './file-store.service';

declare type name = string;
declare type FileName = string;
declare type WordName = string;
declare type StrMessage = string;

export interface Word {
  count: number;
  normFreq: number;
  fittedFreq: number;
}

export interface DataGroup {
  wordsMap: Map<WordName, Word>;
  alpha: number;
  beta: number;
  constant: number;
  rSquared: number;
  error: number;
}

export interface Group {
  name: string;
  dataGroup: DataGroup;
  children: Map<FileName, DataGroup>;
}

export interface Options {
  lowercaseWords: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class DataService {
  public options: Options;
  public groups = new Map<name, Group>();
  public awaitingGroups = new Map<FileName, StrMessage>();

  constructor(private pdfReaderService: PdfReaderService, private curveFittingService: CurveFittingService, private fileStoreService: FileStoreService) {
    this.options = {
      lowercaseWords: true,
    };
  }

  public createDataGroupModel(wordsMap?: Map<WordName, Word>) {
    return {
      wordsMap: wordsMap ?? new Map<WordName, Word>(),
      alpha: 0,
      beta: 0,
      constant: 0,
      rSquared: 0,
      error: 0,
    } as DataGroup;
  }

  public createGroup(name: string) {
    const model = {
      name,
      dataGroup: this.createDataGroupModel(),
      children: new Map<FileName, DataGroup>(),
    } as Group;

    this.groups.set(name, model);

    return model;
  }

  public deleteGroup(name: string) {
    this.groups.delete(name);
  }

  public exportDataGroup(name: string, fileName: string) {
    let data = new Array();

    data.push(['File name: ', fileName]);
    data.push(['']);
    data.push(['Constant', 'α', 'β', 'R²']);
    data.push([
      this.groups.get(name)?.children?.get(fileName)?.constant ?? 'Error',
      this.groups.get(name)?.children?.get(fileName)?.alpha ?? 'Error',
      this.groups.get(name)?.children?.get(fileName)?.beta ?? 'Error',
      this.groups.get(name)?.children?.get(fileName)?.rSquared ?? 'Error',
    ]);
    data.push(['']);
    data.push(['Word', 'Rank', 'Norm Freq', 'Predicted Freq']);

    let rank = 1;
    this.groups
      .get(name)
      ?.children?.get(fileName)
      ?.wordsMap.forEach((word, text) => {
        data.push([text, rank++, word.normFreq, word.fittedFreq]);
      });

    new AngularCsv(data, fileName);
  }

  public exportGroup(name: string, fileName: string) {
    let data = new Array();
    data.push(['Group name: ', name]);
    data.push(['']);
    data.push(['Constant', 'α', 'β', 'R²']);
    data.push([
      this.groups.get(name)?.dataGroup.constant ?? 'Error',
      this.groups.get(name)?.dataGroup.alpha ?? 'Error',
      this.groups.get(name)?.dataGroup.beta ?? 'Error',
      this.groups.get(name)?.dataGroup.rSquared ?? 'Error',
    ]);
    data.push(['']);
    data.push(['Word', 'Rank', 'Norm Freq', 'Predicted Freq']);

    let rank = 1;
    this.groups.get(name)?.dataGroup?.wordsMap.forEach((word, text) => {
      data.push([text, rank++, word.normFreq, word.fittedFreq]);
    });

    new AngularCsv(data, fileName);
  }

  public async processGroup(name: string) {
    let group = this.createGroup(name);
    let parentMap = new Map<string, Word>();
    let totalOfWords = 0;
    this.awaitingGroups.set(group.name, 'Feeding words from files...');

    let files = await this.pdfReaderService.loadMultiplePdfAsync(this.fileStoreService.getFileList(group.name));
    this.awaitingGroups.set(name, 'Fitting data for lowest error...');

    // make an array of promises
    let promises = new Array<Promise<boolean>>();

    files.forEach((text, fileName) => {
      promises.push(
        new Promise((resolve, reject) => {
          let { wordsMap, numberOfWords } = this.curveFittingService.countGroupWords(text, this.options);
          wordsMap = this.curveFittingService.sortGroupByFrequency(wordsMap);
          wordsMap = this.curveFittingService.normalizeGroupFrequencies(wordsMap, numberOfWords);

          wordsMap.forEach((word, text) => {
            if (parentMap.has(text)) {
              parentMap.set(text, {
                count: parentMap?.get(text)!.count + word.count,
                normFreq: 0,
                fittedFreq: 0,
              });
            } else {
              parentMap.set(text, {
                count: word.count,
                normFreq: 0,
                fittedFreq: 0,
              });
            }
          });

          this.applyFitToDataGroup('zipfmandelbrot', this.createDataGroupModel(wordsMap)).then((childGroup) => {
            group.children.set(fileName, childGroup);
            this.groups.set(name, group);
            totalOfWords += numberOfWords;
            resolve(true);
          });
        })
      );
    });

    // wait for all promises to resolve
    await Promise.all(promises);

    group.dataGroup.wordsMap = parentMap;
    group.dataGroup.wordsMap = this.curveFittingService.sortGroupByFrequency(group.dataGroup.wordsMap);
    group.dataGroup.wordsMap = this.curveFittingService.normalizeGroupFrequencies(group.dataGroup.wordsMap, totalOfWords);
    group.dataGroup = await this.applyFitToDataGroup('zipfmandelbrot', group.dataGroup);

    this.groups.set(name, group);
    this.awaitingGroups.delete(name);
  }

  private async applyFitToDataGroup(fitName: string, dataGroup: DataGroup) {
    if (fitName === 'zipfmandelbrot') {
      let { constant, alpha, beta, error } = await this.curveFittingService.findBestFitValues(fitName, dataGroup.wordsMap);

      let rank = 1;
      dataGroup.wordsMap.forEach((word, text) => {
        word.fittedFreq = this.curveFittingService.calcZipfmandelbrot(rank++, alpha, beta, constant);
        dataGroup.wordsMap.set(text, word);
      });

      let mean = 0;
      dataGroup.wordsMap.forEach((word) => {
        mean += word.normFreq;
      });
      mean /= dataGroup.wordsMap.size;

      let squaredSum = 0;
      dataGroup.wordsMap.forEach((word) => {
        squaredSum += (word.normFreq - mean) ** 2;
      });

      let predictedSum = 0;
      dataGroup.wordsMap.forEach((word) => {
        predictedSum += (word.fittedFreq - mean) ** 2;
      });

      let bestRSquared = predictedSum / squaredSum;

      dataGroup.constant = constant;
      dataGroup.alpha = alpha;
      dataGroup.beta = beta;
      dataGroup.rSquared = bestRSquared;
      dataGroup.error = error;
    } else {
      return {} as DataGroup;
    }

    return dataGroup;
  }
}
