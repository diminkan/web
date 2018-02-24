import React, { Component } from 'react';
import store from "../../store/Store.js";

import './Login.css';

class Login extends Component {

    constructor(props) {
        super(props);
    }

    onClick(event) {
        event.preventDefault();
        console.log("login");
        
        fetch('/login', {
            method: 'get',
            headers: {
                'Authorization': "Basic ZGF2aWQ6ZGF2aWQ=",
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(function (response) {
            store.someData = "Basic ZGF2aWQ6ZGF2aWQ=";
        }.bind(this));
    }

    render () {
        return <div className="text-center">
        <form className="form-signin">
          <img className="mb-4" src="https://getbootstrap.com/assets/brand/bootstrap-solid.svg" alt="" width="72" height="72"/>
          <h1 className="h3 mb-3 font-weight-normal">Please sign in</h1>
          <label for="inputEmail" className="sr-only">Email address</label>
          <input type="text" id="inputEmail" className="form-control" placeholder="Email address" required="" autofocus="" autocomplete="off" style={{backgroundAttachment: "scroll", cursor: "pointer", backgroundPosition: "right center", backgroundRepeat: "no-repeat no-repeat"}}/>
          <label for="inputPassword" className="sr-only">Password</label>
          <input type="password" id="inputPassword" className="form-control" placeholder="Password" required="" autocomplete="off" style={{ backgroundAttachment: "scroll", cursor: "auto", backgroundPosition: "right center", backgroundRepeat: "no-repeat no-repeat"}}/>
          <div className="checkbox mb-3">
            <label>
              <input type="checkbox" value="remember-me"/> Remember me
            </label>
          </div>
          <button className="btn btn-lg btn-primary btn-block" type="submit" onClick={this.onClick}>Sign in</button>
          <p class="mt-5 mb-3 text-muted">© 2017-2018</p>
        </form>
        </div>
    }
}

export default Login