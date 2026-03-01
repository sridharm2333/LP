# Lonely Penguin – Project Structure

## Backend (`backend/`)

```
backend/
├── src/
│   ├── config/index.ts           # PORT, MONGODB_URI, JWT_SECRET
│   ├── db/connection.ts          # mongoose connect
│   ├── models/
│   │   ├── User.ts
│   │   ├── Post.ts
│   │   ├── Comment.ts
│   │   ├── WarmthReaction.ts
│   │   ├── Group.ts
│   │   ├── GroupMember.ts
│   │   ├── GroupPost.ts
│   │   ├── PenguinCircle.ts
│   │   ├── Report.ts
│   │   ├── KindnessLog.ts
│   │   └── index.ts
│   ├── middleware/
│   │   ├── auth.ts                # JWT authMiddleware, optionalAuth
│   │   ├── moderation.ts          # aiModerationMiddleware, toneCheckMiddleware (stubs)
│   │   ├── distress.ts            # containsDistressKeywords, CRISIS_GROUNDING_MESSAGE
│   │   └── index.ts
│   ├── services/
│   │   ├── kindnessScore.ts       # addKindnessPoints, getTopKindUsers
│   │   └── penguinCircle.ts       # createCircle, dissolveExpiredCircles, getActiveCircleForUser
│   ├── constants/commentTemplates.ts
│   ├── controllers/
│   │   ├── authController.ts
│   │   ├── postController.ts
│   │   ├── commentController.ts
│   │   ├── groupController.ts
│   │   ├── penguinCircleController.ts
│   │   ├── reportController.ts
│   │   └── userController.ts
│   ├── routes/
│   │   ├── authRoutes.ts
│   │   ├── postRoutes.ts
│   │   ├── commentRoutes.ts
│   │   ├── groupRoutes.ts
│   │   ├── penguinCircleRoutes.ts
│   │   ├── reportRoutes.ts
│   │   └── userRoutes.ts
│   ├── seed/groups.ts            # default topic groups
│   ├── app.ts
│   └── index.ts
├── package.json
├── tsconfig.json
└── .env.example
```

## Mobile (`mobile/`)

```
mobile/
├── App.tsx
├── src/
│   ├── config/api.ts
│   ├── context/
│   │   ├── AuthContext.tsx
│   │   └── ThemeContext.tsx      # light / Midnight Ocean
│   ├── services/api.ts           # auth, posts, comments, groups, penguinCircle, user, reports
│   ├── navigation/
│   │   ├── RootNavigator.tsx
│   │   ├── AuthStack.tsx
│   │   ├── MainTabs.tsx
│   │   ├── FeedStack.tsx
│   │   ├── GroupsStack.tsx
│   │   ├── CompanionStack.tsx
│   ├── screens/
│   │   ├── auth/LoginScreen.tsx, RegisterScreen.tsx
│   │   ├── FeedScreen.tsx
│   │   ├── CreatePostScreen.tsx
│   │   ├── PostDetailScreen.tsx
│   │   ├── JourneyScreen.tsx
│   │   ├── GroupsScreen.tsx
│   │   ├── GroupFeedScreen.tsx
│   │   ├── CompanionScreen.tsx
│   │   ├── PenguinCircleScreen.tsx
│   │   └── ProfileScreen.tsx
│   └── components/
│       ├── PostCard.tsx
│       ├── CommentList.tsx
│       ├── WarmthButton.tsx
│       └── OceanSoundPlayer.tsx   # stub for ocean sounds
├── package.json
├── app.json
└── tsconfig.json
```

## API overview

| Area | Endpoints |
|------|-----------|
| Auth | POST /api/auth/register, /api/auth/login, GET /api/auth/me |
| Posts | GET /api/posts, GET /api/posts/my, GET /api/posts/:id, POST /api/posts |
| Comments | GET /api/comments/templates, GET /api/comments/post/:postId, POST /api/comments/post/:postId, POST /api/comments/:commentId/warmth |
| Groups | GET /api/groups, POST /api/groups/:groupId/join, GET /api/groups/:groupId/feed, POST /api/groups/:groupId/posts |
| Penguin Circle | POST /api/penguin-circle/check-distress, POST /api/penguin-circle/request, GET /api/penguin-circle/my |
| User | GET/PATCH /api/user/profile, GET /api/user/companion-message, POST /api/user/check-in |
| Reports | POST /api/reports |
