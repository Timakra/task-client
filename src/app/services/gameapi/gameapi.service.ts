import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import distance from '@turf/distance';
import { IfStmt } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class GameapiService {

  //Collision radius in km
  collisionRadius :number = 0.01;
  
  //Goal spawn radius in km
  goalSpawn :number = 1;


  constructor(private http : HttpClient) { }
  //Gets a random position of goal from server
  getGoalPosition(userPostion:google.maps.LatLng){
    let body = {
      userPosition:[userPostion.lng() ,userPostion.lat()],
      radius:this.goalSpawn,
    }
    console.log(body);
    return this.http.post('http://127.0.0.1:3001/getGoalPos',body)
  }
  //checks if there was a collision with the goal
  checkColision(userPosition :google.maps.LatLng,goalPosition:google.maps.LatLng){

    let userPoint = [userPosition.lng(),userPosition.lat()];
    let goalPoint = [goalPosition.lng(),goalPosition.lat()];

    //checking client side of there is a colision
    let colision = distance(userPoint,goalPoint,{units:"kilometers"}) - this.collisionRadius < 0;
    if(colision){
      console.log("GOOOOOAL")

      
      //making sure with the server that there is a colision 
      //BTW not real apllication becase both cordinate come from here
      this.http.post('http://127.0.0.1:3001/colision',{
        userPosition: userPoint,
        goalPosition:goalPoint,
        radius:this.collisionRadius,
      }).subscribe((data:any)=>{
        if(data.colissionCheck){
          //alerts goal when the distance between the goal and the user is less then the radius
          alert("GOAAAAAAAAAAAAAAAAAAAAL!!!!")
        }
      })
    }
  }

}
