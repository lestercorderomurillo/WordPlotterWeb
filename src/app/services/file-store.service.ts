import { Injectable } from '@angular/core';

declare type GroupName = string;

@Injectable({
  providedIn: 'root',
})
export class FileStoreService {
  storedFiles: Map<GroupName, any | FileList>;

  constructor() {
    this.storedFiles = new Map<GroupName, FileList>();
  }

  exists(groupName: string) {
    return this.storedFiles.has(groupName);
  }

  create(groupName: string) {
    this.storedFiles.set(groupName, []);
  }

  submitFiles(groupName: string, fileList: FileList) {
    this.storedFiles.set(groupName, fileList);
  }

  delete(groupName: string) {
    this.storedFiles.delete(groupName);
  }

  getFileList(groupName: string): FileList {
    return this.storedFiles.get(groupName);
  }

  getAllGroups() {
    return this.storedFiles;
  }
}
