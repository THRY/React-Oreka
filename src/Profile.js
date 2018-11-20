import React, { Component } from 'react';
import Layout from './components/Layout';
import { auth, signUp, signOut, logIn, db } from "./firebase";

class Profile extends Component {
  state = {
    user: '',
  }

  componentDidMount() {
  
  }

  componentWillMount() {
    this.setState(state => {
      return {
        user: this.props.match.params.value
      }      
    }, () => {
      db.collection("users").doc(this.state.user)
        .onSnapshot(this.handleOnNext, this.handleOnError);
    });
  }

  handleOnNext = (doc) =>  {
    const data = doc.data();
    this.setState( state => {
      return {
          ...state, ...data
        }
      }, () => console.log(this.state));
      
  }

  handleChange = event => {
    var obj = {};
    obj[`${event.target.id}`] = event.target.value;
    
    console.log(obj);

    this.setState( state => {
      return {
        ...state, ...obj
      }
    }, () => console.log(this.state));
    
  }

  handleSubmit = event => {  
    event.preventDefault();  
    db.collection("users").doc(this.state.user).set(this.state);

    console.log(this.state);
    /*
    fetch('/api/form-submit-url', {
      method: 'POST',
      body: data,
    });
    */
  }

  render() {
    return (
      <Layout>
        <p>Profil von User: {this.props.match.params.value}</p>  

        <form onSubmit={this.handleSubmit}>
        <label htmlFor="username">Enter username</label>
        <input id="username" name="username" type="text" onChange={this.handleChange} defaultValue={this.state.username} />

        <label htmlFor="email">Enter your email</label>
        <input id="email" name="email" type="email" onChange={this.handleChange} defaultValue={this.state.email} />

        <label htmlFor="birthdate">Enter your birth date</label>
        <input id="birthdate" name="birthdate" type="text" onChange={this.handleChange} defaultValue={this.state.birthdate}/>

        <label htmlFor="haushalt">Haushalt</label>
        <input id="haushalt" name="haushalt" type="checkbox"  value={true} onChange={this.handleChange} defaultChecked={this.state.haushalt === 'on' ? true : false} />

        <button>Send data!</button>
      </form>
      </Layout>  
    )
  }
}

export default Profile; 