# MarSHARE Land

A secure, auto-expiring file and text sharing platform built with the MERN stack. I originally built this because I needed a quick way to share code snippets, PDFs, and images across devices without leaving them stored on a server forever.

## Features

- **Multi-format Uploads:** Supports text/code, images, PDFs, audio, and video files (up to 25MB).
- **Auto-Destruct:** Links automatically expire and delete themselves from the database after a set time (10m, 30m, 1h, or 3h).
- **Password Protection:** Optional password locks for sensitive pastes, hashed via `bcrypt` before hitting the database.
- **Cloudinary Integration:** Media files are temporarily handled by Multer and pushed to Cloudinary, ensuring the MongoDB database remains lightweight and fast.
- **User Dashboard:** JWT-authenticated users can track, manage, and manually delete their active links.

## Tech Stack

**Frontend:** React.js (Vite), Tailwind CSS, React Router  
**Backend:** Node.js, Express.js, MongoDB (Mongoose)  
**Utilities/Storage:** Cloudinary, Multer, JSON Web Tokens (JWT), bcrypt  

## Architecture Notes

The backend of this project is structured using modern ES Modules (`import`/`export`) and follows an enterprise-level controller pattern:
- **Centralized Error Handling:** Uses a custom `asyncHandler` wrapper to eliminate repetitive `try-catch` blocks across controllers.
- **Standardized Responses:** All API responses and errors flow through custom `ApiResponse` and `ApiError` classes, ensuring the frontend receives a 100% predictable JSON contract.

## Run Locally

1. Clone the repository:
   ```bash
   git clone [https://github.com/yourusername/marshare-land.git](https://github.com/yourusername/marshare-land.git)
   cd marshare-land
   ```

2. Install dependencies for both frontend and backend (using the root script):
   ```bash
   npm run install-all
   ```

3. Set up environment variables. Create a `.env` file in the `backend/` directory:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   CORS_ORIGIN=*

   # Cloudinary Setup
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret

   # JWT Setup
   JWT_SECRET=your_super_secret_key
   ACCESS_TOKEN_SECRET=your_access_token_secret
   ACCESS_TOKEN_EXPIRY=1d
   REFRESH_TOKEN_SECRET=your_refresh_token_secret
   REFRESH_TOKEN_EXPIRY=10d
   ```

4. Start the development servers (runs both React and Node concurrently):
   ```bash
   npm run dev
   ```

## Author

**Gaurav Jain**
