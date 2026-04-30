export async function handler() {
  const res = await fetch(`${process.env.SUPABASE_URL}/rest/v1/events`, {
    headers: {
      apikey: process.env.SUPABASE_KEY,
      Authorization: `Bearer ${process.env.SUPABASE_KEY}`
    }
  });

  const data = await res.json();

  return {
    statusCode: 200,
    body: JSON.stringify(data)
  };
}