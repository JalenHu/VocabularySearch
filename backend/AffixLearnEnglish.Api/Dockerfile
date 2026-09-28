# --- Build stage ---
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY AffixLearnEnglish.Api.csproj ./
RUN dotnet restore AffixLearnEnglish.Api.csproj

COPY . .
RUN dotnet publish AffixLearnEnglish.Api.csproj -c Release -o /app/publish

# --- Runtime stage ---
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

# Render sets PORT at runtime; Program.cs reads it and binds Kestrel to it.
# This EXPOSE is informational only (Render ignores it and uses PORT).
EXPOSE 8080

ENTRYPOINT ["dotnet", "AffixLearnEnglish.Api.dll"]
