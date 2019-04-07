import { Component } from 'inferno';
import './Cell.css';

class Cell extends Component {
    constructor(props) {
        super(props)
        console.log(props)
        this.state = {
            data: props.positions
        }
    }

    componentDidMount() {

    }
    componentWillUnmount(){
      
    }
    click(pos){

    }
    render() {
      return (
        <div class="pure-menu pure-menu-scrollable">
            <ul class="pure-menu-list">
                {this.props.positions.map(position => (
                    <li class="pure-menu-item"><a href="#" class="pure-menu-link">{position.lat.toString().substring(0,6)+", "+position.lng.toString().substring(0,6)}</a></li>
                ))}
            </ul>
       </div>
      );
    }
  }
  
  export default Cell;
  