FROM openjdk:17
VOLUME /tmp

ARG JAR_FILE=target/*.jar
COPY ${JAR_FILE} /app/app.jar
COPY jtracker-adminsdk.json /app/config/jtracker-adminsdk.json
WORKDIR /app

ENTRYPOINT ["java", "-jar", "app.jar"]