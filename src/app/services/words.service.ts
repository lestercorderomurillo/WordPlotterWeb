import { Injectable } from '@angular/core';
import { FileService } from './file.service';
import { PdfReaderService } from './pdf-reader.service';
import { AngularCsv } from 'angular-csv-ext/dist/Angular-csv';

export interface Word {
  text: string;
  count: number;
  normFreq: number;
}

export type FileWordGroup = Map<string, Set<Word>>;

@Injectable({
  providedIn: 'root',
})
export class WordsService {
  public wordsGroups: Map<string, FileWordGroup> = new Map<
    string,
    FileWordGroup
  >();
  public lowerCaseInput: boolean = false;

  constructor(
    private fileService: FileService,
    private pdfReaderService: PdfReaderService
  ) {}

  public async updateAllWordsGroups(): Promise<void> {
    let inMemoryBackup = new Map(this.wordsGroups);
    inMemoryBackup.forEach((wordGroup, groupName) => {
      this.extractTextFromInputFiles(groupName).then((fileTexts) => {
        this.wordsGroups.set(groupName, this.computeWordGroup(fileTexts));
      });
    });
  }

  public async deleteWordGroup(groupName: string) {
    this.wordsGroups.delete(groupName);
  }

  public async updateWordsForGroup(groupName: string): Promise<void> {
    let fileTexts = await this.extractTextFromInputFiles(groupName);
    this.wordsGroups.set(groupName, this.computeWordGroup(fileTexts));
  }

  private async extractTextFromInputFiles(
    groupName: string
  ): Promise<Map<string, string>> {
    const output = new Map<string, string>();
    const fileList: FileList = this.fileService.getGroup(groupName);
    let promises: Promise<Array<any>>[] = [];

    for (let i = 0; i < fileList?.length; i++) {
      let filePath = fileList[i];

      if (filePath.type === 'application/pdf') {
        promises.push(
          new Promise((resolve, reject) => {
            filePath
              .arrayBuffer()
              .then((buffer: ArrayBuffer) => {
                return this.pdfReaderService.readPdf(buffer).then((text) => {
                  text = text.replace(/(?:https?|ftp):\/\/[\n\S]+/g, '');
                  resolve([filePath.name, text]);
                });
              })
              .catch((error) => {
                reject(error);
              });
          })
        );
      } else if (filePath.type === 'text/plain') {
        promises.push(
          new Promise((resolve, reject) => {
            filePath
              .text()
              .then((text) => {
                resolve([filePath.name, text]);
              })
              .catch((error) => {
                reject(error);
              });
          })
        );
      }

      let dataArr = await Promise.all(promises);
      dataArr.forEach((entry) => {
        output.set(entry[0], entry[1]);
      });
    }

    return output;
  }

  private computeWordGroup(filesMap: Map<string, string>): FileWordGroup {
    let fileWordGroup: FileWordGroup = new Map<string, Set<Word>>();
    filesMap.forEach((text, fileName) => {
      fileWordGroup.set(fileName, this.computeWordsFrom(text));
    });

    return fileWordGroup;
  }

  private isRealWord(word: string): boolean {
    const regex = new RegExp(/[a-zA-z]{2,}|a|A/);
    const failedCases = new RegExp(/[^a-zA-z]+/);
    const regexWeird = new RegExp(/[\[\]\{\}]/);
    if (regex.test(word) && !failedCases.test(word)) {
      const isWeirdText = regexWeird.test(word.toLowerCase());
      const excludeWords = ['i', 'ii', 'iii', 'xxx', 'www'];

      const allowedTwoWords = [
        'ab',
        'ad',
        'ah',
        'am',
        'an',
        'as',
        'aw',
        'at',
        'be',
        'to',
        'by',
        'do',
        'go',
        'if',
        'in',
        'is',
        'it',
        'no',
        'of',
        'on',
        'or',
        'so',
        'id',
        'my',
        'me',
        'og',
        'ok',
        'op',
        'os',
        'uh',
        'um',
        'us',
        'we',
        'si',
        'ma',
        'js',
        'io',
        'ha',
        'ex',
        'yo',
        'bi',
        'ai',
      ];
      let isEngWord = true;
      if (word.length == 2) {
        isEngWord = allowedTwoWords.includes(word.toLowerCase());
      }
      return (
        word.length <= 22 &&
        !isWeirdText &&
        isEngWord &&
        !excludeWords.includes(word.toLowerCase())
      );
    }
    return false;
  }

  private computeWordsFrom(text: string): Set<Word> {
    let wordsSet = new Set<Word>();
    let wordsMap = new Map<string, Word>();
    const words = text.split(/\s+/);
    words.forEach((word) => {
      if (this.lowerCaseInput === true) {
        word = word.toLowerCase();
      }
      word = word.replace(/[\s]/g, '');
      if (this.isRealWord(word)) {
        if (wordsMap.has(word)) {
          let wordObj = wordsMap.get(word);
          wordObj!.count++;
          wordsMap.set(word, wordObj!);
        } else {
          let wordObj = {
            text: word,
            count: 1,
            normFreq: 0,
          };
          wordsMap.set(word, wordObj!);
        }
      }
    });

    this.sortByFrequency(this.computeNormalizedFrequency(wordsMap)).forEach(
      (wordObj) => {
        wordsSet.add(wordObj);
      }
    );

    return wordsSet;
  }

  private computeNormalizedFrequency(
    words: Map<string, Word>
  ): Map<string, Word> {
    words.forEach((word) => {
      word.normFreq = word.count / words.size;
    });

    return words;
  }

  private sortByFrequency(words: Map<string, Word>): Map<string, Word> {
    const sorted = [...words].sort((prev, next) =>
      next[1] === prev[1]
        ? prev[0].localeCompare(next[0])
        : next[1].count - prev[1].count
    );
    let bufferWords = new Map<string, Word>();
    sorted.forEach((entry) => {
      bufferWords.set(entry[0], entry[1]);
    });
    return bufferWords;
  }

  public exportCompleteGroup(groupName: string) {
    let groupWords = new Map<string, Word>();

    this.wordsGroups.forEach((wordGroup: FileWordGroup, groupName) => {
      wordGroup.forEach((words: Set<Word>, fileName) => {
        words.forEach((word) => {
          if (groupWords.has(word.text)) {
            let wordObj = groupWords.get(word.text);
            wordObj!.count += word.count;
            groupWords.set(word.text, wordObj!);
          } else {
            groupWords.set(word.text, word);
          }
        });
      });
    });

    groupWords = this.computeNormalizedFrequency(groupWords);

    let data = new Array();
    let rank = 1;
    data.push(['GroupName', 'Word', 'Rank', 'normFreq']);
    groupWords?.forEach((word, key) => {
      if (this.isRealWord(word.text)) {
        data.push([groupName, word.text, rank++, word.normFreq]);
      }
    });

    new AngularCsv(data, groupName);
  }

  public exportFileGroup(groupName: string, fileName: string) {
    const fileWordGroup = this.wordsGroups.get(groupName);
    const wordGroup = fileWordGroup?.get(fileName);

    let data = new Array();
    data.push(['FileName', 'Word', 'Rank', 'normFreq']);

    let rank = 1;
    wordGroup?.forEach((word) => {
      data.push([fileName, word.text, rank++, word.normFreq]);
    });

    new AngularCsv(data, fileName);
  }
}
