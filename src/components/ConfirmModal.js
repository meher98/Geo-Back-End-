import React from "react";
import { HiExclamationCircle } from "react-icons/hi2";
import Modal from "./Modal";
import "../styles/confirmModal.scss";
export default function ConfirmModal({
  show,
  closeFunction,
  text,
  confirmFunction,
}) {
  return (
    <Modal show={show} closeFunction={closeFunction}>
      <div className="confirmModal-container">
        <h1>{text}</h1>
        <span>
          <HiExclamationCircle />
        </span>
        <div className="modal-btn-container">
          <button className="round-btn" onClick={confirmFunction}>
            Confirm
          </button>
          <div onClick={closeFunction} className="round-btn">
            Cancel
          </div>
        </div>
      </div>
    </Modal>
  );
}
