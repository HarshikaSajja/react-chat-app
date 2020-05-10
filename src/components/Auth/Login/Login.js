import React from 'react'
import registerLogo from '../../../assets/registerLogo.png'
import './Login.css'
import { Link } from 'react-router-dom'
import firebase from '../../../firebase'

class Login extends React.Component {
    state = {
        email: '',
        password: '',
        passwordConfirmation: '',
        authError: null
    }

    inputChangeHandler = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    submitButtonHandler = (event) => {
        event.preventDefault();
            firebase
                .auth()
                .signInWithEmailAndPassword(this.state.email, this.state.password)
                    .then(signedInUder => {
                        console.log(signedInUder);
                    })
                    .catch(error => {
                        console.log(error)
                        this.setState({
                            authError: 'Email or Password is incorrect'
                    })
                })
    }
    
    render() {
        return (
            <div>
                <div>
                    <img src={registerLogo} alt="Register Logo" className="login-img" height="120" width="120"></img>
                    <h3>Login</h3>
                </div>
                <div className="form-container">
                <form>
                <label>{this.state.emailError}</label>
                    <input className="login-input" type="email" 
                            id="email" 
                            placeholder="&#xF0e0;  Email Address"
                            name="email"
                            onChange={this.inputChangeHandler}></input>
                    
                    <label>{this.state.passwordError}</label>
                    <input className="login-input" type="password" 
                            id="password" 
                            placeholder="&#xF023;   Password"
                            name="password"
                            onChange={this.inputChangeHandler}></input>
                    <label>{this.state.authError}</label>
                    <button onClick={this.submitButtonHandler}>Submit</button>
                </form>
                </div>
                <div className="footer">
                    <h5>Don't have an account? <Link to="/register">Register</Link> </h5> 
                </div>
            </div>
                
        )
    }
}

export default Login;