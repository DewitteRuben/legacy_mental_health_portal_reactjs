import { ActionCreator } from "redux";
import {} from "../../services/localStorage";
import { SetLastKnownIdAction, SyncActionTypes } from "./sync.types";
// type ThunkResult<R> = ThunkAction<R, StoreState, undefined, any>;

const setLastKnownId: ActionCreator<SetLastKnownIdAction> = (id: string) => ({
  id,
  type: SyncActionTypes.ADD_LAST_KNOWN_ID
});

export { setLastKnownId };
