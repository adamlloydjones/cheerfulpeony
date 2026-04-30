export async function handler(event) {
  const { title, date } = JSON.parse(event.body);

  await fetch(`${process.env.SUPABASE_URL}/rest/v1/events`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: process.env.SUPABASE_KEY,
      Authorization: `Bearer ${process.env.SUPABASE_KEY}`
    },
    body: JSON.stringify({ title, date })
  });

  return {
    statusCode: 200,
    body: JSON.stringify({ success: true })
  };
}