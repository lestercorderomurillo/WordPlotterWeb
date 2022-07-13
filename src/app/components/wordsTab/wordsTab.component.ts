import { Component } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-words-tab',
  templateUrl: './wordsTab.component.html',
  styleUrls: ['./wordsTab.component.scss'],
})
export class WordsTabComponent {
  constructor(private dataService: DataService) {}

  public sortByValuePipe(): number {
    return 0;
  }

  public get awaitingGroups() {
    return this.dataService.awaitingGroups;
  }

  public get wordsGroups() {
    return this.dataService.groups;
  }

  public getDataGroup(groupName: string, fileName: string) {
    return this.dataService.groups.get(groupName)?.children.get(fileName);
  }

  public exportDataGroup(groupName: string, fileName: string, event: any) {
    this.dataService.exportDataGroup(groupName, fileName);
    event.stopPropagation();
  }

  public exportGroup(groupName: string) {
    this.dataService.exportGroup(groupName, groupName);
  }
}
