import { CollectionConfig } from "payload/types";
import { isAdminOrFaculty } from "../access/isAdmin";

const Students: CollectionConfig = {
  slug: "students",
  access: {
    create: isAdminOrFaculty,
    update: isAdminOrFaculty,
    delete: isAdminOrFaculty,
    admin: isAdminOrFaculty,
  },
  admin: {
    useAsTitle: "studentId",
    description: "A student",
  },
  fields: [
    {
      name: "studentId",
      label: "Student ID",
      type: "number",
      unique: true,
      required: true,
    },
    {
      name: "number",
      type: "number",
      validate: (val, {}) => {
        if (val >= 10000000000) {
          return "Enter valid mobile number";
        }

        return true;
      },
      required: true,
    },
    { name: "dob", label: "Date Of Birth", type: "date", required: true },
    {
      name: "links",
      label: "Portfolio links",
      type: "array",
      fields: [
        { name: "title", type: "text", required: true },
        { name: "description", type: "text", required: false },
        { name: "url", type: "text", required: true },
      ],
      required: false,
    },
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      hasMany: false,
      unique: true,
      required: true,
    },
    {
      name: "courses",
      type: "relationship",
      relationTo: "courses",
      hasMany: true,
      required: true,
    },
    { name: "photo", type: "upload", relationTo: "media", required: true },
  ],
};

export default Students;
