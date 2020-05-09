import { Component, OnInit } from '@angular/core';
import { ServersService } from 'src/app/server/servers.service';
import { Router } from '@angular/router';
import { ServerDatas } from 'src/app/http/server/server.module';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  username: string = '';
  password: string = '';

  usernamere: string = '';
  passwordre: string = '';
  emailre:string ='';
  public setlogin:boolean =false
  public usercode
  // public register:boolean =true
  constructor(private http: ServersService, private router: Router, private Servers: ServerDatas) { }

  ngOnInit() {
  }
  async Login() {

    let user = {
      username: this.username,
      password: this.password
    }
    //this.http.get(``)
    console.log(user)
    const getuser: any = await this.http.post('/login', user)
    console.log(getuser)

    if (getuser && getuser.msg) {

      this.Servers.username = getuser.user
      window.localStorage.setItem("tonkes", getuser.msg)

      window.localStorage.setItem("userdata",JSON.stringify({
        uid:getuser.uid,
        usrename:getuser.user
      }))
      this.router.navigate(['/tabs/message'])
    }

  }
  register(){
    this.setlogin = !this.setlogin
  }
  async registernow(){
    let user = {
      username: this.usernamere,
      password: this.passwordre,
      email: this.emailre
    }
    console.log(user)
    const users: any = await this.http.post('/register', user)
    this.usercode = users.code
    console.log(users)

  }
}
