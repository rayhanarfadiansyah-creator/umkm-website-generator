
import { getCloudflareContext } from "@opennextjs/cloudflare";

export function getDb() {
    const { env } = getCloudflareContext();

    return env.umkm_website_generator_db;
}
