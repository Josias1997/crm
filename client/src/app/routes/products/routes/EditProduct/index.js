import React, {Component} from "react";
import ContainerHeader from "components/ContainerHeader/index";import Input from "@material-ui/core/Input";
import CardBox from "components/CardBox/index";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import InputAdornment from "@material-ui/core/InputAdornment";
import axios from "./../../../../../util/instanceAxios";


class Edit extends Component {
  constructor() {
    super();
    this.state = {
      product: {},
      loading: false,
      error: null,
    };
  }

  componentDidMount() {
    console.log('Mount');
    this.setState({
      loading: true
    });
    axios
      .get(`/api/product/get/${this.props.match.params.id}`)
      .then(({ data }) => {
        console.log(data);
        this.setState({
         product: data,
         loading: false
        });
      })
      .catch((error) => {
        this.setState({
          error: error.message,
          loading: false
        })
      });
  }

  handleChange = (event, name) => {
    const { product } = this.state;
    product[name] = event.target.value;
    this.setState({
      product: product,
    });
  };

  handleSubmit = () => {
    // Axios request
    this.setState({
      loading: true,
    });
    axios
      .put(
        `/api/product/update/${this.props.match.params.id}`,
        this.state.product
      )
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
    const { product, loading, error } = this.state;
    return (
      <div className="app-wrapper">
        {
          loading ?  <div className="d-flex justify-content-center"> 
            <CircularProgress size={50} /> 
          </div> :      
          <CardBox styleName="col-lg-12">
            <div className="alert alert-danger">
              {error !== null ? error : null}
            </div>
            <div className="col-md-12 col-12">
              <div className="col-lg-12 col-sm-12 col-12">
                <Input
                  placeholder="Nom"
                  value={product.name}
                  className="w-100 mb-3"
                  inputProps={{
                    "aria-label": "Name",
                  }}
                  onChange={(event) => this.handleChange(event, "name")}
                />
              </div>
              <div className="col-lg-12 col-sm-12 col-12">
                <Input
                  placeholder="Prix"
                  value={product.price}
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
                  <InputLabel htmlFor="type">Type</InputLabel>
                  <Select
                    disabled
                    value={
                      product.type !== undefined
                        ? product.type
                        : "good"
                    }
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
                    value={product.recurrence}
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
                  value={product.description}
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
        }
      </div>
    );
  }
  
}

export default Edit;
