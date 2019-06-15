import { applyMiddleware, combineReducers, createStore, compose } from "redux";
import thunk from "redux-thunk";
import { createBrowserHistory } from "history";
import { syncReducer } from "./sync";
import { connectRouter, routerMiddleware} from "connected-react-router";

const storeMiddleware = [thunk];

export const history = createBrowserHistory();

const createRootReducer = (history: any) => combineReducers({
  router: connectRouter(history),
  sync: syncReducer
});

const store = createStore(
  createRootReducer(history),

  compose(
    applyMiddleware(...storeMiddleware, 
      routerMiddleware(history)
      )
    )
);

export default store;
export * from "./store.types";
