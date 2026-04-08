import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import process from 'process';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Init Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

app.post('/api/waitlist', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Please enter your email address.' });
  }

  try {
    // 1. Check if email already exists in Supabase
    const { data: existing, error: fetchError } = await supabase
      .from('waitlist')
      .select('email')
      .eq('email', email)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      throw fetchError;
    }

    if (existing) {
      return res.status(409).json({ error: 'This email is already registered. Check your inbox for your invite details.' });
    }

    // 2. Insert new email
    const { error: insertError } = await supabase
      .from('waitlist')
      .insert([{ email }]);

    if (insertError) {
      throw insertError;
    }

    return res.status(200).json({ success: true, email });
  } catch (error) {
    console.error('Supabase Error:', error);

    // Handle unique constraint violation 
    if (error.code === '23505') {
      return res.status(409).json({ error: 'This email is already registered.' });
    }

    return res.status(500).json({
      error: error.message || 'Something went wrong while joining the waitlist. Please try again later.'
    });
  }
});

app.listen(PORT, () => {
  console.log(`Express server is running on http://localhost:${PORT}`);
});
