import SYNC_INITIAL_STATE from "./sync.initial-state";

import { SyncState } from "./sync.types";

const languageReducer = (
  state: SyncState = SYNC_INITIAL_STATE,
  action: any
) => {
  switch (action.type) {
    default:
      return state;
  }
};

export default languageReducer;
