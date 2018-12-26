import React, { Component } from 'react';
import Layout from '../components/Layout';
import { storageRef, db } from "../firebase";
import qs from 'query-string';
import styles from '../Stylesheets/pages/messages.scss';
import * as firebase from 'firebase';



class Messages extends Component {
  state = {
    isReadyToLoop: false,
    existingMessagesLoaded: false,
    messageTo: '',
    currentConversation: 'OOID9EUjj2PcmpnE0Y27',
    messagesInCurrentConversation: []
  }

  static contextTypes = {
    router: () => true, // replace with PropTypes.object if you use them
  }

  componentWillMount() {
    var parsedUrl = qs.parse(this.props.location.search, { ignoreQueryPrefix: true }); 
    let messageTo = parsedUrl.to;

    console.log(localStorage.getItem('user'));
    if(localStorage.getItem('user')) {
      this.setState({
        isSignedIn: true,
        user: localStorage.getItem('user'),
        messageTo: messageTo
      }, () => {
        db.collection("users").doc(this.state.user)
        .onSnapshot(this.handleOnNext, this.handleOnError);
      });
    }


    console.log('CHECK IF CONVERSATION WITH THAT PERSON ALREADY EXISTS'); 
    console.log('IF NOT, CREATE NEW CONVERSATION'); 
    console.log('IF YES, SHOW CONEVERSATION WITH THAT USER');  

    db.collection("messages").doc(this.state.currentConversation)
    .onSnapshot( doc => {
        //var source = doc.metadata.hasPendingWrites ? "Local" : "Server";
        let messages = doc.data().messages;
        this.setState(prevState => ({
          messagesInCurrentConversation: messages
          })
        )
    })
  } 

    handleOnNext = (doc) =>  {
    const data = doc.data();

    this.setState( prevState => ({
      isReadyToLoop: true,
      userValues: {
        ...prevState.userValues,
        ...data
      }
    }), () => {
      console.log('Saved User Values to State');
      this.setupConversations();
    });
  }

  setupConversations() {
    this.getExistingMessages(); 
  }

  searchForExistingConversations() {
    if(!this.doesConversationAlreadyExists()) {
      console.log('create new conversation'); 
      this.createNewConversation(); 
    } else {
      console.log('open existing conversation'); 
      //this.openExistionConversation()
    } 
  } 

  getExistingMessages() {
    db.collection("messages").where("participantIds", "array-contains", this.state.userValues.user)
    .get()
    .then( (querySnapshot) => {
      console.log(querySnapshot);
      var allData = [];
        querySnapshot.forEach( doc => {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
            var data = doc.data();
            data.id = doc.id;
            allData.push(data);
        });

        this.setState(prevState => ({
          userConversations: allData,
          existingMessagesLoaded: true
        }), () => {
          console.log('conversations added to state');
          console.log(this.state.userConversations);
          console.log(this.state.userConversations[0].messages.sort(this.sortMessagesFn));
        });
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });
  }

  doesConversationAlreadyExists = () => {
    console.log(this.state.myConversations);
    let conversationExists = false;
    for (const [index, el] of this.state.myConversations.entries()) {
      if(el.participants.includes(this.state.userValues.user) && el.participants.includes(this.state.messageTo)) {
        conversationExists = true;
        break;
      }
    }
    return conversationExists;
  }

  createNewConversation() {
    db.collection("messages").doc().set({
      participants: [this.state.userValues.user, this.state.messageTo], 
    });
    this.getMyConversations();
  }

  getPartnerName(conversation) {
    let partnerName = conversation.participants.filter( participant => {
      return participant.id != this.state.userValues.user;
    })
    console.log(partnerName);
    return partnerName[0].name;
  }

  sortMessagesFn(a, b) {
    const timeA = a.created.seconds;
    const timeB = b.created.seconds;

    console.log("TIMES " + timeA + " " + timeB);

    
    if (timeA < timeB) {
      return -1;
    }
    if (timeA > timeB) {
      return 1;
    }
    // a muss gleich b sein
    return 0;
  }

  handleInputChange = (event) => {
    let message = event.target.value;
    this.setState(prevState => ({
        currentMessage: message
      })
    );
  }

  submitMessage = () => {
    let messageRef = db.collection("messages").doc(this.state.currentConversation);
    let timestamp = new Date();

    messageRef.update({
      messages: firebase.firestore.FieldValue.arrayUnion({
        created: timestamp,
        message: this.state.currentMessage,
        sender: {
          id: this.state.userValues.user,
          name: this.state.userValues.username
        } 
      })
    })
  }

  render() {
    const { existingMessagesLoaded, isReadyToLoop } = this.state;
    const sortMessageFn = this.sortMessagesFn;
    
    return (
      <Layout>
        <nav className={(isReadyToLoop ? this.state.userValues.status : '')}>
          <div className="container">
            <a onClick={ this.context.router.history.goBack }>zurück</a>
            <span className="site-title">Meine Nachrichten</span>
          </div>
        </nav>
        <div className="container">
          <p>Users</p>
          { this.state.existingMessagesLoaded && this.state.userConversations.map((conversation, index) => {
            let partnerName = this.getPartnerName(conversation);
            return (
              <p>{ partnerName } </p>
            )
          })
          
          }

          <div className="messages">
            <p>Messages</p>
            { this.state.existingMessagesLoaded && this.state.messagesInCurrentConversation.sort(sortMessageFn).map((message, index) => {
                return (
                  <p className={'message ' + (message.sender.id == this.state.userValues.user ? 'right' : 'left')}>{message.message}</p>
                )
              })
            }
          </div>
          <div className="input">
            <input type="text" onChange={this.handleInputChange} />
            <button type="text" onClick={this.submitMessage}>SENDEN</button>
          </div>
        </div>
      </Layout>
    )
  }
}

export default Messages;