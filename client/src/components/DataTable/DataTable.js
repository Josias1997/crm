import React, {useState, useEffect} from "react";
import PropTypes from "prop-types";
import keycode from "keycode";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableFooter from "@material-ui/core/TableFooter";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import CircularProgress from '@material-ui/core/CircularProgress';
import Tooltip from "@material-ui/core/Tooltip";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import ClearIcon from "@material-ui/icons/Clear";
import WarningIcon from "@material-ui/icons/Warning";
import axios from './../../util/instanceAxios';
import {Badge} from 'reactstrap';
import DataTableHead from './DataTableHead';
import DataTableToolbar from './DataTableToolbar';




const DataTable = (props) => {
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("calories");
  const [selected, setSelected] = useState([]);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [itemDeleted, setItemDeleted] = useState(true);
  
  useEffect(() => {
        // Fetch clients
        if(itemDeleted) {
          setLoading(true);
          axios.get(`/api/${props.name}/`)
          .then(({data}) => {
            if (props.name === 'clients') {
              setData(JSON.parse(data[props.name]));
            } else if(props.name === 'products') {
              setData(data);
            }
            setLoading(false);
          }).catch(error => {
            console.log(error);
            setLoading(false);
          })
          setItemDeleted(false);
        }
    }, [itemDeleted])
  const handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = "desc";

    if (orderBy === property && order === "desc") {
      order = "asc";
    }

    const items =
      order === "desc"
        ? data.sort((a, b) => (b[orderBy] < a[orderBy] ? -1 : 1))
        : data.sort((a, b) => (a[orderBy] < b[orderBy] ? -1 : 1));

    setData(items);
    setOrder(order);
    setOrderBy(orderBy);
  };

  const handleSelectAllClick = (event, checked) => {
    if (checked) {
      setSelected(data.map(n => n.pk));
      return;
    }
    setSelected([]);
  };

  const handleKeyDown = (event, id) => {
    if (keycode(event) === "space") {
      handleClick(event, id);
    }
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, page) => {
    setPage(page);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(event.target.value);
  };

  const handleDelete = (id, name) => {
    setLoading(true);
    axios.delete(`/api/${name}/delete/${id}`)
    .then(({data}) => {
      setLoading(false);
      setItemDeleted(true);
    }).catch(error => {
      setError(error.message);
      setLoading(false);
    })
  }

  let isSelected = id => selected.indexOf(id) !== -1;

  const periodicites = {
    H: 'HEBDOMADAIRE',
    M: 'MENSUEL',
    T: 'TRIMESTRIEL',
    S: 'SEMESTRIEL',
    A: 'ANNUEL'
  };
  const modeDeReglements = {
    P: 'Prélèvement'
  };
  const statutsClient = {
    A: 'Actif',
    D: 'Désactivé'
  };
  // const statutsPaiement = {
  //   R: 'A Jour',
  //   N: 'Non A Jour'
  // }
  return (
    <Paper>
      <DataTableToolbar numSelected={selected.length} title={props.title}/>
      {
        loading ? <div className="d-flex justify-content-center"> 
          <CircularProgress size={50} /> 
        </div>:
      <div className="flex-auto">
        <div className="table-responsive-material">
          <Table className="">
            <DataTableHead
              columnData={props.columnData}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={data.length}
            />
            <TableBody>
              {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(n => {
                const isSelect = isSelected(n.pk);
                return (
                 props.name === 'clients' ? 
                  <TableRow
                    hover
                    onClick={event => handleClick(event, n.pk)}
                    onKeyDown={event => handleKeyDown(event, n.pk)}
                    role="checkbox"
                    aria-checked={isSelect}
                    tabIndex={-1}
                    key={n.pk}
                    selected={isSelect}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox color="primary" checked={isSelect}/>
                    </TableCell>
                    <TableCell padding="none">{n.fields.societe}</TableCell>
                    <TableCell align="left">{n.fields.email}</TableCell>
                    <TableCell align="left">{n.fields.date_reglement}</TableCell>
                    <TableCell align="left">{periodicites[n.fields.periodicite]}</TableCell>
                    <TableCell align="left">
                      <Badge color="success">
                       {n.fields.montant}
                      </Badge>
                    </TableCell>
                    <TableCell align="left">
                      <Badge color="info">
                        {modeDeReglements[n.fields.mode_de_reglement]}
                      </Badge>
                    </TableCell>
                    <TableCell align="left">
                      {n.fields.statut === "R" ? <CheckCircleIcon color="primary" /> : <WarningIcon color="secondary" />}
                    </TableCell>
                    <TableCell align="left">
                      {n.fields.statut_client === "A" ? <CheckCircleIcon color="primary" /> : <ClearIcon color="secondary" />}
                    </TableCell>
                    <TableCell align="left">
                      <IconButton color="primary" onClick={() => props.history.push(`/app/clients/edit/${n.pk}`)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton color="secondary" onClick={() => handleDelete(n.pk, 'client')}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow> : <TableRow
                    hover
                    onClick={event => handleClick(event, n.id)}
                    onKeyDown={event => handleKeyDown(event, n.id)}
                    role="checkbox"
                    aria-checked={isSelect}
                    tabIndex={-1}
                    key={n.id}
                    selected={isSelect}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox color="primary" checked={isSelect}/>
                    </TableCell>
                    <TableCell padding="none">{n.name}</TableCell>
                    <TableCell align="left">{n.type}</TableCell>
                    <TableCell align="left">{n.description}</TableCell>
                    <TableCell align="left">
                      <IconButton color="primary" onClick={() => props.history.push(`/app/products/edit/${n.id}`)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton color="secondary" onClick={() => handleDelete(n.id, 'product')}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  count={data.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onChangePage={handleChangePage}
                  onChangeRowsPerPage={handleChangeRowsPerPage}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </div>
      }
    </Paper>
  );
};

export default DataTable;
