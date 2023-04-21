import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { TabViewModule } from 'primeng/tabview';
import { PanelModule } from 'primeng/panel';
import { TooltipModule } from 'primeng/tooltip';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { BlockUIModule } from 'primeng/blockui';
import { StepsModule } from 'primeng/steps';
import { CheckboxModule } from 'primeng/checkbox';
import { TreeModule } from 'primeng/tree';
import { TreeTableModule } from 'primeng/treetable';

import { Routes, RouterModule } from '@angular/router';
import { TbxSummaryComponent } from './tbx-summary/tbx-summary.component';
import { FilterViewComponent } from './filter-view/filter-view.component';

const routes: Routes = [
//  { path: 'hello', component: HelloworldComponent }
];

@NgModule({
  imports: [BrowserModule, BrowserAnimationsModule, HttpClientModule, RouterModule.forRoot(routes), FormsModule,
    ButtonModule, FileUploadModule, ScrollPanelModule, TabViewModule, PanelModule, TooltipModule, DividerModule,
    OverlayPanelModule, RadioButtonModule, InputTextModule, ProgressSpinnerModule, BlockUIModule, StepsModule,
    CheckboxModule, TreeModule, TreeTableModule],
  declarations: [AppComponent, TbxSummaryComponent, FilterViewComponent],
  bootstrap: [AppComponent],
  exports: [RouterModule]
})

export class AppModule { }
