import { Component, Inject, OnInit } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

export interface DialogData {
  title: string;
  message: string;
}

@Component({
  selector: 'app-dialog',
  templateUrl: 'dialog.component.html',
})
export class Dialog {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dialogRef: MatDialogRef<Dialog>
  ) {}

  onClickCloseDialog() {
    this.dialogRef.close();
  }
}
