import { KeyValue } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { WordsService } from 'src/app/services/words.service';

@Component({
  selector: 'app-words-tab',
  templateUrl: './wordsTab.component.html',
  styleUrls: ['./wordsTab.component.scss'],
})
export class WordsTabComponent implements OnInit {
  public words?: Map<string, number>;

  constructor(private wordsService: WordsService) {}

  ngOnInit(): void {
    this.wordsService.computeWordsFromText(
      'wants to word and generate a text document with every word and the number of uses for each documen' +
        'sample sample sample example test a b c 1 2 3 a b c abc abc123 sample 1 2 3 a b c abc abc123 test'
    );

    this.words = this.wordsService.getUpdatedFrequency();
  }

  sortByValuePipe(): number {
    return 0;
  }
}
