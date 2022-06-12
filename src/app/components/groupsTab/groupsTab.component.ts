import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { FileService } from 'src/app/services/file.service';
import { WordsService } from 'src/app/services/words.service';
import { Md5 } from 'ts-md5';
import { Dialog } from '../dialogs/dialogs.component';

@Component({
  selector: 'app-group-tab',
  templateUrl: './groupsTab.component.html',
  styleUrls: ['./groupsTab.component.scss'],
})
export class GroupTabComponent implements OnInit {
  public formGroup: FormGroup = new FormGroup({});

  constructor(
    private dialog: MatDialog,
    private fileService: FileService,
    private wordsService: WordsService
  ) {}

  ngOnInit() {
    this.formGroup = new FormGroup({
      groupName: new FormControl('', [Validators.required]),
    });
  }

  onClickSubmitForm(groupName: any) {
    if (!this.fileService.hasGroup(groupName)) {
      this.fileService.addGroup(groupName);
      this.wordsService.updateWordsForGroup(groupName);
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
    this.wordsService.updateWordsForGroup(groupName);
  }

  onClickDeleteGroup(groupName: any) {
    this.fileService.removeGroup(groupName);
    this.wordsService.deleteWordGroup(groupName);
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

  get groups() {
    return this.fileService.getAllGroups();
  }
}
