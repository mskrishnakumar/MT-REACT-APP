const { TableClient } = require("@azure/data-tables");

module.exports = async function (context, req) {
  context.log("🔥 TODOS FUNCTION HIT", req.method);

  try {
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

      context.res = {
        status: 200,
        headers: { "Content-Type": "application/json" },
        body: todos,
      };

    } else if (req.method === "POST") {
      const todo = req.body;

      context.log("Incoming todo:", todo);

      if (!todo || !todo.id) {
        context.res = { status: 400, body: "Invalid todo payload" };
        return;
      }

      await table.upsertEntity({
        PartitionKey: userId,
        RowKey: String(todo.id),
        text: todo.text,
        completed: !!todo.completed,
      });

      context.res = { status: 200 };

    } else if (req.method === "DELETE") {
      const { id } = req.body;

      if (!id) {
        context.res = { status: 400, body: "Missing id" };
        return;
      }

      await table.deleteEntity(userId, String(id));
      context.res = { status: 200 };

    } else {
      context.res = { status: 405 };
    }

  } catch (err) {
    context.log("❌ TODOS FUNCTION ERROR:", err);
    context.res = { status: 500, body: "Internal Server Error" };
  }
};
