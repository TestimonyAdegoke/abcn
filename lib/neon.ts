import { createClient } from "@neondatabase/neon-js";

const AUTH_URL =
  "https://ep-damp-resonance-b19qplov.neonauth.c-5.eu-central-1.aws.neon.tech/abcn/auth";
const DATA_API_URL =
  "https://ep-damp-resonance-b19qplov.apirest.c-5.eu-central-1.aws.neon.tech/abcn/rest/v1";

export const neon = createClient(
  {
    auth: { url: AUTH_URL },
    dataApi: { url: DATA_API_URL },
  },
  {
    auth: { allowAnonymous: true },
  }
);
