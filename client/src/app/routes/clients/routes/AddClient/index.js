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

class Add extends React.Component {
  constructor() {
    super();
    this.state = {
      societe: "",
      email: "",
      date_reglement: this.changeDateFormat(new Date()),
      periodicite: "",
      montant: 0,
      mode_de_reglement: "",
      statut: "N",
      statut_client: "D",
      iban: "",
      product: "",
      plan: "",
      products: [],
      loading: false,
      error: null,
    };
  }

  componentDidMount() {
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
  	if (name === "product") {
		this.setState({
			product: event.target.value,
		}, () => {
			let product = this.state.products.filter(product => product.details.id === this.state.product)[0];
			let montant = product.plan.amount / 100;
			let periodicite = "H";
			switch(product.plan.interval && product.plan.interval_count){
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
			this.setState({
				montant: montant,
				periodicite: periodicite,
				plan: product.plan.id
			});
		});
  	} else {
		this.setState({
      		[name]: event.target.value,
    	});
  	}
  };

  handleSubmit = () => {
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
  handleDateChange = (date) => {
    this.setState({
      date_reglement: this.changeDateFormat(date._d),
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
    return (
      <div className="app-wrapper">
        <ContainerHeader
          match={this.props.match}
          title={<IntlMessages id="pages.clients" />}
        />
        {this.state.loading ? (
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
                  value={this.state.societe}
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
                  value={this.state.email}
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
                    value={this.state.periodicite}
                    onChange={(event) =>
                      this.handleChange(event, "periodicite")
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
                  <InputLabel htmlFor="product">Produit</InputLabel>
                  <Select
                    value={this.state.product}
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
                    value={this.state.mode_de_reglement}
                    onChange={(event) =>
                      this.handleChange(event, "mode_de_reglement")
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
                  value={this.state.montant}
                  onChange={(event) => this.handleChange(event, "montant")}
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
                    value={this.state.statut}
                    onChange={(event) => this.handleChange(event, "statut")}
                  >
                    <FormControlLabel
                      value="R"
                      control={<Radio color="primary" checked={this.state.statut === "R" ? true : false} />}
                      label="Règlement à jour"
                    />
                    <FormControlLabel
                      value="N"
                      control={<Radio color="primary" checked={this.state.statut === "N" ? true : false} />}
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
                    value={this.state.statut_client}
                    onChange={(event) =>
                      this.handleChange(event, "statut_client")
                    }
                  >
                    <FormControlLabel
                      value="A"
                      control={<Radio color="primary" checked={this.state.statut_client === "A" ? true : false} />}
                      label="Actif"
                    />
                    <FormControlLabel
                      value="D"
                      control={<Radio color="primary" checked={this.state.statut_client === "D" ? true : false}/>}
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
                  value={this.state.date_reglement}
                  onChange={this.handleDateChange}
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
                  onChange={(event) => this.handleChange(event, "iban")}
                />
              </div>
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

export default Add;
