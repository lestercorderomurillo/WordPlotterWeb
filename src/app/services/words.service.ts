import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class WordsService {
  public inputWords: Map<string, number> = new Map<string, number>();
  public words: Map<string, number> = new Map<string, number>();
  public lowerCaseInput: boolean = false;
  public ignoreSymbolsFromInput: boolean = false;

  constructor() {}

  computeWordsFromText(input: string) {
    const words = input.split(' ');

    words.forEach((word) =>
      this.words.set(word, (this.words.get(word) || 0) + 1)
    );

    this.words = this.sortByValue();
    this.words = this.normalizeSortedFrequency();
  }

  sortByValue() {
    const sorted = [...this.words].sort((prev, next) =>
      next[1] === prev[1] ? prev[0].localeCompare(next[0]) : next[1] - prev[1]
    );

    let bufferWords: Map<string, number> = new Map<string, number>();

    sorted.forEach((entry) => {
      let wordSorted = entry[0];
      let freqSorted = entry[1];
      bufferWords.set(wordSorted, freqSorted);
    });

    return bufferWords;
  }

  normalizeSortedFrequency() {
    let bufferWords: Map<string, number> = new Map<string, number>();

    this.words.forEach((entry, key) => {
      const value: number = entry / this.words.size;
      bufferWords.set(key, value);
    });

    return bufferWords;
  }

  isRealWord(word: string) {
    const regex = new RegExp(/[a-zA-Z]{2,}|a|A$/);
    return regex.test(word);
  }

  addToIgnoredWords(words: string[]) {}

  getUpdatedFrequency() {
    return this.words;
  }
}
