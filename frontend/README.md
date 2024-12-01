# Mihir-Research.AI

An interactive visualization platform for exploring artificial intelligence research areas and concepts.

## Project Overview

This project provides an intuitive, visual way to explore AI research topics through an interactive tree diagram. It features:

- Dynamic node exploration
- Detailed descriptions of AI concepts
- Interactive visualizations
- Dark/Light mode support
- Responsive design

### Key Features

#### 1. Interactive Tree Visualization

- Expandable/collapsible nodes
- Detailed tooltips
- Smooth animations
- Hierarchical data representation

#### 2. Research Areas Covered

- Machine Learning
  - Deep Learning
  - Reinforcement Learning
- AI Ethics
- Robotics
- Natural Language Processing

#### 3. Technical Implementation

```typescript
interface TreeNode {
  name: string
  value: string
  desc: string
  children?: TreeNode[]
}
```

## Technology Stack

- **Frontend**: Next.js, React
- **Visualization**: ECharts
- **Styling**: TailwindCSS
- **Animations**: Framer Motion
- **TypeScript** for type safety

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/yourusername/mihir-research-ai.git
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Development

### Project Structure

```
src/
  ├── app/                 # Next.js app directory
  │   ├── page.tsx        # Main visualization page
  │   └── contexts/       # Theme and other contexts
  ├── components/         # Reusable components
  └── types/             # TypeScript type definitions
```

### Key Components

- Interactive Tree Visualization
- Theme Toggle
- Responsive Navigation
- Motion Animations

## Contributing

We welcome contributions! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- ECharts for the visualization library
- Next.js team for the framework
- TailwindCSS for the styling system
