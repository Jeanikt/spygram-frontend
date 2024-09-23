# Spygram Frontend

Spygram is a web application that allows users to monitor Instagram followers and activity in real-time.

## Features

- Search for Instagram users
- Display follower lists
- Real-time monitoring of follower changes
- Responsive design with dark theme

## Technologies Used

- Next.js
- React
- TypeScript
- Tailwind CSS
- React Query
- Axios
- WebSocket for real-time updates

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository: 

git clone [https://github.com/Jeanikt/spygram-frontend.git](https://github.com/Jeanikt/spygram-frontend.git)

cd spygram-frontend


2. Install dependencies:

npm install


3. Create a `.env.local` file in the root directory and add the following:

NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=ws://localhost:3001


### Running the Development Server

npm run dev


The application will be available at `http://localhost:3000`.

## Project Structure

- `src/app`: Contains the main application pages and layout
- `src/components`: Reusable React components
- `src/hooks`: Custom React hooks
- `src/lib`: Utility functions and API client
- `src/types`: TypeScript type definitions

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.