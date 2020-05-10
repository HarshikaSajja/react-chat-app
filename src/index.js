import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'
// import 'semantic-ui-css/semantic.min.css'
import App from './App';
import Login from './components/Auth/Login/Login'
import Register from './components/Auth/Register/Register'
import * as serviceWorker from './serviceWorker';
import { BrowserRouter as Router, Switch, Route, withRouter } from 'react-router-dom'
import firebase from './firebase'
import { createStore } from 'redux'
import { Provider, connect } from 'react-redux'
import rootReducer from './reducers/index'
import {setUser, clearUser} from './actions/index'
import LoadingSpinner from './components/Loading Spinner/LoadingSpinner'

const store = createStore(rootReducer);

class Root extends React.Component {
  componentDidMount() {
    firebase
      .auth()
      .onAuthStateChanged(user => {
        if(user) {
          this.props.setUser(user)
          this.props.history.push("/");
        }else {
          this.props.history.push('/login');
          this.props.clearUser();
        }
      })
  }

  render() {
    return this.props.isLoading ? <LoadingSpinner/> : (
        <Switch>
          <Route exact path="/" component={App}/>
          <Route path="/login" component={Login}/>
          <Route path="/register" component={Register}/>
        </Switch>
    );
  }
}

const mapStateFromProps = state => ({
  isLoading: state.user.isLoading
});

const RootWithAuth = withRouter(
  connect(
    mapStateFromProps,
    { setUser, clearUser }
  )(Root)
);

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <RootWithAuth />
      </Router>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
