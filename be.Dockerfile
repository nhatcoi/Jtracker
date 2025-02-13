FROM openjdk:17-jdk-slim
WORKDIR /app

COPY BE/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]