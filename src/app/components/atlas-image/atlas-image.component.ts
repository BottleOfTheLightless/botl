import { Component, computed, inject, input } from '@angular/core';
import { ContentService } from '../../services/content.service';

type AtlasedImage =
  | 'card-skill'
  | 'item-accessory'
  | 'item-weapon'
  | 'map-node'
  | 'picker-hero';

@Component({
  selector: 'app-atlas-image',
  imports: [],
  templateUrl: './atlas-image.component.html',
  styleUrl: './atlas-image.component.scss',
})
export class AtlasImageComponent {
  private contentService = inject(ContentService);

  public spritesheet = input.required<AtlasedImage>();
  public assetName = input.required<string>();

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
