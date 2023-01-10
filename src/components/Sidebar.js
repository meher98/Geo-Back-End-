import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useHref } from "react-router-dom";
import { BiTable } from "react-icons/bi";
import { HiOutlineBars3 } from "react-icons/hi2";
import "../styles/sidebar.scss";
import logo from "../images/logo.png";
import StructureModal from "./StructureModal";
import { client } from "../utils/functions";
import { appContext } from "../utils/consts";
import ErrorModal from "./ErrorModal";
import { AiFillCode } from "react-icons/ai";
import { FaPlusCircle } from "react-icons/fa";

export default function Sidebar(props) {
  const href = useHref();
  const [allTables, setAllTables] = useState([]);
  const [open, setOpen] = useState(true);
  const [show, setShow] = useState(false);
  const { refreshSide, setError } = useContext(appContext);
  const navigate = useNavigate();
  const handleSidebar = () => {
    setOpen(!open);
  };
  const closeModal = () => {
    setShow(false);
  };
  const openModal = () => {
    setShow(true);
  };

  useEffect(() => {
    client
      .get("/all_tables")
      .then((res) => {
        setAllTables(res.data);
      })
      .catch((error) => {
        setError(error.response.data);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshSide]);

  return (
    <>
      <div className="sidebar-global-container">
        <div className={`sidebar-container scroll ${open ? "open" : ""}`}>
          <div className="sidebar-logo">
            <img src={logo} alt="logo" />
          </div>
          <div className="sidebar-body">
            <div className="round-btn" onClick={openModal}>
              <FaPlusCircle />
              <p>Add table</p>
            </div>
            <div
              className={`sidebar-item ${href === "/" ? "active" : ""}`}
              onClick={() => navigate("/")}
            >
              <AiFillCode />
              <p className="gradient-text">Your request</p>
            </div>
            {allTables.map((e, i) => (
              <div
                key={"t" + i}
                className={`sidebar-item ${
                  href === "/table/" + e.table_name ? "active" : ""
                }`}
                onClick={() => navigate("/table/" + e.table_name)}
              >
                <BiTable />
                <p className="gradient-text">{e.table_name}</p>
              </div>
            ))}
          </div>
        </div>
        <div
          onClick={handleSidebar}
          className={`sidebar-filter ${open ? "open" : ""}`}
        ></div>
        <div className={`sidebar-page-container ${open ? "open" : ""}`}>
          <div
            onClick={handleSidebar}
            className={`open-close-btn ${open ? "open" : ""}`}
          >
            <HiOutlineBars3 />
          </div>
          {props.children}
        </div>
      </div>
      <StructureModal closeFunction={closeModal} show={show}></StructureModal>
      <ErrorModal />
    </>
  );
}
