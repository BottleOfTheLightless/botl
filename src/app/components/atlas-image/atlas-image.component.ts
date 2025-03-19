import { CommonModule } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { ContentService } from '../../services/content.service';

type AtlasedImage =
  | 'card-skill'
  | 'item-accessory'
  | 'item-weapon'
  | 'map-node'
  | 'map-node-editor'
  | 'picker-hero';

@Component({
  selector: 'app-atlas-image',
  imports: [CommonModule],
  templateUrl: './atlas-image.component.html',
  styleUrl: './atlas-image.component.scss',
})
export class AtlasImageComponent {
  private contentService = inject(ContentService);

  public spritesheet = input.required<AtlasedImage>();
  public assetName = input.required<string>();
  public cssClass = input<string>('');

  public assetUrl = computed(
    () => `art/spritesheets/${this.spritesheet()}.png`,
  );
  public assetPath = computed(
    () => `gameassets/${this.spritesheet()}/${this.assetName()}.png`,
  );
  public assetJSON = computed(
    () => this.contentService.artAtlases()[this.spritesheet()],
  );
  public specificAsset = computed(() => this.assetJSON()[this.assetPath()]);
}
