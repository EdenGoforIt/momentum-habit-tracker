# Momentum

Momentum is a powerful application designed to streamline your workflow and enhance productivity. Built with modern technologies, Momentum leverages **.NET**, **React Native**, and **Microsoft SQL Server (MSSQL)** to provide a seamless experience across platforms.

## Technologies Used
- **.NET** – Backend API development
- **React Native** – Cross-platform mobile app
- **MSSQL** – Database management

## Features
- **User Authentication** – Secure login and registration
- **Task Management** – Create, update, and track tasks
- **Analytics Dashboard** – Visual insights into progress
- **Offline Mode** – Access data even without an internet connection

## Installation
### Prerequisites
- .NET 8 SDK
- Node.js (for React Native)
- MSSQL Server
- Android/iOS Emulator or a physical device

### Backend Setup (.NET API)
```sh
cd backend
 dotnet restore
 dotnet run
```

### Mobile App Setup (React Native)
```sh
cd mobile
npm install
npx react-native run-android  # For Android
gor npx react-native run-ios   # For iOS
```

## Database Setup
1. Install **Microsoft SQL Server**.
2. Create a new database named `MomentumDB`.
3. Run the migration script:
```sql
CREATE DATABASE MomentumDB;
```

## Contributing
1. Fork the repository
2. Create a new branch
3. Commit changes
4. Push to the branch and create a Pull Request

## License
Momentum is licensed under the **MIT License**.

---

> **Make Your Habits Right!** 🚀

