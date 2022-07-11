import request from "supertest";
import app from "../../../src/main/config/app";
describe("BodyParser", () => {
  test("Shoul parse body as json", async () => {
    app.post("/testBodyParser", (req, res) => {
      res.send(req.body);
    });

    await request(app)
      .post("/testBodyParser")
      .send({ name: "Douglas" })
      .expect({ name: "Douglas" });
  });
});
