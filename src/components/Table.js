import React from "react";
import "../styles/table.scss";

export default function Table({ headers, content, total, mobile }) {
  return (
    <div className="table-container scroll">
      <table className="table-1">
        <thead>
          <tr>
            {headers?.map((el, i) => (
              <th
                className={`${mobile?.includes(el) ? "mobile" : ""}`}
                key={i + "c"}
              >
                {el}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {content?.map((el, ind) => (
            <tr key={ind + "k"} className="table-content">
              {Object.values(el).map((e, i) => (
                <td
                  className={`${mobile?.includes(headers[i]) ? "mobile" : ""}`}
                  key={i + "e"}
                >
                  {e}
                </td>
              ))}
            </tr>
          ))}
        </tbody>

        {total ? (
          <tfoot>
            <tr className="total-container">
              {headers?.map((el, i) =>
                total.includes(el) ? (
                  <th
                    className={`${mobile.includes(headers[i]) ? "mobile" : ""}`}
                    key={i + "j"}
                  >
                    {content.reduce(
                      (a, b) =>
                        a + Number(Object.values(b)[headers.indexOf(el)]),
                      0
                    )}
                  </th>
                ) : (
                  <th
                    className={`${mobile.includes(headers[i]) ? "mobile" : ""}`}
                    key={i + "j"}
                  >{`${i === 0 ? "Total" : ""}`}</th>
                )
              )}
            </tr>
          </tfoot>
        ) : null}
      </table>
    </div>
  );
}
