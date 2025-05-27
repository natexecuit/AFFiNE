import { style } from '@vanilla-extract/css';

export const iframeContainer = style({
  width: '100%',
  height: '100%',
  minHeight: 0,
  minWidth: 0,
  position: 'relative',
  overflow: 'hidden',
  background: '#f9f9f9',
  // The iframe inside will be full-size by direct styling
});
