import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DataService } from 'src/app/services/data.service';
import { FileStoreService } from 'src/app/services/file-store.service';
import { PlotsService } from 'src/app/services/plots.service';
import { Md5 } from 'ts-md5';
import { Dialog } from '../dialogs/dialogs.component';

@Component({
  selector: 'app-group-tab',
  templateUrl: './groupsTab.component.html',
  styleUrls: ['./groupsTab.component.scss'],
})
export class GroupTabComponent implements OnInit {
  public formGroup: FormGroup = new FormGroup({});

  constructor(private dialog: MatDialog, private fileStoreService: FileStoreService, private dataService: DataService, private plotsService: PlotsService) {}

  ngOnInit() {
    this.formGroup = new FormGroup({
      groupName: new FormControl('', [Validators.required]),
    });
  }

  onClickCreateGroup(groupName: any) {
    if (!this.fileStoreService.exists(groupName)) {
      this.fileStoreService.create(groupName);
      this.dataService.createGroup(groupName);
    } else {
      this.dialog.open(Dialog, {
        data: {
          title: 'Oops, error!',
          message: 'The group already exists. Please use another name instead!',
        },
      });
    }

    this.plotsService.updatePlotsForGroup(groupName);
  }

  async onFileChange(groupName: string, event: any) {
    this.fileStoreService.delete(groupName);
    this.fileStoreService.submitFiles(groupName, event.target.files);
    await this.dataService.processGroup(groupName);
    this.plotsService.updatePlotsForGroup(groupName);
  }

  onClickDeleteGroup(groupName: any) {
    this.fileStoreService.delete(groupName);
    this.dataService.deleteGroup(groupName);
    this.plotsService.updatePlotsForGroup(groupName);
  }

  onClickOpenSelectionDialog(groupName: string) {
    let element: HTMLElement = document.getElementById(this.md5(groupName)) as HTMLElement;
    element.click();
  }

  md5(groupName: string) {
    return Md5.hashStr(groupName);
  }

  trackItem(index: number, item: any) {
    return item.trackId;
  }

  public get awaitingGroups() {
    return this.dataService.awaitingGroups;
  }

  public get wordsGroups() {
    return this.dataService.groups;
  }

  public get fileStoreServiceAccesor() {
    return this.fileStoreService;
  }

  public get files() {
    return this.fileStoreService.storedFiles;
  }
}
