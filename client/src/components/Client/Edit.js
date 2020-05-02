import React from "react";
import axios from './../../util/instanceAxios';
import CircularProgress from '@material-ui/core/CircularProgress';

class Edit extends React.Component {
	constructor() {
		super();
		this.state = {
			email: '',
			password: '',
			password2: '',
			societe: '',
			error: null,
			loading: false
		}
	}

	componentDidMount(){
		const {id} = this.props;
		this.setState({
			loading: true
		})
		axios.get(`/api/client/get/${id}`)
	    .then(({data}) => {
	      this.setState({
	      	email: data.client.email,
	      	societe: data.client.societe,
	      	loading: false
	      })
	    }).catch(error => {
	      this.setState({
	      	error: error,
	      	loading: false
	      })
	    })
	}

	handleChange = (event) => {
		this.setState({
			[event.target.name]: event.target.value
		});
	};

	handleSubmit = () => {
		const {email, password, password2, societe} = this.state;
		if (password2 !== password) {
			return;
		}
		this.setState({
			loading: true
		})
		axios.post(`/api/client/update-credentials/${this.props.id}`, {
			email: email,
			password: password,
			societe: societe
		}).then(({data}) => {
			this.setState({
				email: data.client.email,
				societe: data.client.societe,
				password: data.clieny.password,
				loading: false
			})
			window.location.reload();
		}).catch(error => {
			this.setState({
				error: error,
				loading: false
			})
		})
	}
	render() {
		const {email, password, password2, societe, loading} = this.state;
		return (
		<div className="col-lg-8 pb-5">
			{
				loading ? <CircularProgress size={50} /> :
				<form className="row" onSubmit={this.handleSubmit}>
				<div className="col-md-6">
					<div className="form-group">
						<label htmlFor="account-fn">Societe</label>
						<input
							className="form-control"
							type="text"
							name="societe"
							id="account-fn"
							value={societe}
							onChange={this.handleChange}
						/>
					</div>
				</div>
				<div className="col-md-6">
					<div className="form-group">
						<label htmlFor="account-email">Email</label>
						<input
							className="form-control"
							type="email"
							name="email"
							id="account-email"
							value={email}
							onChange={this.handleChange}
						/>
					</div>
				</div>
				<div className="col-md-6">
					<div className="form-group">
						<label htmlFor="account-pass">Mot de Passe</label>
						<input
							className="form-control"
							type="password"
							name="password"
							id="account-pass"
							value={password}
							onChange={this.handleChange}
						/>
					</div>
				</div>
				<div className="col-md-6">
					<div className="form-group">
						<label htmlFor="account-confirm-pass">
							Confirmer le Mot de passe
						</label>
						<input
							className="form-control"
							type="password"
							name="password2"
							id="account-confirm-pass"
							value={password2}
							onChange={this.handleChange}
						/>
					</div>
				</div>
				<div className="col-12">
					<hr className="mt-2 mb-3" />
					<div className="d-flex flex-wrap justify-content-between align-items-center">
						<button
							className="btn btn-style-1 btn-primary"
							type="submit"
						>
							Update Profile
						</button>
					</div>
				</div>
			</form>
			}
		</div>
	);
	  }
}

export default Edit;
