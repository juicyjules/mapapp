import { Component } from 'inferno';
import Map from './Map';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <p> Mapapp</p>
        </header>
        <Map></Map>
      </div>
    );
  }
}

export default App;
