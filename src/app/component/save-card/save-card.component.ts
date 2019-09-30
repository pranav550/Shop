import { Component, OnInit } from '@angular/core';
// declare var $:any;

@Component({
  selector: 'app-save-card',
  templateUrl: './save-card.component.html',
  styleUrls: ['./save-card.component.css']
})
export class SaveCardComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  // scrollNavigate(){
  //   event.preventDefault();
  //   var expanded = $($(".scrollLink").attr("href")).hasClass("show");
  //   if (!expanded) {
  //       var fullHeight = $($(".scrollLink").attr("href")).prev().outerHeight(true);
  //       $("html, body").animate({
  //           scrollTop: $($(".scrollLink").attr("href")).offset().top + fullHeight
  //       }, 500);
  //   }
  // } 

}
