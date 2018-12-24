import React, { Component } from 'react';
import Layout from '../components/Layout';
import ListItem from '../components/ListItem.js';
import { auth, signUp, signOut, logIn, db } from "../firebase";
import CategorySelector from '../components/CategorySelector.js'
import StatusSelector from '../components/StatusSelector.js'
import styles from '../Stylesheets/pages/home.scss';



class Home extends Component {

  state = {
    searchResult: [],
    searchingFor: 'biete',
    searchCat: {}
  }

  componentWillMount() {
    console.log('huhu');
    this.searchForUsers(); 
  }

  searchForUsers() {
    db.collection("users").where("status", "==", this.state.searchingFor)
    .get()
    .then( querySnapshot => {
      console.log(querySnapshot);
      var allData = [];
        querySnapshot.forEach( doc => {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
            var data = doc.data();
            allData.push(data);
        });

        this.setState(prevState => ({
          searchResult: allData
        }), () => this.filterForCats());
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });
  }

  filterForCats() {
    console.log('filterForCats');
    console.log(this.state.searchResult);
    let matchedUsers = [];

    this.state.searchResult.forEach(user => {
      console.log(user);
      console.log(this.state.searchCat);
      let filterCatIsSet = false;   

      Object.keys(this.state.searchCat).forEach(key =>  {
        if(this.state.searchCat[key]) {
          filterCatIsSet = true;
          return;
        }
      })

      if(filterCatIsSet) {
        Object.keys(this.state.searchCat).forEach(key =>  {
          if(this.state.searchCat[key] && user[key] && !matchedUsers.includes(user) && user['public']) {
            matchedUsers.push(user);
          };          
        })
      } else if(user['public']) {
        matchedUsers.push(user);
      }
    })
    console.log(matchedUsers)

    this.setState(prevstate => ({
      searchResult: matchedUsers
      })
    )
  }
  

  handleCheckboxChange = event => {
    const { id, checked } = event.target;
    this.setState( prevState => ({
      searchCat: {
        ...prevState.searchCat,
        [id]: checked,
      },
    }), () => {
      console.log(this.state);
      this.searchForUsers();
    });
  }

  handleRadioChange = event => {
    const { name, value} = event.target
    this.setState( prevState => ({
      searchingFor: value,        
    }), () => {
      console.log(this.state);
      this.searchForUsers()
    });
  }


  
  render() {
    return  (
      <Layout>
        <nav className="plakat">
          <div className="container">
            <h1>
              Oreka Schweiz fördert die Idee der Nachbarschaftshilfe mit Zeitgutschriften. Suchen Sie hier nach Hilfe – oder bieten Sie Hilfe an.
            </h1>
          </div>
        </nav>
        <div className="container home">
          <section className="filter-bar">
            <div className="options">      
              <StatusSelector change={this.handleRadioChange} searchingFor={this.state.searchingFor} />
              <p className="label">Nachbarn, die Hilfe {this.state.searchingFor}n</p>
            </div>
            
            <CategorySelector change={this.handleCheckboxChange} categories={this.state.searchCat} searchCat={this.state.searchCat} searchingFor={this.state.searchingFor} />
                              
          </section>
          <section className="searchResults">
            <div className="search-list">
            { 
              this.state.searchResult.map((user, i) => {
                return <ListItem user={ user } key={i}/>
              })
            }
            </div>
            <div className="search-map">
            
            </div>
          
          </section>
           
        </div>
      </Layout>
    )
  }
}

export default Home; 