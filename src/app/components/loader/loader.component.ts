import { Component, Input, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
})
export class LoaderComponent implements OnInit {
  @Input() visible = true;
  @Input() text? = "Loading...";

  constructor() {}

  ngOnInit(): void {}
  
  show(): void {
    this.visible = true;
  }

  hide(): void {
    this.visible = false;
  }
}
