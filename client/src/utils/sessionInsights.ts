import { DistractionEvent } from '@/hooks/useDistractionDetector';

export type DistractionTiming = 'early' | 'mid' | 'late';

export interface DistractionDetail {
  id: string;
  minutesLost: number;
  secondsLost: number;
  timing: DistractionTiming;
  timeIntoSession: string;
}

export interface SessionInsight {
  totalMinutesLost: number;
  totalSecondsLost: number;
  distractionCount: number;
  distractionRate: number;
  mostCommonTiming: DistractionTiming | null;
  timingBreakdown: Record<DistractionTiming, number>;
  longestDistraction: number | null;
  headline: string;
  tip: string;
  details: DistractionDetail[];
}

export function computeSessionInsight(
  distractions: DistractionEvent[],
  sessionStartedAt: string,
  durationMinutes: number
): SessionInsight {
  const distractionCount = distractions.length;
  const totalSessionSeconds = Math.max(durationMinutes * 60, 1);

  const totalSecondsLost = distractions.reduce(
    (sum, d) => sum + (d.durationSeconds ?? 0),
    0
  );
  const totalMinutesLost = Math.round(totalSecondsLost / 60);


  const distractionRate = totalSessionSeconds > 0
    ? Math.min(100, Math.round((totalSecondsLost / totalSessionSeconds) * 100))
    : 0;

  if (distractionCount === 0) {
    return {
      totalMinutesLost: 0,
      totalSecondsLost: 0,
      distractionCount: 0,
      distractionRate: 0,
      mostCommonTiming: null,
      timingBreakdown: { early: 0, mid: 0, late: 0 },
      longestDistraction: null,
      headline: "Zero time lost to other apps this session.",
      tip: "Whatever you did to set up this session, repeat it next time.",
      details: [],
    };
  }

  const startMs = new Date(sessionStartedAt).getTime();
  const totalDurationMs = durationMinutes * 60 * 1000;

  const timingBreakdown: Record<DistractionTiming, number> = {
    early: 0,
    mid: 0,
    late: 0,
  };

  let longestDistraction = 0;
  const details: DistractionDetail[] = [];

  for (const d of distractions) {
    const leftMs = new Date(d.leftAt).getTime();
    const position = totalDurationMs > 0 ? (leftMs - startMs) / totalDurationMs : 0;
    const secondsIntoSession = Math.max(0, Math.round((leftMs - startMs) / 1000));
    const minutesIntoSession = Math.floor(secondsIntoSession / 60);

    let timing: DistractionTiming;
    if (position < 0.33) timing = 'early';
    else if (position < 0.66) timing = 'mid';
    else timing = 'late';

    timingBreakdown[timing] += 1;

    const secondsLost = d.durationSeconds ?? 0;
    if (secondsLost > longestDistraction) longestDistraction = secondsLost;

    details.push({
      id: d.id,
      secondsLost,
      minutesLost: Math.round(secondsLost / 60),
      timing,
      timeIntoSession: minutesIntoSession < 1
        ? 'right at the start'
        : `${minutesIntoSession} min in`,
    });
  }

  const mostCommonTiming = (Object.keys(timingBreakdown) as DistractionTiming[]).reduce(
    (max, key) => (timingBreakdown[key] > timingBreakdown[max] ? key : max),
    'early' as DistractionTiming
  );

  const timingLabel = {
    early: 'in the first third of your session',
    mid: 'in the middle of your session',
    late: 'toward the end of your session',
  }[mostCommonTiming];

  const switchWord = distractionCount === 1 ? 'time' : 'times';
  const timesText = distractionCount === 2 ? 'twice' : `${distractionCount} ${switchWord}`;
  const shortTimingLabel = timingLabel.replace(' of your session', '');
  const headline = `You left Focusly ${timesText} this session, ${shortTimingLabel}. That cost you about ${totalMinutesLost} minute${totalMinutesLost === 1 ? '' : 's'}, or ${distractionRate}% of your total focus time.`;

  let tip: string;

  if (mostCommonTiming === 'early') {
    tip = "Your focus breaks fastest right after starting. Try a 1-2 minute warm-up (clear your desk, silence your phone) before you hit start.";
  } else if (mostCommonTiming === 'mid') {
    tip = `Your attention dips mid-session. Since this was a ${durationMinutes}-minute block, try splitting it into two shorter sessions with a break between them.`;
  } else {
    tip = "You lose focus as the session winds down — that's often fatigue, not distraction. Consider ending sessions a few minutes earlier.";
  }

  
  if (distractionCount > 1 && longestDistraction >= 60) {
    const longestMin = Math.round(longestDistraction / 60);
    tip += ` Your longest switch away lasted about ${longestMin} minute${longestMin === 1 ? '' : 's'} — that's usually a sign of getting pulled into something rather than a quick glance.`;
  } else if (distractionCount > 1 && longestDistraction > 0 && longestDistraction < 15) {
    tip += " Your switches were short — more like reflex checks than getting pulled in. Do Not Disturb might cut those out entirely.";
  }

  return {
    totalMinutesLost,
    totalSecondsLost,
    distractionCount,
    distractionRate,
    mostCommonTiming,
    timingBreakdown,
    longestDistraction: longestDistraction || null,
    headline,
    tip,
    details,
  };
}