import request from "supertest";
import app from "../../../src/main/config/app";
describe("CORS", () => {
  test("Shoul enable CORS", async () => {
    app.get("/testCors", (req, res) => {
      res.send();
    });

    await request(app)
      .get("/testCors")
      .expect("access-controll-allow-origin", "*")
      .expect("access-controll-allow-methods", "*")
      .expect("access-controll-allow-headers", "*");
  });
});
