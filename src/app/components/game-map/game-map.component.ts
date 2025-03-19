import { NgOptimizedImage } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { currentGame, currentMapData } from '../../helpers';

@Component({
  selector: 'app-game-map',
  imports: [NgOptimizedImage],
  templateUrl: './game-map.component.html',
  styleUrl: './game-map.component.scss',
})
export class GameMapComponent {
  public pageWidth = input.required<number>();
  public pageHeight = input.required<number>();

  public map = computed(() => currentGame()?.currentMap);
  public mapData = computed(() => currentMapData());

  public mapImagePath = computed(
    () => `art/map-background/${this.mapData()?.image}.png`,
  );
}
