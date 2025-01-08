# Talk To Me

This project is a crossover between [friend.com](https://friend.com) and [character.ai](https://character.ai). It generates a random AI friend and allows you to talk to them with voice. It uses OpenAI's GPT-4o-mini model for generating responses, DALL-E-3 for generating a profile picture of the friend, and Deepgram for text-to-speech.

## Tech Stack

- [Next.js 15](https://nextjs.org/) w/ App Router
- [NextAuth](https://authjs.dev/) for authentication
- [Drizzle](https://orm.drizzle.team/) as the ORM
- [Neon](https://neon.tech/) for the postgres database
- [Tailwind CSS](https://tailwindcss.com/) and [Shadcn/ui](https://ui.shadcn.com/) for styling and UI components
- [Uploadthing](https://uploadthing.com/) for image storage
- [OpenAI API](https://platform.openai.com/docs/overview) for AI responses and image generation
- [Deepgram](https://www.deepgram.com/) for text-to-speech
- [Upstash](https://upstash.com/) for rate limiting
- [Vercel](https://vercel.com/) for deployment

## How to run locally

1. Clone the repo

2. Copy the `.env.example` file to `.env` and fill in with valid environment variables

3. Run `bun install` to install the dependencies

4. Run `bun dev` to start the development server

5. Run `bun db:push` to push the schema to the database

6. Navigate to `http://localhost:3000` to view the app

## Todos

- [ ] Add a transcript of the conversation
- [ ] Use Deepgram's speech to text API instead of browser speech recognition
- [ ] Make it more like a phone call using Deepgram's streaming features
