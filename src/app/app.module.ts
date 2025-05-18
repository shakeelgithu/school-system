import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HeaderComponent } from './components/header/header.component';

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    AppComponent,
    DashboardComponent,
    SidebarComponent,
    HeaderComponent
  ],
  providers: [],
  bootstrap: []
})
export class AppModule { }