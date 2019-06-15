import { Store } from "redux";
import { SyncState } from './sync';

export interface StoreState extends Store {
  sync: SyncState;
}
