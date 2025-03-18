import { HttpClient } from '@angular/common/http';
import {
  computed,
  inject,
  Injectable,
  signal,
  WritableSignal,
} from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import {
  allContentById,
  allIdsByName,
  setAllContentById,
  setAllIdsByName,
  setAllMapsByName,
} from '../helpers';
import { Content, ContentType, TiledMap } from '../interfaces';
import { LoggerService } from './logger.service';
import { MetaService } from './meta.service';

@Injectable({
  providedIn: 'root',
})
export class ContentService {
  private metaService = inject(MetaService);
  private logger = inject(LoggerService);
  private http = inject(HttpClient);

  private artSignals: Array<WritableSignal<boolean>> = [];
  public artImages = signal<Record<string, HTMLImageElement>>({});
  private hasLoadedArt = computed(() => this.artSignals.every((s) => s()));
  private hasLoadedAtlases = signal<boolean>(false);
  private hasLoadedMaps = signal<boolean>(false);

  public artAtlases = signal<
    Record<
      string,
      Record<string, { x: number; y: number; width: number; height: number }>
    >
  >({});

  public hasLoaded = computed(
    () =>
      this.hasLoadedArt() &&
      this.hasLoadedData() &&
      this.hasLoadedAtlases() &&
      this.hasLoadedMaps(),
  );

  private hasLoadedData = signal<boolean>(false);

  async init() {
    this.loadJSON();
    this.loadMaps();
    this.loadArt();
  }

  private toCacheBustURL(url: string): string {
    return `${url}?v=${this.metaService.versionString()}`;
  }

  private toJSONURL(key: string): string {
    return this.toCacheBustURL(`./json/${key}.json`);
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
        this.http.get(this.toCacheBustURL(`./art/spritesheets/${s}.json`)),
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

  private loadMaps() {
    this.http.get(this.toJSONURL('maps')).subscribe((maps) => {
      const allMaps = maps as string[];

      forkJoin(
        allMaps.map((map) =>
          this.http.get(this.toCacheBustURL(`./maps/${map}.json`)),
        ),
      ).subscribe((mapDatas) => {
        const maps = new Map<string, TiledMap>();
        const allMapDatas = mapDatas as TiledMap[];

        allMapDatas.forEach((mapData, idx) => {
          mapData.properties.unshift({
            name: 'name',
            value: allMaps[idx],
          });
          maps.set(allMaps[idx], mapData);
        });

        this.logger.info('Content', 'Map JSONs loaded.');
        setAllMapsByName(maps);
        this.hasLoadedMaps.set(true);
      });
    });
  }

  private loadJSON() {
    const allJsons = ['hero', 'map'];

    const jsonMaps = allJsons.reduce((prev, cur) => {
      prev[cur] = this.http.get<Content[]>(this.toJSONURL(cur));
      return prev;
    }, {} as Record<string, Observable<Content[]>>);

    forkJoin(jsonMaps).subscribe((assets) => {
      this.unfurlAssets(assets as unknown as Record<string, Content[]>);

      this.logger.info('Content', 'Content loaded.');
      this.hasLoadedData.set(true);
    });
  }

  private unfurlAssets(assets: Record<string, Content[]>) {
    const allIdsByNameAssets: Map<string, string> = allIdsByName();
    const allEntriesByIdAssets: Map<string, Content> = allContentById();

    Object.keys(assets).forEach((subtype) => {
      Object.values(assets[subtype]).forEach((entry) => {
        entry.__type = subtype as ContentType;

        if (allIdsByNameAssets.has(entry.name)) {
          this.logger.warn(
            'Content',
            `"${entry.name}/${
              entry.id
            }" is a duplicate name to "${allIdsByNameAssets.get(
              entry.name,
            )}". Skipping...`,
          );
          return;
        }

        const dupe = allEntriesByIdAssets.get(entry.id);
        if (dupe) {
          this.logger.warn(
            'Content',
            `"${entry.name}/${entry.id}" is a duplicate id to "${dupe.name}/${dupe.id}". Skipping...`,
          );
          return;
        }

        allIdsByNameAssets.set(entry.name, entry.id);
        allEntriesByIdAssets.set(entry.id, entry);
      });
    });

    setAllIdsByName(allIdsByNameAssets);
    setAllContentById(allEntriesByIdAssets);
  }
}
