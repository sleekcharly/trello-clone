import React from "react";
import { CardContainer } from "./styles";

type CardProps = {
  text: string;
  index: number;
};

export const Card = ({ text }: CardProps) => {
  return <CardContainer>{text}</CardContainer>;
};
