import { Component, createRef } from 'inferno';
import Map from './Map';
import './App.css';
import Menu from './Menu';
class App extends Component {
  constructor(props){
    super(props)
    this.state = {
        menuOpen: false
    }
    this.map = createRef();
    this.deleteAllMarkers = this.deleteAllMarkers.bind(this)
    this.toggleAddOwn = this.toggleAddOwn.bind(this)
  }
  toggleMenu(){
    this.setState(prevState => ({
      menuOpen: !prevState.menuOpen
    }));
  }
  deleteAllMarkers(){
    console.log(this.map);
    this.map.current.deleteAllMarkers();
  }
  toggleAddOwn(){
    this.map.current.toggleAddOwn();
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <p>PlaceZapper</p>
          <i onClick={(this.toggleMenu).bind(this)} class="fa fa-hamburger"></i>
        </header>
        <Menu open={this.state.menuOpen} delete = {this.deleteAllMarkers} toggleOwn = {this.toggleAddOwn}/>
        <Map ref={this.map}></Map>
      </div>
    );
  }
}

export default App;
