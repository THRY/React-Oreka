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
        let messages = doc.data().messages;
        this.setState(prevState => ({
          messagesInCurrentConversation: messages,
          conversationLoaded: true
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
  }

  componentDidMount() {
    console.log('DID MOUNT');
    console.log(this.props.currentConversationId);
    this.subscribe();
  }

  componentWillUnmount = () => {
    //this.unsubscribeListener();
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
      Current Conversation {this.props.currentConversation}
      <p>Messages</p>
        { this.state.conversationLoaded && this.state.messagesInCurrentConversation.sort(this.sortMessageFn).map((message, index) => {
            return (
              <p className={'message ' + (message.sender.id == this.state.userValues.user ? 'right' : 'left')}>{message.message}</p>
            )
          })
        }
        
        <div className="input">
          <input type="text" onChange={this.props.handleInputChange} />
          <button type="text" onClick={this.props.handleSubmit}>SENDEN</button>
        </div>
      </div>
    )
  }  
}

export default Messenger;