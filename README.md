# llm dashboards

Basic approach to power your application with gemini pro api's.

- Uses gemini pro api and elasticsearch to index data.
- Dynamically generate elastic queries and display the total hits.
- Based on the query you can choose to power your dashboards.

## Future Scope

- Dynamic UI generation based for charts.

## Running locally

In this path: `app/dashboard/layout.tsx`, update the server url's

```
export const server = dev
  ? "http://localhost:3002"
  : "https://geekysam7-dashboards.vercel.app";
```

If you want you can also setup env variables and read from there.

Also you need three api keys:

- `ELASTIC_API_KEY` => Your elastic instance api key
- `ELASTIC_CONNECT_URL` => Connection url (make sure appropriate permissions are given)
- `GEMINI_PRO_KEY` => Get it from gemini pro site.

I'm indexing data at `search-category` index, if you have indexed at different place, update it's consumption.