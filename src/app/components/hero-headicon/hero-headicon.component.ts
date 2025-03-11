import { Component, input } from '@angular/core';
import { AtlasImageComponent } from '../atlas-image/atlas-image.component';

@Component({
  selector: 'app-hero-headicon',
  imports: [AtlasImageComponent],
  templateUrl: './hero-headicon.component.html',
  styleUrl: './hero-headicon.component.scss',
})
export class HeroHeadiconComponent {
  public heroName = input.required<string>();
}
