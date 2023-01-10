import React, { useCallback, useState } from "react";
import Card from "../components/Card";
import CodeMirror from "@uiw/react-codemirror";
import { PostgreSQL } from "@codemirror/lang-sql";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import "../styles/req.scss";
import { client } from "../utils/functions";
import Table from "../components/Table";

export default function Req() {
  const [request, setRequest] = useState("");
  const [result, setResult] = useState();
  const [error, setError] = useState(false);
  const onChange = useCallback((value) => {
    setRequest(value);
  }, []);

  const sendFunction = () => {
    client
      .post("custom_req/", { request: request })
      .then((res) => {
        setResult(res.data);
        setError(false);
      })
      .catch((error) => {
        setResult(error.response.data);
        setError(true);
      });
  };
  const handleResult = () => {
    if (Array.isArray(result)) {
      if (result.length > 0) {
        return <Table headers={Object.keys(result[0])} content={result} />;
      } else {
        return <h3>No data found</h3>;
      }
    } else {
      return <h3 className={error ? "error-req" : ""}>{result}</h3>;
    }
  };
  return (
    <Card>
      <div className="req-container scroll">
        <CodeMirror
          value={request}
          minHeight="350px"
          extensions={[PostgreSQL]}
          theme={vscodeDark}
          onChange={onChange}
        />
      </div>
      <div className="result-container">
        <div className="round-btn" onClick={sendFunction}>
          Send Request
        </div>
        {handleResult()}
      </div>
    </Card>
  );
}
