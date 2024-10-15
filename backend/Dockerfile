# build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS runtime
WORKDIR /app
COPY . .
RUN dotnet restore
RUN dotnet publish -c release -o /bin --no-restore

# final stage/image
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=runtime /bin .
RUN mkdir -p wwwroot/images
EXPOSE 5000
ENV ASPNETCORE_URLS=http://*:5000
ENTRYPOINT ["dotnet", "EgyptHomes.dll"]
