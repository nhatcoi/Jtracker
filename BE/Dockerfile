# --- Stage 1: Build the Spring Boot app ---
FROM maven:3.9.6-eclipse-temurin-17 AS builder

WORKDIR /build
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src ./src
RUN mvn clean package -DskipTests

# --- Stage 2: Run the app ---
FROM openjdk:17

WORKDIR /app

COPY --from=builder /build/target/*.jar /app/app.jar
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]

# Deployment
