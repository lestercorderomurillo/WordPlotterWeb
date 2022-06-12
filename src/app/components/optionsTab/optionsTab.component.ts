import { Component, OnInit } from '@angular/core';
import { WordsService } from 'src/app/services/words.service';

@Component({
  selector: 'app-options-tab',
  templateUrl: './optionsTab.component.html',
  styleUrls: ['./optionsTab.component.scss'],
})
export class OptionsTabComponent implements OnInit {
  public outputFileExtension: string = 'PDF';
  public formula: string = 'Zipf';
  public showGroupsPlots: boolean = true;
  public lowercaseInput: boolean = true;

  /*public showScatterPlots: boolean = false;
  public showBarPlots: boolean = false;*/

  constructor(private wordsService: WordsService) {}

  public ngOnInit(): void {
    this.wordsService.lowerCaseInput = this.lowercaseInput;
  }

  public updateOptions(): void {
    //this.wordsService.showGroupsPlots = this.showGroupsPlots;*/
    this.wordsService.lowerCaseInput = this.lowercaseInput;
    this.wordsService.updateAllWordsGroups();
  }
}
