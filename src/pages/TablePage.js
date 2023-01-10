import React, { useContext, useEffect, useRef, useState } from "react";
import {
  BsFileArrowDownFill,
  BsFileArrowUpFill,
  BsFillPencilFill,
} from "react-icons/bs";
import { FaPlus, FaTrash } from "react-icons/fa";
import { useParams } from "react-router-dom";
import Card from "../components/Card";
import Input from "../components/Input";
import Modal from "../components/Modal";
import Table from "../components/Table";
import "../styles/jour.scss";
import { client, objectsToCSV } from "../utils/functions";
import StructureModal from "../components/StructureModal";
import ConfirmModal from "../components/ConfirmModal";
import { useNavigate } from "react-router-dom";
import { appContext } from "../utils/consts";

export default function TablePage() {
  const navigate = useNavigate();
  const { refreshSide, setRefreshSide, setError } = useContext(appContext);
  const [show, setShow] = useState([false, false, false, false, false]);
  const [headers, setHeaders] = useState([]);
  const [struc, setStruc] = useState([]);
  const [confirmFunction, setConirmFunction] = useState("");
  const [confirmText, setConfirmText] = useState("");
  const [content, setContent] = useState([]);
  const [line, setLine] = useState({});
  const [refresh, setRefresh] = useState(false);
  const [modalRole, setModalRole] = useState(false);
  const [index, setIndex] = useState();
  const fileInput = useRef();
  const { tab } = useParams();
  useEffect(() => {
    getTabContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, refresh]);
  const createURIDownload = () => {
    const a = document.createElement("a");
    a.setAttribute(
      "href",
      "data:text/csv; encoding:utf-8," +
        encodeURIComponent(
          objectsToCSV(
            content.map((e) => {
              let x = e;
              delete x.Actions;
              return x;
            })
          )
        )
    );
    a.setAttribute("download", `${tab}.csv`);
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const initiateLine = () => {
    let x = {};
    for (let key of headers) {
      if (key !== "Actions") {
        x[key] = "";
      }
    }
    setLine(x);
  };
  const getTabContent = () => {
    client
      .get("get_tab/" + tab)
      .then((res) => {
        setContent(addActionsToData(res.data.data));
        let data = res.data.struc.map((e) => {
          let x = {
            column: e.column_name,
            type: e.udt_name,
            pk: e.constraint_name !== null,
          };
          if (["varbit", "char", "varchar"].includes(e.udt_name)) {
            x.n = e.character_maximum_length;
          } else if (e.udt_name === "numeric") {
            x.p = e.numeric_precision;
            x.s = e.numeric_scale;
          }
          return x;
        });
        setStruc([...data]);

        setHeaders([...res.data.struc.map((e) => e.column_name), "Actions"]);
      })
      .catch((error) => {
        setError(error.response.data);
      });
  };

  const deleteTab = () => {
    client
      .post("delete_table/", { tab: tab })
      .then((res) => {
        generalModalClose(4);
        navigate("/");
        let x = refreshSide;
        setRefreshSide(!x);
      })
      .catch((error) => {
        setError(error.response.data);
      });
  };
  const confirmDeleteTable = () => {
    setConfirmText("Do you really want to delete this table");
    setConirmFunction("tab");
    generalModalOpen(4);
  };
  const confirmDeleteLine = (i) => {
    setConfirmText("Do you really want to delete this line");
    setConirmFunction("line");
    setIndex(i);
    generalModalOpen(4);
  };
  const addActionsToData = (data) => {
    let X = [];
    for (let i = 0; i < data.length; i++) {
      let x = { ...data[i] };
      x["Actions"] = (
        <div className="actions-container">
          <span onClick={() => generalModalOpen(1, data[i], i)}>
            <BsFillPencilFill />
          </span>
          <span onClick={() => confirmDeleteLine(i)}>
            <FaTrash />
          </span>
        </div>
      );
      X.push(x);
    }
    return X;
  };
  const addFunction = (e) => {
    e.preventDefault();
    client
      .post("insert/", { tab: tab, data: line })
      .then((res) => {
        generalModalClose(0);
        setRefresh(!refresh);
      })
      .catch((error) => {
        setError(error.response.data);
      });
  };

  const updateFunction = (e) => {
    e.preventDefault();
    // eslint-disable-next-line array-callback-return
    let condition = struc
      .map((e) => (e.pk ? e.column : null))
      .filter((e) => e !== null);
    let y = {};
    for (let key in content[index]) {
      if (key !== "Actions") {
        y[key] = content[index][key];
      }
    }
    client
      .patch("update/", {
        tab: tab,
        newL: line,
        oldL: y,
        condition:
          condition.length > 0
            ? condition
            : headers.filter((el) => el !== "Actions"),
      })
      .then((res) => {
        generalModalClose(0);
        setRefresh(!refresh);
      })
      .catch((error) => {
        setError(error.response.data);
      });
  };

  const deleteFunction = () => {
    let condition = struc
      .map((e) => (e.pk ? e.column : null))
      .filter((e) => e !== null);
    let y = {};
    for (let key in content[index]) {
      if (key !== "Actions") {
        y[key] = content[index][key];
      }
    }
    client
      .post("delete/", {
        tab: tab,
        oldL: y,
        condition:
          condition.length > 0
            ? condition
            : headers.filter((el) => el !== "Actions"),
      })
      .then((res) => {
        generalModalClose(4);
        setRefresh(!refresh);
      })
      .catch((error) => {
        setError(error.response.data);
      });
  };

  const uploadFile = () => {
    const onUploadProgress = (event) => {
      const percentage = Math.round((100 * event.loaded) / event.total);
      console.log(percentage);
    };
    if (fileInput.current.files[0]) {
      let formData = new FormData();
      formData.append("file", fileInput.current.files[0]);
      formData.append("tab", tab);
      client
        .post("copy_file", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress,
        })
        .then((res) => {
          setRefresh(!refresh);
        })
        .catch((error) => {
          setError(error.response.data);
        });
    }
  };

  const handleLineChange = (val, key) => {
    var x = line;
    x[key] = val;
    setLine({ ...x });
  };
  const generalModalClose = (i) => {
    let x = show;
    x[i] = false;
    setShow([...x]);
  };
  const generalModalOpen = (i, el, j) => {
    let x = [false, false, false, false, false];
    x[i] = true;
    if (i === 0) {
      initiateLine();
      setModalRole(true);
    }
    if (i === 1) {
      let y = {};
      for (let key in content[j]) {
        if (key !== "Actions") {
          y[key] = content[j][key];
        }
      }
      setLine(el);
      setIndex(j);
      setModalRole(false);
      x[0] = true;
    }
    setShow([...x]);
  };

  return (
    <div className="jour-container">
      <div className="Add-button-container">
        <input
          type="file"
          ref={fileInput}
          accept=".csv"
          onChange={uploadFile}
        />
        <div
          title="Export as csv"
          className="circle-btn"
          onClick={() => createURIDownload()}
        >
          <BsFileArrowDownFill />
        </div>
        <div
          title="Import csv"
          className="circle-btn"
          onClick={() => fileInput.current.click()}
        >
          <BsFileArrowUpFill />
        </div>
        <div
          title="Insert new values"
          className="circle-btn"
          onClick={() => generalModalOpen(0)}
        >
          <FaPlus />
        </div>
        <div
          title="Alter table"
          className="circle-btn"
          onClick={() => generalModalOpen(2)}
        >
          <BsFillPencilFill />
        </div>
        <div
          title="Delete table"
          className="circle-btn"
          onClick={() => confirmDeleteTable()}
        >
          <FaTrash />
        </div>
      </div>
      <Card>
        <Table headers={headers} content={content} />
      </Card>

      <Modal show={show[0]} closeFunction={() => generalModalClose(0)}>
        <div className="depense-modal">
          <h1>{modalRole ? "Add" : "Update"} line</h1>
          <form onSubmit={modalRole ? addFunction : updateFunction}>
            {Object.keys(line).map((key) => (
              <Input
                type="text"
                onChange={(e) => handleLineChange(e.target.value, key)}
                value={line[key]}
                placeholder={key}
              />
            ))}

            <div className="modal-btn-container">
              <button className="round-btn">Confirm </button>
              <div onClick={() => generalModalClose(0)} className="round-btn">
                Cancel
              </div>
            </div>
          </form>
        </div>
      </Modal>
      <StructureModal
        show={show[2]}
        closeFunction={() => generalModalClose(2)}
        table={struc}
        name={tab}
        refresh={refresh}
        setRefresh={setRefresh}
      />

      <ConfirmModal
        show={show[4]}
        closeFunction={() => generalModalClose(4)}
        text={confirmText}
        confirmFunction={confirmFunction === "tab" ? deleteTab : deleteFunction}
      />
    </div>
  );
}
