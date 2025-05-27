// Module augmentation for @blocksuite/affine/model DocMode to add 'iframe'
declare module '@blocksuite/affine/model' {
  // If DocMode is a union of string literals, extend it
  export type DocMode = 'page' | 'edgeless' | 'iframe' | (string & {});
}
