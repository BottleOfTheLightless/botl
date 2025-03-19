declare module 'arrow-line' {
  class ArrowLine {
    constructor(
      start: { x: number; y: number },
      end: { x: number; y: number },
      options: { color: string },
    );

    remove(): void;
  }

  export = ArrowLine;
}
