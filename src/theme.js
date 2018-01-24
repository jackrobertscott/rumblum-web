import chroma from 'chroma-js';

const theme = {
  size: {
    radius: '3px',
  },
  shadows: {
    off: '0 0 5px 0 rgba(90, 90, 90, 0.10)',
  },
  colors: {
    white: '#ffffff',
    black: '#000000',
    off: '#f3f7fd',
    offer: chroma('#f3f7fd').darken(0.3),
    offest: chroma('#f3f7fd').darken(0.5),
    dark: '#16191A',
    pinch: chroma('#3ecc8b').darken(0.3),
    pinchHover: '#3ecc8b',
    darkover: chroma('#16191A').brighten(0.1),
    darkless: '#202426',
    darklesser: chroma('#202426').brighten(0.5),
    darker: '#151515',
    grey: '#888888',
    greyer: '#333333',
    greyless: '#b3b3b3',
    info: '#28b0ff',
    electric: '#0e4756',
    success: '#2fce3a',
    danger: '#fc0f3e',
    dangerover: chroma('#fc0f3e').darken(0.3),
  },
};

export default theme;
