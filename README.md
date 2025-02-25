# Quick commerse

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.


## Setup Instructions

### 1. Clone the Repository
```sh
git clone https://github.com/SahlaThasnim89/machine-task-quick-Commerse.git
cd machine-task-quick-Commerse
```

### 2. Install Dependencies
```sh
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory and add necessary environment variables:
```env

NEXTAUTH_URL=http://localhost:3000
MONGO_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_secret_key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_googleMapApi_key
# Public Environment Variables
NEXT_PUBLIC_CURRENCY=$
```

### 4. Start the Server
```sh
npm start
```
The server will run at `http://localhost:3000`

## Test Credentials

### Customer Account
- **Email:** customer@gmail.com
- **Password:** customer123

### Delivery Partner Account
- **Email:** delivery@gmail.com
- **Password:** delivery123

Use these credentials to test customer and delivery partner functionalities.

## Additional Commands

### Run in Development Mode
```sh
npm run dev
```

### Run Tests
```sh
npm test
```

### Build for Production
```sh
npm run build
```


## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!