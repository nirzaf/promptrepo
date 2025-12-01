# Contributing to PromptVault

Thank you for your interest in contributing to PromptVault! This document provides guidelines and instructions for contributing to the project.

## 🎯 Project Vision

PromptVault aims to be the premier platform for discovering, sharing, and collaborating on AI prompts. We're building an interactive workbench that transforms prompts from static text into living, testable, and remixable resources.

## 🚀 Getting Started

### Prerequisites

- **Node.js** 20.x or higher
- **MySQL** 8.0 or higher
- **Yarn** 1.22.x (package manager)
- **Git** for version control

### Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/promptrepo.git
   cd promptrepo
   ```

2. **Install dependencies**
   ```bash
   yarn install
   ```

3. **Set up environment variables**
   
   Copy `.env.example` to `.env.local` and configure:
   ```bash
   cp .env.example .env.local
   ```

   Required variables:
   - `DATABASE_URL` - MySQL connection string
   - `NEXTAUTH_SECRET` - Random string for auth encryption
   - `NEXTAUTH_URL` - Your app URL (http://localhost:3000 for dev)

4. **Set up the database**
   ```bash
   # Push schema to database
   yarn db:push

   # Import sample prompts (optional but recommended)
   yarn db:import-sample
   ```

5. **Start the development server**
   ```bash
   yarn dev
   ```

   The app will be available at `http://localhost:3000`

## 📝 Code Style Guidelines

We use **Biome** for linting and formatting. The configuration is already set up in the project.

### Running Linter

```bash
# Check for issues
yarn lint

# Auto-fix issues
yarn lint:fix
```

### Code Conventions

- **TypeScript**: Use TypeScript for all new files
- **Components**: Use functional components with hooks
- **Naming**:
  - Components: PascalCase (`PromptCard.tsx`)
  - Files: kebab-case for utilities (`api-client.ts`)
  - Variables/Functions: camelCase
- **Imports**: Group imports (React, Next.js, external packages, internal modules)
- **CSS**: Use Tailwind utility classes; add custom CSS variables to `globals.css` when needed

## 🌳 Branch Naming

- `feature/` - New features (e.g., `feature/prompt-playground`)
- `fix/` - Bug fixes (e.g., `fix/search-performance`)
- `docs/` - Documentation updates (e.g., `docs/api-reference`)
- `refactor/` - Code refactoring (e.g., `refactor/query-optimization`)

## 💬 Commit Messages

Follow conventional commits format:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(playground): add variable substitution preview
fix(search): resolve case-sensitive filtering issue
docs(contributing): add database setup instructions
```

## 🔄 Pull Request Process

1. **Create a feature branch** from `main`
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following the code style guidelines

3. **Test your changes**
   - Ensure the app builds: `yarn build`
   - Test locally: `yarn dev`
   - Run linter: `yarn lint`

4. **Commit your changes** with descriptive commit messages

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Open a Pull Request**
   - Provide a clear title and description
   - Reference any related issues (e.g., "Closes #123")
   - Include screenshots for UI changes
   - Ensure all checks pass

7. **Code Review**
   - Address review feedback promptly
   - Keep discussions focused and respectful
   - Update your PR based on feedback

## 🧪 Testing

While we're building out our test suite, please manually test:

- **UI Changes**: Test in both light and dark modes
- **Responsive Design**: Test on mobile, tablet, and desktop
- **Database Operations**: Verify data integrity
- **Performance**: Check for performance regressions

## 📚 Database Commands

```bash
# Generate migration files
yarn db:generate

# Push schema changes to database
yarn db:push

# Open Drizzle Studio (database GUI)
yarn db:studio

# Import sample prompts
yarn db:import-sample
```

## 🐛 Reporting Bugs

Use the [Bug Report template](.github/ISSUE_TEMPLATE/bug_report.md) when creating issues.

Include:
- Clear description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Environment details (browser, OS, Node version)
- Screenshots if applicable

## 💡 Suggesting Features

Use the [Feature Request template](.github/ISSUE_TEMPLATE/feature_request.md).

Include:
- Problem statement
- Proposed solution
- Use cases
- Alternative approaches considered

## 🏷️ Adding New Categories

Use the [Category Request template](.github/ISSUE_TEMPLATE/category_request.md).

Include:
- Category name and description
- Icon suggestion (from lucide-react)
- Color preference (hex code)
- Example prompts that would fit

## 📖 Documentation

- Update relevant documentation when adding features
- Add JSDoc comments for complex functions
- Update README.md if changing setup process

## 🤝 Community Guidelines

- Be respectful and inclusive
- Provide constructive feedback
- Help others in discussions
- Follow the [Code of Conduct](CODE_OF_CONDUCT.md)

## 📄 License

By contributing, you agree that your contributions will be licensed under the same license as the project.

## 🙏 Thank You!

Your contributions make PromptVault better for everyone. We appreciate your time and effort!

---

**Questions?** Open a discussion or reach out to the maintainers.
