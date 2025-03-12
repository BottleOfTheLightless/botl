import { Component, computed, HostBinding, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';

import { gameExitDoor, gameHearts } from '@ng-icons/game-icons';
import { tablerPlus, tablerSettings } from '@ng-icons/tabler-icons';

const allIcons = { gameHearts, gameExitDoor, tablerPlus, tablerSettings };

@Component({
  selector: 'app-icon',
  imports: [NgIcon],
  providers: [provideIcons(allIcons)],
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.scss',
})
export class IconComponent {
  public name = input.required<keyof typeof allIcons>();
  public size = input<string>('1em');
  public color = input<string>('');

  public icon = computed(() => {
    return allIcons[this.name()];
  });

  @HostBinding('style.height') public get maxHeight() {
    return this.size();
  }
}
