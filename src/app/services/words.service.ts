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
      }else if(filePath.type === 'text/plain'){
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

  private computeWordGroup(filesMap: Map<string, string>) {
    let fileWordGroup: FileWordGroup = new Map<string, Set<Word>>();
    filesMap.forEach((text, fileName) => {
      fileWordGroup.set(fileName, this.computeWordsFrom(text));
    });

    return fileWordGroup;
  }

  private isRealWord(word: string): boolean {
    const regex = new RegExp(/[a-zA-zÀ-ú]{2,}|a|A/);
    return regex.test(word);
  }

  private computeWordsFrom(text: string): Set<Word> {
    let wordsSet = new Set<Word>();
    let wordsMap = new Map<string, Word>();
    const words = text.replace(/[^a-zA-zÀ-ú\s]/g, '').split(/\s+/);
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
    let fileTexts = '';
    this.extractTextFromInputFiles(groupName).then((file) => {
      file.forEach((fileText) => {
        fileTexts += fileText;
      });
      
      const map = new Map<string, string>();
      map.set(groupName, fileTexts);

      const fileWordGroup = this.computeWordGroup(map);
      let data = new Array();

      data.push(['GroupName', 'Word', 'Rank', 'normFreq']);
      fileWordGroup?.forEach((wordGroup: Set<Word>) => {
        let rank = 1;
        wordGroup.forEach((word) => {
          data.push([groupName, word.text, rank++, word.normFreq]);
        });
      });

      new AngularCsv(data, groupName);
    });
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
