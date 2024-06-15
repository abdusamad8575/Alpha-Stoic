import DataTable from "../../components/contact/DataTable";
import "./users.scss";
import { GridColDef } from "@mui/x-data-grid";
// import { useEffect, useState } from "react";
// import axios from "axios";

const Contact = () => {
  

  const columns: GridColDef[] = [
    { field: "_id", headerName: "ID", width: 90 },
    { field: "name", type: "string", headerName: "Name", width: 150 },
    { field: "email", type: "string", headerName: "Email", width: 200 },
    { field: "contactNumber", type: "string", headerName: "Phone", width: 150 },
    { field: "verified", headerName: "Verified", width: 150, type: "boolean" },
  ];

  return (
    <div className="users">
      <div className="info">
        <h1>Contact</h1>
      </div>
      <DataTable columns={columns} />
    </div>
  );
};

export default Contact;
