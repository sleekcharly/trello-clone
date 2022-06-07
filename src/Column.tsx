import React from "react";
import { ColumnContainer, ColumnTitle } from "./styles";
import { AddNewItem } from "./AddNewItem";
import { useAppState } from "./AppStateContext";
import { Card } from "./Card";

type ColumnProps = {
  text: string;
  index: number;
};

// Use the 'React.PropsWithChildren' type to enhance
// your props type, and add a definition for children.
// you could also manually add children
// children?: React.ReactNode
export const Column = ({
  text,
  // children?: React.ReactNode
  index,
}: ColumnProps) => {
  const { state } = useAppState();
  return (
    <ColumnContainer>
      <ColumnTitle>{text}</ColumnTitle>
      {state.lists[index].tasks.map((task) => (
        <Card text={task.text} key={task.id} />
      ))}

      <AddNewItem
        toggleButtonText="+ Add another task"
        onAdd={console.log}
        dark
      />
    </ColumnContainer>
  );
};
