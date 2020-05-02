import React from "react";
import ContainerHeader from "components/ContainerHeader/index";
import IntlMessages from "util/IntlMessages";
import Input from "@material-ui/core/Input";
import CardBox from "components/CardBox/index";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormLabel from "@material-ui/core/FormLabel";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import Button from "@material-ui/core/Button";
import InputAdornment from "@material-ui/core/InputAdornment";
import CircularProgress from "@material-ui/core/CircularProgress";
import axios from "./../../../../../util/instanceAxios";
import { KeyboardDatePicker } from "@material-ui/pickers";
import { Badge } from "reactstrap";

class Edit extends React.Component {
  constructor() {
    super();
    this.state = {
      client: {},
      products: [],
      loading: false,
      error: null,
    };
  }

  componentDidMount() {
    axios
      .get(`/api/client/get/${this.props.match.params.id}`)
      .then(({ data }) => {
        const date = new Date(data.client.date_reglement);
        data.client.date_reglement = this.changeDateFormat(date);
        this.setState({
          client: data.client,
        });
      })
      .catch((error) => {
        console.log(error);
      });
    axios.get('/api/products/')
    .then(({data}) => {
      console.log(data);
      this.setState({
        products: data.products
      })
    }).catch(error => {
      this.setState({
        error: error
      })
    })
  }

  handleChange = (event, name) => {
    const { client } = this.state;
    if (name === "product") {
      client.product_id = event.target.value;
      this.setState(
        {
          client: client,
        },
        () => {
          let product = this.state.products.filter(
            (product) => product.details.id === client.product_id
          )[0];
          let montant = product.plan.amount / 100;
          let periodicite = "H";
          switch (product.plan.interval && product.plan.interval_count) {
            case "week" && 1:
              periodicite = "H";
              break;
            case "month" && 1:
              periodicite = "M";
              break;
            case "month" && 3:
              periodicite = "T";
              break;
            case "month" && 6:
              periodicite = "S";
              break;
            case "year" && 1:
              periodicite = "A";
              break;
          }
          client.montant = montant;
          client.periodicite = periodicite;
          client.plan_id = product.plan.id;

          this.setState({
            client: client,
          });
        }
      );
    } else {
      client[name] = event.target.value;
      this.setState({
        client: client,
      });
    }
  };

  handleSubmit = () => {
    // Axios request
    this.setState({
      loading: true,
    });
    axios
      .put(
        `/api/client/update/${this.props.match.params.id}`,
        this.state.client
      )
      .then(({ data }) => {
        console.log(data.client);
        this.setState({
          loading: false,
        });
        this.props.history.push("/app/clients");
      })
      .catch((error) => {
        this.setState({
          loading: false,
          error: error.message,
        });
      });
  };

  handleDateChange = (date) => {
    const client = {
      ...this.state.client,
    };
    client.date_reglement = this.changeDateFormat(date._d);
    this.setState({
      client: client,
    });
  };
  changeDateFormat = (date) => {
    let month = "" + (date.getMonth() + 1);
    let day = "" + date.getDate();
    let year = "" + date.getFullYear();
    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;
    return [year, month, day].join("-");
  };

  render() {
    const { client, loading } = this.state;
    return (
      <div className="app-wrapper">
        <ContainerHeader
          match={this.props.match}
          title={<IntlMessages id="pages.clients" />}
        />
        {loading ? (
          <div className="d-flex justify-content-center">
            {" "}
            <CircularProgress size={50} />{" "}
          </div>
        ) : (
          <CardBox styleName="col-lg-12">
            <div className="alert alert-danger">
              {this.state.error !== null ? this.state.error : null}
            </div>
            <div className="col-md-12 col-12">
              <div className="col-lg-12 col-sm-12 col-12">
                <Input
                  placeholder="Societe"
                  value={client.societe}
                  className="w-100 mb-3"
                  inputProps={{
                    "aria-label": "Description",
                  }}
                  onChange={(event) => this.handleChange(event, "societe")}
                />
              </div>
              <div className="col-lg-12 col-sm-12 col-12">
                <Input
                  placeholder="Email"
                  value={client.email}
                  className="w-100 mb-3"
                  inputProps={{
                    "aria-label": "Description",
                  }}
                  onChange={(event) => this.handleChange(event, "email")}
                />
              </div>
              <div className="col-lg-12 col-sm-12 col-12">
                <FormControl className="w-100 mb-2">
                  <InputLabel htmlFor="age-simple">Périodicité</InputLabel>
                  <Select
                    value={
                      client.periodicite !== undefined
                        ? client.periodicite
                        : "H"
                    }
                    onChange={(event) =>
                      this.handleChange(event, "periodicite")
                    }
                    input={<Input id="perodicite" />}
                  >
                    <MenuItem value={"H"}>Hebdomadaire</MenuItem>
                    <MenuItem value={"M"}>Mensuel</MenuItem>
                    <MenuItem value={"T"}>Trimestriel</MenuItem>
                    <MenuItem value={"S"}>Semestriel</MenuItem>
                    <MenuItem value={"A"}>Annuel</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="col-lg-12 col-sm-12 col-12">
                <FormControl className="w-100 mb-2">
                  <InputLabel htmlFor="product">Produit</InputLabel>
                  <Select
                    value={client.product_id !== undefined ? client.product_id : ""}
                    onChange={(event) =>
                      this.handleChange(event, "product")
                    }
                    input={<Input id="product" />}
                  >
                  {
                    this.state.products.map(product => <MenuItem value={product.details.id} key={product.details.id}>{product.details.name}</MenuItem>)
                  }
                  </Select>
                </FormControl>
              </div>
              <div className="col-lg-12 col-sm-12 col-12">
                <FormControl className="w-100 mb-2">
                  <InputLabel htmlFor="age-simple">
                    Mode de règlement
                  </InputLabel>
                  <Select
                    value={
                      client.mode_de_reglement !== undefined
                        ? client.mode_de_reglement
                        : "P"
                    }
                    onChange={(event) =>
                      this.handleChange(event, "mode_de_reglement")
                    }
                    input={<Input id="mode_de_reglement" />}
                  >
                    <MenuItem value={"P"}>Prélèvement</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="col-lg-12 col-sm-12 col-12">
                <FormControl component="fieldset" required>
                  <FormLabel component="legend">Statut Paiement</FormLabel>
                  <RadioGroup
                    aria-label="paiement"
                    name="paiement"
                    value={client.statut}
                    onChange={(event) => this.handleChange(event, "statut")}
                  >
                    <FormControlLabel
                      value="R"
                      control={
                        <Radio
                          color="primary"
                          checked={client.statut === "R" ? true : false}
                        />
                      }
                      label="Règlement à jour"
                    />
                    <FormControlLabel
                      value="N"
                      control={
                        <Radio
                          color="primary"
                          checked={client.statut === "N" ? true : false}
                        />
                      }
                      label="Non à jour"
                    />
                    {/*<FormControlLabel value="disabled" disabled control={<Radio />} label="Disabled" />*/}
                  </RadioGroup>
                </FormControl>
              </div>
              <div className="col-lg-12 col-sm-12 col-12">
                <Input
                  value={client.montant}
                  onChange={(event) => this.handleChange(event, "montant")}
                  className="w-100 mb-3"
                  inputProps={{
                    "aria-label": "Description",
                  }}
                  startAdornment={
                    <InputAdornment position="start">€</InputAdornment>
                  }
                />
              </div>
              <div className="col-lg-12 col-sm-12 col-12">
                <FormControl component="fieldset" required>
                  <FormLabel component="legend">Statut Client</FormLabel>
                  <RadioGroup
                    aria-label="statut-client"
                    name="statut_client"
                    value={client.statut_client}
                    onChange={(event) =>
                      this.handleChange(event, "statut_client")
                    }
                  >
                    <FormControlLabel
                      value="A"
                      control={
                        <Radio
                          color="primary"
                          checked={client.statut_client === "A" ? true : false}
                        />
                      }
                      label="Actif"
                    />
                    <FormControlLabel
                      value="D"
                      control={
                        <Radio
                          color="primary"
                          checked={client.statut_client === "D" ? true : false}
                        />
                      }
                      label="Non Actif"
                    />
                    {/*<FormControlLabel value="disabled" disabled control={<Radio />} label="Disabled" />*/}
                  </RadioGroup>
                </FormControl>
              </div>
              <div className="col-lg-12 col-sm-12 col-12">
                <KeyboardDatePicker
                  margin="normal"
                  id="date-picker-dialog"
                  label="Date règlement"
                  value={client.date_reglement}
                  onChange={this.handleDateChange}
                  KeyboardButtonProps={{
                    "aria-label": "change date",
                  }}
                />
              </div>
              <div className="col-lg-12 col-sm-12 col-12">
                <Input
                  placeholder="Iban"
                  value={client.iban}
                  disabled
                  className="w-100 mb-3"
                  inputProps={{
                    "aria-label": "Iban",
                  }}
                  onChange={(event) => this.handleChange(event, "iban")}
                />
              </div>
              <div className="col-lg-12 col-sm-12 col-12">
                <Input
                  placeholder="Card Info"
                  value={client.card_info}
                  disabled
                  className="w-100 mb-3"
                  inputProps={{
                    "aria-label": "Card",
                  }}
                  onChange={(event) => this.handleChange(event, "card_info")}
                />
              </div>
              <Badge color="dark">
                <a
                  href={client.autorisation_prelevement}
                  style={{
                    color: "white",
                    fontSize: "14px",
                  }}
                >
                  Autorisation de prélèvement.pdf
                </a>
              </Badge>
              <Button
                variant="contained"
                onClick={this.handleSubmit}
                color="primary"
              >
                Valider
              </Button>
            </div>
          </CardBox>
        )}
      </div>
    );
  }
}

export default Edit;
