import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class VocabularyService {
  constructor() {}

  public isEnglishWord(word: string): boolean {
    const allowedTwoWords = ['ab', 'ad', 'ah', 'am', 'an', 'as', 'at', 'be', 'to', 'by', 'do', 'go', 'if', 'in', 'is', 'it', 'no', 'of', 'on', 'or', 'so', 'id', 'my', 'me', 'og', 'ok', 'op', 'os', 'uh', 'um', 'us', 'we', 'si', 'ma', 'ha', 'ex', 'yo', 'bi'];
    return /^[a-zA-Z]{3,25}$/.test(word) || allowedTwoWords.includes(word.toLowerCase());
  }
}
