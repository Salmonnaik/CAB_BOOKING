const app = require("./src/app");

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Cab Assignment System API running on http://localhost:${PORT}`);
});

