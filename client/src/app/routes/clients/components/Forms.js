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
import InputAdornment from '@material-ui/core/InputAdornment';
import CircularProgress from "@material-ui/core/CircularProgress";
import { KeyboardDatePicker } from "@material-ui/pickers";
import axios from "./../../../../../util/instanceAxios";

class Form extends React.Component {
  constructor() {
    super();
  }

  props.onHandleChange = (event, name) => {
    this.setState({
      [name]: event.target.value,
    });
  };

  props.onHandleSubmit = () => {
    console.log(this.state);
    // Axios request
    this.setState({
      loading: true,
    });
    axios
      .post("/api/client/post/", this.state)
      .then(({ data }) => {
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
  props.onHandleDateChange = (date) => {
    let month = "" + (date._d.getMonth() + 1);
    let day = "" + date._d.getDate();
    let year = "" + date._d.getFullYear();
    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;
    this.setState({
      date_reglement: [year, month, day].join("-"),
    });
  };

  render() {
    const data = this.props;
    return (
          <CardBox styleName="col-lg-12">
            <div className="col-md-12 col-12">
              <div className="col-lg-12 col-sm-12 col-12">
                <Input
                  placeholder="Societe"
                  className="w-100 mb-3"
                  inputProps={{
                    "aria-label": "Description",
                  }}
                  onChange={(event) => this.props.onHandleChange(event, "societe")}
                />
              </div>
              <div className="col-lg-12 col-sm-12 col-12">
                <Input
                  placeholder="Email"
                  className="w-100 mb-3"
                  inputProps={{
                    "aria-label": "Description",
                  }}
                  onChange={(event) => this.props.onHandleChange(event, "email")}
                />
              </div>

              <div className="col-lg-12 col-sm-12 col-12">
                <FormControl className="w-100 mb-2">
                  <InputLabel htmlFor="age-simple">Périodicité</InputLabel>
                  <Select
                    value={data.periodicite}
                    onChange={(event) =>
                      this.props.onHandleChange(event, "periodicite")
                    }
                    input={<Input id="ageSimple1" />}
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
                  <InputLabel htmlFor="age-simple">
                    Mode de règlement
                  </InputLabel>
                  <Select
                    value={data.mode_de_reglement}
                    onChange={(event) =>
                      this.props.onHandleChange(event, "mode_de_reglement")
                    }
                    input={<Input id="ageSimple1" />}
                  >
                    <MenuItem value={"P"}>Prélèvement</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="col-lg-12 col-sm-12 col-12">
                <Input
                  placeholder="Montant"
                  value={data.montant}
                  onChange={(event) => this.props.onHandleChange(event, "montant")}
                  className="w-100 mb-3"
                  inputProps={{
                    "aria-label": "Description",
                  }}
                  startAdornment={<InputAdornment position="start">€</InputAdornment>}
                />
              </div>
              <div className="col-lg-12 col-sm-12 col-12">
                <FormControl component="fieldset" required>
                  <FormLabel component="legend">Statut Paiement</FormLabel>
                  <RadioGroup
                    aria-label="paiement"
                    name="paiement"
                    value={data.statut}
                    onChange={(event) => this.props.onHandleChange(event, "statut")}
                  >
                    <FormControlLabel
                      value="R"
                      control={<Radio color="primary" />}
                      label="Règlement à jour"
                    />
                    <FormControlLabel
                      value="N"
                      control={<Radio color="primary" checked />}
                      label="Non à jour"
                    />
                    {/*<FormControlLabel value="disabled" disabled control={<Radio />} label="Disabled" />*/}
                  </RadioGroup>
                </FormControl>
              </div>
              <div className="col-lg-12 col-sm-12 col-12">
                <FormControl component="fieldset" required>
                  <FormLabel component="legend">Statut Client</FormLabel>
                  <RadioGroup
                    aria-label="statut-client"
                    name="statut_client"
                    value={data.statut_client}
                    onChange={(event) =>
                      this.props.onHandleChange(event, "statut_client")
                    }
                  >
                    <FormControlLabel
                      value="A"
                      control={<Radio color="primary" />}
                      label="Actif"
                    />
                    <FormControlLabel
                      value="D"
                      control={<Radio color="primary" checked/>}
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
                  value={data.date_reglement}
                  onChange={this.props.onHandleDateChange}
                  KeyboardButtonProps={{
                    "aria-label": "change date",
                  }}
                />
              </div>
              <div className="col-lg-12 col-sm-12 col-12">
                <Input
                  placeholder="Iban"
                  className="w-100 mb-3"
                  disabled
                  inputProps={{
                    "aria-label": "Iban",
                  }}
                  onChange={(event) => this.props.onHandleChange(event, "iban")}
                />
              </div>
              <Button
                variant="contained"
                onClick={this.props.onHandleSubmit}
                color="primary"
              >
                Valider
              </Button>
            </div>
          </CardBox>
         )
  }
}

export default Form;
