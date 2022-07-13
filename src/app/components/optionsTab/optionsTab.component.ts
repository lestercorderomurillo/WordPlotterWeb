import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-options-tab',
  templateUrl: './optionsTab.component.html',
  styleUrls: ['./optionsTab.component.scss'],
})
export class OptionsTabComponent{

  constructor(private dataService: DataService) {}

  get lowercaseWords(){
    return this.dataService.options.lowercaseWords;
  }

  set lowercaseWords(value){
    this.dataService.options.lowercaseWords = value;
  }
}
