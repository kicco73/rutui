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
import { ChartModule } from 'primeng/chart';
import { ToastModule } from 'primeng/toast';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { ProgressBarModule } from 'primeng/progressbar';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';

import { Routes, RouterModule } from '@angular/router';
import { TbxSummaryComponent } from './tbx-summary/tbx-summary.component';
import { FilterViewComponent } from './filter-view/filter-view.component';
import { IndexOfPipe } from './index-of.pipe';
import { KeysPipe } from './keys.pipe';

const routes: Routes = [
//  { path: 'hello', component: HelloworldComponent }
];

const config: SocketIoConfig = { url: 'http://localhost:8080', options: {} };

@NgModule({
  imports: [BrowserModule, BrowserAnimationsModule, HttpClientModule, RouterModule.forRoot(routes), FormsModule,
    ButtonModule, FileUploadModule, ScrollPanelModule, TabViewModule, PanelModule, TooltipModule, DividerModule,
    OverlayPanelModule, RadioButtonModule, InputTextModule, ProgressSpinnerModule, BlockUIModule, StepsModule,
    CheckboxModule, TreeModule, TreeTableModule, ChartModule, ToastModule, ProgressBarModule, TableModule,
    DropdownModule, MultiSelectModule,
    SocketIoModule.forRoot(config)],
  declarations: [AppComponent, TbxSummaryComponent, FilterViewComponent, IndexOfPipe, KeysPipe],
  bootstrap: [AppComponent],
  exports: [RouterModule]
})

export class AppModule { }
