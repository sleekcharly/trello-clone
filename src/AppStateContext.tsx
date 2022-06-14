import React, { createContext, useReducer, useContext } from "react";
import { nanoid } from "nanoid";
import {
  overrideItemAtIndex,
  findItemIndexById,
  moveItem,
  removeItemAtIndex,
  insertItemAtIndex,
} from "./utils/arrayUtils";
import { DragItem } from "./DragItem";

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
  | { type: "ADD_TASK"; payload: { text: string; listId: string } }
  | {
      type: "MOVE_LIST";
      payload: {
        dragIndex: number;
        hoverIndex: number;
      };
    }
  | { type: "SET_DRAGGED_ITEM"; payload: DragItem | undefined }
  | {
      type: "MOVE_TASK";
      payload: {
        dragIndex: number;
        hoverIndex: number;
        sourceColumn: string;
        targetColumn: string;
      };
    };

export type AppState = {
  lists: List[];
  draggedItem: DragItem | undefined;
};

const appData: AppState = {
  draggedItem: undefined,

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
      const targetListIndex = findItemIndexById(
        state.lists,
        action.payload.listId
      );

      const targetList = state.lists[targetListIndex];

      const updatedTargetList = {
        ...targetList,
        tasks: [
          ...targetList.tasks,
          { id: nanoid(), text: action.payload.text },
        ],
      };

      // Reducer logic here...
      return {
        ...state,
        lists: overrideItemAtIndex(
          state.lists,
          updatedTargetList,
          targetListIndex
        ),
      };
    }

    case "MOVE_LIST": {
      const { dragIndex, hoverIndex } = action.payload;
      return {
        ...state,
        lists: moveItem(state.lists, dragIndex, hoverIndex),
      };
    }

    case "SET_DRAGGED_ITEM": {
      return { ...state, draggedItem: action.payload };
    }

    case "MOVE_TASK": {
      const { dragIndex, hoverIndex, sourceColumn, targetColumn } =
        action.payload;

      const sourceListIndex = findItemIndexById(state.lists, sourceColumn);

      const targetListIndex = findItemIndexById(state.lists, targetColumn);

      const sourceList = state.lists[sourceListIndex];
      const task = sourceList.tasks[dragIndex];

      const updatedSourceList = {
        ...sourceList,
        tasks: removeItemAtIndex(sourceList.tasks, dragIndex),
      };

      const stateWithUpdatedSourceList = {
        ...state,
        lists: overrideItemAtIndex(
          state.lists,
          updatedSourceList,
          sourceListIndex
        ),
      };

      const targetList = stateWithUpdatedSourceList.lists[targetListIndex];

      const updatedTargetList = {
        ...targetList,
        tasks: insertItemAtIndex(targetList.tasks, task, hoverIndex),
      };

      return {
        ...stateWithUpdatedSourceList,
        lists: overrideItemAtIndex(
          stateWithUpdatedSourceList.lists,
          updatedTargetList,
          targetListIndex
        ),
      };
    }

    default: {
      return state;
    }
  }
};
