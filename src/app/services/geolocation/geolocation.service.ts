import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MapBaseLayer } from '@angular/google-maps';

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {
  userPosition : BehaviorSubject<google.maps.LatLng> = new BehaviorSubject(new google.maps.LatLng(0,0));
  // if the user location is set to the defaul 0,0 or was changed
  defaultLocation : BehaviorSubject<Boolean> = new BehaviorSubject( new Boolean(true) );

  constructor() {
    //sets default location to user location or to 0,0 if unavailble
  
  if (navigator.geolocation) {
    //watches for users movment
    navigator.geolocation.watchPosition(position => {
      //get new coordantes 
      let currentLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);

      this.userPosition.next(currentLocation);
      this.defaultLocation.next(false);
    });
    
  }
  else {
    alert("Geolocation is not supported by this browser.");
  }
  }
  
  //Gets users current location;
}
