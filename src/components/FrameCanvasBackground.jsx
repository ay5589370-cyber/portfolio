import React, { useEffect, useRef } from 'react';

const TOTAL_FRAMES = 300;
const START_FRAME = 150;
const SCROLL_SENSITIVITY = 0.08;
const LERP_AMOUNT = 0.18;
const PRELOAD_RADIUS = 6;
const CACHE_RADIUS = 36;

function clampFrame(frame) {
  return Math.min(TOTAL_FRAMES, Math.max(1, frame));
}

function getFrameSrc(frame) {
  return `/frames/ezgif-frame-${String(frame).padStart(3, '0')}.png`;
}

export default function FrameCanvasBackground() {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const imageCacheRef = useRef(new Map());
  const currentFrameRef = useRef(START_FRAME);
  const targetFrameRef = useRef(START_FRAME);
  const animationFrameRef = useRef(null);
  const lastRenderedFrameRef = useRef(null);
  const lastPreloadFrameRef = useRef(null);
  const preloadTaskRef = useRef(null);
  const scrollUpdateFrameRef = useRef(null);
  const resizeFrameRef = useRef(null);
  const renderedSizeRef = useRef({ width: 0, height: 0, pixelRatio: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const context = canvas.getContext('2d', { alpha: false });
    contextRef.current = context;

    const loadFrame = (frame, onLoad) => {
      const frameNumber = clampFrame(Math.round(frame));
      const cachedImage = imageCacheRef.current.get(frameNumber);

      if (cachedImage) {
        if (onLoad && (!cachedImage.complete || cachedImage.naturalWidth === 0)) {
          cachedImage.addEventListener('load', () => onLoad(cachedImage), { once: true });
        }

        return cachedImage;
      }

      const image = new Image();
      image.decoding = 'async';
      image.src = getFrameSrc(frameNumber);
      image.onload = () => onLoad?.(image);
      imageCacheRef.current.set(frameNumber, image);
      return image;
    };

    const requestIdleTask = (callback) => {
      if ('requestIdleCallback' in window) {
        return window.requestIdleCallback(callback, { timeout: 300 });
      }

      return window.setTimeout(callback, 80);
    };

    const cancelIdleTask = (taskId) => {
      if ('cancelIdleCallback' in window) {
        window.cancelIdleCallback(taskId);
        return;
      }

      window.clearTimeout(taskId);
    };

    const preloadAround = (frame) => {
      const centerFrame = clampFrame(Math.round(frame));

      if (
        lastPreloadFrameRef.current !== null &&
        Math.abs(lastPreloadFrameRef.current - centerFrame) < 3
      ) {
        return;
      }

      lastPreloadFrameRef.current = centerFrame;

      for (let offset = -PRELOAD_RADIUS; offset <= PRELOAD_RADIUS; offset += 1) {
        loadFrame(centerFrame + offset);
      }

      imageCacheRef.current.forEach((_, frameNumber) => {
        if (Math.abs(frameNumber - centerFrame) > CACHE_RADIUS) {
          imageCacheRef.current.delete(frameNumber);
        }
      });
    };

    const schedulePreloadAround = (frame) => {
      if (preloadTaskRef.current) return;

      preloadTaskRef.current = requestIdleTask(() => {
        preloadTaskRef.current = null;
        preloadAround(frame);
      });
    };

    const drawImageCover = (image) => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      context.fillStyle = '#050A14';
      context.fillRect(0, 0, width, height);

      const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
      const drawWidth = image.naturalWidth * scale;
      const drawHeight = image.naturalHeight * scale;
      const drawX = (width - drawWidth) / 2;
      const drawY = (height - drawHeight) / 2;

      context.drawImage(image, drawX, drawY, drawWidth, drawHeight);
    };

    const drawFrame = (frame, force = false) => {
      const frameNumber = clampFrame(Math.round(frame));

      if (!force && lastRenderedFrameRef.current === frameNumber) {
        return;
      }

      const image = loadFrame(frameNumber, () => {
        if (Math.round(currentFrameRef.current) === frameNumber) {
          drawFrame(frameNumber, true);
        }
      });

      if (!image.complete || image.naturalWidth === 0) return;

      lastRenderedFrameRef.current = frameNumber;
      canvas.dataset.currentFrame = String(frameNumber);
      drawImageCover(image);
    };

    const setCanvasSize = () => {
      const pixelRatio = window.innerWidth < 640 ? 1 : Math.min(window.devicePixelRatio || 1, 1.5);
      const width = window.innerWidth;
      const height = window.innerHeight;

      if (
        renderedSizeRef.current.width === width &&
        renderedSizeRef.current.height === height &&
        renderedSizeRef.current.pixelRatio === pixelRatio
      ) {
        return;
      }

      renderedSizeRef.current = { width, height, pixelRatio };
      canvas.width = Math.floor(width * pixelRatio);
      canvas.height = Math.floor(height * pixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      drawFrame(lastRenderedFrameRef.current ?? currentFrameRef.current, true);
    };

    const stopAnimation = () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };

    const animateToTarget = () => {
      const currentFrame = currentFrameRef.current;
      const targetFrame = targetFrameRef.current;
      const distance = targetFrame - currentFrame;

      if (Math.abs(distance) < 0.08) {
        currentFrameRef.current = targetFrame;
        drawFrame(targetFrame);
        schedulePreloadAround(targetFrame);
        stopAnimation();
        return;
      }

      currentFrameRef.current = clampFrame(currentFrame + distance * LERP_AMOUNT);
      drawFrame(currentFrameRef.current);
      schedulePreloadAround(currentFrameRef.current);
      animationFrameRef.current = requestAnimationFrame(animateToTarget);
    };

    const requestAnimation = () => {
      if (!animationFrameRef.current) {
        animationFrameRef.current = requestAnimationFrame(animateToTarget);
      }
    };

    const syncTargetToScroll = () => {
      targetFrameRef.current = clampFrame(START_FRAME - window.scrollY * SCROLL_SENSITIVITY);
      schedulePreloadAround(targetFrameRef.current);
      requestAnimation();
    };

    const handleScroll = () => {
      if (scrollUpdateFrameRef.current) return;

      scrollUpdateFrameRef.current = requestAnimationFrame(() => {
        scrollUpdateFrameRef.current = null;
        syncTargetToScroll();
      });
    };

    const handleResize = () => {
      if (resizeFrameRef.current) return;

      resizeFrameRef.current = requestAnimationFrame(() => {
        resizeFrameRef.current = null;
        setCanvasSize();
      });
    };

    setCanvasSize();
    loadFrame(START_FRAME, () => drawFrame(START_FRAME));
    schedulePreloadAround(START_FRAME);
    syncTargetToScroll();

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      stopAnimation();
      if (preloadTaskRef.current) {
        cancelIdleTask(preloadTaskRef.current);
      }
      if (scrollUpdateFrameRef.current) {
        cancelAnimationFrame(scrollUpdateFrameRef.current);
      }
      if (resizeFrameRef.current) {
        cancelAnimationFrame(resizeFrameRef.current);
      }
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="scroll-frame-background"
      aria-hidden="true"
    />
  );
}
