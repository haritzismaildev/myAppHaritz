# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src

# Salin file solusi dan proyek-proyek backend
# Pastikan file .sln berada di root folder myAppHaritz
COPY *.sln ./
COPY MyAppHaritz.Api/MyAppHaritz.Api.csproj MyAppHaritz.Api/
COPY MyAppHaritz.Core/MyAppHaritz.Core.csproj MyAppHaritz.Core/
COPY MyAppHaritz.Application/MyAppHaritz.Application.csproj MyAppHaritz.Application/
COPY MyAppHaritz.Infrastructure/MyAppHaritz.Infrastructure.csproj MyAppHaritz.Infrastructure/

# Restore dependensi
RUN dotnet restore

# Salin seluruh source code dan build serta publish aplikasi
COPY . .
WORKDIR /src/MyAppHaritz.Api
RUN dotnet publish -c Release -o /app/publish

# Stage 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:7.0
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "MyAppHaritz.Api.dll"]