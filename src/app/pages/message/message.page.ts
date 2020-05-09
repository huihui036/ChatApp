import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { PopoverComponent } from 'src/app/components/popover/popover.component';
import { ServersService } from 'src/app/server/servers.service';
import { ServerDatas } from 'src/app/http/server/server.module';


@Component({
  selector: 'app-message',
  templateUrl: './message.page.html',
  styleUrls: ['./message.page.scss'],
})
export class MessagePage{

  isVisible = false;
  public text: string='';
  public ws;
  public demoji:boolean = true
  public emojis:any[]

  public username: string;
  public fridens:any
  userdata:any=window.localStorage.getItem("userdata")||''

  constructor(public popoverController: PopoverController,private http: ServersService,private Servers: ServerDatas) {}
  
  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      event: ev,
      translucent: true,
      mode:"ios",
      showBackdrop:true,
      backdropDismiss:true
    });
    return await popover.present();
  }
  ngOnInit(): void {
 
    //this.userdata = JSON.parse(this.userdata)
    this.username = this.Servers.username || 'e';
    this. findeusers()
  }
 
//获取好友列表
async findeusers(){

  const frieds:any = await this.http.get(`/fiends/${this.username}`)
  if(frieds.errs){
   this.fridens =[{"firendsname":"您还没有好友"}]
  }else{
  
   this.fridens =frieds
  }

  console.log(frieds)

 }

   //进入聊天
   loginchat(username){
    window.sessionStorage.setItem("firdens",username)
 
     console.log(username)
   }

}
