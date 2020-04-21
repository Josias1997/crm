import React from 'react';
import ContainerHeader from 'components/ContainerHeader/index';
import IntlMessages from 'util/IntlMessages';
import ClientTable from '../../../../../components/dashboard/crm/ClientTable';
import Button from '@material-ui/core/Button';

class List extends React.Component {

  handleClick = () => {
    this.props.history.push("/app/clients/add");
  }

  render() {
    return (
      <div className="app-wrapper">
        <ContainerHeader match={this.props.match} title={<IntlMessages id="pages.clients"/>}/>
        <Button variant="contained" color="primary" className="jr-btn jr-btn-label" onClick={this.handleClick}>
          <i className="zmdi zmdi-plus zmdi-hc-fw "/>
          <span>Ajouter</span>
        </Button>
        <ClientTable history={this.props.history} />
      </div>
    );
  }
}

export default List;