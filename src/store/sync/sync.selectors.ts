import { StoreState } from "..";

const getLastKnownId = (state: StoreState) => state.sync.lastKnownEntry;

export { getLastKnownId };
