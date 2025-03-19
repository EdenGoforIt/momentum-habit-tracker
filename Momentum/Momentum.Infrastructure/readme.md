# Ef Migration

## Add Migration

```
 dotnet ef migrations add Initial --verbose --project ./Momentum.Infrastructure/Momentum.Infrastructure.csproj --startup-project ./Momentum.Api/Momentum.Api.csproj
```

## Update Database

```
 dotnet ef database update --project ./Momentum.Infrastructure/Momentum.Infrastructure.csproj --startup-project ./Momentum.Api/Momentum.Api.csproj
```
