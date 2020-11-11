import React, {Fragment} from 'react';
import {Button,UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem} from 'reactstrap';
import './style.css';
import _ from 'lodash';
import {
  Route, Redirect, NavLink, Switch
} from "react-router-dom";

import {AboutPage} from './About';
import {WelcomePage} from './Welcome';

import firebase from 'firebase/app'
import 'firebase/auth'; 
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

import {render, Color} from 'ink';
import Spinner from 'ink-spinner';


//header
//cards
//cardlist
//sortbutton
//filterButton

export default class App extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      dat : this.props.dat,
      currentFilter : 'All',
      currentSort : 'High-Low',
      user: null, 
      loading: true
    }
  }
  
  uiConfig = {
    signInOptions: [
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
      firebase.auth.GoogleAuthProvider.PROVIDER_ID
    ],
    signInFlow: 'popup',
  };

  componentDidMount() {
    this.authUnRegFunc = firebase.auth().onAuthStateChanged((firebaseUser) => {
      this.setState({loading:false});
      if (firebaseUser) {
        console.log("Logged in as", firebaseUser.email);
        this.setState({user:firebaseUser});
        // find the users data and set it to something

      } else {
        console.log("logged out");
        this.setState({user:null});
      }
    });

    /*
    .catch((error) => {
      this.setState({errorMessage:error});
    });
    */
  }

  componentWillUnmount() {
    this.authUnRegFunc();
  }

  changeFilterState = (filter) => {
    console.log(filter);
    this.setState({currentFilter:filter});
  }

  changeSortState = (sort) => {
    console.log(sort);
    this.setState({currentSort:sort});
    console.log(this.state.currentSort);
  }

  render(){

    // if the page is still loading render a loading signifier instead
    if (this.state.loading) {
      return (
        <Fragment>
        <Color green><Spinner type="dots"/></Color>
        {' Loading'}
      </Fragment>
      );
    }
    

    // load the data
    let dat = this.state.dat;


    //filters all items
    let filterDat = dat;
    if (this.state.currentFilter === "All") {
      filterDat = dat;
    } else {
      filterDat = _.filter(dat, item => item.orderStatus === this.state.currentFilter);
    }

    let sortDat = _.orderBy(filterDat, 'totalSpending', 'desc');

    // Sorts the filtered items
    if (this.state.currentSort === "Price:Low-High") {
      sortDat = _.orderBy(filterDat, 'totalSpending', 'asc');
    } else {
      sortDat = _.orderBy(filterDat, 'totalSpending', 'desc');
    }


    let content = null;

    // if the user has not logged in, set content to a login component
    if (!this.state.user) {
      content = (
        <div>
          <StyledFirebaseAuth uiConfig={this.uiConfig} firebaseAuth={firebase.auth()} />
        </div>
      );
    } else {

    // otherwise, set content to the normal app
    content =  (
      <div className="flex-container">
        <PageHeader callBack = {this.changeFilterState} callBack2 = {this.changeSortState}/>
        <main className="flex-item">
          <Switch>
            <Route exact path = '/packages' render ={()=>(
              <CardList currentUser = {this.state.user} cardArray={sortDat}/>)}
            />
            <Route exact path = '/about' component = {AboutPage}/>
            <Route exact path = '/' component = {WelcomePage}/>
            <Redirect to='/'/>
          </Switch>
        </main>
        <footer>
            <p>This website was developed by Olivia Tang and Alan Ngo</p>
            <p id="photo-cred">Photo by Fezbot2000 on Unsplash</p>
        </footer>
      </div>
    );
    }

    let errBar = null;
    if (this.state.errorMessage) {
      errBar = <p className="alert alert-danger">{this.state.errorMessage}</p>;
    }
    return (
      <div className = "maxHeight">
        {errBar}
        {content}
      </div>);
    }
  }


// creates apage header for the page
export class PageHeader extends React.Component{


  // changes the filterState, by moving the callback value up
  changeFilterState = (element) => {
    this.props.callBack(element);
  }

  // changes the sortState, by moving the callback value up
  changeSortState = (element) => {
    this.props.callBack2(element);
  }

  // handles the signout
  handleSignOut = () => {
    console.log('sign out');
    firebase.auth().signOut();
  } 
  
  render() {
    return (
      <header className="flex-item">
        <nav className="nav-container">
            <div className="nav-item">
                <h1>Package Tracker</h1>
            </div>
            <NavBar />
            <DropDown callBack = {this.changeFilterState}/>
            <SortDown callBack = {this.changeSortState}/>
            <button className="btn btn-warning float-right" onClick={this.handleSignOut}>Sign Out</button>
        </nav>
      </header>  
    );
  }
}


// renders a nav bar component
export class NavBar extends React.Component{
  render(){
    return( 
    <ul id="topnav" className="nav-item">
    <li><NavLink activeClassName= 'activeLink' exact to='/'>Welcome</NavLink></li>
    <li><NavLink activeClassName='activeLink' exact to='/packages'>Packages</NavLink></li>
    <li><NavLink activeClassName='activeLink' exact to='/about'>About</NavLink></li>
</ul>);
  }
}

// renders a dropdown component
export class DropDown extends React.Component{
  changeState = (element) => {
    this.props.callBack(element);
  }
  render() {
    return(
        <UncontrolledDropdown>
        <DropdownToggle caret>
          Filter By
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem><NavButton purpose = 'All' callBack = {this.changeState}/></DropdownItem>
          <DropdownItem><NavButton purpose = 'Pending' callBack = {this.changeState}/></DropdownItem>
          <DropdownItem><NavButton purpose = 'Shipped' callBack = {this.changeState}/></DropdownItem>
          <DropdownItem> <NavButton purpose = 'Delivered' callBack = {this.changeState}/></DropdownItem>
        </DropdownMenu>
      </UncontrolledDropdown>
    );
  }
}

// renders a nav button component
export class NavButton extends React.Component {
  handleClick = () => {
    this.props.callBack(this.props.purpose);
  }
  render () {
    return <button className="nav-a" onClick = {this.handleClick} href = {this.props.purpose} id={this.props.purpose} >{this.props.purpose}</button>;
  }
}

//renders a sort down component
export class SortDown extends React.Component{
  changeState = (element) => {
    this.props.callBack(element);
  }
  render(){
    return(
    <UncontrolledDropdown>
    <DropdownToggle caret>
      Sort By
    </DropdownToggle>
    <DropdownMenu>
      <DropdownItem> <NavButton purpose = "Price:Low-High" callBack = {this.changeState}/></DropdownItem>
      <DropdownItem divider />
      <DropdownItem><NavButton purpose = "Price:High-Low" callBack = {this.changeState}/></DropdownItem>
    </DropdownMenu>
  </UncontrolledDropdown>);
  }
}

//renders ordercards
export class OrderCard extends React.Component{
  constructor (props){
    super(props);
    this.state = {
      clicked : false,
      liked : this.props.liked,
      key: this.props.orderObj.OrderNum,
    }
    
  }

  // handles click of card
  handleClick = () => {
    this.setState({clicked:!this.state.clicked})
  }

  // handles favorites button click
  handleLike = () => {
    let newState = !this.state.liked;
    this.setState({liked:newState})
    console.log('key' + this.props.orderObj.OrderNum);
    let key = this.props.orderObj.OrderNum;
    console.log(key);
    let userEmail = this.props.currentUser.email;
    userEmail = userEmail.substring(0, userEmail.indexOf('@'));
    // let userRef = firebase.database().ref('users/test/userData/0/').set({
      let userRef = firebase.database().ref('users/'+userEmail+'/'+this.state.key+'/').set({
      favorites: newState
    });
    console.log(userRef + ' working');
  }


  componentWillMount() {
    let userEmail = this.props.currentUser.email;
    userEmail = userEmail.substring(0, userEmail.indexOf('@'));
    let orderRef = firebase.database().ref('users/'+userEmail+'/'+this.state.key+'/')
    .on('value', (snapshot) => {
      let favoritesEntries = snapshot.val();
      if (favoritesEntries != null) {
      if(favoritesEntries.favorites === true) {
        this.setState({liked:true});
      }
    }
    });
  }


  render(){
    let order = this.props.orderObj;
    let favoritesEntries = null;
    let likeStatus = this.state.liked;

    let contentStatus = 'none';
    let imgColor = "blackIcon.png";
    if (this.state.clicked === true) {
      contentStatus = 'content';
    } else {
      contentStatus = 'none';
    }

    if (likeStatus) {
      imgColor = 'redIcon.png';
    } else {
      imgColor = 'blackIcon.png';
    }

    const items = [];
    for (const item of order.itemNames) {
      items.push(<li>{item}</li>)
    }

    return(
    <div key = {order.OrderNum} className="package-item">
      <button onClick = {this.handleClick} type="a" href="#orderbutton" className="collapsible">
        <div className="card-container">
          <div className="card-item">
              <img src= {"./img/" + imgColor} alt="icon"/>
          </div>
          <div className="card-item">
              <h2>{order.Company}</h2>
              <p>Order #: {order.OrderNum}</p>
              <p>Order Status: {order.orderStatus}</p>
              <p>Total Spending: {order.totalSpending}</p>
          </div>
        </div>
      </button>
      <div className = {contentStatus}>
                    <p>Items You Bought:</p>
                    <ul className="item-list">
                      {items} 
                    </ul>
                    
                    <Button outline color="danger" onClick={this.handleLike}>Favorite</Button>
      </div>
    </div>
   );
  }
}

// renders a list of cards
export class CardList extends React.Component{
  render(){
    let userEmail = this.props.currentUser.email;
    userEmail = userEmail.substring(0, userEmail.indexOf('@'));
    let cardArray = this.props.cardArray;
    let list = cardArray.map((orderObj) => {
      let favoritesEntries = null;
      firebase.database().ref('users/'+ userEmail+ '/'+orderObj.id+'/').on('value', function(snapshot) {
        favoritesEntries = snapshot.val();
        console.log(favoritesEntries);
      });
      let likeStatus = false;
      if (favoritesEntries != null) {
        likeStatus = favoritesEntries.favorites;
        console.log(likeStatus);
      }
      return <OrderCard liked = {likeStatus} currentUser = {this.props.currentUser} orderObj = {orderObj} key = {orderObj.OrderNum}/>;
    });

    return(
      <div className="package-container">
        {list}
      </div>
    );
  }
}