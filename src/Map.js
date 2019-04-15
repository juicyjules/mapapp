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
        this.setCurrentPos = this.setCurrentPos.bind(this)
        this.toggleAddOwn = this.toggleAddOwn.bind(this)
        this.panToPos = this.panToPos.bind(this)
    }   

    componentDidMount() {
        this.setState({
            map:  window.L.map('map1').setView([51.505, -0.09], 13),
            popup: window.L.popup(),
            positions:JSON.parse(localStorage.getItem("markers")),
            markers: [],
            curMarker: null,
            markers2Save: [],
            setOwn: false
          },this.initMap);
       
    }
    componentWillUnmount(){
        console.log(this.state)
    }
   
    initMap(){
        navigator.geolocation.getCurrentPosition((function(location) {
            var lat = location.coords.latitude;
            var lng = location.coords.longitude;
            this.state.map.panTo(new window.L.LatLng(lat, lng));
        }).bind(this));
        setInterval(this.setCurrentPos,1000);

        var osmUrl='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        var osmAttrib='Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors';
        var osm = new window.L.TileLayer(osmUrl, {minZoom: 2, maxZoom: 20, attribution: osmAttrib});
        this.state.map.addLayer(osm);

        if(this.state.positions !=null){
            for(let pos of this.state.positions){
                this.paintMarker(pos);
            }
        }
        this.state.map.on('click', this.addMarker.bind(this));
    }

    panToPos(){
        if(this.state.curMarker !== null){
            this.state.map.panTo(this.state.curMarker._latlng);
        }
    }
    toggleAddOwn(){
        var setOwnNew = !this.state.setOwn
        this.setState({
            setOwn: setOwnNew
        })
    }
    markersToPos(){
        var markers = this.state.markers;
        var positions = markers.map((marker) => marker._latlng);
        this.setState({positions:positions});
    }

    prepareMarkerForSave(){
        var markers = this.state.markers2Save;
        var positions = markers.map((marker) => marker._latlng);
        this.setState(prevState => ({
            positions:[...prevState.positions, ...positions],
            markers2Save: []
        }));
        console.log(this.state)
    }

    setCurrentPos(){
        navigator.geolocation.getCurrentPosition((function(location) {
            var lat = location.coords.latitude;
            var lng = location.coords.longitude;
            this.addPosMarker({lat:lat,lng:lng})
        }).bind(this));
    }

    addMarker(e) {
        if(this.state.setOwn){
            var marker = this.paintMarker(e.latlng,false);
            this.setState(prevState => ({
                markers2Save: [...prevState.markers2Save, marker]
            }));
        }
    }

    addPosMarker(e) {
        if(this.state.curMarker!=null){
            this.state.map.removeLayer(this.state.curMarker);
        }
        var marker = this.paintMarker(e,true);
        this.setState({
            curMarker: marker
            });
    }

    removeMarker(marker){
        marker._map.removeLayer(marker);
        this.removePointFromPos(marker._latlng)
        this.removeMarkerFromMarkers(marker)
        this.removeMarkerFromMarkers2Save(marker);
    }

    paintMarker(pos,changePos) {
        var markers = this.state.markers;
        var marker = window.L.marker(pos).addTo(this.state.map);
        if(!changePos){
        marker.on("click", (function(e){
            console.log(e)
            console.log(marker)
            marker.bindPopup((function(e){
                console.log(e);
                var inputElement = document.createElement('button');
                inputElement.type = "button"
                inputElement.innerHTML= "remove"
                inputElement.className = "pure-button pure-button-primary button-error"
                inputElement.stlye= ""
                inputElement.addEventListener('click', (function(){
                    this.removeMarker(e);
                }).bind(this));
                return inputElement
            }).bind(this)
            ).openPopup();
            // e.target._map.removeLayer(e.target);
            //this.removePointFromPos(e.target._latlng)
            //this.removeMarkerFromMarkers(e.target)
            //this.removeMarkerFromMarkers2Save(e.target);
            }).bind(this));
        } else {
            marker.on("click", (function(e){
                return true;
            }));
        }
        markers.push(marker);
        var posString = pos.lat.toString().substring(0,6)+", "+pos.lng.toString().substring(0,6)
        this.setState(prevState =>({
            point: pos,
            posString: changePos ? posString : prevState.posString,
            markers: markers
        }));
        return marker
    }
    deleteAllMarkers(){
        this.state.map.eachLayer((function(layer){
            if(layer._url === undefined){
                this.state.map.removeLayer(layer);
            }
        }).bind(this));
        this.setState({
            markers: [],
            positions: [],
            posString: "",
            markers2Save:[]
        },this.saveMarkers);
    }
    removeMarkerFromMarkers(marker){
        this.setState(prevState => ({
            markers: prevState.markers.filter( (t) => { return t!= marker})
          }))
    }

    removeMarkerFromMarkers2Save(marker){
        this.setState(prevState => ({
            markers: prevState.markers2Save.filter( (t) => { return t!= marker})
          }))
    }

    addMarkerToMarkers(marker){
        this.setState(prevState => ({
            markers: [...prevState.positions, marker]
        }));
    }

    removePointFromPos(point) {
        this.setState(prevState => ({
            positions: prevState.positions.filter( (t) => { return t.lat != point.lat && t.lng != t.lnt})
          }))
    }
    addPointToPos(point) {
        this.setState(prevState => ({
            positions: [...prevState.positions, point]
          }))
    }
    savePosition(){
        this.prepareMarkerForSave();
        this.addPointToPos(this.state.curMarker._latlng)
        this.addMarkerToMarkers(this.state.curMarker);
        this.setState({
            curMarker:null
        })
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
                    <p> Jetzige Position:   {this.state.posString} </p>
                </div>
                <div class="pure-u-1">
                    <button class="pure-button pure-button-primary fixed-wide" onClick={this.panToPos}>Go Here</button>
                </div>
                <div class="pure-u-1-5"></div>
                <div class="pure-u-3-5 hide-overflow">
                        { this.state && this.state.positions && this.state.map &&
                        <Cell positions={this.state.positions} onClick={this.paintMarker.bind(this)} map={this.state.map} />
                        }
                </div>
                <div class="pure-u-1-5"></div>
            </div>
            <div class="footer pure-g">
                <div class="pure-u-1">
                    <button class="pure-button pure-button-primary button-success fixed-wide" onClick={this.savePosition}>Ort Merken</button>
                </div>
            </div>
        </div>
      );
    }
  }
  
  export default Map;
  