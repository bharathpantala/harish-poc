import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmpDataService } from '../app.model';
import { HttpClient,HttpHeaders } from "@angular/common/http";
import {Headers,RequestOptions} from '@angular/http';
import {  FileUploader } from 'ng2-file-upload';


@Component({
    selector: 'addPalletSheet',
    templateUrl: './addPalletSheet.html',
    styleUrls: ['./addPalletSheet.css'],
    providers: []
})

export class AddPalletSheetComponent implements OnInit {
    public employees: any = {};
    public errorMsg: any = [];
    filename:string;
    path:string;
    url_='http://localhost:3000/product/upload-exel'
    public uploader :FileUploader = new FileUploader({
      url:this.url_
    });
    out:any;
    
    

    constructor(public router: Router,public http:HttpClient,
        public EmpDataService: EmpDataService) {
          // this.uploader.onCompleteItem=(item:any,response:any,status:any,headers:any)=>{
          //   this.out=(JSON.parse(response));
          //}
    }

    ngOnInit() {
       var  now = new Date(); 
      var sessionExpirytime = this.getSessionExpiry();
    }
  

getSessionExpiry = () => {
    var cookies = document.cookie.split(';')
    if(cookies.length > 0 && cookies[0] !== ''){
      let sessionExpiry = cookies.map((c) => c.trim()).find((c) => c.match(/^sessionExpiry/) && c.match(/^sessionExpiry/).length > 0);
       sessionExpiry = sessionExpiry && sessionExpiry.split('=')[1];
      return sessionExpiry;
    }
    else{
      return '';
    }
  }
  onFileChanged(event) {
    this.filename= event.target.files[0].name;
    this.uploader.onAfterAddingFile = (fileItem:any) => {
      fileItem.withCredentials = false;
    }
    }
}
  