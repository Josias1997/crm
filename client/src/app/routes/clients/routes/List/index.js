import React from 'react';
import ContainerHeader from 'components/ContainerHeader/index';
import IntlMessages from 'util/IntlMessages';
import DataTable from '../../../../../components/DataTable/DataTable';
import Button from '@material-ui/core/Button';

class List extends React.Component {

  handleClick = () => {
    this.props.history.push("/app/clients/add");
  }

  render() {
    const columnData = [
      {id: "email", align: true, disablePadding: false, label: "Email"},
      {id: "societe", align: false, disablePadding: true, label: "Societe"},
      {id: "date_reglement", align: true, disablePadding: false, label: "Date Règlement"},
      {id: "periodicite", align: true, disablePadding: false, label: "Périodicité"},
      {id: "montant", align: true, disablePadding: false, label: "Montant"},
      {id: "mode_de_reglement", align: true, disablePadding: false, label: "Mode de Règlement"},
      {id: "statut_reglement", align: true, disablePadding: false, label: "Statut Règlement"},
      {id: "statut_client", align: true, disablePadding: false, label: "Statut Client"},
      {id: "action", align: true, disablePadding: false, label: "Actions"}
    ];
    return (
      <div className="app-wrapper">
        <ContainerHeader match={this.props.match} title={<IntlMessages id="pages.clients"/>}/>
        <Button variant="contained" color="primary" className="jr-btn jr-btn-label" onClick={this.handleClick}>
          <i className="zmdi zmdi-plus zmdi-hc-fw "/>
          <span>Ajouter</span>
        </Button>
        <DataTable 
          history={this.props.history} 
          columnData={columnData} 
          name={"clients"} 
          title={"Clients"}/>
      </div>
    );
  }
}

export default List;