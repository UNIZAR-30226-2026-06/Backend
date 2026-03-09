const axios = require("axios");

const API = "http://localhost:3000/api/v1";

let token = null;
let username = "tester" + Date.now();
let email = username + "@mail.com";
let password = "123456";

async function safeRequest(method, url, data = {}) {
  try {
    const res = await axios({
      method,
      url: `${API}${url}`,
      data,
      headers: token ? { Authorization: `Bearer ${token}` } : undefined
    });
    console.log(`✅ ${method.toUpperCase()} ${url}:`, res.data);
    return res.data;
  } catch (err) {
    if (err.response) {
      if (err.response.status === 404) {
        console.log(`❌ ${method.toUpperCase()} ${url} → NOT FOUND (404)`);
      } else if (err.response.status === 401) {
        console.log(`❌ ${method.toUpperCase()} ${url} → UNAUTHORIZED (401)`);
      } else {
        console.log(`❌ ${method.toUpperCase()} ${url} → STATUS ${err.response.status}`, err.response.data);
      }
    } else {
      console.log(`❌ ${method.toUpperCase()} ${url} → ERROR`, err.message);
    }
  }
  return null;
}

async function testRegister() {
  console.log("\n=== AUTH REGISTER ===");
  const data = await safeRequest("post", "/auth/register", {
    nombre_usuario: username,
    correo: email,
    password: password
  });
  if (data && data.token) token = data.token;
}

async function testLogin() {
  console.log("\n=== AUTH LOGIN ===");
  const data = await safeRequest("post", "/auth/login", {
    correo: email,
    password: password
  });
  if (data && data.token) token = data.token;
}

async function testProfile() {
  console.log("\n=== USER PROFILE ===");
  await safeRequest("get", "/usuarios/profile");
}

async function testAvatar() {
  console.log("\n=== CHANGE AVATAR ===");
  await safeRequest("post", "/usuarios/avatar", { avatar: "avatar1.png" });
}

async function testStyle() {
  console.log("\n=== CHANGE STYLE ===");
  await safeRequest("post", "/usuarios/style", { estilo: "dark" });
}

async function testChat() {
  console.log("\n=== CHAT MESSAGE ===");
  await safeRequest("post", "/chat/send", { mensaje: "Hola mundo" });
}

async function runTests() {
  console.log("=========== TEST ALL MODULES ===========");

  await testRegister();
  await testLogin();
  await testProfile();
  await testAvatar();
  await testStyle();
  await testChat();

  console.log("\n=========== TEST FINISHED ===========");
}

runTests();