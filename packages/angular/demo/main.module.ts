import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { FormsModule } from '@angular/forms'

import { TreeModule } from '../dist/'
import { MainComponent } from './main.component'

@NgModule({
  imports: [BrowserModule, FormsModule, TreeModule],
  declarations: [MainComponent],
  bootstrap: [MainComponent]
})
export class MainModule { }
