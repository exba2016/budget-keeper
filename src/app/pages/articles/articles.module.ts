import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticlesListComponent } from './components/articles-list/articles-list.component';

@NgModule({
  declarations: [ArticlesListComponent],
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [ArticlesListComponent],
})
export class ArticlesModule {}
