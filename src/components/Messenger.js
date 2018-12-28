import React, { Component } from 'react';
import { Link } from "react-router-dom"; 
import { storageRef, db } from "../firebase";
import styles from '../Stylesheets/components/Messenger-style.scss';




class Messenger extends Component {

  state = {
    messagesInCurrentConversation: [],
    conversationLoaded: false,
    userValues: this.props.currentUser
  }

  unsubscribeListener = '';

  subscribe() {
    console.log(this.props.currentConversationId);
    this.unsubscribeListener = db.collection("messages").doc(this.props.currentConversationId)
    .onSnapshot( doc => {
        //var source = doc.metadata.hasPendingWrites ? "Local" : "Server";
        let conversation = doc.data();
        let messages = conversation.messages;
        let partnerName = this.getPartnerName(conversation);
        this.setState(prevState => ({
            messagesInCurrentConversation: messages,
            conversationLoaded: true,
            currentConversation: conversation,
            partnerName: partnerName
          })
        )
    })
  }

  componentDidUpdate = (prevProps) => {
    console.log('DID UPDATE');
    if(prevProps.currentConversationId !== this.props.currentConversationId) {
      console.log('unsubscribe listener');
      this.unsubscribeListener();
      this.unsubscribeListener = '';
      this.subscribe();
    }

    this.refs.messages.scrollTop = this.refs.messages.scrollHeight; 
  }

  componentDidMount() {
    console.log('DID MOUNT');
    console.log(this.props.currentConversationId);
    this.subscribe();
  }

  componentWillUnmount = () => {
    //this.unsubscribeListener();
  }
  
  clearInputField() {
    this.refs.messageToSend.value = ''; 
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

  render() {
    return (
      <div className="messenger">
        <p className='title'>Unterhaltung mit {this.state.partnerName}</p>
        <div className="messages" ref='messages'>
          { this.state.conversationLoaded && this.state.messagesInCurrentConversation.sort(this.sortMessageFn).map((message, index) => {
              return (
                <p className={'message ' + (message.sender.id == this.state.userValues.user ? 'right' : 'left') + ' ' + this.state.userValues.status } key={ index }>
                  <span>
                    {message.message}
                  </span>
                </p>
              )
            })
          }
        </div>
        <div className="input">
          <textarea ref='messageToSend' onChange={this.props.handleInputChange} />
          <button type="text" onClick={() => {
            this.props.handleSubmit();
            this.clearInputField();
          }}>SENDEN</button>
        </div>
      </div>
    )
  }  
}

export default Messenger;