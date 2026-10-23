//src\app\api\submit-score\route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// 1. Force Next.js to treat this as a dynamic, runtime-only route
export const dynamic = 'force-dynamic';

// 2. Wrap initialization in a function so it DOES NOT execute at build time
const getSupabaseClient = () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    // Fallback to anon key if service key is missing during local tests
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''; 
    return createClient(supabaseUrl, supabaseKey);
};

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
        const supabase = getSupabaseClient();
        
        // Fetch top 100 runs from Supabase, ordered by highest score
        const { data, error } = await supabase
            .from('leaderboard_runs')
            .select('id, player_id, score, time_elapsed, rank, max_streak, created_at')
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
                    'Cache-Control': 'no-store, max-age=0' 
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

        const supabase = getSupabaseClient();

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