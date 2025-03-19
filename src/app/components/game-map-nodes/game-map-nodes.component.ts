import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  effect,
  ElementRef,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { currentMapNodes, getPropertyFromMap } from '../../helpers';
import { TiledMapNodeImage, TiledMapNodeType } from '../../interfaces';
import { AtlasImageComponent } from '../atlas-image/atlas-image.component';

import ArrowLine from 'arrow-line';

interface ClickableMapNode {
  id: number;

  name: string;
  type: TiledMapNodeType;
  nodeImage: TiledMapNodeImage;

  x: number;
  y: number;

  nextNodes: number[];
}

@Component({
  selector: 'app-game-map-nodes',
  imports: [CommonModule, AtlasImageComponent],
  templateUrl: './game-map-nodes.component.html',
  styleUrl: './game-map-nodes.component.scss',
})
export class GameMapNodesComponent {
  public pageWidth = input.required<number>();
  public pageHeight = input.required<number>();

  public svgContainer = viewChild<ElementRef>('svgContainer');
  public allArrows = signal<ArrowLine[]>([]);

  public mapNodes = computed(() =>
    (currentMapNodes() ?? []).map(
      (node) =>
        ({
          id: node.id,
          name: node.name,
          type: node.type,
          nodeImage: 'Encounter1',
          x: node.x,
          y: node.y,
          nextNodes: (getPropertyFromMap(node, 'nextNode') as number[]) ?? [],
        } satisfies ClickableMapNode),
    ),
  );

  constructor() {
    effect(() => {
      const existingArrows = this.allArrows();
      existingArrows.forEach((arrow) => arrow.remove());

      const nodes = this.mapNodes();

      const newLines: ArrowLine[] = [];

      nodes.forEach((node) => {
        node.nextNodes.forEach((nextNodeId) => {
          const nextNode = nodes.find((n) => n.id === nextNodeId);

          if (!nextNode) {
            return;
          }

          const line = new ArrowLine(
            {
              x: node.x + 32,
              y: node.y + 32,
            },
            {
              x: nextNode.x + 32,
              y: nextNode.y + 32,
            },
            {
              color: '#fff',
            },
          );

          newLines.push(line);
        });
      });

      const arrows = document.getElementById('__arrowLineInternal-svg-canvas');

      if (arrows) {
        // move the svg to this container for better usage
        arrows.parentElement?.removeChild(arrows);
        this.svgContainer()?.nativeElement.appendChild(arrows);

        arrows.setAttribute('width', `${this.pageWidth()}`);
        arrows.setAttribute('height', `${this.pageHeight()}`);
      }
    });
  }
}
