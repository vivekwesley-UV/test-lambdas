const AWS = require("aws-sdk");
const _ = require("lodash");

AWS.config.update({ region: "ap-south-1" });
const BUCKET_NAME = "www.ultraviolette.com";
const ROOT = "smarttech/" 
// original list of folders.
// const folders = ["violette", "mta", "pod", "in_flight", "lockdown", "app", "console", "park" ]; 
// removed empty folders from this [folders] array.
const folders = ["pod"]; 
const FILE_NAME = "smarttech_assets_paths.json";
const s3 = new AWS.S3();

var final_json = {};

exports.handler = async (event, context) => {
  const computed_paths = get_paths(folders);

  for (let i in computed_paths) {
    await get_object_urls(computed_paths[i]);
  }

  let reconstructed = {
    base_url: `https://d2atk76x06g5eh.cloudfront.net/${ROOT}`,
    image_config: final_json,
  };

  return upload_to_s3(reconstructed);
};

async function upload_to_s3(reconstructed) {
  const uploadedImage = await s3
    .upload({
      Bucket: BUCKET_NAME,
      Key: FILE_NAME,
      Body: JSON.stringify(reconstructed, null, 4),
    })
    .promise();

    console.log("uploadedImage: ", uploadedImage)

  return uploadedImage.Location;
}

function get_paths(folders) {
  const paths = folders.map((f) => {
    return ROOT + f + "/";
  });

  return _.flatten(paths);
}

async function get_object_urls(computed_path) {
  const params = {
    Bucket: BUCKET_NAME,
    Delimiter: "/",
    Prefix: computed_path,
  };

  const data = await s3.listObjects(params).promise();

  const result = data.Contents.map((i) => i.Key.replace(ROOT, ""));
  const paths = data.CommonPrefixes.map((i) => i.Prefix);
  final_json[`${computed_path.replace(ROOT, "").slice(0, -1)}`] = result;

  if (paths.length > 0) {
    for (let j in paths) {
      const params = {
        Bucket: BUCKET_NAME,
        Delimiter: "/",
        Prefix: paths[j],
      };

      const data = await s3.listObjects(params).promise();

      const result = data.Contents.map((i) => i.Key.replace(ROOT, ""));

      final_json[`${paths[j].replace(ROOT, "").slice(0, -1)}`] = result;
    }
  }
}