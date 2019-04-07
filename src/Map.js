import { Component } from 'inferno';
import './Map.css';
import Cell from './Cell';

class Map extends Component {
    constructor(props) {
        super(props)
        this.state = {
            map : null,
            popup : null,
            point: null
        }
        this.deleteAllMarkers = this.deleteAllMarkers.bind(this)
        this.savePosition = this.savePosition.bind(this)

    }

    componentDidMount() {
        this.setState({
            map:  window.L.map('map1').setView([51.505, -0.09], 13),
            popup: window.L.popup(),
            positions:JSON.parse(localStorage.getItem("markers")),
            markers: []
          },this.initMap);
       
    }
    componentWillUnmount(){
        console.log(this.state)
    }

    initMap(){
        var osmUrl='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        var osmAttrib='Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors';
        var osm = new window.L.TileLayer(osmUrl, {minZoom: 0, maxZoom: 20, attribution: osmAttrib});
        this.state.map.addLayer(osm);
        if(this.state.positions !=null){
            for(let pos of this.state.positions){
                this.paintMarker(pos);
            }
        }
        this.state.map.on('click', this.addMarker.bind(this));
        console.log(this);
    }

    markersToPos(){
        var markers = this.state.markers;
        var positions = markers.map((marker) => marker._latlng);
        this.setState({positions:positions});
    }

    addMarker(e) {
        console.log(this.state.positions)
        this.deleteAllMarkers();
        var marker = this.paintMarker(e.latlng)
    }

    paintMarker(pos) {
        var markers = this.state.markers;
        var marker = window.L.marker(pos).addTo(this.state.map);
        markers.push(marker);
        var posString = pos.lat.toString().substring(0,6)+", "+pos.lng.toString().substring(0,6)
        this.setState({
            point: pos,
            posString: posString,
            markers: markers
        })
        return marker
    }
    deleteAllMarkers(){
        var markers = this.state.markers;
        for(var i=0;i<markers.length;i++) {
            this.state.map.removeLayer(markers[i]);
        }  
        this.setState({
            markers: [],
            point: "Nirgends"
        });
    }
    addPointToPos(point) {
        this.setState(prevState => ({
            positions: [...prevState.positions, point]
          }))
    }
    savePosition(){
        //this.markersToPos();
        this.addPointToPos(this.state.point)
        console.log(this.state)
        this.saveMarkers();
    }
    saveMarkers(){
        localStorage.setItem("markers",JSON.stringify(this.state.positions));
    }
    render() {
      return (
        <div class="background">
            <div class="pure-g">
                <div class="pure-u-1">
                    <div id="map1"></div>
                </div>
                <div class="pure-u-1">
                    <p> Jetzige Position:   {this.state.posString}</p>
                </div>
                <div class="pure-u-7-24"/>
                <div class="pure-u-10-24">
                    { this.state && this.state.positions &&
                    <Cell positions={this.state.positions} onClick={this.paintMarker.bind(this)}/>
                    }
                </div>
                <div class="pure-u-7-24"/>
            </div>
            <div class="footer pure-g">
                <div class="pure-u-2-5">
                    <button class="pure-button pure-button-primary button-error" onClick={this.deleteAllMarkers}>Löschen</button>
                </div>
                <div class="pure-u-1-5"></div>
                <div class="pure-u-2-5">
                    <button class="pure-button pure-button-primary button-success" onClick={this.savePosition}>Save</button>
                </div>
            </div>
        </div>
      );
    }
  }
  
  export default Map;
  