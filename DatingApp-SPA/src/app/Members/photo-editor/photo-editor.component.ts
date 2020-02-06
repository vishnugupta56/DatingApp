import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Photo } from 'src/app/_models/Photo';
import { FileUploader } from 'ng2-file-upload';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/_Services/Auth.service';
import { UserService } from 'src/app/_Services/User.service';
import { AlertifyService } from 'src/app/_Services/alertify.service';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {

  @Input() photos: Photo[];
  @Output() getCurrentMain = new EventEmitter<string>();
  uploader: FileUploader;
  hasBaseDropZoneOver: boolean;
  response: string;
  Baseurl = environment.ApiUrl;
  CurrentMainPhoto: Photo;

  constructor(private authService: AuthService, private userService: UserService, private alertify: AlertifyService) {
  }
  ngOnInit() {
    this.InitializeUploader();
  }

  fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  InitializeUploader() {
    this.uploader = new FileUploader({
      url : this.Baseurl + 'Users/' + this.authService.decodedToken.nameid + '/photos',
      authToken : 'Bearer ' + localStorage.getItem('Token'),
      isHTML5 : true,
      allowedFileType : ['image'],
      removeAfterUpload : true,
      autoUpload : false,
      maxFileSize : 10 * 1024 * 1024
    });
    this.uploader.onAfterAddingFile = (file) => {file.withCredentials = false ; };
    this.uploader.onSuccessItem = ( item , response , status, headers) => {
      const res: Photo = JSON.parse(response);
      const photo = {
        id: res.id,
        url: res.url,
        dateAdded: res.dateAdded,
        description: res.description,
        isMain: res.isMain
      };
      this.photos.push(photo);
    };
  }

  SetMainPhoto(photo: Photo) {
    this.userService.SetMainPhoto(this.authService.decodedToken.nameid, photo.id).subscribe(() => {
      this.CurrentMainPhoto = this.photos.filter(p => p.isMain === true)[0];
      this.CurrentMainPhoto.isMain = false;
      photo.isMain = true;
     // this.getCurrentMain.emit(photo.url);
      this.authService.ChangeCurrentPhoto(photo.url);
      this.authService.Currentuser.photoUrl = photo.url;
      localStorage.setItem('User', JSON.stringify(this.authService.Currentuser));
    }, error => {
      this.alertify.Error(error);
    });
  }

  DeletePhoto( id: number) {
    this.alertify.confirm('Are you sure you want to delete this photo?', () => {
      this.userService.DeletePhoto( this.authService.decodedToken.nameid, id).subscribe(() => {
        this.photos.splice(this.photos.findIndex(p => p.id === id));
        this.alertify.Success('photo has been deleted.');
      }, error => {
        this.alertify.Error(error);
      });
    });
  }
}
