import { Component, OnInit } from '@angular/core';
import { ServersService } from 'src/app/server/servers.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-addfriends',
  templateUrl: './addfriends.page.html',
  styleUrls: ['./addfriends.page.scss'],
})
export class AddfriendsPage implements OnInit {
 public friendsemali = ''
 public namesyour
 public usercode
  constructor(private http: ServersService, private router: Router,) { }

  ngOnInit() {
    this.namesyour = window.localStorage.userdata
    this.namesyour = JSON.parse( this.namesyour)
    console.log( this.namesyour.usrename)
  }
 async serach(){
    console.log("123")

    let user = {
      friendsemali: this.friendsemali,
    
    }
    //this.http.get(``)
    console.log(user)
    let getuser: any = await this.http.post(`/adduser/${this.namesyour.usrename}`, user)
    console.log(getuser)
  //  getuser = JSON.parse(getuser)
    this.usercode = getuser.code
  }
}
