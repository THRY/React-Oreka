import React, { Component } from 'react';
import Layout from '../components/Layout';
import ListItem from '../components/ListItem.js';
import { auth, signUp, signOut, logIn, db } from "../firebase";
import CategorySelector from '../components/CategorySelector.js'
import StatusSelector from '../components/StatusSelector.js'
import GoogleMaps from '../components/GoogleMaps.js'
import styles from '../Stylesheets/pages/home.scss';



class Home extends Component {

  state = {
    filterResultsUpdatedAt: 0,
    searchResult: [],
    searchingFor: 'biete',
    searchCat: {},
    filteredResults: []
  }

  componentWillMount() {
    if(sessionStorage.getItem("filterValues") !== null) {
      let filterValues = JSON.parse(sessionStorage.filterValues);
      console.log(filterValues);
      this.setState(prevState => ({
          searchCat: filterValues.searchCat ? filterValues.searchCat : {},
          searchingFor: filterValues.searchingFor ? filterValues.searchingFor : 'biete'
        }), () => {
          this.searchForUsers(); 
        }
      )
    } else {
      this.searchForUsers(); 
    }   
  }

  searchForUsers() {
    db.collection("users").where("status", "==", this.state.searchingFor)
    .get()
    .then( querySnapshot => {
      console.log(querySnapshot);
      var allData = [];
        querySnapshot.forEach( doc => {
            // doc.data() is never undefined for query doc snapshots
            var data = doc.data();
            allData.push(data);
        });

        this.setState(prevState => ({
          searchResult: allData,
        }), () => this.filterForCats());
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });
  }

  filterForCats() {
    console.log('filterForCats');
    console.log(this.state.searchResult);
    console.log(this.state.searchUpdatedAt);
    let matchedUsers = [];

    this.state.searchResult.forEach(user => {
      console.log(user);
      console.log(this.state.searchCat);
      let filterCatIsSet = false;   

      // Check if any filter is selected
      Object.keys(this.state.searchCat).forEach(key =>  {
        if(this.state.searchCat[key]) {
          filterCatIsSet = true;
          return;
        }
      })

      // Check conditions
      if(filterCatIsSet) {
        Object.keys(this.state.searchCat).forEach(key =>  {
          // 
          if(user.categories[key]) {
            if(this.state.searchCat[key] && user.categories[key].checked && !matchedUsers.includes(user) && user['public']) {
              matchedUsers.push(user);
            };  
          } 
        })
      // If no filter is set, add it to matched useres
      } else if(user['public']) {
        matchedUsers.push(user);
      }
    })
    console.log(matchedUsers)

    let timestamp = new Date();

    this.setState(prevState => ({
      filteredResults: matchedUsers,
      filterResultsUpdatedAt: timestamp.getTime()
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
      let filterValues
      if(sessionStorage.getItem("filterValues") !== null) {
        filterValues = JSON.parse(sessionStorage.filterValues);
        filterValues['searchCat'] = this.state.searchCat;
      } else {
        console.log('OVERWRITE');
        filterValues = {};
        filterValues['searchCat'] = this.state.searchCat;
      }
      sessionStorage.setItem('filterValues', JSON.stringify(filterValues));   
      this.searchForUsers();
    });
  }

  handleRadioChange = event => {
    const { name, value} = event.target
    this.setState( prevState => ({
      searchingFor: value,        
    }), () => {
      let filterValues;
      if(sessionStorage.getItem("filterValues") !== null) {
        filterValues = JSON.parse(sessionStorage.filterValues);
        filterValues['searchingFor'] = value;
        console.log(filterValues);
      } else {
        console.log('OVERWRITE');
        filterValues = {};
        filterValues['searchingFor'] = value;
      }
      sessionStorage.setItem('filterValues', JSON.stringify(filterValues));      
      
      this.searchForUsers()
    });
  }

  handleMapPinHover(id) {
    //document.getElementById(id)
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
        <nav className="filter">
          <div className="container">
          <StatusSelector change={this.handleRadioChange} searchingFor={this.state.searchingFor} />
          <div className="break"></div>
          <CategorySelector change={this.handleCheckboxChange} categories={this.state.searchCat} searchCat={this.state.searchCat} searchingFor={this.state.searchingFor} />
          </div>
        </nav>
        <div className="container home">
          <section className="searchResults">
            <div className="search-list">
            { this.state.filteredResults.length > 0 ?
              this.state.filteredResults.map((user, i) => {
                return <ListItem user={ user } key={ user.user }/>
              }) :
              <p>Keine Resultate zu Ihren Filterkriterien.</p>
            }
            </div>
            <div className="search-map">                            
              <GoogleMaps 
                onPinHover={this.handleMapPinHover} 
                filterResult={ this.state.filteredResults } 
                updatedAt={this.state.filterResultsUpdatedAt }
              />
            </div>
          
          </section>
           
        </div>
      </Layout>
    )
  }
}

export default Home; 