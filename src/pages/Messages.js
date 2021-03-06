import React, { Component } from 'react';
import Layout from '../components/Layout';
import Messenger from '../components/Messenger';
import { db } from "../firebase";
import qs from 'query-string';
import '../Stylesheets/pages/messages.scss';
import firebase from 'firebase/app';
import avatar from '../images/avatar.svg'
import $ from 'jquery';



class Messages extends Component {
  state = {
    isReadyToLoop: false,
    existingMessagesLoaded: false,
    profilePicUrlsLoaded: false,
    messageTo: '',
    currentConversationId: '',
    currentPartnerId: '',
    userConversations: [],
    profilePicUrls: {},
    messagesInCurrentConversation: []
  }

  static contextTypes = {
    router: () => null, // replace with PropTypes.object if you use them
  }

  componentWillMount() {
    var parsedUrl = qs.parse(this.props.location.search, { ignoreQueryPrefix: true }); 

    let messageTo = '';

    if(parsedUrl.to) {
      messageTo = parsedUrl.to;
    }

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
      this.getExistingMessages(); 
    });
  }

  getExistingMessages() {
    // get all my messages
    db.collection("messages").where("participantIds", "array-contains", this.state.userValues.user)
    .get()
    .then( (querySnapshot) => {
      var allData = [];
        querySnapshot.forEach( doc => {
            var data = doc.data();
            data.id = doc.id;
            allData.push(data);
        });

        this.setState(prevState => ({
          userConversations: allData,
          existingMessagesLoaded: true
        }), () => {
          this.getConversationProfilePicUrls();
          
          if(this.state.messageTo !== '') {
            let existingConv = this.checkExistingConv();
            if(existingConv.exists) {
              //open existing conversation with ID 
              this.setState(prevState => ({
                  currentConversationId: existingConv.id,
                  currentPartnerId: this.getPartnerId(existingConv.conv)
                })
              )
            } else {
              this.createNewConversation();
            }
          } else {
            //just show all current conversations
            if(this.state.userConversations.length > 0) {
              this.setState(prevState => ({
                  currentConversationId: this.state.userConversations[0].id,
                  currentPartnerId: this.getPartnerId(this.state.userConversations[0])
                })
              )
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
      id: '',
      conv: '',
    };

    for (const [index, el] of this.state.userConversations.entries()) {
      if(el.participantIds.includes(this.state.userValues.user) && el.participantIds.includes(this.state.messageTo)) {
        conversation.exists = true;
        conversation.id = el.id;
        conversation.conv = el;
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
        // new conversation was created
        const convId = conversationRef.id;
        this.getExistingMessages(); 
        this.setState(prevState => ({
            currentConversationId: convId,
            currentPartnerId: conversationPartner.user
          })
        )
      });
    });
  }

  getPartnerName(conversation) {
    let partnerName = conversation.participants.filter( participant => {
      return participant.id !== this.state.userValues.user;
    })
    return partnerName[0].name;
  }

  getPartnerId(conversation) {
    let partnerName = conversation.participants.filter( participant => {
      return participant.id !== this.state.userValues.user;
    })
    return partnerName[0].id;
  }

  async getConversationProfilePicUrls() {
    let urls = {};
    for(let i = 0; i < this.state.userConversations.length; i++) {
      await this.getProfilePicUrl(this.state.userConversations[i]).then(url => {
        urls[`${this.state.userConversations[i].id}`] = url;
      })
    };


    this.setState(prevState => ({
        profilePicUrls: urls,
        profilePicUrlsLoaded: true,
      })
    )
  }

  getProfilePicUrl(conversation) {
    return new Promise((resolve, reject) => {
      let partnerName = conversation.participants.filter( participant => {
        return participant.id !== this.state.userValues.user;
      })
  
      let partnerId = partnerName[0].id;
  
      db.collection('users').doc(partnerId).get().then((doc) => {
        let url = '';

        if(doc.data()) {
          url = doc.data().profilePicUrl;
        }
        
        resolve(url);
      });
    });
  };

  openConversation = (event) => {
    const currentConvId = event.currentTarget.getAttribute('data-conversationid');
    const partnerId = event.currentTarget.getAttribute('data-partnerid');

    $("html, body").animate({ 
      scrollTop: $('.messenger').offset().top - 25
    }, 550);

    this.setState(prevState => ({
        currentConversationId: currentConvId,
        currentPartnerId: partnerId
      })
    )
  }

  sortMessagesFn(a, b) {
    const timeA = a.created.seconds;
    const timeB = b.created.seconds;
    
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

  submitMessage = (e) => {
    e.preventDefault();
    let messageRef = db.collection("messages").doc(this.state.currentConversationId);
    let timestamp = new Date(); 

    if(this.state.currentMessage) {
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
  }

  render() {
    const { existingMessagesLoaded, isReadyToLoop } = this.state;
    
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
          { (existingMessagesLoaded && this.state.userConversations.length > 0) ?  this.state.userConversations.map((conversation, index) => {
            let partnerName = this.getPartnerName(conversation);
            let partnerId = this.getPartnerId(conversation);
            return (
              <div 
                className={'conversation ' + (conversation.id === this.state.currentConversationId ? 'active' : '' ) + ' ' + this.state.userValues.status} 
                onClick={ this.openConversation } 
                data-conversationid={ conversation.id } 
                data-partnerid={ partnerId }
                key={ conversation.id }
                >
                <div className="column left">
                  <div className="img-cropper">   
                    <img 
                      alt={ partnerName }
                      src={this.state.profilePicUrls[conversation.id] ?  this.state.profilePicUrls[conversation.id] : avatar }
                    />
                  </div>
                </div>
                <div className="column right">
                  <p>{ partnerName } </p>
                </div>
              </div>
            )
          }) : 
            <p>Noch keine Nachrichten vorhanden. Um einer Person eine Nachricht zu senden, gehen Sie auf das Profil dieser Person und klicken Sie auf "Nachricht senden".</p>
          }  
          </div>

          <div className="column right">
          {
            this.state.currentConversationId !== '' && isReadyToLoop ?
            <Messenger 
              currentConversationId={ this.state.currentConversationId }
              currentUser={this.state.userValues}
              partnerId={ this.state.currentPartnerId }
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