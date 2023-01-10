import React from "react";
import Card from "./Card";
import "../styles/modal.scss";
import { BsFillXCircleFill } from "react-icons/bs";

export default function Modal({ show, closeFunction, children }) {
  return (
    <>
      <div
        onClick={closeFunction ? closeFunction : null}
        className={`modal-filter ${show ? "open" : ""}`}
      ></div>
      <div className={`modal-container ${show ? "open" : ""}`}>
        <Card>
          <div className="modal-content-container">
            <div
              onClick={closeFunction ? closeFunction : null}
              className="modal-close-btn"
            >
              <BsFillXCircleFill />
            </div>
            {children}
          </div>
        </Card>
      </div>
    </>
  );
}
