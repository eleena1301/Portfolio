import  { useState, useEffect, useRef } from 'react';

/*
  --- CUSTOM REVEAL COMPONENT ---
  This wraps any content and uses the IntersectionObserver to detect
  when it enters the screen, triggering the smooth slide-up animation.
*/
const Reveal = ({ children, delay = 0, className = "" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target); // Stop observing once revealed
        }
      },
      { threshold: 0.15 } // Triggers when 15% of the element is visible
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-1000 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'
      } ${className}`}
    >
      {children}
    </div>
  );
};

/* ------------------------------------------------------------------
   GLOBAL KEYFRAMES
   Tailwind has no built-in utilities for 3D transforms or the custom
   timelines below, so they live in one injected stylesheet.
------------------------------------------------------------------ */
const Styles = () => (
  <style>{`
    /* ---------- 3D ROBOT ---------- */
    @keyframes rbFloat {
      0%, 100% { transform: translateY(0px); }
      50%      { transform: translateY(-8px); }
    }
    @keyframes rbShadow {
      0%, 100% { transform: translateX(-50%) scaleX(1);    opacity: .35; }
      50%      { transform: translateX(-50%) scaleX(0.82); opacity: .18; }
    }
    /* opacity only — the eyes carry an inline 3D transform that an
       animated transform would clobber */
    @keyframes rbBlink {
      0%, 92%, 100% { opacity: 1; }
      95%           { opacity: .12; }
    }
    /* Arm pivots rotate about the shoulder; the hand adds a counter-
       oscillation so the wave reads as a wrist flick, not a stiff swing. */
    @keyframes rbWave {
      0%, 50%   { transform: rotateZ(-6deg); }
      57%       { transform: rotateZ(-148deg); }
      63%       { transform: rotateZ(-124deg); }
      69%       { transform: rotateZ(-156deg); }
      75%       { transform: rotateZ(-124deg); }
      81%       { transform: rotateZ(-156deg); }
      87%       { transform: rotateZ(-138deg); }
      95%, 100% { transform: rotateZ(-6deg); }
    }
    @keyframes rbHand {
      0%, 52%   { transform: rotateZ(0deg); }
      60%       { transform: rotateZ(16deg); }
      66%       { transform: rotateZ(-16deg); }
      72%       { transform: rotateZ(16deg); }
      78%       { transform: rotateZ(-16deg); }
      84%       { transform: rotateZ(16deg); }
      92%, 100% { transform: rotateZ(0deg); }
    }
    @keyframes rbArmIdle {
      0%, 100% { transform: rotateZ(6deg); }
      50%      { transform: rotateZ(11deg); }
    }
    .rb-stage   { perspective: 620px; }
    .rb-float   { animation: rbFloat 3.4s ease-in-out infinite; transform-style: preserve-3d; }
    /* fixed three-quarter pose — enough yaw to show the box depth,
       shallow enough to keep the face readable */
    .rb-pose    { transform: rotateX(-8deg) rotateY(-18deg) scale(1.3); transform-style: preserve-3d;
                  transition: transform .8s cubic-bezier(.2,.7,.3,1); }
    .rb-part    { transform-style: preserve-3d; }
    /* the hairline keeps limb edges legible against a near-black page */
    .rb-face    { position: absolute; left: 50%; top: 50%;
                  box-shadow: inset 0 0 0 1px rgba(255,255,255,.07);
                  transition: box-shadow .5s ease, background-color .5s ease, filter .5s ease; }
    .rb-eye     { animation: rbBlink 4s ease-in-out infinite; }
    .rb-wave    { animation: rbWave 5s ease-in-out infinite; transform-style: preserve-3d; }
    .rb-hand    { animation: rbHand 5s ease-in-out infinite; transform-style: preserve-3d; }
    .rb-armidle { animation: rbArmIdle 5s ease-in-out infinite; transform-style: preserve-3d; }
    .rb-wrap:hover .rb-pose  { transform: rotateX(-3deg) rotateY(0deg) scale(1.36); }
    .rb-wrap:hover .rb-wave,
    .rb-wrap:hover .rb-hand  { animation-duration: 2.2s; }
    /* brightness() rather than overriding colour + shadow: each light
       keeps its own hue and glow radius instead of every one blowing out
       to the same wash and bleeding into its neighbour */
    .rb-wrap:hover .rb-glow  { filter: brightness(1.35); }

    /* ---------- SHARED CAPTION CYCLE (6s loop, 3 steps) ---------- */
    @keyframes capCycle {
      0%          { opacity: 0; transform: translateY(4px); }
      3%, 28%     { opacity: 1; transform: translateY(0); }
      33%, 100%   { opacity: 0; transform: translateY(-4px); }
    }
    .cap { animation: capCycle 6s ease-in-out infinite; }

    /* ---------- PROJECT 1: GRID CONVERTER ---------- */
    @keyframes gcRow {
      0%        { opacity: 0; transform: translateX(-26px); }
      7%, 38%   { opacity: 1; transform: translateX(0); }
      48%       { opacity: 0; transform: translateX(26px) scale(.92); }
      100%      { opacity: 0; transform: translateX(-26px); }
    }
    @keyframes gcCell {
      0%, 44%   { opacity: 0; transform: scale(.35); }
      52%       { opacity: 1; transform: scale(1.12); }
      58%, 86%  { opacity: 1; transform: scale(1); }
      94%, 100% { opacity: 0; transform: scale(.92); }
    }
    @keyframes gcFlow {
      0%, 100%  { opacity: .2; transform: translateX(-4px); }
      45%       { opacity: 1; transform: translateX(4px); }
    }
    /* pixel values: the scan bar is 4px tall inside a 48px window,
       so percentage translateY would barely move it */
    @keyframes gcScan {
      0%, 28%    { opacity: 0; transform: translateY(0px); }
      32%        { opacity: 1; transform: translateY(0px); }
      56%        { opacity: 1; transform: translateY(44px); }
      62%, 100%  { opacity: 0; transform: translateY(44px); }
    }
    .gc-row  { animation: gcRow 6s ease-in-out infinite; }
    .gc-cell { animation: gcCell 6s ease-in-out infinite; }
    .gc-flow { animation: gcFlow 6s ease-in-out infinite; }
    .gc-scan { animation: gcScan 6s ease-in-out infinite; }

    /* ---------- PROJECT 2: JSON FORMATTER ---------- */
    @keyframes jfMin {
      0%        { opacity: 0; transform: scale(.96); }
      6%, 26%   { opacity: 1; transform: scale(1); filter: blur(0px); }
      34%       { opacity: 0; transform: scale(1.04); filter: blur(5px); }
      100%      { opacity: 0; }
    }
    @keyframes jfLine {
      0%, 34%   { opacity: 0; transform: translateY(7px); }
      42%, 86%  { opacity: 1; transform: translateY(0); }
      93%, 100% { opacity: 0; transform: translateY(-5px); }
    }
    @keyframes jfBadge {
      0%, 66%   { opacity: 0; transform: scale(.7); }
      73%       { opacity: 1; transform: scale(1.15); }
      78%, 88%  { opacity: 1; transform: scale(1); }
      95%, 100% { opacity: 0; transform: scale(.9); }
    }
    @keyframes jfCaret {
      0%, 49%   { opacity: 1; }
      50%, 100% { opacity: 0; }
    }
    .jf-min   { animation: jfMin 6s ease-in-out infinite; }
    .jf-line  { animation: jfLine 6s ease-out infinite; }
    .jf-badge { animation: jfBadge 6s ease-out infinite; }
    .jf-caret { animation: jfCaret 1s steps(1) infinite; }

    /* ---------- PROJECT 3: GAMESDOM ---------- */
    @keyframes gdTile {
      0%        { opacity: 0; transform: scale(.82); }
      8%, 44%   { opacity: 1; transform: scale(1); }
      54%, 88%  { opacity: 0; transform: scale(.9); }
      100%      { opacity: 0; transform: scale(.82); }
    }
    @keyframes gdKeep {
      0%        { opacity: 0; transform: scale(.82); }
      8%, 44%   { opacity: 1; transform: scale(1); }
      56%, 86%  { opacity: 1; transform: scale(1.08); }
      94%, 100% { opacity: 0; transform: scale(.95); }
    }
    @keyframes gdPlaceholder { 0%, 26% { opacity: 1; } 32%, 100% { opacity: 0; } }
    @keyframes gdQuery       { 0%, 28% { opacity: 0; } 34%, 88% { opacity: 1; } 94%, 100% { opacity: 0; } }
    .gd-tile        { animation: gdTile 6s ease-in-out infinite; }
    .gd-keep        { animation: gdKeep 6s ease-in-out infinite; }
    .gd-placeholder { animation: gdPlaceholder 6s ease-in-out infinite; }
    .gd-query       { animation: gdQuery 6s ease-in-out infinite; }

    /* ---------- LAYOUT (kept in CSS, not Tailwind) ----------
       These carry media queries, which inline styles can't express — and
       this project's Tailwind build has been dropping some spacing/width
       utilities, so classes here are the reliable route. */
    .rb-wrap  { top: -132px; right: 10%; }
    .exp-row  { gap: 48px; padding-top: 48px; padding-bottom: 64px; }
    .exp-date { width: 200px; flex-shrink: 0; padding-top: 10px; }

    /* ---------- NAV ---------- */
    html { scroll-behavior: smooth; }
    /* sections land below the fixed bar instead of under it */
    section[id] { scroll-margin-top: 72px; }
    .nav-bar   { height: 64px; padding: 0 24px; border-bottom: 1px solid transparent;
                 transition: background-color .4s ease, border-color .4s ease; }
    .nav-bar.is-scrolled { background-color: rgba(9,9,11,.75); border-color: #18181b;
                           backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); }
    .nav-links { gap: 32px; }

    /* ---------- ABOUT ---------- */
    .about-grid  { display: grid; grid-template-columns: 7fr 5fr; gap: 64px; margin-top: 72px; }
    .about-bio   { display: flex; flex-direction: column; gap: 22px; }
    .about-side  { display: flex; flex-direction: column; gap: 40px; }
    .about-label { margin-bottom: 14px; }
    .about-chips { display: flex; flex-wrap: wrap; gap: 8px; }
    .about-chip  { padding: 4px 10px; }
    .about-edu   { display: flex; flex-direction: column; gap: 18px; }

    /* ---------- MOBILE ---------- */
    @media (max-width: 767px) {
      /* Date sits above the role on narrow screens, so a fixed 200px column
         just adds dead space. */
      .exp-date { width: auto; padding-top: 0; }
      .exp-row  { gap: 18px; padding-top: 36px; padding-bottom: 44px; }
      .nav-bar   { padding: 0 16px; }
      .nav-links { gap: 18px; }
      .about-grid { grid-template-columns: 1fr; gap: 48px; margin-top: 48px; }
    }

    @media (max-width: 640px) {
      /* The robot is 160px wide before scaling; at 1.3 on a 375px screen it
         crowds the footer. Smaller scale means the feet land higher, so the
         top offset shifts with it. */
      .rb-wrap { top: -114px; right: 5%; }
      .rb-pose { transform: rotateX(-8deg) rotateY(-18deg) scale(0.92); }
      .rb-wrap:hover .rb-pose { transform: rotateX(-3deg) rotateY(0deg) scale(0.96); }
      /* The tooltip is ~280px of nowrap text centred on the robot — it ran off
         the right edge and caused horizontal scroll. Touch devices can't hover
         it anyway, so it's no loss. */
      .rb-tip { display: none; }
    }

    /* Static, fully legible fallback for reduced-motion users */
    @media (prefers-reduced-motion: reduce) {
      html { scroll-behavior: auto; }
      .rb-float, .rb-eye, .rb-wave, .rb-hand, .rb-armidle,
      .gc-row, .gc-cell, .gc-flow, .gc-scan,
      .jf-line, .jf-badge, .jf-caret,
      .gd-tile, .gd-keep, .gd-placeholder {
        animation: none !important; opacity: 1 !important; transform: none !important;
      }
      .jf-min, .gd-query { display: none !important; }
      .cap { animation: none !important; opacity: 0 !important; }
      .cap:last-child { opacity: 1 !important; }
    }
  `}</style>
);

/* ------------------------------------------------------------------
   BOX3D — six shaded faces assembled into a real cuboid.
   Every robot limb is one of these. `front` renders 2D children inside
   the front face (flat, so they paint in DOM order) — the only reliable
   way to put a detail on a surface without 3D sorting swallowing it.
------------------------------------------------------------------ */
const Box3D = ({ w, h, d, pos = "", shade = {}, glow = false, front = null }) => {
  const c = {
    front: shade.front || "#34343c",
    back: shade.back || "#202024",
    side: shade.side || "#2a2a31",
    top: shade.top || "#4b4b55",
    bottom: shade.bottom || "#1a1a1e",
  };
  const face = (fw, fh, transform, bg, content = null) => (
    <div
      className={`rb-face ${glow ? "rb-glow" : ""}`}
      style={{
        width: fw,
        height: fh,
        backgroundColor: bg,
        transform: `translate(-50%, -50%) ${transform}`,
      }}
    >
      {content}
    </div>
  );

  return (
    <div
      className="absolute rb-part"
      style={{
        left: "50%",
        top: "50%",
        width: w,
        height: h,
        transform: `translate(-50%, -50%) ${pos}`,
      }}
    >
      {face(w, h, `translateZ(${d / 2}px)`, c.front, front)}
      {face(w, h, `rotateY(180deg) translateZ(${d / 2}px)`, c.back)}
      {face(d, h, `rotateY(90deg) translateZ(${w / 2}px)`, c.side)}
      {face(d, h, `rotateY(-90deg) translateZ(${w / 2}px)`, c.side)}
      {face(w, d, `rotateX(90deg) translateZ(${h / 2}px)`, c.top)}
      {face(w, d, `rotateX(-90deg) translateZ(${h / 2}px)`, c.bottom)}
    </div>
  );
};

/* ------------------------------------------------------------------
   ROBOT ARM — a zero-size shoulder pivot holding an upper arm and a
   hand. Rotation lives on the pivot wrappers (never on Box3D itself,
   whose inline transform an animation would overwrite).
------------------------------------------------------------------ */
const RobotArm = ({ x, rest, waving = false }) => (
  <div
    className="absolute rb-part"
    style={{ left: "50%", top: "50%", width: 0, height: 0, transform: `translate3d(${x}px, -7px, 0)` }}
  >
    {/* shoulder joint */}
    <div
      className={`absolute rb-part ${waving ? "rb-wave" : "rb-armidle"}`}
      style={waving ? undefined : { transform: `rotateZ(${rest}deg)` }}
    >
      <Box3D w={7} h={22} d={7} pos="translateY(11px)" />

      {/* wrist joint: static offset outside, rotation inside */}
      <div className="absolute rb-part" style={{ transform: "translateY(22px)" }}>
        <div className={`absolute rb-part ${waving ? "rb-hand" : ""}`}>
          <Box3D w={9} h={7} d={9} pos="translateY(3px)" />
        </div>
      </div>
    </div>
  </div>
);

/* ------------------------------------------------------------------
   ROBOT 3D — the easter egg. Fixed three-quarter pose with an idle
   float, and he waves every few seconds. Hovering turns him to face
   you and lights the emerald bits.
------------------------------------------------------------------ */
const Robot3D = () => {
  const emerald = {
    front: "#10b981",
    back: "#047857",
    side: "#059669",
    top: "#34d399",
    bottom: "#065f46",
  };

  // Head shell is lighter than the body so the face has something to
  // read against.
  const shell = {
    front: "#45454f",
    back: "#232328",
    side: "#36363e",
    top: "#5d5d69",
    bottom: "#1f1f24",
  };

  // Chest light — a 2D child of the torso's front face, not a floating
  // 3D layer, so it can't sort behind the surface it sits on.
  const chestLight = (
    <div
      className="absolute rb-glow"
      style={{
        left: "50%", top: "50%", width: 11, height: 11,
        marginLeft: -5.5, marginTop: -9.5, borderRadius: 999,
        backgroundColor: "#34d399",
        boxShadow: "0 0 8px 1px rgba(52,211,153,.8)",
        transition: "filter .4s ease",
      }}
    />
  );

  return (
    <div className="rb-stage relative" style={{ width: 160, height: 160 }}>
      {/* ground shadow */}
      <div
        className="absolute rounded-full bg-black blur-md"
        style={{
          left: "50%",
          bottom: 24,
          width: 68,
          height: 12,
          animation: "rbShadow 3.4s ease-in-out infinite",
        }}
      />

      <div className="rb-float absolute inset-0">
        <div className="rb-pose absolute inset-0">
          {/* antenna */}
          <Box3D w={3} h={12} d={3} pos="translateY(-47px)" />
          <Box3D w={7} h={7} d={7} pos="translateY(-55px)" shade={emerald} glow />

          {/* head */}
          <Box3D w={36} h={28} d={28} pos="translateY(-28px)" shade={shell} />

          {/* Face — ONE flat plane (no preserve-3d), so the visor and eyes
              paint in DOM order instead of being sorted in 3D. Stacking
              them as separate 3D layers made an eye drop behind the visor. */}
          <div
            className="absolute"
            style={{
              left: "50%",
              top: "50%",
              width: 30,
              height: 15,
              transform: "translate(-50%, -50%) translate3d(0px, -28px, 15.5px)",
            }}
          >
            <div
              className="absolute"
              style={{
                left: 1, top: 0, width: 28, height: 15, borderRadius: 6,
                backgroundColor: "#080c0a",
                boxShadow: "inset 0 1px 3px rgba(0,0,0,.9), 0 0 0 1px rgba(52,211,153,.3)",
              }}
            >
              {/* No box-shadow on the eyes: a 6px glow either side of a
                  6px gap overlapped in the middle and read as a bright
                  vertical bar between them. The colour alone is enough. */}
              {[3.5, 17.5].map((left) => (
                <div
                  key={left}
                  className="absolute rb-glow rb-eye"
                  style={{
                    left, top: 4, width: 7, height: 7, borderRadius: 999,
                    backgroundColor: "#6ee7b7",
                    transition: "filter .4s ease",
                  }}
                />
              ))}
            </div>
          </div>

          {/* neck */}
          <Box3D w={10} h={5} d={10} pos="translateY(-11px)" />

          {/* torso, with the chest light painted onto its front face */}
          <Box3D w={32} h={30} d={22} pos="translateY(6px)" front={chestLight} />

          {/* arms — pushed clear of the torso so they read separately */}
          <RobotArm x={-23} rest={6} />
          <RobotArm x={23} rest={-6} waving />

          {/* legs + feet */}
          <Box3D w={9} h={15} d={9} pos="translateX(-8px) translateY(28px)" />
          <Box3D w={9} h={15} d={9} pos="translateX(8px) translateY(28px)" />
          <Box3D w={13} h={4} d={15} pos="translateX(-8px) translateY(37.5px)" />
          <Box3D w={13} h={4} d={15} pos="translateX(8px) translateY(37.5px)" />
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------
   PROJECT 1 ANIMATION — raw rows in, parsed, matrix out.
------------------------------------------------------------------ */
const GridConverterAnim = () => {
  const rows = ["A1,B1,C1", "A2,B2,C2", "A3,B3,C3"];
  const cells = ["A1", "B1", "C1", "A2", "B2", "C2", "A3", "B3", "C3"];
  const steps = ["01 / INGEST RAW ROWS", "02 / PARSE IN-BROWSER", "03 / RENDER MATRIX"];

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-3 md:gap-5 md:px-6">
      <div className="flex items-center justify-center gap-2 md:gap-7">
        {/* raw input */}
        <div className="flex flex-col gap-2">
          {rows.map((r, i) => (
            <div
              key={r}
              className="gc-row flex items-center gap-2 rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1"
              style={{ animationDelay: `${i * 0.16}s` }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-zinc-600" />
              <span className="font-mono text-zinc-400" style={{ fontSize: 10 }}>{r}</span>
            </div>
          ))}
        </div>

        {/* parser */}
        <div className="relative flex flex-col items-center">
          <div className="relative h-12 w-8 overflow-hidden rounded-md border border-emerald-500/60 bg-emerald-500/10">
            <div className="gc-scan absolute inset-x-0 h-1 bg-emerald-400" />
          </div>
          <div className="gc-flow mt-2 font-mono text-emerald-400" style={{ fontSize: 11 }}>→</div>
        </div>

        {/* matrix output */}
        <div className="grid grid-cols-3 gap-1.5">
          {cells.map((c, i) => (
            <div
              key={c}
              className="gc-cell flex h-6 w-7 md:h-7 md:w-9 items-center justify-center rounded border border-emerald-500/50 bg-emerald-500/10 font-mono text-emerald-300"
              style={{ animationDelay: `${i * 0.05}s`, fontSize: 9 }}
            >
              {c}
            </div>
          ))}
        </div>
      </div>

      {/* stepped caption */}
      <div className="relative h-4 w-full">
        {steps.map((s, i) => (
          <span
            key={s}
            className="cap absolute inset-x-0 text-center font-mono uppercase tracking-widest text-zinc-500"
            style={{ animationDelay: `${i * 2}s`, fontSize: 9 }}
          >
            {s}
          </span>
        ))}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------
   PROJECT 2 ANIMATION — minified payload, validated, beautified.
------------------------------------------------------------------ */
const JsonFormatterAnim = () => {
  const pretty = [
    { indent: 0, content: <><span className="text-emerald-400">{"{"}</span></> },
    { indent: 1, content: <><span className="text-sky-300">"rows"</span><span className="text-zinc-500">: </span><span className="text-emerald-400">{"["}</span></> },
    { indent: 2, content: <><span className="text-emerald-400">{"{ "}</span><span className="text-sky-300">"id"</span><span className="text-zinc-500">: </span><span className="text-amber-300">1</span><span className="text-zinc-500">, </span><span className="text-sky-300">"cell"</span><span className="text-zinc-500">: </span><span className="text-amber-300">"A1"</span><span className="text-emerald-400">{" }"}</span></> },
    { indent: 1, content: <><span className="text-emerald-400">{"]"}</span><span className="text-zinc-500">,</span></> },
    { indent: 1, content: <><span className="text-sky-300">"ok"</span><span className="text-zinc-500">: </span><span className="text-amber-300">true</span></> },
    { indent: 0, content: <><span className="text-emerald-400">{"}"}</span></> },
  ];
  const steps = ["01 / PASTE PAYLOAD", "02 / VALIDATE SYNTAX", "03 / BEAUTIFY OUTPUT"];

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center px-4 md:px-6">
      <div className="relative flex w-full max-w-xs items-center justify-center" style={{ height: 132 }}>
        {/* minified, unreadable payload */}
        <div className="jf-min absolute inset-x-0 flex items-center justify-center">
          <div className="w-full truncate rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 font-mono text-zinc-500" style={{ fontSize: 10 }}>
            {'{"rows":[{"id":1,"cell":"A1"}],"ok":true}'}
            <span className="jf-caret text-emerald-400">▌</span>
          </div>
        </div>

        {/* expanded, formatted output */}
        <div className="absolute inset-x-0 top-0">
          {pretty.map((line, i) => (
            <div
              key={i}
              className="jf-line flex items-center font-mono leading-5"
              style={{ animationDelay: `${i * 0.11}s`, paddingLeft: line.indent * 14, fontSize: 10 }}
            >
              <span className="mr-3 select-none text-zinc-700" style={{ fontSize: 9 }}>{i + 1}</span>
              {line.content}
            </div>
          ))}
        </div>

        {/* validity badge */}
        <div className="jf-badge absolute bottom-0 right-0 flex items-center gap-1.5 rounded-full border border-emerald-500/50 bg-emerald-500/10 px-2.5 py-1">
          <svg className="h-3 w-3 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span className="font-mono uppercase tracking-widest text-emerald-300" style={{ fontSize: 9 }}>Valid</span>
        </div>
      </div>

      {/* stepped caption */}
      <div className="relative mt-3 h-4 w-full">
        {steps.map((s, i) => (
          <span
            key={s}
            className="cap absolute inset-x-0 text-center font-mono uppercase tracking-widest text-zinc-500"
            style={{ animationDelay: `${i * 2}s`, fontSize: 9 }}
          >
            {s}
          </span>
        ))}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------
   PROJECT 3 ANIMATION — the catalog, then a search that filters it.
------------------------------------------------------------------ */
const GAMES = ["SNAKE", "TIC TAC TOE", "MAZE", "SPACE", "RUNNER", "+5 SOON"];

const GamesDomAnim = () => {
  const steps = ["01 / BROWSE CATALOG", "02 / SEARCH & FILTER", "03 / PLAY IN-PAGE"];

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ gap: 14 }}>
      {/* search field */}
      <div
        className="flex items-center rounded-full border border-zinc-700 bg-zinc-900"
        style={{ width: 196, padding: "5px 11px", gap: 7 }}
      >
        <svg className="text-zinc-600" style={{ width: 9, height: 9 }} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.3-4.3" strokeLinecap="round" />
        </svg>
        <span className="relative font-mono" style={{ fontSize: 9 }}>
          <span className="gd-placeholder text-zinc-600">Search games…</span>
          <span className="gd-query absolute text-emerald-300" style={{ left: 0, top: 0 }}>
            snake<span className="jf-caret">▌</span>
          </span>
        </span>
      </div>

      {/* catalog grid — everything fades but the match */}
      <div className="grid grid-cols-3" style={{ gap: 7 }}>
        {GAMES.map((g, i) => (
          <div
            key={g}
            className={`flex items-center justify-center rounded border text-center font-mono leading-tight ${
              i === 0
                ? "gd-keep border-emerald-500/60 bg-emerald-500/10 text-emerald-300"
                : "gd-tile border-zinc-700 bg-zinc-900 text-zinc-500"
            }`}
            style={{ animationDelay: `${i * 0.06}s`, width: 62, height: 36, fontSize: 8, padding: 3 }}
          >
            {g}
          </div>
        ))}
      </div>

      {/* stepped caption */}
      <div className="relative h-4 w-full">
        {steps.map((s, i) => (
          <span
            key={s}
            className="cap absolute inset-x-0 text-center font-mono uppercase tracking-widest text-zinc-500"
            style={{ animationDelay: `${i * 2}s`, fontSize: 9 }}
          >
            {s}
          </span>
        ))}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------
   UTILITY KIT — both tools live on one site (https://jsoncsvvisualizer.com),
   so they share one card.
------------------------------------------------------------------ */
const TOOLS = ["JSON ⇄ CSV", "JSON Formatter"];

const ToolShowcase = () => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    // 9s ≈ one and a half loops of the 6s animations, so neither gets cut
    // off mid-cycle every time
    const id = setInterval(() => setActive((n) => (n + 1) % TOOLS.length), 9000);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <div className="absolute z-10 flex gap-2" style={{ top: 16, left: 16 }}>
        {TOOLS.map((label, n) => (
          <span
            key={label}
            className={`font-mono uppercase tracking-widest rounded-full border transition-colors duration-500 ${
              n === active
                ? "border-emerald-500/60 bg-emerald-500/10 text-emerald-300"
                : "border-zinc-800 text-zinc-600"
            }`}
            style={{ fontSize: 9, padding: "3px 9px" }}
          >
            {label}
          </span>
        ))}
      </div>

      <div className="absolute inset-0 transition-opacity duration-700" style={{ opacity: active === 0 ? 1 : 0 }}>
        <GridConverterAnim />
      </div>
      <div className="absolute inset-0 transition-opacity duration-700" style={{ opacity: active === 1 ? 1 : 0 }}>
        <JsonFormatterAnim />
      </div>
    </>
  );
};

/* ------------------------------------------------------------------
   ABOUT — headline, a short bio, and the skills / education sidebar.
   Everything here comes from the resume; keep the two in sync.
------------------------------------------------------------------ */
const SKILLS = [
  { group: "Languages", items: ["JavaScript", "Python", "HTML5", "CSS"] },
  { group: "Frameworks", items: ["React", "Tailwind CSS", "Flask", "Node.js"] },
  { group: "Databases", items: ["PostgreSQL", "MySQL"] },
  { group: "Tools", items: ["Git", "GitHub", "VS Code", "Figma", "Colab"] },
];

const EDUCATION = [
  { degree: "Master of Computer Applications", school: "K.R. Mangalam University, Gurugram", period: "2022 — 2024" },
  { degree: "Bachelor of Computer Applications", school: "St. Xavier's College, Jaipur", period: "2018 — 2021" },
];

const About = () => (
  <section id="about" className="px-6 max-w-5xl mx-auto py-32">
    <Reveal>
      <h4 className="text-sm font-bold text-emerald-500 tracking-widest uppercase text-center" style={{ marginBottom: 56 }}>
        About
      </h4>
      <h3 className="text-3xl md:text-5xl font-medium leading-tight text-white">
        I build <span className="text-emerald-400">fast, secure, and scalable</span> web applications. Passionate about creating seamless user experiences and robust architectures.
      </h3>
    </Reveal>

    <div className="about-grid">
      <Reveal delay={100}>
        <div className="about-bio text-lg leading-relaxed text-zinc-400">
          <p>
            I'm a full stack developer with over a year of
            experience building web and Android applications. At{" "}
            <span className="text-white">Dr. Herald Innovations</span> I built the
            company's website and an Android music-streaming prototype, working
            across the whole stack: UI, APIs, authentication, testing, and deployment.
          </p>
          <p>
            Outside of work I'm building <span className="text-white">EleStack</span>, the
            name all my independent products ship under. The first two are{" "}
            <span className="text-white">Utility Kit</span>, a set of browser-only tools for
            converting and formatting data, and <span className="text-white">GamesDom</span>,
            a free browser-games portal built with Python, Flask, and PostgreSQL.
          </p>
          <p>
            Before that I was a machine learning intern at Cognifyz Technologies,
            collecting, cleaning, and analysing datasets in Python. That gave me
            a soft spot for the data side of an app, not just the interface.
          </p>
        </div>
      </Reveal>

      <Reveal delay={200}>
        <div className="about-side">
          <div>
            <p className="about-label font-mono text-xs uppercase tracking-widest text-zinc-600">Skills</p>
            <div className="about-edu">
              {SKILLS.map((s) => (
                <div key={s.group}>
                  <p className="text-sm text-emerald-500" style={{ marginBottom: 8 }}>{s.group}</p>
                  <div className="about-chips">
                    {s.items.map((item) => (
                      <span
                        key={item}
                        className="about-chip rounded-full border border-zinc-800 bg-zinc-900/60 font-mono text-xs text-zinc-400"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="about-label font-mono text-xs uppercase tracking-widest text-zinc-600">Education</p>
            <div className="about-edu">
              {EDUCATION.map((e) => (
                <div key={e.degree}>
                  <p className="text-white font-semibold">{e.degree}</p>
                  <p className="text-sm text-zinc-500">{e.school}</p>
                  <p className="font-mono text-xs uppercase tracking-widest text-zinc-600" style={{ marginTop: 4 }}>{e.period}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  </section>
);

/* ------------------------------------------------------------------
   EXPERIENCE — work history. The music app was built for Dr. Herald
   Innovations, so it lives here as a contribution rather than as a
   personal project card.
------------------------------------------------------------------ */
const ROLES = [
  {
    period: "Jul 2025 — Feb 2026",
    title: "Assistant Software Developer",
    org: "Dr. Herald Innovations",
    place: "Bhiwadi",
    points: [
      "Built a responsive company website with modern web tooling — accessible UI/UX layouts, cross-browser compatibility, and optimized load performance.",
      "Developed an Android prototype for instrumental and meditative music streaming, aimed at relaxation, focus, and sleep — audio playback, category-based navigation, and per-user playlists.",
      "Integrated the backend over APIs with secure user authentication, then owned testing, debugging, performance optimization, and deployment planning.",
    ],
  },
  {
    period: "Jul — Aug 2023",
    title: "Web Development Intern",
    org: "Academor",
    points: [
      "Built a weather forecast website in HTML, CSS, and JavaScript that shows a 7-day forecast for cities, powered by the OpenWeatherMap API.",
      "Recognised on completion as an energetic and keen learner.",
    ],
  },
];

const Experience = () => (
  <section id="experience" className="px-6 max-w-5xl mx-auto pt-12 pb-32">
    <Reveal>
      <h4
        className="text-sm font-bold text-emerald-500 tracking-widest uppercase text-center"
        style={{ marginBottom: 80 }}
      >
        Experience
      </h4>
    </Reveal>

    {ROLES.map((r, i) => (
      <Reveal key={r.title} delay={i * 100}>
        {/* Column width, gap and measure are inline: the md:w-44 /
            md:gap-16 / md:shrink-0 utilities weren't surviving the
            Tailwind build, which collapsed the date column onto the title. */}
        <div className="exp-row group border-t border-zinc-900 hover:border-emerald-500/40 transition-colors flex flex-col md:flex-row">
          <div className="exp-date">
            <span
              className="font-mono text-xs uppercase tracking-widest text-zinc-600"
              style={{ whiteSpace: "nowrap" }}
            >
              {r.period}
            </span>
          </div>

          <div style={{ maxWidth: 640 }}>
            <h5 className="text-2xl md:text-3xl font-bold text-white group-hover:text-emerald-400 transition-colors">
              {r.title}
            </h5>
            <p className="text-sm tracking-wide text-emerald-500" style={{ marginTop: 8 }}>
              {r.org}{r.place ? ` · ${r.place}` : ""}
            </p>

            <ul style={{ marginTop: 28, display: "flex", flexDirection: "column", gap: 20 }}>
              {r.points.map((p) => (
                <li key={p} className="leading-relaxed text-zinc-400" style={{ display: "flex", gap: 16 }}>
                  <span
                    className="rounded-full bg-emerald-500/70"
                    style={{ width: 6, height: 6, marginTop: 10, flexShrink: 0 }}
                  />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Reveal>
    ))}
  </section>
);

/* ------------------------------------------------------------------
   NAV — fixed bar of anchor links. Transparent over the hero, then
   picks up a blurred backdrop once the page scrolls under it.
------------------------------------------------------------------ */
const NAV_LINKS = [
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#work", label: "Work" },
  { href: "#contact", label: "Contact" },
];

const Nav = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`nav-bar fixed inset-x-0 top-0 z-50 flex items-center justify-between ${scrolled ? "is-scrolled" : ""}`}>
      <a href="#top" aria-label="Back to top" className="flex items-center">
        <img src="/logo.svg" alt="EleStack" className="h-5 w-auto" width="33" height="20" />
      </a>
      <ul className="nav-links flex items-center">
        {NAV_LINKS.map((l) => (
          <li key={l.href}>
            <a
              href={l.href}
              className="font-mono text-xs uppercase tracking-widest text-zinc-500 hover:text-emerald-400 transition-colors"
            >
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default function App() {
  return (
    <div className="bg-zinc-950 text-zinc-300 font-sans selection:bg-emerald-500/30 overflow-x-hidden">
      {/* overflow-x-hidden: absolutely-positioned decoration (the robot, the
        tooltip) can extend past the viewport on narrow screens, and any
        overflow gives the whole page a horizontal scrollbar. */}
      <Styles />
      <Nav />

      {/* Subtle Cinematic Background Glow */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-zinc-900/40 via-zinc-950 to-zinc-950"></div>

      {/* Main Content */}
      <div className="relative z-10">

        {/* --- 1. HERO SECTION (Full Height) --- */}
        {/* Mobile: anchored near the top instead of centred, and svh so the
            browser address bar doesn't push everything down. */}
        <section id="top" className="min-h-svh flex flex-col justify-start pt-[28vh] md:justify-center md:pt-0 items-center text-center px-6 relative">
          <Reveal delay={100}>
            {/* Logo lives at public/logo.svg — Vite serves public/ from the
                site root, so the src is "/logo.svg" (no import needed).
                If your logo already contains the word "EleStack", delete the
                <span> below and bump the logo to h-8 or h-10. */}
            <div className="flex items-center justify-center gap-3 mb-8 group">
              {/* 5:3 mark — width/height must match that ratio or the browser
                  reserves the wrong space and the row shifts as it loads */}
              <img
                src="/logo.svg"
                alt="EleStack"
                className="h-7 w-auto"
                width="47"
                height="28"
              />
              <span className="text-xl font-bold text-white tracking-widest uppercase">EleStack</span>
            </div>
          </Reveal>

          <Reveal delay={300}>
            <h1 className="text-6xl md:text-8xl font-bold text-white tracking-tighter mb-6">
              Eleena.
            </h1>
          </Reveal>

          <Reveal delay={500}>
            <h2 className="text-xl md:text-2xl text-zinc-500 font-light tracking-widest uppercase">
              Full Stack Developer
            </h2>
          </Reveal>

          {/* Bouncing Scroll Indicator */}
          <Reveal delay={1000} className="absolute bottom-12 left-1/2 -translate-x-1/2">
            <div className="flex flex-col items-center gap-2 text-zinc-600 animate-bounce">
              <span className="text-xs uppercase tracking-widest font-bold">Scroll</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
            </div>
          </Reveal>
        </section>

        {/* --- 2. ABOUT SECTION --- */}
        <About />

        {/* --- 3. EXPERIENCE SECTION --- */}
        <Experience />

        {/* --- 4. PROJECTS SECTION --- */}
        <section id="work" className="min-h-screen px-6 max-w-5xl mx-auto py-24 flex flex-col justify-center">
          <Reveal>
            <h4 className="text-sm font-bold text-emerald-500 tracking-widest uppercase mb-16 text-center">
              Selected Works
            </h4>
          </Reveal>

          {/* EleStack intro — both projects below ship under this name */}
          <Reveal>
            <div
              className="rounded-2xl border border-zinc-800 bg-zinc-900/40 text-center"
              style={{ padding: "36px 28px", marginBottom: 96 }}
            >
              <a
                href="https://jsoncsvvisualizer.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 text-white hover:text-emerald-400 transition-colors"
                style={{ marginBottom: 16 }}
              >
                <img src="/logo.svg" alt="" className="h-6 w-auto" width="40" height="24" />
                <span className="text-lg font-bold tracking-widest uppercase">EleStack</span>
              </a>
              <p className="text-zinc-400 text-lg leading-relaxed mx-auto" style={{ maxWidth: 600 }}>
                My independent product label. Every tool and game I build on my own
                ships under EleStack, starting with the two projects below.
              </p>
            </div>
          </Reveal>

          <div className="space-y-32">

            {/* One card: both tools ship as part of the same site, live at jsoncsvvisualizer.com */}
            <Reveal>
              <a
                href="https://jsoncsvvisualizer.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group block md:grid grid-cols-12 gap-8 items-center"
              >
                <div className="col-span-7 bg-zinc-900/50 aspect-video rounded-2xl overflow-hidden border border-zinc-800 group-hover:border-emerald-500/50 transition-colors relative flex items-center justify-center mb-6 md:mb-0">
                  <ToolShowcase />
                </div>
                <div className="col-span-5">
                  <p className="font-mono text-xs uppercase tracking-widest text-zinc-600 mb-2">An EleStack product</p>
                  <h5 className="text-3xl font-bold text-white group-hover:text-emerald-400 transition-colors mb-4">Utility Kit</h5>
                  <p className="text-zinc-400 text-lg leading-relaxed mb-6">
                    A toolkit for everyday developer chores: convert structured data between JSON and CSV, and beautify or validate minified payloads. Every tool runs entirely in the browser, so nothing you paste is ever sent to a server.
                  </p>
                  <span className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-emerald-500">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Live · jsoncsvvisualizer.com ↗
                  </span>
                </div>
              </a>
            </Reveal>

            {/* GamesDom — no link yet, so this card is a div, not an anchor */}
            <Reveal delay={100}>
              <div className="group block md:grid grid-cols-12 gap-8 items-center">
                <div className="col-span-5 order-2 md:order-1 mt-6 md:mt-0">
                  <p className="font-mono text-xs uppercase tracking-widest text-zinc-600 mb-2">An EleStack product</p>
                  <h5 className="text-3xl font-bold text-white mb-4">GamesDom</h5>
                  <p className="text-zinc-400 text-lg leading-relaxed mb-5">
                    A portal for free browser games - a searchable catalog where every title gets its own page and plays instantly, with nothing to install.
                  </p>
                  <p className="text-zinc-500 text-sm leading-relaxed mb-6">
                    Working today: catalog with live search and suggestions, per-game pages, Snake Arena and Tic Tac Toe playable. Next up: the remaining games and player accounts.
                  </p>
                  <span className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-amber-400/90">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
                    In progress
                  </span>
                </div>
                {/* no hover highlight: the card isn't a link yet */}
                <div className="col-span-7 order-1 md:order-2 bg-zinc-900/50 aspect-video rounded-2xl overflow-hidden border border-zinc-800 relative flex items-center justify-center">
                  <GamesDomAnim />
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* --- 5. FOOTER & CONTACT --- */}
        <section id="contact" className="py-32 px-6 border-t border-zinc-900 relative">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <Reveal>
              <div className="text-center md:text-left">
                <h4 className="text-2xl font-bold text-white mb-2">Let's build something.</h4>
                <a href="mailto:info@elestack.com" className="text-zinc-400 hover:text-emerald-400 transition-colors">info@elestack.com</a>
              </div>
            </Reveal>

            <Reveal delay={200}>
              <div className="flex gap-6">
                <a href="https://github.com/eleena1301" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white hover:-translate-y-1 transition-all">GitHub</a>
                <a href="https://linkedin.com/in/eleena1301" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white hover:-translate-y-1 transition-all">LinkedIn</a>
              </div>
            </Reveal>
          </div>

          {/* --- THE 3D ROBOT EASTER EGG --- */}
          {/* Stands on the footer line. Hover him to make him turn and wave faster. */}
          <div className="rb-wrap absolute cursor-pointer group">
            <div className="rb-tip absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white text-zinc-900 text-xs font-bold px-3 py-1.5 rounded-lg whitespace-nowrap shadow-lg pointer-events-none">
              wow, you scrolled all the way down here!
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-white"></div>
            </div>

            <Robot3D />
          </div>
        </section>
      </div>
    </div>
  );
}
