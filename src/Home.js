import React, { Component } from 'react';
import Layout from './components/Layout';
import { auth, signUp, signOut, logIn, db } from "./firebase";


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
          if(this.state.searchCat[key] && user[key] && !matchedUsers.includes(user)) {
            matchedUsers.push(user);
          };          
        })
      } else {
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
    let radios = [
      {
        type: 'radio',
        name: 'status1',
        radioName: 'status',
        value: 'suche',
        change: this.handleRadioChange,
        label: 'suche'
      },
      {
        type: 'radio',
        name: 'status2',
        radioName: 'status',
        value: 'biete',
        change: this.handleRadioChange,
        label: 'biete'
      },
    ]


    let categories = [
      {
        type: 'checkbox',
        case: 'category',
        name: 'haushalt',
        change: this.handleCheckboxChange,
        label: 'Haushalt'
      },
      {
        type: 'checkbox',
        case: 'category',
        name: 'garten',
        change: this.handleCheckboxChange,
        label: 'Garten'
      },
      {
        type: 'checkbox',
        case: 'category',
        name: 'einkaufen',
        change: this.handleCheckboxChange,
        label: 'Einkaufen'
      },
      {
        type: 'checkbox',
        case: 'category',
        name: 'finanzen',
        change: this.handleCheckboxChange,
        label: 'Finanzen'
      },
      {
        type: 'checkbox',
        case: 'category',
        name: 'behoerden',
        change: this.handleCheckboxChange,
        label: 'Behörden'
      },
      {
        type: 'checkbox',
        case: 'category',
        name: 'computer',
        change: this.handleCheckboxChange,
        label: 'Computer'
      },
      {
        type: 'checkbox',
        case: 'category',
        name: 'transport',
        change: this.handleCheckboxChange,
        label: 'Transport'
      },
      {
        type: 'checkbox',
        case: 'category',
        name: 'spezial',
        change: this.handleCheckboxChange,
        label: 'Spezial'
      },
    ]

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
              {    
                radios.map((field, index) => 
                  <>
                    { true && this.externalFunction(field) }
                    { true ? 
                      <label htmlFor={field.name} className={this.state.searchingFor}>
                      <p>{field.label}</p>  
                      </label>
                    : '' }
                  </>
                )
              }
              <p className="label">Nachbarn, die Hilfe {this.state.searchingFor}n</p>
            </div>
            <div className="category-bar">
              {                    
                categories.map((field, index) => 
                  <div key={index} name={field.name}>
                    { true && this.externalFunction(field) }
                    { true ? (
                      <label htmlFor={field.name} className={this.state.searchingFor}>
                        <div className={field.name + ' logo'}></div>
                      </label>
                    ) : '' }
                  </div>
                )
              }
            </div>
            <div className="label-bar">
              {                    
                categories.map((field, index) => 
                  <p>
                    <span>{ field.label }</span>
                  </p>
                )
              }
            </div>                    
          </section>
          <section>
          { 
              this.state.searchResult.map((item, i) => {
                return <p>{ item.username }</p>
              })
            }
          </section>
           
        </div>
      </Layout>
    )
  }

  externalFunction(field) {
    switch(field.type) {
      case 'checkbox':
        return (
          <input 
            id={field.name} 
            name={field.name} 
            type={field.type} 
            onChange={field.change} 
            
          />
        );
      case 'checkbox-spezial':
        return (
          <input 
            id={field.name} 
            name={field.name} 
            type={field.type} 
            onChange={field.change} 
            checked={this.state.userValues[field.name] || false } 
          />
        );
      case 'textarea':
        return (
            <textarea 
              id={field.name} 
              name={field.name} 
              type={field.type} 
              onChange={field.change}
              value={this.state.userValues[field.name]}
            />
        );
      case 'radio': 
          return (
            <input 
              id={field.name} 
              name={field.radioName} 
              type={field.type} 
              value={field.value} 
              onChange={this.handleRadioChange} 
              checked={(this.state.searchingFor === field.value ? true : false) }
            />
          )
      default:
      case 'text':
        return (
            <input 
              id={field.name} 
              name={field.name} 
              type={field.type} 
              onChange={field.change}
              defaultValue={this.state.userValues[field.name]}
            />
        );
    }
  }
}

export default Home; 