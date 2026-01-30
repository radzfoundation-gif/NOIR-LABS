import { useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

type RealtimeEvent = 'INSERT' | 'UPDATE' | 'DELETE' | '*';

interface UseRealtimeSubscriptionProps<T extends { [key: string]: any }> {
    table: string;
    event?: RealtimeEvent;
    schema?: string;
    filter?: string;
    onData: (payload: RealtimePostgresChangesPayload<T>) => void;
    enabled?: boolean;
}

export function useRealtimeSubscription<T extends { [key: string]: any }>({
    table,
    event = '*',
    schema = 'public',
    filter,
    onData,
    enabled = true
}: UseRealtimeSubscriptionProps<T>) {
    useEffect(() => {
        if (!enabled) return;

        const channelName = `realtime:${schema}:${table}:${event}${filter ? `:${filter}` : ''}`;

        const channel = supabase
            .channel(channelName)
            .on(
                'postgres_changes',
                {
                    event,
                    schema,
                    table,
                    filter
                },
                (payload) => {
                    onData(payload as RealtimePostgresChangesPayload<T>);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [table, event, schema, filter, enabled, onData]);
}
