import axios from "axios";

export const client = axios.create({
  baseURL: "http://localhost:1998/",
});
export const objectsToCSV = (arr) => {
  const array = [Object.keys(arr[0])].concat(arr);
  return array
    .map((row) => {
      return Object.values(row)
        .map((value) => {
          return typeof value === "string" ? JSON.stringify(value) : value;
        })
        .toString();
    })
    .join("\n");
};
