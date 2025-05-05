# Ef Migration
1. Open terminal under Momentum Solution

## Add Migration

```
 dotnet ef migrations add AddBasicEntiteis --verbose --project ./Momentum.Infrastructure/Momentum.Infrastructure.csproj --startup-project ./Momentum.Api/Momentum.Api.csproj
```

## Update Database

```
 dotnet ef database update --project ./Momentum.Infrastructure/Momentum.Infrastructure.csproj --startup-project ./Momentum.Api/Momentum.Api.csproj
```

## Remove Migration

```
 dotnet ef migrations remove --project ./Momentum.Infrastructure/Momentum.Infrastructure.csproj --startup-project ./Momentum.Api/Momentum.Api.csproj
```

## Rollback Migration
```
dotnet ef database update 0 --project ./Momentum.Infrastructure/Momentum.Infrastructure.csproj --startup-project ./Momentum.Api/Momentum.Api.csproj
```
```
    dotnet ef database update <MigrationName> --project ./Momentum.Infrastructure/Momentum.Infrastructure.csproj --startup-project ./Momentum.Api/Momentum.Api.csproj
```

## Drop the database to start from scratch
```
    dotnet ef database drop --project ./Momentum.Infrastructure/Momentum.Infrastructure.csproj --startup-project ./Momentum.Api/Momentum.Api.csproj
```

## Known Code Quality Issue
```
    [System.Diagnostics.CodeAnalysis.SuppressMessage("Design", "CA1062:Validate arguments of public methods", Justification = "EF Core auto-generated code")]
```