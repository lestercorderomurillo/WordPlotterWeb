//@ts-nocheck
import { Injectable } from '@angular/core';
import * as pdfjsLib from 'pdfjs-dist';

@Injectable({
  providedIn: 'root',
})
export class PdfReaderService {
  constructor() {
    pdfjsLib.GlobalWorkerOptions.workerSrc =
      'https://cdn.jsdelivr.net/npm/pdfjs-dist@2.14.305/build/pdf.worker.js';
  }
  public async readPdf(arrBuffer: any): Promise<string> {
    const documentInitParameters = {
      data: arrBuffer,
      verbosity: 0
    } as pdfjsLib.DocumentInitParameters;

    const doc = await pdfjsLib.getDocument(documentInitParameters);
    const pdf = await doc.promise;
    const countPromises = [];

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      countPromises.push(
        textContent.items
          .map((s) => {
            return s.str.trim();
          })
          .join(' ')
      );
    }

    const pageContents = await Promise.all(countPromises);
    return pageContents.join(' ');
  }
}
