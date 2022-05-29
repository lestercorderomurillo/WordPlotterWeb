import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { FileService } from 'src/app/services/file.service';
import { Md5 } from 'ts-md5';
import { Dialog } from '../dialogs/dialogs.component';

@Component({
  selector: 'app-group-tab',
  templateUrl: './groupsTab.component.html',
  styleUrls: ['./groupsTab.component.scss'],
})
export class GroupTabComponent implements OnInit {
  public formGroup: FormGroup = new FormGroup({});

  constructor(private dialog: MatDialog, private fileService: FileService) {}

  ngOnInit() {
    this.formGroup = new FormGroup({
      groupName: new FormControl('', [Validators.required]),
    });
  }

  get groups() {
    return this.fileService.getAllGroups();
  }

  onClickSubmitForm(groupName: any) {
    if (!this.fileService.hasGroup(groupName)) {
      this.fileService.addGroup(groupName);
    } else {
      this.dialog.open(Dialog, {
        data: {
          title: 'Oops, error!',
          message:
            'The group already exists. Please use another name for that group.',
        },
      });
    }
  }

  onFileChange(groupName: string, event: any) {
    this.fileService.addFilesToGroup(groupName, event.target.files);
  }

  onClickDeleteGroup(groupName: any) {
    this.fileService.removeGroup(groupName);
  }

  onClickOpenSelectionDialog(groupName: string) {
    let element: HTMLElement = document.getElementById(
      this.md5(groupName)
    ) as HTMLElement;
    element.click();
  }

  md5(groupName: string) {
    return Md5.hashStr(groupName);
  }

  trackItem(index: number, item: any) {
    return item.trackId;
  }

  /*
  public groupsNames: string[] = [];
  public groupsState: any[] = [];


  

  onClickSubmitForm(groupName: any) {
    if (!this.fileService.hasGroup(groupName)) {
      this.fileService.addGroup(groupName);
    } else {
      this.dialog.open(Dialog, {
        data: {
          title: 'Oops, error!',
          message:
            'The group already exists. Please use another name for that group.',
        },
      });
    }

    this.updateGroupState();
  }

  onFileChange(groupName: string, event: any) {
    this.fileService.addFilesToGroup(groupName, event.target.files);
    this.updateGroupState();
  }

  onClickCloseDialog() {
    this.dialog.closeAll();
  }

  onClickDeleteGroup(groupName: any) {
    this.fileService.removeGroup(groupName);
    this.updateGroupState();
  }

  onClickOpenSelectionDialog(groupName: string) {
    let element: HTMLElement = document.getElementById(
      this.md5(groupName)
    ) as HTMLElement;
    element.click();
  }

  md5(groupName: string) {
    return Md5.hashStr(groupName);
  }

  trackItem(index: number, item: any) {
    return item.trackId;
  }

  updateGroupState() {
    this.groupsState = [...this.fileService.getAllGroups().values()];
    this.groupsNames = [...this.fileService.getAllGroups().keys()];
    console.log(this.groupsState);
    console.log(this.groupsState);
  }*/
}
