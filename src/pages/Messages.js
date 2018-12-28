import React, { Component } from 'react';
import Layout from '../components/Layout';
import Messenger from '../components/Messenger';
import { storageRef, db } from "../firebase";
import qs from 'query-string';
import styles from '../Stylesheets/pages/messages.scss';
import * as firebase from 'firebase';



class Messages extends Component {
  state = {
    isReadyToLoop: false,
    existingMessagesLoaded: false,
    profilePicUrlsLoaded: false,
    messageTo: '',
    currentConversationId: '',
    userConversations: [],
    profilePicUrls: {},
    messagesInCurrentConversation: []
  }

  static contextTypes = {
    router: () => true, // replace with PropTypes.object if you use them
  }

  componentWillMount() {
    var parsedUrl = qs.parse(this.props.location.search, { ignoreQueryPrefix: true }); 

    let messageTo = '';

    if(parsedUrl.to) {
      messageTo = parsedUrl.to;
    }

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
      this.getExistingMessages(); 
    });
  }

  getExistingMessages() {
    // get all my messages
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
          console.log(this.state.messageTo);

          this.getConversationProfilePicUrls();
          
          if(this.state.messageTo !== '') {
            let existingConv = this.checkExistingConv();
            if(existingConv.exists) {
              console.log('open existing cinversation with ID: ' + existingConv.id); 
              this.setState(prevState => ({
                  currentConversationId: existingConv.id
                })
              )
            } else {
              this.createNewConversation();
              console.log('create new conversation')
            }
          } else {
            console.log('just show all current conversations');
            if(this.state.userConversations.length > 0) {
              this.setState(prevState => ({
                  currentConversationId: this.state.userConversations[0].id
                })
              )
            } else {
              console.log('show empty state');
            }
          }
        });
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });
  }

  checkExistingConv = () => {
    let conversation = {
      exists: false,
      id: ''
    };

    for (const [index, el] of this.state.userConversations.entries()) {
      if(el.participantIds.includes(this.state.userValues.user) && el.participantIds.includes(this.state.messageTo)) {
        conversation.exists = true;
        conversation.id = el.id;
        console.log(conversation);
        break;
      }
    }
    return conversation;
  }

  createNewConversation() {
    db.collection("users").doc(this.state.messageTo).get().then( doc => {
      const conversationPartner = doc.data();

      const conversationRef = db.collection("messages").doc();

      conversationRef.set({
        messages: [],
        participantIds: [this.state.userValues.user, this.state.messageTo], 
        participants: [
          { 
            name: this.state.userValues.username,
            id: this.state.userValues.user
          },
          { 
            name: conversationPartner.username,
            id: conversationPartner.user
          }
        ]
      }).then(() => {
        console.log("Created new conversation");
        console.log(conversationRef);
        const convId = conversationRef.id;
        this.setState(prevState => ({
            currentConversationId: convId
          })
        )
      });
    });
  }

  getPartnerName(conversation) {
    let partnerName = conversation.participants.filter( participant => {
      return participant.id != this.state.userValues.user;
    })
    console.log(partnerName);
    return partnerName[0].name;
  }

  /*
  getProfilePicUrl(conversation) {
    let partnerName = conversation.participants.filter( participant => {
      return participant.id != this.state.userValues.user;
    })

    let partnerId = partnerName[0].id;

    db.collection('users').doc(partnerId).get().then((doc) => {
      resolve(doc.data().profilePicUrl);
    });
  }
  */

  async getConversationProfilePicUrls() {
    let urls = {};
    for(let i = 0; i < this.state.userConversations.length; i++) {
      await this.getProfilePicUrl(this.state.userConversations[i]).then(url => {
        urls[`${this.state.userConversations[i].id}`] = url;
      })
    };

    console.log(urls);

    this.setState(prevState => ({
        profilePicUrls: urls,
        profilePicUrlsLoaded: true,
      })
    )
  }

  getProfilePicUrl(conversation) {
    return new Promise((resolve, reject) => {
      let partnerName = conversation.participants.filter( participant => {
        return participant.id != this.state.userValues.user;
      })
  
      let partnerId = partnerName[0].id;
  
      db.collection('users').doc(partnerId).get().then((doc) => {
        let url = doc.data().profilePicUrl;
        resolve(url);
      });
    });
  };

  openConversation = (event) => {
    const currentConvId = event.currentTarget.getAttribute('data-conversationid');
    console.log(currentConvId);

    this.setState(prevState => ({
        currentConversationId: currentConvId
      })
    )
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
    let messageRef = db.collection("messages").doc(this.state.currentConversationId);
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
        <div className="container messages">
          <div className="column left">
          { this.state.existingMessagesLoaded && this.state.userConversations.map((conversation, index) => {
            let partnerName = this.getPartnerName(conversation);
            console.log(partnerName);
            console.log(conversation);
            console.log(this.state.profilePicUrls);
            return (
              <div 
                className={'conversation ' + (conversation.id == this.state.currentConversationId ? 'active' : '' ) + ' ' + this.state.userValues.status} 
                onClick={ this.openConversation } 
                data-conversationid={ conversation.id } 
                key={ conversation.id }
                >
                <div className="column left">
                  <div className="img-cropper">   
                    <img src={ this.state.profilePicUrls[conversation.id] } />
                  </div>
                </div>
                <div className="column right">
                  <p>{ partnerName } </p>
                </div>
              </div>
            )
          })
          }  
          </div>

          <div className="column right">
          {
            this.state.currentConversationId != '' && isReadyToLoop ?
            <Messenger 
              currentConversationId={ this.state.currentConversationId }
              currentUser={this.state.userValues}
              handleInputChange={this.handleInputChange}
              handleSubmit={this.submitMessage}
            /> : ''
          }          
          </div>
        </div>
      </Layout>
    )
  }
}

export default Messages;