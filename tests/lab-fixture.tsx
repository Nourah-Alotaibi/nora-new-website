// Isolated visual/interaction fixture. Never imported by the production app.
import React from "react";
import { createRoot } from "react-dom/client";
import Workspace from "../client/src/lab/Workspace";
import "../client/src/lab/lab.css";
const nora = "11111111-1111-4111-8111-111111111111";
const records: any[] = [
  [
    "case",
    "The tiny robot experiment",
    "Could we build a little desk companion?",
    "sage",
    "doing",
  ],
  [
    "note",
    "Give it a little personality",
    "Maybe it gets sleepy when the room goes quiet.",
    "butter",
    "idea",
  ],
  [
    "task",
    "Sketch three expressions",
    "Curious, focused, and very excited.",
    "rose",
    "doing",
  ],
].map((r, i) => ({
  id: String(i + 1),
  kind: r[0],
  title: r[1],
  body: r[2],
  color: r[3],
  status: r[4],
  url: "",
  due_date: "2026-09-24",
  parent_id: null,
  created_by: nora,
  updated_by: nora,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  version: 1,
  deleted: false,
}));
const connections: any[] = [];
const client: any = {
  from(table: string) {
    let rows =
      table === "lab_items"
        ? records
        : table === "lab_edges"
          ? connections
          : [
              { user_id: nora, username: "nora" },
              { user_id: "sara-id", username: "sara" },
            ];
    let conditions: any[] = [];
    let operation = "read",
      value: any;
    const builder: any = {
      select() {
        return builder;
      },
      eq(k: string, v: any) {
        conditions.push([k, v]);
        return builder;
      },
      order() {
        return builder;
      },
      insert(v: any) {
        operation = "insert";
        value = v;
        return builder;
      },
      update(v: any) {
        operation = "update";
        value = v;
        return builder;
      },
      then(resolve: any) {
        let result = rows.filter(r => conditions.every(([k, v]) => r[k] === v));
        if (operation === "insert") {
          const row = {
            id: crypto.randomUUID(),
            created_by: nora,
            updated_by: nora,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            version: 1,
            deleted: false,
            ...value,
          };
          rows.unshift(row);
          result = [row];
        }
        if (operation === "update")
          result.forEach(r =>
            Object.assign(r, value, { version: (r.version || 0) + 1 })
          );
        return Promise.resolve(
          resolve({ data: result.map(r => ({ ...r })), error: null })
        );
      },
    };
    return builder;
  },
  channel() {
    const channel = {
      on() {
        return channel;
      },
      subscribe(cb: any) {
        cb("SUBSCRIBED");
        return channel;
      },
    };
    return channel;
  },
  removeChannel() {},
  auth: {
    getSession: async () => ({
      data: { session: { access_token: "fixture" } },
    }),
    signOut: async () => ({ error: null }),
  },
};
function Fixture() {
  const [theme, setTheme] = React.useState("light");
  return (
    <div className="secret-lab" data-theme={theme}>
      <header className="lab-site-header">
        <span className="lab-wordmark">nourah✳</span>
        <b>LOCAL TEST FIXTURE · SAMPLE DATA</b>
        <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
          Toggle test theme
        </button>
      </header>
      <Workspace
        client={client}
        session={{ user: { id: nora } } as any}
        member={{ user_id: nora, username: "nora" }}
        onAccessLost={() => {}}
      />
    </div>
  );
}
createRoot(document.getElementById("root")!).render(<Fixture />);
