# AI Prompts Repository - Architectural Plan v2.0

## 1. Project Overview

**Project Name:** PromptVault
**Framework:** Next.js 15 (App Router + Turbopack)
**Database:** MySQL 8.0
**Philosophy:** Performance-first, developer-friendly, scalable

---

## 2. Enhanced Tech Stack

### 2.1 Core Stack Matrix

| Layer | Technology | Why This Choice |
|-------|------------|-----------------|
| **Framework** | Next.js 15 + Turbopack | Fastest builds, React 19, Server Components |
| **Language** | TypeScript 5.x (strict mode) | Type safety, better DX, fewer bugs |
| **Database** | MySQL 8.0 | Robust, mature, excellent full-text search |
| **ORM** | Drizzle ORM | Fastest ORM, type-safe, MySQL optimized |
| **Auth** | Auth.js v5 (NextAuth) | Industry standard, flexible, secure |
| **Styling** | Tailwind CSS v4 | Latest features, faster compilation |
| **Components** | shadcn/ui + Radix UI | Accessible, customizable, beautiful |
| **Animations** | Framer Motion | Smooth, performant animations |
| **Forms** | React Hook Form + Zod | Best performance, type-safe validation |
| **Server State** | TanStack Query v5 | Caching, background updates, optimistic UI |
| **Client State** | Zustand | Lightweight, simple, powerful |
| **Search** | Meilisearch | Lightning fast, typo-tolerant, faceted |
| **Caching** | Upstash Redis | Serverless Redis, rate limiting |
| **Email** | Resend + React Email | Modern email with React components |
| **File Upload** | Uploadthing | Type-safe uploads, easy integration |
| **Analytics** | Vercel Analytics + Posthog | Performance + product analytics |
| **Monitoring** | Sentry | Error tracking, performance monitoring |
| **Hosting** | Vercel | Edge network, seamless Next.js |
| **CI/CD** | GitHub Actions | Automated testing, deployment |

### 2.2 Development Tools

| Tool | Purpose |
|------|---------|
| pnpm | Fast, disk-efficient package manager |
| Biome | Faster linting + formatting (replaces ESLint + Prettier) |
| Husky + lint-staged | Pre-commit hooks |
| Playwright | E2E testing |
| Vitest | Unit testing (faster than Jest) |
| Storybook | Component documentation |
| T3 Env | Type-safe environment variables |
| next-safe-action | Type-safe server actions |

---

## 3. Database Architecture (MySQL 8.0)

### 3.1 Why MySQL 8.0

- **Full-Text Search:** Native `FULLTEXT` indexes with boolean mode
- **JSON Support:** Native JSON columns with indexing
- **Window Functions:** For rankings and analytics
- **CTEs:** Common Table Expressions for complex queries
- **Performance Schema:** Built-in query optimization
- **Connection Pooling:** Via PlanetScale driver or mysql2

### 3.2 Complete Schema Design

```sql
-- =============================================
-- USERS & AUTHENTICATION
-- =============================================

CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    email VARCHAR(255) NOT NULL UNIQUE,
    email_verified TIMESTAMP NULL,
    password_hash VARCHAR(255) NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    display_name VARCHAR(100),
    avatar_url VARCHAR(500),
    bio TEXT,
    website VARCHAR(255),
    twitter_handle VARCHAR(50),
    github_handle VARCHAR(50),
    role ENUM('user', 'moderator', 'admin') DEFAULT 'user',
    is_verified BOOLEAN DEFAULT FALSE,  -- Blue checkmark for notable users
    reputation_score INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_active_at TIMESTAMP,
    
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_reputation (reputation_score DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE sessions (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    session_token VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_session_token (session_token),
    INDEX idx_expires (expires_at)
) ENGINE=InnoDB;

CREATE TABLE verification_tokens (
    identifier VARCHAR(255) NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    
    PRIMARY KEY (identifier, token)
) ENGINE=InnoDB;

CREATE TABLE password_reset_tokens (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    used_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- =============================================
-- PROMPTS & CONTENT
-- =============================================

CREATE TABLE categories (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(50),  -- Lucide icon name
    color VARCHAR(7),  -- Hex color
    parent_id VARCHAR(36) NULL,
    prompt_count INT DEFAULT 0,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL,
    INDEX idx_slug (slug),
    INDEX idx_parent (parent_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE ai_models (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    provider VARCHAR(100),  -- OpenAI, Anthropic, Google, etc.
    icon_url VARCHAR(500),
    color VARCHAR(7),
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    
    INDEX idx_slug (slug),
    INDEX idx_provider (provider)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE prompts (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,  -- The actual prompt
    description TEXT,       -- What the prompt does
    instructions TEXT,      -- How to use it
    example_output TEXT,    -- Sample output
    variables JSON,         -- Customizable variables [{name, description, default}]
    
    -- Categorization
    category_id VARCHAR(36),
    ai_model_id VARCHAR(36),
    
    -- Visibility & Status
    visibility ENUM('public', 'private', 'unlisted') DEFAULT 'public',
    status ENUM('draft', 'published', 'archived') DEFAULT 'published',
    is_featured BOOLEAN DEFAULT FALSE,
    is_staff_pick BOOLEAN DEFAULT FALSE,
    
    -- Engagement Metrics
    view_count INT DEFAULT 0,
    copy_count INT DEFAULT 0,
    bookmark_count INT DEFAULT 0,
    fork_count INT DEFAULT 0,
    share_count INT DEFAULT 0,
    comment_count INT DEFAULT 0,
    
    -- Rating (denormalized for performance)
    rating_avg DECIMAL(3,2) DEFAULT 0.00,
    rating_count INT DEFAULT 0,
    
    -- SEO & Metadata
    meta_title VARCHAR(70),
    meta_description VARCHAR(160),
    og_image_url VARCHAR(500),
    
    -- Forking
    forked_from_id VARCHAR(36) NULL,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    published_at TIMESTAMP NULL,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    FOREIGN KEY (ai_model_id) REFERENCES ai_models(id) ON DELETE SET NULL,
    FOREIGN KEY (forked_from_id) REFERENCES prompts(id) ON DELETE SET NULL,
    
    INDEX idx_slug (slug),
    INDEX idx_user (user_id),
    INDEX idx_category (category_id),
    INDEX idx_visibility_status (visibility, status),
    INDEX idx_featured (is_featured, is_staff_pick),
    INDEX idx_rating (rating_avg DESC, rating_count DESC),
    INDEX idx_popular (view_count DESC, copy_count DESC),
    INDEX idx_created (created_at DESC),
    
    -- Full-Text Search Index
    FULLTEXT idx_search (title, content, description)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE prompt_versions (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    prompt_id VARCHAR(36) NOT NULL,
    version_number INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    description TEXT,
    change_summary VARCHAR(500),
    created_by VARCHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (prompt_id) REFERENCES prompts(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    
    UNIQUE KEY uk_prompt_version (prompt_id, version_number),
    INDEX idx_prompt (prompt_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- TAGS & CATEGORIZATION
-- =============================================

CREATE TABLE tags (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(50) NOT NULL,
    slug VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255),
    usage_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_slug (slug),
    INDEX idx_usage (usage_count DESC),
    FULLTEXT idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE prompt_tags (
    prompt_id VARCHAR(36) NOT NULL,
    tag_id VARCHAR(36) NOT NULL,
    
    PRIMARY KEY (prompt_id, tag_id),
    FOREIGN KEY (prompt_id) REFERENCES prompts(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE,
    
    INDEX idx_tag (tag_id)
) ENGINE=InnoDB;

-- =============================================
-- ENGAGEMENT & INTERACTIONS
-- =============================================

CREATE TABLE ratings (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    prompt_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NULL,  -- NULL for guest ratings
    guest_fingerprint VARCHAR(64) NULL,  -- For anonymous rating
    score TINYINT NOT NULL CHECK (score >= 1 AND score <= 5),
    ip_hash VARCHAR(64),  -- Hashed IP for spam prevention
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (prompt_id) REFERENCES prompts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    
    -- Prevent duplicate ratings
    UNIQUE KEY uk_user_rating (prompt_id, user_id),
    UNIQUE KEY uk_guest_rating (prompt_id, guest_fingerprint),
    
    INDEX idx_prompt (prompt_id),
    INDEX idx_user (user_id)
) ENGINE=InnoDB;

CREATE TABLE bookmarks (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    prompt_id VARCHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (prompt_id) REFERENCES prompts(id) ON DELETE CASCADE,
    
    UNIQUE KEY uk_bookmark (user_id, prompt_id),
    INDEX idx_user (user_id),
    INDEX idx_prompt (prompt_id)
) ENGINE=InnoDB;

CREATE TABLE collections (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL,
    description TEXT,
    cover_image_url VARCHAR(500),
    visibility ENUM('public', 'private') DEFAULT 'private',
    prompt_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    UNIQUE KEY uk_user_slug (user_id, slug),
    INDEX idx_user (user_id),
    INDEX idx_visibility (visibility)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE collection_prompts (
    collection_id VARCHAR(36) NOT NULL,
    prompt_id VARCHAR(36) NOT NULL,
    sort_order INT DEFAULT 0,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    PRIMARY KEY (collection_id, prompt_id),
    FOREIGN KEY (collection_id) REFERENCES collections(id) ON DELETE CASCADE,
    FOREIGN KEY (prompt_id) REFERENCES prompts(id) ON DELETE CASCADE,
    
    INDEX idx_prompt (prompt_id)
) ENGINE=InnoDB;

CREATE TABLE comments (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    prompt_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    parent_id VARCHAR(36) NULL,  -- For nested replies
    content TEXT NOT NULL,
    is_edited BOOLEAN DEFAULT FALSE,
    like_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (prompt_id) REFERENCES prompts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE,
    
    INDEX idx_prompt (prompt_id),
    INDEX idx_user (user_id),
    INDEX idx_parent (parent_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE comment_likes (
    user_id VARCHAR(36) NOT NULL,
    comment_id VARCHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    PRIMARY KEY (user_id, comment_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- =============================================
-- SOCIAL & FOLLOWS
-- =============================================

CREATE TABLE follows (
    follower_id VARCHAR(36) NOT NULL,
    following_id VARCHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    PRIMARY KEY (follower_id, following_id),
    FOREIGN KEY (follower_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (following_id) REFERENCES users(id) ON DELETE CASCADE,
    
    INDEX idx_following (following_id)
) ENGINE=InnoDB;

-- =============================================
-- ANALYTICS & TRACKING
-- =============================================

CREATE TABLE prompt_views (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    prompt_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NULL,
    visitor_fingerprint VARCHAR(64),
    ip_hash VARCHAR(64),
    referrer VARCHAR(500),
    user_agent VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (prompt_id) REFERENCES prompts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    
    INDEX idx_prompt (prompt_id),
    INDEX idx_created (created_at)
) ENGINE=InnoDB;

CREATE TABLE prompt_copies (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    prompt_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NULL,
    visitor_fingerprint VARCHAR(64),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (prompt_id) REFERENCES prompts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    
    INDEX idx_prompt (prompt_id),
    INDEX idx_created (created_at)
) ENGINE=InnoDB;

-- =============================================
-- NOTIFICATIONS
-- =============================================

CREATE TABLE notifications (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    type ENUM('rating', 'comment', 'follow', 'fork', 'mention', 'system') NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT,
    link VARCHAR(500),
    data JSON,  -- Additional context
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    INDEX idx_user_unread (user_id, is_read),
    INDEX idx_created (created_at DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- REPORTS & MODERATION
-- =============================================

CREATE TABLE reports (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    reporter_id VARCHAR(36) NOT NULL,
    prompt_id VARCHAR(36) NULL,
    comment_id VARCHAR(36) NULL,
    user_id VARCHAR(36) NULL,  -- Reported user
    reason ENUM('spam', 'inappropriate', 'copyright', 'harassment', 'other') NOT NULL,
    description TEXT,
    status ENUM('pending', 'reviewed', 'resolved', 'dismissed') DEFAULT 'pending',
    reviewed_by VARCHAR(36) NULL,
    reviewed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (reporter_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (prompt_id) REFERENCES prompts(id) ON DELETE CASCADE,
    FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE,
    FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL,
    
    INDEX idx_status (status),
    INDEX idx_created (created_at DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- USEFUL VIEWS
-- =============================================

CREATE VIEW v_trending_prompts AS
SELECT 
    p.*,
    u.username,
    u.display_name,
    u.avatar_url,
    c.name as category_name,
    c.slug as category_slug,
    am.name as ai_model_name,
    -- Trending score: recent engagement weighted
    (
        (p.view_count * 1) +
        (p.copy_count * 3) +
        (p.rating_count * 5) +
        (p.bookmark_count * 2)
    ) / POWER(TIMESTAMPDIFF(HOUR, p.created_at, NOW()) + 2, 1.5) as trending_score
FROM prompts p
JOIN users u ON p.user_id = u.id
LEFT JOIN categories c ON p.category_id = c.id
LEFT JOIN ai_models am ON p.ai_model_id = am.id
WHERE p.visibility = 'public' 
  AND p.status = 'published'
ORDER BY trending_score DESC;

-- =============================================
-- TRIGGERS FOR DENORMALIZATION
-- =============================================

DELIMITER //

-- Update rating average when new rating is added
CREATE TRIGGER tr_rating_insert AFTER INSERT ON ratings
FOR EACH ROW
BEGIN
    UPDATE prompts 
    SET 
        rating_avg = (SELECT AVG(score) FROM ratings WHERE prompt_id = NEW.prompt_id),
        rating_count = (SELECT COUNT(*) FROM ratings WHERE prompt_id = NEW.prompt_id)
    WHERE id = NEW.prompt_id;
END//

-- Update tag usage count
CREATE TRIGGER tr_prompt_tag_insert AFTER INSERT ON prompt_tags
FOR EACH ROW
BEGIN
    UPDATE tags SET usage_count = usage_count + 1 WHERE id = NEW.tag_id;
END//

CREATE TRIGGER tr_prompt_tag_delete AFTER DELETE ON prompt_tags
FOR EACH ROW
BEGIN
    UPDATE tags SET usage_count = usage_count - 1 WHERE id = OLD.tag_id;
END//

-- Update category prompt count
CREATE TRIGGER tr_prompt_insert AFTER INSERT ON prompts
FOR EACH ROW
BEGIN
    IF NEW.category_id IS NOT NULL AND NEW.visibility = 'public' THEN
        UPDATE categories SET prompt_count = prompt_count + 1 WHERE id = NEW.category_id;
    END IF;
END//

-- Update collection prompt count
CREATE TRIGGER tr_collection_prompt_insert AFTER INSERT ON collection_prompts
FOR EACH ROW
BEGIN
    UPDATE collections SET prompt_count = prompt_count + 1 WHERE id = NEW.collection_id;
END//

CREATE TRIGGER tr_collection_prompt_delete AFTER DELETE ON collection_prompts
FOR EACH ROW
BEGIN
    UPDATE collections SET prompt_count = prompt_count - 1 WHERE id = OLD.collection_id;
END//

DELIMITER ;
```

### 3.3 Drizzle ORM Configuration

```typescript
// drizzle.config.ts
import type { Config } from 'drizzle-kit';

export default {
  schema: './src/db/schema/*',
  out: './drizzle/migrations',
  driver: 'mysql2',
  dbCredentials: {
    uri: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
} satisfies Config;
```

---

## 4. Application Architecture

### 4.1 Project Structure

```
promptvault/
├── .github/
│   └── workflows/
│       ├── ci.yml                 # Lint, test, type-check
│       └── deploy.yml             # Production deployment
│
├── drizzle/
│   └── migrations/                # Database migrations
│
├── public/
│   ├── icons/                     # AI model icons, favicons
│   └── og/                        # Default OG images
│
├── src/
│   ├── app/                       # Next.js App Router
│   │   ├── (marketing)/           # Public marketing pages
│   │   │   ├── page.tsx           # Homepage
│   │   │   ├── about/
│   │   │   ├── pricing/
│   │   │   └── layout.tsx
│   │   │
│   │   ├── (browse)/              # Public browsing (no auth required)
│   │   │   ├── explore/
│   │   │   │   └── page.tsx       # Browse all prompts
│   │   │   ├── prompt/
│   │   │   │   └── [slug]/
│   │   │   │       ├── page.tsx   # Prompt detail
│   │   │   │       └── opengraph-image.tsx
│   │   │   ├── u/
│   │   │   │   └── [username]/
│   │   │   │       └── page.tsx   # Public profile
│   │   │   ├── category/
│   │   │   │   └── [slug]/
│   │   │   ├── tag/
│   │   │   │   └── [slug]/
│   │   │   ├── leaderboard/
│   │   │   ├── collections/
│   │   │   │   └── [id]/
│   │   │   └── layout.tsx
│   │   │
│   │   ├── (auth)/                # Authentication pages
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── forgot-password/
│   │   │   ├── reset-password/
│   │   │   ├── verify-email/
│   │   │   └── layout.tsx
│   │   │
│   │   ├── (dashboard)/           # Protected user area
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx       # Overview
│   │   │   ├── prompts/
│   │   │   │   ├── page.tsx       # My prompts
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx   # Create prompt
│   │   │   │   └── [id]/
│   │   │   │       └── edit/
│   │   │   ├── collections/
│   │   │   ├── bookmarks/
│   │   │   ├── analytics/
│   │   │   ├── notifications/
│   │   │   ├── settings/
│   │   │   │   ├── page.tsx       # Profile settings
│   │   │   │   ├── account/
│   │   │   │   ├── notifications/
│   │   │   │   └── security/
│   │   │   └── layout.tsx
│   │   │
│   │   ├── api/                   # API Routes
│   │   │   ├── auth/
│   │   │   │   └── [...nextauth]/
│   │   │   ├── prompts/
│   │   │   │   ├── route.ts       # GET (list), POST (create)
│   │   │   │   ├── [id]/
│   │   │   │   │   ├── route.ts   # GET, PUT, DELETE
│   │   │   │   │   ├── copy/
│   │   │   │   │   ├── view/
│   │   │   │   │   └── fork/
│   │   │   │   └── search/
│   │   │   ├── ratings/
│   │   │   ├── bookmarks/
│   │   │   ├── collections/
│   │   │   ├── comments/
│   │   │   ├── users/
│   │   │   ├── tags/
│   │   │   ├── upload/
│   │   │   └── webhooks/
│   │   │
│   │   ├── sitemap.ts             # Dynamic sitemap
│   │   ├── robots.ts
│   │   ├── manifest.ts            # PWA manifest
│   │   ├── layout.tsx             # Root layout
│   │   ├── loading.tsx
│   │   ├── error.tsx
│   │   └── not-found.tsx
│   │
│   ├── components/
│   │   ├── ui/                    # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── toast.tsx
│   │   │   ├── skeleton.tsx
│   │   │   └── ...
│   │   │
│   │   ├── prompts/
│   │   │   ├── prompt-card.tsx
│   │   │   ├── prompt-grid.tsx
│   │   │   ├── prompt-detail.tsx
│   │   │   ├── prompt-form.tsx
│   │   │   ├── prompt-content.tsx
│   │   │   ├── prompt-actions.tsx
│   │   │   ├── prompt-stats.tsx
│   │   │   ├── prompt-variables.tsx
│   │   │   └── prompt-skeleton.tsx
│   │   │
│   │   ├── ratings/
│   │   │   ├── star-rating.tsx
│   │   │   ├── rating-display.tsx
│   │   │   └── rating-breakdown.tsx
│   │   │
│   │   ├── search/
│   │   │   ├── search-dialog.tsx   # Command palette (⌘K)
│   │   │   ├── search-input.tsx
│   │   │   ├── search-filters.tsx
│   │   │   ├── search-results.tsx
│   │   │   └── filter-sidebar.tsx
│   │   │
│   │   ├── collections/
│   │   │   ├── collection-card.tsx
│   │   │   ├── collection-grid.tsx
│   │   │   └── add-to-collection.tsx
│   │   │
│   │   ├── comments/
│   │   │   ├── comment-list.tsx
│   │   │   ├── comment-item.tsx
│   │   │   └── comment-form.tsx
│   │   │
│   │   ├── users/
│   │   │   ├── user-avatar.tsx
│   │   │   ├── user-card.tsx
│   │   │   ├── user-hover-card.tsx
│   │   │   └── follow-button.tsx
│   │   │
│   │   ├── auth/
│   │   │   ├── login-form.tsx
│   │   │   ├── register-form.tsx
│   │   │   ├── forgot-password-form.tsx
│   │   │   └── social-buttons.tsx
│   │   │
│   │   ├── dashboard/
│   │   │   ├── stats-cards.tsx
│   │   │   ├── recent-prompts.tsx
│   │   │   ├── activity-chart.tsx
│   │   │   └── quick-actions.tsx
│   │   │
│   │   ├── layout/
│   │   │   ├── navbar.tsx
│   │   │   ├── footer.tsx
│   │   │   ├── sidebar.tsx
│   │   │   ├── mobile-nav.tsx
│   │   │   ├── theme-toggle.tsx
│   │   │   └── breadcrumbs.tsx
│   │   │
│   │   ├── shared/
│   │   │   ├── copy-button.tsx
│   │   │   ├── share-dialog.tsx
│   │   │   ├── tag-input.tsx
│   │   │   ├── tag-badge.tsx
│   │   │   ├── model-badge.tsx
│   │   │   ├── category-badge.tsx
│   │   │   ├── infinite-scroll.tsx
│   │   │   ├── empty-state.tsx
│   │   │   ├── loading-spinner.tsx
│   │   │   ├── markdown-renderer.tsx
│   │   │   ├── code-block.tsx
│   │   │   └── time-ago.tsx
│   │   │
│   │   └── providers/
│   │       ├── theme-provider.tsx
│   │       ├── query-provider.tsx
│   │       ├── session-provider.tsx
│   │       └── toast-provider.tsx
│   │
│   ├── db/
│   │   ├── index.ts               # Database client
│   │   ├── schema/
│   │   │   ├── users.ts
│   │   │   ├── prompts.ts
│   │   │   ├── ratings.ts
│   │   │   ├── collections.ts
│   │   │   ├── comments.ts
│   │   │   └── index.ts
│   │   └── queries/
│   │       ├── prompts.ts
│   │       ├── users.ts
│   │       ├── ratings.ts
│   │       └── collections.ts
│   │
│   ├── lib/
│   │   ├── auth.ts                # Auth.js configuration
│   │   ├── auth-options.ts
│   │   ├── utils.ts               # General utilities
│   │   ├── constants.ts
│   │   ├── slug.ts                # Slug generation
│   │   ├── fingerprint.ts         # Guest fingerprinting
│   │   ├── rate-limit.ts          # Upstash rate limiting
│   │   ├── search.ts              # Meilisearch client
│   │   ├── email.ts               # Resend client
│   │   ├── upload.ts              # Uploadthing config
│   │   └── analytics.ts           # Analytics helpers
│   │
│   ├── hooks/
│   │   ├── use-debounce.ts
│   │   ├── use-copy-to-clipboard.ts
│   │   ├── use-infinite-scroll.ts
│   │   ├── use-local-storage.ts
│   │   ├── use-media-query.ts
│   │   └── use-keyboard-shortcut.ts
│   │
│   ├── actions/                   # Server Actions
│   │   ├── prompts.ts
│   │   ├── ratings.ts
│   │   ├── bookmarks.ts
│   │   ├── collections.ts
│   │   ├── comments.ts
│   │   └── auth.ts
│   │
│   ├── validators/                # Zod schemas
│   │   ├── prompt.ts
│   │   ├── user.ts
│   │   ├── collection.ts
│   │   ├── comment.ts
│   │   └── auth.ts
│   │
│   ├── types/
│   │   ├── prompt.ts
│   │   ├── user.ts
│   │   ├── api.ts
│   │   └── index.ts
│   │
│   ├── config/
│   │   ├── site.ts                # Site metadata
│   │   ├── navigation.ts          # Nav links
│   │   └── categories.ts          # Default categories
│   │
│   └── styles/
│       └── globals.css
│
├── emails/                        # React Email templates
│   ├── welcome.tsx
│   ├── verify-email.tsx
│   ├── password-reset.tsx
│   └── notification.tsx
│
├── tests/
│   ├── e2e/                       # Playwright tests
│   └── unit/                      # Vitest tests
│
├── .env.example
├── .env.local
├── biome.json                     # Biome config
├── components.json                # shadcn/ui config
├── drizzle.config.ts
├── next.config.ts
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── vitest.config.ts
```

### 4.2 Key Configuration Files

**next.config.ts**
```typescript
import type { NextConfig } from 'next';

const config: NextConfig = {
  experimental: {
    typedRoutes: true,
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  images: {
    remotePatterns: [
      { hostname: 'avatars.githubusercontent.com' },
      { hostname: 'utfs.io' }, // Uploadthing
    ],
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
        ],
      },
    ];
  },
};

export default config;
```

**Environment Variables (env.ts with T3 Env)**
```typescript
import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    AUTH_SECRET: z.string().min(32),
    UPSTASH_REDIS_REST_URL: z.string().url(),
    UPSTASH_REDIS_REST_TOKEN: z.string(),
    MEILISEARCH_HOST: z.string().url(),
    MEILISEARCH_API_KEY: z.string(),
    RESEND_API_KEY: z.string(),
    UPLOADTHING_SECRET: z.string(),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string().url(),
    NEXT_PUBLIC_POSTHOG_KEY: z.string().optional(),
  },
  runtimeEnv: {
    // ... map to process.env
  },
});
```

---

## 5. Core Features Implementation

### 5.1 Search System (Meilisearch)

**Why Meilisearch over MySQL Full-Text:**
- Typo tolerance (finds "artifical" when searching "artificial")
- Instant search (<50ms)
- Faceted filtering
- Highlighting
- Synonyms support
- Easy scaling

**Index Configuration:**
```typescript
// src/lib/search.ts
import { MeiliSearch } from 'meilisearch';

const client = new MeiliSearch({
  host: env.MEILISEARCH_HOST,
  apiKey: env.MEILISEARCH_API_KEY,
});

const promptsIndex = client.index('prompts');

// Configure index settings
await promptsIndex.updateSettings({
  searchableAttributes: [
    'title',        // Highest priority
    'description',
    'content',
    'tags',
  ],
  filterableAttributes: [
    'categoryId',
    'aiModelId',
    'userId',
    'visibility',
    'tags',
    'ratingAvg',
  ],
  sortableAttributes: [
    'createdAt',
    'ratingAvg',
    'viewCount',
    'copyCount',
  ],
  rankingRules: [
    'words',
    'typo',
    'proximity',
    'attribute',
    'sort',
    'exactness',
    'ratingAvg:desc',
  ],
});
```

### 5.2 Rating System (Guest + User)

**Guest Fingerprinting:**
```typescript
// src/lib/fingerprint.ts
import FingerprintJS from '@fingerprintjs/fingerprintjs';

export async function getVisitorFingerprint(): Promise<string> {
  const fp = await FingerprintJS.load();
  const result = await fp.get();
  return result.visitorId;
}
```

**Server Action for Rating:**
```typescript
// src/actions/ratings.ts
'use server';

import { ratelimit } from '@/lib/rate-limit';
import { db } from '@/db';
import { ratings, prompts } from '@/db/schema';

export async function ratePrompt(data: {
  promptId: string;
  score: number;
  fingerprint?: string;
}) {
  const session = await auth();
  
  // Rate limiting
  const identifier = session?.user?.id ?? data.fingerprint ?? 'anonymous';
  const { success } = await ratelimit.limit(`rating:${identifier}`);
  if (!success) {
    return { error: 'Too many requests' };
  }
  
  // Check for existing rating
  const existing = await db.query.ratings.findFirst({
    where: session?.user?.id 
      ? eq(ratings.userId, session.user.id)
      : eq(ratings.guestFingerprint, data.fingerprint),
  });
  
  if (existing) {
    // Update existing rating
    await db.update(ratings)
      .set({ score: data.score })
      .where(eq(ratings.id, existing.id));
  } else {
    // Create new rating
    await db.insert(ratings).values({
      promptId: data.promptId,
      userId: session?.user?.id ?? null,
      guestFingerprint: session?.user?.id ? null : data.fingerprint,
      score: data.score,
    });
  }
  
  revalidatePath(`/prompt/${data.promptId}`);
  return { success: true };
}
```

### 5.3 Copy & Share System

**Copy Component:**
```typescript
// src/components/shared/copy-button.tsx
'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { trackCopy } from '@/actions/prompts';

export function CopyButton({ 
  promptId, 
  content 
}: { 
  promptId: string; 
  content: string;
}) {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    toast.success('Copied to clipboard!');
    
    // Track copy event
    await trackCopy(promptId);
    
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleCopy}
    >
      {copied ? (
        <Check className="h-4 w-4 mr-2" />
      ) : (
        <Copy className="h-4 w-4 mr-2" />
      )}
      {copied ? 'Copied!' : 'Copy Prompt'}
    </Button>
  );
}
```

**Share Dialog:**
```typescript
// src/components/shared/share-dialog.tsx
'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Twitter, Linkedin, Link2, Code, Check } from 'lucide-react';

export function ShareDialog({ 
  prompt, 
  open, 
  onOpenChange 
}: ShareDialogProps) {
  const url = `${env.NEXT_PUBLIC_APP_URL}/prompt/${prompt.slug}`;
  
  const shareLinks = [
    {
      name: 'Twitter',
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(prompt.title)}&url=${encodeURIComponent(url)}`,
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    },
  ];
  
  const embedCode = `<iframe src="${url}/embed" width="100%" height="400" frameborder="0"></iframe>`;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share Prompt</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Direct Link */}
          <div className="flex gap-2">
            <Input value={url} readOnly />
            <CopyButton content={url} />
          </div>
          
          {/* Social Buttons */}
          <div className="flex gap-2">
            {shareLinks.map((link) => (
              <Button
                key={link.name}
                variant="outline"
                size="icon"
                onClick={() => window.open(link.url, '_blank')}
              >
                <link.icon className="h-4 w-4" />
              </Button>
            ))}
          </div>
          
          {/* Embed Code */}
          <div>
            <label className="text-sm font-medium">Embed Code</label>
            <div className="flex gap-2 mt-1">
              <Input value={embedCode} readOnly className="font-mono text-xs" />
              <CopyButton content={embedCode} />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

### 5.4 Command Palette (⌘K Search)

```typescript
// src/components/search/search-dialog.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  CommandDialog, 
  CommandEmpty, 
  CommandGroup, 
  CommandInput, 
  CommandItem, 
  CommandList 
} from '@/components/ui/command';
import { useDebounce } from '@/hooks/use-debounce';
import { searchPrompts } from '@/actions/search';

export function SearchDialog() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const debouncedQuery = useDebounce(query, 300);
  const router = useRouter();
  
  // Keyboard shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);
  
  // Search on query change
  useEffect(() => {
    if (debouncedQuery.length > 1) {
      searchPrompts(debouncedQuery).then(setResults);
    } else {
      setResults([]);
    }
  }, [debouncedQuery]);
  
  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput 
        placeholder="Search prompts..." 
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Prompts">
          {results.map((result) => (
            <CommandItem
              key={result.id}
              onSelect={() => {
                router.push(`/prompt/${result.slug}`);
                setOpen(false);
              }}
            >
              <span>{result.title}</span>
              <span className="text-muted-foreground text-sm ml-2">
                {result.category}
              </span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
```

---

## 6. Performance Optimizations

### 6.1 Caching Strategy

| Data Type | Cache Location | TTL | Invalidation |
|-----------|---------------|-----|--------------|
| Public prompts list | Redis + CDN | 5 min | On new prompt |
| Single prompt | Redis | 10 min | On edit |
| User profile (public) | Redis | 15 min | On update |
| Categories/Tags | Redis | 1 hour | Manual |
| Search results | Meilisearch | Instant | On index update |
| Static pages | CDN (Vercel) | 1 hour | On deploy |

**Redis Caching Example:**
```typescript
// src/lib/cache.ts
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: env.UPSTASH_REDIS_REST_URL,
  token: env.UPSTASH_REDIS_REST_TOKEN,
});

export async function getCachedPrompt(slug: string) {
  const cacheKey = `prompt:${slug}`;
  
  // Try cache first
  const cached = await redis.get<Prompt>(cacheKey);
  if (cached) return cached;
  
  // Fetch from database
  const prompt = await db.query.prompts.findFirst({
    where: eq(prompts.slug, slug),
    with: { user: true, category: true, aiModel: true },
  });
  
  if (prompt) {
    // Cache for 10 minutes
    await redis.set(cacheKey, prompt, { ex: 600 });
  }
  
  return prompt;
}
```

### 6.2 Database Optimizations

- **Connection Pooling:** mysql2 with pool (max 10 connections)
- **Indexes:** On all foreign keys, frequently filtered columns
- **Denormalization:** Rating counts/averages stored on prompts table
- **Pagination:** Cursor-based for infinite scroll
- **Read Replicas:** For high-traffic reads (future scaling)

### 6.3 Frontend Optimizations

- **React Server Components:** For static content
- **Suspense Boundaries:** Streaming for slow data
- **Image Optimization:** next/image with blur placeholders
- **Code Splitting:** Dynamic imports for heavy components
- **Prefetching:** Link prefetch for navigation
- **Virtual Lists:** For long prompt lists

---

## 7. Security Implementation

### 7.1 Authentication Security

```typescript
// src/lib/auth.ts
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { type: 'email' },
        password: { type: 'password' },
      },
      async authorize(credentials) {
        const user = await db.query.users.findFirst({
          where: eq(users.email, credentials.email),
        });
        
        if (!user || !user.passwordHash) return null;
        
        const valid = await bcrypt.compare(
          credentials.password, 
          user.passwordHash
        );
        
        if (!valid) return null;
        
        return {
          id: user.id,
          email: user.email,
          name: user.displayName,
          image: user.avatarUrl,
        };
      },
    }),
  ],
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id as string;
      return session;
    },
  },
});
```

### 7.2 Rate Limiting

```typescript
// src/lib/rate-limit.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: env.UPSTASH_REDIS_REST_URL,
  token: env.UPSTASH_REDIS_REST_TOKEN,
});

// Different limits for different actions
export const rateLimits = {
  // 5 requests per minute for auth
  auth: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, '1 m'),
    prefix: 'ratelimit:auth',
  }),
  
  // 30 ratings per hour
  rating: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(30, '1 h'),
    prefix: 'ratelimit:rating',
  }),
  
  // 10 prompts per hour
  createPrompt: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, '1 h'),
    prefix: 'ratelimit:create',
  }),
  
  // 100 API requests per minute
  api: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(100, '1 m'),
    prefix: 'ratelimit:api',
  }),
};
```

### 7.3 Input Validation

```typescript
// src/validators/prompt.ts
import { z } from 'zod';

export const createPromptSchema = z.object({
  title: z
    .string()
    .min(5, 'Title must be at least 5 characters')
    .max(100, 'Title must be under 100 characters'),
  content: z
    .string()
    .min(20, 'Prompt must be at least 20 characters')
    .max(10000, 'Prompt must be under 10,000 characters'),
  description: z
    .string()
    .max(500, 'Description must be under 500 characters')
    .optional(),
  categoryId: z.string().uuid().optional(),
  aiModelId: z.string().uuid().optional(),
  tags: z
    .array(z.string().max(30))
    .max(5, 'Maximum 5 tags allowed')
    .optional(),
  visibility: z.enum(['public', 'private', 'unlisted']).default('public'),
});

export type CreatePromptInput = z.infer<typeof createPromptSchema>;
```

---

## 8. API Design

### 8.1 RESTful Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| **Prompts** |
| GET | /api/prompts | No | List prompts (paginated, filterable) |
| GET | /api/prompts/[slug] | No | Get single prompt |
| POST | /api/prompts | Yes | Create prompt |
| PATCH | /api/prompts/[id] | Yes | Update own prompt |
| DELETE | /api/prompts/[id] | Yes | Delete own prompt |
| POST | /api/prompts/[id]/copy | No | Track copy event |
| POST | /api/prompts/[id]/view | No | Track view event |
| POST | /api/prompts/[id]/fork | Yes | Fork a prompt |
| **Search** |
| GET | /api/search | No | Full-text search |
| GET | /api/search/suggestions | No | Autocomplete |
| **Ratings** |
| POST | /api/ratings | No | Submit rating |
| GET | /api/prompts/[id]/ratings | No | Get rating breakdown |
| **Users** |
| GET | /api/users/[username] | No | Public profile |
| PATCH | /api/users/me | Yes | Update profile |
| GET | /api/users/me/prompts | Yes | My prompts |
| **Collections** |
| GET | /api/collections | Yes | My collections |
| POST | /api/collections | Yes | Create collection |
| POST | /api/collections/[id]/prompts | Yes | Add prompt to collection |
| **Bookmarks** |
| GET | /api/bookmarks | Yes | My bookmarks |
| POST | /api/bookmarks | Yes | Toggle bookmark |
| **Comments** |
| GET | /api/prompts/[id]/comments | No | List comments |
| POST | /api/prompts/[id]/comments | Yes | Add comment |
| **Tags/Categories** |
| GET | /api/categories | No | List categories |
| GET | /api/tags | No | List tags |
| GET | /api/tags/popular | No | Trending tags |

### 8.2 Response Format

```typescript
// Success response
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "pageSize": 20,
    "total": 150,
    "hasMore": true
  }
}

// Error response
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "details": [
      { "field": "title", "message": "Title is required" }
    ]
  }
}
```

---

## 9. SEO & Social Sharing

### 9.1 Dynamic OG Images

```typescript
// src/app/prompt/[slug]/opengraph-image.tsx
import { ImageResponse } from 'next/og';
import { getPromptBySlug } from '@/db/queries/prompts';

export const runtime = 'edge';
export const alt = 'Prompt Preview';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: { slug: string } }) {
  const prompt = await getPromptBySlug(params.slug);
  
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '60px',
        }}
      >
        <div style={{ fontSize: 60, fontWeight: 'bold', color: 'white' }}>
          {prompt?.title}
        </div>
        <div style={{ fontSize: 30, color: 'rgba(255,255,255,0.8)', marginTop: 20 }}>
          {prompt?.description?.slice(0, 120)}...
        </div>
        <div style={{ fontSize: 24, color: 'rgba(255,255,255,0.6)', marginTop: 40 }}>
          PromptVault • by @{prompt?.user.username}
        </div>
      </div>
    ),
    { ...size }
  );
}
```

### 9.2 Metadata Generation

```typescript
// src/app/prompt/[slug]/page.tsx
import type { Metadata } from 'next';

export async function generateMetadata({ params }): Promise<Metadata> {
  const prompt = await getPromptBySlug(params.slug);
  
  return {
    title: `${prompt.title} | PromptVault`,
    description: prompt.description || prompt.content.slice(0, 160),
    openGraph: {
      title: prompt.title,
      description: prompt.description,
      type: 'article',
      authors: [prompt.user.displayName],
      publishedTime: prompt.publishedAt,
      tags: prompt.tags?.map(t => t.name),
    },
    twitter: {
      card: 'summary_large_image',
      title: prompt.title,
      description: prompt.description,
    },
  };
}
```

---

## 10. Development & Deployment

### 10.1 Development Workflow

```bash
# Install dependencies
pnpm install

# Start development server (with Turbopack)
pnpm dev

# Run database migrations
pnpm db:migrate

# Generate Drizzle client
pnpm db:generate

# Run tests
pnpm test         # Unit tests (Vitest)
pnpm test:e2e     # E2E tests (Playwright)

# Lint & format
pnpm check        # Biome lint + format check
pnpm check:fix    # Auto-fix issues

# Build for production
pnpm build
```

### 10.2 CI/CD Pipeline (GitHub Actions)

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      
      - run: pnpm install --frozen-lockfile
      - run: pnpm check           # Lint
      - run: pnpm typecheck       # TypeScript
      - run: pnpm test            # Unit tests
      
  e2e:
    runs-on: ubuntu-latest
    needs: quality
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
      
      - run: pnpm install --frozen-lockfile
      - run: pnpm exec playwright install --with-deps
      - run: pnpm test:e2e
```

### 10.3 Infrastructure Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         VERCEL EDGE                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │   Next.js   │  │   Edge      │  │   Static    │              │
│  │   SSR/RSC   │  │   Functions │  │   Assets    │              │
│  └──────┬──────┘  └──────┬──────┘  └─────────────┘              │
└─────────┼────────────────┼──────────────────────────────────────┘
          │                │
          ▼                ▼
┌─────────────────────────────────────────────────────────────────┐
│                       BACKEND SERVICES                           │
│                                                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │  MySQL 8.0  │  │   Upstash   │  │ Meilisearch │              │
│  │  (Primary)  │  │   Redis     │  │  (Search)   │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
│                                                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │   Resend    │  │ Uploadthing │  │   Sentry    │              │
│  │   (Email)   │  │  (Storage)  │  │ (Monitoring)│              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
└─────────────────────────────────────────────────────────────────┘
```

---

## 11. Implementation Phases

### Phase 1: Foundation (Weeks 1-2)
- [ ] Project setup (Next.js, Drizzle, MySQL)
- [ ] Database schema & migrations
- [ ] Authentication (Auth.js + Credentials)
- [ ] Basic UI components (shadcn/ui)
- [ ] User registration & login
- [ ] Create/edit/delete prompts
- [ ] Public prompt listing

### Phase 2: Core Features (Weeks 3-4)
- [ ] Prompt detail page with copy/share
- [ ] Star rating system (guest + user)
- [ ] Search with Meilisearch
- [ ] Categories & tags
- [ ] User profiles (public)
- [ ] Responsive design

### Phase 3: Engagement (Weeks 5-6)
- [ ] Bookmarking
- [ ] Collections/folders
- [ ] Command palette (⌘K)
- [ ] User dashboard
- [ ] Analytics & stats
- [ ] Email notifications (Resend)

### Phase 4: Community (Weeks 7-8)
- [ ] Comments system
- [ ] Follow users
- [ ] Fork/remix prompts
- [ ] Version history
- [ ] Leaderboards
- [ ] OG image generation

### Phase 5: Polish & Scale (Weeks 9-10)
- [ ] Performance optimization
- [ ] Redis caching
- [ ] Rate limiting
- [ ] Error monitoring (Sentry)
- [ ] E2E testing
- [ ] Documentation

---

## 12. Cost Estimation (Monthly)

| Service | Tier | Estimated Cost |
|---------|------|----------------|
| Vercel | Pro | $20 |
| MySQL (PlanetScale/Railway) | Hobby | $0-20 |
| Upstash Redis | Free/Pro | $0-10 |
| Meilisearch Cloud | Build | $0-30 |
| Resend | Free (3K/month) | $0 |
| Uploadthing | Free (2GB) | $0 |
| Sentry | Free tier | $0 |
| **Total** | | **$20-80/month** |

---
