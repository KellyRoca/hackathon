import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { MaterialModule } from './material.module';
import { ControlErrorHandlerPipe } from 'src/app/pipes/control-error-handler.pipe';
import { StorageService } from 'src/app/services/storage.service';

const components = [
  HeaderComponent
]

@NgModule({
  declarations: [
    ...components,
    ControlErrorHandlerPipe
  ],
  imports: [
    CommonModule,
    MaterialModule,
  ],
  providers: [
    StorageService
  ],
  exports: [
    ...components,
    ControlErrorHandlerPipe
  ]
})
export class SharedModule { }
