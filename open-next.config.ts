import { defineCloudflareConfig } from "@opennextjs/cloudflare/config";

export default defineCloudflareConfig({
  kvNamespaces: [
    {
      binding: "YIMA_LEADS",
      id: "79c7a651e94d42bd88cc125be8940373",
    },
  ],
});
