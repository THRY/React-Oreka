import { auth } from "../firebase";

it('listens on user change', () => {
  auth.onAuthStateChanged(user => {
    if(user) {
      this.setState({
        isSignedIn: true,
        loading: false,
        user: user
      });
      localStorage.setItem('user', user.uid);
    } else {
      this.setState({
        isSignedIn: false,
        loading: false
      });
      localStorage.removeItem('user');
    }
  });
});
