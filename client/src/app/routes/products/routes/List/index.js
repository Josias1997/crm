import React from 'react';
import ContainerHeader from 'components/ContainerHeader/index';
import DataTable from '../../../../../components/DataTable/DataTable';
import Button from '@material-ui/core/Button';

class List extends React.Component {

  handleClick = () => {
    this.props.history.push("/app/products/add");
  }

  render() {
    const columnData = [
      {id: "name", align: true, disablePadding: false, label: "Nom"},
      {id: "type", align: false, disablePadding: true, label: "Type"},
      {id: "description", align: true, disablePadding: false, label: "Descritpion"},
      {id: "action", align: true, disablePadding: false, label: "Actions"}
    ];
    return (
      <div className="app-wrapper">
        <ContainerHeader match={this.props.match} title={"Produits"}/>
        <Button variant="contained" color="primary" className="jr-btn jr-btn-label" onClick={this.handleClick}>
          <i className="zmdi zmdi-plus zmdi-hc-fw "/>
          <span>Ajouter</span>
        </Button>
        <DataTable history={this.props.history} columnData={columnData} name={"products"} title={"Products"} />
      </div>
    );
  }
}

export default List;