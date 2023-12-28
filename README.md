# Real-Time Chat Application

Welcome to the Real-Time Chat Application! 🚀
![chat-photo-05](https://github.com/joaoSouza-js/chat-using-websockets/assets/84108989/b436680c-1121-4984-ab9b-dade6c17fc32)

## Project Overview

This project is an immersive journey into the creation of a real-time chat application, seamlessly connecting users for instant communication. The application is split into two major sides: the **Front-End** and the **Back-End**. Let's explore the key features and technologies driving this exciting endeavor.

## Front-End Development Highlights

### Technologies Used
- React, Tailwind.
- Libraries: @hookform/resolvers , @socket.io-client,  ui.shadcn and more.

### Achievements
- **Advanced State Management:** Implemented React Hooks strategically for efficient state handling.
- **WebSocket Integration:** Connected the front-end to the back-end using WebSocket for real-time communication.
- **Responsive UI:** Prioritized a responsive interface for a consistent and user-friendly experience.

## Back-End Development Insight

### Technologies Employed
- Express, Socket.IO, Prisma, Zod
- CORS for cross-origin communication.
- Robust API documentation using Swagger.

### Key Aspects
- **WebSocket and Socket.IO:** Established a robust WebSocket connection for efficient real-time communication.
- **Dynamic User Management:** Developed a system to dynamically track online users, ensuring everyone stays in sync.
- **Real-Time Message Sharing:** Utilized events for an instant chat experience, keeping users notified of new messages.
- **Swagger-Documented API:** Ensured clear API documentation for easy understanding and integration.

## Project Purpose

The Real-Time Chat Application aims to provide a seamless, dynamic, and engaging platform for users to connect instantly. Whether it's real-time conversations or dynamic user interactions, this project stands at the forefront of modern communication solutions.

Feel free to explore the code, ask questions, and join the discussion. Your insights and feedback are invaluable as we continue to evolve this project together! 🌟✨

## How to run the project
Certainly! Below are the installation and running steps for both the front-end and back-end projects using npm, yarn, and pnpm.

### Front-End Installation and Run:

#### Using npm:

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Run the Project:**
   ```bash
   npm run dev
   ```

#### Using yarn:

1. **Install Dependencies:**
   ```bash
   yarn
   ```

2. **Run the Project:**
   ```bash
   yarn run dev
   ```

#### Using pnpm:

1. **Install Dependencies:**
   ```bash
   pnpm install
   ```
2. **Set BaseUrl in .env File:**
   - Create a `.env` file in the root of your project.
   - Add the following line to set your BaseUrl (you can change the value to your desired BaseUrl):
     ```
     BASE_URL="http://localhost:3333"

     ```

3. **Run the Project:**
   ```bash
   pnpm run dev
   ```

Certainly! Below are the steps to set up and run the back-end project using npm, yarn, and pnpm:

### Back-End Installation and Run:

#### Using npm:

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Run Prisma Migrations:**
   ```bash
   npx prisma migrate dev
   ```

3. **Set Port in .env File:**
   - Create a `.env` file in the root of your project.
   - Add the following line to set the port (you can change the value to your desired port):
     ```
     PORT=3000
     ```

4. **Run the Application:**
   ```bash
   npm run dev
   ```

#### Using yarn:

1. **Install Dependencies:**
   ```bash
   yarn
   ```

2. **Run Prisma Migrations:**
   ```bash
   yarn prisma migrate dev
   ```

3. **Set Port in .env File:**
   - Create a `.env` file in the root of your project.
   - Add the following line to set the port (you can change the value to your desired port):
     ```
     PORT=3000
     ```

4. **Run the Application:**
   ```bash
   yarn dev
   ```

#### Using pnpm:

1. **Install Dependencies:**
   ```bash
   pnpm install
   ```

2. **Run Prisma Migrations:**
   ```bash
   pnpm dlx prisma migrate dev
   ```

3. **Set Port in .env File:**
   - Create a `.env` file in the root of your project.
   - Add the following line to set the port (you can change the value to your desired port):
     ```
     PORT=3000
     ```

4. **Run the Application:**
   ```bash
   pnpm dev
   ```

These steps cover the setup and running of the back-end project using three different package managers: npm, yarn, and pnpm. Feel free to choose the one that aligns with your preferences. If you have any questions or need further assistance, let me know! 🚀

These steps cover the installation of dependencies, running the projects, and applying Prisma migrations for the back-end. Users can choose their preferred package manager (npm, yarn, or pnpm) based on their workflow preferences. If you encounter any issues or have questions, feel free to ask for further assistance! 🚀

#Observations
the api documentation is avaliable in http://localhost:Port
![chat-photo-02](https://github.com/joaoSouza-js/chat-using-websockets/assets/84108989/038c157f-1d9a-4ada-82de-9c63c4dc74e3)
