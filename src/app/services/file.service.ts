import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  registeredFiles: Map<string, any> = new Map<string, FileList | Array<any>>();

  constructor() {}

  hasGroup(groupName: string) {
    return this.registeredFiles.has(groupName);
  }

  addGroup(groupName: string) {
    this.registeredFiles.set(groupName, []);
  }

  addFilesToGroup(groupName: string, fileList: FileList) {
    this.registeredFiles.set(groupName, fileList);
  }

  removeGroup(groupName: string) {
    this.registeredFiles.delete(groupName);
  }

  getGroup(groupName: string) {
    return this.registeredFiles.get(groupName);
  }

  getAllGroups() {
    return this.registeredFiles;
  }
}
