import { Component, ViewChild } from '@angular/core';
import { OptionsTabComponent } from './components/optionsTab/optionsTab.component';
import { PlotsTabComponent } from './components/plotsTab/plotsTab.component';
import { WordsTabComponent } from './components/wordsTab/wordsTab.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  @ViewChild('wordsTab') wordsTab!: WordsTabComponent;
  @ViewChild('plotsTab') plotsTab!: PlotsTabComponent;
  @ViewChild('options') optionsTab!: OptionsTabComponent;
}
