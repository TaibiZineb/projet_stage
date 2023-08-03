// workspace.service.ts

import { Injectable } from '@angular/core';
import { Workspace } from '../model/user.model';

@Injectable({ providedIn: 'root' })
export class WorkspaceService {

  private callback: Function | undefined;
  private workspace: Workspace | undefined;

  setWorkspace(workspace: Workspace) {
    this.workspace = workspace;
    if (this.callback) {
      this.callback(workspace);
    }
  }

  registerCallback(callback: Function) {
    this.callback = callback;
  }
}

