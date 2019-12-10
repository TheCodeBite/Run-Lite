import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

// Import your library
import { NgxStripeModule } from 'ngx-stripe';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule} from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IndexComponent } from './index/index.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { RegisterComponent } from './register/register.component';
import { TicketComponent } from './ticket/ticket.component';

@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,
    NavbarComponent,
    FooterComponent,
    RegisterComponent,
    TicketComponent
  ],
  imports: [
    NgxStripeModule.forRoot('pk_test_2rss5SVRD1HtKT1p6fDVEoVc00cjgyrokn'),
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
