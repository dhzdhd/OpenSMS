import path from "path";

import { payloadCloud } from "@payloadcms/plugin-cloud";
import { postgresAdapter } from "@payloadcms/db-postgres";
// import { webpackBundler } from "@payloadcms/bundler-webpack";
import { viteBundler } from "@payloadcms/bundler-vite";
import { slateEditor } from "@payloadcms/richtext-slate";
import { buildConfig } from "payload/config";

import Users from "./collections/Users";
import Students from "./collections/Students";
import Media from "./collections/Media";
import Courses from "./collections/Courses";
import { Metadata } from "./globals/Metadata";
import Announcements from "./collections/Announcements";
import Fees from "./collections/Fees";
import Attendances from "./collections/Attendances";
import Grades from "./collections/Grades";
import Faculties from "./collections/Faculties";

export default buildConfig({
  admin: {
    user: Users.slug,
    bundler: viteBundler(),
  },
  cors: "*",
  editor: slateEditor({}),
  collections: [
    Users,
    Announcements,
    Attendances,
    Courses,
    Faculties,
    Fees,
    Grades,
    Students,
    Media,
  ],
  globals: [Metadata],
  typescript: {
    outputFile: path.resolve(__dirname, "payload-types.ts"),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, "generated-schema.graphql"),
  },
  plugins: [payloadCloud()],
  db: postgresAdapter({
    idType: "uuid",
    pool: {
      connectionString: process.env.DATABASE_URI,
    },
  }),
});
