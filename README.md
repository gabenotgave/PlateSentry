# Plate Sentry

Plate Sentry is a web-based application designed to empower citizens to report vehicles engaged in wrongdoing, such as reckless driving or hit-and-runs. The system allows users to submit photographic evidence, which is then processed by an AI-powered backend to identify and extract license plate numbers. Law enforcement officials can then review these reports through a dedicated portal.

## Features

  - **Anonymous Reporting**: Citizens can anonymously submit reports, including a photo of the vehicle, a description of the incident, and optional contact information.
  - **AI-Powered License Plate Recognition**: The application utilizes a machine learning model to automatically detect and extract license plate numbers from uploaded images.
  - **Real-Time Report Dashboard**: Law enforcement officers have access to a live dashboard that displays all submitted reports as they come in.
  - **Detailed Report View**: Officers can click on individual reports to view detailed information, including the full image, cropped license plate, and the reporter's description.
  - **Secure and Scalable**: The backend is built with a robust WebSocket server to handle concurrent connections and large data transfers, ensuring a responsive experience.

## Technologies Used

### Frontend

  - **React**: A JavaScript library for building user interfaces.
  - **Vite**: A fast build tool and development server for modern web projects.
  - **React Router**: For handling navigation and routing within the single-page application.
  - **Bootstrap & Bootswatch**: For styling and responsive design.
  - **React-Bootstrap**: For integrating Bootstrap components with React.

### Backend

  - **Python**: The primary language for the server-side logic.
  - **WebSockets**: For real-time, bidirectional communication between the client and server.
  - **OpenCV**: A computer vision library used for image processing.
  - **Ultralytics YOLO**: A state-of-the-art object detection model used for identifying license plates.
  - **PaddleOCR**: An optical character recognition tool for extracting text from the license plate images.
  - **asyncio**: For managing asynchronous operations and concurrent connections.

## Setup and Installation

### Frontend

1.  Navigate to the `Client/plate-sentry` directory.
2.  Install the necessary dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```

### Backend

1.  Navigate to the `Server` directory.
2.  Install the required Python packages from the `requirements.txt` file:
    ```bash
    pip install -r requirements.txt
    ```
3.  Start the WebSocket server:
    ```bash
    python main.py
    ```
