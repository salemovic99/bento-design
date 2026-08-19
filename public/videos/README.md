# The scrubbed films

Two films on this site are driven by scroll position rather than played:
`components/site/cinematic/scroll-film.tsx` writes `video.currentTime` from its section's scroll
progress. Neither is ever played.

| File | Section | Source | Size | Frame |
|---|---|---|---|---|
| `story.mp4` | `components/site/story/` | `../../../video-2.mp4` | 720×1280, 9.81 s, 2.8 MB, 49 keyframes | portrait, cropped by `object-cover` |
| `menu.mp4` | `components/site/menu/` | `../../../video.mp4` | 1280×720, 14.52 s, 2.0 MB, 73 keyframes | landscape |

## Why keyframe density is the only setting that matters

A seek to an arbitrary time has to decode forward from the previous keyframe. Both source masters
carried roughly one keyframe per second — `video.mp4` one every 3.04 s (GOP 76), `video-2.mp4` one
every 0.98 s (GOP 30) — which made fast scrolls snap between a handful of stills. Re-encoding with a
keyframe every **0.2 s** makes the scrub frame-accurate, and it costs less than you would think:
both files came out *smaller* than their masters.

`-g` is a frame count, so it must be matched to the master's frame rate: `-g 5` at 25 fps,
`-g 6` at 30 fps.

## Regenerating

```bash
# story.mp4 — 29.97 fps master, portrait, keep native width
ffmpeg -i video-2.mp4 -an \
  -c:v libx264 -profile:v high -crf 26 -preset slow \
  -g 6 -keyint_min 6 -sc_threshold 0 \
  -movflags +faststart \
  frontend/public/videos/story.mp4

# menu.mp4 — 25 fps master, 1080p down to 720p
ffmpeg -i video.mp4 -an -vf "scale=1280:-2" \
  -c:v libx264 -profile:v high -crf 24 -preset slow \
  -g 5 -keyint_min 5 -sc_threshold 0 \
  -movflags +faststart \
  frontend/public/videos/menu.mp4
```

Posters are frame 0 of each master, and each one is also the whole image under
`prefers-reduced-motion`, where the film is never requested at all:

```bash
ffmpeg -i video-2.mp4 -frames:v 1 -q:v 4 frontend/public/videos/story-poster.jpg
ffmpeg -i video.mp4 -vf "scale=1280:-2" -frames:v 1 -q:v 4 frontend/public/videos/menu-poster.jpg
```

- `-an` drops audio. `video-2.mp4` ships with an AAC track; nothing is ever heard, and a file with
  no audio track sidesteps autoplay policy on every engine.
- `+faststart` moves the moov atom to the front so metadata arrives on the first request.
- No upscaling. `story.mp4` keeps its native 720 px width — the section crops it, it does not
  stretch it.

Keep each file **under 3 MB**. Two films now load across a full scroll, so the budget is per-file,
not per-page. If one lands over, raise `-crf` to 26–28 before loosening `-g` — keyframe density is
worth more here than bitrate.

## Verifying after any re-encode

```bash
F=frontend/public/videos/story.mp4
ffprobe -v error -select_streams v:0 -show_entries frame=key_frame -of csv=p=0 "$F" \
  | grep -c '^1'                                                    # frames ÷ GOP, ±1
ffprobe -v error -select_streams a -show_entries stream=index -of csv=p=0 "$F" | wc -l   # want 0
```
