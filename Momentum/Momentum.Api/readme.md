# 🐘 How to Run MSSQL Locally on macOS

## 📌 Overview

This guide explains how to set up, start, and connect to a local SQL Server (MSSQL) instance using Docker on macOS.

---

## 🚀 Quick Start (One-liner)

Start the SQL Server container and run the API in one go:

```bash
open -a Docker

docker start my-mssql-server

docker start my-mssql-server && cd Momentum.Api && dotnet run
```

---

## 🐳 Set Up and Run Docker Container

### 1. Pull the SQL Server image (if not already installed)

```bash
docker pull mcr.microsoft.com/mssql/server:2019-latest
```

### 2. Run the container

```bash
docker run --platform=linux/amd64 \
  -e "ACCEPT_EULA=Y" \
  -e "MSSQL_SA_PASSWORD=YourStrong@Passw0rd" \
  --name my-mssql-server \
  -p 1433:1433 \
  -d mcr.microsoft.com/mssql/server:2019-latest
```

### 3. Start the container

```bash
docker start my-mssql-server
```

### 4. Stop the container (when done)

```bash
docker stop my-mssql-server
```

### 5. Delete the container (optional)

```bash
docker rm my-mssql-server
```

### 6. Check running containers

```bash
docker ps
```

---

## ⚠️ Common Issues

### Permission Denied When Using Docker

If you see a permission error like `permission denied on /var/run/docker.sock`, run:

```bash
sudo chmod 666 /var/run/docker.sock
```

---

## 🔌 Connect to Local SQL Server

You can use **Azure Data Studio** or any SQL client to connect:

- **Server**: `localhost`
- **Port**: `1433`
- **Username**: `sa`
- **Password**: `YourStrong@Passw0rd`

---

## 🔐 Example Login Request Payload

```json
{
  "email": "eden@gmail.com",
  "password": "Password01!"
}
```

## How to swap .net in Mac

Check

```aiignore
brew search dotnet
```

```aiignore
dotnet link dotnet@9

```
