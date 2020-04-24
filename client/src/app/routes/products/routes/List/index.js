import React from 'react';
import ContainerHeader from 'components/ContainerHeader/index';
import Button from '@material-ui/core/Button';

class List extends React.Component {

  handleClick = () => {
    this.props.history.push("/app/clients/add");
  }

  render() {
    return (
      <div className="app-wrapper">
        <ContainerHeader match={this.props.match} title={"Produits"}/>
        List
      </div>
    );
  }
}

export default List;