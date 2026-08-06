insert into badges
(title, description, category, rule_type, rule_value, icon)
values

-- =========================
-- SESSION COUNT BADGES
-- =========================

(
 'First Focus',
 'Complete your first focus session',
 'sessions',
 'sessions_count',
 1,
 'target'
),

(
 'Getting Started',
 'Complete 5 focus sessions',
 'sessions',
 'sessions_count',
 5,
 'rocket'
),

(
 'Focus Apprentice',
 'Complete 10 focus sessions',
 'sessions',
 'sessions_count',
 10,
 'book'
),

(
 'Focus Warrior',
 'Complete 50 focus sessions',
 'sessions',
 'sessions_count',
 50,
 'flame'
),

(
 'Focus Master',
 'Complete 100 focus sessions',
 'sessions',
 'sessions_count',
 100,
 'trophy'
),

(
 'Focus Legend',
 'Complete 500 focus sessions',
 'sessions',
 'sessions_count',
 500,
 'star'
),


-- =========================
-- TOTAL TIME BADGES
-- =========================

(
 'First Hour',
 'Accumulate 60 minutes of focused work',
 'time',
 'total_minutes',
 60,
 'clock'
),

(
 'Five Hour Focus',
 'Accumulate 5 hours of focused work',
 'time',
 'total_minutes',
 300,
 'hourglass'
),

(
 'Ten Hour Mind',
 'Accumulate 10 hours of focused work',
 'time',
 'total_minutes',
 600,
 'brain'
),

(
 'Fifty Hour Master',
 'Accumulate 50 hours of focused work',
 'time',
 'total_minutes',
 3000,
 'medal'
),

(
 'Century Focus',
 'Accumulate 100 hours of focused work',
 'time',
 'total_minutes',
 6000,
 'award'
),


-- =========================
-- DEEP WORK BADGES
-- =========================

(
 'Deep Starter',
 'Complete a focus session of 25 minutes or more',
 'duration',
 'longest_session',
 25,
 'leaf'
),

(
 'Deep Worker',
 'Complete a focus session of 45 minutes or more',
 'duration',
 'longest_session',
 45,
 'flame'
),

(
 'Deep Diver',
 'Complete a focus session of 60 minutes or more',
 'duration',
 'longest_session',
 60,
 'waves'
),

(
 'Marathon Focus',
 'Complete a focus session of 90 minutes or more',
 'duration',
 'longest_session',
 90,
 'fitness'
),

(
 'Ultra Focus',
 'Complete a focus session of 120 minutes or more',
 'duration',
 'longest_session',
 120,
 'rocket'
),

(
 'Extreme Focus',
 'Complete a focus session of 180 minutes or more',
 'duration',
 'longest_session',
 180,
 'diamond'
),


-- =========================
-- CONSISTENCY BADGES
-- =========================

(
 'Consistency Builder',
 'Complete sessions on 7 different days',
 'consistency',
 'active_days',
 7,
 'calendar'
),

(
 'Weekly Warrior',
 'Complete sessions on 30 different days',
 'consistency',
 'active_days',
 30,
 'calendar'
),

(
 'Focus Habit',
 'Complete sessions on 100 different days',
 'consistency',
 'active_days',
 100,
 'repeat'
);

