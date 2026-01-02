# Environment Variables for Vercel Deployment

## Server Environment Variables (Add these in Vercel Dashboard)

```
DATABASE_URL=postgresql://neondb_owner:npg_Mf3kc8PJnDVO@ep-cool-dew-a8vp8iaa-pooler.eastus2.azure.neon.tech/neondb?sslmode=require&channel_binding=require

CLERK_PUBLISHABLE_KEY=pk_test_Zmxvd2luZy1jb2QtMjIuY2xlcmsuYWNjb3VudHMuZGV2JA
CLERK_SECRET_KEY=sk_test_44G4sAT5kkfERabAU0u4f5cNnyDOQ9PJ9XYh7vuNyJ

GEMINI_API_KEY=AIzaSyB045pdfd7_Z6WvKbE3GFv4nWq45O1p2kU
OPENAI_API_KEY=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

CLIPDROP_API_KEY=178370bb72b3e88f30e892476686bb44778b1b21aacc4ecddd5d45671fc43207b8ecf8e90fd76bb8e2bd161d24c715fd

CLOUDINARY_CLOUD_NAME=ddbvqkpaa
CLOUDINARY_API_KEY=496631313825875
CLOUDINARY_API_SECRET=gfRUs8kMNq3OeoZJswOJC4O4WHI

GOOGLE_API_KEY=AIzaSyAZjDTX9cj2Tm6w9NNKQLMBpoVcz50MFrc
```

## Client Environment Variables

```
VITE_CLERK_PUBLISHABLE_KEY=pk_test_Zmxvd2luZy1jb2QtMjIuY2xlcmsuYWNjb3VudHMuZGV2JA
VITE_BASE_URL=https://your-server-deployment-url.vercel.app
```

**Important:** Replace `your-server-deployment-url` with your actual server deployment URL from Vercel.