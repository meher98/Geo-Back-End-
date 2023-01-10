/* eslint-disable array-callback-return */
import React, { useContext, useEffect, useState } from "react";
import Input from "./Input";
import Modal from "./Modal";
import { AiFillCloseCircle, AiFillPlusCircle } from "react-icons/ai";
import "../styles/structureModal.scss";
import { appContext, pg_types } from "../utils/consts";
import { client } from "../utils/functions";
import { useNavigate } from "react-router-dom";
export default function StructureModal({
  closeFunction,
  show,
  table,
  name,
  setRefresh,
  refresh,
}) {
  const navigate = useNavigate();
  const { refreshSide, setRefreshSide, setError } = useContext(appContext);
  const [columns, setColumns] = useState([]);
  const [tableName, setTableName] = useState({ tableName: "", error: "" });
  const addColumn = () => {
    setColumns([
      ...columns,
      {
        column: "",
        type: "",
        pk: false,
        error: { column: "", type: "" },
      },
    ]);
  };
  const deleteColumn = (i) => {
    if (table && table[i]) {
      let cols = columns;
      cols[i] = null;
      setColumns([...cols]);
    } else {
      let cols = columns.filter((el, j) => i !== j);
      setColumns([...cols]);
    }
  };
  const handleColumnChange = (val, key, i) => {
    let cols = columns;
    cols[i][key] = val;
    setColumns([...cols]);
  };
  const handleTableNameChange = (e, key) => {
    let x = tableName;
    x[key] = e;
    setTableName({ tableName: x.tableName, error: x.error });
  };
  const verifFunction = () => {
    let bool = true;
    if (tableName.tableName === "") {
      handleTableNameChange("error msg", "error");
      bool = false;
    } else {
      handleTableNameChange("", "error");
    }
    let x = columns;
    columns.map((e, i) => {
      if (e !== null) {
        if (
          ["varbit", "char", "varchar"].includes(e.type) &&
          e.n === undefined
        ) {
          x[i].error.n = "error msg";
        }
        if (e.type === "numeric" && e.s === undefined) {
          x[i].error.s = "error msg";
        }
        if (e.type === "numeric" && e.s === undefined) {
          x[i].error.p = "error msg";
        }
        for (let key in e) {
          if (!["error", "pk"].includes(key)) {
            if (e[key] === "") {
              x[i].error[key] = "error msg";
              bool = false;
            } else {
              x[i].error[key] = "";
            }
          }
        }
      }

      setColumns([...x]);
    });
    return bool;
  };
  const transformDataForSubmit = (tab, tabName) => {
    return {
      tableName: tabName,
      columns: tab.map((e) =>
        e === null
          ? null
          : {
              column: e.column,
              type: `${e.type}${
                e.n ? `(${e.n})` : e.p ? `(${e.p},${e.s})` : ""
              }`,
              pk: e.pk,
            }
      ),
    };
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    let bool = verifFunction();
    if (bool) {
      if (table) {
        let data = {
          newS: transformDataForSubmit(columns, tableName.tableName),
          oldS: transformDataForSubmit(table, name),
        };
        client
          .patch("alter_table", data)
          .then((res) => {
            setRefresh(refresh);
            closeFunction();
          })
          .catch((error) => {
            setError(error.response.data);
          });
      } else {
        let data = transformDataForSubmit(columns, tableName.tableName);
        client
          .post("add_table", data)
          .then((res) => {
            let x = refreshSide;
            setRefreshSide(!x);
            navigate("/table/" + tableName.tableName);
            closeFunction();
          })
          .catch((error) => {
            setError(error.response.data);
          });
      }
    }
  };
  useEffect(() => {
    if (table) {
      let x = [];
      for (let i = 0; i < table.length; i++) {
        x.push({ ...table[i], error: { column: "", type: "" } });
      }
      setColumns([...x]);
    } else {
      setColumns([]);
    }
    if (name) {
      setTableName({ tableName: name, error: "" });
    } else {
      setTableName({ tableName: "", error: "" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  return (
    <Modal closeFunction={closeFunction} show={show}>
      <form
        onSubmit={(e) => handleSubmit(e)}
        className="structureModal-container scroll"
      >
        <div className="table-name-container">
          <Input
            placeholder="Table name"
            value={tableName.tableName}
            onChange={(e) => handleTableNameChange(e.target.value, "tableName")}
            error={tableName.error}
          />
        </div>

        {columns.map((el, i) =>
          el !== null ? (
            <div className="column-container">
              <Input
                error={el.error?.column}
                placeholder="Column"
                value={el.column}
                onChange={(e) =>
                  handleColumnChange(e.target.value, "column", i)
                }
              />
              <Input
                error={el.error?.type}
                placeholder="Type"
                value={el.type}
                type="select"
                onChange={(e) => handleColumnChange(e, "type", i)}
                data={pg_types.sort()}
              />
              {["varbit", "char", "varchar", "numeric"].includes(el.type) ? (
                <Input
                  error={el.type === "numeric" ? el.error?.n : el.error?.p}
                  placeholder={el.type === "numeric" ? "P" : "N"}
                  value={el.type === "numeric" ? el.p : el.n}
                  className="n-input"
                  type="number"
                  onChange={(e) =>
                    handleColumnChange(
                      e.target.value,
                      el.type === "numeric" ? "p" : "n",
                      i
                    )
                  }
                />
              ) : null}
              {el.type === "numeric" ? (
                <Input
                  error={el.error?.s}
                  placeholder="S"
                  value={el.s}
                  className="n-input"
                  type="number"
                  onChange={(e) => handleColumnChange(e.target.value, "s", i)}
                />
              ) : null}
              <Input
                type="checkbox"
                placeholder="Primary Key"
                value={el.pk}
                onChange={(e) => handleColumnChange(e.target.checked, "pk", i)}
              />
              <span onClick={() => deleteColumn(i)}>
                <AiFillCloseCircle />
              </span>
            </div>
          ) : null
        )}

        <div className="add-column">
          <span onClick={addColumn}>
            <AiFillPlusCircle />
          </span>
        </div>
        <div className="modal-btn-container">
          <button type="submit" className="round-btn">
            Confirm
          </button>
          <div className="round-btn" onClick={closeFunction}>
            Cancel
          </div>
        </div>
      </form>
    </Modal>
  );
}
