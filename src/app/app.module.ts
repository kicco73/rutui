import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { HelloworldComponent } from './helloworld/helloworld.component';
import { HttpClientModule } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { TabViewModule } from 'primeng/tabview';
import { PanelModule } from 'primeng/panel';

//import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: 'hello', component: HelloworldComponent }
];

@NgModule({
  imports: [BrowserModule, BrowserAnimationsModule, HttpClientModule, RouterModule.forRoot(routes),
    ButtonModule, FileUploadModule, ScrollPanelModule, TabViewModule, PanelModule],
  declarations: [AppComponent, HelloworldComponent],
  bootstrap: [AppComponent],
  exports: [RouterModule]
})
export class AppModule { }
