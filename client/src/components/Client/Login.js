import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import {
	NotificationContainer,
	NotificationManager,
} from "react-notifications";
import CircularProgress from "@material-ui/core/CircularProgress";
import axios from './../../util/instanceAxios';
import { withRouter } from 'react-router-dom';

const Login = (props) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loader, setLoader] = useState(false);
	const [error, setError] = useState(null);
	const {id, token} = props.match.params;

	useEffect(() => {
		if(localStorage.getItem('token')) {
			props.history.push(`/account/profile/${id}`);
		}
		if(props.title === "Activate account") {
			setLoader(true);
			axios.get(`/api/client/get/${id}`)
			.then(({data}) => {
				setEmail(data.client.email);
				setPassword(data.client.societe);
				setLoader(false);
			}).catch(error => {
				setError(error);
				setLoader(false);
			})
		}
	}, [])

	const login = (email, password) => {
		setError(null);
		setLoader(true);
		axios.post(`/api/client/login/${id}/`, {
			email: email,
			password: password
		}).then(({data}) => {
			console.log(data);
			setLoader(false);
			localStorage.setItem('user', token);
			props.history.push(`/account/profile/${id}`);
		}).catch(error => {
			setError(error);
			setLoader(false);
		})
	};

	return (
		<div className="app-login-container d-flex justify-content-center align-items-center animated slideInUpTiny animation-duration-3">
			<div className="app-login-main-content">
				<div className="app-logo-content d-flex align-items-center justify-content-center">
					<Link className="logo-lg" to="/" title="Jambo">
						<img
							src={require("assets/images/logo.png")}
							alt="jambo"
							title="jambo"
						/>
					</Link>
				</div>

				<div className="app-login-content">
					<div className="app-login-header mb-4">
						<h1>
							{props.title}
						</h1>
					</div>

					<div className="app-login-form">
						<form>
							<fieldset>
								<TextField
									label={"Email"}
									fullWidth
									onChange={(event) =>
										setEmail(event.target.value)
									}
									defaultValue={email}
									value={email}
									margin="normal"
									className="mt-1 my-sm-3"
								/>
								<TextField
									type="password"
									label={"Password"}
									fullWidth
									onChange={(event) =>
										setPassword(event.target.value)
									}
									defaultValue={password}
									value={password}
									margin="normal"
									className="mt-1 my-sm-3"
								/>

								<div className="mb-3 d-flex align-items-center justify-content-between">
									<Button
										onClick={() => {
											login(email, password);
										}}
										variant="contained"
										color="primary"
									>
										Login
									</Button>
								</div>
							</fieldset>
						</form>
					</div>
				</div>
			</div>
			{loader && (
				<div className="loader-view">
					<CircularProgress />
				</div>
			)}
			{error !== null && NotificationManager.error(error.message)}
			<NotificationContainer />
		</div>
	);
};


export default withRouter(Login);