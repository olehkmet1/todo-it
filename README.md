# TodoIt - React Native Todo App

A beautiful and feature-rich todo application built with React Native and TypeScript.

## Features

- ✅ **Add, edit, and delete todos**
- ✏️ **Full edit functionality** with pre-filled forms
- 🎯 **Priority levels** (Low, Medium, High)
- 📂 **Categories** (Work, Personal, Shopping, Health, Other)
- 🔍 **Filter todos** (All, Active, Completed)
- 💾 **Persistent storage** using AsyncStorage
- 📱 **Modern UI** with smooth animations
- 🎨 **Beautiful design** with shadows and modern styling
- ⚡ **TypeScript** for better development experience


The app features a clean, modern interface with:
- Header showing completion progress
- Filter tabs with counts
- Beautiful todo cards with priority badges
- Add todo modal with form validation
- Empty states with helpful messages


## Getting Started

### Prerequisites

- Node.js (>= 18)
- React Native CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd TodoIt
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install iOS dependencies** (macOS only)
   ```bash
   cd ios && pod install && cd ..
   ```

### Running the App

#### Android
```bash
npm run android
```

#### iOS
```bash
npm run ios
```

#### Start Metro bundler
```bash
npm start
```



### Adding a Todo
1. Tap the "+" button in the header
2. Fill in the todo details:
   - **Title** (required)
   - **Description** (optional)
   - **Priority** (Low, Medium, High)
   - **Category** (Work, Personal, Shopping, Health, Other)
3. Tap "Add Todo"

### Editing a Todo
1. Tap the "✏️" button on any todo item
2. Modify any of the todo details:
   - **Title** (required)
   - **Description** (optional)
   - **Priority** (Low, Medium, High)
   - **Category** (Work, Personal, Shopping, Health, Other)
   - **Status** (Active/Completed)
3. Tap "Save Changes"

### Managing Todos
- **Complete/Uncomplete**: Tap the checkbox next to a todo
- **Edit**: Tap the "✏️" button on a todo item to edit all details
- **Delete**: Tap the "×" button on a todo item
- **View Details**: Tap on a todo item to see its details
- **Filter**: Use the filter tabs to view All, Active, or Completed todos

### Features in Detail

#### Priority System
- **High Priority**: Red badge
- **Medium Priority**: Yellow badge  
- **Low Priority**: Green badge

#### Categories
- Work
- Personal
- Shopping
- Health
- Other

#### Filtering
- **All**: Shows all todos
- **Active**: Shows only incomplete todos
- **Completed**: Shows only completed todos

## Technical Details

### Dependencies
- `react-native`: Core framework
- `@react-native-async-storage/async-storage`: Local data persistence
- `react-native-safe-area-context`: Safe area handling

### Architecture
- **Service Layer**: `TodoService` handles all data operations
- **Component Layer**: Reusable UI components
- **Interface Layer**: TypeScript type definitions
- **State Management**: React hooks for local state

### Data Persistence
Todos are stored locally using AsyncStorage and persist between app sessions.

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue in the repository or contact the development team.
