import { Pipe, PipeTransform, inject } from '@angular/core';
import { LanguageService } from '../services/language.service';

@Pipe({
  name: 'translate',
  standalone: true,
  pure: false // Impure because we want it to react to signal changes in the service even if input doesn't change
})
export class TranslatePipe implements PipeTransform {
  private languageService = inject(LanguageService);

  transform(value: string): string {
    return this.languageService.translate(value);
  }
}
