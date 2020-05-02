import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import WarningIcon from '@material-ui/icons/Warning';

function BasicTable(props) {
 
  const {columns, rows} = props;
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return (
    <div className="table-responsive-material">
      <Table>
        <TableHead>
          <TableRow>
          {
            columns.map((column, index) =>  <TableCell key={index}>{column}</TableCell>)
          }
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(item => {
            return (
              <TableRow key={item.id}>
                <TableCell>{item.amount_paid}€</TableCell>
                <TableCell align="center">{new Date(item.created * 1000).toLocaleDateString('fr-FR', options)}</TableCell>
                <TableCell align="center">{item.status === "paid" ? <CheckCircleIcon color="primary" /> : <WarningIcon color="secondary" />}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}


export default BasicTable;