# Sử dụng JDK 17
FROM openjdk:17-jdk-slim
WORKDIR /app

# Copy file JAR vào container
COPY BE/target/*.jar app.jar

# Expose cổng API
EXPOSE 8080

# Chạy ứng dụng
ENTRYPOINT ["java", "-jar", "app.jar"]