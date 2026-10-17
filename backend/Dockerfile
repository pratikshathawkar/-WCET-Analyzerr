
FROM eclipse-temurin:21-jdk

WORKDIR /app

COPY . .

RUN test -f mysql-connector-j-26.7.0.jar

RUN find src -name "*.java" ! -path "src/main.java" ! -path "src/db/DatabaseTest.java" > sources.txt

RUN mkdir -p out && javac -cp "mysql-connector-j-26.7.0.jar" -d out @sources.txt

EXPOSE 8080

CMD ["java", "-cp", "out:mysql-connector-j-26.7.0.jar", "api.WCETServer"]
