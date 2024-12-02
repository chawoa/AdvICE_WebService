FROM eclipse-temurin:17-jre-alpine
WORKDIR /backend

COPY build/libs/*.jar app.jar

RUN mkdir -p backend
COPY .env backend/.env

EXPOSE 4000

ENTRYPOINT ["java", "-jar", "app.jar"]
