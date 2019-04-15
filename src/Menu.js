import { Component, createRef } from 'inferno';
import './Menu.css';

class Menu extends Component {

    constructor(props) {
        super(props)
        console.log(props)
        this.state = {
            class: "out"
        }
        this.toggleButton = createRef();
        this.toggleOwn = this.toggleOwn.bind(this)
    }

    componentDidMount() {

    }
    componentWillUnmount(){
      
    }

    componentWillReceiveProps(){
        this.setState({
            class: this.props.open ? "in" : "out"
        })
    }

    toggleOwn(){
        this.toggleButton.current.classList.toggle('selected');
        this.props.toggleOwn();
    }
    render() {
        return (
            <div class={this.state.class + " menu pure-menu custom-restricted-width"}>
                <span class="pure-menu-heading">Menü</span>
                <ul class="pure-menu-list">
                    <li class="pure-menu-item danger"><a onClick={this.props.delete} class="pure-menu-link">Alles Löschen</a></li>
                    <li class="pure-menu-item toggle"><a onClick={this.toggleOwn} href="#" ref={this.toggleButton} class="pure-menu-link">Manuell Setzen</a></li>
                </ul>
            </div>
        );
    }
}
export default Menu;