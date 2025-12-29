global.crypto = require("crypto");
const { TableClient } = require("@azure/data-tables");

module.exports = async function (context, req) {
  const user = context.clientPrincipal;

  if (!user) {
    context.res = { status: 401 };
    return;
  }

  const table = TableClient.fromConnectionString(
    process.env.AZURE_STORAGE_CONNECTION_STRING,
    "Todos"
  );

  const userId = user.userId;

  // GET todos
  if (req.method === "GET") {
    const todos = [];

    for await (const e of table.listEntities({
      queryOptions: { filter: `PartitionKey eq '${userId}'` },
    })) {
      todos.push({
        id: e.RowKey,
        text: e.text,
        completed: e.completed,
      });
    }

    context.res = { body: todos };
  }

  // POST add/update todo
  if (req.method === "POST") {
    const todo = req.body;

    context.log("Incoming todo:", req.body);

    await table.upsertEntity({
      PartitionKey: userId,
      RowKey: todo.id,
      text: todo.text,
      completed: todo.completed,
    });

    context.res = { status: 200 };
  }

  // DELETE todo
  if (req.method === "DELETE") {
    const id = context.bindingData.id;
    await table.deleteEntity(userId, id);
    context.res = { status: 200 };
  }
};
