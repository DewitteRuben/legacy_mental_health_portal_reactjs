import { Action } from "redux";

export enum SyncActionTypes {
  ADD_LAST_KNOWN_ID = "@sync/ADD_LAST_KNOWN_ID"
}

export interface SyncState {
  lastKnownEntry: string;
}

export interface SetLastKnownIdAction extends Action {
  id: string;
}
