FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
# Non-root user per SECURITY_RULES.md
RUN addgroup --system --gid 1001 appgroup \
    && adduser --system --uid 1001 --ingroup appgroup appuser
WORKDIR /app
EXPOSE 5035
USER appuser

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["Services/Operations/Operations.csproj", "Services/Operations/"]
RUN dotnet restore "Services/Operations/Operations.csproj"
COPY Services/Operations/ Services/Operations/
WORKDIR "/src/Services/Operations"
RUN dotnet build "Operations.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Operations.csproj" -c Release -o /app/publish \
    /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "DealerArsenal.Operations.dll"]
