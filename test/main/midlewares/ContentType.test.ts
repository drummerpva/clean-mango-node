import request from "supertest";
import app from "../../../src/main/config/app";
describe("ContentType", () => {
  test("Shoul return content-type as json", async () => {
    app.get("/testContentType", (req, res) => {
      res.send("");
    });

    await request(app).get("/testContentType").expect("content-type", /json/);
  });
  test("Shoul return xml content type when forced", async () => {
    app.get("/testContentTypeXML", (req, res) => {
      res.type("xml");
      res.send("");
    });

    await request(app).get("/testContentTypeXML").expect("content-type", /xml/);
  });
});
