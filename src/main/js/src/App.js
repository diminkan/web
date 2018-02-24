// BrowserRouter is the router implementation for HTML5 browsers (vs Native).
// Link is your replacement for anchor tags.
// Route is the conditionally shown component based on matching a path to a URL.
// Switch returns only the first matching route rather than all matching routes.
import {
  BrowserRouter as Router,
  Link,
  Route,
  Switch,
} from 'react-router-dom';
import React from 'react';
import {Nav, NavItem, Navbar} from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap';
import Trip from './components/trip/Trip';
import Ticket from './components/ticket/Ticket';
import Login from './components/login/Login';

const Home = () => <h1>Home</h1>;
const About = () => <h1>About</h1>;

// We give each route either a target `component`, or we can send functions in `render` or `children` 
// that return valid nodes. `children` always returns the given node whether there is a match or not.
const App = () => (
  <Router>
    <div>
    <nav class="navbar navbar-expand-md navbar-dark bg-dark mb-4">
      <Link className="navbar-brand" to="/">Website</Link>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarCollapse">
        <ul class="navbar-nav mr-auto">
            <LinkContainer exact to="/">
            <li class="nav-item active">
            <a class="nav-link" href="#">Home <span class="sr-only">(current)</span></a>
          </li>
            </LinkContainer>
            <LinkContainer exact to="/trip">
 
          <li class="nav-item active">
            <a class="nav-link" href="#">Trip <span class="sr-only">(current)</span></a>
          </li>
          </LinkContainer>

          <LinkContainer exact to="/ticket">
 
 <li class="nav-item active">
   <a class="nav-link" href="#">Ticket <span class="sr-only">(current)</span></a>
 </li>
 </LinkContainer>
        </ul>
        <form class="form-inline mt-2 mt-md-0">
          <input class="form-control mr-sm-2" type="text" placeholder="Search" aria-label="Search"/>
          <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
        </form>
        <ul class="navbar-nav">

        <LinkContainer exact to="/login">
 
 <li class="nav-item active">
   <a class="nav-link" href="#">Login <span class="sr-only">(current)</span></a>
 </li>
 </LinkContainer>
 </ul>
      </div>
    </nav>
    {/* <Navbar collapseOnSelect id="navbar">
    <div className="container">
        <Navbar.Header className="navbar-header">
            <Link className="navbar-brand" to="/">Website</Link>
            <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
            <Nav id="nav">
                <LinkContainer exact to="/">
                    <NavItem>Home</NavItem>
                </LinkContainer>
                <LinkContainer exact to="/trip">
                    <NavItem>Trip</NavItem>
                </LinkContainer>
                <LinkContainer exact to="/contact">
                    <NavItem>Contact</NavItem>
                </LinkContainer>
            </Nav>
            <Nav pullRight>
                <LinkContainer to="/login">
                    <NavItem >Login</NavItem>
                </LinkContainer>
                <LinkContainer to="/register">
                    <NavItem>register</NavItem>
                </LinkContainer>
            </Nav>
        </Navbar.Collapse>
    </div>
</Navbar> */}

      {/* <LinkContainer to="/">Home</LinkContainer>{' '}
      <LinkContainer to={{pathname: '/about'}}>About</LinkContainer>{' '}
      <LinkContainer to="/contact">Contact</LinkContainer> */}
      
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/trip" component={Trip} />
        <Route path="/ticket" component={Ticket} />
        <Route path="/login" component={Login} />
        <Route
          path="/contact"
          render={() => <h1>Contact Us</h1>} />
        <Route path="/blog" children={({match}) => (
          <li className={match ? 'active' : ''}>
            <Link to="/blog">Blog</Link>
          </li>)} />
        <Route render={() => <h1>Page not found</h1>} />
      </Switch>
    </div>
  </Router>
);

export default App;
