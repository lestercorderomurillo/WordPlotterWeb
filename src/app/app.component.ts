import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Dialog } from './dialog.component';
import { Md5 } from 'ts-md5/dist/md5';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  formGroup: any;
  registeredGroups: Array<any> = [];
  registeredFiles: Array<Array<any>> = [];

  constructor(public dialog: MatDialog) {}

  ngOnInit() {
    this.formGroup = new FormGroup({
      groupName: new FormControl('', [Validators.required]),
    });

    this.onClickSubmitForm('Grupo01');
    this.onClickSubmitForm('Grupo02');
    this.onClickSubmitForm('Grupo03');
    this.onClickSubmitForm('Grupo04');
    this.onClickSubmitForm('Grupo05');
    this.onClickSubmitForm('Grupo06');
    this.onClickSubmitForm('Grupo07');
    this.onClickSubmitForm('Grupo08');
    this.onClickSubmitForm('Grupo09');
    this.onClickSubmitForm('Grupo10');
    this.onClickSubmitForm('Grupo11');
  }

  onClickSubmitForm(groupName: any) {
    if (!this.registeredGroups.includes(groupName)) {
      this.registeredGroups.push(groupName);
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

  onFileChange(groupName: any, event: any) {
    this.registeredFiles[groupName] = event.target.files;

    console.log(this.registeredFiles[groupName]);
  }

  onClickCloseDialog() {
    this.dialog.closeAll();
  }

  onClickDeleteGroup(groupName: any) {
    this.registeredGroups = this.registeredGroups.filter(
      (e) => e !== groupName
    );
  }

  onClickAddFilesToGroup(groupName: any) {
    let element: HTMLElement = document.getElementById(
      'u_' + this.md5(groupName)
    ) as HTMLElement;

    element.click();
  }

  md5(groupName: any) {
    return Md5.hashStr(groupName);
  }

  trackItem (index: number, item: any) {
    return item.trackId;
  }
}
