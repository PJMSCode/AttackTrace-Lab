const form = document.getElementById("sql-lab-form");
const input = document.getElementById("sql-input");
const appResponse = document.getElementById("app-response");
const generatedLog = document.getElementById("generated-log");

const pokemonTable = [
  { pokedex_number: 1, name: "Bulbasaur", type_1: "Grass", type_2: "Poison", base_stat_total: 318 },
  { pokedex_number: 4, name: "Charmander", type_1: "Fire", type_2: null, base_stat_total: 309 },
  { pokedex_number: 7, name: "Squirtle", type_1: "Water", type_2: null, base_stat_total: 314 },
  { pokedex_number: 25, name: "Pikachu", type_1: "Electric", type_2: null, base_stat_total: 320 },
  { pokedex_number: 94, name: "Gengar", type_1: "Ghost", type_2: "Poison", base_stat_total: 500 },
  { pokedex_number: 130, name: "Gyarados", type_1: "Water", type_2: "Flying", base_stat_total: 540 },
  { pokedex_number: 149, name: "Dragonite", type_1: "Dragon", type_2: "Flying", base_stat_total: 600 },
  { pokedex_number: 150, name: "Mewtwo", type_1: "Psychic", type_2: null, base_stat_total: 680 },
  { pokedex_number: 448, name: "Lucario", type_1: "Fighting", type_2: "Steel", base_stat_total: 525 },
  { pokedex_number: 658, name: "Greninja", type_1: "Water", type_2: "Dark", base_stat_total: 530 }
];

const fakeSensitiveTables = {
  admin_users: [
    { id: 1, username: "professor_oak", role: "database_admin", password_hash: "sha256$fake$7f3a9c2e" },
    { id: 2, username: "rocket_operator", role: "readonly_admin", password_hash: "sha256$fake$91bd02aa" },
    { id: 3, username: "lonava_admin", role: "security_admin", password_hash: "sha256$fake$44ab19ff" }
  ],
  api_tokens: [
    { id: 1, service: "pokemon_internal_api", token: "pk_live_FAKE_TOKEN_DO_NOT_USE" },
    { id: 2, service: "lonava_detection_api", token: "lv_test_FAKE_TOKEN_DO_NOT_USE" }
  ]
};

const fieldInfo = {
  timestamp: {
    title: "Timestamp",
    description: "Indicates when the event occurred. Critical for building timelines during incident response and correlating events across systems."
  },

  source_ip: {
    title: "Source IP",
    description: "Represents where the request originated. Used for identifying attackers, blocking malicious hosts, and detecting repeated behavior."
  },

  username: {
    title: "Username",
    description: "Shows which account was used. Helps determine whether an attack is anonymous or tied to a compromised account."
  },

  event_type: {
    title: "Event Type",
    description: "Categorizes the activity. Allows detection systems to group similar threats and trigger specific alerts."
  },

  route: {
    title: "Route",
    description: "Indicates the endpoint being targeted. Helps identify which parts of an application are under attack."
  },

  http_method: {
    title: "HTTP Method",
    description: "Shows how the request was made (GET, POST, etc.). Useful for identifying unusual behavior patterns."
  },

  payload: {
    title: "Payload",
    description: "The exact input provided by the user. This is often the most important field for identifying attack techniques."
  },

  result_count: {
    title: "Result Count",
    description: "Shows how many records were returned. A sudden increase may indicate data exposure."
  },

  severity: {
    title: "Severity",
    description: "Indicates how dangerous the activity is. Helps analysts prioritize what to investigate first."
  },

  mitre_attack: {
    title: "MITRE ATT&CK Mapping",
    description: "Maps the behavior to a known attack technique. Helps standardize detection and reporting across organizations."
  },

  status: {
    title: "Status",
    description: "Shows whether the request was allowed, blocked, or exploited. Important for understanding impact."
  },

  detection_reason: {
    title: "Detection Reason",
    description: "Explains why the system flagged the event. Helps analysts validate and improve detection logic."
  }
};

document.querySelectorAll(".log-field").forEach(field => {
    field.addEventListener("click", () => {
      const key = field.dataset.field;
      const info = fieldInfo[key];

      document.getElementById("field-title").textContent = info.title;
      document.getElementById("field-description").textContent = info.description;
    });
});

function analyzeSqlInput(query) {
  const lowered = query.toLowerCase();

  if (lowered.includes("union select")) {
    return { name: "UNION SELECT pattern", severity: "high" };
  }

  if (lowered.includes("' or '1'='1") || lowered.includes("or 1=1")) {
    return { name: "SQL tautology pattern", severity: "high" };
  }

  if (query.includes("--") || query.includes("#")) {
    return { name: "SQL comment operator", severity: "medium" };
  }

  if (
    query.includes(";") &&
    (lowered.includes("drop") ||
      lowered.includes("delete") ||
      lowered.includes("update") ||
      lowered.includes("insert"))
  ) {
    return { name: "Stacked query attempt", severity: "high" };
  }

  return null;
}

function buildEvent(query, match, resultCount, status) {
  return {
    timestamp: new Date().toISOString(),
    source_ip: "client_side_demo",
    username: "guest",
    event_type: match ? "sql_injection_attempt" : "pokemon_search",
    route: "/search",
    http_method: "GET",
    payload: query,
    result_count: resultCount,
    severity: match ? match.severity : "informational",
    mitre_attack: match ? "T1190" : "none",
    status: status,
    detection_reason: match ? match.name : "No SQL injection pattern detected"
  };
}

function renderSqlTable(rows, tableName) {
  if (rows.length === 0) {
    return `<p>No rows returned.</p>`;
  }

  const columns = Object.keys(rows[0]);

  return `
    <div class="sql-output">
      <p class="sql-table-name">table: ${tableName}</p>
      <table>
        <thead>
          <tr>
            ${columns.map((column) => `<th>${column}</th>`).join("")}
          </tr>
        </thead>
        <tbody>
          ${rows
            .map(
              (row) => `
              <tr>
                ${columns
                  .map((column) => `<td>${row[column] === null ? "NULL" : row[column]}</td>`)
                  .join("")}
              </tr>
            `
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `;
}

function runNormalPokemonSearch(query) {
  const lowered = query.toLowerCase();

  return pokemonTable.filter((pokemon) => {
    return (
      pokemon.name.toLowerCase().includes(lowered) ||
      pokemon.type_1.toLowerCase() === lowered ||
      (pokemon.type_2 && pokemon.type_2.toLowerCase() === lowered)
    );
  });
}

function runVulnerableSqlSimulation(query, match) {
  const lowered = query.toLowerCase();

  if (lowered.includes("union select")) {
    return {
      description: "UNION SELECT simulated exposure. The query returned rows from a table the user should not access.",
      tables: [
        {
          name: "pokemon",
          rows: pokemonTable.slice(0, 5)
        },
        {
          name: "admin_users",
          rows: fakeSensitiveTables.admin_users
        }
      ]
    };
  }

  if (lowered.includes("' or '1'='1") || lowered.includes("or 1=1")) {
    return {
      description: "Tautology simulated exposure. The WHERE clause evaluated as true and returned all Pokémon rows.",
      tables: [
        {
          name: "pokemon",
          rows: pokemonTable
        }
      ]
    };
  }

  if (query.includes("--") || query.includes("#")) {
    return {
      description: "Comment operator simulated exposure. The rest of the query was ignored.",
      tables: [
        {
          name: "pokemon",
          rows: pokemonTable.slice(0, 8)
        }
      ]
    };
  }

  if (query.includes(";")) {
    return {
      description: "Stacked query simulated. The application accepted multiple SQL statements.",
      tables: [
        {
          name: "api_tokens",
          rows: fakeSensitiveTables.api_tokens
        }
      ]
    };
  }

  return {
    description: "Suspicious SQL pattern detected.",
    tables: []
  };
}

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const query = input.value.trim();

  if (!query) {
    appResponse.innerHTML = "<p>No query submitted. Enter a Pokémon name, type, or SQL injection payload.</p>";
    generatedLog.textContent = "No event generated yet.";
    return;
  }

  const match = analyzeSqlInput(query);

  if (match) {
    const vulnerableResult = runVulnerableSqlSimulation(query, match);
    const exposedRowCount = vulnerableResult.tables.reduce(
      (total, table) => total + table.rows.length,
      0
    );

    appResponse.innerHTML = `
      <div class="vulnerable-response">
        <h3>Vulnerable Application Response</h3>
        <p>${vulnerableResult.description}</p>
        <p class="fake-query">
          SELECT pokedex_number, name, type_1, type_2, base_stat_total
          FROM pokemon
          WHERE name LIKE '%${query}%';
        </p>
        ${vulnerableResult.tables
          .map((table) => renderSqlTable(table.rows, table.name))
          .join("")}
      </div>
    `;

    generatedLog.textContent = JSON.stringify(
      buildEvent(query, match, exposedRowCount, "exploited"),
      null,
      2
    );

    return;
  }

  const results = runNormalPokemonSearch(query);

  appResponse.innerHTML = `
    <p class="fake-query">
      SELECT pokedex_number, name, type_1, type_2, base_stat_total
      FROM pokemon
      WHERE name LIKE '%${query}%'
      OR type_1 = '${query}'
      OR type_2 = '${query}';
    </p>
    ${renderSqlTable(results, "pokemon")}
  `;

  generatedLog.textContent = JSON.stringify(
    buildEvent(query, null, results.length, "allowed"),
    null,
    2
  );

});