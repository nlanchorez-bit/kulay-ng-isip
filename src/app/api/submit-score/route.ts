import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
// We use the SERVICE_ROLE_KEY here so the server can bypass Row Level Security (RLS) to insert data.
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''; 

const supabase = createClient(supabaseUrl, supabaseKey);

// Define TypeScript interfaces based on the Unity payload
interface ArenaRunData {
    timeElapsed: number;
    rank: string;
    score: number;
    maxStreak: number;
}

interface WebPayload {
    playerId: string;
    topRuns: ArenaRunData[];
}

// ==========================================
// GET: Used by your Next.js Frontend UI
// ==========================================
export async function GET() {
    try {
        // Fetch top 100 runs from Supabase, ordered by highest score
        const { data, error } = await supabase
            .from('leaderboard_runs')
            .select('id, player_id, score, created_at')
            .order('score', { ascending: false })
            .limit(100);

        if (error) {
            console.error('Supabase Fetch Error:', error);
            return NextResponse.json(
                { error: 'Failed to fetch leaderboard data.' },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { success: true, data: data },
            { 
                status: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Cache-Control': 'no-store, max-age=0' // Prevent caching to ensure fresh scores
                }
            }
        );

    } catch (err) {
        console.error('Server Error:', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// ==========================================
// POST: Used by your Unity Game to send data
// ==========================================
export async function POST(request: Request) {
    try {
        const body: WebPayload = await request.json();
        const { playerId, topRuns } = body;

        // Basic validation
        if (!playerId || !topRuns || !Array.isArray(topRuns)) {
            return NextResponse.json(
                { error: 'Invalid payload structure. Expected playerId and topRuns array.' },
                { status: 400 }
            );
        }

        if (topRuns.length === 0) {
            return NextResponse.json({ success: true, message: 'No runs to process.' }, { status: 200 });
        }

        // Transform Unity's camelCase to match Supabase's snake_case
        const runsToInsert = topRuns.map((run) => ({
            player_id: playerId,
            score: run.score,
            time_elapsed: run.timeElapsed,
            rank: run.rank,
            max_streak: run.maxStreak,
        }));

        // Insert into Supabase
        const { error } = await supabase.from('leaderboard_runs').insert(runsToInsert);

        if (error) {
            console.error('Supabase Insertion Error:', error);
            return NextResponse.json({ error: 'Failed to insert data.' }, { status: 500 });
        }

        return NextResponse.json(
            { success: true, message: `Successfully saved ${runsToInsert.length} runs.` },
            { status: 200, headers: { 'Access-Control-Allow-Origin': '*' } }
        );

    } catch (err) {
        console.error('Server Error:', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// ==========================================
// OPTIONS: Required for Unity WebGL CORS
// ==========================================
export async function OPTIONS(request: Request) {
    return NextResponse.json({}, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
    });
}