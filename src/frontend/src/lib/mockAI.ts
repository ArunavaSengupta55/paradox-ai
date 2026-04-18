import type { AppMode, ReasoningStyle } from "@/types";

interface MockResponse {
  title: string;
  sections: { heading: string; body: string }[];
}

const CREATIVE_TEXT: MockResponse = {
  title: "Creative Synthesis",
  sections: [
    {
      heading: "Imaginative Framing",
      body: "Your question opens a canvas of possibilities. At the intersection of language and thought, ideas bloom like fractal patterns — each concept breeding a dozen more. Paradox.ai thrives in this liminal space where structured creativity meets boundless imagination.",
    },
    {
      heading: "Narrative Arc",
      body: "Think of this not as a query, but as the opening line of a story. The protagonist (you) stands at the threshold of insight, armed with curiosity. What emerges isn't an answer — it's a new way of seeing the question itself.",
    },
    {
      heading: "Unexpected Connections",
      body: "The most profound responses often live in metaphor. Consider how jazz musicians improvise within structure — freedom born from constraint. Your prompt carries that same creative tension, inviting exploration across domains most systems would never bridge.",
    },
  ],
};

const ANALYTICAL_TEXT: MockResponse = {
  title: "Analytical Breakdown",
  sections: [
    {
      heading: "Core Components",
      body: "Breaking this down systematically: the query contains three distinct dimensions — scope, context, and intent. Each requires targeted analysis before synthesis. Starting with scope narrows the solution space and prevents analytical drift.",
    },
    {
      heading: "Evidence Framework",
      body: "Available data points suggest a multi-variable relationship. When weighted by relevance: primary factors account for ~70% of outcome variance; secondary factors contribute ~25%; residual noise occupies the remaining margin. This distribution supports a structured, iterative approach.",
    },
    {
      heading: "Actionable Conclusions",
      body: "Based on the analysis: (1) Prioritize high-leverage inputs first. (2) Establish measurable success criteria before proceeding. (3) Build feedback loops into the implementation to enable course correction. Each step should be validated against your original intent.",
    },
  ],
};

const TECHNICAL_TEXT: MockResponse = {
  title: "Technical Deep Dive",
  sections: [
    {
      heading: "Architecture Overview",
      body: "From a systems perspective, this maps to a well-known pattern: input validation → transformation pipeline → output rendering. The key constraint is maintaining idempotency across the transformation layers to ensure reproducible results under varying load conditions.",
    },
    {
      heading: "Implementation Notes",
      body: "The optimal approach leverages a composable function pipeline. Each transformation step should be pure and side-effect-free, enabling parallel execution where dependencies allow. Consider using memoization for repeated sub-computations to reduce O(n) to O(1) in hot paths.",
    },
    {
      heading: "Edge Cases & Mitigations",
      body: "Critical edge cases: null/empty inputs must be handled at the boundary layer. Race conditions in async flows should be mitigated with proper cancellation tokens. Rate limiting should be applied at the ingress point with exponential backoff for retry logic.",
    },
  ],
};

const IMAGE_RESPONSES: Record<ReasoningStyle, MockResponse> = {
  Creative: {
    title: "Visual Concept Generation",
    sections: [
      {
        heading: "Aesthetic Direction",
        body: "Envision a composition built on contrast — deep shadows punctuated by luminous highlights. The color palette drifts toward desaturated midtones with one vibrant focal accent, drawing the eye along a deliberate visual path.",
      },
      {
        heading: "Compositional Structure",
        body: "Rule of thirds with dynamic tension: place the primary subject at the upper-right intersection, allow negative space to breathe on the left. This creates subconscious forward momentum, suggesting motion even in static frames.",
      },
    ],
  },
  Analytical: {
    title: "Image Analysis Report",
    sections: [
      {
        heading: "Visual Elements Detected",
        body: "Structural analysis identifies: foreground subjects (high contrast, sharp edges), midground context (moderate detail, transitional tones), and background environment (low frequency, atmospheric depth). The luminosity histogram skews toward the upper quartile.",
      },
      {
        heading: "Composition Metrics",
        body: "Balance score: 0.84/1.0 (near-symmetrical). Edge density: high (complex scene). Color harmony: complementary scheme with warm-cool tension. Dominant hue falls in the 200–220° range, suggesting cool, authoritative tonality.",
      },
    ],
  },
  Technical: {
    title: "Image Processing Pipeline",
    sections: [
      {
        heading: "Rendering Parameters",
        body: "Optimal resolution: 2048×1024px at 72dpi for web, 300dpi for print output. Apply sRGB color profile for screen-accurate rendering. Use bicubic interpolation for upscaling; Lanczos for downscaling to preserve edge fidelity.",
      },
      {
        heading: "Compression & Delivery",
        body: "Encode as WebP with quality 85 for web delivery (~40% smaller than JPEG at equivalent perceptual quality). Provide AVIF fallback for modern browsers. Implement lazy loading with LQIP placeholders to optimize LCP metrics.",
      },
    ],
  },
};

const VIDEO_RESPONSES: Record<ReasoningStyle, MockResponse> = {
  Creative: {
    title: "Video Narrative Concept",
    sections: [
      {
        heading: "Story Arc",
        body: "Open with an arresting three-second hook — no title cards, no context. Drop the viewer into the middle of action. The first thirty seconds must create a question in the audience's mind that only the next two minutes can answer.",
      },
      {
        heading: "Pacing & Rhythm",
        body: "Cut to the beat of an implied tempo even without music. Short cuts build urgency; long takes build intimacy. Alternate between the two to create emotional contrast — the valleys make the peaks feel earned.",
      },
    ],
  },
  Analytical: {
    title: "Video Performance Analysis",
    sections: [
      {
        heading: "Engagement Metrics",
        body: "Average view duration benchmark: 45–60% for content >2min. Drop-off typically occurs at the 30-second mark if value proposition isn't established. Chapters and timestamps reduce abandonment by 23% on average across similar content categories.",
      },
      {
        heading: "Production Quality Factors",
        body: "Audio quality outranks video quality in viewer retention studies by a 3:1 margin. Lighting consistency across cuts signals professionalism. Thumbnail-to-content alignment reduces bounce rates; misaligned thumbnails increase them by up to 40%.",
      },
    ],
  },
  Technical: {
    title: "Video Technical Specifications",
    sections: [
      {
        heading: "Encoding Parameters",
        body: "Target bitrate: 8–12 Mbps for 1080p H.264; 4–6 Mbps for H.265/HEVC at equivalent quality. Frame rate: 24fps for cinematic content, 60fps for screen recordings. Two-pass encoding mandatory for fixed bitrate delivery.",
      },
      {
        heading: "Delivery Pipeline",
        body: "Implement adaptive bitrate streaming (HLS or DASH) with 5 quality tiers. CDN edge caching with 24hr TTL for static segments. Buffer 10 seconds ahead minimum. Implement seek optimization with keyframe intervals ≤2 seconds.",
      },
    ],
  },
};

const MUSIC_RESPONSES: Record<ReasoningStyle, MockResponse> = {
  Creative: {
    title: "Musical Composition Concept",
    sections: [
      {
        heading: "Melodic Theme",
        body: "Begin with a sparse, unresolved motif — just four notes that create expectation without satisfaction. Let silence be the fifth note. Build around this kernel gradually, introducing harmonic context only after the listener has committed to the mystery.",
      },
      {
        heading: "Sonic Texture",
        body: "Layer contrasting timbres: something crystalline (high piano, metallophone) against something warm and diffuse (bowed strings, sustained pad). The tension between precision and ambiguity is where emotional resonance lives.",
      },
    ],
  },
  Analytical: {
    title: "Music Theory Analysis",
    sections: [
      {
        heading: "Harmonic Structure",
        body: "The progression implies a Dorian mode tonality — minor with a raised 6th, lending a characteristic blend of melancholy and brightness. Chord density peaks at the bridge, where secondary dominants create forward harmonic momentum before resolving to the tonic.",
      },
      {
        heading: "Rhythmic Patterns",
        body: "Underlying pulse is stable (4/4, 120bpm) but the melodic phrasing implies 3 against 4 — a consistent polyrhythmic texture that creates propulsion without instability. Syncopation is weighted toward beats 2 and 4, consistent with contemporary production idioms.",
      },
    ],
  },
  Technical: {
    title: "Audio Production Specs",
    sections: [
      {
        heading: "Mix Parameters",
        body: "Target LUFS: -14 LUFS integrated for streaming platforms (Spotify, Apple Music normalization targets). True peak ceiling: -1.0 dBTP. Dynamic range: 8–12 DR for modern production; expand to 14+ for classical/acoustic. Stereo width: full on elements above 200Hz, mono below for bass integrity.",
      },
      {
        heading: "Mastering Chain",
        body: "Signal chain: multiband compression → linear phase EQ → stereo imaging → limiting. Order is non-negotiable for phase coherence. Final limiter attack: 0.1ms, release: auto. Avoid brick-wall limiting that crushes transients — preserve 1–2dB of headroom for micro-dynamics.",
      },
    ],
  },
};

const ANALYTICS_RESPONSES: Record<ReasoningStyle, MockResponse> = {
  Creative: {
    title: "Data Story Narrative",
    sections: [
      {
        heading: "The Hidden Pattern",
        body: "Every dataset tells a story most analysts never find — buried beneath averages and trend lines lies the outlier that breaks the model and reveals the truth. Your data contains at least three such anomalies worth investigating before drawing conclusions.",
      },
      {
        heading: "Visualization Concept",
        body: "Resist the bar chart reflex. The story in your data calls for a flow visualization: show how values migrate between states over time. The movement IS the insight. Static snapshots will flatten what is fundamentally a dynamic phenomenon.",
      },
    ],
  },
  Analytical: {
    title: "Statistical Analysis Summary",
    sections: [
      {
        heading: "Descriptive Statistics",
        body: "Central tendency: mean and median diverge by >15%, indicating right-skew distribution — median is the more reliable measure of typical value. Standard deviation spans 2.3x the interquartile range, suggesting significant outlier influence on aggregate metrics.",
      },
      {
        heading: "Correlation Findings",
        body: "Pearson r = 0.73 between primary variables (p < 0.01, n = 1,847). This correlation is statistically significant but caution is warranted: the relationship accounts for 53% of variance, leaving 47% unexplained. Lurking variable analysis recommended before causal inference.",
      },
    ],
  },
  Technical: {
    title: "Analytics Pipeline Architecture",
    sections: [
      {
        heading: "Data Ingestion Layer",
        body: "Implement event streaming with schema validation at ingress. Use Apache Avro for serialization with backward-compatible schema evolution. Partition by date and event_type for optimal query performance. Maintain raw data retention for 90 days minimum before aggregation.",
      },
      {
        heading: "Query Optimization",
        body: "Materialized views for common aggregation patterns reduce query time from O(n) full scans to O(1) lookups. Columnar storage (Parquet) over row storage for analytics workloads — 10–50x faster for column-selective queries. Implement query result caching with 5-minute TTL for dashboard refreshes.",
      },
    ],
  },
};

const MODE_MAP: Record<AppMode, Record<ReasoningStyle, MockResponse>> = {
  Text: {
    Creative: CREATIVE_TEXT,
    Analytical: ANALYTICAL_TEXT,
    Technical: TECHNICAL_TEXT,
  },
  Image: IMAGE_RESPONSES,
  Video: VIDEO_RESPONSES,
  Music: MUSIC_RESPONSES,
  Analytics: ANALYTICS_RESPONSES,
};

function formatResponse(r: MockResponse): string {
  const lines: string[] = [`# ${r.title}`, ""];
  for (const s of r.sections) {
    lines.push(`## ${s.heading}`, "", s.body, "");
  }
  return lines.join("\n").trim();
}

export async function generateMockResponse(
  prompt: string,
  mode: AppMode,
  reasoningStyle: ReasoningStyle,
): Promise<string> {
  // Simulate network latency
  await new Promise((resolve) =>
    setTimeout(resolve, 900 + Math.random() * 800),
  );

  const template = MODE_MAP[mode][reasoningStyle];

  // Personalize slightly by weaving the prompt into the first section body
  const personalized = {
    ...template,
    sections: template.sections.map((s, i) =>
      i === 0
        ? {
            ...s,
            body: `${s.body} (Responding to: "${prompt.slice(0, 80)}${prompt.length > 80 ? "…" : ""}")`,
          }
        : s,
    ),
  };

  return formatResponse(personalized);
}
