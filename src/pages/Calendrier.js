import React from "react";
import { useNavigate } from "react-router-dom";
import Calendar from "../components/Calendar";
import Card from "../components/Card";

export default function Calendrier() {
  const navigate = useNavigate();
  const date = new Date();
  const month = date.getMonth();
  const year = date.getFullYear();
  const link = (type, ...params) => {
    let str = `/depenses/${type}/`;
    params.map((e) => (str += `${e}-`));
    navigate(str.slice(0, -1));
  };
  return (
    <>
      <Card>
        <Calendar
          weekClick={(...par) => link("semaine", ...par)}
          dayClick={(...par) => link("jour", ...par)}
          monthClick={(...par) => link("mois", ...par)}
          showWeek
          initialMonth={month}
          initialYear={year}
          allowChangeMonth
          otherMonths
        />
      </Card>
    </>
  );
}
