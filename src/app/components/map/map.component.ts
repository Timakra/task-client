import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { GeolocationService } from '../../services/geolocation/geolocation.service';
import { GameapiService } from '../../services/gameapi/gameapi.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, AfterViewInit {
  //Google map instance
  mapInstance! : google.maps.Map;
  // User and goal markers
  markers :{userMarker?:google.maps.Marker,goalMarker?:google.maps.Marker} = {};

  // Tracks user location 
  userLocation : google.maps.LatLng = new google.maps.LatLng(0,0);
  // Goal location 
  goalLocation! : google.maps.LatLng;

  // if user location is defaul 0,0
  defaultLocation : Boolean = true;
  // if the goal was set
  goalPositioned:Boolean = false;

  constructor(private geoLocationService :GeolocationService,
              private gameApi : GameapiService
    ) { }

  ngOnInit(): void {
    // initaializrd map instance with user location in the center
    this.mapInstance = new google.maps.Map(document.getElementById('map') as HTMLElement,{
      center: this.userLocation,
      zoom:16
    });

    //tracks user movment
    this.geoLocationService.userPosition.subscribe((userLocation)=>{
      this.userLocation = userLocation;
      this.mapInstance.setCenter(userLocation);
      if(this.markers?.userMarker){
        this.markers.userMarker.setMap(null);
      }

      this.markers.userMarker = new google.maps.Marker({
        icon:'/assets/ball.png',
        position: userLocation,
        map:this.mapInstance,
      })

      if(this.markers.goalMarker && this.markers.userMarker){
        this.gameApi.checkColision(this.userLocation,this.goalLocation);
      }
    })
    this.geoLocationService.defaultLocation.subscribe((dl)=>{
      this.defaultLocation = dl;
      if(!dl && !this.goalPositioned){
        this.goalPositioned = true;
        //gets goal location if the userlocation is not set to default 0,0 and if goal was not set yet
        this.gameApi.getGoalPosition(this.userLocation).subscribe((data:any)=>{
          //Sets goal location to random point on the circle
          this.goalLocation = new google.maps.LatLng(data.randomGoal[0],data.randomGoal[1]);
          this.goalPositioned = true;
          //Adds marker to the map
          this.markers.goalMarker = new google.maps.Marker({
            icon:'/assets/goal.png',
            position: this.goalLocation,
            map:this.mapInstance,
          })          
        })
      }
    })
  }
  ngAfterViewInit(){

  }

}
