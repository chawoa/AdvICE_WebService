# Base image
FROM openjdk:17-jdk-slim

# 작업 디렉토리 설정
WORKDIR /app

# Gradle Wrapper와 관련 파일 복사
COPY ./gradlew ./gradlew
COPY ./gradle ./gradle
COPY ./build.gradle ./build.gradle
COPY ./settings.gradle ./settings.gradle
COPY ./src ./src

# Gradle Wrapper에 실행 권한 부여
RUN chmod +x ./gradlew

# Gradle을 사용하여 애플리케이션을 빌드
RUN ./gradlew clean build -x test

# 빌드된 JAR 파일을 컨테이너에 복사
COPY build/libs/*.jar app.jar

# 애플리케이션이 사용할 포트 공개
EXPOSE 4000

# 애플리케이션 실행
ENTRYPOINT ["java", "-jar", "/app/app.jar"]