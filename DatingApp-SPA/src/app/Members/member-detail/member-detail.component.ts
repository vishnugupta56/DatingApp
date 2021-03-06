import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from 'src/app/_models/User';
import { UserService } from 'src/app/_Services/User.service';
import { AlertifyService } from 'src/app/_Services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';
import { TabsetComponent } from 'ngx-bootstrap';



@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {
@ViewChild('membersTabs',{static: true}) memberTabs: TabsetComponent;
user: User;
galleryOptions: NgxGalleryOptions[];
galleryImages: NgxGalleryImage[];

  constructor(private userservice: UserService, private alertify: AlertifyService, private activeRoute: ActivatedRoute) { }

  ngOnInit() {
// this.Getuser();
// Using Resolver we can get Data like below
   this.activeRoute.data.subscribe(data => {
     this.user = data['user'];
   });
   this.activeRoute.queryParams.subscribe(data => {
    const SelectedTab = data['tab'];
    this.memberTabs.tabs[SelectedTab].active = true;
  });
   this.galleryOptions = [{
     width : '500px',
     height : '500px',
     imagePercent : 100,
     thumbnailsColumns : 4,
     imageAnimation: NgxGalleryAnimation.Slide,
     preview: false,
   }];
   this.galleryImages = this.getImages();
  }

  getImages() {
    const ImageUrls = [];
    for (const photo of this.user.photos) {
      ImageUrls.push({
        small: photo.url,
        medium: photo.url,
        big: photo.url,
        description: photo.description
      });
    }
    return ImageUrls;
  }

  ChangeTab(tabId: number) {
    this.memberTabs.tabs[tabId].active = true;
  }
// without resolver we create function and use safe operator '?' when binding.
  // Getuser()  {
  //   return this.userservice.getUser(+this.activeRoute.snapshot.params['id']).subscribe((user: User) => {
  //     this.user = user;
  //   }, error => {
  //       this.alertify.Error(error);
  //   });
  // }

}
