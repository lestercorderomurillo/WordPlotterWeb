import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-options-tab',
  templateUrl: './optionsTab.component.html',
  styleUrls: ['./optionsTab.component.scss'],
})
export class OptionsTabComponent implements OnInit {
  public outputFileExtension: string = 'PDF';
  public adjustmentFormula: string = 'Zipf';

  constructor() {}

  ngOnInit(): void {}
}
