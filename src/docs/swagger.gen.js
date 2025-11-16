// 첫 실행 및 수정 시 node src/docs/swagger.gen.js 입력
import swaggerAutogen from "swagger-autogen";

const doc = {
    info: {
        title: "UMC 9th",
        description: "Node.js Study",
    },
    host: "localhost:3000",
    schemes: ["http"],
};

const outputFile = "./src/docs/swagger-output.json";    // 생성될 파일
const endpointsFiles = ["./src/index.js"];  // 스캔 시작 지점

swaggerAutogen()(outputFile, endpointsFiles, doc);
