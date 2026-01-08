const crypto = require("crypto");
// Polyfill for Azure Functions runtime
global.crypto = crypto;

const { TableClient, odata } = require("@azure/data-tables");

const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
const tableName = "todos";

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidEmail(email) {
  return typeof email === "string" && EMAIL_REGEX.test(email.trim());
}

module.exports = async function (context, req) {
  // -----------------------------
  // Get email from request
  // -----------------------------
  const email =
    req.query.email ||
    req.body?.email;

  if (!email) {
    context.res = {
      status: 400,
      body: "Email is required"
    };
    return;
  }

  if (!isValidEmail(email)) {
    context.res = {
      status: 400,
      body: "Invalid email format"
    };
    return;
  }

  const partitionKey = email.toLowerCase().trim();

  // -----------------------------
  // Table client
  // -----------------------------
  const tableClient = TableClient.fromConnectionString(
    connectionString,
    tableName
  );

  // Ensure table exists
  await tableClient.createTable().catch(() => {});

  // -----------------------------
  // GET todos
  // -----------------------------
  if (req.method === "GET") {
    const todos = [];

    const entities = tableClient.listEntities({
      queryOptions: {
        filter: odata`PartitionKey eq ${partitionKey}`
      }
    });

    for await (const entity of entities) {
      todos.push({
        id: entity.rowKey,
        text: entity.text,
        completed: entity.completed
      });
    }

    // Latest first
    todos.reverse();

    context.res = {
      status: 200,
      body: todos
    };
    return;
  }

  // -----------------------------
  // POST (add or update todo)
  // -----------------------------
  if (req.method === "POST") {
    const { id, text, completed } = req.body;

    if (!id || !text) {
      context.res = {
        status: 400,
        body: "Todo id and text are required"
      };
      return;
    }

    const entity = {
      partitionKey,
      rowKey: id,
      text,
      completed: !!completed
    };

    await tableClient.upsertEntity(entity, "Replace");

    context.res = {
      status: 200
    };
    return;
  }

  // -----------------------------
  // DELETE todo
  // -----------------------------
  if (req.method === "DELETE") {
    const { id } = req.body;

    if (!id) {
      context.res = {
        status: 400,
        body: "Todo id is required"
      };
      return;
    }

    await tableClient.deleteEntity(partitionKey, id);

    context.res = {
      status: 200
    };
    return;
  }

  // -----------------------------
  // Method not allowed
  // -----------------------------
  context.res = {
    status: 405,
    body: "Method not allowed"
  };
};
