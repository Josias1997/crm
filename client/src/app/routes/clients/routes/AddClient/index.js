import React from 'react';
import ContainerHeader from 'components/ContainerHeader/index';
import IntlMessages from 'util/IntlMessages';
import Input from '@material-ui/core/Input';
import CardBox from 'components/CardBox/index';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import MomentUtils from '@date-io/moment';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import axios from './../../../../../util/instanceAxios';


class Add extends React.Component {
    constructor() {
        super();
        this.state = {
            societe: '',
            email: '',
            date_reglement: '',
            periodicite: '',
            montant: 0,
            mode_de_reglement: '',
            statut: '',
            statut_client: '',
            iban: '',
            loading: false,
            error: null
        }
    }

    handleChange = (event, name) => {
      this.setState({
        [name]: event.target.value
      })
    };

    handleSubmit = () => {
      console.log(this.state);
      // Axios request
      this.setState({
        loading: true
      });
      axios.post('/api/client/post/', this.state)
      .then(({data}) => {
        this.setState({
          loading: false
        });
        this.props.history.push('/app/clients');
      }).catch(error => {
        this.setState({
          loading: false,
          error: error.message
        });
      });
    }

  render() {
    return (
      <div className="app-wrapper">
        <ContainerHeader match={this.props.match} title={<IntlMessages id="pages.clients"/>}/>
        {
          this.state.loading ? <div className="d-flex justify-content-center"> <CircularProgress size={50} /> </div>:
          <CardBox styleName="col-lg-12">
            <div className="alert alert-danger">
              {this.state.error !== null ? this.state.error : null}
            </div>
            <div className="col-md-12 col-12">
                <Input 
                    placeholder="Societe"
                    className="w-100 mb-3"
                    inputProps={{
                    'aria-label': 'Description',
                    }}
                    onChange={(event) => this.handleChange(event, 'societe')}
                />
                <Input 
                    placeholder="Email"
                    className="w-100 mb-3"
                    inputProps={{
                    'aria-label': 'Description',
                    }}
                    onChange={(event) => this.handleChange(event, 'email')}
                />
                <MuiPickersUtilsProvider utils={MomentUtils}>
                  <KeyboardDatePicker
                    margin="normal"
                    id="date-picker-dialog"
                    label="Date picker dialog"
                    format="MM/dd/yyyy"
                    value={new Date()}
                    onChange={(event) => this.handleChange(event, 'date_reglement')}
                    KeyboardButtonProps={{
                      'aria-label': 'change date',
                    }}
                  />
                </MuiPickersUtilsProvider>
                <div className="col-lg-12 col-sm-12 col-12">
                    <FormControl className="w-100 mb-2">
                        <InputLabel htmlFor="age-simple">Périodicité</InputLabel>
                        <Select
                        value={this.state.periodicite}
                        onChange={(event) => this.handleChange(event, 'periodicite')}
                        input={<Input id="ageSimple1"/>}
                        >
                        <MenuItem value={'H'}>Hebdomadaire</MenuItem>
                        <MenuItem value={'M'}>Mensuel</MenuItem>
                        <MenuItem value={'T'}>Trimestriel</MenuItem>
                        <MenuItem value={'S'}>Semestriel</MenuItem>
                        <MenuItem value={'A'}>Annuel</MenuItem>
                        </Select>
                    </FormControl>
                </div>
                <div className="col-lg-12 col-sm-12 col-12">
                    <FormControl className="w-100 mb-2">
                        <InputLabel htmlFor="age-simple">Mode de règlement</InputLabel>
                        <Select
                        value={this.state.mode_de_reglement}
                        onChange={(event) => this.handleChange(event, 'mode_de_reglement')}
                        input={<Input id="ageSimple1"/>}
                        >
                        <MenuItem value={'P'}>Prélèvement</MenuItem>
                        </Select>
                    </FormControl>
                </div>
                <div className="col-lg-12 col-sm-12 col-12">
                  <FormControl component="fieldset" required>
                    <FormLabel component="legend">Statut Paiement</FormLabel>
                    <RadioGroup
                      aria-label="gender"
                      name="gender"
                      value={this.state.statut}
                      onChange={(event) => this.handleChange(event, 'statut')}
                    >
                      <FormControlLabel value="R" control={<Radio color="primary"/>} label="Règlement à jour"/>
                      <FormControlLabel value="N" control={<Radio color="primary"/>} label="Non à jour"/>
                      {/*<FormControlLabel value="disabled" disabled control={<Radio />} label="Disabled" />*/}
                    </RadioGroup>
                  </FormControl>
                </div>
                <div className="col-lg-12 col-sm-12 col-12">
                  <FormControl component="fieldset" required>
                    <FormLabel component="legend">Statut Client</FormLabel>
                    <RadioGroup
                      aria-label="gender"
                      name="gender"
                      value={this.state.statut_client}
                      onChange={(event) => this.handleChange(event, 'statut_client')}
                    >
                      <FormControlLabel value="A" control={<Radio color="primary"/>} label="Actif"/>
                      <FormControlLabel value="D" control={<Radio color="primary"/>} label="Non Actif"/>
                      {/*<FormControlLabel value="disabled" disabled control={<Radio />} label="Disabled" />*/}
                    </RadioGroup>
                  </FormControl>
                </div>
                <div className="col-lg-12 col-sm-12 col-12">
                    <Input
                        value={this.state.montant}
                        onChange={(event) => this.handleChange(event, 'montant')}
                        className="w-100 mb-3"
                        inputProps={{
                        'aria-label': 'Description',
                        }}
                    />
                </div>
                <Input 
                    placeholder="Iban"
                    className="w-100 mb-3"
                    inputProps={{
                    'aria-label': 'Description',
                    }}
                    onChange={(event) => this.handleChange(event, 'iban')}
                />
              <Button variant="contained" onClick={this.handleSubmit} color="primary">Valider</Button>
            </div>
        </CardBox>
        }
      </div>
    );
  }
}

export default Add;