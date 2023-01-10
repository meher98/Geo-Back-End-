import { useFormik } from "formik";
import { evaluate } from "mathjs";
import React, { useEffect, useState } from "react";
import { BsFillPencilFill, BsPlus } from "react-icons/bs";
import Card from "../components/Card";
import Table from "../components/Table";
import * as yup from "yup";
import Input from "../components/Input";
import Modal from "../components/Modal";
import { timeToDate, dateDiffrence, dateToTime } from "../utils/functions";
import { FaTrash } from "react-icons/fa";

export default function Budgetisation() {
  const [content, setContent] = useState([]);
  const [show, setShow] = useState([false, false]);
  const [maxD, setMaxD] = useState("01/01/2000");
  useEffect(() => {
    setMaxD(timeToDate(Math.max(...content.map((o) => dateToTime(o.dateF)))));
  }, [content]);

  const addToContent = (el) => {
    let x = content;
    x.push(el);
    setContent([...x]);
  };
  const depenseSchema = yup.object({
    budget: yup.string().required("Ce champ est obligatoire"),
    commentaire: yup.string().max(20, "Commentaire trop long"),
    dateD: yup.string().required("Ce champ est obligatoire"),
    dateF: yup.string().required("Ce champ est obligatoire"),
  });
  const addFormik = useFormik({
    initialValues: {
      budget: "",
      dateD: "",
      dateF: "",
    },
    validateOnChange: false,
    validationSchema: depenseSchema,
    validate: (values) => {
      const errors = {};
      try {
        addFormik.setFieldValue("budget", evaluate(values.budget).toString());
      } catch (error) {
        try {
          addFormik.setFieldValue(
            "budget",
            evaluate(
              values.budget.substring(1, values.budget.length)
            ).toString()
          );
        } catch (error) {
          errors.budget = "Veillez saisir un nombre ou une equation valide";
        }
      }
      if (dateDiffrence(values.dateD, values.dateF) < 0) {
        errors.dateF = "La date de fin doit être après la date de début";
      }
      if (dateDiffrence(maxD, values.dateD) < 0) {
        errors.dateD = "La date de fin doit être ultérieur à " + maxD;
      }
      return errors;
    },
    onSubmit: (values) => {
      let v = values;
      v.jours = dateDiffrence(values.dateD, values.dateF);
      v["modifier"] = (
        <div className="actions-container">
          <span
            onClick={() =>
              generalModalOpen(1, {
                budget: v.budget,
                dateD: v.dateD,
                dateF: v.dateF,
              })
            }
          >
            <BsFillPencilFill />
          </span>
          <span>
            <FaTrash />
          </span>
        </div>
      );
      addToContent(v);
      generalModalClose(0);
    },
  });
  const editFormik = useFormik({
    initialValues: {
      budget: "",
      dateD: "",
      dateF: "",
    },
    validateOnChange: false,
    validationSchema: depenseSchema,
    validate: (values) => {
      const errors = {};
      try {
        editFormik.setFieldValue("budget", evaluate(values.budget).toString());
      } catch (error) {
        try {
          editFormik.setFieldValue(
            "budget",
            evaluate(
              values.budget.substring(1, values.budget.length)
            ).toString()
          );
        } catch (error) {
          errors.budget = "Veillez saisir un nombre ou une equation valide";
        }
      }
      if (dateDiffrence(values.dateD, values.dateF) < 0) {
        errors.dateF = "La date de fin doit être après la date de début";
      }
      if (dateDiffrence(maxD, values.dateD) < 0) {
        errors.dateD = "La date de fin doit être ultérieur à " + maxD;
      }
      return errors;
    },
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
      generalModalClose(1);
    },
  });
  const generalModalClose = (i) => {
    const formik = [addFormik, editFormik];
    let x = show;
    x[i] = false;
    setShow([...x]);
    formik[i].resetForm();
  };
  const generalModalOpen = (i, obj) => {
    const formik = [addFormik, editFormik];
    let x = [false, false];
    x[i] = true;
    if (obj) {
      for (let el of Object.keys(obj)) {
        formik[i].setFieldValue(el, obj[el]);
      }
    }
    setShow([...x]);
  };
  return (
    <div className="jour-container">
      <div className="Add-button-container">
        <div className="circle-btn" onClick={() => generalModalOpen(0)}>
          <BsPlus />
        </div>
      </div>
      <Card>
        <Table
          headers={["Budget", "Début", "Fin", "Jours", "Modifier"]}
          content={content}
          mobile={["Jours"]}
        />
      </Card>
      <Modal show={show[0]} closeFunction={() => generalModalClose(0)}>
        <div className="depense-modal">
          <h1>Tu as encore depensé !</h1>
          <form onSubmit={addFormik.handleSubmit}>
            <Input
              type="number"
              onChange={addFormik.handleChange}
              value={addFormik.values.budget}
              id="budget"
              placeholder="budget"
              error={addFormik.errors?.budget}
            />
            <Input
              type="mois"
              onChange={(e) => addFormik.setFieldValue("dateD", e)}
              value={addFormik.values.dateD}
              id="dateD"
              placeholder="Date de début"
              error={addFormik.errors?.dateD}
              allowChangeMonth
            />
            <Input
              type="mois"
              onChange={(e) => addFormik.setFieldValue("dateF", e)}
              value={addFormik.values.dateF}
              id="dateF"
              placeholder="Date de fin"
              error={addFormik.errors?.dateF}
              allowChangeMonth
            />
            <div className="modal-btn-container">
              <button className="round-btn">Confirm </button>
              <div onClick={() => generalModalClose(0)} className="round-btn">
                Cancel
              </div>
            </div>
          </form>
        </div>
      </Modal>
      <Modal show={show[1]} closeFunction={() => generalModalClose(1)}>
        <div className="depense-modal">
          <h1>Tu as encore depensé !</h1>
          <form onSubmit={editFormik.handleSubmit}>
            <Input
              type="number"
              onChange={editFormik.handleChange}
              value={editFormik.values.budget}
              id="budget"
              placeholder="budget"
              error={editFormik.errors?.budget}
            />
            <Input
              type="mois"
              onChange={(e) => editFormik.setFieldValue("dateD", e)}
              value={editFormik.values.dateD}
              id="dateD"
              placeholder="Date de début"
              error={editFormik.errors?.dateD}
              allowChangeMonth
            />
            <Input
              type="mois"
              onChange={(e) => editFormik.setFieldValue("dateF", e)}
              value={editFormik.values.dateF}
              id="dateF"
              placeholder="Date de fin"
              error={editFormik.errors?.dateF}
              allowChangeMonth
            />
            <div className="modal-btn-container">
              <button className="round-btn">Confirm </button>
              <div onClick={() => generalModalClose(1)} className="round-btn">
                Cancel
              </div>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
