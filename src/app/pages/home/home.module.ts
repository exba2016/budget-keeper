import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SlidesArticlesComponent } from './components/slides-articles/slides-articles.component';
import { EvenementsListComponent } from './components/evenements-list/evenements-list.component';

@NgModule({
  declarations: [SlidesArticlesComponent,EvenementsListComponent],
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [SlidesArticlesComponent,EvenementsListComponent],
})
export class HomeModule {}
