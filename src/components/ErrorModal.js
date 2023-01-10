import React, { useContext } from "react";
import { appContext } from "../utils/consts";
import Modal from "./Modal";
import "../styles/errorModal.scss";
import { HiExclamationTriangle } from "react-icons/hi2";

export default function ErrorModal() {
  const { error, setError } = useContext(appContext);
  const closeFunction = () => setError("");
  return (
    <div className="errorModal-container">
      <Modal closeFunction={closeFunction} show={error.length > 0}>
        <div>
          <h1>Error</h1>
          <span>
            <HiExclamationTriangle />
          </span>

          <h3>{error}</h3>

          <div onClick={closeFunction} className="round-btn">
            Ok
          </div>
        </div>
      </Modal>
    </div>
  );
}
