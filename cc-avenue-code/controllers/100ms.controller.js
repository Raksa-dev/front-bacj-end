var jwt = require("jsonwebtoken");
var uuid4 = require("uuid4");
const { request } = require("../helper");

const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const client = new S3Client({
  region: process.env.S3_REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SCERATE_CODE,
  },
});

class msController {
  static async handleRoomCode(req, res, next) {
    try {
      var app_access_key = "64c096d691c023b4e2d76e33";
      var app_secret =
        "fb3XEb43-X5w06vS8VjLaSp0BUJxCZd1WFolZZGG7WQsCYkT7hNf3n21s_I_eWsQYFlp_FgC5ac-zRelGeVjAYaUo067Lx7vRDPI4N3t783MFD-meZwkK8UtltWLuCTMR339klwlYAq389_8s6CgAPHYRS-qGTVycRIaMoVYHLI=";
      var payload = {
        access_key: app_access_key,
        type: "management",
        version: 2,
        iat: Math.floor(Date.now() / 1000),
        nbf: Math.floor(Date.now() / 1000),
      };
      const token = await jwt.sign(payload, app_secret, {
        algorithm: "HS256",
        expiresIn: "24h",
        jwtid: uuid4(),
      });
      // template_id: "64c0a8c9e30a25716105a5fd";
      const data = await request(
        {
          method: "POST",
          hostname: "api.100ms.live",
          path: "/v2/rooms",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
        { name: req.body?.name }
      ).then((dataRes) => {
        return dataRes;
      });
      if (data) {
        const roomCode = await request({
          method: "POST",
          hostname: "api.100ms.live",
          path: `/v2/room-codes/room/${data?.id}`,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }).then((dataRes) => {
          return dataRes;
        });
        res.send({ roomCode });
      }
    } catch (err) {
      next(err);
    }
  }
  static async uploadToS3(req, res, next) {
    try {
      const file = req.files && req.files.file;

      if (!file) {
        return res.status(400).send("No file uploaded.");
      }
      // Define S3 upload parameters
      const params = {
        Bucket: "raksa-web", // Replace with your S3 bucket name
        Key: file.name,
        Body: file.data,
        ACL: "public-read", // Set the access control list for the file
      };
      const data = await client.send(new PutObjectCommand(params));
      // Respond with the S3 URL
      const s3Url = `https://${params.Bucket}.s3.${process.env.S3_REGION}.amazonaws.com/${params.Key}`;
      res.status(200).send({ url: s3Url });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = msController;
