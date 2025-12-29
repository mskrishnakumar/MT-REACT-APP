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

    context.log(
    "Storage conn exists:",
    !!process.env.AZURE_STORAGE_CONNECTION_STRING
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

    } } else if (req.method === "POST") {
  try {
    const todo = req.body;

    context.log("Incoming body:", todo);

    if (!todo || typeof todo !== "object") {
      context.res = {
        status: 400,
        body: "Request body missing or invalid",
      };
      return;
    }

    if (!todo.id || !todo.text) {
      context.res = {
        status: 400,
        body: "Todo must have id and text",
      };
      return;
    }

    await table.upsertEntity({
      PartitionKey: userId,
      RowKey: String(todo.id),
      text: String(todo.text),
      completed: !!todo.completed,
    });

    context.res = {
      status: 200,
      body: { ok: true },
    };

  } catch (err) {
    context.log("❌ POST failed:", err);
    context.res = {
      status: 500,
      body: "POST failed",
    };
  }
}


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
