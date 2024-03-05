import React, { useMemo, useState } from "react";
import { useTable } from "react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Button,
} from "@mui/material";
import TablePagination from "@mui/material/TablePagination";
import { useNavigate } from "react-router-dom";
import "./DataTable.css";

export const DataTable = ({ data }) => {
  const navigate = useNavigate();
  const columns = useMemo(
    () => [
      {
        Header: "Project Name",
        accessor: "name",
      },
      {
        Header: "Description",
        accessor: "description",
      },
      {
        Header: "Assigned To",
        accessor: "assigned_to",
      },
      {
        Header: "Start date",
        accessor: "start_date",
      },
      {
        Header: "End Date",
        accessor: "end_date",
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;

  return (
    <>
      <h1 style={{ color: "#565656", marginTop: "30px", marginLeft: "14vh" }}>
        Projects
      </h1>

      <TableContainer className="table-container">
        <Table {...getTableProps()} size="medium" className="table">
          <TableHead>
            {headerGroups.map((headerGroup) => (
              <TableRow {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <TableCell
                    {...column.getHeaderProps()}
                    style={{
                      backgroundColor: "rgb(115,115,115)",
                      color: "white",
                      fontWeight: "bold",
                    }}
                  >
                    {column.render("Header")}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody {...getTableBodyProps()}>
            {rows.slice(startIndex, endIndex).map((row, index) => {
              prepareRow(row);
              return (
                <TableRow
                  {...row.getRowProps()}
                  onClick={() => {
                    if (!row.cells[0].getCellProps().disabled) {
                      navigate(`${row.original.id}/policy-list`);
                    }
                  }}
                  style={{ cursor: "pointer" }}
                  key={index}
                >
                  {row.cells.map((cell) => (
                    <TableCell {...cell.getCellProps()} key={cell.column.id}>
                      {cell.render("Cell")}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[3, 5, 7]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </>
    // <div className="table-container">
    //   <table {...getTableProps()} className="custom-table">
    //     <thead>
    //       {headerGroups.map((headerGroup) => (
    //         <tr {...headerGroup.getHeaderGroupProps()}>
    //           {headerGroup.headers.map((column) => (
    //             <th {...column.getHeaderProps()}>{column.render("Header")}</th>
    //           ))}
    //         </tr>
    //       ))}
    //     </thead>
    //     <tbody {...getTableBodyProps()}>
    //       {rows.map((row) => {
    //         prepareRow(row);
    //         return (
    //           <tr {...row.getRowProps()}
    //           onClick={() => navigate(`${row.original.id}/policy-list`)}
    //           >
    //             {row.cells.map((cell) => (
    //               <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
    //             ))}
    //           </tr>
    //         );
    //       })}
    //     </tbody>
    //   </table>
    // </div>
  );
};
