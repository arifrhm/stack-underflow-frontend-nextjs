# Stack Underflow

A lightweight, frontend-only Q&A web application inspired by Stack Overflow. Built with Next.js 15, TypeScript, and shadcn/ui.

## Features

- **Mock Authentication**: Simple login flow (any username/password works)
- **Question Management**: Browse, create, and edit questions
- **Status Tracking**: Questions can be Open, Answered, or Closed
- **Comments**: Add and edit comments on questions
- **Responsive UI**: Clean interface using shadcn/ui components
- **In-Memory Storage**: All data persists during the session (resets on refresh)

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **State Management**: React Context API

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd stack-underflow-frontend-nextjs
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Logging In
- Enter any username and password to log in
- The session persists until you refresh the page

### Creating Questions
1. Click "Ask Question" on the home page
2. Enter a title and description
3. Click "Post Question"

### Managing Questions
- Click on any question to view details
- Question authors can edit their own questions and change status
- Add comments to any question
- Edit your own comments

## Project Structure

```
app/
├── layout.tsx          # Root layout with providers
├── page.tsx            # Home page (login or question list)
├── questions/
│   ├── [id]/
│   │   ├── page.tsx    # Question detail page
│   │   └── edit/
│   │       └── page.tsx # Edit question page
│   └── new/
│       └── page.tsx    # Create question page

components/
├── features/           # Feature-specific components
│   ├── Header.tsx
│   ├── LoginForm.tsx
│   ├── QuestionDetail.tsx
│   ├── QuestionForm.tsx
│   └── QuestionList.tsx
└── ui/                 # shadcn/ui components

contexts/
├── AuthContext.tsx     # Authentication state management
└── DataContext.tsx     # In-memory data storage

types/
└── index.ts            # TypeScript type definitions
```

## Implementation Approach

### State Management
I chose React Context API for state management because:
- The application is simple enough that Context is sufficient
- No need for external libraries like Redux
- Easy to understand and maintain

### Data Storage
All data is stored in-memory using React Context:
- Questions are initialized with sample data on app load
- All CRUD operations update the Context state
- Data resets on page refresh (as per requirements)

### Component Structure
- **Feature components**: Login, QuestionList, QuestionDetail, QuestionForm
- **UI components**: Reusable components from shadcn/ui
- **Context providers**: AuthContext and DataProvider wrap the app

### Routing
Next.js App Router with file-based routing:
- `/` - Home (login or question list)
- `/questions/new` - Create question
- `/questions/[id]` - Question detail
- `/questions/[id]/edit` - Edit question

## Assumptions & Limitations

1. **No Backend**: All data is stored in-memory and resets on refresh
2. **Mock Auth**: Any username/password combination works
3. **Session Persistence**: Logged-in state only lasts until page refresh
4. **No Real-time Updates**: UI updates happen through React re-renders
5. **No Search/Filter**: Questions are displayed as a simple list
6. **No Voting**: Questions and comments cannot be upvoted/downvoted
7. **Single Author**: Questions can only be edited by their original author

## Future Enhancements

If extending this project, I would consider:
- Local storage for data persistence
- Real backend integration (API + database)
- Search and filter functionality
- Tag-based categorization
- User profiles
- Voting system

## License

This project is for demonstration purposes only.
