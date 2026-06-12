Silent Classroom Confusion Detector

A React-based web application designed to help teachers gauge student understanding in real time. Instead of asking "any questions?" and getting silence, students can anonymously signal their confusion level, giving teachers instant, visual feedback on how the class is following along.

Features


Anonymous confusion/understanding signaling for students
Real-time visual dashboard for teachers using interactive charts
Clean, minimal, and responsive interface
Built with modern React tooling for fast performance


Tech Stack


React 18 – UI library
Vite – build tool and dev server
Recharts – data visualization
Lucide React – icons


Getting Started

Prerequisites


Node.js (v16 or higher recommended)
npm


Installation

bashgit clone https://github.com/smalikazainab/Silent-Classroom-App.git
cd Silent-Classroom-App
npm install

Running Locally

bashnpm run dev

The app will be available at http://localhost:5173 (or the port shown in your terminal).

Building for Production

bashnpm run build

Deployment

This project is deployed on Vercel and connected to this GitHub repository for automatic deployments on every push to main.

Project Structure

├── src/
│   ├── App.jsx       # Main application component
│   └── main.jsx      # Application entry point
├── index.html        # HTML entry point
├── package.json      # Project dependencies and scripts
└── vite.config.js    # Vite configuration

License

This project was created for academic/educational purposes.
