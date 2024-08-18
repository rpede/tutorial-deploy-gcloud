# https://hub.docker.com/_/microsoft-dotnet
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /source

# copy csproj and restore as distinct layers
COPY *.sln ./
COPY server/Api/*.csproj ./server/Api/
COPY server/DataAccess/*.csproj ./server/DataAccess/
COPY server/Service/*.csproj ./server/Service/
COPY server/UnitTests/*.csproj ./server/UnitTests/
RUN dotnet restore

# copy everything else and build app
COPY server/Api/. ./server/Api/
COPY server/DataAccess/. ./server/DataAccess/
COPY server/Service/. ./server/Service/
COPY server/UnitTests/. ./server/UnitTests/
RUN dotnet publish -c release -o /app --no-restore

# final stage/image
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app ./
ENTRYPOINT ["dotnet", "Api.dll"]
