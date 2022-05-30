import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class WordsService {
  public words: Map<string, number> = new Map<string, number>();
  constructor() {}

  computeWordsFromText(input: string) {
    const words = input.split(' ');

    words.forEach((word) =>
      this.words.set(word, (this.words.get(word) || 0) + 1)
    );

    const sorted = [...this.words].sort((prev, next) =>
      next[1] === prev[1] ? prev[0].localeCompare(next[0]) : next[1] - prev[1]
    );

    let bufferWords: Map<string, number> = new Map<string, number>();

    sorted.forEach((entry) => {
      let wordSorted = entry[0];
      let freqSorted = entry[1];
      bufferWords.set(wordSorted, freqSorted);
    });

    this.words = bufferWords;
  }

  getUpdatedFrequency() {
    return this.words;
  }

  excludeWords(words: string[]) {}
}
