import { auth } from "../firebase";

it('listens on user change', () => {
  auth.onAuthStateChanged(user => {
    if(user) {
      console.log(user)
      this.setState({
        isSignedIn: true,
        loading: false,
        user: user
      });
      localStorage.setItem('user', user.uid);
      console.log(localStorage.getItem('user'));
    } else {
      console.log("not logged in");
      this.setState({
        isSignedIn: false,
        loading: false
      });
      localStorage.removeItem('user');
      console.log(localStorage.getItem('user'));
    }
  });
});
