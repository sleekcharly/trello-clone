import React, { createContext, useReducer, useContext } from "react";
import { nanoid } from "nanoid";

// create a type for Task
type Task = {
  id: string;
  text: string;
};

// create a type for List
type List = {
  id: string;
  text: string;
  tasks: Task[];
};

// Define type for actions
type Action =
  | { type: "ADD_LIST"; payload: string }
  | { type: "ADD_TASK"; payload: { text: string; listId: string } };

export type AppState = {
  lists: List[];
};

const appData: AppState = {
  lists: [
    {
      id: "0",
      text: "To Do",
      tasks: [{ id: "c0", text: "Generate app scaffold" }],
    },
    {
      id: "1",
      text: "In Progress",
      tasks: [{ id: "c2", text: "Learn Typescript" }],
    },
    {
      id: "2",
      text: "Done",
      tasks: [{ id: "c3", text: "begin to use static typing" }],
    },
  ],
};

// React wants us to provide the default value for our context. This value will only
// be used if we don’t wrap our application into our AppStateProvider , so we can
// omit it. To do this, pass an empty object that we’ll cast to AppStateContextProps
// to createContext function. Here we use an as operator to make TypeScript think
// that our empty object actually has AppStateContextProps type:

type AppStateContextProps = {
  state: AppState;
  dispatch: React.Dispatch<Action>;
};

const AppStateContext = createContext<AppStateContextProps>(
  {} as AppStateContextProps
);

// Now let’s define the AppStateProvider . It will pass the hardcoded appData through
// the AppStateContext.Provider :

export const AppStateProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const [state, dispatch] = useReducer(appStateReducer, appData);

  return (
    <AppStateContext.Provider value={{ state, dispatch }}>
      {children}
    </AppStateContext.Provider>
  );
};

// Our component will only accept children as a prop. We’re using the React.propsWithChildren
// type. It requires one generic argument, but we don’t want to have any other props,
// so we pass an empty object to it.

// define a new function called useAppState
export const useAppState = () => {
  return useContext(AppStateContext);
};

// Define appStateReducer
const appStateReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case "ADD_LIST": {
      // Reducer logic here...
      return {
        ...state,
        lists: [
          ...state.lists,
          { id: nanoid(), text: action.payload, tasks: [] },
        ],
      };
    }

    case "ADD_TASK": {
      // Reducer logic here...
      return {
        ...state,
      };
    }

    default: {
      return state;
    }
  }
};
