import React from "react";
import "../styles/card.scss";

export default function Card(props) {
  return <div className="card-container">{props.children}</div>;
}
