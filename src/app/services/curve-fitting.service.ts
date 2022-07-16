import { Injectable } from '@angular/core';
import { Group, Options, Word } from './data.service';
import { VocabularyService } from './vocabulary.service';

@Injectable({
  providedIn: 'root',
})
export class CurveFittingService {
  constructor(private vocabularyService: VocabularyService) {}

  public countGroupWords(inputText: string, options: Options) {
    const words = inputText.split(/\s+/);
    let wordsMap = new Map<string, Word>();
    let numberOfWords = 0;

    words.forEach((text) => {
      text = options.lowercaseWords === true ? text.toLowerCase() : text;
      text = text.replace(/[\s]/g, '');

      if (this.vocabularyService.isEnglishWord(text)) {
        numberOfWords++;
        if (!wordsMap.has(text)) {
          wordsMap.set(text, {
            text: text,
            count: 1,
            normFreq: 0,
            fittedFreq: 0,
          } as Word);
        } else {
          let word = wordsMap.get(text);
          word!.count++;
          wordsMap.set(text, word!);
        }
      }
    });

    return { wordsMap, numberOfWords };
  }

  public sortGroupByFrequency(words: Map<string, Word>): Map<string, Word> {
    const sorted = [...words].sort((prev, next) => (next[1] === prev[1] ? prev[0].localeCompare(next[0]) : next[1].count - prev[1].count));
    let bufferWords = new Map<string, Word>();
    sorted.forEach((entry) => {
      bufferWords.set(entry[0], entry[1]);
    });
    return bufferWords;
  }

  public normalizeGroupFrequencies(wordMap: Map<string, Word>, totalWords?: number) {
    let total = totalWords ?? wordMap.size;
    wordMap.forEach((word, text) => {
      word.normFreq = word.count / total;
      wordMap.set(text, word);
    });
    return wordMap;
  }

  public calcZipfmandelbrot(rank: number, alpha: number, beta: number, constant: number): number {
    return constant / Math.pow(rank + beta, alpha);
  }

  public async findBestFitValues(fitName: string, values: Map<string, Word>) {
    let bestConstant = 0;
    let bestAlpha = 0;
    let bestBeta = 0;
    let lowestAverageError = Number.MAX_VALUE;

    if (fitName === 'zipfmandelbrot') {
      let sampleValues = new Array<number>();
      let sample = [...values].slice(0, 32).concat([...values].reverse().slice(0, 16));
      sample.forEach((entry) => {
        sampleValues.push(entry[1].normFreq);
      });

      let alpha = 0;
      let beta = 0;

      for (let constant = 0.0; constant < 1; constant += 0.005) {
        await new Promise((resolve) => setTimeout(resolve, 0));

        for (alpha = 0.2; alpha < 1; alpha += 0.0075) {
          for (beta = 0.72; beta < 1; beta += 0.008) {
            let rank = 1;

            let averageError = 0;
            sampleValues.forEach((word) => {
              averageError += (this.calcZipfmandelbrot(rank++, alpha, beta, constant) - word) ** 2;
            });

            averageError /= sampleValues.length;

            if (averageError <= lowestAverageError) {
              lowestAverageError = averageError;
              bestConstant = constant;
              bestAlpha = alpha;
              bestBeta = beta;
            }
          }
        }
      }
    }

    return { constant: bestConstant, alpha: bestAlpha, beta: bestBeta, error: lowestAverageError };
  }
}
