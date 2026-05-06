# 🚀 Enterprise Notes Application

A premium, local-first notes application designed for enterprise efficiency. Built with React, TypeScript, and Electron, it combines a powerful block-based editor with visual knowledge mapping.

![App Header](https://via.placeholder.com/1200x400/0f1115/3b82f6?text=Enterprise+Notes+Application)

## ✨ Features

- **Robust Block Editor**: Move beyond plain text with specialized blocks:
  - 🗓️ **Meeting Blocks**: Structured agendas and attendee tracking.
  - 📊 **Progress Trackers**: Multi-task tracking with aggregate completion bars.
  - 📅 **Interactive Calendars**: Date-specific agendas and project planning.
  - 📋 **Dynamic Kanban Boards**: Fully mutable workflows with custom columns.
- **Visual Link Tree**: Explore the connections between your notes with an interactive graph view.
- **Glassmorphism UI**: A premium, dark-mode design system tailored for modern macOS.
- **Local First**: Your data stays on your machine, ensuring maximum privacy and speed.

---

## 📥 Download & Install (macOS)

To get started with the desktop application, follow these simple steps:

1. **Go to Releases**: Navigate to the [Releases](https://github.com/your-username/your-repo/releases) section of this repository.
2. **Download the Installer**: Look for the latest version and download the `Enterprise-Notes-x.x.x.dmg` file.
3. **Install**:
   - Open the downloaded `.dmg` file.
   - Drag the **Enterprise Notes** icon into your **Applications** folder.
4. **Launch**: Open **Enterprise Notes** from your Applications or via Spotlight (`Cmd + Space`).

> [!NOTE]
> Since the app is not currently signed with an Apple Developer certificate, you may need to right-click the app and select "Open" the first time, or allow it in *System Settings > Privacy & Security*.

---

## 🛠️ Developer Setup

If you want to contribute or build from source:

### Prerequisites
- Node.js (v18 or higher)
- npm

### Installation
```bash
# Clone the repository
git clone https://github.com/your-username/your-repo.git

# Navigate to the project directory
cd your-repo

# Install dependencies
npm install
```

### Running in Development
```bash
# Run the desktop application in dev mode
npm run electron:dev
```

### Building for Production
```bash
# Package the application into a .dmg installer
npm run electron:build
```
The installer will be generated in the `dist-desktop` directory.

---

## 🛡️ Security & Privacy
This application runs entirely locally. It does not send your notes to any external servers, making it ideal for sensitive enterprise documentation and internal research.

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
