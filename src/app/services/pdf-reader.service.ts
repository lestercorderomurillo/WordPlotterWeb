//@ts-nocheck
import { Injectable } from '@angular/core';
import {
  getDocument,
  GlobalWorkerOptions,
  DocumentInitParameters,
} from 'pdfjs-dist';

@Injectable({
  providedIn: 'root',
})
export class PdfReaderService {
  constructor() {
    GlobalWorkerOptions.workerSrc =
      'https://cdn.jsdelivr.net/npm/pdfjs-dist@2.14.305/build/pdf.worker.js';
  }

  /**
   * Returns a promise that resolves a pdf raw binary buffer to a string
   */
  public async readPdfArrayBufferToString(arrBuffer: any): Promise<string> {
    const documentInitParameters = {
      data: arrBuffer,
      verbosity: 0,
    } as DocumentInitParameters;

    const doc = await getDocument(documentInitParameters);
    const pdf = await doc.promise;
    const promises = [];

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      promises.push(
        textContent.items
          .map((s) => {
            return s.str.trim();
          })
          .join(' ')
      );
    }

    const pageContents = await Promise.all(promises);
    return pageContents.join(' ');
  }

  /**
   * Returns a promise that resolves to an map of fileName -> raw pdf string content
   */
  async loadMultiplePdfAsync(fileList: FileList): Promise<Map<string, string>> {
    const output = new Map<string, string>();
    let promises: Promise<Array<any>>[] = [];

    for (let i = 0; i < fileList?.length; i++) {
      let filePath = fileList[i];

      if (filePath.type === 'application/pdf') {
        promises.push(
          new Promise((resolve, reject) => {
            filePath
              .arrayBuffer()
              .then((buffer: ArrayBuffer) => {
                return this
                  .readPdfArrayBufferToString(buffer)
                  .then((text) => {
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
}
