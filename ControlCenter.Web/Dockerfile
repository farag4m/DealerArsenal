# ── Stage 1: build frontend ──────────────────────────────────────────────────
FROM node:20-slim AS frontend-build
WORKDIR /app/ClientApp
COPY ClientApp/package*.json ./
RUN npm ci --ignore-scripts
COPY ClientApp/ ./
RUN npm run build

# ── Stage 2: build backend ────────────────────────────────────────────────────
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS backend-build
WORKDIR /app
COPY *.csproj ./
RUN dotnet restore
COPY . ./
# Place the compiled frontend into wwwroot before dotnet publish
COPY --from=frontend-build /app/ClientApp/dist ./wwwroot
RUN dotnet publish -c Release -o /publish --no-restore

# ── Stage 3: runtime ──────────────────────────────────────────────────────────
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

# Run as non-root user per security rules
RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser
USER appuser

COPY --from=backend-build /publish .

EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

ENTRYPOINT ["dotnet", "ControlCenter.Web.dll"]
