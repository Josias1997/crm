import React from "react";
import ContainerHeader from "components/ContainerHeader/index";
import IntlMessages from "util/IntlMessages";
import Input from "@material-ui/core/Input";
import CardBox from "components/CardBox/index";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import InputAdornment from "@material-ui/core/InputAdornment";
import axios from "./../../../../../util/instanceAxios";

class Add extends React.Component {
  constructor() {
    super();
    this.state = {
      name: "",
      type: "",
      price: "",
      recurrence: "",
      description: "",
      loading: false,
      error: null,
    };
  }

  handleChange = (event, name) => {
    this.setState({
      [name]: event.target.value,
    });
  };

  handleSubmit = () => {
    console.log(this.state);
    // Axios request
    this.setState({
      loading: true,
    });
    axios
      .post("/api/product/post/", {
        name: this.state.name,
        type: this.state.type,
        price: this.state.price,
        recurrence: this.state.recurrence,
        description: this.state.description
      })
      .then(({ data }) => {
        this.setState({
          loading: false,
        });
        this.props.history.push("/app/products");
      })
      .catch((error) => {
        this.setState({
          loading: false,
          error: error.message,
        });
      });
  };

  render() {
    return (
      <div className="app-wrapper">
        <ContainerHeader
          match={this.props.match}
          title={"Products"}
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
                  placeholder="Nom"
                  className="w-100 mb-3"
                  value={this.state.name}
                  inputProps={{
                    "aria-label": "Name",
                  }}
                  onChange={(event) => this.handleChange(event, "name")}
                />
              </div>
              <div className="col-lg-12 col-sm-12 col-12">
                <Input
                  placeholder="Prix"
                  value={this.state.price}
                  onChange={(event) => this.handleChange(event, "price")}
                  className="w-100 mb-3"
                  inputProps={{
                    "aria-label": "Price",
                  }}
                  startAdornment={<InputAdornment position="start">€</InputAdornment>}
                />
              </div>
              <div className="col-lg-12 col-sm-12 col-12">
                <FormControl className="w-100 mb-2">
                  <InputLabel htmlFor="age-simple">Type</InputLabel>
                  <Select
                    value={this.state.type}
                    onChange={(event) =>
                      this.handleChange(event, "type")
                    }
                    input={<Input id="type" />}
                  >
                    <MenuItem value={"good"}>Bien</MenuItem>
                    <MenuItem value={"service"}>Service</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="col-lg-12 col-sm-12 col-12">
                <FormControl className="w-100 mb-2">
                  <InputLabel htmlFor="age-simple">Récurrence</InputLabel>
                  <Select
                    value={this.state.recurrence}
                    onChange={(event) =>
                      this.handleChange(event, "recurrence")
                    }
                    input={<Input id="recurrence" />}
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
                <Input
                  placeholder="Description"
                  className="w-100 mb-3"
                  inputProps={{
                    "aria-label": "Description",
                  }}
                  onChange={(event) => this.handleChange(event, "description")}
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
