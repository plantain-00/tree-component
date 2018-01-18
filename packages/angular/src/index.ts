import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { NodeComponent, TreeComponent } from './index.component'
export * from './index.component'
export * from 'tree-component'

/**
 * @public
 */
@NgModule({
  declarations: [
    TreeComponent,
    NodeComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    TreeComponent,
    NodeComponent
  ]
})
export class TreeModule { }
