import { Component } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { FileStoreService } from 'src/app/services/file-store.service';
import { PlotsService } from 'src/app/services/plots.service';

@Component({
  selector: 'app-plots-tab',
  templateUrl: './plotsTab.component.html',
  styleUrls: ['./plotsTab.component.scss'],
})
export class PlotsTabComponent {
  public constructor(private plotsService: PlotsService, private fileStoreService: FileStoreService, private dataService: DataService) {}

  get plots() {
    return this.plotsService.plots;
  }

  get awaitingGroups() {
    return this.dataService.awaitingGroups;
  }

  get groups() {
    return this.dataService.groups;
  }
}
