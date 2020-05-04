import React, {useState, useEffect} from "react";
import { NavLink, Switch, Route, Redirect } from "react-router-dom";
import "./ClientProfile.css";
import Edit from './../components/Client/Edit';
import axios from './../util/instanceAxios';
import Payment from './Payment';


const ClientProfile = (props) => {
  const [error, setError] = useState("");
  const [societe, setSociete] = useState("");
  const [dateProchainReglement, setDateProchainReglement] = useState('');
  const { id, action } = props.match.params;

  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

  useEffect(() => {
    if(!localStorage.getItem('user')) {
      props.history.push(`/account/login/${id}`);
    }
    else {
      axios.get(`/api/client/get/${id}`)
      .then(({data}) => {
        setSociete(data.client.societe);
        setDateProchainReglement(new Date(data.client.date_reglement).toLocaleDateString('fr-FR', options));
      }).catch(error => {
        setError(error);
      })
    }
  }, [])

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('expirationDate');
    props.history.push(`/account/login/${id}`);
  }

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-lg-4 pb-5">
          <div className="author-card pb-3">
            <div
              className="author-card-cover"
              style={{
                backgroundImage:
                  "url(https://demo.createx.studio/createx-html/img/widgets/author/cover.jpg)",
              }}
            >
            </div>
            <div className="author-card-profile">
              <div className="author-card-avatar">
                <img
                  src="https://bootdey.com/img/Content/avatar/avatar1.png"
                  alt="Daniel Adams"
                />
              </div>
              <div className="author-card-details">
                <h5 className="author-card-name text-lg">{societe}</h5>
                <span className="author-card-position">
                  Prochain Paiement: {dateProchainReglement}
                </span>
              </div>
            </div>
          </div>
          <div className="wizard">
            <nav className="list-group list-group-flush">
              <NavLink className="list-group-item" activeClassName="active" to={`/account/profile/${id}/edit`}>
                <i className="fe-icon-user text-muted"></i>Paramètres Profile
              </NavLink>
              <NavLink className="list-group-item" activeClassName="active" to={`/account/profile/${id}/set-up-payment`}>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <i className="fe-icon-heart mr-1 text-muted"></i>
                    <div className="d-inline-block font-weight-medium text-uppercase">
                      Mode de paiement
                    </div>
                  </div>
                </div>
              </NavLink>
              <span className="list-group-item" onClick={logout} style={{
                cursor: 'pointer'
              }}>
                <i className="fe-icon-user text-muted"></i>Déconnexion
              </span>
            </nav>
          </div>
        </div>
        <Switch>
          <Redirect exact from={`${props.match.url}/`} to={`${props.match.url}/edit`}/>
          <Route path={`${props.match.url}/edit`} component={() => <Edit id={id} />} />
          <Route path={`${props.match.url}/set-up-payment`} component={() => <Payment id={id} />} />
        </Switch>
      </div>
    </div>
  );
};

export default ClientProfile;
