import { HttpClient } from '@angular/common/http';
import {
  computed,
  inject,
  Injectable,
  signal,
  WritableSignal,
} from '@angular/core';
import { forkJoin } from 'rxjs';
import {
  allContentById,
  allIdsByName,
  setAllContentById,
  setAllIdsByName,
} from '../helpers';
import { Content, ContentType } from '../interfaces';
import { MetaService } from './meta.service';

@Injectable({
  providedIn: 'root',
})
export class ContentService {
  private metaService = inject(MetaService);
  private http = inject(HttpClient);

  private artSignals: Array<WritableSignal<boolean>> = [];
  public artImages = signal<Record<string, HTMLImageElement>>({});
  private hasLoadedArt = computed(() => this.artSignals.every((s) => s()));
  private hasLoadedAtlases = signal<boolean>(false);

  public artAtlases = signal<
    Record<
      string,
      Record<string, { x: number; y: number; width: number; height: number }>
    >
  >({});

  public hasLoaded = computed(
    () =>
      this.hasLoadedArt() && this.hasLoadedData() && this.hasLoadedAtlases(),
  );

  private hasLoadedData = signal<boolean>(false);

  async init() {
    this.loadJSON();
    this.loadArt();
  }

  private loadArt() {
    const spritesheetsToLoad = [
      'card-skill',
      'item-accessory',
      'item-weapon',
      'map-node',
      'picker-hero',
    ];

    forkJoin(
      spritesheetsToLoad.map((s) =>
        this.http.get(`./art/spritesheets/${s}.json`),
      ),
    ).subscribe((allAtlases) => {
      const atlasesByName = spritesheetsToLoad.reduce(
        (prev, cur, idx) => ({
          ...prev,
          [cur]: allAtlases[idx],
        }),
        {},
      );

      this.artAtlases.set(atlasesByName);
      this.hasLoadedAtlases.set(true);
    });

    this.artSignals = spritesheetsToLoad.map(() => signal<boolean>(false));

    const artImageHash: Record<string, HTMLImageElement> = {};

    spritesheetsToLoad.forEach((sheet, idx) => {
      const img = new Image();
      img.src = `art/spritesheets/${sheet}.png`;
      this.artSignals[idx].set(false);
      img.onload = async () => {
        artImageHash[sheet] = img;

        this.artImages.set(artImageHash);
        this.artSignals[idx].set(true);
      };
    });
  }

  private toJSONURL(key: string): string {
    return `./json/${key}.json?v=${this.metaService.versionString()}`;
  }

  private loadJSON() {
    forkJoin({
      hero: this.http.get(this.toJSONURL('hero')),
    }).subscribe((assets) => {
      this.unfurlAssets(assets as unknown as Record<string, Content[]>);

      console.log('[Content] Content loaded.');
      this.hasLoadedData.set(true);
    });
  }

  private unfurlAssets(assets: Record<string, Content[]>) {
    const allIdsByNameAssets: Record<string, string> = allIdsByName();
    const allEntriesByIdAssets: Record<string, Content> = allContentById();

    Object.keys(assets).forEach((subtype) => {
      Object.values(assets[subtype]).forEach((entry) => {
        entry.__type = subtype as ContentType;

        if (allIdsByNameAssets[entry.name]) {
          console.warn(
            `[Content] "${entry.name}/${entry.id}" is a duplicate name to "${
              allIdsByNameAssets[entry.name]
            }". Skipping...`,
          );
          return;
        }

        if (allEntriesByIdAssets[entry.id]) {
          const dupe = allEntriesByIdAssets[entry.id];
          console.warn(
            `[Content] "${entry.name}/${entry.id}" is a duplicate id to "${dupe.name}/${dupe.id}". Skipping...`,
          );
          return;
        }

        allIdsByNameAssets[entry.name] = entry.id;
        allEntriesByIdAssets[entry.id] = entry;
      });
    });

    setAllIdsByName(allIdsByNameAssets);
    setAllContentById(allEntriesByIdAssets);
  }
}
