'use client';

import Artplayer from 'artplayer';
import Hls from 'hls.js';
import { useEffect, useRef } from 'react';

interface LivePlayerProps {
  url: string;
  name: string;
}

// Extend HTMLVideoElement to support hls property
declare global {
  interface HTMLVideoElement {
    hls?: Hls;
  }
}

const LivePlayer = ({ url, name }: LivePlayerProps) => {
  const artRef = useRef<HTMLDivElement>(null);
  const artPlayerRef = useRef<Artplayer | null>(null);

  useEffect(() => {
    if (!artRef.current) return;

    // Destroy previous instance if it exists
    if (artPlayerRef.current) {
      artPlayerRef.current.destroy(true);
    }

    const player = new Artplayer({
      container: artRef.current,
      url: url,
      title: name,
      isLive: true,
      autoplay: true,
      muted: false,
      pip: true,
      setting: true,
      fullscreen: true,
      fullscreenWeb: true,
      playsInline: true,
      theme: '#22c55e',
      lang: 'zh-cn',
      hotkey: false,
      moreVideoAttr: {
        crossOrigin: 'anonymous',
      },
      customType: {
        m3u8: function (video: HTMLVideoElement, url: string) {
          if (Hls.isSupported()) {
            if (video.hls) {
              video.hls.destroy();
            }
            const hls = new Hls();
            hls.loadSource(url);
            hls.attachMedia(video);
            video.hls = hls;
          } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = url;
          }
        },
      },
      icons: {
        loading: '<img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MCIgaGVpZ2h0PSI1MCIgdmlld0JveD0iMCAwIDUwIDUwIj48cGF0aCBkPSJNMjUuMjUxIDYuNDYxYy0xMC4zMTggMC0xOC42ODMgOC4zNjUtMTguNjgzIDE4LjY4M2g0LjA2OGMwLTguMDcgNi4zNDUtMTQuNjE1IDE0LjYxNS0xNC42MTVWNi40NjF6IiBmaWxsPSIjMDA5Njg4Ij48YW5pbWF0ZVRyYW5zZm9ybSBhdHRyaWJ1dGVOYW1lPSJ0cmFuc2Zvcm0iIGF0dHJpYnV0ZVR5cGU9IlhNTCIgZHVyPSIxcyIgZnJvbT0iMCAyNSAyNSIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiIHRvPSIzNjAgMjUgMjUiIHR5cGU9InJvdGF0ZSIvPjwvcGF0aD48L3N2Zz4=">',
      },
    });

    artPlayerRef.current = player;

    return () => {
      if (artPlayerRef.current) {
        artPlayerRef.current.destroy(true);
      }
    };
  }, [url, name]);

  return <div ref={artRef} style={{ width: '100%', height: '100%' }} />;
};

export default LivePlayer;
