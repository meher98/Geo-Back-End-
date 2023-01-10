import React, { useState } from "react";
import "../styles/calendar.scss";
import { verifWeekInMonth, weekParams } from "../utils/functions";

export default function Calendar({
  initialMonth,
  initialYear,
  dayClick,
  weekClick,
  monthClick,
  yearClick,
  showWeek,
  allowChangeMonth,
  otherMonths,
  week,
  changeMonthFunc,
  onClick,
}) {
  const { JsonCalendar } = require("json-calendar");
  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();

  const [calendar, setCalendar] = useState(
    new JsonCalendar({
      languageCode: "fr",
      monthIndex: initialMonth ? initialMonth : month,
      year: initialYear ? initialYear : year,
    })
  );
  const prevMonth = () => {
    let m = calendar.options.monthIndex - 1;
    let y = calendar.options.year;
    if (m < 0) {
      m = 11;
      y = calendar.options.year - 1;
    }
    setCalendar(
      new JsonCalendar({ languageCode: "fr", monthIndex: m, year: y })
    );
    if (changeMonthFunc) {
      changeMonthFunc();
    }
  };

  const nextMonth = () => {
    let m = calendar.options.monthIndex + 1;
    let y = calendar.options.year;
    if (m > 11) {
      m = 0;
      y = calendar.options.year + 1;
    }
    setCalendar(
      new JsonCalendar({ languageCode: "fr", monthIndex: m, year: y })
    );
    if (changeMonthFunc) {
      changeMonthFunc();
    }
  };

  return (
    <div className="calendar-container" onClick={onClick}>
      <div className="month">
        <ul>
          {allowChangeMonth ? (
            <li key="prev" onClick={() => prevMonth()} className="prev">
              &#10094;
            </li>
          ) : null}
          <li
            key="month"
            onClick={() =>
              monthClick
                ? monthClick(
                    calendar.options.year,
                    calendar.options.monthIndex + 1
                  )
                : null
            }
          >
            {calendar.getMonthName(calendar.options.monthIndex)}
          </li>
          <li
            key="year"
            onClick={() =>
              yearClick ? yearClick(calendar.options.year) : null
            }
          >
            {calendar.options.year}
          </li>
          {allowChangeMonth ? (
            <li key="next" onClick={() => nextMonth()} className="next">
              &#10095;
            </li>
          ) : null}
        </ul>
      </div>

      <ul className={`days ${showWeek ? "showWeek" : null}`}>
        {showWeek ? (
          <li key="sem" className="weekday week">
            Sem
          </li>
        ) : null}
        {calendar?.dayNames?.map((el, i) => (
          <li key={"dn" + i} className="weekday">
            {el.abbr}
          </li>
        ))}
        {calendar?.weeks?.map((el, ind) =>
          week || week === 0 ? (
            week === ind ? (
              <>
                {showWeek ? (
                  <li
                    key={"w" + ind}
                    onClick={() =>
                      weekClick
                        ? weekClick(
                            ...weekParams(
                              calendar.options.year,
                              calendar.options.monthIndex + 1,
                              ind,
                              el
                            )
                          )
                        : null
                    }
                    className="week"
                  >
                    {ind}
                  </li>
                ) : null}
                {el.map((e, i) => (
                  <li
                    key={"d" + i}
                    onClick={() =>
                      dayClick
                        ? (otherMonths || e.className.includes("month-day")) &&
                          dayClick(e.year, e.monthIndex + 1, e.day)
                        : null
                    }
                    className={`${
                      `${day}-${month}-${year}` ===
                      `${e.day}-${calendar.options.monthIndex}-${calendar.options.year}`
                        ? "active"
                        : ""
                    } ${
                      e.className.includes("month-day") ? "" : "not-in-month"
                    }`}
                  >
                    {e.className.includes("month-day")
                      ? e.day
                      : otherMonths
                      ? e.day
                      : ""}
                  </li>
                ))}
              </>
            ) : null
          ) : verifWeekInMonth(el) ? (
            <>
              {showWeek ? (
                <li
                  key={"w" + ind}
                  onClick={() =>
                    weekClick
                      ? weekClick(
                          ...weekParams(
                            calendar.options.year,
                            calendar.options.monthIndex + 1,
                            ind,
                            el
                          )
                        )
                      : null
                  }
                  className="week"
                >
                  {ind}
                </li>
              ) : null}
              {el.map((e, i) => (
                <li
                  key={"d" + i}
                  onClick={() =>
                    dayClick
                      ? (otherMonths || e.className.includes("month-day")) &&
                        dayClick(e.year, e.monthIndex + 1, e.day)
                      : null
                  }
                  className={`${
                    `${day}-${month}-${year}` ===
                    `${e.day}-${calendar.options.monthIndex}-${calendar.options.year}`
                      ? "active"
                      : ""
                  } ${e.className.includes("month-day") ? "" : "not-in-month"}`}
                >
                  {e.className.includes("month-day")
                    ? e.day
                    : otherMonths
                    ? e.day
                    : ""}
                </li>
              ))}
            </>
          ) : null
        )}
      </ul>
    </div>
  );
}
