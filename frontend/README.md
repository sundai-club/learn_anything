
# LearnEasy.AI

**LearnEasy.AI** is an interactive learning platform that generates visual knowledge maps from Wikipedia URLs. Users can explore topics and subtopics in an engaging, interactive graph format.

## Features

### Key Features:

-   **Dynamic Knowledge Graphs**: Generate and interact with knowledge maps of domains and topics.
-   **Wikipedia Integration**: Input a Wikipedia URL to create custom visualizations.
-   **Dark Mode Support**: Seamless light/dark theme transitions.
-   **User Authentication**: Powered by Clerk for user sign-in and sign-up.
-   **Real-time Progress Tracking**: Save and display user progress on explored topics.

### Frontend Components:

-   **KnowledgeGraph**: Renders the interactive graph using ECharts.
-   **WikiUrlForm**: Accepts Wikipedia URLs for processing.
-   **NodeModal**: Displays additional information for nodes in the graph.
-   **Navbar**: Responsive navigation bar with authentication integration.

## Technology Stack

### Frameworks and Libraries:

-   **Frontend**: [Next.js](https://nextjs.org/), [Tailwind CSS](https://tailwindcss.com/)
-   **Graph Library**: [ECharts](https://echarts.apache.org/)
-   **Animation**: Framer Motion
-   **State Management**: React Context
-   **Authentication**: [Clerk](https://clerk.dev/)

### Backend:

-   **API**: Hosted on Google Cloud Run
-   **Knowledge Graph Processing**: Custom API with Wikipedia scraping capabilities

### Utilities:

-   **TypeScript**: For type safety.
-   **Axios**: For API calls.

## Installation

### Prerequisites:

-   Node.js >= 16.x
-   npm or yarn package manager

### Steps:

1.  **Clone the Repository**:
    
    bash
    
    Copy code
    
    `git clone https://github.com/sundai-club/learn_anything.git
    cd learn_anything/frontend` 
    
2.  **Install Dependencies**:
    

    ```sh
    npm install
	```
     
    
3.  **Run the Development Server**:
    

    ```sh 
    npm run dev
    ``` 
        
4.  **Set up Environment Variables**: Add a `.env.local` file with the following:
    

    ```sh
    NEXT_PUBLIC_CLERK_FRONTEND_API=your-clerk-frontend-api
    NEXT_PUBLIC_API_BASE_URL=https://learn-anything-199983032721.us-central1.run.app
    ``` 
    

## Project Structure


```/frontend
├── public/               # Public assets (favicon, logos, etc.)
├── src/
│   ├── app/              # Next.js application structure
│   │   ├── api/          # API routes
│   │   ├── components/   # UI components
│   │   ├── contexts/     # Context providers (e.g., ThemeContext)
│   │   ├── types/        # TypeScript type definitions
│   │   └── services/     # API services
│   └── styles/           # Global and component-specific styles
├── tailwind.config.ts    # Tailwind CSS configuration
└── tsconfig.json         # TypeScript configuration` 
```
## API Endpoints

### `/get-graph`

-   **Method**: POST
-   **Description**: Processes a Wikipedia URL to generate the knowledge graph.
-   **Request Body**:
    
  
   
    ```
    {
      "url": "https://en.wikipedia.org/wiki/Computer_science"
    }
    ``` 
    
-   **Response**:
    
    ```
    {
      "domains": [
        {
          "id": "https://en.wikipedia.org/wiki/Computer_science",
          "name": "Computer Science",
          "topics": [ ... ]
        }
      ]
    }
    ``` 
    

## Tailwind Customizations

Key extensions in `tailwind.config.ts`:

-   Custom color schemes for light and dark mode.
-   Gradient backgrounds and smooth transition animations.
-   Scrollbar styles for enhanced user experience.

## Contributing

1.  **Fork** the repository.
2.  Create a new **branch**:
    
    ```sh
    git checkout -b feature-name
    ``` 
    
3.  **Commit** your changes:
        
    ```sh
    git commit -m "Add new feature"
    ``` 
    
4.  **Push** to the branch:
    
    
    ```sh
    git push origin feature-name
    ``` 
    
5.  Create a **Pull Request**.

## License

MIT License.
