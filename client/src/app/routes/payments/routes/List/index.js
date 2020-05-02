import React from 'react';
import ContainerHeader from 'components/ContainerHeader/index';
import ClientPaymentDetails from './../../components/ClientPaymentDetails';
import Button from '@material-ui/core/Button';
import axios from './../../../../../util/instanceAxios';
import CircularProgress from '@material-ui/core/CircularProgress';

class List extends React.Component {
  constructor() {
    super();
    this.state = {
      clients: [],
      loading: false
    }
  }

  handleClick = () => {
    this.props.history.push("/app/clients/add");
  }

  componentDidMount(){
    this.setState({
      loading: true
    })
    axios.get('/api/clients/')
    .then(({data}) => {
      this.setState({
        clients: JSON.parse(data.clients),
        loading: false
      })
    }).catch(error => {
      console.log(error);
      this.setState({
        loading: false
      })
    })
  }

  render() {
    const {loading, clients} = this.state;
    return (
      <div className="app-wrapper">
        <ContainerHeader match={this.props.match} title={"Liste des paiements"}/>
        {
          loading ? <CircularProgress size={50} /> : clients.map(client => <ClientPaymentDetails key={client.pk} id={client.pk} name={client.fields.societe} />)
        }
      </div>
    );
  }
}

export default List;