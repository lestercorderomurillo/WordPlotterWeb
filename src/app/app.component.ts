import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Dialog } from './dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  formGroup: any;
  registerGroups: Array<any> = [];

  constructor(public dialog: MatDialog) {}

  ngOnInit() {
    this.formGroup = new FormGroup({
      groupName: new FormControl('', [Validators.required]),
    });
  }

  onClickSubmit(groupName: any) {
    if (!this.registerGroups.includes(groupName)) {
      this.registerGroups.push(groupName);
    } else {
      this.dialog.open(Dialog, {
        data: {
          title: 'Error',
          message: 'The group already exists. Please use another name for that group.',
        },
      });
    }
  }

  onClickCloseDialog() {
    this.dialog.closeAll();
  }

  onClickDelete(groupName: any) {
    this.registerGroups = this.registerGroups.filter((e) => e !== groupName);
  }
}
