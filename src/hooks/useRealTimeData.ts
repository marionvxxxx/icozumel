@@ .. @@
 'use client';

 import { useEffect, useState, useCallback } from 'react';
-import { supabase } from '../lib/supabase';
+import { createClient } from '@supabase/supabase-js';
+
+const supabase = createClient(
+  process.env.NEXT_PUBLIC_SUPABASE_URL!,
+  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
+);

 interface UseRealTimeDataOptions<T> {
   table: string;