import { KeyValue } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { WordsService } from 'src/app/services/words.service';

@Component({
  selector: 'app-words-tab',
  templateUrl: './wordsTab.component.html',
  styleUrls: ['./wordsTab.component.scss'],
})
export class WordsTabComponent implements OnInit {
  public words: any;

  constructor(private wordsService: WordsService) {}

  ngOnInit(): void {
    this.wordsService.computeWordsFromText(
      'wants to word and generate a text document with every word and the number of uses for each document'
    );

    this.words = this.wordsService.getUpdatedFrequency();
  }

  sortByValuePipe(): number {
    return 0;
  }
}
