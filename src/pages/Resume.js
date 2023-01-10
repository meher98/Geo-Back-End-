import React, { useState } from "react";
import { BsFillPencilFill } from "react-icons/bs";
import { FaTrash } from "react-icons/fa";
import Card from "../components/Card";
import Table from "../components/Table";
import "../styles/resume.scss";

export default function Resume() {
  const [active, setActive] = useState("semaine");
  const addActionsToData = (data) => {
    let X = [];
    for (let el of data) {
      let x = el;
      x["Actions"] = (
        <div className="actions-container">
          <span>
            <BsFillPencilFill />
          </span>
          <span>
            <FaTrash />
          </span>
        </div>
      );
      X.push(x);
    }
    return X;
  };
  const hadleTable = (x) => {
    setActive(x);
  };
  const week = ["Date", "Dépenses", "Budget", "Reste", "Réintégré", "Épargné"];
  const content = [
    {
      Date: "05/08/2022",
      Total: 10,
      Budget: 10,
      Reste: 10,
      Réintégré: 10,
      Épargné: 10,
    },
    {
      Date: "06/08/2022",
      Total: 70,
      Budget: 10,
      Reste: 10,
      Réintégré: 10,
      Épargné: 10,
    },
    {
      Date: "07/08/2022",
      Total: 10,
      Budget: 10,
      Reste: 10,
      Réintégré: 10,
      Épargné: 10,
    },
  ];
  return (
    <>
      <div className="resume-btn-container">
        <div
          onClick={() => hadleTable("mois")}
          className={`round-btn ${active === "mois" ? "active" : ""}`}
        >
          Modifier table
        </div>
      </div>
      <Card>
        <Table
          mobile={["Reste", "Réintégré", "Épargné"]}
          headers={week}
          content={content}
        />
      </Card>
    </>
  );
}
