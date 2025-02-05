FROM eclipse-temurin:17-jre-alpine
WORKDIR /backend

COPY build/libs/*.jar app.jar

RUN mkdir -p backend
COPY .env backend/.env

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
