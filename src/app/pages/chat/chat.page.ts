import { Component, OnInit } from '@angular/core';
import { ServersService } from 'src/app/server/servers.service';
import { ServerDatas } from 'src/app/http/server/server.module';

import { HmacSHA1 } from 'crypto-js';

import * as $ from 'jquery'

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage {
  public chatdatas: any[] = []
  public chatdatas2: any[] = []
  public username: string;
  public text: string = '';
  public fiesupload: boolean = false
  public ws;
  public dispnone: boolean = false

  public emojis: any[];
  public demoji: boolean = true;
  public eojios: string
  public delettexid
  public madi
  public withdrawconter

  userdata: any = window.localStorage.getItem("userdata") || ''
  constructor(private http: ServersService, private Servers: ServerDatas) { }


  ngOnInit(): void {
    this.userdata = JSON.parse(this.userdata)
    this.userdata = this.Servers.username || this.userdata;
    this.getemoji()
    this.connectWs()
    this.eojios = 'emjioacrive'
    this.madi = 'madi'
  }
  // microphone(event) {
  //   console.log(event)
  // }
  // image(event) {
  //   console.log(event)
  // }
  // camera(event) {
  //   console.log(event)
  // }
  emoji() {
    this.demoji = !this.demoji
    if (this.demoji) {
      this.eojios = 'emjioacrive'
    } else {
      this.eojios = ''
    }
  }
  file(event) {
    console.log(event)
  }
  // 获取表情包
  async getemoji() {
    let emojis: any = await this.http.get('/emoji')
    console.log(emojis)
    var data = emojis
    var request = window.indexedDB.open('Chatmojis', 1)
    // 数据库操作过程中出错，则错误回调被触发
    request.onerror = (event) => {
      console.log(event)
    }
    // 创建一个新的数据库或者修改数据库版本号时触发
    request.onupgradeneeded = (event: any) => {
      let db = event.target.result
      let objectStore = db.createObjectStore('emoji', { keyPath: 'id' })

      // 确保在插入数据前对象仓库已经建立
      objectStore.transaction.oncomplete = () => {
        // 将数据保存到数据仓库
        var usersObjectStore = db.transaction('emoji', 'readwrite').objectStore('emoji')
        //   console.log(data)
        data.forEach(data => {
          usersObjectStore.add(data)
        })
      }
    }

    request.onsuccess = (event: any) => {
      let db = event.target.result
      // 数据读取
      let usersObjectStore = db.transaction('emoji').objectStore('emoji')
      let userRequest = usersObjectStore.getAll()
      userRequest.onsuccess = (event) => {
        this.emojis = event.target.result

      }
    }

  }
  connectWs() {
    if (this.ws != null) { this.ws.close() };
    this.ws = new WebSocket('ws://127.0.0.1:3002');
    const that = this;
    // tslint:disable-next-line: only-arrow-functions
    let fridensname = window.sessionStorage.getItem('firdens') || ''
    this.ws.onopen = function (event) {
      // socket 开启后执行，可以向后端传递信息
      that.ws.send(JSON.stringify({
        uid: that.userdata.uid,
        nickname: that.userdata.usrename,
        privatechat: 2,
        type: 'setname',
        firdensname: fridensname,
        filesmd5: '',
        //   name: that.username
        // bridge: [19, 22]
      }));

    }

    // 发送语音
    // 语音
    let chunks = [];

    const constraints = { audio: true };
    if (navigator.mediaDevices.getUserMedia) { }

    navigator.mediaDevices.getUserMedia(constraints).then(
      stream => {
        console.log("授权成功！");
        //  var MediaRecorder
        // @ts-ignore
        const mediaRecorder = new MediaRecorder(stream);
        $('.record-btn').click(function () {
          if (mediaRecorder.state === "recording") {
            mediaRecorder.stop();
            console.log("录音借宿")
            that.madi = 'madi'
            //    $('.record-btn').html("record");

          } else {
            mediaRecorder.start();
            console.log("录音中...");
            that.madi = ''
            //  $('.record-btn').html("stop");

          }

        })
        mediaRecorder.ondataavailable = e => {
          chunks.push(e.data);
        };
        mediaRecorder.onstop = async e => {
          console.log(chunks)
          var blob = new Blob(chunks, { type: "audio/mp3; codecs=opus" });
          chunks = [];
          //  var audioURL = window.URL.createObjectURL(blob);
          // $('.audio-player').attr("src", audioURL);

          let form = new FormData();
          form.append("file", blob);

          console.log(form)

          // let readers = new FileReader();  //调用FileReader

          $.ajax({
            type: 'post',
            url: "http://127.0.0.1:3006/uploads",
            data: form,
            contentType: false,
            processData: false,
            cache: false,    //缓存
            success: function (r) {

            }
          })
        };
        console.log(mediaRecorder.state);

      })

    // 文件 发送
    $("#uploadfile").change(function () {

      that.fiesupload = true

      var filesd: any = $(this)[0]
      var files: any = filesd.files[0];    //获取文件信息
      var form = new FormData();
      console.log(files)
      form.append("file", files);
      console.log(form)
      var reader = new FileReader();  //调用FileReader
      let a = reader.readAsDataURL(files);
      reader.onload = async function (evt) {
        // console.log(evt.target.result)
        let c = new Promise((resolve, reject) => {
          // @ts-ignore
          resolve(HmacSHA1(evt.target.result, "Key"))
        })

        // let a = HmacSHA1(evt.target.result, "Key")
        let newmd5: any = await c

        if (newmd5.words.length > 0) {
          that.fiesupload = false
          $.ajax({
            type: 'post',
            url: "http://127.0.0.1:3006/upload",
            data: form,
            contentType: false,
            processData: false,
            cache: false,    //缓存
            success: function (r) {
            }
          })
        }

        console.log("a:", newmd5.words)
        if (newmd5.words.length > 0) {
          that.ws.send(JSON.stringify({
            privatechat: 2,
            nickname: that.userdata.usrename,
            filesmd5: newmd5.words,
            firdensname: fridensname,
            //type: "images"
            type: 'files',

          }));
        }
      }


    })

    //返回的数据
    this.ws.onmessage = function (e) {
      let saytext = JSON.parse(e.data)
      // that.chatdatas2.push(saytext)
      that.chatdatas.push(saytext)
      that.chathisory(that.chatdatas)
      if (saytext.type == 'withdrawtex') {
        that.didh(saytext.saytext)
      }
      // that.chatdatas.push(saytext)
    };

    this.ws.onerror = function (event) {
      //socket error信息;
      console.log(event);

    };
    this.ws.onclose = function () {
      //socket 关闭后执行;

    };

  }
  // 选择发送到的表情包
  senemjos(e) {
    this.text += e.target.innerHTML
    console.log(e.target.innerHTML)
  }
  //发送文字
  sendtext() {
    console.log(this.text)
    let fridensname = window.sessionStorage.getItem('firdens') || ''
    //console.log(22)
    this.ws.send(JSON.stringify({
      text: this.text,
      uid: this.userdata.uid,
      nickname: this.userdata.usrename,
      privatechat: 2,
      type: 'textsay',
      filesmd5: '',
      //  bridge: [22]
      firdensname: fridensname,
      statacode:1 // 1 没有撤回的  0撤回的

    }));
    this.text = ''
  }
  addtods() {
    this.sendtext()
  }
  btnsentext() {
    this.sendtext()
  }

  // 语音播放
  palyatio(url) {
    let audio = new Audio(url);
    audio.play();
    console.log(url);
  }


  // 聊天数据库

  chathisory(datas) {
    let db
    let that = this
    console.log("data:", that.chatdatas2)
    const request = window.indexedDB.open('DATA_chat', 1)

    request.onsuccess = function (event: any) {
      db = event.target.result
      console.log('execute onsuccess');
      const transaction = db.transaction(['users'], 'readwrite')
      const objectStore = transaction.objectStore('users')
      datas.forEach(element => {
        objectStore.put(element)
      });
      //清除数组防止数据重复
      datas.shift()
      // 查询数据库结果渲染到页面
      let userRequest = objectStore.getAll()

      userRequest.onsuccess = (event) => {
        that.chatdatas2 = event.target.result

        console.log("event.target.result", event.target.result)

      }

    };
    request.onupgradeneeded = function (event: any) {
      db = event.target.result
      console.log('execute onupgradeneeded');
      const objectStore = db.createObjectStore('users', { keyPath: 'id', autoIncrement: true })
      objectStore.createIndex("saytext", "saytext", { unique: false });
      console.log(datas)
      objectStore.transaction.oncomplete = function (event) {
        const transaction = db.transaction(['users'], 'readwrite')
        const objStore = transaction.objectStore('users')
        datas.forEach(element => {
          objStore.add(element)
        });

      }

    }

  }

  //删除聊天

  delet(id) {
    const request = window.indexedDB.open('DATA_chat', 1)
    request.onsuccess = (ev: any) => {
      let db = ev.target.result;
      let transaction = db.transaction(['users'], 'readwrite');
      let objectStore = transaction.objectStore('users');
      let delRequest = objectStore.delete(id);

      delRequest.onsuccess = function (event) {
        console.log('数据删除成功');
      };
      delRequest.onerror = function (event) {
        console.log('数据删除失败');
      };
    }
    this.chathisory(this.chatdatas)
    //隐藏按钮
    this.dispnone = false
  }
  // 长按
  doPress(id, text) {
    this.delettexid = id;
    this.withdrawconter = text;
    this.dispnone = true;
    console.log(id, text);
    
  }
  // 撤回聊天

  withdraw(drawstex) {
    console.log(drawstex);
    this.withdrawtex()
   this.withdrawdb(drawstex)
    
  }
  // 撤回的消息
  didh(saytext) {
    console.log("这是一条撤回的消息")
    this.withdrawdb(saytext)
    this.chathisory(this.chatdatas)
  }
  withdrawdb(tex) {
    const request = window.indexedDB.open('DATA_chat', 1);
    request.onsuccess = (ev: any) => {
      let db = ev.target.result;
      let transaction = db.transaction(['users'], 'readwrite');
      let objectStore = transaction.objectStore('users');
      let indexs = objectStore.index('saytext');
      console.log("key:",tex)
   //   objectStore.delete(5);
     let getRequest = indexs.get(tex);

      getRequest.onsuccess = function (event) {
        console.log('成功', event.target.result);
        event.target.result.statacode = 0
        objectStore.put(event.target.result);
       if(event.target.result.statacode == 0 || event.target.result.type =='withdrawtex' ){
         
        objectStore.delete(event.target.result.id);
        
       }
        console.log(event.target.result.id)
      //  objectStore.delete(event.target.result.id);

      };
      getRequest.onerror = function (event) {
        console.log('失败');
      };
    }
  }
  withdrawtex() {
    console.log(this.withdrawconter);
    let fridensname = window.sessionStorage.getItem('firdens') || '';
    //console.log(22)
    this.ws.send(JSON.stringify({
      text: this.withdrawconter,
      uid: this.userdata.uid,
      nickname: this.userdata.usrename,
      privatechat: 2,
      type: 'withdrawtex',
      filesmd5: '',
      //  bridge: [22]
      firdensname: fridensname

    }));

  }
}
