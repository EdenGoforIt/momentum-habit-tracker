# Momentum Mobile Application

## Overview

Momentum is a mobile application developed using React Native and .NET. This app aims to help users build and maintain positive habits by tracking daily activities and providing motivation through progress visualization and achievement systems.

## Features

- Habit tracking and streak management
- Goal setting with milestone notifications
- Progress visualization with charts and statistics
- Achievement system to encourage consistent behavior
- Customizable reminders and notifications
- User profile and preference management

## Project Structure

```
Momentum/
├── Momentum.Presentation/  - UI components and view models
│   └── Momentum.Mobile/    - Mobile app implementation
├── Momentum.Application/   - Application use cases and business logic
├── Momentum.Domain/        - Domain entities, interfaces, and business rules
├── Momentum.API/           - API controllers and endpoints
└── Momentum.Infrastructure/ - Data persistence and external services
```

## Technologies

- .NET for the backend - clean architecture, CRQS, minimal API, funcitonal programming, EF, MSSQL
- React Native with Expo
