import { Component } from '@angular/core';
import { WordsService } from 'src/app/services/words.service';

@Component({
  selector: 'app-words-tab',
  templateUrl: './wordsTab.component.html',
  styleUrls: ['./wordsTab.component.scss'],
})
export class WordsTabComponent {

  constructor(private wordsService: WordsService) {}

  sortByValuePipe(): number {
    return 0;
  }

  public get wordsGroups() {
    return this.wordsService.wordsGroups;
  }

  public exportFileGroup(groupName: string, fileName: string) {
    this.wordsService.exportFileGroup(groupName, fileName);
  }

  public exportCompleteGroup(groupName: string) {
    this.wordsService.exportCompleteGroup(groupName);
  }
}
