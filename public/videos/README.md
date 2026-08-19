# The menu film

`menu.mp4` is scrubbed by scroll position — `components/site/menu/cinematic-menu-video.tsx`
writes `video.currentTime` from the section's scroll progress. It is never played.

That makes **keyframe density**, not bitrate, the thing that matters. A seek to an arbitrary
time has to decode from the previous keyframe; the source master carried one keyframe every
3.04 s (GOP 76), which made fast scrolls snap between five stills. Re-encoding with `-g 5`
puts a keyframe every 0.2 s and the scrub becomes frame-accurate.

Regenerate both files from a master with:

```bash
ffmpeg -i master.mp4 -an -vf "scale=1280:-2" \
  -c:v libx264 -profile:v high -crf 24 -preset slow \
  -g 5 -keyint_min 5 -sc_threshold 0 \
  -movflags +faststart \
  public/videos/menu.mp4

ffmpeg -i master.mp4 -vf "scale=1280:-2" -frames:v 1 -q:v 4 \
  public/videos/menu-poster.jpg
```

- `-an` drops audio: nothing is ever heard, and a file with no audio track sidesteps
  autoplay policy on every engine.
- `+faststart` moves the moov atom to the front so metadata arrives on the first request.
- `-g 5` assumes ~25 fps. Match it to the master's frame rate for a 0.2 s interval.

Keep the result **under 6 MB**. If it lands over, raise `-crf` to 26–28 before loosening
`-g` — keyframe density is worth more here than bitrate.

Verify after any re-encode:

```bash
ffprobe -v error -select_streams v:0 -show_entries frame=key_frame -of csv=p=0 \
  public/videos/menu.mp4 | grep -c '^1'     # want 70+
```

Current: 1280x720, 14.52 s, 2.0 MB, 73 keyframes. `menu-poster.jpg` is frame 0 — it is the
`poster`, and it is also the whole image under `prefers-reduced-motion`, where the film is
never requested at all.
