# AI Prompts Repository - Architectural Plan v2.0

This document has been consolidated into the [Project Documentation Guide](./PROJECT-GUIDE.md).

The original version is preserved under `docs/_archived_sources/requirements.md`.

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
│   │   │   │       
│   │   │   ├── u/
│   │   │   │   └── [username]/
│   │   │   │       └── page.tsx   # Public profile
│   │   │   ├── category/
│   │   │   │   └── [slug]/
│   │   │   ├── tag/
│   │   │   │   └── [slug]/
│   │   │   ├── leaderboard/
│   │   │   ├── collections/
│   │   │   │   
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
│   │   │   │   │   
│   │   │   │   └── search/
│   │   │   ├── ratings/
│   │   │   ├── bookmarks/
│   │   │   ├── collections/
│   │   │   ├── comments/
│   │   │   ├── users/
│   │   │   
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
│   │   │   
│   │   ├── prompts/
│   │   │   ├── prompt-card.tsx
│   │   │   
│   │   ├── ratings/
│   │   │   ├── star-rating.tsx
│   │   │   
│   │   ├── layout/
│   │   │   ├── navbar.tsx
│   │   │   
│   ├── db/
│   │   ├── index.ts               # Database client
│   │   ├── schema/
│   │   │   
│   │   └── queries/
│   │       
│   ├── lib/
│   │   ├── auth.ts                # Auth.js configuration
│   │   
│   ├── hooks/
│   │   
│   ├── actions/                   # Server Actions
│   │   ├── prompts.ts
```
