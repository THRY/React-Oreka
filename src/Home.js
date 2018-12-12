import React, { Component } from 'react';
import Layout from './components/Layout';
import { auth, signUp, signOut, logIn, db } from "./firebase";



class Home extends Component {

  state = {
    searchResult: []
  }

  componentWillMount() {
    db.collection("users").where("public", "==", true)
    .get()
    .then( querySnapshot => {
      console.log(querySnapshot);
        querySnapshot.forEach( doc => {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());

            this.setState(state => ({
              searchResult: [...state.searchResult, doc.data()],
            }))
        });

        console.log(this.state.searchResult);
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });
  }

  
  render() {
    return  (
      <Layout>
        <div className="container">
        <p>This is home</p>
        { 
          this.state.searchResult.map((item, i) => {
            return <p>{ item.user }</p>
          })
        }
        </div>
      </Layout>
    )
  }
}

export default Home; 