#!/usr/bin/env node
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const path = require("path");

const API_URL = "http://localhost:4000/api";
let uploadedMediaId = null;

const testEndpoints = async () => {
  try {
    // 1. Test server health
    console.log("\n1. Testing server health...");
    const healthRes = await axios.get(`${API_URL}/status`);
    console.log("✅ Server health check passed:", healthRes.data);

    // 2. Test file upload
    console.log("\n2. Testing media upload...");
    const formData = new FormData();
    const testImage = path.join(__dirname, "test-image.jpg");

    if (!fs.existsSync(testImage)) {
      throw new Error(
        "test-image.jpg not found. Please ensure it exists in the project root."
      );
    }

    formData.append("file", fs.createReadStream(testImage));

    const uploadRes = await axios.post(`${API_URL}/media`, formData, {
      headers: formData.getHeaders(),
    });

    uploadedMediaId = uploadRes.data._id;
    console.log("✅ Upload successful. Media ID:", uploadedMediaId);

    // 3. Test get all media
    console.log("\n3. Testing get all media...");
    const getAllRes = await axios.get(`${API_URL}/media`);
    console.log(`✅ Retrieved ${getAllRes.data.total} media items`);

    // 4. Test get single media
    console.log("\n4. Testing get single media...");
    const getOneRes = await axios.get(`${API_URL}/media/${uploadedMediaId}`);
    console.log("✅ Successfully retrieved single media");

    // 5. Test like media
    console.log("\n5. Testing like functionality...");
    const likeRes = await axios.post(
      `${API_URL}/media/${uploadedMediaId}/like`
    );
    console.log("✅ Like successful. Current likes:", likeRes.data.likes);

    // 6. Test unlike media
    console.log("\n6. Testing unlike functionality...");
    const unlikeRes = await axios.post(
      `${API_URL}/media/${uploadedMediaId}/unlike`
    );
    console.log("✅ Unlike successful. Current likes:", unlikeRes.data.likes);

    // 7. Test media deletion
    console.log("\n7. Testing media deletion...");
    const deleteRes = await axios.delete(`${API_URL}/media/${uploadedMediaId}`);
    console.log("✅ Delete successful:", deleteRes.data.message);

    // Verify deletion
    console.log("\n8. Verifying deletion...");
    try {
      await axios.get(`${API_URL}/media/${uploadedMediaId}`);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log("✅ Deletion verified: Media no longer exists");
      }
    }

    console.log("\n✅ All tests completed successfully!");
  } catch (error) {
    console.error("\n❌ Test failed:", {
      endpoint: error.config?.url || "Unknown endpoint",
      method: error.config?.method || "Unknown method",
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
    });
    process.exit(1);
  }
};

// Start the server first, then run:
console.log("🚀 Starting API tests...");
testEndpoints();
